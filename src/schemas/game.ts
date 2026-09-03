export type CharacterId = 'hero' | 'heroine';
export type RegionId = 'recruitment' | 'fog_district' | 'no_limits_factory' | 'command_maze' | 'certainty_tower' | 'finale';
export type BattleType = 'prompt_assembly' | 'fault_scan' | 'power_selection' | 'fault_repair' | 'robot_test' | 'responsibility_shield' | 'combo';
export type ComponentProvenance = 'user_independent' | 'user_choice_two' | 'system_completed';

export interface BattleChoice {
  id: string;
  label: string;
  detail?: string;
  outcome?: string;
}

export interface BattleDefinition {
  schemaVersion: 1;
  battleId: `battle_${string}`;
  order: number;
  regionId: RegionId;
  title: string;
  villain: string | null;
  battleType: BattleType;
  skillLabel: string;
  story: string;
  objective: string;
  instruction: string;
  concept: string;
  promptFrame?: string;
  choices: BattleChoice[];
  correctChoiceIds: string[];
  successMessage: string;
  partialMessage: string;
  /** 2-4 sentences shown on success: why this choice is correct for this battle, which prompt component it strengthens, and how that helps an AI give an accurate/safe/testable result. Distinct from `concept` (the general principle, shown before the choice via progressive disclosure). */
  successExplanation: string;
  criteria: [string, string, string, string];
  estimatedSeconds: number;
  unlockPower?: string;
  workshopVisit?: 1 | 2 | 3 | 4;
}

export interface PlayerSettings {
  musicEnabled: boolean;
  effectsEnabled: boolean;
  reducedMotion: boolean;
}

/** The one topic+question the wheel landed on for a given bonus visit — recorded once, read on every re-render/refresh so the result never changes mid-visit and the wheel never re-rolls. */
export interface BonusSelection {
  topicId: string;
  questionId: string;
}

export interface CampaignProgressV1 {
  schemaVersion: 1;
  characterId: CharacterId | null;
  nextBattleOrder: number;
  battleBestHalfUnits: Record<string, number>;
  totalEarnedHalfUnits: number;
  walletHalfUnits: number;
  completedBonusIds: string[];
  purchasedCosmeticIds: string[];
  equippedCosmetics: Record<'head' | 'armor' | 'movement' | 'emblem', string | null>;
  unlockedPowerIds: string[];
  appliedTransactionIds: string[];
  /** Keyed by visit bonus id ('bonus_1' | 'bonus_2' | 'bonus_3'). The set of topics/questions already used this journey is derived from these values — never stored redundantly. */
  bonusSelections: Record<string, BonusSelection>;
  settings: PlayerSettings;
  updatedAt: string;
}

export interface CosmeticItem {
  itemId: string;
  visitId: 1 | 2 | 3 | 4;
  slot: 'head' | 'armor' | 'movement' | 'emblem';
  label: string;
  description: string;
  priceHalfUnits: number;
  swatch: string;
}

export type Battle23OutcomeKey = 'unsafe_personal_data' | 'unclear_goal_or_context' | 'missing_constraint' | 'missing_format' | 'missing_success_criteria' | 'unverified_information' | 'full_success';
