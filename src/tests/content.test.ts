import { describe, expect, it } from 'vitest';
import { battles, validateBattleRegistry } from '../content/battles';

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
});
