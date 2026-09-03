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
});
