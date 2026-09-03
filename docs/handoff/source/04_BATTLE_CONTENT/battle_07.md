# battle_07.md — שילוב עוטף

**Version:** 1.1  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored `battleId=battle_07`.
- Replaced trash/oil outcomes with safe event-organization mismatches.
- Replaced color-only locked slots with icon, border and `נכון` label.
- Rebuilt score as goal, context, format and iteration provenance.
- Added explicit outcome keys, multi-error precedence, workshop transition and full tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_07` |
| `regionId` | `fog_district` |
| `order` | 7 |
| title | שילוב עוטף |
| villain | מר בערך |
| `skillCodes` | `["goal", "context", "format"]` |
| `battleType` | `combo` |
| real-world need | להרכיב בקשה שלמה עם פעולה, קהל ותצוגה |
| objective | לארגן את עמדות ההשקה לתושבי הרובע ולהציגן בטבלה |
| `estimatedSeconds` | 135 |
| reward | `{ stampId: "stamp_region_1_complete", unlockRegionId: "no_limits_factory", unlockWorkshopVisitId: "workshop_1", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "combo_precedence"]` |

## 3. Story and learning

בכיכר הרובע מונחים שלטים, שולחנות וציוד לאירוע ההשקה, אך מר בערך ערבב את ההוראות. לופּ צריך פרומפט מלא כדי לארגן את העמדות, להתאים אותן לקהל ולהציג את התכנית בצורה שניתן לקרוא מרחוק.

Primary instruction:

> הרכיבו מטרה, הקשר ופורמט שמתאימים לאירוע.

## 4. Flow and timing

| State | Purpose | Instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Establish combo problem | „הציוד והשלטים מוכנים, אבל ההוראות התערבבו.” | `combo_build` | 15s |
| `combo_build` | Fill three semantic slots | „בחרו כרטיס אחד לכל חלק בפרומפט.” | `dispatch` | 40s |
| `dispatch` | Apply current prompt | „לופּ מארגן את הכיכר…” | `outcome` | 3s |
| `outcome` | Show highest-priority causal failure | approved result | feedback or victory | 15s |
| `feedback` | Correct one component | ladder; retain correct slots | `combo_build` | 12s |
| `victory` | Region completion | „מטרה, הקשר ופורמט עבדו יחד.” | score | 15s |
| `score` | Best/delta summary | stars + numeric score | Workshop 1 → optional Bonus 1 → map | 20s outside battle timer |

## 5. Prompt components, slots and cards

### Goal slot

- Correct `b07_goal_organize_stations`: „ארגן את עמדות ההשקה”.
- Distractor `b07_goal_print_posters`: „הדפס פוסטרים לאירוע”.

The distractor is concrete but solves only one small artifact; the stations remain unorganized.

### Context slot

- Correct `b07_context_residents`: „עבור תושבי הרובע”.
- Distractor `b07_context_maintenance`: „עבור צוות התחזוקה”.

The distractor produces a workbench layout and maintenance labels rather than visitor stations.

### Format slot

- Correct `b07_format_board_table`: „כטבלה גדולה על לוח הכיכר”.
- Distractor `b07_format_poster_paragraph`: „כפסקה אחת על כרזה”.

The paragraph contains the schedule but is difficult to scan from the plaza.

All six cards remain visible as approved closed content. Slots are labeled by skill and accept click/keyboard placement; drag is optional.

## 6. States, precedence and outcomes

Safety precedes all ordinary evaluation; this battle has no unsafe choice.

Ordinary precedence:

1. goal;
2. context;
3. format;
4. success.

| `stateId` | Match | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b07_missing_or_wrong_goal` | goal distractor/missing | `b07_goal_posters_only` | Posters are printed neatly; stations remain mixed | „הפוסטרים מוכנים, אבל העמדות עדיין לא מאורגנות.” |
| `b07_wrong_context` | goal correct, context wrong | `b07_maintenance_layout` | Loop-X arranges a maintenance workbench and matching signs | „העמדות מסודרות לקהל אחר. מי מגיע לאירוע?” |
| `b07_wrong_format` | goal/context correct, format wrong | `b07_paragraph_board` | Correct schedule appears as one dense paragraph | „התכנית נכונה, אבל קשה לקרוא אותה במהירות בכיכר.” |
| `b07_valid` | all three correct | `full_success` | Visitor stations, resident-facing signs and a clear table appear | „מעולה. שלושת חלקי הפרומפט עבדו יחד.” |

If several cards are wrong, show one outcome by precedence. On return, all correct slots remain locked with icon, border and the text `נכון`.

`unsafeStates=[]`.

## 7. Feedback ladder

1. „האירוע עדיין לא מסודר. בדקו את שלושת חלקי הפרומפט.”
2. Name only the highest-priority incorrect component and show its causal outcome.
3. „תקנו רכיב אחד ושגרו שוב.”
4. Lock correct slots; statically emphasize the unresolved slot and show exactly two cards.
5. „בחרו את הכרטיס שמשלים את החלק המסומן.”
6. Preserve all correct slots; highlight the remaining correct card with icon/text.
7. Guided completion fills the remaining slot and guarantees victory.

The ladder repeats for a later unresolved component without deleting earlier correct work.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b07_score_goal` | Goal component | `user_independent` | `user_choice_two` | `system_completed` |
| `b07_score_context` | Context component | `user_independent` | `user_choice_two` | `system_completed` |
| `b07_score_format` | Format component | `user_independent` | `user_choice_two` | `system_completed` |
| `b07_score_iteration` | Test and improve the prompt, or succeed first try | `user_independent` | `user_choice_two` | `system_completed` |

Correct components retain their original provenance across later retries. Attempt count is not a scoring field.

## 9. Copy registry

- `title`: „שילוב עוטף”
- `comic_setup`: „מר בערך ערבב את הוראות האירוע.”
- `instruction_primary`: „הרכיבו מטרה, הקשר ופורמט שמתאימים לאירוע.”
- `build_instruction`: „בחרו כרטיס אחד לכל חלק בפרומפט.”
- `dispatch_label`: „שגרו את התכנית”
- `locked_correct_label`: „נכון — נשמר”
- `region_success`: „רובע הערפל חזר להיות ברור.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced motion / muted |
|---|---|---|
| `bg_b07_fog_plaza_mixed` | Initial mixed equipment | static |
| `char_loop_b07_posters` | Goal failure | static |
| `char_loop_b07_maintenance_layout` | Context failure | static |
| `ui_b07_paragraph_board` | Format failure | semantic text + static board |
| `char_loop_b07_event_success` | Full success | static complete plaza |
| `ui_slot_locked_correct` | Retained correct slot | icon + border + text; not color-only |
| `sfx_b07_dispatch` | Launch | visible progress label |
| `sfx_b07_region_success` | Region victory | visual region stamp |

## 11. Accessibility and system behavior

- At 360px, slots appear vertically in goal→context→format order.
- Each slot/card has a unique accessible name.
- Click and keyboard placement fully replace drag.
- Locked correct state is announced and cannot be accidentally overwritten without an explicit edit action.
- Outcome feedback announces only one failure at a time.
- Works muted and reduced-motion.
- Refresh before victory restarts the battle without reward.
- Victory commits score once, opens Workshop 1, offers optional Bonus 1 and makes Region 2 available.
- Skipping the workshop does not block the next battle.
- Skipping Bonus 1 does not block the next battle or change the battle score.
- No AI/network or free text.

## 12. Acceptance tests

- `TEST_B07_01_FAST_SUCCESS`: three correct cards → success and provenance retained.
- `TEST_B07_02_GOAL_PRECEDENCE`: goal/context wrong → only goal outcome first.
- `TEST_B07_03_CONTEXT_NEXT`: after goal correction, context outcome appears.
- `TEST_B07_04_FORMAT_NEXT`: after goal/context correction, format outcome appears.
- `TEST_B07_05_RETAIN`: correct slots remain locked across outcomes.
- `TEST_B07_06_NON_COLOR`: locked state remains identifiable in grayscale.
- `TEST_B07_07_LADDER`: step 4 exactly two cards; step 7 guarantees completion.
- `TEST_B07_08_SCORE`: each slot provenance scored independently; retries alone do not lower score.
- `TEST_B07_09_KEYBOARD_360`: full vertical builder completion without drag.
- `TEST_B07_10_MUTED_RM`: all outcomes causal without sound/motion.
- `TEST_B07_11_REFRESH_IDEMPOTENT`: no duplicate score/unlock/workshop transaction.
- `TEST_B07_12_REGION_ROUTE`: victory routes to Workshop 1, then optional Bonus 1, then the map with Battle 8 open; both skips work.

## 13. Self-check

The first combo preserves the locked map and teaches all three Region 1 components. Its post-region route now follows the shared workshop → optional bonus → map rule.
