# battle_02.md — למי זה מיועד?

**Version:** 1.0  
**Date:** 01.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_02`.
- Replaced unsafe heavy tools and occupational stereotypes with harmless audience-specific kits.
- Removed all flashing; scanning uses a static outline and label.
- Added a separate fault-diagnosis action so scoring criteria do not duplicate one selection.
- Defined complete states, help ladder, provenance scoring, recovery and acceptance tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_02` |
| `regionId` | `fog_district` |
| `order` | 2 |
| title | למי זה מיועד? |
| villain | מר בערך |
| `skillCodes` | `["context"]` |
| `battleType` | `fault_scan` |
| real-world need | התאמת הסבר, ציוד או תוכן לקהל יעד |
| objective | לזהות שחסר קהל יעד ולבחור את המשתמשים הנכונים |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "no_personal_data"]` |

## 3. Story and learning

מר בערך מחק שורה מהזמנת הציוד של סדנת האמנות. לופּ קיבל את ההוראה „הזמן ציוד לסדנת האמנות עבור…” בלי לדעת מי ישתמש בציוד, ולכן הביא ערכת צביעה גדולה שמתאימה לחידוש קירות.

Learning objective: context explains who the result is for. Different audiences can make different outputs reasonable.

Primary instruction:

> מצאו למי מיועד הציוד והשלימו את ההקשר.

## 4. On-screen material

- Approved prompt frame: `הזמן ציוד לסדנת האמנות עבור [חסר]`.
- Static order card with the audience field covered by fog.
- Three diagnosis chips.
- Three audience cards.
- No real names or personal fields.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Establish causal failure | „מר בערך מחק שורה מההזמנה. לופּ הביא ציוד לקירות.” / `התחילו סריקה` | `diagnose` | 10s |
| `diagnose` | Identify missing information type | „איזה פרט חסר בהוראה?” | diagnosis outcome or `choose_audience` | 15s |
| `choose_audience` | Add relevant context | „למי מיועדת סדנת האמנות?” | `dispatch` | 20s |
| `dispatch` | Short execution status | „מעביר את ההקשר ללופּ…” | `outcome` | 3s |
| `outcome` | Show causal result | approved outcome + `המשך` | feedback or `causal_check` | 8s |
| `feedback` | One actionable correction | feedback ladder + `חזרה לסריקה` | unresolved step | 8s |
| `causal_check` | Verify understanding | „למה הציוד מתאים הפעם?” | retry or `victory` | 10s |
| `victory` | Summarize and score | „כשהקהל ברור, לופּ מתאים את התוצאה.” | score/map | 10s |

Fast path: approximately 76 seconds. One normal correction: approximately 90 seconds.

## 6. Prompt components

### Diagnosis

| `componentId` | Label | Role | Why plausible |
|---|---|---|---|
| `b02_diag_audience` | מי ישתמש בציוד | correct | The open sentence explicitly requires an audience |
| `b02_diag_quantity` | כמה ארגזים להזמין | distractor | Quantity could matter, but does not explain the wrong kit |
| `b02_diag_package_color` | מה צבע האריזה | distractor | A visible order detail, but irrelevant to equipment fit |

### Audience context

| `componentId` | Label | Outcome |
|---|---|---|
| `b02_context_maintenance` | צוות חידוש הקירות | Loop-X brings wide rollers, paint trays and covering sheets |
| `b02_context_office` | צוות ארגון המשרד | Loop-X brings labels, folders and planning boards |
| `b02_context_children` | ילדי הרובע | Loop-X brings washable colors, brushes and large paper |

Every option is a legitimate audience with a logically different kit. Only `b02_context_children` fits the displayed community art workshop.

### Causal check

- Correct: `b02_reason_audience` — „כי ציינו מי ישתמש בציוד”.
- Distractor: `b02_reason_retry` — „כי לופּ ניסה שוב”.
- Distractor: `b02_reason_package` — „כי בחרנו צבע לאריזה”.

## 7. States and outcomes

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b02_partial_wrong_diagnosis` | diagnosis is quantity/color | `b02_wrong_diagnosis` | The audience line remains covered; the wall-painting kit stays | „הפרט שבחרתם לא מסביר למי מיועד הציוד.” |
| `b02_partial_maintenance` | maintenance audience | `b02_maintenance_kit` | Harmless wall-renewal kit appears | „הציוד מתאים לחידוש קירות, לא לפעילות היצירה שמוצגת.” |
| `b02_partial_office` | office audience | `b02_office_kit` | Labels and planning boards appear | „הציוד מתאים לארגון משרד. בדקו מי מגיע לסדנה.” |
| `b02_partial_reason` | wrong causal reason | `b02_reason_retry` | Correct kit stays; only explanation panel remains open | „מה השתנה בפרומפט לפני שהציוד התאים?” |
| `b02_valid` | audience diagnosed + children selected + causal reason correct | `full_success` | Art-workshop kit is arranged by Loop-X | „מעולה. ההקשר הגדיר למי התוצאה מיועדת.” |

`unsafeStates=[]`: all interactions use closed approved choices.

Priority: unresolved diagnosis → audience → causal check.

## 8. Feedback ladder

The ladder applies to the currently unresolved component and preserves completed components.

1. „הציוד עדיין לא מתאים. בדקו את ההקשר ונסו שוב.”
2. Name the current missing component: „חסר לנו לדעת מי ישתמש בציוד.”
3. „נסו לתקן בעצמכם.”
4. Static outline + exactly two choices: the correct option and one meaningful distractor.
5. „בחרו את האפשרות שמתאימה למידע שמופיע בהזמנה.”
6. Lock completed parts with icon + text `נכון`; highlight the correct remaining option and ask the child to select it.
7. Guided completion applies the remaining component and continues to victory.

No attempt count, elapsed time or hint view directly changes score.

## 9. Scoring

Base: 1 star. Four criteria use provenance independently.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b02_score_diagnosis` | Identify the missing context type | `user_independent` | `user_choice_two` | `system_completed` |
| `b02_score_audience` | Select the correct audience | `user_independent` | `user_choice_two` | `system_completed` |
| `b02_score_iteration` | Test and correct after the outcome, or succeed first try | `user_independent` | `user_choice_two` | `system_completed` |
| `b02_score_cause` | Explain the prompt→result cause | `user_independent` | `user_choice_two` | `system_completed` |

Score is displayed as stars and numeric value, e.g. `4.5 / 5`.

## 10. Copy registry

- `title`: „למי זה מיועד?”
- `comic_setup`: „מר בערך מחק את הקהל מההזמנה.”
- `instruction_primary`: „מצאו למי מיועד הציוד והשלימו את ההקשר.”
- `diagnose_instruction`: „איזה פרט חסר בהוראה?”
- `audience_instruction`: „למי מיועדת סדנת האמנות?”
- `causal_instruction`: „למה הציוד מתאים הפעם?”
- `context_help`: „הקשר הוא מידע שעוזר להבין למי, איפה או למה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced motion / muted equivalent |
|---|---|---|
| `bg_b02_art_workshop` | Workshop background | static |
| `ui_b02_order_card` | Prompt/order card | static |
| `char_loop_b02_wall_kit` | Initial/maintenance outcome | static result image |
| `char_loop_b02_office_kit` | Office outcome | static result image |
| `char_loop_b02_art_kit` | Success | static result image |
| `sfx_b02_scan` | Scan | static outline + label |
| `sfx_b02_success` | Victory | stars + numeric score |

No flashing, shaking or dangerous equipment.

## 12. Accessibility and system behavior

- Touch targets ≥44×44px.
- Diagnosis and audience cards use buttons; drag is optional.
- Keyboard order follows RTL visual flow.
- Selected, correct and locked states use icon, border and text, not color alone.
- Dynamic feedback receives focus/announcement once.
- Refresh returns to battle start; no reward is committed before victory.
- No session choices or attempts are persisted.
- This battle makes no network or AI call.

## 13. Acceptance tests

- `TEST_B02_01_FAST_SUCCESS`: correct diagnosis, audience and reason → `full_success`, all four criteria independent.
- `TEST_B02_02_DIAGNOSIS`: quantity selected → `b02_wrong_diagnosis`; audience step remains locked.
- `TEST_B02_03_MAINTENANCE`: maintenance selected → harmless wall kit and causal feedback.
- `TEST_B02_04_OFFICE`: office selected → office kit and neutral feedback without stereotype.
- `TEST_B02_05_LADDER`: step 4 shows exactly two options; step 6 preserves completed components.
- `TEST_B02_06_PROVENANCE`: each criterion records its own provenance; retries alone do not lower it.
- `TEST_B02_07_KEYBOARD`: complete with Tab/Enter/Space.
- `TEST_B02_08_MUTED_RM`: complete muted and reduced-motion with all information intact.
- `TEST_B02_09_REFRESH`: refresh before victory grants no stars and returns to start.
- `TEST_B02_10_DOUBLE_COMMIT`: repeated score CTA grants reward once.

## 14. Self-check

Canonical map, single skill, causal world response, closed choices, safe content, full ladder, independent scoring and accessibility requirements all pass. No upstream schema change is required.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "מר בערך מחק את הקהל מהזמנת הציוד."
- objective: "התאימו ציוד לסדנת האמנות."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "מצאו למי מיועד הציוד והשלימו את ההקשר."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"צוות חידוש הקירות"**: לופּ הביא רולרים וכיסויי רצפה — ציוד לקירות, לא לסדנה. חסר הקשר: מי בדיוק משתמש בציוד.
  - **"צוות ארגון המשרד"**: לופּ הביא תיקיות ולוחות תכנון — בדקו מי מגיע לסדנה. עדיין חסר ההקשר: מיהו הקהל האמיתי.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"כשציינתם שהציוד מיועד לילדי הרובע, לופּ ידע בדיוק מה להביא. הקשר אומר ל־AI "למי" זה מיועד — בלעדיו הוא בוחר ברירת מחדל שרירותית. גם מחוץ למשחק, ציון הקהל משנה לגמרי את התשובה שמתקבלת."
