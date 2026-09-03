# battle_20.md — מי אמר?

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_20` and the complete schema contract.
- Reframed verification precisely: important claims are checked against an independent, relevant source; asking the same system again is not independent evidence.
- Removed claims that AI always confirms itself or that humans are inherently the most reliable source.
- Replaced the stressful missed-flight outcome with a reversible scheduling preview.
- Added separate conflict detection, source selection and corrected-value steps so verification is observable.
- Replaced attempt-based scoring, flashing/color-only cues and the incomplete test set.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_20` |
| `regionId` | `certainty_tower` |
| `order` | 20 |
| title | מי אמר? |
| villain | ד״ר ודאות |
| `skillCodes` | `["verification", "responsibility"]` |
| `battleType` | `responsibility_shield` |
| real-world need | לבדוק מידע חשוב מול מקור נפרד ומתאים לפני שפועלים לפיו |
| objective | לזהות סתירה בשעה, לבחור במדריך כמקור אימות ולעדכן ל־08:00 |
| `estimatedSeconds` | 105 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "on_screen_source", "no_runtime_ai"]` |

## 3. Story and learning

ד״ר ודאות מציגה לוח נוצץ שלפיו התדריך מתחיל ב־10:00. מדריך המשימה המאושר, הנמצא באותו מסך, קובע 08:00. לפני פרסום הלוח מגן האחריות עוצר לתצוגת בדיקה.

Learning objective: confident wording and polished design are not evidence. Asking the same AI whether it is sure can be useful as another draft, but it is not independent verification. Check important claims against an appropriate separate source.

Primary instruction:

> בדקו את השעה מול מקור נפרד לפני האישור.

## 4. Approved source material

| Source | Exact displayed claim | Status |
|---|---|---|
| `b20_ai_schedule` | `תדריך המשימה: 10:00` | candidate AI output |
| `b20_agency_guide` | `מדריך משימה מאושר — תדריך: 08:00` | independent relevant source |

The source title and approval badge are text, not decorative color. No external web search is required or available in this battle.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Present plausible conflict | „הלוח נראה רשמי, אבל מגן האחריות מבקש בדיקה.” | `conflict_scan` | 12s |
| `conflict_scan` | Detect mismatch | „איזה פרט אינו תואם בין המקורות?” | feedback or `verification_choice` | 18s |
| `verification_choice` | Choose evidence path | „איזו פעולה תבדוק את השעה ממקור נפרד?” | `outcome` | 25s |
| `outcome` | Show causal preview | approved result + `המשך` | feedback or `correct_value` | 12s |
| `correct_value` | Apply verified claim | „איזו שעה צריך לפרסם?” | retry or `causal_check` | 12s |
| `feedback` | Explain unresolved behavior | ladder + `חזרה` | unresolved state | 8s |
| `causal_check` | Distinguish reassurance/evidence | „למה ‘האם אתה בטוח?’ אינו אימות נפרד?” | retry or `victory` | 8s |
| `victory` | Score | „בדקתם מידע חשוב מול מקור מתאים ונפרד.” | score/map | 10s |

## 6. Components and choices

### Conflict scan

- Correct `b20_conflict_time`: `שעת התדריך`.
- Distractors: `שם המשימה`, `מספר השלבים`; both are identical or absent from both cards.

### Verification action

| `componentId` | Label | Role | Causal result |
|---|---|---|---|
| `b20_action_approve_look` | „אשרו כי הלוח נראה רשמי” | distractor | preview posts 10:00 and displays `לא תואם למדריך` |
| `b20_action_ask_same_ai` | „שאלו את לופּ אם הוא בטוח” | distractor | Loop-X returns another confidence label; conflict remains unresolved |
| `b20_action_compare_guide` | „השוו למדריך המשימה המאושר” | correct | guide opens beside candidate and proves 08:00 |

### Corrected value

- Correct `b20_time_0800`: `08:00`.
- Distractors `b20_time_1000`: `10:00`; `b20_time_average`: `09:00`.

### Causal check

- Correct: „כי זו תשובה נוספת מאותו מקור, לא ראיה נפרדת”.
- Distractors: „כי אסור לשאול AI שאלות”, „כי תשובה קצרה תמיד שגויה”.

## 7. States, precedence and outcomes

Priority: conflict → verification source → corrected value → explanation → success. `unsafeStates=[]`.

| `stateId` | Condition | `outcomeKey` | World/UI result | Feedback |
|---|---|---|---|---|
| `b20_conflict_missed` | wrong detail chosen | `b20_mismatch_unfound` | both time values receive text underlines | „חפשו פרט שמופיע בשני המקורות אך אינו זהה.” |
| `b20_appearance_only` | approve-look chosen | `b20_unverified_preview` | draft board shows 10:00 with text `טיוטה — לא אומת` | „עיצוב רשמי אינו מוכיח שהשעה נכונה.” |
| `b20_same_source` | ask-same-AI chosen | `b20_not_independent` | second candidate confidence card appears; guide remains unopened | „קיבלתם עוד תשובה מאותו מקור. עדיין חסרה בדיקה נפרדת.” |
| `b20_wrong_time` | 10:00/09:00 chosen | `b20_source_not_applied` | guide value 08:00 remains visible | „המקור המאושר מציג 08:00. השתמשו בערך שבדקתם.” |
| `b20_wrong_reason` | causal distractor chosen | `b20_reason_unresolved` | verified schedule remains; explanation panel stays open | „אפשר לשאול AI שוב, אבל זו אינה ראיה ממקור אחר.” |
| `b20_valid` | all behaviors complete | `full_success` | preview becomes approved board: `תדריך 08:00 — אומת מול מדריך` | „נכון. אימתם את השעה מול מקור נפרד ומתאים.” |

No message is published and no mission departs before verification succeeds.

## 8. Feedback ladder

1. „המידע עדיין לא מאומת. נסו שוב.”
2. Show the current draft result and identify the unresolved verification behavior.
3. „השוו את הטענה למקור שנוצר בנפרד.”
4. Statically emphasize the guide/action area and offer exactly two meaningful choices.
5. „השתמשו בשעה שמופיעה במדריך המאושר.”
6. Preserve verified parts; highlight the remaining correct choice with icon, border and text.
7. Guided completion applies the verified value and guarantees victory.

## 9. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b20_score_conflict` | Detect the time mismatch | `user_independent` | `user_choice_two` | `system_completed` |
| `b20_score_source` | Choose the separate approved guide | `user_independent` | `user_choice_two` | `system_completed` |
| `b20_score_apply` | Apply 08:00 from the source | `user_independent` | `user_choice_two` | `system_completed` |
| `b20_score_cause` | Explain why reassurance is not independent evidence | `user_independent` | `user_choice_two` | `system_completed` |

## 10. Copy registry

- `title`: „מי אמר?”
- `comic_setup`: „הלוח נראה רשמי, אבל השעה לא נבדקה.”
- `instruction_primary`: „בדקו את השעה מול מקור נפרד לפני האישור.”
- `conflict_instruction`: „איזה פרט אינו תואם בין המקורות?”
- `action_instruction`: „איזו פעולה תבדוק את השעה ממקור נפרד?”
- `value_instruction`: „איזו שעה צריך לפרסם?”
- `concept_help`: „אימות הוא השוואה למקור נפרד ומתאים.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b20_schedule_room` | tower schedule room | static |
| `ui_b20_ai_schedule` | candidate 10:00 board | semantic HTML |
| `ui_b20_agency_guide` | approved 08:00 guide | semantic HTML with source label |
| `ui_b20_draft_preview` | reversible wrong-action result | text + icon, no color-only state |
| `char_loop_b20_compare` | Loop-X comparing sources | static pose |
| `sfx_b20_compare` | source check | visible `בודק מול המדריך` label |
| `sfx_b20_success` | victory | stars + numeric score |

## 12. Accessibility and system behavior

- Candidate and source use headings, source labels and explicit times readable by assistive technology.
- The comparison does not depend on sparkle, color or motion.
- At 360px, source cards stack with persistent labels `תוצאת AI` and `מדריך מאושר`.
- Touch targets are at least 44×44px; complete keyboard path is supported.
- Reduced-motion and muted modes preserve all information.
- No runtime AI, free text, external browsing or network request.
- Refresh and double-submit cannot publish or reward twice.

## 13. Acceptance tests

- `TEST_B20_01_FAST_SUCCESS`: time conflict + guide + 08:00 + correct reason → success.
- `TEST_B20_02_LOOK_OFFICIAL`: polished appearance never counts as evidence.
- `TEST_B20_03_ASK_SAME_AI`: returns `b20_not_independent`, not an absolute claim that AI always agrees.
- `TEST_B20_04_AVERAGE_TIME`: 09:00 is rejected because it appears in no source.
- `TEST_B20_05_APPLY_SOURCE`: only 08:00 satisfies the approved on-screen guide.
- `TEST_B20_06_NO_PREMATURE_PUBLISH`: wrong actions remain reversible previews.
- `TEST_B20_07_NO_AI_NETWORK`: complete with zero runtime AI/network calls.
- `TEST_B20_08_LADDER_SCORE`: complete ladder; four criteria use provenance.
- `TEST_B20_09_KEYBOARD_360_MUTED_RM`: complete with all access variants.
- `TEST_B20_10_REFRESH_IDEMPOTENT`: refresh/double CTA never duplicates rewards.

## 14. Self-check

The battle teaches independent verification without claiming that AI cannot self-correct, that humans are automatically reliable or that every low-stakes output requires external research.
