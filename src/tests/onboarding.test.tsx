// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('howler', () => {
  class FakeHowl {
    play = vi.fn();
    stop = vi.fn();
    fade = vi.fn();
    unload = vi.fn();
    constructor(_options: unknown) { /* never reached: settings keep effects/music disabled and audio never unlocks */ }
  }
  return { Howl: FakeHowl, Howler: { ctx: { state: 'running', resume: vi.fn() } } };
});

import { LandingPage } from '../features/onboarding/LandingPage';
import { RecruitPage } from '../features/onboarding/RecruitPage';
import { GameProvider } from '../state/GameContext';
import { STORAGE_KEY } from '../services/progress';

const roots: Root[] = [];
afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.replaceChildren();
});

function seed(overrides: Record<string, unknown> = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    schemaVersion: 1, characterId: null, nextBattleOrder: 1, battleBestHalfUnits: {},
    totalEarnedHalfUnits: 0, walletHalfUnits: 0, completedBonusIds: [], purchasedCosmeticIds: [],
    equippedCosmetics: { head: null, armor: null, movement: null, emblem: null }, unlockedPowerIds: [],
    appliedTransactionIds: [], bonusSelections: {},
    settings: { musicEnabled: false, effectsEnabled: false, reducedMotion: true },
    updatedAt: new Date().toISOString(),
    ...overrides,
  }));
}

beforeEach(() => seed());

async function render(tree: React.ReactElement) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  await act(async () => { root.render(tree); });
  return host;
}

function clickByText(host: HTMLElement, text: string) {
  const target = Array.from(host.querySelectorAll('button')).find((button) => button.textContent?.includes(text));
  if (!target) throw new Error(`button not found for text: ${text}`);
  act(() => { target.click(); });
}

describe('journey routing: the prompt-skills explanation only shows on a genuinely new journey', () => {
  it('starting a new journey from the landing page routes through /recruit (the briefing)', async () => {
    const host = await render(
      <MemoryRouter initialEntries={['/']}>
        <GameProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/recruit" element={<div data-testid="on-recruit">on-recruit</div>} />
          </Routes>
        </GameProvider>
      </MemoryRouter>,
    );
    clickByText(host, 'התחילו מסע');
    await act(async () => undefined);
    expect(host.textContent).toContain('on-recruit');
  });

  it('"המשך משימה" (continue) for an existing journey goes straight to /map — never back through /recruit', async () => {
    seed({ characterId: 'hero', nextBattleOrder: 5, battleBestHalfUnits: { battle_01: 10 } });
    const host = await render(
      <MemoryRouter initialEntries={['/']}>
        <GameProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<div data-testid="on-map">on-map</div>} />
            <Route path="/recruit" element={<div data-testid="on-recruit">on-recruit</div>} />
          </Routes>
        </GameProvider>
      </MemoryRouter>,
    );
    expect(host.textContent).toContain('המשך משימה');
    clickByText(host, 'המשך משימה');
    await act(async () => undefined);
    expect(host.textContent).toContain('on-map');
    expect(host.textContent).not.toContain('on-recruit');
  });
});

describe('RecruitPage briefing content and order', () => {
  it('presents exactly 3 short panels, in order: stakes/superpower -> what a prompt is (with a weak/better example) -> the skills preview, then routes to battle_01', async () => {
    const host = await render(
      <MemoryRouter initialEntries={['/recruit']}>
        <GameProvider>
          <Routes>
            <Route path="/recruit" element={<RecruitPage />} />
            <Route path="/battle/battle_01" element={<div data-testid="on-battle-01">on-battle-01</div>} />
          </Routes>
        </GameProvider>
      </MemoryRouter>,
    );

    // Character select still comes first.
    clickByText(host, 'גיבור־על');
    clickByText(host, 'לתדריך הגיוס');
    await act(async () => undefined);

    const dots = host.querySelector('.briefing__dots');
    expect(dots?.querySelectorAll('span')).toHaveLength(3);

    expect(host.querySelector('h1')?.textContent).toBe('קריאת חירום');
    clickByText(host, 'המשיכו');
    await act(async () => undefined);

    expect(host.querySelector('h1')?.textContent).toBe('מה זה פרומפט?');
    const panelText = host.querySelector('.speech p')?.textContent ?? '';
    expect(panelText).toContain('פרומפט הוא ההוראה');
    expect(panelText).toContain('חלש');
    expect(panelText).toContain('טוב יותר');
    clickByText(host, 'המשיכו');
    await act(async () => undefined);

    expect(host.querySelector('h1')?.textContent).toBe('כוח־העל שלכם');
    clickByText(host, 'לקרב ההדרכה');
    await act(async () => undefined);
    expect(host.textContent).toContain('on-battle-01');
  });

  it('every panel is short enough to scan quickly (no wall of text)', async () => {
    const host = await render(
      <MemoryRouter initialEntries={['/recruit']}>
        <GameProvider><Routes><Route path="/recruit" element={<RecruitPage />} /></Routes></GameProvider>
      </MemoryRouter>,
    );
    clickByText(host, 'גיבור־על');
    clickByText(host, 'לתדריך הגיוס');
    await act(async () => undefined);
    for (let i = 0; i < 3; i++) {
      const text = host.querySelector('.speech p')?.textContent ?? '';
      expect(text.length).toBeLessThan(220); // roughly a 10-15s read at a comfortable pace
      if (i < 2) { clickByText(host, 'המשיכו'); await act(async () => undefined); }
    }
  });
});

describe('reviewing the explanation again later (from Settings) never re-triggers character selection or battle_01', () => {
  it('opening /recruit with { briefingOnly: true } skips straight to the briefing and "closes" back instead of starting a battle', async () => {
    seed({ characterId: 'hero', nextBattleOrder: 9, battleBestHalfUnits: { battle_01: 10, battle_02: 8 } });
    const host = await render(
      <MemoryRouter initialEntries={['/settings', { pathname: '/recruit', state: { briefingOnly: true } }]} initialIndex={1}>
        <GameProvider>
          <Routes>
            <Route path="/settings" element={<div data-testid="on-settings">on-settings</div>} />
            <Route path="/recruit" element={<RecruitPage />} />
            <Route path="/battle/battle_01" element={<div data-testid="on-battle-01">on-battle-01</div>} />
          </Routes>
        </GameProvider>
      </MemoryRouter>,
    );

    // No character-selection step — straight to the briefing.
    expect(host.querySelector('[role="radiogroup"]')).toBeNull();
    expect(host.querySelector('h1')?.textContent).toBe('קריאת חירום');

    clickByText(host, 'המשיכו');
    await act(async () => undefined);
    clickByText(host, 'המשיכו');
    await act(async () => undefined);
    expect(host.querySelector('h1')?.textContent).toBe('כוח־העל שלכם');

    clickByText(host, 'הבנתי'); // review-mode label, not "לקרב ההדרכה"
    await act(async () => undefined);
    expect(host.textContent).toContain('on-settings');
    expect(host.textContent).not.toContain('on-battle-01');
  });
});
