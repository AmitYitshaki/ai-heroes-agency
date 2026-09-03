# battle_06.md — השוואת צורות

**Version:** 1.0  
**Date:** 01.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored `battleId=battle_06`.
- Removed the shortened two-attempt exception; the approved help ladder remains available.
- Removed scoring based on first/second attempt.
- Replaced personal names with role-based teams.
- Added an explicit comparison criterion and causal explanation so four score criteria are distinct.
- Defined semantic table/text outputs and complete recovery tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_06` |
| `regionId` | `fog_district` |
| `order` | 6 |
| title | השוואת צורות |
| villain | מר בערך |
| `skillCodes` | `["format"]` |
| `battleType` | `robot_test` |
| real-world need | לבחור פורמט שמאפשר להשוות שעות ונתונים במהירות |
| objective | לבחור טבלה במקום פסקה עבור לוח תורנויות |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "semantic_table_required"]` |

## 3. Story and learning

לופּ יצר שתי גרסאות ללוח התורנויות של עמדת המידע: פסקה וטבלה. שתיהן מכילות את אותם נתונים. הילד צריך להגדיר מה חשוב למצוא ולבחור את הגרסה השימושית יותר.

Learning objective: a format is evaluated against the task, not by appearance alone.

Primary instruction:

> השוו את שתי התוצאות ובחרו את הפורמט השימושי.

## 4. Approved data

The same fixed data appears in both outputs:

- בוקר — צוות המפה;
- צהריים — צוות הקשר;
- ערב — צוות הציוד.

No personal names or external facts.

## 5. Flow and timing

| State | Purpose | Instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Present two results | „לופּ הציג את אותו לוח בשתי צורות.” | `select_criterion` | 10s |
| `select_criterion` | Define evaluation need | „מה צריך למצוא במהירות?” | retry or `compare` | 15s |
| `compare` | Compare paragraph/table | „איזה מסך מאפשר להשוות צוות וזמן?” | `outcome` | 20s |
| `outcome` | Demonstrate chosen usability | approved result + `המשך` | feedback or `causal_check` | 10s |
| `feedback` | One correction | ladder + `חזרה להשוואה` | current step | 8s |
| `causal_check` | Explain why table helps | „למה הטבלה קלה יותר להשוואה?” | retry or victory | 10s |
| `victory` | Score/map | „פורמט טוב מתאים למה שצריך לבדוק.” | score/map | 10s |

## 6. Prompt components and compared outputs

### Evaluation criterion

| ID | Label | Role |
|---|---|---|
| `b06_criterion_team_time` | איזה צוות נמצא בכל שעה | correct |
| `b06_criterion_color` | איזה מסך צבעוני יותר | visual distractor unrelated to task |
| `b06_criterion_length` | איזה טקסט ארוך יותר | measurable but not useful |

### Compared results

#### `b06_format_paragraph`

> בבוקר יפעל צוות המפה. לאחר מכן, בצהריים, יפעל צוות הקשר. בערב יפעל צוות הציוד.

The data is correct but times and teams are embedded in continuous text.

#### `b06_format_table`

| זמן | צוות |
|---|---|
| בוקר | צוות המפה |
| צהריים | צוות הקשר |
| ערב | צוות הציוד |

The table exposes one comparable pair per row.

### Causal check

- Correct: `b06_reason_rows_columns` — „כי הזמן והצוות מסודרים בשורות ובעמודות”.
- Distractor: `b06_reason_more_correct` — „כי רק הטבלה מכילה מידע נכון”.
- Distractor: `b06_reason_more_color` — „כי הטבלה צבעונית יותר”.

## 7. States and outcomes

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b06_wrong_criterion` | color/length selected | `b06_irrelevant_criterion` | Both screens remain; task badge says „מצאו צוות לפי שעה” | „ההשוואה צריכה לעזור לבצע את המשימה, לא לבחור מראה.” |
| `b06_paragraph` | paragraph selected | `b06_paragraph_scan` | A marker searches through the paragraph and passes several words | „כל הנתונים נכונים, אבל קשה למצוא במהירות צוות לפי שעה.” |
| `b06_wrong_reason` | causal answer incorrect | `b06_reason_retry` | Table remains selected; explanation panel stays open | „שתי הגרסאות נכונות. מה הופך אחת לקלה להשוואה?” |
| `b06_valid` | criterion + table + reason correct | `full_success` | Three team/time rows are immediately highlighted | „נכון. הטבלה מסדרת את הנתונים להשוואה.” |

`unsafeStates=[]`.

Priority: evaluation criterion → format choice → causal check.

The paragraph option remains available after an error; it is not silently removed. This keeps the graded help ladder meaningful.

## 8. Feedback ladder

1. „הפורמט שבחרתם עדיין מקשה על ההשוואה. נסו שוב.”
2. „השעות והצוותים מסתתרים בתוך הטקסט הרציף.”
3. „בדקו שוב את שתי התוצאות בעצמכם.”
4. Static emphasis + exactly two choices relevant to the unresolved question.
5. „חפשו את המסך שמפריד זמן וצוות.”
6. Preserve the correct evaluation criterion; highlight the table with icon/text.
7. Guided completion selects the table and proceeds.

## 9. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b06_score_criterion` | Select a task-relevant evaluation criterion | `user_independent` | `user_choice_two` | `system_completed` |
| `b06_score_comparison` | Select the table, including independent self-correction | `user_independent` | `user_choice_two` | `system_completed` |
| `b06_score_iteration` | Test/correct based on result, or succeed first try | `user_independent` | `user_choice_two` | `system_completed` |
| `b06_score_cause` | Explain the table's comparative advantage | `user_independent` | `user_choice_two` | `system_completed` |

A wrong first selection does not automatically cap the score.

## 10. Copy registry

- `title`: „השוואת צורות”
- `comic_setup`: „לופּ הציג את אותו לוח בשתי צורות.”
- `instruction_primary`: „השוו את שתי התוצאות ובחרו את הפורמט השימושי.”
- `criterion_instruction`: „מה צריך למצוא במהירות?”
- `compare_instruction`: „איזה מסך מאפשר להשוות צוות וזמן?”
- `causal_instruction`: „למה הטבלה קלה יותר להשוואה?”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced motion / muted |
|---|---|---|
| `bg_b06_information_desk` | Information area | static |
| `char_loop_b06_two_panels` | Presents both outputs | static |
| `ui_b06_schedule_paragraph` | Paragraph result | semantic text |
| `ui_b06_schedule_table` | Table result | semantic table |
| `ui_b06_search_marker` | Shows scanning difficulty | static start/end markers in RM |
| `sfx_b06_compare` | Select/compare | visible selected state |
| `sfx_b06_success` | Victory | stars + numeric score |

## 12. Accessibility and system behavior

- On 360px, outputs stack vertically; labels identify „פסקה” and „טבלה”.
- Screen-reader order presents criterion, paragraph and table consistently.
- Table uses proper row/column semantics.
- Format meaning does not rely on layout screenshot alone.
- Selected/focus states are distinct.
- Full help, muted and reduced-motion paths work.
- No AI/network or persistent session state.
- Refresh grants nothing; victory transaction is idempotent.

## 13. Acceptance tests

- `TEST_B06_01_FAST_SUCCESS`: task criterion + table + reason → 5.
- `TEST_B06_02_PARAGRAPH_CORRECT_DATA`: paragraph contains identical approved facts.
- `TEST_B06_03_SELF_CORRECTION`: paragraph then independent table correction can retain independent provenance.
- `TEST_B06_04_FULL_LADDER`: repeated paragraph selections reach steps 4/6/7 without hidden removal.
- `TEST_B06_05_CRITERION`: color/length choices produce task-relevance feedback.
- `TEST_B06_06_SEMANTIC_TABLE`: row/column relationships exposed programmatically.
- `TEST_B06_07_360_KEYBOARD`: stacked comparison completes by keyboard.
- `TEST_B06_08_MUTED_RM`: search difficulty and success remain understandable.
- `TEST_B06_09_REFRESH`: no reward before victory.
- `TEST_B06_10_SCORE`: attempt count alone never changes criterion value.

## 14. Self-check

The approved table-versus-paragraph comparison remains intact. The help ladder and scoring now comply with the product rules. No upstream schema update is required.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "לופּ הציג את אותו לוח בשתי צורות."
- objective: "מצאו במהירות איזה צוות נמצא בכל שעה."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "בחרו את הפורמט השימושי להשוואה."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"פסקה רציפה"**: כל הנתונים נכונים, אבל קשה למצוא צוות לפי שעה. הפורמט (פסקה רציפה) לא מתאים להשוואה מהירה.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"טבלה מפרידה זמן וצוות לשורות נפרדות, כך שאפשר למצוא מי עובד מתי בלי לקרוא הכול. כשצריך להשוות נתונים, פורמט טבלאי הוא הרכיב שקובע אם התוצאה שימושית או לא."
