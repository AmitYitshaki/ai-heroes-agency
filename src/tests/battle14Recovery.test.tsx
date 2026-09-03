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

const battle14 = battleById['battle_14'];
const STEP1 = battle14.choices.find((c) => c.id === 'insert')!.label; // "1. הכניסו את מכתב הברכה"
const STEP2 = battle14.choices.find((c) => c.id === 'close')!.label; // "2. סגרו את הקופסה"
const STEP3 = battle14.choices.find((c) => c.id === 'move')!.label; // "3. העבירו למסוע"
const DISTRACTOR = battle14.choices.find((c) => c.id === 'paint')!.label;

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

async function renderBattleId(battleId: string) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  await act(async () => {
    root.render(<MemoryRouter><GameProvider><StandardBattle battleId={battleId} /></GameProvider></MemoryRouter>);
  });
  return { host, root };
}
const renderBattle14 = () => renderBattleId('battle_14');

const wait = (ms: number) => act(async () => { await new Promise((resolve) => setTimeout(resolve, ms)); });

function clickByText(host: HTMLElement, text: string) {
  const target = Array.from(host.querySelectorAll('button')).find((button) => button.textContent?.includes(text));
  if (!target) throw new Error(`button not found for text: ${text}`);
  act(() => { target.click(); });
}

function findButton(host: HTMLElement, text: string) {
  return Array.from(host.querySelectorAll('button')).find((button) => button.textContent?.includes(text)) ?? null;
}

function sequenceLabels(host: HTMLElement): string[] {
  return Array.from(host.querySelectorAll('.order-sequence__step')).map((el) => el.textContent ?? '');
}

async function toCompose(host: HTMLElement) {
  clickByText(host, 'התחילו סריקה');
  await act(async () => undefined);
}

async function dispatch(host: HTMLElement) {
  clickByText(host, 'שגרו ללופּ');
  await wait(400);
}

describe('battle 14: full recovery after a wrong order', () => {
  it('wrong order -> submit -> feedback -> undo -> reorder -> correct order -> victory', async () => {
    const { host } = await renderBattle14();
    await toCompose(host);

    // Wrong order: move, insert, close (should be insert, close, move).
    clickByText(host, STEP3);
    clickByText(host, STEP1);
    clickByText(host, STEP2);
    const built = sequenceLabels(host);
    expect(built).toHaveLength(3);
    [STEP3, STEP1, STEP2].forEach((label, index) => expect(built[index]).toContain(label));
    await dispatch(host);

    expect(host.querySelector('h1')?.textContent).toBe('לופּ פירש את הבקשה');

    // Return to editable compose — nothing may be locked.
    clickByText(host, 'שפרו את הפרומפט');
    await act(async () => undefined);
    expect(host.querySelectorAll('.power-card[disabled]')).toHaveLength(0);
    expect(sequenceLabels(host)).toHaveLength(3); // the wrong attempt is preserved for editing, not wiped

    // Undo the last step (close), then the new last step (insert) too,
    // leaving just the still-valid first pick (move) — then rebuild the
    // rest in the correct order.
    clickByText(host, 'בטלו צעד');
    await act(async () => undefined);
    clickByText(host, 'בטלו צעד');
    await act(async () => undefined);
    expect(sequenceLabels(host)).toHaveLength(1);

    // Remove the remaining (misplaced) first pick via clicking it directly
    // in the sequence list — proves "click a selected item to return it".
    const remaining = host.querySelector('.order-sequence__step')!;
    act(() => { (remaining as HTMLButtonElement).click(); });
    await act(async () => undefined);
    expect(sequenceLabels(host)).toHaveLength(0);

    // Rebuild in the correct order and win.
    clickByText(host, STEP1);
    clickByText(host, STEP2);
    clickByText(host, STEP3);
    await dispatch(host);
    expect(host.querySelector('h1')?.textContent).toBe('המשימה הצליחה!');

    clickByText(host, 'לניצחון');
    await act(async () => undefined);
    expect(host.querySelector('h1')?.textContent).toBe('חותמת משימה!');
  });

  it('cancelling every selected step (restart) empties the sequence and re-enables full selection', async () => {
    const { host } = await renderBattle14();
    await toCompose(host);
    clickByText(host, STEP1);
    clickByText(host, STEP2);
    clickByText(host, STEP3);
    expect(sequenceLabels(host)).toHaveLength(3);

    clickByText(host, 'התחילו מחדש');
    await act(async () => undefined);
    expect(sequenceLabels(host)).toHaveLength(0);
    expect(findButton(host, 'בטלו צעד')?.hasAttribute('disabled')).toBe(true);
    expect(findButton(host, 'התחילו מחדש')?.hasAttribute('disabled')).toBe(true);

    // Fully usable again afterwards.
    clickByText(host, STEP1);
    expect(sequenceLabels(host)).toHaveLength(1);
  });

  it('reset mid-attempt (after one wrong submit) still allows completing correctly afterwards', async () => {
    const { host } = await renderBattle14();
    await toCompose(host);
    clickByText(host, STEP2); clickByText(host, STEP1); clickByText(host, STEP3); // wrong order
    await dispatch(host);
    clickByText(host, 'שפרו את הפרומפט');
    await act(async () => undefined);

    clickByText(host, 'התחילו מחדש');
    await act(async () => undefined);
    expect(sequenceLabels(host)).toHaveLength(0);

    clickByText(host, STEP1); clickByText(host, STEP2); clickByText(host, STEP3);
    await dispatch(host);
    expect(host.querySelector('h1')?.textContent).toBe('המשימה הצליחה!');
  });

  it('a partial sequence cannot be submitted — the dispatch button stays disabled until all 3 steps are picked', async () => {
    const { host } = await renderBattle14();
    await toCompose(host);
    clickByText(host, STEP1);
    clickByText(host, STEP2);
    const dispatchButton = findButton(host, 'שגרו ללופּ') ?? findButton(host, 'בחרו');
    expect(dispatchButton?.hasAttribute('disabled')).toBe(true);
    // Clicking a disabled native button never fires onClick, so the phase cannot advance.
    expect(host.querySelector('.dispatch-panel')).toBeNull();
  });

  it('the 6th wrong attempt always reaches the guided (half-open) path, which always completes the battle', async () => {
    const { host } = await renderBattle14();
    await toCompose(host);

    for (let attempt = 0; attempt < 6; attempt++) {
      // The previous (wrong) attempt is preserved for editing on return to
      // compose (that's the fix under test), so clear it explicitly before
      // building the same wrong order again each time.
      if (findButton(host, 'התחילו מחדש') && !findButton(host, 'התחילו מחדש')!.hasAttribute('disabled')) {
        clickByText(host, 'התחילו מחדש');
        await act(async () => undefined);
      }
      // Wrong order every time: reverse of the correct sequence.
      clickByText(host, STEP3); clickByText(host, STEP2); clickByText(host, STEP1);
      await dispatch(host);
      const isSuccess = host.querySelector('h1')?.textContent === 'המשימה הצליחה!';
      expect(isSuccess).toBe(false); // this sequence is never correct, by construction
      const continueLabel = host.querySelector('.outcome-panel button')?.textContent ?? '';
      clickByText(host, continueLabel);
      await act(async () => undefined);
    }

    expect(host.querySelector('h1')?.textContent).toBe('משלימים יחד');
    clickByText(host, 'השלימו עם לופּ');
    await wait(400);
    expect(host.querySelector('h1')?.textContent).toBe('המשימה הצליחה!');
  });

  it('a page refresh mid-attempt behaves like every other battle: the in-progress order is not persisted or falsely completed', async () => {
    const first = await renderBattle14();
    await toCompose(first.host);
    clickByText(first.host, STEP3); clickByText(first.host, STEP1); clickByText(first.host, STEP2); // wrong order, never dispatched
    expect(sequenceLabels(first.host)).toHaveLength(3);
    act(() => { first.root.unmount(); });
    first.host.remove();

    // Nothing was committed — no completion transaction exists for battle_14.
    const progress = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(progress.battleBestHalfUnits.battle_14).toBeUndefined();
    expect(progress.appliedTransactionIds.some((id: string) => id.includes('battle_14'))).toBe(false);

    // A fresh mount (what a refresh produces) starts clean at the briefing, not stuck mid-sequence or falsely won.
    const second = await renderBattle14();
    expect(second.host.querySelector('h1')?.textContent).toBe(battle14.title);
  });
});

describe('battle 14 fix does not change other ordered-irrelevant battles', () => {
  it('a combo battle (battle_18, same choice-grid component) gets no order-sequence UI and still locks in correct picks across attempts as before', async () => {
    const battle18 = battleById['battle_18'];
    const { host } = await renderBattleId('battle_18');
    await toCompose(host);
    expect(host.querySelector('.order-sequence')).toBeNull(); // the new editing UI is scoped to ordered battles only

    const wrongLabel = battle18.choices.find((choice) => !battle18.correctChoiceIds.includes(choice.id))!.label;
    const correctLabels = battle18.choices.filter((choice) => battle18.correctChoiceIds.includes(choice.id)).map((choice) => choice.label);
    correctLabels.forEach((label) => clickByText(host, label));
    clickByText(host, wrongLabel);
    await dispatch(host);

    expect(host.querySelector('h1')?.textContent).toBe('לופּ פירש את הבקשה');
    clickByText(host, 'שפרו את הפרומפט');
    await act(async () => undefined);
    // Unlike battle_14, correct picks for a non-ordered battle remain locked in (existing, deliberate behavior).
    const lockedCount = host.querySelectorAll('.power-card[disabled]').length;
    expect(lockedCount).toBeGreaterThan(0);
  });
});
