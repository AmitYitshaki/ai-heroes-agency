# battle_21.md — סודות רשת

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_21` and the full schema contract.
- Replaced universal claims such as “names and locations are always secret” with contextual privacy guidance.
- Made clear that only fictional placeholders appear; the child cannot type, upload or transmit personal data.
- Separated identification of full name, home address and useful non-personal context into observable behaviors.
- Kept the privacy shield closed until the local document is safe; no simulated disclosure occurs.
- Replaced attempt-based scoring, flashing/color-only cues and the incomplete test set.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_21` |
| `regionId` | `certainty_tower` |
| `order` | 21 |
| title | סודות רשת |
| villain | ד״ר ודאות |
| `skillCodes` | `["privacy"]` |
| `battleType` | `fault_scan` |
| real-world need | לא לשתף עם כלי AI פתוח מידע אישי שאינו נחוץ או מאושר |
| objective | להסיר שם מלא וכתובת בית, תוך שמירת ההקשר הדרוש למשימה |
| `estimatedSeconds` | 105 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["placeholder_pii_only", "no_free_text", "no_network"]` |

## 3. Story and learning

ד״ר ודאות הכינה בקשה לברכת הוקרה, אך העתיקה אליה שני שדות מזהים שאינם נחוצים למשימה. מגן הפרטיות של לופּ עוצר את הטיוטה לפני שליחה ומבקש לנקות אותה.

Learning objective: before using an open AI tool, remove personal or identifying details that are not necessary and authorized. Privacy depends on context; the lesson does not declare every name or location universally secret.

Primary instruction:

> הסירו פרטים אישיים ושמרו את ההקשר הדרוש.

## 4. Approved task material

Displayed fictional draft:

> הכינו ברכת תודה לצוות החילוץ עבור `[שם מלא]`, שגר/ה ב־`[כתובת בית]`. כתבו שני משפטים בשם הנהלת הסוכנות.

Selectable semantic fields:

| `componentId` | Label | Classification |
|---|---|---|
| `b21_field_full_name` | `[שם מלא]` | identifying; remove |
| `b21_field_home_address` | `[כתובת בית]` | identifying and unnecessary; remove |
| `b21_field_rescue_team` | `צוות החילוץ` | task context; keep |
| `b21_field_two_sentences` | `שני משפטים` | format/constraint; keep |
| `b21_field_agency_management` | `הנהלת הסוכנות` | fictional sender role; keep |

Only labels in square brackets represent fictional personal fields. No actual name, address or other child data is collected.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Activate privacy shield | „הטיוטה כוללת פרטים שאינם נחוצים לברכה.” | `privacy_scan` | 12s |
| `privacy_scan` | Identify fields to remove | „סמנו את הפרטים האישיים שאינם נחוצים.” | `preview` | 28s |
| `preview` | Show sanitized prompt | „בדקו: האם הסרתם רק את המידע המזהה?” | `outcome` | 12s |
| `outcome` | Apply local shield | approved result + `המשך` | feedback or `causal_check` | 12s |
| `feedback` | Name missed/over-removed field | ladder + `חזרה` | `privacy_scan` with correct selections preserved | 10s |
| `causal_check` | Explain privacy decision | „למה הסרנו את השם והכתובת?” | retry or `victory` | 10s |
| `victory` | Score | „המשימה נשארה ברורה בלי מידע מזהה מיותר.” | score/map | 21s |

## 6. Interaction rules

- The child toggles redaction for each labelled field and selects `בדקו טיוטה`.
- Redaction is shown with a static pattern, lock icon and accessible label `הוסר`.
- Correct redactions persist between retries.
- If a necessary task field is redacted, the preview remains local and explains why the request became incomplete.
- The sanitized success preview is:

> הכינו ברכת תודה לצוות החילוץ. כתבו שני משפטים בשם הנהלת הסוכנות.

### Causal check

- Correct `b21_reason_unneeded_identity`: „כי הם מזהים אדם ואינם נחוצים לברכה”.
- Distractor `b21_reason_all_names_forbidden`: „כי אסור להשתמש בשם בכל מצב”.
- Distractor `b21_reason_shorter_always_safe`: „כי טקסט קצר תמיד בטוח”.

## 7. States, precedence and outcomes

Priority: any identifying field left → necessary context removed → causal check → success. `unsafeStates=[]` because real input is structurally impossible.

| `stateId` | Condition | `outcomeKey` | World/UI result | Feedback |
|---|---|---|---|---|
| `b21_name_visible` | full-name placeholder not removed | `b21_privacy_block_name` | shield remains closed; local panel labels `שם מלא עדיין מופיע` | „השם המלא עדיין מזהה אדם ואינו נחוץ למשימה.” |
| `b21_address_visible` | address placeholder not removed | `b21_privacy_block_address` | shield remains closed; local panel labels `כתובת בית עדיין מופיעה` | „כתובת הבית עדיין מופיעה. הסירו גם אותה.” |
| `b21_over_redacted` | task context/format/sender removed | `b21_context_missing` | preview shows an incomplete but unsent request | „הסרתם גם מידע שדרוש למשימה. החזירו אותו.” |
| `b21_wrong_reason` | causal distractor chosen | `b21_reason_unresolved` | sanitized prompt remains; explanation panel stays open | „ההחלטה תלויה בזיהוי ובצורך, לא רק באורך הטקסט.” |
| `b21_valid` | two PII placeholders removed; useful fields retained; reason correct | `full_success` | shield displays icon + `טיוטה נקייה — לא מכילה פרטים מזהים` | „נכון. שמרתם את המשימה והסרתם מידע מזהה מיותר.” |

The battle never shows a successful external send; it demonstrates a safe local preview only.

## 8. Feedback ladder

1. „הטיוטה עדיין אינה מוכנה. בדקו שוב.”
2. Show the local preview and name the unresolved privacy/context issue.
3. „חפשו פרטים שמזהים אדם ואינם נחוצים למשימה.”
4. Statically emphasize the unresolved area and offer exactly two meaningful choices.
5. „השאירו את מטרת הברכה והסירו מידע מזהה מיותר.”
6. Preserve correct redactions; highlight the remaining correct field/action with icon, border and text.
7. Guided completion removes only the identifying placeholders and guarantees victory.

Real unsafe input would bypass this ladder, but this static battle has no free-input surface.

## 9. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b21_score_name` | Remove full-name placeholder | `user_independent` | `user_choice_two` | `system_completed` |
| `b21_score_address` | Remove home-address placeholder | `user_independent` | `user_choice_two` | `system_completed` |
| `b21_score_context` | Retain necessary non-personal task context | `user_independent` | `user_choice_two` | `system_completed` |
| `b21_score_cause` | Explain identification + necessity | `user_independent` | `user_choice_two` | `system_completed` |

## 10. Copy registry

- `title`: „סודות רשת”
- `comic_setup`: „מגן הפרטיות עצר פרטים שאינם נחוצים לברכה.”
- `instruction_primary`: „הסירו פרטים אישיים ושמרו את ההקשר הדרוש.”
- `scan_instruction`: „סמנו את הפרטים האישיים שאינם נחוצים.”
- `preview_instruction`: „בדקו: האם הסרתם רק את המידע המזהה?”
- `causal_instruction`: „למה הסרנו את השם והכתובת?”
- `concept_help`: „לפני שיתוף עם AI, הסירו מידע אישי שאינו נחוץ ומאושר.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b21_privacy_room` | tower privacy station | static |
| `ui_b21_draft_fields` | selectable semantic draft | HTML text, not baked into art |
| `ui_b21_redaction_pattern` | removed-field state | pattern + lock + text |
| `ui_b21_safe_preview` | sanitized result | semantic HTML |
| `char_loop_b21_privacy_shield` | protective local block | static pose |
| `sfx_b21_redact` | field toggle | accessible state announcement |
| `sfx_b21_success` | victory | stars + numeric score |

## 12. Accessibility and system behavior

- Fields are toggle buttons with `aria-pressed`; labels announce `נשמר` or `הוסר`.
- Redaction does not depend on seeing a black bar or a color change.
- The original and sanitized drafts use accessible headings and logical RTL reading order.
- At 360px, the draft wraps naturally without horizontal scrolling.
- Touch targets are at least 44×44px; keyboard, muted and reduced-motion paths are complete.
- No free text, actual PII, runtime AI, analytics event containing fields or network request.
- Refresh resets the draft locally; completion and rewards are idempotent.

## 13. Acceptance tests

- `TEST_B21_01_FAST_SUCCESS`: remove name/address, keep task fields, choose correct reason → success.
- `TEST_B21_02_NAME_LEFT`: shield blocks locally and identifies the full-name placeholder.
- `TEST_B21_03_ADDRESS_LEFT`: shield blocks locally and identifies the address placeholder.
- `TEST_B21_04_OVER_REDACTION`: removing task context produces incomplete local preview.
- `TEST_B21_05_CONTEXTUAL_LANGUAGE`: copy never says every name/location is always secret.
- `TEST_B21_06_NO_REAL_PII`: UI exposes no input, upload, paste or network path.
- `TEST_B21_07_NO_EXTERNAL_SEND`: every partial state stays within local preview.
- `TEST_B21_08_LADDER_SCORE`: complete ladder; four criteria use provenance.
- `TEST_B21_09_KEYBOARD_360_MUTED_RM`: complete with all access variants.
- `TEST_B21_10_REFRESH_IDEMPOTENT`: refresh/double CTA never duplicates rewards.

## 14. Self-check

The battle teaches contextual data minimization with fictional placeholders. It neither solicits child data nor makes universal legal claims about all names, locations or AI services.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "מגן הפרטיות עצר פרטים שאינם נחוצים לברכה."
- objective: "נקו את הטיוטה בלי למחוק הקשר שימושי."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "בחרו את שני הפרטים שיש להסיר."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"צוות החילוץ"**: זהו ההקשר הדרוש לברכה — הוא נשאר, כי הוא לא מזהה אדם ספציפי.
  - **"שני משפטים"**: זהו אילוץ שימושי, לא מידע אישי — הוא נשאר בטיוטה.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"שם מלא וכתובת בית מזהים אדם ואינם נחוצים לברכה לצוות החילוץ, ולכן הם הפרטים שיש להסיר. פרטיות אומרת לבדוק אילו פרטים מזהים אדם אמיתי ולהוציא אותם אם אינם הכרחיים למשימה."
