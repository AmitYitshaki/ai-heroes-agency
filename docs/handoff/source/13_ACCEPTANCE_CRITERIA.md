# Acceptance Criteria and Traceability

**Version:** 0.5  
**Date:** 02.09.2026  
**Status:** Review  
**Owner:** Product + Engineering + QA  
**Purpose:** Map release requirements to objective evidence

## 1. Status meanings

- **Ready:** fully specified and testable now.
- **Pending content:** requires non-battle workshop, bonus or dialogue details.
- **Pending design:** requires Claude Design output.
- **Pending implementation:** testable after build.
- **Blocker:** must close before final Base44 build prompt/release.

## 2. Product and campaign

| Requirement | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| AC-PROD-001 | Product launches directly without registration, account, name or personal-data form | E2E start flow + route inventory | Pending implementation |
| AC-PROD-002 | Exactly 23 battles are ordered tutorial + 6/6/5/4 + final | T-CONT-001..003 | Ready |
| AC-PROD-003 | Only next battle unlocks; completed battles replay | T-STORE-003..004 | Pending implementation |
| AC-PROD-004 | Character can change without progress loss or capability difference | T-STORE-002 + content comparison | Pending implementation |
| AC-PROD-005 | Full measured journey is 50–58 minutes | pilot timing report | Blocker B-05 |
| AC-PROD-006 | No teacher, parent, chat, multiplayer or public leaderboard surfaces exist | route/component audit | Pending implementation |
| AC-PROD-007 | All scenarios stay child-safe and non-violent | content safety audit | Ready |

## 3. Content and pedagogy

| Requirement | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| AC-CONT-001 | Every battle object contains all required fields | T-CONT-004 | Ready |
| AC-CONT-002 | Every outcome explains a direct prompt-to-world cause | T-CONT-007 | Ready |
| AC-CONT-003 | Every factual correct answer is provable on screen | T-CONT-008 | Ready |
| AC-CONT-004 | No runtime text/content is invented to fill gaps | T-CONT-009 + source audit | Ready |
| AC-CONT-005 | Every battle has four score criteria and full help ladder | T-CONT-005 + T-ENG-004..006 | Ready |
| AC-CONT-006 | Skill coverage matches `03_CAMPAIGN_MAP.md` | campaign matrix validation | Ready |
| AC-CONT-007 | No two consecutive battles repeat both type and skill | T-CONT-010 | Ready |
| AC-CONT-008 | Battle 1 demonstrates complete scan→result→improve→victory loop | Battle 1 E2E | Ready spec |
| AC-CONT-009 | Battle 23 combines goal, context, constraint, format, criterion, verification and privacy | Battle 23 fixtures | Ready spec |

## 4. Engine and scoring

| Requirement | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| AC-ENG-001 | Battle flow uses declared state transitions only | T-ENG-001..002 | Pending implementation |
| AC-ENG-002 | Correct parts persist across retries and guided transition | T-ENG-003..006 | Pending implementation |
| AC-ENG-003 | Unsafe state bypasses ordinary attempt ladder | T-ENG-007 | Pending implementation |
| AC-SCORE-001 | Score is base + four criteria in half-star increments | T-SCORE-001..003 | Pending implementation |
| AC-SCORE-002 | Final action provenance determines each criterion | score unit fixtures | Pending implementation |
| AC-SCORE-003 | Time, attempts and hints do not automatically lower score | T-SCORE-004 | Pending implementation |
| AC-SCORE-004 | Replay grants only positive improvement delta | T-SCORE-005..007 | Pending implementation |
| AC-SCORE-005 | Double actions/refresh cannot duplicate rewards | T-SCORE-008 + T-REL-006..007 | Pending implementation |
| AC-SCORE-006 | Score always displays stars and numeric value | T-SCORE-009 + visual inspection | Pending design |

## 5. Persistence and economy

| Requirement | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| AC-DATA-001 | Progress is stored locally under one versioned application key | T-STORE-001, 006 | Pending implementation |
| AC-DATA-002 | No prompt, free text or attempt history is persistent | T-STORE-012 + storage inspection | Pending implementation |
| AC-DATA-003 | Refresh preserves progress but resets active draft/session as specified | T-STORE-005 + T-AI-017 | Pending implementation |
| AC-DATA-004 | Corrupt/old state recovers or migrates safely | T-STORE-010..011 | Pending implementation |
| AC-DATA-005 | New journey requires confirmation and deletes only app keys | T-STORE-009 | Pending implementation |
| AC-SHOP-001 | Four visits, three items each and approved prices | T-SHOP-001..003 | Pending content/design |
| AC-SHOP-002 | Purchases are cosmetic, balance-checked and idempotent | T-SHOP-004..006 | Pending implementation |
| AC-BONUS-001 | Three optional bonuses have random question type, fixed 2-star reward and deterministic post-region routing | T-BONUS-001..005 | Pending content |

## 6. AI and privacy

| Requirement | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| AC-AI-001 | Battles 1–22 make no runtime AI request | network test across campaign | Pending implementation |
| AC-AI-002 | Battle 23 blocked input creates zero network requests | T-AI-001..008 + network capture | Pending implementation |
| AC-AI-003 | Unknown tokens, including ordinary names, are blocked by local allowlist | T-AI-005 | Blocker B-03 |
| AC-AI-004 | Classifier receives only normalized schema-limited task text | T-AI-009..010 | Pending implementation |
| AC-AI-005 | Classifier returns exactly one allowed non-PII outcome key | T-AI-011..012 | Pending implementation |
| AC-AI-006 | All visible output comes from approved local content | T-AI-013 | Pending implementation |
| AC-AI-007 | Outcome precedence is deterministic | T-AI-014 | Pending implementation |
| AC-AI-008 | Timeout/offline offers fallback and does not lower score | T-AI-015..016, 020 | Pending implementation |
| AC-AI-009 | Free text is absent from storage, URL, analytics, console and logs | T-AI-017..018 | Pending implementation |
| AC-AI-010 | Half-open builder preserves correct components and guarantees victory | T-AI-019..020 + T-ENG-006 | Pending implementation |

## 7. Accessibility and responsive design

| Requirement | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| AC-A11Y-001 | Complete journey works at 360px with no horizontal scroll | T-A11Y-002 | Pending design |
| AC-A11Y-002 | Hebrew RTL and mixed-direction strings are correct | T-A11Y-001 | Pending design |
| AC-A11Y-003 | Complete representative flows are keyboard operable | T-A11Y-004..006 | Pending design |
| AC-A11Y-004 | Contrast, grayscale meaning and focus meet checklist | T-A11Y-005, 007..008 | Pending design |
| AC-A11Y-005 | Touch targets are at least 44×44 | T-A11Y-013 | Pending design |
| AC-A11Y-006 | Screen reader receives headings, status, feedback and numeric score | T-A11Y-009 | Pending design |
| AC-A11Y-007 | Entire journey completes muted | T-A11Y-010 | Pending implementation |
| AC-A11Y-008 | Reduced motion preserves all information and progress | T-A11Y-011..012 | Pending design |
| AC-A11Y-009 | Mobile keyboard does not hide Battle 23 actions | T-A11Y-014 | Pending design |
| AC-A11Y-010 | Safety states are static, calm and not color-only | T-A11Y-015 | Pending design |

## 8. Reliability and performance

| Requirement | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| AC-REL-001 | Asset/audio failures have non-blocking fallbacks | T-REL-001..002 | Pending implementation |
| AC-REL-002 | Technical errors never falsely claim persistence | copy audit + T-REL-004 | Ready spec |
| AC-REL-003 | Errors provide safe retry/map/fallback path | T-REL-003..005 | Pending implementation |
| AC-PERF-001 | Critical UI meets documented mobile load target | T-PERF-001 | Pending implementation |
| AC-PERF-002 | Interactions acknowledge within 100ms | T-PERF-002 | Pending implementation |
| AC-PERF-003 | Assets are responsive, lazy-loaded and do not block interaction | T-PERF-003..005 | Pending design |
| AC-PERF-004 | Final bundle and route budgets are documented and pass | T-PERF-006 | Pending implementation |

## 9. Audio, animation and assets

| Requirement | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| AC-MEDIA-001 | Map/base and battle music plus required effects exist | asset/audio manifest audit | Pending design |
| AC-MEDIA-002 | Separate music/effects controls persist locally | A11Y-AUD-01, 05 tests | Pending implementation |
| AC-MEDIA-003 | One main animation at a time; outcomes 2–4 seconds | timeline inspection | Pending design |
| AC-MEDIA-004 | Repeated animation shortens/skips; no flashing | T-A11Y-011..012 | Pending design |
| AC-MEDIA-005 | Every animation has reduced-motion/static fallback | asset registry validation | Pending design |
| AC-MEDIA-006 | Every asset is original or properly licensed | license manifest | Blocker before release |

## 10. Final release decision

Release approval requires:

1. all currently listed Blockers B-02 through B-05 closed;
2. every acceptance row moved to Passed or explicitly Deferred outside competition scope;
3. zero failed AI/privacy and accessibility `MUST` tests;
4. complete full-journey evidence;
5. approved `14_BASE44_BUILD_PROMPT.md` and `15_RELEASE_CHECKLIST.md`;
6. Product owner sign-off.

Battle content is complete. This traceability document must next be updated when Claude Design outputs are integrated.
