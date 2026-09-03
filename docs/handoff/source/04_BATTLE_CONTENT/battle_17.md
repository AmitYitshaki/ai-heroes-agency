# battle_17.md — צעד אחר צעד

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_17`, canonical villain naming and the complete content-object contract.
- Turned “controlled iteration” into four observable behaviors: compare versions, detect multiple changes, restore the baseline and test one change.
- Replaced the single-card shortcut with an explicit baseline/test comparison and causal check.
- Removed disappearing choices, attempt-based scoring, constant criteria, color-only locked states and network-error copy from this offline battle.
- Replaced uncontrolled flying-block imagery with safe, reversible sorting-station outcomes.
- Added the complete help ladder, deterministic precedence and ten acceptance tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_17` |
| `regionId` | `command_maze` |
| `order` | 17 |
| title | צעד אחר צעד |
| villain | תסבוכת |
| `skillCodes` | `["controlled_iteration"]` |
| `battleType` | `robot_test` |
| real-world need | לבודד שינוי אחד בזמן אבחון כדי להבין מה השפיע על התוצאה |
| objective | לחזור לגרסת בסיס ולבדוק שינוי יחיד משיטת מיון לפי צורה למיון לפי צבע |
| `estimatedSeconds` | 105 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "static_results", "no_runtime_ai", "no_network"]` |

## 3. Story and learning

תחנת המיון צריכה לחלק שישה כרטיסי ניווט אדומים וכחולים לשתי מגירות קטנות לפי צבע. גרסת הבסיס של לופּ שומרת על שתי המגירות, אך ממיינת לפי צורה. תסבוכת שינה יחד את שיטת המיון, גודל המגירות והוספת המדבקות; התוצאה החדשה אינה מאפשרת לבדוק בצורה נקייה איזה שינוי פתר את הבעיה.

Learning objective: when diagnosing a result, return to a known baseline, change one relevant component and compare the new result. This is a controlled test, not a universal rule that every future edit must contain only one change.

Primary instruction:

> חזרו לגרסת הבסיס ובדקו שינוי אחד בלבד.

## 4. Approved task material

Displayed criterion:

> חלקו שישה כרטיסים אדומים וכחולים לשתי מגירות קטנות לפי צבע.

| Version | Sort rule | Trays | Decoration | Static result |
|---|---|---|---|---|
| `b17_version_baseline` | לפי צורה | שתי מגירות קטנות | בלי מדבקות | trays fit, but red and blue cards are mixed |
| `b17_version_tangled` | לפי צבע | שלוש מגירות גדולות | הוסיפו מדבקות | some colors group correctly, but trays do not fit and labels are obscured |
| `b17_version_single_change` | לפי צבע | שתי מגירות קטנות | בלי מדבקות | all cards meet the displayed criterion |

All cards and results are pre-approved static content. The game never claims that generative AI produced them at runtime.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Present baseline and tangled result | „תסבוכת שינה כמה חלקים יחד. עכשיו קשה לבדוק מה עבד.” | `compare_versions` | 12s |
| `compare_versions` | Detect number of changes | „כמה רכיבים השתנו מגרסת הבסיס?” | feedback or `restore_baseline` | 18s |
| `restore_baseline` | Choose known starting point | „מאיזו גרסה כדאי להתחיל את הבדיקה?” | feedback or `choose_test` | 12s |
| `choose_test` | Select one controlled change | „בחרו גרסה שמשנה רק את שיטת המיון.” | `dispatch` | 20s |
| `dispatch` | Run static test | „מריץ בדיקת מיון…” | `outcome` | 3s |
| `outcome` | Show causal result | approved result + `המשך` | feedback or `causal_check` | 12s |
| `feedback` | Focus unresolved behavior | ladder + `חזרה` | unresolved state | 8s |
| `causal_check` | Explain isolation | „איך יודעים מה גרם לשיפור?” | retry or `victory` | 10s |
| `victory` | Score | „שינוי אחד אפשר השוואה ברורה.” | score/map | 10s |

## 6. Prompt components and choices

### Version comparison

| `componentId` | Label | Role |
|---|---|---|
| `b17_change_count_one` | „רכיב אחד” | distractor |
| `b17_change_count_two` | „שני רכיבים” | distractor |
| `b17_change_count_three` | „שלושה רכיבים” | correct: sort rule, trays and decoration |

### Baseline restoration

| `componentId` | Label | Role |
|---|---|---|
| `b17_restore_baseline` | „גרסת הבסיס” | correct known starting point |
| `b17_restore_tangled` | „הגרסה של תסבוכת” | distractor; contains three simultaneous changes |
| `b17_restore_blank` | „גרסה ריקה” | distractor; removes the known working parts |

### Controlled test

| `componentId` | Prompt | Role | Causal result |
|---|---|---|---|
| `b17_test_no_change` | „מיינו לפי צורה; שתי מגירות קטנות; בלי מדבקות” | no-change distractor | trays fit, but colors remain mixed |
| `b17_test_multi_change` | „מיינו לפי צבע; שלוש מגירות גדולות; בלי מדבקות” | multi-change distractor | color grouping improves, but tray-size fit also changes, so this is not an isolated test |
| `b17_test_sort_only` | „מיינו לפי צבע; שתי מגירות קטנות; בלי מדבקות” | correct | only the sort rule changes; result meets the criterion |

### Causal check

- Correct `b17_reason_one_difference`: „כי רק שיטת המיון השתנתה מהבסיס”.
- Distractor `b17_reason_newer_better`: „כי הגרסה החדשה תמיד טובה יותר”.
- Distractor `b17_reason_many_changes`: „כי ככל שמשנים יותר, קל יותר להבין”.

## 7. Valid, partial and unsafe states

- `validStates=[b17_valid]`.
- `partialStates=[b17_wrong_count,b17_wrong_baseline,b17_no_change,b17_multiple_changes,b17_wrong_reason]`.
- `unsafeStates=[]`.
- Correct version comparison and restored baseline persist throughout the active battle.

## 8. Deterministic precedence and outcomes

Priority: change detection → baseline restoration → single-change test → causal check → success.

| `stateId` | Condition | `outcomeKey` | World/UI result | Feedback |
|---|---|---|---|---|
| `b17_wrong_count` | one/two changes selected | `b17_changes_unaccounted` | three labelled differences receive static markers | „בדקו שיטת מיון, מגירות וקישוט. יותר מרכיב אחד השתנה.” |
| `b17_wrong_baseline` | tangled/blank selected | `b17_baseline_not_restored` | known baseline remains beside selected version | „כדי להשוות, התחילו מהגרסה שכבר בדקנו.” |
| `b17_no_change` | baseline prompt dispatched unchanged | `b17_colors_still_mixed` | shapes group while red/blue cards remain mixed | „לא שיניתם את שיטת המיון, ולכן התוצאה נשארה לפי צורה.” |
| `b17_multiple_changes` | sort rule and tray size changed | `b17_test_not_isolated` | color groups appear in oversized trays that do not fit the station | „שיניתם גם מיון וגם מגירות. זו אינה בדיקה של שינוי אחד.” |
| `b17_wrong_reason` | causal distractor selected | `b17_cause_unresolved` | successful result remains; explanation panel stays open | „השיפור ניתן לבידוד כי רק רכיב אחד השתנה.” |
| `b17_valid` | three changes identified, baseline restored, sort-only test and reason correct | `full_success` | six cards are grouped by color in two fitting trays | „נכון. שמרתם את הבסיס ושיניתם רק את הרכיב שבדקתם.” |

## 9. Feedback ladder

1. „הבדיקה עדיין אינה מבודדת שינוי אחד. נסו שוב.”
2. Show the current static result and name the unresolved comparison behavior.
3. „השוו כל רכיב לגרסת הבסיס.”
4. Statically emphasize the unresolved area and offer exactly two meaningful choices.
5. „שמרו את החלקים שעבדו ושנו רק את שיטת המיון.”
6. Preserve correct work; mark the remaining correct choice with icon, border and text.
7. Guided completion applies only the unresolved choice and guarantees victory.

No option disappears or flashes. Attempts, time and hints do not directly affect score.

## 10. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b17_score_detect_changes` | Identify all three simultaneous changes | `user_independent` | `user_choice_two` | `system_completed` |
| `b17_score_restore_baseline` | Return to the known baseline | `user_independent` | `user_choice_two` | `system_completed` |
| `b17_score_single_change` | Change only the sort rule | `user_independent` | `user_choice_two` | `system_completed` |
| `b17_score_cause` | Explain how one difference isolates the cause | `user_independent` | `user_choice_two` | `system_completed` |

## 11. Copy registry

- `title`: „צעד אחר צעד”
- `comic_setup`: „תסבוכת שינה כמה חלקים יחד. עכשיו קשה לבדוק מה עבד.”
- `instruction_primary`: „חזרו לגרסת הבסיס ובדקו שינוי אחד בלבד.”
- `compare_instruction`: „כמה רכיבים השתנו מגרסת הבסיס?”
- `restore_instruction`: „מאיזו גרסה כדאי להתחיל את הבדיקה?”
- `test_instruction`: „בחרו גרסה שמשנה רק את שיטת המיון.”
- `causal_instruction`: „איך יודעים מה גרם לשיפור?”
- `concept_help`: „באבחון, שינוי אחד בכל בדיקה מאפשר השוואה ברורה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 12. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b17_sorting_station` | maze sorting station | static |
| `ui_b17_version_compare` | baseline/tangled component comparison | semantic HTML |
| `ui_b17_two_small_trays` | approved tray layout | labelled static state |
| `ui_b17_three_large_trays` | multi-change result | labelled static state |
| `char_loop_b17_compare` | Loop-X comparing versions | static pose |
| `char_loop_b17_sort_success` | successful color sort | static pose |
| `sfx_b17_test` | dispatch | visible `מריץ בדיקה` status |
| `sfx_b17_success` | victory | stars + numeric score |

## 13. Accessibility and system behavior

- Every changed component is named in text; highlighting never depends on color alone.
- Prompt versions use headings and row labels associated with their values.
- At 360px, version columns become stacked cards with identical component order.
- Touch targets are at least 44×44px; keyboard and screen-reader paths are complete.
- Reduced-motion uses static before/after frames; muted mode keeps all causal text.
- No free text, runtime AI, upload, analytics payload with task text or network request.
- Refresh resets the active comparison but cannot duplicate completion or rewards.

## 14. Acceptance tests

- `TEST_B17_01_FAST_SUCCESS`: three changes → baseline → sort-only test → correct reason → success.
- `TEST_B17_02_COUNT_ONE`: feedback exposes all three labelled components without revealing by color alone.
- `TEST_B17_03_TANGLED_BASE`: tangled version cannot count as a clean baseline.
- `TEST_B17_04_BLANK_BASE`: blank version does not discard known working components.
- `TEST_B17_05_NO_CHANGE`: deterministic shape-sort result remains short of the color criterion.
- `TEST_B17_06_MULTI_CHANGE`: correct color plus changed trays is reported as a non-isolated test.
- `TEST_B17_07_RETENTION_LADDER`: correct comparison/baseline persist; step 4 has exactly two choices; step 7 completes.
- `TEST_B17_08_SCORE`: four independent provenance criteria; attempts, time and hints do not lower score.
- `TEST_B17_09_KEYBOARD_360_MUTED_RM_NO_NETWORK`: complete under every access mode with zero network calls.
- `TEST_B17_10_REFRESH_IDEMPOTENT`: refresh/double CTA never duplicates reward or progress.

## 15. Self-check

The battle teaches a controlled diagnostic comparison. It does not claim that all editing must always change exactly one component, and every result is a deterministic consequence of the displayed version.
