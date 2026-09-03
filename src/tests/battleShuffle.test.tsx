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

const battle02 = battleById['battle_02']; // single-correct choice, authored last — the reported bias case
const battle07 = battleById['battle_07']; // combo: 3 correct out of 6, unordered

const roots: Root[] = [];
afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.replaceChildren();
});

beforeEach(() => {
  // reducedMotion:true shortens the dispatch delay to 250ms so these tests
  // don't need real 1.2-2.4s waits; nextBattleOrder:23 unlocks every battle.
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    schemaVersion: 1, characterId: 'hero', nextBattleOrder: 23, battleBestHalfUnits: {},
    totalEarnedHalfUnits: 0, walletHalfUnits: 0, completedBonusIds: [], purchasedCosmeticIds: [],
    equippedCosmetics: { head: null, armor: null, movement: null, emblem: null }, unlockedPowerIds: [],
    appliedTransactionIds: [], settings: { musicEnabled: false, effectsEnabled: false, reducedMotion: true },
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

function optionLabels(host: HTMLElement) {
  return Array.from(host.querySelectorAll('.power-card strong')).map((el) => el.textContent);
}

function clickByText(host: HTMLElement, text: string) {
  const target = Array.from(host.querySelectorAll('button')).find((button) => button.textContent?.includes(text));
  if (!target) throw new Error(`button not found for text: ${text}`);
  act(() => { target.click(); });
}

async function startCompose(host: HTMLElement) {
  clickByText(host, 'התחילו סריקה');
  await act(async () => undefined);
}

describe('battle option shuffle', () => {
  it('renders every choice with a stable order across rerenders — a click/toggle never reshuffles the visible list', async () => {
    const host = await renderBattle('battle_02');
    await startCompose(host);
    const before = optionLabels(host);
    expect(before).toHaveLength(battle02.choices.length);

    // Select a wrong choice, then deselect it (single-select battle: picking
    // a different id replaces selection) — both are state updates/rerenders.
    const wrongLabel = battle02.choices.find((choice) => !battle02.correctChoiceIds.includes(choice.id))!.label;
    clickByText(host, wrongLabel);
    await act(async () => undefined);
    clickByText(host, wrongLabel);
    await act(async () => undefined);

    expect(optionLabels(host)).toEqual(before);
  });

  it('a correct pick wins the battle regardless of which visual slot it landed in after shuffling', async () => {
    const host = await renderBattle('battle_02');
    await startCompose(host);
    const correctLabel = battle02.choices.find((choice) => battle02.correctChoiceIds.includes(choice.id))!.label;

    clickByText(host, correctLabel);
    clickByText(host, 'שגרו ללופּ');
    await wait(400);

    expect(host.querySelector('h1')?.textContent).toBe('המשימה הצליחה!');
  });

  it('a wrong pick stays wrong regardless of which visual slot it landed in after shuffling', async () => {
    const host = await renderBattle('battle_02');
    await startCompose(host);
    const wrongLabel = battle02.choices.find((choice) => !battle02.correctChoiceIds.includes(choice.id))!.label;

    clickByText(host, wrongLabel);
    clickByText(host, 'שגרו ללופּ');
    await wait(400);

    expect(host.querySelector('h1')?.textContent).toBe('לופּ פירש את הבקשה');
  });

  it('a combo battle (3-of-6 correct) still evaluates as a win by id, regardless of shuffled layout', async () => {
    const host = await renderBattle('battle_07');
    await startCompose(host);
    const correctLabels = battle07.choices.filter((choice) => battle07.correctChoiceIds.includes(choice.id)).map((choice) => choice.label);

    correctLabels.forEach((label) => { clickByText(host, label); });
    clickByText(host, 'שגרו ללופּ');
    await wait(400);

    expect(host.querySelector('h1')?.textContent).toBe('המשימה הצליחה!');
  });

  it('the guided (half-open) solution still completes the battle correctly after six wrong attempts, by id, post-shuffle', async () => {
    const host = await renderBattle('battle_02');
    await startCompose(host);
    const correctId = battle02.correctChoiceIds[0];

    for (let attempt = 0; attempt < 6; attempt++) {
      const wrongLabel = battle02.choices.find((choice) => choice.id !== correctId && optionLabels(host).includes(choice.label))!.label;
      clickByText(host, wrongLabel);
      clickByText(host, 'שגרו ללופּ');
      await wait(400);
      const continueText = host.querySelector('h1')?.textContent === 'המשימה הצליחה!' ? null : (host.querySelector('.outcome-panel button')?.textContent ?? '');
      if (continueText) clickByText(host, continueText);
      await act(async () => undefined);
    }

    expect(host.querySelector('h1')?.textContent).toBe('משלימים יחד');
    clickByText(host, 'השלימו עם לופּ');
    await wait(400);
    expect(host.querySelector('h1')?.textContent).toBe('המשימה הצליחה!');
  });

  it('leaving and re-entering a battle (replay) remounts cleanly with a full, valid choice set', async () => {
    const first = await renderBattle('battle_02');
    await startCompose(first);
    expect(optionLabels(first)).toHaveLength(battle02.choices.length);

    // Simulate leaving (unmount, as navigating to /map would) and returning.
    act(() => { roots.pop()?.unmount(); });
    document.body.replaceChildren();

    const second = await renderBattle('battle_02');
    expect(second.querySelector('h1')?.textContent).toBe(battle02.title); // fresh briefing, not stuck on old phase
    await startCompose(second);
    const labels = optionLabels(second);
    expect(labels).toHaveLength(battle02.choices.length);
    expect([...labels].sort()).toEqual(battle02.choices.map((choice) => choice.label).sort());
  });
});
