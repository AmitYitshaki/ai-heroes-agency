# battle_22.md — שומר הסף

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_22` and complete content-object fields.
- Rebuilt the combo so privacy, independent verification and probability awareness are each observable.
- Replaced the simulated phone disclosure with a local protective block; no personal field is ever broadcast.
- Required retention of verified information instead of indiscriminate deletion.
- Added explicit outcome precedence, complete help ladder and four behavior-based scoring criteria.
- Corrected completion routing: Region 4 ends at Workshop Visit 4, then the finale; no bonus follows this region.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_22` |
| `regionId` | `certainty_tower` |
| `order` | 22 |
| title | שומר הסף |
| villain | ד״ר ודאות |
| `skillCodes` | `["verification", "privacy", "probability"]` |
| `battleType` | `combo` |
| real-world need | לבדוק תוצר AI נוכחי, להסיר מידע אישי ולאמת טענות לפני שימוש |
| objective | לנקות דוח, לשמור מידע מאומת ולהסביר מדוע כל גרסה דורשת בדיקה |
| `estimatedSeconds` | 135 |
| reward | `{ stampId: "stamp_region_4_complete", unlockRegionId: "finale", unlockWorkshopVisitId: "workshop_4", unlockPowerIds: [] }` |
| `safetyTags` | `["placeholder_pii_only", "on_screen_source", "no_runtime_ai", "local_safety_block"]` |

## 3. Story and learning

ד״ר ודאות מציגה דוח AI שנראה מוכן. הוא כולל שלב נכון, תוספת שאינה מופיעה בנוהל ומספר טלפון בדיוני. מגן האחריות עוצר את הדוח לפני מסירה ומבקש לבדוק את הגרסה הנוכחית.

Learning objective: AI output is a candidate that may vary. Before using the current version, preserve verified claims, remove unsupported claims, remove unnecessary identifying data and reassess the cleaned result.

Primary instruction:

> נקו, אמתו ובדקו מחדש את הדוח לפני האישור.

## 4. Approved report and source

Candidate report:

> דוח משימה: 1. סריקת אזור. 2. מופע לייזרים. איש קשר: `[מספר טלפון]`.

Approved independent guide:

> נוהל משימה מאושר: 1. סריקת אזור. 2. ניקיון.

| `componentId` | Candidate field | Required action | Evidence |
|---|---|---|---|
| `b22_field_scan` | `סריקת אזור` | keep | appears in approved guide |
| `b22_field_lasers` | `מופע לייזרים` | remove as unsupported | absent from approved guide |
| `b22_field_phone` | `[מספר טלפון]` | remove as unnecessary identifying data | privacy rule; placeholder only |

The correct task is not to reconstruct missing `ניקיון`; it is to approve only claims from the candidate that are supported and safe. No report content is generated at runtime.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Present final certainty trap | „הדוח נראה מוכן, אבל מגן האחריות עצר אותו.” | `privacy_scan` | 15s |
| `privacy_scan` | Remove identifying field | „איזה פרט אישי אינו נחוץ לדוח?” | feedback or `source_compare` | 22s |
| `source_compare` | Verify claims and retain evidence | „השוו לנוהל: מה לשמור ומה להסיר?” | `review_current_version` | 32s |
| `review_current_version` | Apply probability habit | „למה צריך לבדוק גם את הגרסה הזאת?” | `dispatch` | 16s |
| `dispatch` | Local gate | „בודק את הדוח הנקי…” | `outcome` | 3s |
| `outcome` | Show safe causal result | approved result + `המשך` | feedback or `causal_check` | 15s |
| `feedback` | Resolve highest-priority issue | ladder + `חזרה` | unresolved state with correct work retained | 10s |
| `causal_check` | Final reassessment | „האם הדוח נקי, מאומת ומוכן?” | retry or `victory` | 8s |
| `victory` | Score and region completion | „בדקתם את התוצר לפני שימוש.” | Workshop 4 | 14s |

## 6. Choices

### Privacy scan

- Correct `b22_private_phone`: `[מספר טלפון]`.
- Distractors `b22_private_scan`: `סריקת אזור`; `b22_private_lasers`: `מופע לייזרים` — unsupported content is not personal data.

### Source comparison

For each candidate claim the child selects `שמרו` or `הסירו`:

- `סריקת אזור` → keep because it appears in the guide.
- `מופע לייזרים` → remove because it does not appear in the guide.
- Phone field is already locked as removed; correct progress persists.

### Probability check

- Correct `b22_reason_review_each`: „כי תוצר AI עשוי להשתנות, ולכן בודקים את הגרסה הנוכחית”.
- Distractor `b22_reason_ai_always_wrong`: „כי AI תמיד טועה”.
- Distractor `b22_reason_first_check_forever`: „כי בדיקה אחת מספיקה לכל גרסה עתידית”.

### Final reassessment

- Correct `b22_ready_yes`: `כן — נשאר רק מידע מאומת ולא אישי`.
- Distractors identify a remaining unresolved issue and return to its state.

## 7. States, precedence and outcomes

Priority: privacy → unsupported claim → verified-claim retention → probability check → final reassessment → success. `unsafeStates=[]` because the only personal field is a non-editable placeholder.

| `stateId` | Condition | `outcomeKey` | World/UI result | Feedback |
|---|---|---|---|---|
| `b22_phone_visible` | phone placeholder remains | `b22_privacy_block` | shield closes locally; `הדוח לא נשלח` and lock icon appear | „מספר הטלפון עדיין בדוח. המגן עצר אותו לפני מסירה.” |
| `b22_lasers_kept` | unsupported laser claim kept | `b22_unverified_claim` | local preview lists unsupported equipment with `לא נמצא בנוהל` | „‘מופע לייזרים’ אינו מופיע במקור המאושר.” |
| `b22_scan_removed` | verified scan claim removed | `b22_verified_content_lost` | preview reports `חסר שלב מאומת: סריקת אזור` | „אל תמחקו מידע רק מפני שהגיע מתוצר AI. בדקו אם הוא נתמך.” |
| `b22_probability_wrong` | causal distractor chosen | `b22_review_habit_unresolved` | cleaned report stays; probability explanation remains open | „AI אינו תמיד טועה, אבל כל גרסה נוכחית צריכה בדיקה.” |
| `b22_not_reassessed` | final review says unresolved when none exists | `b22_review_pending` | checklist shows three text-labelled passed checks | „עברו על שלושת הסימונים ואשרו את המצב הנוכחי.” |
| `b22_valid` | privacy removed, laser removed, scan retained, reasons/review correct | `full_success` | report is filed with text badges `פרטיות`, `אומת`, `נבדק מחדש` | „נכון. שמרתם עובדה מאומתת והסרתם מידע אישי ולא מאומת.” |

No partial state transmits, announces or exposes the placeholder phone number.

## 8. Feedback ladder

1. „הדוח עדיין אינו מוכן לאישור. נסו שוב.”
2. Show the local preview and name only the highest-priority unresolved issue.
3. „בדקו פרטיות, מקור והגרסה הנוכחית.”
4. Statically emphasize the unresolved field and offer exactly two meaningful actions.
5. „שמרו מידע נתמך; הסירו מידע אישי או לא מאומת.”
6. Preserve correct work; highlight the remaining action with icon, border and text.
7. Guided completion performs only the unresolved action and guarantees victory.

The shield protects immediately. Time, attempts, hints and safety blocks do not directly reduce score.

## 9. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b22_score_privacy` | Remove the unnecessary phone placeholder | `user_independent` | `user_choice_two` | `system_completed` |
| `b22_score_verification` | Remove unsupported lasers and retain verified scan | `user_independent` | `user_choice_two` | `system_completed` |
| `b22_score_probability` | Explain why the current version needs review | `user_independent` | `user_choice_two` | `system_completed` |
| `b22_score_iteration` | Reassess after cleaning or pass on first review | `user_independent` | `user_choice_two` | `system_completed` |

## 10. Copy registry

- `title`: „שומר הסף”
- `comic_setup`: „הדוח נראה מוכן, אבל מגן האחריות עצר אותו.”
- `instruction_primary`: „נקו, אמתו ובדקו מחדש את הדוח לפני האישור.”
- `privacy_instruction`: „איזה פרט אישי אינו נחוץ לדוח?”
- `source_instruction`: „השוו לנוהל: מה לשמור ומה להסיר?”
- `probability_instruction`: „למה צריך לבדוק גם את הגרסה הזאת?”
- `review_instruction`: „האם הדוח נקי, מאומת ומוכן?”
- `concept_help`: „תוצר AI הוא הצעה לבדיקה, לא הוכחה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b22_command_deck` | certainty-tower command deck | static |
| `ui_b22_candidate_report` | selectable candidate content | semantic HTML |
| `ui_b22_approved_guide` | independent evidence | semantic HTML with source label |
| `ui_b22_responsibility_checklist` | three passed/failed checks | icon + text, no color-only state |
| `char_loop_b22_shield` | local privacy block | static pose |
| `char_aleph_b22_report` | region-completion response | static pose |
| `sfx_b22_review` | local check | visible status label |
| `sfx_b22_region_success` | victory | stars + numeric score |

## 12. Accessibility and system behavior

- Report claims are semantic toggle rows; keep/remove states are announced in text.
- The approved guide remains visible or available in a modal without losing selections.
- At 360px, report and guide stack; headings preserve source identity.
- Shield/checklist states use icons and words, never color or movement alone.
- Touch targets are at least 44×44px; keyboard, muted and reduced-motion paths are complete.
- No free text, actual PII, runtime AI, analytics payload with report contents or network request.
- Correct work persists during the active battle but is not saved after exit.
- Region reward and Workshop 4 routing commit once, even after refresh or double CTA.

## 13. Acceptance tests

- `TEST_B22_01_FAST_SUCCESS`: phone removed, lasers removed, scan retained, reasons/review correct → success.
- `TEST_B22_02_PRIVACY_PRECEDENCE`: all unresolved → only local privacy feedback first; no disclosure.
- `TEST_B22_03_UNVERIFIED`: after privacy repair, lasers receive source-based feedback.
- `TEST_B22_04_RETAIN_VERIFIED`: removing scan is rejected; indiscriminate deletion cannot pass.
- `TEST_B22_05_PROBABILITY`: copy says output may vary and never claims AI always errs.
- `TEST_B22_06_PROGRESS_RETENTION`: correct privacy/source choices persist through feedback.
- `TEST_B22_07_NO_AI_NETWORK`: complete with zero runtime AI/network calls.
- `TEST_B22_08_LADDER_SCORE`: full ladder; four criteria use provenance.
- `TEST_B22_09_KEYBOARD_360_MUTED_RM`: complete with all access variants.
- `TEST_B22_10_ROUTE_WORKSHOP`: success routes to Workshop 4, then finale; no bonus.
- `TEST_B22_11_REWARD_IDEMPOTENT`: refresh/double CTA never duplicates stamp or stars.
- `TEST_B22_12_NO_PII_DISCLOSURE`: no state publishes, announces or logs the placeholder phone field.

## 14. Self-check

The combo connects probability to a repeatable review habit, verification to source evidence and privacy to data minimization. It remains a static, child-safe preparation for Battle 23.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "דוח המשימה כולל הצעה לא מאומתת ופרט אישי."
- objective: "נקו ואמתו את הדוח לפני האישור."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "שמרו מידע נתמך והסירו את השאר."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"הסירו גם את סריקת האזור"**: סריקת האזור דווקא נתמכת בנוהל. אימות דורש בדיקה מול המקור, לא הסרה אוטומטית.
  - **"השאירו הכול כי זה כתוב בביטחון"**: ניסוח בטוח אינו הוכחה. עדיין לא בוצע אימות של הטענה.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"שמירת סריקת האזור (נתמכת בנוהל), הסרת הצעת הלייזרים (לא מאומתת) והסרת מספר הטלפון (פרטי) — משקפות שתוצר AI הוא הצעה לבדיקה, לא אמת מוחלטת. קודם בודקים פרטיות, ואחר כך מאמתים כל טענה מול מקור נפרד."
