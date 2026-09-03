// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
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

import { StandardBattle } from '../features/battles/BattlePage';
import { GameProvider } from '../state/GameContext';
import { STORAGE_KEY } from '../services/progress';
import { battleById } from '../content/battles';

const battle02 = battleById['battle_02']; // fog_district / בעצם, villain = מר בערך (bearach)

const roots: Root[] = [];
afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.replaceChildren();
});

beforeEach(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    schemaVersion: 1, characterId: 'hero', nextBattleOrder: 23, battleBestHalfUnits: {},
    totalEarnedHalfUnits: 0, walletHalfUnits: 0, completedBonusIds: [], purchasedCosmeticIds: [],
    equippedCosmetics: { head: null, armor: null, movement: null, emblem: null }, unlockedPowerIds: [],
    appliedTransactionIds: [], bonusSelections: {},
    settings: { musicEnabled: false, effectsEnabled: false, reducedMotion: true },
    updatedAt: new Date().toISOString(),
  }));
});

async function renderBattle(battleId: string) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  await act(async () => {
    root.render(<MemoryRouter><GameProvider><StandardBattle battleId={battleId} /></GameProvider></MemoryRouter>);
  });
  return host;
}

const wait = (ms: number) => act(async () => { await new Promise((resolve) => setTimeout(resolve, ms)); });

function clickByText(host: HTMLElement, text: string) {
  const target = Array.from(host.querySelectorAll('button')).find((button) => button.textContent?.includes(text));
  if (!target) throw new Error(`button not found for text: ${text}`);
  act(() => { target.click(); });
}

function villainSrc(host: HTMLElement): string | null {
  const img = host.querySelector('.villain-reaction img');
  return img ? img.getAttribute('src') : null;
}

describe('villain reaction cameo inside a regular battle', () => {
  it('shows the "watching" pose while composing, "reaction" on a wrong answer, and "defeated" on victory', async () => {
    const host = await renderBattle('battle_02');
    clickByText(host, 'התחילו סריקה'); // briefing -> compose
    await act(async () => undefined);
    expect(villainSrc(host)).toBe('/assets/characters/char_bearach_action.webp');

    // Wrong answer -> outcome (partial): "reaction" pose.
    const wrongLabel = battle02.choices.find((choice) => !battle02.correctChoiceIds.includes(choice.id))!.label;
    clickByText(host, wrongLabel);
    clickByText(host, 'שגרו ללופּ');
    await wait(400);
    expect(host.querySelector('h1')?.textContent).toBe('לופּ פירש את הבקשה');
    expect(villainSrc(host)).toBe('/assets/characters/char_bearach_reaction.webp');

    // Recover and win -> outcome (success) still shows no villain (only "defeated" belongs to victory)...
    clickByText(host, 'שפרו את הפרומפט'); // back to compose, correct pick retained
    await act(async () => undefined);
    const correctLabel = battle02.choices.find((choice) => battle02.correctChoiceIds.includes(choice.id))!.label;
    clickByText(host, correctLabel);
    clickByText(host, 'שגרו ללופּ');
    await wait(400);
    expect(host.querySelector('h1')?.textContent).toBe('המשימה הצליחה!');
    expect(host.querySelector('.villain-reaction')).toBeNull(); // success outcome: no villain cameo here, only on the dedicated victory screen

    // ...then the dedicated victory screen shows "defeated".
    clickByText(host, 'לניצחון');
    await act(async () => undefined);
    expect(host.querySelector('h1')?.textContent).toBe('חותמת משימה!');
    expect(villainSrc(host)).toBe('/assets/characters/char_bearach_defeat_exit.webp');
  });

  it('never overlaps the choice grid or the dispatch CTA — the cameo sits before them in the DOM, not inside sticky-action', async () => {
    const host = await renderBattle('battle_02');
    clickByText(host, 'התחילו סריקה');
    await act(async () => undefined);
    const villain = host.querySelector('.villain-reaction');
    const choiceGrid = host.querySelector('.choice-grid');
    const stickyAction = host.querySelector('.sticky-action');
    expect(villain).not.toBeNull();
    expect(stickyAction?.contains(villain)).toBe(false);
    expect(choiceGrid?.contains(villain)).toBe(false);
    // DOM order: villain cameo precedes the choice grid and the CTA (renders in the header area, above the interactive content).
    const position = villain!.compareDocumentPosition(choiceGrid!);
    // eslint-disable-next-line no-bitwise
    expect(Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
  });

  it('is purely decorative: empty alt text, never the only source of the outcome', async () => {
    const host = await renderBattle('battle_02');
    clickByText(host, 'התחילו סריקה');
    await act(async () => undefined);
    const img = host.querySelector('.villain-reaction img');
    expect(img?.getAttribute('alt')).toBe('');
  });
});

describe('training battle (battle_01) never shows a villain reaction', () => {
  it('renders no .villain-reaction element in any phase', async () => {
    const host = await renderBattle('battle_01');
    // briefing
    expect(host.querySelector('.villain-reaction')).toBeNull();
    clickByText(host, 'שגרו'); // battle_01's demo-first flow: "שגרו" leads to the outcome demo, not straight to compose
    await act(async () => undefined);
    expect(host.querySelector('.villain-reaction')).toBeNull();
  });
});
