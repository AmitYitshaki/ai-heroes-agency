import { describe, expect, it } from 'vitest';
import { battles, isTrainingBattle, validateBattleRegistry } from '../content/battles';

describe('battle registry', () => {
  it('contains the complete ordered 23-battle campaign', () => {
    expect(validateBattleRegistry()).toEqual([]);
    expect(battles).toHaveLength(23);
    expect(battles.map((battle) => battle.order)).toEqual(Array.from({ length: 23 }, (_, index) => index + 1));
  });

  it('uses all seven interaction templates', () => {
    expect(new Set(battles.map((battle) => battle.battleType))).toEqual(new Set([
      'prompt_assembly', 'fault_scan', 'power_selection', 'fault_repair',
      'robot_test', 'responsibility_shield', 'combo',
    ]));
  });

  it('has four criteria per battle and the expected workshop milestones', () => {
    expect(battles.every((battle) => battle.criteria.length === 4)).toBe(true);
    expect(battles.filter((battle) => battle.workshopVisit).map((battle) => [battle.order, battle.workshopVisit])).toEqual([
      [7, 1], [13, 2], [18, 3], [22, 4],
    ]);
  });

  it('isolates raw clock times so they cannot visually swap places with the Hebrew label next to them', () => {
    // battle_20 mixes Hebrew text with "HH:MM" clock times; a plain digit run
    // embedded in RTL prose can render out of order (confirmed live — the
    // un-isolated string rendered "AI" and "10:00" swapped on screen).
    // U+2068/U+2069 (First Strong Isolate / Pop Directional Isolate) around
    // just the digit run fixes it; wrapping "AI: 10:00" together as one
    // isolate does NOT — regression-tested against the live-verified fix.
    const battle20 = battles.find((battle) => battle.battleId === 'battle_20')!;
    expect(battle20.promptFrame).toContain('⁨10:00⁩');
    expect(battle20.promptFrame).toContain('⁨08:00⁩');
    expect(battle20.successMessage).toContain('⁨08:00⁩');
  });

  it('flags battle_01 as the sole training battle — every other battle stays a villain battle', () => {
    // battle_01 is a tutorial simulator with no antagonist (`villain: null`
    // in battle metadata). BattlePage reads this typed field — not the
    // displayed title/story text — to decide whether to render the
    // "versus a villain" stage or the "training with Aleph" stage. This
    // locks in that exactly one battle is training-mode and that a real
    // battle (e.g. battle_02) still resolves to villain-mode.
    const battle01 = battles.find((battle) => battle.battleId === 'battle_01')!;
    const battle02 = battles.find((battle) => battle.battleId === 'battle_02')!;
    expect(isTrainingBattle(battle01)).toBe(true);
    expect(battle01.villain).toBeNull();
    expect(isTrainingBattle(battle02)).toBe(false);
    expect(battle02.villain).not.toBeNull();
    expect(battles.filter(isTrainingBattle).map((battle) => battle.battleId)).toEqual(['battle_01']);
  });
});
