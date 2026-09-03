# Test Plan

**Version:** 0.2  
**Date:** 02.09.2026  
**Status:** Review  
**Owner:** Engineering + QA + Content  
**Scope:** Competition release

## 1. Objectives

Prove that:

- the complete 23-battle journey is playable and deterministic except for approved bonus selection and the closed classifier;
- progress, score and purchases are correct and idempotent;
- unsafe Battle 23 input never reaches the network;
- the product is usable at 360px, RTL, keyboard-only, muted and reduced motion;
- no missing content is generated at runtime;
- the journey meets the measured duration target.

## 2. Test layers

| Layer | Purpose | Expected automation |
|---|---|---|
| Schema/static validation | detect incomplete/invalid content before runtime | 100% automated |
| Unit | reducers, scoring, local gate, selection logic | automated |
| Component | states, focus, copy, responsive components | automated + visual |
| Integration | battle machine, persistence, classifier adapter | automated |
| E2E | complete flows, refresh, rewards, accessibility settings | automated |
| Manual exploratory | Hebrew readability, animation, audio, child comprehension | manual |
| Security/privacy | network/log/storage inspection and malformed input | automated + manual |
| Performance | loading, asset and interaction budgets | automated + device |

## 3. Environments

- local development with deterministic fixtures;
- production-like preview with the real Base44 function;
- offline/throttled browser simulation;
- final deployed URL.

Do not run real classifier calls in ordinary unit tests. Use contract fixtures.

## 4. Required fixtures

- all 23 approved battle objects;
- each partial/unsafe/success state;
- every provenance level;
- new/mid/completed campaign progress;
- half-star scores;
- replay lower/equal/higher;
- each workshop visit and price;
- every bonus once and replay attempt;
- valid/invalid old storage versions;
- every Battle 23 outcome;
- network timeout, invalid JSON, unknown key and multiple-key classifier responses;
- missing asset/audio/content fixtures.

## 5. Static content tests

| ID | Test |
|---|---|
| T-CONT-001 | Exactly 23 battle objects exist |
| T-CONT-002 | Battle orders are unique and contiguous 1–23 |
| T-CONT-003 | Region distribution is tutorial + 6/6/5/4 + final |
| T-CONT-004 | Every battle has all required schema fields |
| T-CONT-005 | Every battle defines exactly four score criteria |
| T-CONT-006 | All enum, outcome, skill and asset references resolve |
| T-CONT-007 | Every partial outcome has a causal explanation |
| T-CONT-008 | Every factual answer is supported by on-screen material |
| T-CONT-009 | No runtime placeholder, TODO or AI-generated fallback copy exists |
| T-CONT-010 | Consecutive battle-type/skill variety rules pass |
| T-CONT-011 | Normal/combo/final times are within approved ranges |
| T-CONT-012 | Hebrew copy passes configured length/required-label checks |

## 6. Scoring and rewards

| ID | Test |
|---|---|
| T-SCORE-001 | Four independent criteria + base produce 5 stars |
| T-SCORE-002 | Four system-completed criteria + base produce 1 star |
| T-SCORE-003 | Half-unit arithmetic never uses floating-point persistence |
| T-SCORE-004 | Attempts, elapsed time and viewed hints do not alter score directly |
| T-SCORE-005 | First score grants full score |
| T-SCORE-006 | Lower/equal replay grants zero |
| T-SCORE-007 | Improved replay grants exact delta |
| T-SCORE-008 | Refresh/double-click cannot grant twice |
| T-SCORE-009 | Numeric score and star representation agree |
| T-SCORE-010 | Technical classifier fallback preserves earned provenance |

## 7. Progress storage

| ID | Test |
|---|---|
| T-STORE-001 | New journey defaults validate |
| T-STORE-002 | Character switch preserves progress |
| T-STORE-003 | Completion unlocks only the next battle |
| T-STORE-004 | Direct navigation to locked battle redirects without mutation |
| T-STORE-005 | Refresh restores approved checkpoint |
| T-STORE-006 | One serialized transaction updates best, total and wallet consistently |
| T-STORE-007 | Applied transaction ID makes repeated action a no-op |
| T-STORE-008 | Cosmetic purchase validates balance and cannot duplicate |
| T-STORE-009 | New journey removes only application-owned storage after confirmation |
| T-STORE-010 | Invalid record fails safely and never uploads |
| T-STORE-011 | Migration fixtures preserve valid progress |
| T-STORE-012 | Persistent record contains no free text or attempt history |

## 8. Battle state machine

| ID | Test |
|---|---|
| T-ENG-001 | Only declared transitions are accepted |
| T-ENG-002 | Only victory→score commits completion |
| T-ENG-003 | Correct components persist across retry |
| T-ENG-004 | Step 4 presents exactly two meaningful options |
| T-ENG-005 | Step 6 preserves correct parts and assists one missing part |
| T-ENG-006 | Guided builder guarantees victory |
| T-ENG-007 | Safety state bypasses ordinary attempt ladder |
| T-ENG-008 | Repeated dispatch cannot execute concurrent commits |
| T-ENG-009 | Battle refresh starts at specified checkpoint |
| T-ENG-010 | Missing content stops safely rather than inventing behavior |

## 9. Workshop and bonuses

| ID | Test |
|---|---|
| T-SHOP-001 | Exactly four visits open after the correct regions |
| T-SHOP-002 | Each visit presents exactly three items |
| T-SHOP-003 | Prices are 5/8/12 for visits 1–3 and 4/8/12 for visit 4 |
| T-SHOP-004 | Insufficient balance prevents purchase and explains why |
| T-SHOP-005 | Purchase is cosmetic and does not change score/abilities |
| T-SHOP-006 | Purchased/equipped items survive refresh |
| T-BONUS-001 | Bonuses appear only after regions 1–3 |
| T-BONUS-002 | Category/question can be random but reward is always 2 stars |
| T-BONUS-003 | Bonus reward is granted once |
| T-BONUS-004 | Bonus can be skipped without blocking campaign |
| T-BONUS-005 | Region 1–3 completion follows workshop → matching optional bonus → map; Region 4 follows workshop → finale |

## 10. Battle 23 safety and classifier

| ID | Test |
|---|---|
| T-AI-001 | Empty/short input remains local |
| T-AI-002 | Over-600 input remains local |
| T-AI-003 | Mission PII marker remains local |
| T-AI-004 | Phone/email/URL/long digits remain local |
| T-AI-005 | Unknown Hebrew name/token remains local |
| T-AI-006 | Forbidden content remains local |
| T-AI-007 | Prompt injection/out-of-scope request remains local |
| T-AI-008 | Control/zero-width/unsupported characters remain local |
| T-AI-009 | Valid allowlisted input creates one classifier request |
| T-AI-010 | Request contains only schema version, request ID, task ID and normalized text |
| T-AI-011 | `unsafe_personal_data` is never accepted from classifier |
| T-AI-012 | Unknown/multiple/prose response fails closed |
| T-AI-013 | Every valid key maps to approved local copy/assets |
| T-AI-014 | Outcome precedence is deterministic |
| T-AI-015 | Timeout/offline offers retry and builder |
| T-AI-016 | Technical fallback does not lower score |
| T-AI-017 | Refresh/exit deletes draft |
| T-AI-018 | Storage, URL, analytics, console and logs contain no draft |
| T-AI-019 | Repeated unknown-token blocks can open builder without network |
| T-AI-020 | Full Battle 23 can complete with classifier unavailable |

## 11. Accessibility and RTL

Automate semantic, contrast and focus checks where possible; manual verification remains required.

| ID | Test |
|---|---|
| T-A11Y-001 | Root Hebrew/RTL and mixed-direction strings render correctly |
| T-A11Y-002 | Complete journey at 360px without horizontal scroll |
| T-A11Y-003 | 200% zoom preserves content/actions |
| T-A11Y-004 | Keyboard completes representative normal, combo and Battle 23 flows |
| T-A11Y-005 | Focus is visible and managed after each state transition |
| T-A11Y-006 | Drag/sort has click/keyboard alternative |
| T-A11Y-007 | Text/background and component contrast meet thresholds |
| T-A11Y-008 | All state meaning survives grayscale |
| T-A11Y-009 | Screen reader announces headings, score, feedback and loading once |
| T-A11Y-010 | Entire journey completes muted |
| T-A11Y-011 | Reduced motion removes strong movement without losing information |
| T-A11Y-012 | No flashing asset or CSS effect exists |
| T-A11Y-013 | Touch targets meet 44×44px |
| T-A11Y-014 | On-screen keyboard does not hide Battle 23 field/counter/submit |
| T-A11Y-015 | Safety messages are calm, actionable and not color-only |

## 12. Reliability and recovery

| ID | Test |
|---|---|
| T-REL-001 | Missing image uses meaningful fallback |
| T-REL-002 | Audio decode failure continues muted |
| T-REL-003 | Classifier timeout is bounded |
| T-REL-004 | localStorage write failure does not claim success |
| T-REL-005 | Error boundary provides safe map/reload path |
| T-REL-006 | Browser back/forward cannot duplicate commit |
| T-REL-007 | Rapid repeated CTA activation is debounced/idempotent |

## 13. Performance

| ID | Test |
|---|---|
| T-PERF-001 | Critical UI usable within target on mid-range mobile/throttled network |
| T-PERF-002 | Interaction acknowledgment begins within 100ms |
| T-PERF-003 | Only next-battle/region assets are preloaded |
| T-PERF-004 | No oversized source image is served to small slot |
| T-PERF-005 | Audio/animation does not block main interaction |
| T-PERF-006 | Full bundle and per-route asset budgets are documented before release |

## 14. Full-journey scenarios

1. New journey, hero, typical scores, all optional bonuses, one purchase per workshop, full final success.
2. New journey, heroine, guided completion in several battles, skip bonuses/workshop purchases.
3. Resume mid-journey after refresh and improve two prior best scores.
4. Complete with keyboard, muted and reduced motion.
5. Complete while classifier is unavailable using fallback.
6. Attempt duplicate rewards/purchases through refresh, back navigation and double click.

## 15. Human validation

Before release, run a small observed pilot with children in or near the target age range, with appropriate consent/setting and no collection of personal responses.

Measure:

- task comprehension without adult explanation;
- common misread instructions;
- battle completion time;
- full-journey duration;
- whether causal outcomes are understood;
- whether “מה זה אומר?” is sufficient;
- whether the child understands verification and privacy;
- fatigue/drop-off points.

Record aggregate findings only; do not retain free-text prompts.

## 16. Entry and exit criteria

Entry:

- approved package version;
- schemas frozen;
- battle fixtures available;
- design tokens available for visual testing.

Exit:

- all P0/P1 tests pass;
- every `MUST` acceptance criterion has evidence;
- all safety/network-inspection tests pass;
- no unresolved blocker;
- measured journey is 50–58 minutes;
- release checklist approved.
