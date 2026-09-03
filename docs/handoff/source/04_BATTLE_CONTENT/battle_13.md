# battle_13.md — פס הייצור

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_13` and defined the complete Region 2 reward.
- Replaced score criteria that combined several skills or depended on help stage with one criterion per component plus iteration.
- Made the success threshold internally consistent: maximum 5 kg, approved reference, and a ten-second water-spray test with zero drops inside.
- Removed flashing and color-only locked slots; correct slots use icon, border and `נכון — נשמר`.
- Replaced airborne packaging and wet equipment with controlled, harmless test-station results.
- Added deterministic multi-error precedence, complete ladder, exact post-region route and twelve acceptance tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_13` |
| `regionId` | `no_limits_factory` |
| `order` | 13 |
| title | פס הייצור |
| villain | עוד־ועוד |
| `skillCodes` | `["constraint", "example", "success_criterion"]` |
| `battleType` | `combo` |
| real-world need | לשלב גבול, דוגמה וקריטריון קבלה כדי לשלוט ולבדוק תוצר |
| objective | לבחור משקל מרבי, דוגמת אריזה מאושרת ובדיקת אטימות מדידה |
| `estimatedSeconds` | 135 |
| reward | `{ stampId: "stamp_region_2_complete", unlockRegionId: "command_maze", unlockWorkshopVisitId: "workshop_2", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "combo_precedence", "controlled_water_test"]` |

## 3. Story and learning

עוד־ועוד מחק שלושה רכיבי בקרה מפקודת האריזה. לופּ מכין אריזות במשקלים שונים, ללא דוגמת המבנה המאושרת וללא בדיקת אטימות. שער הבקרה עוצר את המשלוח עד שהילד ישלים אילוץ, דוגמה וקריטריון.

Learning objective: a constraint limits the output, an example shows the intended pattern, and a success criterion tests whether the result is acceptable. The three components serve different roles.

Primary instruction:

> השלימו אילוץ, דוגמה וקריטריון לבקרת האריזות.

## 4. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Establish three missing controls | „שער הבקרה עצר את המשלוח. שלושה רכיבים חסרים.” | `combo_build` | 15s |
| `combo_build` | Fill three semantic slots | „בחרו כרטיס אחד לכל חלק בפרומפט.” | `dispatch` | 40s |
| `dispatch` | Apply selected controls | „לופּ מפעיל את קו האריזה…” | `outcome` | 3s |
| `outcome` | Show highest-priority failure | approved result + `המשך` | feedback or `victory` | 15s |
| `feedback` | Repair one component | ladder; retain correct slots | `combo_build` | 12s |
| `victory` | Region summary | „הגבול, הדוגמה והבדיקה עבדו יחד.” | `score` | 15s |
| `score` | Score and delta | stars, numeric score and wallet delta | `workshop_2` | 15s |
| `region_route` | Optional post-region sequence | Workshop 2 → Bonus 2 offer → map | Battle 14 open | 20s outside battle timer |

Workshop and bonus are independently skippable. Skipping either never blocks Battle 14.

## 5. Prompt components, slots and cards

Base prompt: `ארוז את ציוד הסוכנות למשלוח [אילוץ] [דוגמה] [קריטריון]`.

### Constraint slot

- Correct `b13_constraint_max_5kg`: „משקל מרבי: 5 ק״ג לאריזה”.
- Distractor `b13_constraint_light_possible`: „קל ככל האפשר”.

The distractor can produce packaging too light for the displayed equipment because it defines no acceptable upper boundary or protection requirement.

### Example slot

- Correct `b13_example_package_a`: „כמו אריזה תקנית א׳ המצורפת”, with `ui_b13_reference_package_a`.
- Distractor `b13_example_impressive_words`: „משהו יפה ומרשים”.

The distractor is a subjective description rather than an example of the approved structure.

### Success-criterion slot

- Correct `b13_criterion_water_test`: „אחרי התזה של 10 שניות: אפס טיפות בתוך האריזה”.
- Distractor `b13_criterion_looks_good`: „בדוק שהאריזה נראית טוב”.

The correct test is performed on an empty demonstration package at a contained test station; no agency equipment is exposed to water.

All six cards remain visible initially. Slots are labeled by component type and support click/keyboard placement; drag is optional.

## 6. States, precedence and outcomes

Safety precedes ordinary evaluation; every supplied choice is safe. Ordinary precedence:

1. constraint;
2. example;
3. success criterion;
4. success.

| `stateId` | Match | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b13_wrong_constraint` | constraint missing/distractor | `b13_unbounded_weight` | Sample packages arrive at several weights; gate shows `אין גבול מספרי` | „‘קל ככל האפשר’ אינו מגדיר גבול קבלה. קבעו משקל מרבי.” |
| `b13_wrong_example` | constraint correct, example wrong | `b13_structure_mismatch` | Package meets weight limit but uses decorative shape unlike Reference A | „המשקל מתאים, אבל לא סופקה דוגמת המבנה המאושרת.” |
| `b13_wrong_criterion` | first two correct, criterion wrong | `b13_vague_quality_check` | Attractive sample receives `אטימות לא נבדקה` | „‘נראית טוב’ אינו בודק אם מים נכנסים.” |
| `b13_valid` | all three correct | `full_success` | 5 kg or less; Reference A structure; empty test package passes with zero drops | „מעולה. הגבלתם, הדגמתם ובדקתם.” |

After each partial outcome, correct slots retain their value and original provenance. They show icon, border and `נכון — נשמר`; color is supplementary.

`unsafeStates=[]`.

## 7. Feedback ladder

The ladder addresses only the highest-priority unresolved slot.

1. „שער הבקרה עדיין לא מאשר את האריזות. בדקו את שלושת החלקים.”
2. Show the causal result and name only the current missing component.
3. „תקנו רכיב אחד ושגרו שוב.”
4. Lock correct slots; statically emphasize the unresolved slot and show exactly two cards.
5. „בחרו את הכרטיס שאפשר ליישם או לבדוק באופן ברור.”
6. Preserve correct work; highlight the remaining correct card with icon, border and text.
7. Guided completion fills the remaining slot and guarantees victory.

If another component remains wrong after correction, the ladder restarts for that component without erasing correct work.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b13_score_constraint` | Set a maximum of 5 kg | `user_independent` | `user_choice_two` | `system_completed` |
| `b13_score_example` | Attach approved Package A example | `user_independent` | `user_choice_two` | `system_completed` |
| `b13_score_criterion` | Require zero drops after ten-second spray | `user_independent` | `user_choice_two` | `system_completed` |
| `b13_score_iteration` | Test and improve the full prompt, or succeed first dispatch | `user_independent` | `user_choice_two` | `system_completed` |

One component's help level never changes another component's provenance. Attempts and elapsed time are not score fields.

## 9. Copy registry

- `title`: „פס הייצור”
- `comic_setup`: „שער הבקרה עצר אריזות שחסרים להן שלושה כלי פיקוח.”
- `instruction_primary`: „השלימו אילוץ, דוגמה וקריטריון לבקרת האריזות.”
- `build_instruction`: „בחרו כרטיס אחד לכל חלק בפרומפט.”
- `dispatch_label`: „שגרו לקו האריזה”
- `locked_correct_label`: „נכון — נשמר”
- `region_success`: „מפעל בלי גבולות חזר לעבוד תחת בקרה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b13_factory_control_gate` | Main conveyor and test gate | static |
| `ui_b13_reference_package_a` | Approved built-in package example | image + accessible description |
| `char_loop_b13_weight_samples` | Constraint failure | static packages with numeric labels |
| `char_loop_b13_structure_mismatch` | Example failure | static side-by-side comparison |
| `ui_b13_water_test_station` | Controlled empty-package test | static test diagram + text result |
| `char_loop_b13_factory_success` | Full success | static approved shipment |
| `ui_slot_locked_correct` | Retained slot | global icon + border + text |
| `sfx_b13_dispatch` | Launch | visible progress label |
| `sfx_b13_region_success` | Region victory | visual region stamp |

No airborne objects, damaged equipment, flashing or Hebrew text burned into images.

## 11. Accessibility and system behavior

- Three slots stack in constraint→example→criterion order at 360px.
- Cards and slots have unique accessible names and correct `aria` state.
- Click/keyboard placement fully replaces drag.
- Reference and test visuals have equivalent text descriptions.
- Correct locked state is not color-only and can be explicitly edited before dispatch.
- Only one outcome/feedback item is announced at a time.
- Works muted and reduced-motion; static outcomes carry the same information.
- Refresh before victory grants no reward; score, region and workshop unlock commit once.
- After commit: Workshop 2, optional Bonus 2, then map with Battle 14 open.
- No AI, network call, upload or free text.

## 12. Acceptance tests

- `TEST_B13_01_FAST_SUCCESS`: three correct cards → `full_success`, all provenance independent.
- `TEST_B13_02_CONSTRAINT_PRECEDENCE`: all wrong → only constraint outcome first.
- `TEST_B13_03_EXAMPLE_NEXT`: corrected constraint stays locked; example outcome follows.
- `TEST_B13_04_CRITERION_NEXT`: first two correct; vague quality result reports untested seal.
- `TEST_B13_05_THRESHOLD_BOUNDARY`: exactly 5 kg satisfies `maximum 5 kg`; greater than 5 does not.
- `TEST_B13_06_WATER_TEST`: ten-second empty-package test reports zero drops for success.
- `TEST_B13_07_RETAIN`: correct slots and original provenance survive later retries.
- `TEST_B13_08_NON_COLOR`: locked/pass states remain identifiable in grayscale.
- `TEST_B13_09_LADDER`: step 4 has exactly two cards; step 7 guarantees completion.
- `TEST_B13_10_SCORE`: one help event affects only its criterion provenance; attempts do not cap score.
- `TEST_B13_11_KEYBOARD_360_MUTED_RM`: full vertical build works through all access variants.
- `TEST_B13_12_REGION_ROUTE`: commit once → Workshop 2 → optional Bonus 2 → map with Battle 14 open; both skips work.

## 13. Self-check

The Region 2 combo now has internally consistent limits, safe test behavior, deterministic precedence and a complete post-region route. It exposes a missing cross-region routing clarification that is resolved in the architecture and prior Region 1 combo.
