# battle_12.md — מבחן איכות

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_12` and the structured Production fields.
- Replaced the prohibited two-step shortened ladder with all six attempts plus guided completion.
- Removed first-attempt scoring; evaluation now uses four demonstrated behaviors and provenance.
- Resolved the threshold mismatch by using the same exact rule everywhere: „יותר משעתיים”.
- Added a sample-classification action so reading, choosing and applying a criterion are separately observable.
- Replaced color-only pass indicators and expanded keyboard, reduced-motion, recovery and tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_12` |
| `regionId` | `no_limits_factory` |
| `order` | 12 |
| title | מבחן איכות |
| villain | עוד־ועוד |
| `skillCodes` | `["success_criterion"]` |
| `battleType` | `robot_test` |
| real-world need | להגדיר תנאי הצלחה מדיד ולבדוק תוצאה מולו |
| objective | להשתמש בכלל „יותר משעתיים” כדי לבחור מבחן ולסווג סוללות |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "displayed_source", "no_runtime_ai"]` |

## 3. Story and learning

לופּ מסמן כל סוללה שנראית „טובה” כמתאימה למכשירי הקשר, ולכן גם סוללות שמחזיקות זמן קצר מגיעות למדף. ספר הנהלים מציג כלל מדויק: סוללה מתאימה חייבת לפעול יותר משעתיים.

Learning objective: a success criterion is an observable rule used to decide whether a result passes. It must match the supplied source and does not make untested information true.

Primary instruction:

> קראו את הכלל, בחרו מבחן והפעילו אותו על הסוללות.

## 4. Approved test data

The entire answer is derivable from this on-screen content:

- Manual rule `b12_manual_threshold`: „סוללת קשר מאושרת חייבת לפעול יותר משעתיים.”
- Battery `b12_battery_alpha`: tested runtime `90 minutes`.
- Battery `b12_battery_beta`: tested runtime `3 hours`.

No external knowledge or hidden measurement is required.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Establish vague approval | „לופּ מאשר סוללות לפי המילה ‘טובה’, והבדיקה אינה עקבית.” | `read_rule` | 10s |
| `read_rule` | Extract source criterion | „איזה נתון בספר הנהלים קובע הצלחה?” | feedback or `choose_test` | 15s |
| `choose_test` | Select measurable rule | „בחרו את מבחן הקבלה שמתאים לכלל.” | `dispatch` | 18s |
| `dispatch` | Run test | „בודק את זמני העבודה…” | `outcome` | 3s |
| `outcome` | Show causal classification | approved result + `המשך` | feedback or `apply_test` | 8s |
| `apply_test` | Apply rule to samples | „איזו סוללה עומדת בכלל?” | feedback or `causal_check` | 12s |
| `causal_check` | Explain pass decision | „למה סוללה בטא עברה?” | retry or `victory` | 10s |
| `victory` | Score | „קריטריון מדיד אפשר להשוות לנתונים שנבדקו.” | score/map | 12s |

## 6. Prompt components and test choices

### Manual extraction

| `componentId` | Label | Role |
|---|---|---|
| `b12_rule_runtime_over_two_hours` | זמן עבודה: יותר משעתיים | correct |
| `b12_rule_blue_case` | צבע המארז: כחול | visible detail, absent from the approval rule |
| `b12_rule_heavy_case` | משקל המארז: כבד | observable but not the displayed requirement |

### Test rules

| `componentId` | Label | Causal result |
|---|---|---|
| `b12_test_vague_good` | „האם הסוללה טובה?” | short-runtime battery is approved because „טובה” has no threshold |
| `b12_test_weight` | „האם הסוללה כבדה?” | batteries are sorted by an irrelevant property |
| `b12_test_runtime` | „האם זמן העבודה גדול משעתיים?” | correct comparison against tested runtime |

### Apply the criterion

- Correct `b12_select_beta`: battery Beta, `3 hours`.
- Distractor `b12_select_alpha`: battery Alpha, `90 minutes`.
- Distractor `b12_select_both`: both batteries.

### Causal check

- Correct `b12_reason_threshold`: „כי 3 שעות הן יותר משעתיים”.
- Distractor `b12_reason_looks_strong`: „כי היא נראית חזקה”.
- Distractor `b12_reason_ai_said`: „כי לופּ אמר שהיא טובה”.

## 7. States, precedence and outcomes

Priority: source rule → test rule → sample application → causal check → success. `unsafeStates=[]`.

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b12_wrong_manual_field` | color/weight extracted | `b12_threshold_missing` | Manual threshold remains outlined and unselected | „הפרט הזה אינו תנאי האישור שמופיע בספר.” |
| `b12_vague_test` | „good” test selected | `b12_vague_approval` | Alpha and Beta both receive `מאושר?` with question icon | „‘טובה’ אינה קובעת גבול שאפשר לבדוק.” |
| `b12_irrelevant_test` | weight test selected | `b12_weight_sort` | Batteries are sorted by weight; runtime shelf stays unresolved | „הבדיקה מדידה, אבל אינה בודקת את הדרישה שבספר.” |
| `b12_wrong_sample` | Alpha or both selected | `b12_sample_mismatch` | Runtime labels remain visible beside the rule | „90 דקות אינן יותר משעתיים. השוו שוב לכלל.” |
| `b12_wrong_reason` | causal answer incorrect | `b12_reason_unresolved` | Beta retains `עבר — 3 שעות`; explanation remains open | „ההחלטה צריכה להתבסס על המספרים שנבדקו.” |
| `b12_valid` | rule, test, Beta and reason correct | `full_success` | Beta receives icon + `עבר`; Alpha receives icon + `לא עבר` | „נכון. בדקתם את שתי הסוללות מול אותו קריטריון.” |

## 8. Feedback ladder

The ladder is applied to the highest-priority unresolved action.

1. „הבדיקה עדיין לא מסננת לפי הכלל. נסו שוב.”
2. Show the current result and name the mismatch between the selected field/test and the manual.
3. „השוו שוב בין ספר הנהלים לבין אפשרויות הבדיקה.”
4. Statically emphasize the relevant rule and offer exactly two choices.
5. „בחרו באפשרות שמשתמשת באותו נתון ובאותו גבול.”
6. Preserve correct work; highlight the remaining correct choice with icon, border and text.
7. Guided completion applies the rule and guarantees victory.

The binary appearance of one substep never shortens the ladder or converts a retry into an automatic score penalty.

## 9. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b12_score_source_rule` | Extract „more than two hours” from the manual | `user_independent` | `user_choice_two` | `system_completed` |
| `b12_score_test_rule` | Select the matching measurable test | `user_independent` | `user_choice_two` | `system_completed` |
| `b12_score_application` | Apply the criterion to choose Battery Beta | `user_independent` | `user_choice_two` | `system_completed` |
| `b12_score_cause` | Justify the result with the displayed numbers | `user_independent` | `user_choice_two` | `system_completed` |

No criterion reads first-attempt status, elapsed time or raw retry count.

## 10. Copy registry

- `title`: „מבחן איכות”
- `comic_setup`: „המילה ‘טובה’ מאפשרת גם לסוללות קצרות לעבור.”
- `instruction_primary`: „קראו את הכלל, בחרו מבחן והפעילו אותו על הסוללות.”
- `manual_rule`: „סוללת קשר מאושרת חייבת לפעול יותר משעתיים.”
- `rule_instruction`: „איזה נתון בספר הנהלים קובע הצלחה?”
- `test_instruction`: „בחרו את מבחן הקבלה שמתאים לכלל.”
- `apply_instruction`: „איזו סוללה עומדת בכלל?”
- `causal_instruction`: „למה סוללה בטא עברה?”
- `concept_help`: „קריטריון הצלחה הוא כלל שאפשר לבדוק מול תוצאה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b12_quality_lab` | Battery test station | static |
| `ui_b12_manual_rule` | Approval rule | semantic HTML text |
| `ui_b12_battery_alpha` | 90-minute sample | icon + semantic runtime label |
| `ui_b12_battery_beta` | 3-hour sample | icon + semantic runtime label |
| `char_loop_b12_vague_approval` | Vague-test result | static question-state panel |
| `char_loop_b12_runtime_test` | Correct test | static pass/fail comparison |
| `sfx_b12_test` | Test action | visible status label |
| `sfx_b12_success` | Victory | stars + numeric score |

Pass/fail is always communicated by icon and text, never green/red alone.

## 12. Accessibility and system behavior

- Manual and runtime values are real text and remain readable at 200% zoom.
- Battery choices announce name, runtime and selection state.
- All actions work with touch and keyboard; targets are at least 44×44px.
- At 360px, the manual remains visible or re-openable without losing the selection.
- Reduced-motion uses static comparison panels; muted mode preserves complete status.
- No external fact, runtime AI, network call or free text.
- Refresh before victory restarts without reward; score commit is idempotent.

## 13. Acceptance tests

- `TEST_B12_01_FAST_SUCCESS`: extract threshold, choose runtime test, Beta and numeric reason → `full_success`.
- `TEST_B12_02_SOURCE_COLOR`: case color is rejected as absent from the approval rule.
- `TEST_B12_03_SOURCE_WEIGHT`: weight does not replace runtime threshold.
- `TEST_B12_04_VAGUE_TEST`: „good” test produces unresolved approval with causal feedback.
- `TEST_B12_05_IRRELEVANT_METRIC`: weight is measurable but irrelevant and does not pass.
- `TEST_B12_06_APPLY`: Alpha/90 minutes fails; Beta/3 hours passes.
- `TEST_B12_07_LADDER`: seven steps remain available; step 4 has exactly two choices.
- `TEST_B12_08_SCORE`: four actions use independent provenance; retry number is ignored.
- `TEST_B12_09_KEYBOARD_360_MUTED_RM`: complete through all accessibility variants.
- `TEST_B12_10_REFRESH_IDEMPOTENT`: refresh/double CTA cannot duplicate stars.

## 14. Self-check

The battle preserves the displayed-source robot test and fixes the threshold, help and scoring contradictions without requiring external knowledge.
