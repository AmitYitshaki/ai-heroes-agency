import { describe, expect, it, vi } from 'vitest';
import { cosmetics } from '../content/catalog';
import { commitBattleBest, createInitialProgress, grantBonus, loadProgress, migrateProgress, purchaseCosmetic, recordBonusSelection, saveProgress } from '../services/progress';

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

  it('starting a new journey resets progress (including bonus history) but keeps comfort settings', () => {
    const played = {
      ...createInitialProgress(),
      characterId: 'heroine' as const,
      nextBattleOrder: 9,
      battleBestHalfUnits: { battle_01: 10, battle_02: 8 },
      totalEarnedHalfUnits: 18,
      walletHalfUnits: 12,
      purchasedCosmeticIds: ['head_signal'],
      completedBonusIds: ['bonus_1'],
      bonusSelections: { bonus_1: { topicId: 'probability', questionId: 'probability_1' } },
      settings: { musicEnabled: false, effectsEnabled: false, reducedMotion: true },
    };
    const restarted = createInitialProgress(played.settings);
    expect(restarted.characterId).toBeNull();
    expect(restarted.nextBattleOrder).toBe(1);
    expect(restarted.battleBestHalfUnits).toEqual({});
    expect(restarted.totalEarnedHalfUnits).toBe(0);
    expect(restarted.walletHalfUnits).toBe(0);
    expect(restarted.purchasedCosmeticIds).toEqual([]);
    expect(restarted.completedBonusIds).toEqual([]);
    expect(restarted.bonusSelections).toEqual({}); // bonus history reset...
    expect(restarted.settings).toEqual(played.settings); // ...but comfort/audio settings are not
  });

  it('records a bonus visit\'s wheel result once and ignores any later attempt to overwrite it — refresh-safe, no re-draw', () => {
    const initial = createInitialProgress();
    const first = recordBonusSelection(initial, 'bonus_1', { topicId: 'probability', questionId: 'probability_1' });
    expect(first.bonusSelections.bonus_1).toEqual({ topicId: 'probability', questionId: 'probability_1' });

    // A second call for the same visit — as a refreshed page re-deriving the
    // same draw would trigger — must not replace the recorded selection.
    const second = recordBonusSelection(first, 'bonus_1', { topicId: 'truth', questionId: 'truth_1' });
    expect(second).toBe(first); // unchanged object — proves the no-op path, not just an equal-looking value
    expect(second.bonusSelections.bonus_1).toEqual({ topicId: 'probability', questionId: 'probability_1' });

    // A different visit gets its own independent slot.
    const third = recordBonusSelection(second, 'bonus_2', { topicId: 'truth', questionId: 'truth_1' });
    expect(third.bonusSelections).toEqual({
      bonus_1: { topicId: 'probability', questionId: 'probability_1' },
      bonus_2: { topicId: 'truth', questionId: 'truth_1' },
    });
  });

  it('keeps the in-memory session alive when the storage write fails (quota/private mode/disabled)', () => {
    const failingStorage = { setItem: vi.fn(() => { throw new DOMException('quota exceeded', 'QuotaExceededError'); }) };
    expect(() => saveProgress(createInitialProgress(), failingStorage)).not.toThrow();
    const saved = saveProgress({ ...createInitialProgress(), walletHalfUnits: 4 }, failingStorage);
    expect(saved.walletHalfUnits).toBe(4);
  });

  it('falls back to a fresh campaign when persisted data is corrupt JSON or storage throws on read', () => {
    expect(loadProgress({ getItem: () => '{not json' }).schemaVersion).toBe(1);
    expect(loadProgress({ getItem: () => { throw new Error('storage disabled'); } }).nextBattleOrder).toBe(1);
    expect(loadProgress({ getItem: () => null }).battleBestHalfUnits).toEqual({});
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

  it('migrates an old save with no bonusSelections field at all into a safe empty map', () => {
    // A save written before this field existed.
    const migrated = migrateProgress({ schemaVersion: 1, characterId: 'hero', nextBattleOrder: 8, completedBonusIds: ['bonus_1'] });
    expect(migrated.bonusSelections).toEqual({});
  });

  it('migrates a persisted bonusSelections map, dropping any malformed entries', () => {
    const migrated = migrateProgress({
      schemaVersion: 1,
      bonusSelections: {
        bonus_1: { topicId: 'probability', questionId: 'probability_1' },
        bonus_2: { topicId: 'truth' }, // missing questionId — malformed, must be dropped
        bonus_3: 'not-an-object', // malformed, must be dropped
      },
    });
    expect(migrated.bonusSelections).toEqual({ bonus_1: { topicId: 'probability', questionId: 'probability_1' } });
  });
});
