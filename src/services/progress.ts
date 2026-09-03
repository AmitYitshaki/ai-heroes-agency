import type { CampaignProgressV1, CharacterId, CosmeticItem, PlayerSettings } from '../schemas/game';

export const STORAGE_KEY = 'ai_heroes_progress_v1';

export const defaultSettings = (): PlayerSettings => ({
  musicEnabled: true,
  effectsEnabled: true,
  reducedMotion: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
});

export const createInitialProgress = (settings = defaultSettings()): CampaignProgressV1 => ({
  schemaVersion: 1,
  characterId: null,
  nextBattleOrder: 1,
  battleBestHalfUnits: {},
  totalEarnedHalfUnits: 0,
  walletHalfUnits: 0,
  completedBonusIds: [],
  purchasedCosmeticIds: [],
  equippedCosmetics: { head: null, armor: null, movement: null, emblem: null },
  unlockedPowerIds: [],
  appliedTransactionIds: [],
  settings,
  updatedAt: new Date(0).toISOString(),
});

const clampScore = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value >= 2 && value <= 10 ? value : 2;

export function migrateProgress(raw: unknown): CampaignProgressV1 {
  if (!raw || typeof raw !== 'object') return createInitialProgress();
  const value = raw as Partial<CampaignProgressV1> & { schemaVersion?: number };
  const initial = createInitialProgress(value.settings && typeof value.settings === 'object' ? { ...defaultSettings(), ...value.settings } : undefined);
  const scores = Object.fromEntries(Object.entries(value.battleBestHalfUnits ?? {}).filter(([key]) => /^battle_\d{2}$/.test(key)).map(([key, score]) => [key, clampScore(score)]));
  return {
    ...initial,
    characterId: value.characterId === 'hero' || value.characterId === 'heroine' ? value.characterId : null,
    nextBattleOrder: typeof value.nextBattleOrder === 'number' ? Math.min(24, Math.max(1, Math.floor(value.nextBattleOrder))) : 1,
    battleBestHalfUnits: scores,
    totalEarnedHalfUnits: Math.max(0, Number(value.totalEarnedHalfUnits) || 0),
    walletHalfUnits: Math.max(0, Number(value.walletHalfUnits) || 0),
    completedBonusIds: Array.isArray(value.completedBonusIds) ? value.completedBonusIds.filter((id): id is string => typeof id === 'string') : [],
    purchasedCosmeticIds: Array.isArray(value.purchasedCosmeticIds) ? value.purchasedCosmeticIds.filter((id): id is string => typeof id === 'string') : [],
    equippedCosmetics: { ...initial.equippedCosmetics, ...(value.equippedCosmetics ?? {}) },
    unlockedPowerIds: Array.isArray(value.unlockedPowerIds) ? value.unlockedPowerIds.filter((id): id is string => typeof id === 'string') : [],
    appliedTransactionIds: Array.isArray(value.appliedTransactionIds) ? value.appliedTransactionIds.filter((id): id is string => typeof id === 'string') : [],
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : initial.updatedAt,
  };
}

export function loadProgress(storage: Pick<Storage, 'getItem'> = localStorage): CampaignProgressV1 {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? migrateProgress(JSON.parse(raw)) : createInitialProgress();
  } catch {
    return createInitialProgress();
  }
}

export function saveProgress(progress: CampaignProgressV1, storage: Pick<Storage, 'setItem'> = localStorage): CampaignProgressV1 {
  const saved = { ...progress, updatedAt: new Date().toISOString() };
  // A full quota, private-mode restrictions, or storage being disabled must
  // not block the current session's in-memory progress — only cross-session
  // persistence is lost, and the game keeps working until the next reload.
  try { storage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch { /* storage unavailable; continue in-memory */ }
  return saved;
}

export function selectCharacter(progress: CampaignProgressV1, characterId: CharacterId): CampaignProgressV1 {
  return { ...progress, characterId };
}

export function commitBattleBest(progress: CampaignProgressV1, battleId: string, order: number, scoreHalfUnits: number, unlockPower?: string): CampaignProgressV1 {
  const score = Math.min(10, Math.max(2, Math.round(scoreHalfUnits)));
  const previous = progress.battleBestHalfUnits[battleId] ?? 0;
  const nextBest = Math.max(previous, score);
  const tx = `battle_best:${battleId}:${nextBest}`;
  if (progress.appliedTransactionIds.includes(tx)) return progress;
  const delta = Math.max(0, nextBest - previous);
  return {
    ...progress,
    nextBattleOrder: Math.max(progress.nextBattleOrder, Math.min(24, order + 1)),
    battleBestHalfUnits: { ...progress.battleBestHalfUnits, [battleId]: nextBest },
    totalEarnedHalfUnits: progress.totalEarnedHalfUnits + delta,
    walletHalfUnits: progress.walletHalfUnits + delta,
    unlockedPowerIds: unlockPower && !progress.unlockedPowerIds.includes(unlockPower) ? [...progress.unlockedPowerIds, unlockPower] : progress.unlockedPowerIds,
    appliedTransactionIds: [...progress.appliedTransactionIds, tx],
  };
}

export function grantBonus(progress: CampaignProgressV1, bonusId: string): CampaignProgressV1 {
  const tx = `bonus_reward:${bonusId}`;
  if (progress.appliedTransactionIds.includes(tx)) return progress;
  return { ...progress, totalEarnedHalfUnits: progress.totalEarnedHalfUnits + 4, walletHalfUnits: progress.walletHalfUnits + 4, completedBonusIds: [...new Set([...progress.completedBonusIds, bonusId])], appliedTransactionIds: [...progress.appliedTransactionIds, tx] };
}

export function purchaseCosmetic(progress: CampaignProgressV1, item: CosmeticItem): CampaignProgressV1 {
  const tx = `cosmetic_purchase:${item.itemId}`;
  if (progress.purchasedCosmeticIds.includes(item.itemId) || progress.appliedTransactionIds.includes(tx)) return { ...progress, equippedCosmetics: { ...progress.equippedCosmetics, [item.slot]: item.itemId } };
  if (progress.walletHalfUnits < item.priceHalfUnits) return progress;
  return { ...progress, walletHalfUnits: progress.walletHalfUnits - item.priceHalfUnits, purchasedCosmeticIds: [...progress.purchasedCosmeticIds, item.itemId], equippedCosmetics: { ...progress.equippedCosmetics, [item.slot]: item.itemId }, appliedTransactionIds: [...progress.appliedTransactionIds, tx] };
}
