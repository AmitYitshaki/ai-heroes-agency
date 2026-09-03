import { describe, expect, it } from 'vitest';
import { cosmetics } from '../content/catalog';
import { commitBattleBest, createInitialProgress, grantBonus, migrateProgress, purchaseCosmetic } from '../services/progress';

describe('campaign progress', () => {
  it('awards only the positive best-score delta on replay', () => {
    const initial = createInitialProgress();
    const first = commitBattleBest(initial, 'battle_01', 1, 6, 'goal');
    const lowerReplay = commitBattleBest(first, 'battle_01', 1, 4, 'goal');
    const improvedReplay = commitBattleBest(lowerReplay, 'battle_01', 1, 9, 'goal');
    expect(first.walletHalfUnits).toBe(6);
    expect(lowerReplay).toBe(first);
    expect(improvedReplay.walletHalfUnits).toBe(9);
    expect(improvedReplay.totalEarnedHalfUnits).toBe(9);
    expect(improvedReplay.battleBestHalfUnits.battle_01).toBe(9);
  });

  it('grants each bonus once and purchases each cosmetic once', () => {
    const funded = { ...createInitialProgress(), walletHalfUnits: 30 };
    const bonus = grantBonus(funded, 'bonus_1');
    expect(grantBonus(bonus, 'bonus_1')).toBe(bonus);
    expect(bonus.walletHalfUnits).toBe(34);

    const item = cosmetics[0];
    const purchased = purchaseCosmetic(bonus, item);
    const equippedAgain = purchaseCosmetic(purchased, item);
    expect(purchased.walletHalfUnits).toBe(34 - item.priceHalfUnits);
    expect(equippedAgain.walletHalfUnits).toBe(purchased.walletHalfUnits);
    expect(equippedAgain.equippedCosmetics[item.slot]).toBe(item.itemId);
  });

  it('starting a new journey resets progress but keeps comfort settings', () => {
    const played = {
      ...createInitialProgress(),
      characterId: 'heroine' as const,
      nextBattleOrder: 9,
      battleBestHalfUnits: { battle_01: 10, battle_02: 8 },
      totalEarnedHalfUnits: 18,
      walletHalfUnits: 12,
      purchasedCosmeticIds: ['head_signal'],
      settings: { musicEnabled: false, effectsEnabled: false, reducedMotion: true },
    };
    const restarted = createInitialProgress(played.settings);
    expect(restarted.characterId).toBeNull();
    expect(restarted.nextBattleOrder).toBe(1);
    expect(restarted.battleBestHalfUnits).toEqual({});
    expect(restarted.totalEarnedHalfUnits).toBe(0);
    expect(restarted.walletHalfUnits).toBe(0);
    expect(restarted.purchasedCosmeticIds).toEqual([]);
    expect(restarted.settings).toEqual(played.settings);
  });

  it('migrates malformed persisted data into bounded schema v1 state', () => {
    const migrated = migrateProgress({
      schemaVersion: 99,
      characterId: 'not-a-character',
      nextBattleOrder: 999,
      battleBestHalfUnits: { battle_01: 42, bad: 8, battle_02: 7 },
      walletHalfUnits: -10,
      completedBonusIds: ['bonus_1', 12],
    });
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.characterId).toBeNull();
    expect(migrated.nextBattleOrder).toBe(24);
    expect(migrated.battleBestHalfUnits).toEqual({ battle_01: 2, battle_02: 7 });
    expect(migrated.walletHalfUnits).toBe(0);
    expect(migrated.completedBonusIds).toEqual(['bonus_1']);
  });
});
