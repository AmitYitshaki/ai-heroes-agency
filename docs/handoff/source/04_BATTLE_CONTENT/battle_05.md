# battle_05.md — שפה אחת

**Version:** 1.0  
**Date:** 01.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored `battleId=battle_05`.
- Replaced the implausible mathematics distractor with two realistic but inferior output formats.
- Removed sleeping/confusion jokes directed at people.
- Added format diagnosis and causal verification.
- Completed states, ladder, scoring, system behavior and test coverage.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_05` |
| `regionId` | `fog_district` |
| `order` | 5 |
| title | שפה אחת |
| villain | מר בערך |
| `skillCodes` | `["format"]` |
| `battleType` | `power_selection` |
| real-world need | בחירת מבנה פלט שקל לסרוק ולהשתמש בו |
| objective | לבקש רשימת נקודות להצגת תפריט |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "semantic_text_required"]` |

## 3. Story and learning

לופּ מציג את שלוש אפשרויות ארוחת הצהריים כפסקה רציפה. כל המידע נכון, אבל קשה למצוא במהירות את האפשרויות.

The approved on-screen items are fictional and fixed:

- כריך ירקות;
- פסטה;
- קערת פירות.

Learning objective: format controls how the result is organized.

Primary instruction:

> זהו את בעיית הפורמט ובחרו תצוגה ברורה.

## 4. Flow and timing

| State | Purpose | Instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Show dense output | „כל המנות כאן, אבל קשה למצוא אותן.” | `diagnose` | 10s |
| `format_help` | Optional definition | „פורמט הוא המבנה: רשימה, טבלה או סיכום.” | return | optional 5s |
| `diagnose` | Identify missing prompt component | „איזה רכיב חסר בפרומפט?” | retry or `select_format` | 15s |
| `select_format` | Choose useful output | „איך כדאי להציג שלוש מנות?” | `dispatch` | 20s |
| `dispatch` | Render selected format | „מסדר את התפריט…” | `outcome` | 3s |
| `outcome` | Compare usefulness | approved result | feedback or `causal_check` | 8s |
| `feedback` | Correct one component | ladder + `חזרה` | unresolved step | 8s |
| `causal_check` | Verify principle | „למה הרשימה עזרה?” | retry or victory | 8s |
| `victory` | Score/map | „פורמט מתאים הופך מידע לקל למציאה.” | score/map | 8s |

## 5. Prompt components

### Diagnosis

| ID | Label | Role |
|---|---|---|
| `b05_diag_format` | פורמט | correct |
| `b05_diag_context` | הקשר | plausible earlier-skill distractor |
| `b05_diag_tone` | טון | plausible but irrelevant |

### Format options

| ID | Label | Why plausible | Result |
|---|---|---|---|
| `b05_format_paragraph` | כפסקה אחת | Contains all information, but scanning individual items is slow | dense paragraph remains |
| `b05_format_summary` | כסיכום קצר | Concise, but compresses the menu and omits item-level visibility | panel says only „שלוש אפשרויות זמינות” |
| `b05_format_bullets` | כרשימת נקודות | Shows each menu item separately | three clear bullet rows |

### Causal check

- Correct: `b05_reason_separate_items` — „כי כל מנה הופיעה בשורה נפרדת”.
- Distractor: `b05_reason_more_text` — „כי נוסף יותר טקסט”.
- Distractor: `b05_reason_changed_menu` — „כי המנות עצמן השתנו”.

## 6. States and outcomes

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b05_wrong_diagnosis` | context/tone selected | `b05_format_still_missing` | Format slot remains empty | „המידע נכון ומתאים; הבעיה היא איך הוא מסודר.” |
| `b05_paragraph` | paragraph | `b05_dense_paragraph` | All items appear inside one text block | „המידע קיים, אבל קשה לסרוק אותו במהירות.” |
| `b05_summary` | summary | `b05_overcompressed_summary` | Summary hides the names of the three items | „הסיכום קצר, אבל הוא אינו מציג כל אפשרות בנפרד.” |
| `b05_wrong_reason` | reason incorrect | `b05_reason_retry` | Correct list stays; explanation remains | „המנות לא השתנו. מה השתנה באופן ההצגה?” |
| `b05_valid` | format diagnosed + bullets + correct reason | `full_success` | Three bullet rows appear clearly | „מעולה. רשימת הנקודות הפרידה בין האפשרויות.” |

`unsafeStates=[]`.

Priority: diagnosis → format → causal check.

## 7. Feedback ladder

1. „הפורמט עדיין לא עוזר למצוא את המנות. נסו שוב.”
2. „אנחנו צריכים לראות כל אפשרות בנפרד.”
3. „בחרו פורמט אחר בעצמכם.”
4. Static emphasis + exactly two formats.
5. „איזה פורמט מציג פריטים בזה אחר זה?”
6. Preserve diagnosis; highlight `כרשימת נקודות` with icon/text.
7. Guided completion applies the format and continues.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b05_score_diagnosis` | Identify format as the missing component | `user_independent` | `user_choice_two` | `system_completed` |
| `b05_score_format` | Select bullet-list format | `user_independent` | `user_choice_two` | `system_completed` |
| `b05_score_iteration` | Test/correct from result, or succeed first try | `user_independent` | `user_choice_two` | `system_completed` |
| `b05_score_cause` | Explain why the list is usable | `user_independent` | `user_choice_two` | `system_completed` |

## 9. Copy registry

- `title`: „שפה אחת”
- `comic_setup`: „לופּ הציג את כל התפריט כפסקה אחת.”
- `instruction_primary`: „זהו את בעיית הפורמט ובחרו תצוגה ברורה.”
- `diagnose_instruction`: „איזה רכיב חסר בפרומפט?”
- `select_instruction`: „איך כדאי להציג שלוש מנות?”
- `causal_instruction`: „למה הרשימה עזרה?”
- `format_help`: „פורמט הוא המבנה שבו רוצים לקבל את התוצאה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced motion / muted |
|---|---|---|
| `bg_b05_agency_canteen` | Canteen/menu background | static |
| `ui_b05_menu_paragraph` | Initial/paragraph state | text remains accessible HTML |
| `ui_b05_menu_summary` | Summary state | accessible text |
| `ui_b05_menu_bullets` | Success | semantic list |
| `char_loop_b05_presenting` | Loop-X presenter | static |
| `sfx_b05_print` | Format render | visible progress/state label |
| `sfx_b05_success` | Victory | stars + numeric score |

Do not bake Hebrew menu text into images.

## 11. Accessibility and system behavior

- Menu outputs are semantic HTML text, not image-only.
- Format cards expose label and short consequence.
- Help closes back to the invoking control without state loss.
- Static border/icon/text communicates selection and correctness.
- Complete flow works keyboard-only, muted and reduced-motion.
- At 360px, cards stack vertically without horizontal scrolling.
- No network/AI request or session persistence.
- Reward commits only after victory.

## 12. Acceptance tests

- `TEST_B05_01_FAST_SUCCESS`: format diagnosis + bullets + reason → 5.
- `TEST_B05_02_PARAGRAPH`: all three items remain present but hard to scan.
- `TEST_B05_03_SUMMARY`: summary is concise but omits item-level display.
- `TEST_B05_04_SEMANTIC_LIST`: success output uses list semantics.
- `TEST_B05_05_LADDER`: step 4 exactly two choices; step 6 preserves diagnosis.
- `TEST_B05_06_PROVENANCE`: criteria recorded independently; retries alone do not reduce.
- `TEST_B05_07_KEYBOARD_HELP`: help and full battle work without pointer.
- `TEST_B05_08_360_RM_MUTED`: no scroll or information loss.
- `TEST_B05_09_REFRESH`: refresh before victory grants nothing.
- `TEST_B05_10_IDEMPOTENCY`: score/map double activation commits once.

## 13. Self-check

The battle teaches format selection using realistic alternatives and accessible text. No upstream schema change is required.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "לופּ הציג את כל התפריט כפסקה אחת צפופה."
- objective: "הציגו שלוש מנות כך שקל למצוא כל אחת."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "בחרו תצוגה ברורה לתפריט."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"כפסקה אחת"**: כל המנות קיימות, אבל קשה לסרוק אותן. הפורמט (פסקה) לא מתאים למידע שצריך להשוות.
  - **"כסיכום קצר"**: לופּ הציג רק: שלוש אפשרויות זמינות. הפורמט הזה תמציתי מדי — הוא מסתיר את הפרטים שביקשתם.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"רשימת נקודות מציגה כל מנה בנפרד, כך שקל לסרוק ולהשוות במבט אחד. פורמט הוא ההנחיה שאומרת ל־AI באיזו צורה להציג מידע — הבחירה הנכונה הופכת תוכן נכון לשימושי."
