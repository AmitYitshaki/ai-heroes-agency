# battle_10.md — הראו לי איך

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_10` and all required schema fields.
- Replaced the inaccurate claim that an example is always the strongest constraint with a narrower, correct learning claim.
- Removed occupational stereotyping and changed the irrelevant example to a neutral factory-wayfinding reference.
- Added recognition of when an example is useful and a causal check, preventing duplicated scoring from one selection.
- Defined the built-in attachment as approved static content; no child upload or file picker exists.
- Added complete states, help ladder, accessibility requirements and ten acceptance tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_10` |
| `regionId` | `no_limits_factory` |
| `order` | 10 |
| title | הראו לי איך |
| villain | עוד־ועוד |
| `skillCodes` | `["example"]` |
| `battleType` | `power_selection` |
| real-world need | לצרף דוגמה רלוונטית כאשר קשה לתאר סגנון או מבנה במילים בלבד |
| objective | לזהות שדרושה דוגמה ולצרף את דוגמת הסמל המאושרת |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "built_in_reference_only", "no_runtime_ai"]` |

## 3. Story and learning

לופּ התבקש לעצב סמל חדש למדי הסוכנות מתוך התיאור „סמל טכנולוגי בצבעי הסוכנות”. התיאור אינו מציג את המבנה החזותי המאושר, ולכן התקבל כתם צבעוני במקום סמל ברור.

Learning objective: a relevant example can communicate a desired style or structure that words alone leave ambiguous. An irrelevant example can steer the result in the wrong direction.

Primary instruction:

> בחרו דוגמה שמראה ללופּ את הסגנון המבוקש.

## 4. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Show style mismatch | „לופּ קיבל תיאור כללי ויצר כתם במקום סמל.” | `diagnose` | 10s |
| `diagnose` | Recognize the useful component | „מה יעזור להבהיר את העיצוב: כמות, פורמט או דוגמה?” | feedback or `choose_example` | 15s |
| `choose_example` | Select relevant approved reference | „איזה כרטיס מראה את הסמל הרצוי?” | `dispatch` | 20s |
| `dispatch` | Apply reference | „מצרף את הדוגמה המאושרת…” | `outcome` | 3s |
| `outcome` | Show reference effect | approved result + `המשך` | feedback or `causal_check` | 8s |
| `feedback` | Correct current selection | ladder + `חזרה` | unresolved state | 8s |
| `causal_check` | Confirm relevance | „למה הדוגמה המאושרת עזרה?” | retry or `victory` | 10s |
| `victory` | Score | „דוגמה רלוונטית הראתה ללופּ את המבנה והסגנון.” | score/map | 12s |

## 5. Prompt components

Base prompt: `עצב סמל חדש למדי הסוכנות בסגנון טכנולוגי [חסר]`.

### Diagnosis

| `componentId` | Label | Role |
|---|---|---|
| `b10_diag_example` | דוגמה לסגנון הרצוי | correct |
| `b10_diag_quantity` | מספר הסמלים להדפסה | plausible production detail, not the current mismatch |
| `b10_diag_format` | רשימה או טבלה | irrelevant to a visual symbol |

### Example cards

| `componentId` | Label | Asset | Causal outcome |
|---|---|---|---|
| `b10_example_color_words` | „בצבעים כחול וסגול” | none | narrows color but still leaves the symbol structure open |
| `b10_example_wayfinding` | „כמו שלט ההכוונה במפעל” | `ui_b10_reference_wayfinding` | produces an arrow-shaped sign rather than the agency emblem |
| `b10_example_approved_emblem` | „כמו דוגמת סמל הסוכנות המאושרת” | `ui_b10_reference_emblem` | correct 2D agency emblem consistent with the reference |

The attachment icon means „built-in approved reference”. It never opens a file picker and never accesses the device.

### Causal check

- Correct `b10_reason_structure`: „כי הדוגמה הראתה מבנה וסגנון מתאימים”.
- Distractor `b10_reason_attachment`: „כי כל קובץ מצורף תמיד נכון”.
- Distractor `b10_reason_more_color`: „כי ביקשנו יותר צבעים”.

## 6. States and outcomes

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b10_wrong_diagnosis` | quantity/format diagnosis | `b10_example_gap_remains` | Style gap remains visible beside the base prompt | „הפרט הזה לא מראה איך הסמל צריך להיראות.” |
| `b10_color_words` | color description selected | `b10_colored_shape` | Neat colored shape without the approved emblem structure | „הצבעים מתאימים, אבל המבנה עדיין לא ברור.” |
| `b10_wayfinding_example` | factory sign selected | `b10_arrow_emblem` | Loop-X creates a clear arrow emblem matching the wrong reference | „לופּ חיקה את הדוגמה, אבל זו דוגמה מסוג אחר.” |
| `b10_wrong_reason` | causal answer incorrect | `b10_reason_unresolved` | Correct emblem remains; reason panel stays active | „מה היה רלוונטי דווקא בדוגמה שבחרתם?” |
| `b10_valid` | diagnosis, approved example and reason correct | `full_success` | Reference and new 2D emblem appear side by side | „נכון. הדוגמה הרלוונטית הבהירה את הסגנון.” |

Priority: diagnosis → relevant example → causal check → success. `unsafeStates=[]`.

## 7. Feedback ladder

1. „הסמל עדיין לא מתאים לדוגמה המאושרת. נסו לשפר את הבחירה.”
2. Show result beside chosen card: „לופּ עקב אחרי המידע שקיבל, אבל הדוגמה לא הייתה רלוונטית.”
3. „נסו לבחור דוגמה שמציגה את סוג הסמל המבוקש.”
4. Statically emphasize the example field and show exactly two relevant cards.
5. „השוו בין הדוגמאות ובחרו בזו ששייכת למדי הסוכנות.”
6. Preserve completed parts; highlight the approved emblem reference with icon, border and text.
7. Guided completion selects the reference and guarantees victory.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b10_score_diagnosis` | Recognize that a style example is needed | `user_independent` | `user_choice_two` | `system_completed` |
| `b10_score_example` | Select the relevant approved emblem reference | `user_independent` | `user_choice_two` | `system_completed` |
| `b10_score_iteration` | Compare and improve, or succeed on first dispatch | `user_independent` | `user_choice_two` | `system_completed` |
| `b10_score_cause` | Explain why relevance matters | `user_independent` | `user_choice_two` | `system_completed` |

## 9. Copy registry

- `title`: „הראו לי איך”
- `comic_setup`: „לופּ קיבל תיאור כללי ויצר כתם במקום סמל.”
- `instruction_primary`: „בחרו דוגמה שמראה ללופּ את הסגנון המבוקש.”
- `diagnose_instruction`: „מה יעזור להבהיר את העיצוב: כמות, פורמט או דוגמה?”
- `example_instruction`: „איזה כרטיס מראה את הסמל הרצוי?”
- `causal_instruction`: „למה הדוגמה המאושרת עזרה?”
- `concept_help`: „דוגמה היא תוצאה או תמונה שממחישה למה התכוונו. היא צריכה להיות רלוונטית למשימה.”
- `attachment_label`: „דוגמה מובנית — אין העלאת קובץ”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b10_factory_design_lab` | Design station | static |
| `char_loop_b10_abstract_shape` | Initial/color-only result | static |
| `ui_b10_reference_wayfinding` | Irrelevant but plausible example | image plus accessible description |
| `ui_b10_reference_emblem` | Correct approved example | image plus accessible description |
| `char_loop_b10_arrow_emblem` | Wrong-reference outcome | static |
| `char_loop_b10_agency_emblem` | Success | static side-by-side comparison |
| `sfx_b10_reference_attach` | Select reference | visible attached-state label |
| `sfx_b10_success` | Victory | stars + numeric score |

No text is burned into reference art; each visual example has a concise alternative description.

## 11. Accessibility and system behavior

- Visual examples include names and alternative descriptions; the answer is not available from image detail alone.
- Selection works by click, touch and keyboard; drag is optional.
- Attached state uses icon, border and text, not color alone.
- At 360px, example cards stack and retain their full label.
- Reduced-motion uses static before/after panels; muted mode preserves all meaning.
- No file picker, camera, upload permission, runtime AI or network request.
- Refresh before victory grants nothing; the final transaction is idempotent.

## 12. Acceptance tests

- `TEST_B10_01_FAST_SUCCESS`: identify example, choose approved emblem and reason → `full_success`.
- `TEST_B10_02_DIAG_QUANTITY`: quantity does not resolve the style mismatch.
- `TEST_B10_03_DIAG_FORMAT`: table/list choice is rejected as irrelevant.
- `TEST_B10_04_COLOR_WORDS`: color description produces correct colors but unresolved structure.
- `TEST_B10_05_WRONG_REFERENCE`: wayfinding example causally produces arrow emblem.
- `TEST_B10_06_NO_UPLOAD`: attachment never opens device/file permissions.
- `TEST_B10_07_LADDER`: step 4 contains exactly two choices; step 7 completes.
- `TEST_B10_08_SCORE`: all four criteria keep independent provenance.
- `TEST_B10_09_KEYBOARD_360`: complete keyboard-only at 360px.
- `TEST_B10_10_MUTED_RM_REFRESH`: static/muted path works and reward remains idempotent.

## 13. Self-check

The battle preserves the locked positive-example scenario while accurately teaching that examples must be relevant and do not replace clear goals or constraints.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "לופּ קיבל תיאור כללי ויצר כתם במקום סמל."
- objective: "עצבו סמל מתאים למדי הסוכנות."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "בחרו דוגמה שממחישה את הסגנון."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"בצבעים כחול וסגול"**: הצבעים נכונים, אך המבנה עדיין לא ברור. חסרה דוגמה שממחישה צורה, לא רק צבע.
  - **"כמו שלט ההכוונה במפעל"**: לופּ חיקה את החץ במקום את סמל הסוכנות. הדוגמה שנבחרה לא רלוונטית לסוג העיצוב המבוקש.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"דוגמת הסמל המאושר מראה ללופּ בדיוק את הסגנון המצופה, לא רק תיאור שאפשר לפרש בדרכים שונות. דוגמה רלוונטית ממחישה למה מתכוונים כשקשה לתאר זאת רק במילים."
