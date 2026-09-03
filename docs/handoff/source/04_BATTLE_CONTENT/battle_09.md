# battle_09.md — נימוסים במפעל

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_09` and structured reward/safety fields.
- Aligned the cause with the campaign: the prompt omits tone rather than explicitly requesting an insulting tone.
- Removed scanner flashing, alarm-like presentation and a background fall used as a joke.
- Rebuilt the shortened five-step help flow as the complete six-attempt ladder plus guided completion.
- Separated diagnosis, repair, iteration and causal reasoning into four provenance-scored behaviors.
- Added complete outcome priority, accessibility, recovery and test contracts.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_09` |
| `regionId` | `no_limits_factory` |
| `order` | 9 |
| title | נימוסים במפעל |
| villain | עוד־ועוד |
| `skillCodes` | `["constraint"]` |
| `battleType` | `fault_scan` |
| real-world need | לבקש טון ושפה שמתאימים לקהל ולמצב |
| objective | לזהות שחסר אילוץ טון ולהוסיף שפה רגועה ומכבדת |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "respectful_language"]` |

## 3. Story and learning

ליד אזור ניקוי מסומן במפעל, לופּ מדפיס שלט דרמטי ומאשים מפני שהפקודה ביקשה רק „כתוב שלט אזהרה על רצפה רטובה” ולא הגדירה כיצד לדבר. הסוכנים נעצרים ומתקשים להבין את ההנחיה.

Learning objective: a constraint can control tone and language, not only quantity. Calm and respectful wording can remain clear and serious.

Primary instruction:

> סרקו את הפקודה והוסיפו את אילוץ הטון החסר.

## 4. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Show unsuitable output | „השלט דרמטי ומאשים. איזה חלק חסר בפקודה?” | `scan_prompt` | 10s |
| `scan_prompt` | Diagnose the missing field | „סמנו מה חסר: מטרה, טון או גודל אותיות.” | feedback or `repair_prompt` | 18s |
| `repair_prompt` | Add a tone constraint | „בחרו טון ברור שמתאים לאזהרה במפעל.” | `dispatch` | 18s |
| `dispatch` | Apply repair | „מעדכן את השלט…” | `outcome` | 3s |
| `outcome` | Show causal result | approved sign result + `המשך` | feedback or `causal_check` | 8s |
| `feedback` | Focus one unresolved behavior | ladder + `חזרה לתיקון` | unresolved state | 8s |
| `causal_check` | Confirm transfer | „למה השלט מתאים יותר עכשיו?” | retry or `victory` | 10s |
| `victory` | Score | „אילוץ טון שינה את הדרך שבה לופּ ניסח את אותה אזהרה.” | score/map | 12s |

## 5. Prompt components

Displayed prompt: `כתוב שלט אזהרה על רצפה רטובה, באותיות גדולות, [חסר]`.

### Fault diagnosis

| `componentId` | Label | Role |
|---|---|---|
| `b09_diag_tone` | איך לדבר | correct: tone is missing |
| `b09_diag_goal` | מה להכין | distractor: the goal already says to write a sign |
| `b09_diag_letter_size` | מה גודל האותיות | distractor: large letters are already specified |

### Tone constraints

| `componentId` | Label | Causal outcome |
|---|---|---|
| `b09_tone_joking` | בטון מתבדח | the warning reads like a joke and its instruction is unclear |
| `b09_tone_dramatic` | בטון דרמטי מאוד | oversized dramatic wording distracts from the safe instruction |
| `b09_tone_calm_respectful` | בשפה רגועה ומכבדת | correct accessible sign: „זהירות: רצפה רטובה. עברו במסלול המסומן.” |

### Causal check

- Correct `b09_reason_tone`: „כי הגדרנו איך לנסח את האזהרה”.
- Distractor `b09_reason_size`: „כי הגדלנו שוב את האותיות”.
- Distractor `b09_reason_luck`: „כי הפעם היה לנו מזל”.

## 6. States and outcomes

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b09_wrong_diagnosis` | goal/size marked missing | `b09_tone_gap_remains` | Existing prompt parts receive `כבר קיים`; tone gap remains | „החלק הזה כבר נמצא בפקודה. חפשו איך השלט צריך להישמע.” |
| `b09_joking_tone` | joking tone | `b09_joking_sign` | A playful rhyme replaces the direct route instruction | „הטון קליל, אבל ההנחיה פחות ברורה. זו אזהרה שצריכה להיות רצינית.” |
| `b09_dramatic_tone` | dramatic tone | `b09_dramatic_sign` | Large punctuation and dramatic words dominate the sign | „הדרמה מסתירה את הפעולה החשובה. בחרו טון רגוע ומכבד.” |
| `b09_wrong_reason` | incorrect causal answer | `b09_reason_unresolved` | Correct sign remains; only explanation is retried | „איזה רכיב חדש שינה את הניסוח?” |
| `b09_valid` | correct diagnosis, tone and reason | `full_success` | Calm sign and a clearly marked alternate path appear | „נכון. המטרה נשארה זהה, ואילוץ הטון שינה את הניסוח.” |

Priority: diagnosis → tone → causal check → success. `unsafeStates=[]`.

## 7. Feedback ladder

1. „השלט עדיין לא מתאים. בדקו מה חסר או מה צריך לשנות.”
2. Show the current sign and name the missing property: „חסר אילוץ שאומר באיזה טון לכתוב.”
3. „נסו לתקן את רכיב הטון בעצמכם.”
4. Statically emphasize the tone field and offer exactly two tone cards.
5. „בחרו טון שנשאר ברור, רציני ומכבד.”
6. Preserve completed parts; highlight the correct tone card with icon, border and text.
7. Guided completion inserts the tone constraint and continues to victory.

The available option count never shortens the ladder. No flashing or disabling/removing the only wrong option is used as a hidden solution.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b09_score_diagnosis` | Identify tone as the missing component | `user_independent` | `user_choice_two` | `system_completed` |
| `b09_score_tone` | Add calm, respectful language | `user_independent` | `user_choice_two` | `system_completed` |
| `b09_score_iteration` | Test and improve, or succeed on first dispatch | `user_independent` | `user_choice_two` | `system_completed` |
| `b09_score_cause` | Explain the role of the tone constraint | `user_independent` | `user_choice_two` | `system_completed` |

Selecting an already-correct prompt part does not automatically lower another criterion.

## 9. Copy registry

- `title`: „נימוסים במפעל”
- `comic_setup`: „לופּ כתב אזהרה דרמטית כי הטון נשאר פתוח.”
- `instruction_primary`: „סרקו את הפקודה והוסיפו את אילוץ הטון החסר.”
- `scan_instruction`: „סמנו מה חסר: מטרה, טון או גודל אותיות.”
- `repair_instruction`: „בחרו טון ברור שמתאים לאזהרה במפעל.”
- `calm_sign`: „זהירות: רצפה רטובה. עברו במסלול המסומן.”
- `concept_help`: „אילוץ טון אומר ל־AI איך לנסח: רגוע, רשמי, ידידותי או אחר.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b09_factory_cleaning_zone` | Marked wet-floor area with safe alternate route | static |
| `ui_b09_prompt_scan` | Prompt scan panel | semantic HTML, static outline |
| `ui_b09_joking_sign` | Joking-tone result | semantic UI text |
| `ui_b09_dramatic_sign` | Dramatic-tone result | semantic UI text; no flashing |
| `ui_b09_calm_sign` | Success sign | semantic UI text + route icon |
| `char_loop_b09_sign_operator` | Loop-X presenting signs | static pose for reduced motion |
| `sfx_b09_print` | Print action | visible status text |
| `sfx_b09_success` | Victory | stars + numeric score |

No fall, injury, alarm, flashing scanner or text burned into images.

## 11. Accessibility and system behavior

- Prompt parts are semantic buttons with descriptive accessible names.
- Static outline and text identify the scanned field; color and animation are not required.
- Sign copy has sufficient contrast and remains actual selectable/zoomable text.
- All actions work by keyboard and touch with targets at least 44×44px.
- At 360px, prompt parts and tone cards form one vertical reading sequence.
- Reduced-motion and muted modes retain the complete cause/result relationship.
- Refresh before victory restarts without reward; commit is idempotent.
- No runtime AI, network call or free text.

## 12. Acceptance tests

- `TEST_B09_01_FAST_SUCCESS`: diagnose tone, choose calm/respectful, answer cause → `full_success`.
- `TEST_B09_02_GOAL_EXISTS`: marking goal produces local feedback and retains the scan state.
- `TEST_B09_03_SIZE_EXISTS`: marking size identifies it as already present.
- `TEST_B09_04_JOKING`: joking tone produces unclear playful sign without unsafe action.
- `TEST_B09_05_DRAMATIC`: dramatic tone produces static overdramatic sign; no flash/alarm.
- `TEST_B09_06_LADDER`: all seven steps exist; step 4 offers exactly two choices.
- `TEST_B09_07_SCORE`: four criteria use independent provenance, not attempt count.
- `TEST_B09_08_KEYBOARD_360`: full battle works keyboard-only at 360px.
- `TEST_B09_09_MUTED_RM`: sign difference remains understandable muted/reduced-motion.
- `TEST_B09_10_REFRESH_IDEMPOTENT`: no duplicate reward after refresh or repeated CTA.

## 13. Self-check

The battle now matches the locked missing-tone cause, remains a fault scan, and teaches respectful language without modeling insults or unsafe slapstick.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "לופּ כתב אזהרה דרמטית כי הטון נשאר פתוח."
- objective: "כתבו אזהרה ברורה ומכבדת."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "הוסיפו את אילוץ הטון החסר."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"בטון מתבדח"**: החרוז המשחקי הסתיר את ההנחיה. אילוץ הטון לא מתאים לאזהרת בטיחות.
  - **"בטון דרמטי מאוד"**: הדרמה הסתירה מה צריך לעשות. גם כאן אילוץ הטון לא משרת את המטרה.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"טון רגוע ומכבד שומר את האזהרה קריאה בלי להסתיר את המסר בקישוטים. אילוץ טון אומר ל־AI באיזה סגנון לכתוב — וזה קובע אם התוצאה משרתת את המטרה או מפריעה לה."
