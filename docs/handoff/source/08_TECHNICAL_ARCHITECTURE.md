# Technical Architecture

**Version:** 0.2  
**Date:** 02.09.2026  
**Status:** Review  
**Owner:** Engineering  
**Authority:** `PRODUCT_SPEC.md`, `09_DATA_SCHEMAS.md`, `10_AI_SAFETY_SPEC.md`

## 1. Architecture decision

Build a Hebrew RTL Single Page Application with a deterministic, data-driven game engine.

Use cloud runtime only for the closed Battle 23 classifier. Do not use authentication, user profiles, cloud progress entities, agents, connectors or open chat.

### Rationale

- The product explicitly requires immediate entry without account creation.
- One journey per browser is sufficient.
- Progress contains no collaborative or cross-device data.
- Static content is safer, faster and testable offline.
- Keeping progress in one local record eliminates a child-data backend.
- Battle 23 can fail safely into a deterministic half-open builder.

## 2. System context

| Boundary | Responsibility | Data handled |
|---|---|---|
| Browser SPA | UI, battle engine, local safety gate, scoring, persistence, audio/motion | approved static content; local progress; transient Battle 23 text |
| Static content bundle | Battle definitions, copy, outcomes, asset IDs | no user data |
| Base44 backend function | Classify already-approved Battle 23 text into a closed enum | transient allowlisted text only |
| Approved asset bundle | Images, animation fallbacks and audio | no user data |

Explicitly absent: authentication, database-backed player records, Base44 Agent, email, uploads, analytics containing text, public leaderboard and multiplayer.

## 3. Proposed project structure

```text
src/
  app/
    router/
    providers/
    error-boundary/
  components/
    ui/
    battle/
    map/
    workshop/
    accessibility/
  content/
    battles/
    regions/
    bonuses/
    cosmetics/
    copy/
    registry.ts
  engine/
    battle-machine/
    validation/
    scoring/
    rewards/
    unlocks/
  features/
    onboarding/
    campaign-map/
    battle-session/
    workshop/
    bonus/
    finale/
    settings/
  services/
    local-progress/
    audio/
    motion/
    battle23-classifier/
  schemas/
  assets/
  tests/
    unit/
    integration/
    e2e/
base44/
  config.jsonc
  functions/
    classify-battle-23/
      function.jsonc
      index.ts
```

This is a target structure for build planning. Base44 project initialization is still pending.

## 4. Runtime state layers

| Layer | Lifetime | Examples | Persistence |
|---|---|---|---|
| Static content | build/version | battle definitions, copy, asset mappings | bundled |
| Global settings | browser journey | music, effects, reduced motion | local |
| Campaign progress | browser journey | next battle, best scores, wallet, cosmetics | local |
| Battle session | current battle | attempt index, selected components, provenance | memory only |
| Battle 23 draft | active final battle only | text, local-gate result, last outcome | memory only |
| Network request | one classifier call | request ID, safe text, response enum | memory only |

No battle-session or free-text state may be copied into the persistent record.

## 5. Navigation model

Primary routes:

- `/` — start/continue.
- `/recruit` — character selection and first briefing.
- `/map` — campaign map.
- `/battle/:battleId` — battle shell.
- `/workshop/:visitId` — cosmetic workshop.
- `/bonus/:bonusId` — optional bonus.
- `/finale` — certification.
- `/settings` may be a route or modal, but must preserve return context.

Route guards are local and deterministic:

- locked battle IDs redirect to the map with a textual notice;
- a completed battle is replayable;
- direct refresh of an active battle reloads the battle start checkpoint;
- refresh of Battle 23 clears the draft;
- invalid IDs redirect safely without changing progress.

## 6. Battle engine

Every battle runs through a state machine, not ad-hoc component flags.

```text
briefing
  -> scan
  -> compose
  -> dispatch
  -> outcome
  -> feedback
  -> compose | guided_builder | victory
  -> score
  -> map/workshop/bonus/finale
```

Required invariants:

- one active state at a time;
- every transition is declared and testable;
- only `victory -> score` can commit a battle result;
- unsafe input can transition directly to a local safety state;
- a technical failure cannot transition to a punitive score;
- a repeated dispatch cannot commit twice;
- correct components persist within the active session.

### Post-region route resolution

After a region-combo score is committed, navigation is deterministic:

1. open the workshop identified by `reward.unlockWorkshopVisitId`;
2. allow an immediate skip or one purchase/equip flow;
3. if a `BonusDefinition.afterRegionId` matches the completed region, offer that bonus once;
4. allow the bonus to be skipped without changing campaign progress;
5. return to the map with `reward.unlockRegionId` and the next battle available.

The bonus route is derived from `BonusDefinition.afterRegionId`; it is not duplicated in `BattleReward`. Regions 1–3 follow workshop → optional bonus → map. Region 4 follows workshop → finale and has no bonus.

## 7. Content registry

- Battle content is imported from static version-controlled objects.
- Validate all objects against the schema during development/build.
- Production startup must fail closed to an accessible content-error screen if required content is missing.
- Never call AI to fill missing copy, options, outcomes or assets.
- Every `assetId`, `skillCode`, `battleType` and `outcomeKey` must exist in its registry.
- Keep visible Hebrew copy separate from engine IDs.

## 8. Scoring

Formula:

```text
score = 1 + criterion1 + criterion2 + criterion3 + criterion4
criterionN ∈ {0, 0.5, 1}
```

Component provenance:

- `user_independent` → 1.
- `user_choice_two` → 0.5.
- `system_completed` → 0.

Rules:

- score uses the demonstrated final solution;
- time, attempts, hint views and technical failures do not automatically reduce it;
- best score is monotonic;
- earned-star delta is `max(0, newScore - previousBest)`;
- reward commit and best-score update occur in one local-record write.

## 9. Idempotent local transactions

Persist the entire campaign state under one versioned storage key. Apply a pure reducer to an in-memory validated state and serialize once.

Deterministic transaction IDs:

- `battle_best:<battleId>:<scoreHalfUnits>`
- `bonus_reward:<bonusId>`
- `cosmetic_purchase:<itemId>`
- `region_unlock:<regionId>`

Before applying any effect, check `appliedTransactionIds`. If present, return the unchanged state.

For scores, store half-star values as integers from 2 through 10 to avoid floating-point comparison errors. Display value is `scoreHalfUnits / 2`.

## 10. Persistence and migration

- One canonical key: `ai_heroes_progress_v1`.
- Settings may be inside the same record to ensure one validated write.
- Validate on every load.
- Unknown fields are ignored.
- Invalid optional fields revert to defaults.
- Invalid critical structure creates a recoverable backup string in memory for the current load only, then starts a clean journey after user confirmation.
- Schema version changes require explicit migration functions and fixture tests.
- “מסע חדש” requires confirmation and removes only application-owned keys.

Do not scan or delete broad local storage.

## 11. Battle 23 call flow

1. Keep draft in component/session memory.
2. Normalize locally.
3. Run deterministic length, character, forbidden-pattern and allowlist checks.
4. On failure, remain local and show an approved message.
5. On pass, send only normalized task text to the backend function.
6. Backend repeats structural validation and invokes the configured model/integration.
7. Parse against the strict response schema.
8. Reject unknown/multiple keys.
9. Map the validated key to local approved copy and assets.
10. On timeout/error, offer retry or half-open builder with no score penalty.

No request or response body is written to application logs or analytics.

## 12. Backend function contract

Logical name: `classify-battle-23`.

Responsibilities:

- accept only the documented request schema;
- enforce maximum request size;
- reject disallowed fields;
- repeat task-boundary checks;
- call the classifier with fixed system instructions;
- request one enum value only;
- validate and return the documented response envelope;
- impose a short timeout;
- expose generic error codes without echoing input.

Non-responsibilities:

- store prompts;
- generate player-facing copy;
- run a conversation;
- create arbitrary world actions;
- decide score;
- identify a user;
- retry indefinitely.

Exact Base44 SDK methods must be verified against the installed project version when implementation starts; do not infer unsupported APIs in advance.

## 13. Error handling

| Failure | User behavior | Data behavior |
|---|---|---|
| Static asset missing | placeholder preserving meaning | no progress change |
| Audio failure | continue muted | save only setting if changed |
| Invalid battle content | accessible error + map | no fabricated content |
| Corrupt local state | safe recovery/new-journey confirmation | no cloud upload |
| Classifier timeout | retry or half-open builder | draft remains only on current screen |
| Invalid classifier response | treat as technical error | no outcome execution |
| Browser refresh | load approved checkpoint | no duplicate reward |
| Storage quota/write failure | explain local save failure before navigation | do not claim save succeeded |

## 14. Accessibility architecture

- RTL is configured at document root.
- Focus management is part of each state transition.
- Dynamic feedback uses appropriate live-region behavior without interrupting typing.
- All drag/sort interactions expose button/keyboard alternatives.
- Motion and audio services provide global observable settings.
- Reduced motion changes presentation only.
- Semantic controls are native elements where possible.

## 15. Performance budget

Targets for a mid-range mobile device:

- initial critical UI usable in ≤ 3 seconds on ordinary mobile connection;
- route/battle transition feedback begins within 100ms;
- no runtime image larger than needed for its responsive slot;
- lazy-load region assets before region entry;
- preload only the next battle's critical assets;
- audio files compressed and decoded on demand;
- outcome animation remains smooth without blocking interaction;
- classifier waiting screen has a bounded timeout and accessible status.

Exact Web Vitals thresholds will be added to the release checklist.

## 16. Observability and privacy

Allowed aggregate events, if analytics are enabled:

- screen ID;
- battle ID;
- outcome key;
- completion;
- numeric score;
- technical error code;
- device-layout category;
- accessibility setting state.

Forbidden:

- free text;
- selected personal-looking tokens;
- raw classifier request or response;
- complete local progress object;
- IP/location enrichment initiated by the app;
- stable child/user identifier.

Analytics is optional for the competition version and must not block gameplay.

## 17. Deployment gates

- No Base44 CLI project operation is authorized by this document alone.
- At build start, authenticate and initialize/link using the supported local CLI workflow.
- Use a frontend-and-backend template because Battle 23 needs one backend function.
- Build before deployment.
- Generate types after resource changes.
- Deploy first to a test app/environment where possible.
- Never deploy with unresolved safety tests.
