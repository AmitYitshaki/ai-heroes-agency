# battle_08.md — כמה זה מספיק

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_08` and the structured reward contract.
- Replaced attempt-based scoring and a constant criterion with four independently evidenced behaviors.
- Added diagnosis and causal-check actions so one card choice does not earn several duplicate criteria.
- Replaced falling/throwing boxes and color-only success cues with safe, static-readable outcomes.
- Preserved the complete six-attempt ladder plus guaranteed guided completion.
- Expanded the Production contract with states, priorities, accessibility behavior and acceptance tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_08` |
| `regionId` | `no_limits_factory` |
| `order` | 8 |
| title | כמה זה מספיק |
| villain | עוד־ועוד |
| `skillCodes` | `["constraint"]` |
| `battleType` | `power_selection` |
| real-world need | להגדיר כמות או אורך מדויקים כדי לקבל תוצר שימושי ומוגבל |
| objective | לזהות שחסרה נקודת עצירה ולדרוש בדיוק חמש תיבות |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "no_personal_data"]` |

## 3. Story and learning

עוד־ועוד מחק את נקודת העצירה מפקודת המסוע. לופּ מייצר תיבות אחסון ברצף, ולכן אזור האיסוף מתמלא. הילד צריך לזהות שחסר גבול כמותי ולהוסיף מספר מדויק.

Learning objective: a quantity constraint tells an AI how much to produce or when to stop. Words such as „הרבה” are not measurable limits.

Primary instruction:

> מצאו את הגבול החסר ובחרו כמות מדויקת.

## 4. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Establish the overflow | „עוד־ועוד מחק את נקודת העצירה. המסוע ממשיך לייצר.” | `diagnose` | 10s |
| `diagnose` | Identify missing prompt part | „איזה פרט חסר כדי שלופּ ידע מתי לעצור?” | diagnosis feedback or `choose_constraint` | 15s |
| `choose_constraint` | Select a measurable limit | „בחרו אילוץ שמייצר בדיוק חמש תיבות.” | `dispatch` | 20s |
| `dispatch` | Apply the choice | „מעדכן את המסוע…” | `outcome` | 3s |
| `outcome` | Show causal world result | approved result + `המשך` | feedback or `causal_check` | 8s |
| `feedback` | Correct current component | current ladder message + `חזרה` | unresolved state | 8s |
| `causal_check` | Confirm understanding | „למה המסוע עצר בזמן?” | retry or `victory` | 10s |
| `victory` | Score and transfer | „מספר מדויק נתן ללופּ נקודת עצירה.” | score/map | 12s |

Fast path is approximately 78 seconds; one ordinary correction fits the 90-second target.

## 5. Prompt components

Base prompt: `ייצר תיבות אחסון חדשות [חסר]`.

### Diagnosis

| `componentId` | Label | Role |
|---|---|---|
| `b08_diag_quantity_limit` | כמה תיבות לייצר | correct: identifies the missing stop condition |
| `b08_diag_box_color` | מה יהיה צבע התיבות | plausible but unrelated to stopping |
| `b08_diag_destination` | לאיזה מדף להעביר אותן | useful later, but does not limit quantity |

### Constraint cards

| `componentId` | Label | Role and causal effect |
|---|---|---|
| `b08_constraint_many` | הרבה תיבות | vague; Loop-X continues because no number is defined |
| `b08_constraint_until_full` | עד שאזור האיסוף יתמלא | measurable only after congestion; the area becomes full |
| `b08_constraint_exact_five` | בדיוק חמש תיבות | correct; five boxes are produced and the conveyor stops |

### Causal check

- Correct `b08_reason_number`: „כי הוספנו מספר מדויק”.
- Distractor `b08_reason_retry`: „כי שיגרנו שוב”.
- Distractor `b08_reason_color`: „כי התיבות קיבלו צבע חדש”.

## 6. States and outcomes

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b08_wrong_diagnosis` | color/destination diagnosis | `b08_limit_still_missing` | Prompt gap and queued boxes remain visible | „הפרט הזה לא אומר ללופּ מתי לעצור.” |
| `b08_vague_many` | `b08_constraint_many` | `b08_many_boxes` | Additional boxes form a safe stationary queue | „‘הרבה’ אינו מספר. לופּ עדיין לא יודע מתי לעצור.” |
| `b08_fill_area` | `b08_constraint_until_full` | `b08_full_collection_area` | The marked collection area fills; conveyor pauses | „המסוע עצר רק כשהאזור כבר התמלא. דרוש גבול מראש.” |
| `b08_wrong_reason` | wrong causal answer | `b08_reason_unresolved` | Correct five-box result remains; explanation stays open | „מה השתנה בפקודה לפני שהמסוע עצר?” |
| `b08_valid` | correct diagnosis, constraint and reason | `full_success` | Five boxes stand in numbered positions; stop icon and text appear | „מעולה. האילוץ קבע כמות מדויקת.” |

Priority: diagnosis → constraint → causal check → success. `unsafeStates=[]`.

## 7. Feedback ladder

The ladder applies to the unresolved component and preserves completed components.

1. „המסוע עדיין לא נעצר בזמן. בדקו את הפרומפט ונסו שוב.”
2. Show the causal outcome and name the missing property: „חסר גבול שאפשר לספור מראש.”
3. „נסו לבחור גבול מדויק בעצמכם.”
4. Statically emphasize the unresolved area and show exactly two relevant choices.
5. „בחרו את האפשרות שקובעת מראש כמה תיבות יהיו.”
6. Preserve correct work; highlight the remaining correct card with icon, border and text.
7. Guided completion applies the remaining component and guarantees victory.

Time, raw attempt count and opening the help explanation do not change the score.

## 8. Scoring

Base: 1 star. Each criterion uses its own provenance.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b08_score_diagnosis` | Identify the missing quantity limit | `user_independent` | `user_choice_two` | `system_completed` |
| `b08_score_constraint` | Select exactly five boxes | `user_independent` | `user_choice_two` | `system_completed` |
| `b08_score_iteration` | Test and improve, or succeed on the first dispatch | `user_independent` | `user_choice_two` | `system_completed` |
| `b08_score_cause` | Explain why the conveyor stopped | `user_independent` | `user_choice_two` | `system_completed` |

Retries alone never reduce provenance already demonstrated independently.

## 9. Copy registry

- `title`: „כמה זה מספיק”
- `comic_setup`: „עוד־ועוד מחק את נקודת העצירה מהמסוע.”
- `instruction_primary`: „מצאו את הגבול החסר ובחרו כמות מדויקת.”
- `diagnose_instruction`: „איזה פרט חסר כדי שלופּ ידע מתי לעצור?”
- `constraint_instruction`: „בחרו אילוץ שמייצר בדיוק חמש תיבות.”
- `causal_instruction`: „למה המסוע עצר בזמן?”
- `concept_help`: „אילוץ הוא גבול שמצמצם את האפשרויות. למשל: בדיוק 5 פריטים.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b08_factory_conveyor` | Factory conveyor and collection zone | static |
| `ui_b08_prompt_gap` | Accessible prompt panel | semantic HTML text |
| `char_loop_b08_queue` | Vague-limit result | static queued boxes |
| `char_loop_b08_area_full` | Fill-area result | static full-zone marker |
| `char_loop_b08_exact_five` | Success | five numbered boxes + stop label |
| `sfx_b08_conveyor` | Conveyor action | visible status text |
| `sfx_b08_success` | Victory | stars + numeric score |

No falling objects, flashing, screen obstruction or color-only information. Hebrew text is rendered as UI, not burned into art.

## 11. Accessibility and system behavior

- All targets are at least 44×44px; click/keyboard fully replace drag.
- Cards retain accessible names and selected state at 360px.
- Correct, selected and guided states use icon, border and text in addition to color.
- Dynamic feedback receives one polite live announcement.
- Reduced motion uses the final frame; muted mode preserves all causal information.
- Refresh before victory returns to battle start and grants no reward.
- Score/reward commit is idempotent; this battle makes no network or AI call.

## 12. Acceptance tests

- `TEST_B08_01_FAST_SUCCESS`: correct diagnosis, exact-five card and reason → `full_success`.
- `TEST_B08_02_DIAG_COLOR`: color diagnosis keeps quantity step locked and explains the mismatch.
- `TEST_B08_03_DIAG_DESTINATION`: destination diagnosis does not satisfy the stop condition.
- `TEST_B08_04_MANY`: „הרבה תיבות” → `b08_many_boxes` with causal feedback.
- `TEST_B08_05_UNTIL_FULL`: fill-area card → safe full-zone result, not success.
- `TEST_B08_06_LADDER`: step 4 shows exactly two choices; step 7 guarantees completion.
- `TEST_B08_07_PROVENANCE`: four criteria record provenance independently; attempts alone do not lower score.
- `TEST_B08_08_KEYBOARD_360`: complete at 360px with Tab/Enter/Space and no drag.
- `TEST_B08_09_MUTED_RM`: all outcomes remain understandable muted and reduced-motion.
- `TEST_B08_10_REFRESH_IDEMPOTENT`: refresh/double CTA never grants stars twice.

## 13. Self-check

The battle preserves the locked quantity-limit scenario and power-selection type while adding enough observable behavior for four fair score criteria. No upstream product decision changes.
