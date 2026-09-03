# Base44 Handoff — README, Authority and Build Order

**Product:** סוכנות גיבורי ה־AI  
**Version:** 0.6  
**Date:** 02.09.2026  
**Status:** Review  
**Owner:** Product owner + Codex  
**Supersedes:** none

## 1. Purpose

This package is the implementation contract for the Base44 build. It must contain enough approved product, content, design, architecture, safety and test detail that the builder does not invent missing behavior.

`PRODUCT_SPEC.md` remains the highest product authority. Files in this package decompose it into buildable requirements; they may clarify but must not contradict it.

## 2. Authority order

When two sources conflict, use this order:

1. Competition, child-safety and privacy constraints.
2. Approved decisions and `MUST` requirements in `01_PRODUCT_SPEC.md`.
3. Explicit `CODEX OVERRIDES` in an approved battle specification.
4. Approved schemas and enum registries in `09_DATA_SCHEMAS.md`.
5. Approved battle content objects.
6. Approved UX and design-system documents.
7. `SHOULD` requirements.
8. Draft examples and proposals.

Never resolve an unresolved material conflict by guessing. Record it as:

`BLOCKER: <source A> conflicts with <source B>; decision required: <exact question>.`

## 3. Package inventory

| File | Purpose | Current status | Dependency |
|---|---|---|---|
| `00_README_BUILD_ORDER.md` | Authority, build sequence, change control and Done | Review | none |
| `01_PRODUCT_SPEC.md` | Product source of truth | Approved v3 | none |
| `02_CONTENT_BIBLE.md` | World, characters, tone, terminology and continuity | Review | final battle copy |
| `03_CAMPAIGN_MAP.md` | Locked 23-battle sequence and learning curve | Approved | none |
| `04_BATTLE_CONTENT/` | Full data object for each battle | Complete: 23/23 approved | none |
| `05_UX_FLOWS.md` | Navigation, states, recovery and return paths | Pending integration | Claude Design |
| `06_DESIGN_SYSTEM.md` | Tokens, components, RTL and responsive behavior | Pending integration | Claude Design |
| `07_ASSET_MANIFEST.md` | Visual/audio assets, states, formats and licensing | Partial | Claude Design |
| `08_TECHNICAL_ARCHITECTURE.md` | Runtime boundaries, modules, state and fallbacks | Review | Base44 project creation |
| `09_DATA_SCHEMAS.md` | Static content and local progress contracts | Review | battle content |
| `10_AI_SAFETY_SPEC.md` | Battle 23 local gate and closed classifier | Review | exact allowlist |
| `11_ACCESSIBILITY_CHECKLIST.md` | Testable RTL, input, audio and motion rules | Review | final UI |
| `12_TEST_PLAN.md` | Unit, integration, E2E, device and safety tests | Review | implementation |
| `13_ACCEPTANCE_CRITERIA.md` | Release gates mapped to requirements | Review | all documents |
| `14_BASE44_BUILD_PROMPT.md` | Final build instruction | Pending | all blockers closed |
| `15_RELEASE_CHECKLIST.md` | Pre-submission verification | Pending | working build |

## 4. Current blockers

| ID | Blocker | Owner | Closing artifact |
|---|---|---|---|
| B-02 | Visual direction and final component tokens are not yet approved | Claude Design + human review | `05`, `06`, `07` |
| B-03 | Exact normalized-token allowlist for Battle 23 is not yet enumerated | Codex after final copy | `10_AI_SAFETY_SPEC.md` |
| B-04 | Base44 project is not initialized or linked in this workspace | Human + Codex at build start | `base44/config.jsonc` |
| B-05 | Full-path measured duration is not yet validated with users | QA | test report |

These blockers prevent final release, but do not prevent preparation of architecture, schemas and tests.

Closed in Version 0.6: `B-01` — all 23 Production battle specifications are present and reviewed.

## 5. Architectural commitments

- The application is a client-side SPA.
- No account, authentication flow, user profile or cloud progress record.
- No Base44 Agent and no open chat.
- Battles 1–22 use reviewed static content only.
- Battle 23 is the only AI-assisted runtime path.
- Progress and settings remain local to one browser journey.
- Free text is never persisted, logged or sent to analytics.
- A server-side function may classify Battle 23 only after the client-side safety gate passes.
- Runtime AI returns a validated closed enum, never free-form child-facing output.
- Static approved copy and animation mappings determine every visible result.

## 6. Build order

### Phase 0 — Preconditions

1. Close B-02 and B-03.
2. Approve document versions and freeze IDs.
3. Initialize or link a Base44 project only after the final package is ready.
4. Generate TypeScript types after any Base44 resource definitions are added.

### Phase 1 — Static shell

1. SPA routing and global RTL document setup.
2. app shell, error boundary and responsive layout.
3. settings service: music, effects and reduced motion.
4. content registry loader with schema validation.
5. versioned local progress store and migration.

**Gate G1:** app opens at 360px, keyboard navigation works, invalid local state safely resets or migrates.

### Phase 2 — Core game engine

1. map state and battle unlocking.
2. battle state machine.
3. prompt-component provenance.
4. scoring and personal-best delta.
5. idempotent rewards and workshop purchases.
6. six-attempt help ladder and guided completion.

**Gate G2:** deterministic fixture battles can be completed, replayed and refreshed without duplicate rewards.

### Phase 3 — Content

1. implement Battle 1 as the reference vertical slice.
2. load and validate battles 2–22 from content objects.
3. implement bonuses and four workshop visits.
4. verify campaign time and battle-type variety.

**Gate G3:** the entire campaign can be completed without Battle 23 AI and without missing content.

### Phase 4 — Battle 23

1. local normalization and allowlist gate.
2. classifier backend function.
3. strict response schema and enum validation.
4. closed outcome mapper.
5. timeout and half-open-builder fallback.
6. prompt-memory deletion paths.

**Gate G4:** unsafe/unknown input never reaches the classifier; network failure never blocks completion or lowers score.

### Phase 5 — Design integration

1. approved tokens and assets.
2. all interaction states.
3. reduced-motion and muted variants.
4. 360px, 390px, tablet and desktop layouts.

**Gate G5:** visual regression and accessibility checklist pass.

### Phase 6 — Release

1. full E2E and safety suite.
2. performance and asset optimization.
3. license review.
4. measured journey validation.
5. release checklist and submission build.

## 7. Change control

- IDs, enum values, storage keys and transaction rules are frozen once implementation starts.
- Copy changes may not silently change scoring, safety or valid states.
- Schema changes require a version increment and migration/test update.
- An approved design change may change presentation but not game semantics.
- Battle-content changes require updating the content object, its tests and relevant acceptance criteria together.
- Every change after package approval must record: date, owner, files affected, reason and tests rerun.

## 8. Definition of Done

The product is Done only when:

- exactly 23 battles are active and ordered correctly;
- the full journey completes independently in 50–58 measured minutes;
- all progress, scoring and purchases survive refresh without duplication;
- all routes work at 360px, keyboard-only, muted and reduced-motion;
- unsafe or unknown Battle 23 input is blocked before network access;
- free text is absent from storage, logs and analytics;
- all `MUST` requirements are linked to passing tests;
- all assets are original or properly licensed;
- no unresolved `BLOCKER` remains.
