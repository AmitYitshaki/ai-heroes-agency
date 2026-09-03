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

import { BonusPage } from '../features/bonus/BonusPage';
import { GameProvider } from '../state/GameContext';
import { STORAGE_KEY } from '../services/progress';
import { bonusTopics } from '../content/bonus';

const roots: Root[] = [];
afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.replaceChildren();
});

beforeEach(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    schemaVersion: 1, characterId: 'hero', nextBattleOrder: 23,
    battleBestHalfUnits: { battle_07: 8, battle_13: 8, battle_18: 8 },
    totalEarnedHalfUnits: 24, walletHalfUnits: 0, completedBonusIds: [], purchasedCosmeticIds: [],
    equippedCosmetics: { head: null, armor: null, movement: null, emblem: null }, unlockedPowerIds: [],
    appliedTransactionIds: [], bonusSelections: {},
    settings: { musicEnabled: false, effectsEnabled: false, reducedMotion: true },
    updatedAt: new Date().toISOString(),
  }));
});

async function renderVisit(visit: number) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[`/bonus/${visit}`]}>
        <GameProvider>
          <Routes><Route path="/bonus/:bonusId" element={<BonusPage />} /></Routes>
        </GameProvider>
      </MemoryRouter>,
    );
  });
  return host;
}

function unmount(host: HTMLElement) {
  const root = roots.pop();
  act(() => root?.unmount());
  host.remove();
}

function clickByText(host: HTMLElement, text: string) {
  const target = Array.from(host.querySelectorAll('button')).find((button) => button.textContent?.includes(text));
  if (!target) throw new Error(`button not found for text: ${text}`);
  act(() => { target.click(); });
}

function chosenTopicLabel(host: HTMLElement): string {
  const text = host.querySelector('.chosen-category')?.textContent ?? '';
  const topic = bonusTopics.find((candidate) => text.includes(candidate.label));
  if (!topic) throw new Error(`could not resolve a topic from chosen-category text: "${text}"`);
  return topic.label;
}

function answerCorrectly(host: HTMLElement) {
  const label = chosenTopicLabel(host);
  const topic = bonusTopics.find((candidate) => candidate.label === label)!;
  const question = topic.questions[0];
  clickByText(host, question.options[question.correct]);
  clickByText(host, 'בדקו תשובה');
}

function readProgress() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)!);
}

describe('bonus wheel anti-repeat and idempotency', () => {
  it('draws three distinct topics across the three journey visits, with no repeated topic or question', async () => {
    const labels: string[] = [];

    for (const visit of [1, 2, 3]) {
      const host = await renderVisit(visit);
      clickByText(host, 'בחרו נושא');
      await act(async () => undefined);
      labels.push(chosenTopicLabel(host));
      answerCorrectly(host);
      await act(async () => undefined);
      expect(host.querySelector('.bonus-success h2')?.textContent).toBe('בונוס הושלם!');
      unmount(host);
    }

    expect(new Set(labels).size).toBe(3);
    expect(labels.sort()).toEqual(bonusTopics.map((topic) => topic.label).sort());
  });

  it('a refresh (remount) after spinning returns the exact same topic and question — no re-draw', async () => {
    const first = await renderVisit(1);
    clickByText(first, 'בחרו נושא');
    await act(async () => undefined);
    const firstLabel = chosenTopicLabel(first);
    unmount(first);

    const second = await renderVisit(1);
    // Already revealed on mount — no spin button, straight to the same topic.
    expect(second.querySelector('button')?.textContent?.includes('בחרו נושא')).not.toBe(true);
    expect(chosenTopicLabel(second)).toBe(firstLabel);
    unmount(second);
  });

  it('replaying an already-completed visit does not grant a second bonus reward', async () => {
    const first = await renderVisit(1);
    clickByText(first, 'בחרו נושא');
    await act(async () => undefined);
    answerCorrectly(first);
    await act(async () => undefined);
    const walletAfterFirst = readProgress().walletHalfUnits;
    expect(walletAfterFirst).toBeGreaterThan(0);
    unmount(first);

    // Simulate leaving and coming back (replay) to the same, now-completed visit.
    const second = await renderVisit(1);
    expect(second.querySelector('.bonus-success h2')?.textContent).toBe('הפרס כבר נאסף');
    const walletAfterReplay = readProgress().walletHalfUnits;
    expect(walletAfterReplay).toBe(walletAfterFirst);
    unmount(second);
  });

  it('the second visit\'s wheel excludes the topic already used by the first visit', async () => {
    const first = await renderVisit(1);
    clickByText(first, 'בחרו נושא');
    await act(async () => undefined);
    const firstLabel = chosenTopicLabel(first);
    answerCorrectly(first);
    await act(async () => undefined);
    unmount(first);

    const second = await renderVisit(2);
    const segmentLabels = Array.from(second.querySelectorAll('.bonus-wheel-label')).map((el) => el.textContent);
    expect(segmentLabels).not.toContain(firstLabel);
    expect(segmentLabels).toHaveLength(bonusTopics.length - 1);
    unmount(second);
  });
});
