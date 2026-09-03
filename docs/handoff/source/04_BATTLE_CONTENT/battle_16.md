# battle_16.md — סתירה פנימית

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_16` and all required schema fields.
- Rebuilt malformed screen and asset tables.
- Added a separate contradiction scan before repair, making both learned skills observable.
- Removed the inaccurate lesson that negative wording is inherently confusing; the issue here is that the negative range does not name a target size.
- Replaced random-size/flashing presentation and color-only cues with deterministic static outcomes.
- Replaced constant and attempt-based scoring, completed the help ladder and added ten acceptance tests.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_16` |
| `regionId` | `command_maze` |
| `order` | 16 |
| title | סתירה פנימית |
| villain | תסבוכת |
| `skillCodes` | `["contradiction", "positive_phrasing"]` |
| `battleType` | `fault_repair` |
| real-world need | לזהות דרישות שאינן יכולות להתקיים יחד ולהחליף אותן בכלל עקבי וישיר |
| objective | לאתר את הסתירה בין כתב ענק לכרטיס קטן ולהחליפה בכתב בינוני וברור |
| `estimatedSeconds` | 105 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "no_alarm_or_damage"]` |

## 3. Story and learning

תסבוכת שתל שתי דרישות מתנגשות בפקודת ההדפסה: „הדפיסו בכתב ענק” ו„התאימו את כל הטקסט לכרטיס קטן”. לופּ מנסה לקיים את שתיהן ומפיק כרטיס שבו חלק מהטקסט נחתך.

Learning objective: contradictory requirements should be located and replaced with one achievable rule. Positive phrasing can help by naming the desired result directly; negative phrasing is not always wrong, but it may leave the target unspecified.

Primary instruction:

> מצאו את הדרישות הסותרות והחליפו אותן בכלל אחד.

## 4. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Show contradiction result | „חלק מהטקסט נחתך כי שתי דרישות אינן מתאימות יחד.” | `scan_contradiction` | 12s |
| `scan_contradiction` | Locate conflicting pair | „איזה זוג דרישות יוצר את הסתירה?” | feedback or `repair_rule` | 22s |
| `repair_rule` | Replace pair with one rule | „בחרו כלל אחד שאפשר לבצע בכרטיס הקטן.” | `dispatch` | 22s |
| `dispatch` | Apply repair | „מעדכן את הגדרות ההדפסה…” | `outcome` | 3s |
| `outcome` | Show causal text result | approved result + `המשך` | feedback or `causal_check` | 12s |
| `feedback` | Focus the unresolved issue | ladder + `חזרה` | unresolved state | 8s |
| `causal_check` | Confirm why repair works | „למה ‘כתב בינוני וברור’ פתר את הסתירה?” | retry or `victory` | 10s |
| `victory` | Score | „כלל אחד עקבי הגדיר מה כן להדפיס.” | score/map | 15s |

## 5. Prompt components

Displayed prompt parts:

- `b16_goal_print_note`: „הדפיסו את הוראות התחנה”.
- `b16_requirement_huge_text`: „בכתב ענק”.
- `b16_requirement_small_card`: „התאימו את כל הטקסט לכרטיס קטן”.

### Contradiction scan

| `componentId` | Pair | Role |
|---|---|---|
| `b16_pair_huge_small` | huge text + all text on small card | correct conflict |
| `b16_pair_goal_small` | print instructions + small card | compatible if text sizing is appropriate |
| `b16_pair_goal_huge` | print instructions + huge text | incomplete pair; the small-card requirement creates the conflict |

### Repair rules

| `componentId` | Label | Causal outcome |
|---|---|---|
| `b16_rule_large_not_too_large` | „כתב גדול, אבל לא גדול מדי” | subjective boundary; some lines remain clipped |
| `b16_rule_not_huge_or_tiny` | „אל תשתמשו בכתב ענק או זעיר” | removes extremes but leaves several possible sizes and no target |
| `b16_rule_medium_clear` | „כתב בינוני וברור” | correct direct target; all supplied text fits the card |

### Causal check

- Correct `b16_reason_one_target`: „כי הוא קבע גודל אחד שמתאים לכרטיס”.
- Distractor `b16_reason_no_negative`: „כי אסור להשתמש אף פעם במילה ‘לא’”.
- Distractor `b16_reason_retry`: „כי לופּ ניסה שוב”.

## 6. States, precedence and outcomes

Priority: contradiction scan → replacement rule → causal check → success. `unsafeStates=[]`.

| `stateId` | Condition | `outcomeKey` | World/UI result | Feedback |
|---|---|---|---|---|
| `b16_wrong_pair` | compatible/incomplete pair selected | `b16_conflict_remains` | Huge-text and small-card cards stay linked by a static conflict marker | „הזוג הזה אינו מציג את שתי הדרישות שלא יכולות לעבוד יחד.” |
| `b16_vague_large_rule` | large/not-too-large selected | `b16_text_still_clipped` | Two final words remain outside the card boundary | „‘לא גדול מדי’ אינו מגדיר גודל מסוים.” |
| `b16_open_range_rule` | not-huge-or-tiny selected | `b16_size_not_selected` | Three possible text sizes appear; none is selected by the rule | „הסרתם את הקצוות, אבל עדיין לא אמרתם איזה גודל כן לבחור.” |
| `b16_wrong_reason` | causal answer incorrect | `b16_reason_unresolved` | Correct note stays; explanation panel remains | „האם מילת שלילה אסורה, או שפשוט היה חסר יעד אחד ברור?” |
| `b16_valid` | correct pair, medium-clear rule and reason | `full_success` | All approved instruction text fits inside the card at one readable size | „נכון. החלפתם שתי דרישות סותרות בכלל אחד שאפשר לבצע.” |

## 7. Feedback ladder

1. „הכרטיס עדיין לא קריא. בדקו את הסתירה ואת הכלל החדש.”
2. Show the current clipped/open-range result and name the unresolved issue.
3. „נסו להחליף את שתי הדרישות בכלל אחד.”
4. Statically emphasize the conflicting pair or repair field and offer exactly two choices.
5. „בחרו ניסוח שאומר ישירות איזה גודל כן להשתמש.”
6. Preserve the correct scan; highlight `כתב בינוני וברור` with icon, border and text.
7. Guided completion applies the rule and guarantees victory.

No option flashes or disappears to expose the answer. Time and attempts do not directly affect score.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b16_score_contradiction` | Locate huge-text versus small-card conflict | `user_independent` | `user_choice_two` | `system_completed` |
| `b16_score_positive_rule` | Replace it with medium, clear text | `user_independent` | `user_choice_two` | `system_completed` |
| `b16_score_iteration` | Test and improve, or succeed on first dispatch | `user_independent` | `user_choice_two` | `system_completed` |
| `b16_score_cause` | Explain why one achievable target resolves the conflict | `user_independent` | `user_choice_two` | `system_completed` |

Selecting a negative-but-incomplete rule is feedback evidence, not an automatic penalty based on retry number.

## 9. Copy registry

- `title`: „סתירה פנימית”
- `comic_setup`: „שתי דרישות מתנגשות גרמו לטקסט להיחתך.”
- `instruction_primary`: „מצאו את הדרישות הסותרות והחליפו אותן בכלל אחד.”
- `scan_instruction`: „איזה זוג דרישות יוצר את הסתירה?”
- `repair_instruction`: „בחרו כלל אחד שאפשר לבצע בכרטיס הקטן.”
- `causal_instruction`: „למה ‘כתב בינוני וברור’ פתר את הסתירה?”
- `concept_help`: „סתירה נוצרת כששתי דרישות אינן יכולות להתקיים יחד.”
- `positive_help`: „ניסוח חיובי אומר ישירות מה רוצים לקבל.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b16_print_station` | Maze printing station | static |
| `ui_b16_conflict_prompt` | Three prompt-part cards | semantic HTML |
| `ui_b16_clipped_note` | Initial/vague result | semantic text clipped by visible boundary, full text available to assistive tech |
| `ui_b16_size_options` | Open-range result | three labeled sizes, static |
| `char_loop_b16_note_result` | Loop-X presenting result | static pose |
| `ui_b16_clear_note` | Success | full semantic note at medium size |
| `sfx_b16_print` | Dispatch | visible status label |
| `sfx_b16_success` | Victory | stars + numeric score |

No smoke, fire, alarm, shaking, flashing or color-only conflict state.

## 11. Accessibility and system behavior

- Prompt parts and repair rules are semantic buttons; the contradiction link has text `סותר`.
- Visual clipping demonstrates layout failure, but the complete sentence remains available to screen readers.
- Text size options have labels; the lesson never depends on perceiving a subtle size difference.
- At 360px, prompt cards stack while the conflict relationship remains explicit.
- Touch and keyboard paths are complete; targets are at least 44×44px.
- Reduced-motion and muted modes preserve all outcomes.
- No free text, runtime AI or network request.
- Refresh before victory resets the session; reward commit is idempotent.

## 12. Acceptance tests

- `TEST_B16_01_FAST_SUCCESS`: correct pair, medium-clear rule and reason → `full_success`.
- `TEST_B16_02_PAIR_GOAL_SMALL`: compatible pair is rejected with local scan feedback.
- `TEST_B16_03_PAIR_GOAL_HUGE`: incomplete pair does not hide the small-card requirement.
- `TEST_B16_04_VAGUE_LARGE`: „not too large” produces deterministic clipped text.
- `TEST_B16_05_NEGATIVE_RANGE`: „not huge or tiny” reports an unspecified target without claiming negatives are always wrong.
- `TEST_B16_06_NO_CONFLICT_WITH_B11`: copy remains consistent with the approved counterexample lesson.
- `TEST_B16_07_LADDER`: step 4 has exactly two choices; step 7 guarantees completion.
- `TEST_B16_08_SCORE`: four behaviors use independent provenance; retries alone do not reduce score.
- `TEST_B16_09_KEYBOARD_360_MUTED_RM`: complete with all access variants.
- `TEST_B16_10_REFRESH_IDEMPOTENT`: refresh/double CTA never duplicates rewards.

## 13. Self-check

The battle preserves contradiction plus positive phrasing and explicitly avoids contradicting Battle 11's valid use of counterexamples and negative information.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "שתי דרישות מתנגשות גרמו לטקסט להיחתך."
- objective: "התאימו את הטקסט לכרטיס קטן."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "החליפו את הסתירה בכלל אחד."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"כתב גדול, אבל לא גדול מדי"**: הגודל עדיין סובייקטיבי. הניסוח עדיין לא נותן כלל אחד וברור.
  - **"אל תשתמשו בכתב ענק או זעיר"**: נשאר טווח פתוח ללא יעד. שלילה בלבד לא אומרת מה כן רוצים — הסתירה לא נפתרה.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
""כתב בינוני וברור" הוא כלל אחד וחיובי שאי אפשר לפרש בשני כיוונים סותרים. ניסוח חיובי פותר סתירה כי הוא אומר במפורש מה כן רוצים, במקום להשאיר את ה־AI לבחור בעצמו."
