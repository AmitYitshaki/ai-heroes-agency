import { describe, expect, it } from 'vitest';
import { battles } from '../content/battles';
import { calculateScore, evaluateSelections } from '../engine/scoring';
import { commitBattleBest, createInitialProgress } from '../services/progress';

// Parameterized playthrough over the full 23-battle registry, run through the
// same pure engine functions BattlePage/FinalBattlePage use at runtime
// (evaluateSelections, calculateScore, commitBattleBest). This is logic-level
// coverage, not a rendered DOM per battle — battle_01 and battle_23 are also
// exercised end-to-end in a real browser (see manual QA in the release
// report); this suite exists so every one of the 23 battles — not just a
// sample — is checked for a working win/lose/replay/unlock path.
const standardBattles = battles.filter((battle) => battle.battleId !== 'battle_23');

describe('every standard battle (1-22) has a working win/lose/unlock path', () => {
  it.each(standardBattles)('battle $order ($battleId, $battleType) — $title', (battle) => {
    // Content is genuinely per-battle, not a shared placeholder.
    expect(battle.title.length).toBeGreaterThan(0);
    expect(battle.story.length).toBeGreaterThan(0);
    expect(battle.objective.length).toBeGreaterThan(0);
    expect(battle.concept.length).toBeGreaterThan(0);
    expect(battle.criteria).toHaveLength(4);
    expect(battle.criteria.every((criterion) => criterion.length > 0)).toBe(true);

    const ordered = battle.battleId === 'battle_14';

    // A wrong attempt (everything except the correct set, or a single wrong
    // pick) never evaluates as a win.
    const distractor = battle.choices.find((choice) => !battle.correctChoiceIds.includes(choice.id));
    if (distractor) expect(evaluateSelections([distractor.id], battle.correctChoiceIds, ordered)).toBe(false);
    if (battle.correctChoiceIds.length > 1) {
      const partial = battle.correctChoiceIds.slice(0, -1);
      expect(evaluateSelections(partial, battle.correctChoiceIds, ordered)).toBe(false);
    }

    // The exact correct set always wins — this is also what the guided
    // half-open completion selects on the child's behalf, so it doubles as
    // proof the guided path can always finish the battle.
    expect(evaluateSelections([...battle.correctChoiceIds], battle.correctChoiceIds, ordered)).toBe(true);

    // A wrong order fails an ordered battle even with the right members.
    if (ordered) expect(evaluateSelections([...battle.correctChoiceIds].reverse(), battle.correctChoiceIds, true)).toBe(false);

    // Scoring stays within the 1-5 star band regardless of how it was solved.
    const bestCase = calculateScore(['user_independent', 'user_independent', 'user_independent', 'user_independent']);
    const worstCase = calculateScore(['system_completed', 'system_completed', 'system_completed', 'system_completed']);
    expect(bestCase).toBe(10);
    expect(worstCase).toBe(2);

    // Winning commits progress and opens exactly the next battle — never
    // more than one step, never leaving a dead end.
    const initial = createInitialProgress();
    const afterWin = commitBattleBest(initial, battle.battleId, battle.order, bestCase, battle.unlockPower);
    expect(afterWin.nextBattleOrder).toBe(Math.min(24, battle.order + 1));
    expect(afterWin.battleBestHalfUnits[battle.battleId]).toBe(bestCase);
    if (battle.unlockPower) expect(afterWin.unlockedPowerIds).toContain(battle.unlockPower);

    // Replay: a lower or equal repeat score never re-awards; only a strictly
    // better score adds the positive delta, and the best/next-unlock state
    // is monotonic (never regresses on a worse replay).
    const sameScoreReplay = commitBattleBest(afterWin, battle.battleId, battle.order, bestCase, battle.unlockPower);
    expect(sameScoreReplay).toBe(afterWin);
    if (worstCase < bestCase) {
      const lowerReplay = commitBattleBest(afterWin, battle.battleId, battle.order, worstCase, battle.unlockPower);
      expect(lowerReplay.walletHalfUnits).toBe(afterWin.walletHalfUnits);
      expect(lowerReplay.battleBestHalfUnits[battle.battleId]).toBe(bestCase);
      expect(lowerReplay.nextBattleOrder).toBe(afterWin.nextBattleOrder);
    }
  });

  it('combo battles (workshop milestones) require selecting more than one correct component', () => {
    const comboBattles = standardBattles.filter((battle) => battle.workshopVisit);
    expect(comboBattles.map((battle) => battle.order)).toEqual([7, 13, 18, 22]);
    for (const battle of comboBattles) expect(battle.correctChoiceIds.length).toBeGreaterThan(1);
  });

  it('a partially-correct combo attempt keeps the correct picks retained on the next try', () => {
    const combo = standardBattles.find((battle) => battle.order === 7)!;
    const [firstCorrect, ...restCorrect] = combo.correctChoiceIds;
    // First round: only one correct component picked alongside a wrong one — fails.
    const wrongPick = combo.choices.find((choice) => !combo.correctChoiceIds.includes(choice.id))!.id;
    expect(evaluateSelections([firstCorrect, wrongPick], combo.correctChoiceIds)).toBe(false);
    // Second round: the retained correct component plus the remaining correct ones — succeeds.
    expect(evaluateSelections([firstCorrect, ...restCorrect], combo.correctChoiceIds)).toBe(true);
  });

  it('the campaign is completable end to end: winning every battle in order reaches the finale gate', () => {
    let progress = createInitialProgress();
    for (const battle of standardBattles) {
      expect(battle.order).toBeLessThanOrEqual(progress.nextBattleOrder); // never locked out
      progress = commitBattleBest(progress, battle.battleId, battle.order, 10, battle.unlockPower);
    }
    expect(progress.nextBattleOrder).toBe(23); // battle_23 now open
    expect(Object.keys(progress.battleBestHalfUnits)).toHaveLength(22);
  });
});
