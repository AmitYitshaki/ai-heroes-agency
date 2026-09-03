# Data Schemas and Registries

**Version:** 0.3  
**Date:** 02.09.2026  
**Status:** Review  
**Owner:** Engineering + Content  
**Authority:** `PRODUCT_SPEC.md`

## 1. Schema principles

- Engine IDs use lowercase `snake_case`.
- Visible Hebrew strings never act as IDs.
- Static content and local progress use different schemas.
- All enums are closed.
- Scores are stored as integer half-units: `2..10`.
- Free text is session-only and absent from every persistent schema.
- Unknown classifier keys fail closed.
- Schema changes increment `schemaVersion`.

## 2. Canonical enums

### CharacterId

`hero | heroine`

### RegionId

`recruitment | fog_district | no_limits_factory | command_maze | certainty_tower | finale`

### BattleType

`prompt_assembly | fault_scan | power_selection | fault_repair | robot_test | responsibility_shield | combo`

### ComponentProvenance

`user_independent | user_choice_two | system_completed`

### SkillCode

`goal | context | format | constraint | example | counterexample | success_criterion | structure_order | instruction_data_separation | contradiction | positive_phrasing | iteration | probability | verification | privacy | responsibility`

### Battle23OutcomeKey

`unsafe_personal_data | unclear_goal_or_context | missing_constraint | missing_format | missing_success_criteria | unverified_information | full_success`

### ResultStatus

`partial | unsafe | success | technical_error`

## 3. Battle content object

```ts
interface BattleContent {
  schemaVersion: 1;
  battleId: string;
  regionId: RegionId;
  order: number;                 // 1..23
  title: string;
  villain: string | null;
  skillCodes: SkillCode[];
  battleType: BattleType;
  realWorldNeed: string;
  comicSetup: string[];
  objective: string;
  estimatedSeconds: number;
  promptComponents: PromptComponent[];
  validStates: ValidState[];
  partialStates: PartialState[];
  unsafeStates: UnsafeState[];
  robotOutcomes: RobotOutcome[];
  feedbackAttempts: FeedbackAttempt[];
  scoreCriteria: ScoreCriterion[];
  reward: BattleReward;
  artDirection: ArtDirection;
  safetyTags: string[];
}
```

Validation:

- `battleId` unique.
- `order` unique and contiguous 1–23.
- exactly four `scoreCriteria`.
- `estimatedSeconds` within approved range for its battle class.
- every referenced outcome and asset exists.
- every `validState` reaches a success outcome.
- every `unsafeState` reaches a local safety outcome.

### Battle reward

```ts
type WorkshopVisitId =
  | "workshop_1"
  | "workshop_2"
  | "workshop_3"
  | "workshop_4";

interface BattleReward {
  stampId: string;
  unlockRegionId?: RegionId;
  unlockWorkshopVisitId?: WorkshopVisitId;
  unlockPowerIds: string[];
}
```

Reward rules:

- ordinary battles grant a completion stamp and no region/workshop unlock;
- each region combo may unlock the next region and its approved workshop visit;
- reward application uses the idempotent transaction rules below;
- a workshop may be skipped without reversing its region unlock.

## 4. Prompt component

```ts
interface PromptComponent {
  componentId: string;
  kind:
    | "goal"
    | "context"
    | "constraint"
    | "format"
    | "example"
    | "counterexample"
    | "success_criterion"
    | "data"
    | "instruction";
  label: string;
  value: string;
  accessibilityLabel: string;
  isInitiallyAvailable: boolean;
  assetId?: string;
}
```

For battles 1–22, every component value is approved static content.

## 5. State definitions

```ts
interface ValidState {
  stateId: string;
  requiredComponentIds: string[];
  forbiddenComponentIds: string[];
  outcomeKey: string;
}

interface PartialState {
  stateId: string;
  presentComponentIds: string[];
  missingSkillCodes: SkillCode[];
  outcomeKey: string;
  priority: number;
}

interface UnsafeState {
  stateId: string;
  triggerComponentIds?: string[];
  localRuleCodes?: string[];
  outcomeKey: "unsafe_personal_data";
}
```

If several partial states match, choose the lowest numeric `priority`. Safety always precedes partial-state evaluation.

## 6. Robot outcome

```ts
interface RobotOutcome {
  outcomeKey: string;
  status: ResultStatus;
  causalExplanation: string;
  feedbackTitle: string;
  feedbackBody: string;
  worldStateId: string;
  assetIds: string[];
  animationId?: string;
  reducedMotionAssetId: string;
  soundId?: string;
  nextActionLabel: string;
}
```

Child-facing copy comes from this object, never from the classifier.

## 7. Feedback ladder

```ts
interface FeedbackAttempt {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  familyOrStateKey: string;
  message: string;
  emphasisTargetId?: string;
  offeredComponentIds?: string[]; // exactly two at step 4
  preserveCorrectParts: boolean;
  transition: "retry" | "guided_builder" | "safety_stop";
}
```

Step 7 represents guaranteed guided completion after the six-attempt ladder.

## 8. Score criterion

```ts
interface ScoreCriterion {
  criterionId: string;
  label: string;
  skillCodes: SkillCode[];
  valueByProvenance: {
    user_independent: 2; // one star = two half-units
    user_choice_two: 1;
    system_completed: 0;
  };
}

interface BattleScoreResult {
  battleId: string;
  baseHalfUnits: 2;
  criterionHalfUnits: [0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2];
  totalHalfUnits: number; // 2..10
}
```

## 9. Campaign progress

```ts
interface CampaignProgressV1 {
  schemaVersion: 1;
  characterId: CharacterId | null;
  nextBattleOrder: number; // 1..24; 24 means campaign complete
  battleBestHalfUnits: Record<string, number>;
  totalEarnedHalfUnits: number;
  walletHalfUnits: number;
  completedBonusIds: string[];
  purchasedCosmeticIds: string[];
  equippedCosmetics: {
    head: string | null;
    armor: string | null;
    movement: string | null;
    emblem: string | null;
  };
  unlockedPowerIds: string[];
  appliedTransactionIds: string[];
  settings: PlayerSettings;
  updatedAt: string;
}
```

Persistence key: `ai_heroes_progress_v1`.

Forbidden fields include `name`, `email`, `phone`, `prompt`, `attemptHistory`, `classifierInput`, and `classifierOutput`.

## 10. Settings

```ts
interface PlayerSettings {
  musicEnabled: boolean;
  effectsEnabled: boolean;
  reducedMotion: boolean;
}
```

Default reduced-motion value should respect the browser preference on first run; an explicit player choice then persists.

## 11. Transactions

```ts
type ProgressTransaction =
  | {
      transactionId: string;
      type: "commit_battle_best";
      battleId: string;
      scoreHalfUnits: number;
    }
  | {
      transactionId: string;
      type: "grant_bonus";
      bonusId: string;
      rewardHalfUnits: 4; // 2 stars
    }
  | {
      transactionId: string;
      type: "purchase_cosmetic";
      itemId: string;
      priceHalfUnits: number;
    }
  | {
      transactionId: string;
      type: "equip_cosmetic";
      itemId: string;
      slot: "head" | "armor" | "movement" | "emblem";
    };
```

Battle transaction algorithm:

1. validate score;
2. read previous best;
3. compute `delta = max(0, newBest - previousBest)`;
4. create deterministic transaction ID;
5. if already applied, return unchanged;
6. update best, total and wallet by delta;
7. advance `nextBattleOrder` monotonically;
8. append transaction ID;
9. serialize the entire record once.

## 12. Workshop catalog

```ts
interface CosmeticItem {
  itemId: string;
  visitId: "workshop_1" | "workshop_2" | "workshop_3" | "workshop_4";
  slot: "head" | "armor" | "movement" | "emblem";
  styleRank: 1 | 2 | 3;
  priceHalfUnits: number;
  assetId: string;
  previewAssetId: string;
  label: string;
}
```

Catalog constraints:

- exactly three items per visit;
- prices in stars: visits 1–3 use 5/8/12; visit 4 uses 4/8/12;
- convert to half-units by multiplying by two;
- purchases are cosmetic only.

## 13. Bonus definition

```ts
interface BonusDefinition {
  bonusId: "bonus_1" | "bonus_2" | "bonus_3";
  afterRegionId: "fog_district" | "no_limits_factory" | "command_maze";
  rewardHalfUnits: 4;
  categoryPool: (
    | "probability"
    | "truth_or_fiction"
    | "privacy"
    | "untangle"
  )[];
  questionIds: string[];
}
```

Randomness selects a question/category, never reward value.

Post-region routing rules:

- `BattleReward.unlockWorkshopVisitId` selects the workshop;
- the optional bonus is resolved by matching the completed `regionId` to `BonusDefinition.afterRegionId`;
- do not add a duplicate `unlockBonusId` to `BattleReward`;
- the ordered route is workshop → matching optional bonus → map for Regions 1–3;
- skipping workshop or bonus never reverses the region/battle unlock;
- each workshop presentation and bonus reward is idempotent.

## 14. Battle session

```ts
interface BattleSession {
  battleId: string;
  state:
    | "briefing"
    | "scan"
    | "compose"
    | "dispatch"
    | "outcome"
    | "feedback"
    | "guided_builder"
    | "victory"
    | "score";
  attemptStep: number;
  selectedComponentIds: string[];
  correctComponentIds: string[];
  provenanceByCriterionId: Record<string, ComponentProvenance>;
  lastOutcomeKey: string | null;
  commitStatus: "not_committed" | "committing" | "committed";
}
```

This object is memory-only.

## 15. Battle 23 transient request

```ts
interface Battle23ClientRequest {
  schemaVersion: 1;
  requestId: string;
  normalizedText: string;
  taskId: "restore_agency_opening_plan";
}
```

`normalizedText` is accepted only after local validation. The request contains no player, browser, score, attempt or progress identifier.

## 16. Battle 23 response

```ts
interface Battle23ClassifierResponse {
  schemaVersion: 1;
  requestId: string;
  outcomeKey:
    | "unclear_goal_or_context"
    | "missing_constraint"
    | "missing_format"
    | "missing_success_criteria"
    | "unverified_information"
    | "full_success";
}
```

`unsafe_personal_data` is intentionally absent: it is local-only and must never require classifier access.

Response rejection conditions:

- unknown key;
- multiple keys;
- extra child-facing copy;
- request ID mismatch;
- wrong schema version;
- response too large;
- invalid JSON.

## 17. Local validation result

```ts
type LocalGateResult =
  | { ok: true; normalizedText: string }
  | {
      ok: false;
      code:
        | "local_empty"
        | "local_length"
        | "local_invalid_characters"
        | "local_pii_mission"
        | "local_pii_pattern"
        | "local_forbidden"
        | "local_unknown_token"
        | "local_out_of_scope";
      messageKey: string;
      editableText: string;
    };
```

The validator never returns or stores a matched sensitive substring.

## 18. Asset registry

```ts
interface AssetManifestEntry {
  assetId: string;
  type: "svg" | "webp" | "png" | "lottie" | "audio";
  sourcePath: string;
  usage: string[];
  width?: number;
  height?: number;
  durationMs?: number;
  transparent?: boolean;
  reducedMotionFallbackId?: string;
  license: string;
  priority: "must" | "should";
}
```

Every animation must have a static or reduced-motion fallback.

## 19. Schema fixtures

Required fixtures:

- pristine new journey;
- mid-campaign progress;
- completed journey;
- half-star best score;
- replay with lower score;
- replay with improved score;
- purchased/equipped cosmetics;
- already-applied transaction;
- old schema requiring migration;
- invalid/corrupt state;
- valid and invalid Battle 23 request/response pairs.
