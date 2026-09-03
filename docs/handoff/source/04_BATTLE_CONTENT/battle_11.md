# battle_11.md — רק לא זה

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_11` and required reward/safety fields.
- Converted „ללא ברווזים” from a bare negative instruction into an explicit built-in counterexample labeled „לא כך”.
- Removed the misleading claim that longer instructions inherently confuse AI or cause literal loopholes.
- Reduced the room obstruction to safe tabletop clutter and removed jumping surprise boxes.
- Added a causal understanding check and four independent provenance criteria.
- Added full state priority, complete help ladder and build-ready accessibility/tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_11` |
| `regionId` | `no_limits_factory` |
| `order` | 11 |
| title | רק לא זה |
| villain | עוד־ועוד |
| `skillCodes` | `["counterexample"]` |
| `battleType` | `prompt_assembly` |
| real-world need | להמחיש תבנית או מאפיין שאינם רצויים באמצעות דוגמה מנוגדת ברורה |
| objective | להרכיב מטרה נכונה ולצרף את דוגמת „לא כך” שמוציאה צעצועים ועומס |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "built_in_reference_only", "no_runtime_ai"]` |

## 3. Story and learning

עוד־ועוד הגזים בעיצוב חדר הישיבות: לופּ הניח ברווזי גומי צבעוניים על כל השולחן כי הפרומפט ביקש „עיצוב שמח ומפתיע” בלי להראות איזה סגנון מוגזם אינו מתאים. המעבר נשאר פנוי, אך החדר אינו שימושי לפגישה.

Learning objective: a counterexample shows a concrete pattern to avoid. It complements a clear goal; it does not replace the goal and does not guarantee that every unspecified issue disappears.

Primary instruction:

> הרכיבו מטרה והוסיפו דוגמת „לא כך” ברורה.

## 4. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Establish unwanted style | „החדר בטוח, אבל השולחן מלא צעצועים ולא מוכן לפגישה.” | `assembly` | 10s |
| `assembly` | Fill goal and counterexample slots | „בחרו מטרה וכרטיס אחד שמראה מה לא מתאים.” | `dispatch` | 25s |
| `dispatch` | Apply prompt | „לופּ מסדר מחדש את החדר…” | `outcome` | 3s |
| `outcome` | Show highest-priority causal result | approved result + `המשך` | feedback or `causal_check` | 10s |
| `feedback` | Repair one component | ladder; preserve correct slot | `assembly` | 8s |
| `causal_check` | Confirm meaning | „מה לימדה דוגמת ‘לא כך’ את לופּ?” | retry or `victory` | 10s |
| `victory` | Score | „מטרה ברורה ודוגמה מנוגדת עבדו יחד.” | score/map | 12s |

## 5. Prompt components, slots and cards

### Goal slot

- Correct `b11_goal_prepare_meeting`: „קשט את חדר הישיבות לפגישה בסגנון הסוכנות”.
- Distractor `b11_goal_fill_surprises`: „מלא את החדר בהפתעות צבעוניות”.

The distractor is concrete, but repeats the cause of the clutter rather than preparing a meeting room.

### Counterexample slot

- Correct `b11_counterexample_no_clutter`: built-in image of the current clutter, labeled „לא כך: בלי צעצועים ובלי עומס על השולחן”.
- Distractor `b11_counterexample_not_ugly`: text card „אל תעשה עיצוב לא יפה”.

The distractor expresses dislike but gives no observable pattern that Loop-X can compare against.

### Causal check

- Correct `b11_reason_pattern_to_avoid`: „היא הראתה איזה עומס וסגנון לא לכלול”.
- Distractor `b11_reason_removed_goal`: „היא החליפה את הצורך במטרה”.
- Distractor `b11_reason_guarantee`: „היא הבטיחה שכל תוצאה תהיה מושלמת”.

Cards are static approved content. No image, prompt or file comes from the child.

## 6. States, precedence and outcomes

Ordinary precedence: goal → counterexample → causal check → success. `unsafeStates=[]`.

| `stateId` | Match | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b11_wrong_goal` | surprise goal selected/missing | `b11_more_surprises` | Neat colorful decorations cover the meeting table | „לופּ ביצע את המטרה שבחרתם, אבל החדר עדיין לא מוכן לפגישה.” |
| `b11_vague_counterexample` | goal correct, vague „not ugly” card | `b11_style_still_open` | Table is orderly but retains several oversized toy decorations | „‘לא יפה’ הוא שיפוט כללי. הראו איזה מאפיין לא לכלול.” |
| `b11_wrong_reason` | incorrect causal answer | `b11_reason_unresolved` | Correct room remains; explanation panel stays active | „האם הדוגמה החליפה את המטרה, או הראתה תבנית להימנע ממנה?” |
| `b11_valid` | correct goal, counterexample and reason | `full_success` | Meeting table is clear; restrained agency decorations remain | „נכון. הדוגמה המנוגדת הראתה מה להשאיר מחוץ לתוצאה.” |

Correct slots remain locked across retries with icon, border and `נכון — נשמר`.

## 7. Feedback ladder

1. „החדר עדיין לא מתאים לפגישה. בדקו את שני חלקי הפרומפט.”
2. Show only the highest-priority failure and explain its prompt cause.
3. „תקנו רכיב אחד ושגרו שוב.”
4. Lock correct work; statically emphasize the unresolved slot and offer exactly two cards.
5. „בחרו את הכרטיס שמראה באופן מוחשי מה לא מתאים.”
6. Preserve correct parts; highlight the remaining correct card with icon, border and text.
7. Guided completion fills the remaining slot and guarantees victory.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b11_score_goal` | Select the meeting-room goal | `user_independent` | `user_choice_two` | `system_completed` |
| `b11_score_counterexample` | Select the concrete „not like this” example | `user_independent` | `user_choice_two` | `system_completed` |
| `b11_score_iteration` | Test and improve, or succeed on first dispatch | `user_independent` | `user_choice_two` | `system_completed` |
| `b11_score_cause` | Explain what a counterexample contributes | `user_independent` | `user_choice_two` | `system_completed` |

The two component criteria keep separate provenance; a retry does not erase an independently correct slot.

## 9. Copy registry

- `title`: „רק לא זה”
- `comic_setup`: „עוד־ועוד מילא את שולחן הישיבות בצעצועים.”
- `instruction_primary`: „הרכיבו מטרה והוסיפו דוגמת ‘לא כך’ ברורה.”
- `assembly_instruction`: „בחרו מטרה וכרטיס אחד שמראה מה לא מתאים.”
- `counterexample_label`: „לא כך: בלי צעצועים ובלי עומס על השולחן”
- `causal_instruction`: „מה לימדה דוגמת ‘לא כך’ את לופּ?”
- `concept_help`: „דוגמה מנוגדת מראה תוצאה או סגנון שלא רוצים לקבל.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b11_meeting_room` | Shared meeting-room background | static |
| `char_loop_b11_duck_clutter` | Initial counterexample reference | static tabletop clutter |
| `ui_b11_counterexample_card` | „Not like this” card | image + text + alternative description |
| `char_loop_b11_surprise_decor` | Wrong-goal outcome | static decorations |
| `char_loop_b11_vague_decor` | Vague-counterexample outcome | static oversized decorations |
| `char_loop_b11_meeting_ready` | Success | static clear table and restrained decor |
| `sfx_b11_arrange` | Dispatch | visible progress text |
| `sfx_b11_success` | Victory | stars + numeric score |

## 11. Accessibility and system behavior

- Two slots stack vertically at 360px; each card declares its slot and label.
- Click/keyboard placement fully replaces drag.
- The counterexample image has a text label and alternative description.
- Locked state is never color-only and can be explicitly edited before dispatch.
- Feedback announces one highest-priority problem at a time.
- Reduced-motion and muted modes preserve every outcome and instruction.
- No upload, free text, runtime AI or network call.
- Refresh before victory resets the session; reward commit is idempotent.

## 12. Acceptance tests

- `TEST_B11_01_FAST_SUCCESS`: correct goal, counterexample and reason → `full_success`.
- `TEST_B11_02_GOAL_PRECEDENCE`: both slots wrong → goal feedback appears first.
- `TEST_B11_03_SURPRISE_GOAL`: concrete wrong goal produces matching tabletop decoration.
- `TEST_B11_04_VAGUE_NEGATIVE`: „not ugly” leaves observable style ambiguity.
- `TEST_B11_05_RETAIN`: correct slot retains value and provenance across later repair.
- `TEST_B11_06_COUNTEREXAMPLE_ACCESS`: image card has equivalent text and alt description.
- `TEST_B11_07_LADDER`: step 4 offers exactly two cards; step 7 completes.
- `TEST_B11_08_SCORE`: goal, counterexample, iteration and cause are independently scored.
- `TEST_B11_09_KEYBOARD_360`: no drag is required at 360px.
- `TEST_B11_10_MUTED_RM_REFRESH`: complete muted/RM; refresh/double commit grants no duplicate reward.

## 13. Self-check

The battle preserves the locked rubber-duck counterexample while distinguishing a concrete counterexample from a vague negative instruction.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "עוד־ועוד מילא את שולחן הישיבות בצעצועים."
- objective: "הכינו חדר ישיבות מסודר."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "בחרו מטרה ודוגמת ״לא כך״."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"מלא את החדר בהפתעות צבעוניות"**: לופּ ביצע את המטרה, אך החדר לא מוכן לפגישה. המטרה עדיין לא מתארת את התוצאה הרצויה.
  - **"אל תעשה עיצוב לא יפה"**: ״לא יפה״ הוא שיפוט כללי מדי — לא דוגמה מנוגדת קונקרטית.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"מטרה ברורה (לקשט בסגנון הסוכנות) יחד עם דוגמה מנוגדת קונקרטית (בלי צעצועים ובלי עומס) אומרות ל־AI גם מה לעשות וגם מה להימנע ממנו. דוגמה מנוגדת מצליחה רק כשהיא קונקרטית, לא שיפוט כללי כמו "לא יפה"."
