# battle_18.md — יציאה מהמבוך

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_18`, canonical villain naming and the complete content-object contract.
- Replaced the ambiguous red/blue-ink pair with a genuine logical conflict: check the approval seal versus ignore it.
- Removed the inaccurate claim that negative wording is inherently wrong; the approved repair states one executable evidence rule.
- Rebuilt the combo as structure → contradiction → test → one-component iteration → causal check.
- Added deterministic multi-error precedence, persistent correct work and the full help ladder without disappearing options.
- Replaced constant/attempt-based scoring, color-only locks, unsafe paper/dye imagery and the four-test shortcut.
- Locked the post-region route to Workshop 3 → optional Bonus 3 → map → Battle 19.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_18` |
| `regionId` | `command_maze` |
| `order` | 18 |
| title | יציאה מהמבוך |
| villain | תסבוכת |
| `skillCodes` | `["structure", "contradiction", "controlled_iteration"]` |
| `battleType` | `combo` |
| real-world need | לסדר בקשה מורכבת, לפתור סתירה ולבדוק תיקון ממוקד בלי לפרק חלקים שעבדו |
| objective | לסדר את טיפול הקובץ, להחליף הוראות סותרות בכלל אחד ולשנות רק את מגש היעד |
| `estimatedSeconds` | 135 |
| reward | `{ stampId: "stamp_region_3_complete", unlockRegionId: "certainty_tower", unlockWorkshopVisitId: "workshop_3", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "static_results", "no_runtime_ai", "no_network"]` |

## 3. Story and learning

תסבוכת פיזר את הוראות תחנת הארכיון והוסיף שתי דרישות שלא יכולות לפעול יחד. לופּ צריך לטפל בקובץ דמה: לפתוח אותו, להסתמך על חותמת האישור ולמקם אותו במגש. לאחר שהמבנה והסתירה יתוקנו, בדיקת העולם תגלה שהיעד הנוכחי הוא מגש המתנה; הילד ישמור את מה שעבד וישנה רק את היעד למגש אישור.

Learning objective: combine previously learned structure, contradiction repair and controlled iteration. No new concept is introduced.

Primary instruction:

> סדרו, פתרו את הסתירה ובדקו שינוי ממוקד.

## 4. Approved task material

Displayed mission criterion:

> קובץ עם חותמת „מאושר” צריך להגיע למגש האישור.

Initial scattered cards:

| `componentId` | Text | Function |
|---|---|---|
| `b18_step_open` | „פתחו את קובץ הדמה” | must be first |
| `b18_step_check_seal` | „בדקו את חותמת האישור” | must follow open |
| `b18_step_move_waiting` | „העבירו למגש המתנה” | current destination; must follow check |
| `b18_rule_ignore_seal` | „התעלמו מחותמת האישור” | genuine conflict with checking/using the seal |

Approved contradiction repair:

> הסתמכו על חותמת האישור.

The task uses a fictional sample file and static states only. No real document or personal information appears.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Typical budget |
|---|---|---|---|---:|
| `intro` | Present archive jam | „ההוראות מפוזרות וסותרות, ולכן הקובץ מגיע למגש שגוי.” | `structure_build` | 10s |
| `structure_build` | Order three actions | „סדרו את הפעולות לפי מה שלופּ צריך לבצע.” | feedback or `contradiction_repair` | 25s |
| `contradiction_repair` | Replace conflict | „בחרו כלל אחד שאפשר לבצע עם החותמת.” | feedback or `first_dispatch` | 20s |
| `first_dispatch` | Run built prompt | „בודק את הקובץ…” | `first_outcome` | 3s |
| `first_outcome` | Reveal destination mismatch | file reaches waiting tray + `המשך` | `controlled_iteration` | 10s |
| `controlled_iteration` | Change one remaining component | „שמרו את מה שעבד ושנו רק את מגש היעד.” | feedback or `second_dispatch` | 20s |
| `second_dispatch` | Run revised prompt | „בודק את השינוי…” | `second_outcome` | 3s |
| `second_outcome` | Show causal success/partial | approved state + `המשך` | feedback or `causal_check` | 12s |
| `causal_check` | Confirm combined reasoning | „למה אפשר לדעת שהיעד גרם לשיפור?” | retry or `victory` | 10s |
| `victory` | Score and region completion | „יצאתם מהמבוך בעזרת תיקון מסודר.” | Workshop 3 | 22s |

Feedback is an overlay inside the affected task budget. The typical successful path totals 135 seconds.

## 6. Prompt components and choices

### Structure build

Correct sequence:

1. `b18_step_open`
2. `b18_step_check_seal`
3. `b18_step_move_waiting`

Meaningful incorrect sequences:

- Check before open: the seal cannot be read from the closed sample file.
- Move before check: the file reaches a tray before its approval state is read.
- Open → move → check: checking occurs too late to guide routing.

### Contradiction repair

| `componentId` | Label | Role | Causal meaning |
|---|---|---|---|
| `b18_rule_keep_both` | „בדקו את החותמת וגם התעלמו ממנה” | unresolved contradiction | two incompatible rules remain |
| `b18_rule_do_not_ignore` | „אל תתעלמו מהחותמת” | incomplete range | removes one action but does not say what evidence to use |
| `b18_rule_use_seal` | „הסתמכו על חותמת האישור” | correct direct rule | names the evidence that guides the next action |

Negative wording is not automatically wrong. `b18_rule_do_not_ignore` is incomplete because it does not state the executable evidence rule.

### Controlled iteration

Current tested version preserves the correct order and seal rule but sends the file to `מגש המתנה`.

| `componentId` | Change card | Role | Causal result |
|---|---|---|---|
| `b18_change_destination_only` | `מגש המתנה` → `מגש אישור` | correct single change | approved file reaches the criterion target |
| `b18_change_order_only` | move before check | distractor | breaks a structure that already worked |
| `b18_change_destination_and_rule` | change destination and replace seal rule | multi-change distractor | result changes, but the cause is no longer isolated |

### Causal check

- Correct `b18_reason_destination_only`: „כי הסדר והכלל נשמרו ורק היעד השתנה”.
- Distractor `b18_reason_any_latest`: „כי הגרסה האחרונה תמיד נכונה”.
- Distractor `b18_reason_more_changes`: „כי שינינו כמה שיותר חלקים”.

## 7. Valid, partial and unsafe states

- `validStates=[b18_valid]`.
- `partialStates=[b18_bad_order,b18_conflict_remains,b18_rule_incomplete,b18_wrong_iteration,b18_multi_iteration,b18_wrong_reason]`.
- `unsafeStates=[]`.
- Correct order, repaired rule and final destination each retain their provenance during the active battle.

## 8. Deterministic precedence and outcomes

Priority: structure → contradiction → controlled iteration → causal check → success.

| `stateId` | Condition | `outcomeKey` | World/UI result | Feedback |
|---|---|---|---|---|
| `b18_bad_order` | any wrong sequence | `b18_sequence_failed` | static step panel identifies the first operation attempted too early | „הסדר אינו מאפשר לבדוק לפני ההעברה. סדרו מחדש.” |
| `b18_conflict_remains` | keep-both rule chosen | `b18_seal_conflict` | Loop-X pauses on a neutral holding pad with both rules displayed | „אי אפשר לבדוק את החותמת וגם להתעלם ממנה.” |
| `b18_rule_incomplete` | do-not-ignore chosen | `b18_evidence_unspecified` | three possible evidence labels remain unselected | „אמרתם מה לא לעשות, אבל לא על מה להסתמך.” |
| `b18_waiting_result` | order/rule correct before iteration | `b18_wrong_tray_observed` | approved sample file reaches waiting tray; criterion remains visible | „המבנה והכלל עבדו. רק מגש היעד עדיין אינו מתאים.” |
| `b18_wrong_iteration` | order changed | `b18_working_structure_changed` | seal check occurs after routing in a static preview | „שיניתם חלק שכבר עבד. חזרו לסדר ושנו רק את היעד.” |
| `b18_multi_iteration` | destination and rule changed | `b18_test_not_isolated` | preview marks two changed components | „שני רכיבים השתנו יחד, ולכן התיקון אינו מבוקר.” |
| `b18_wrong_reason` | causal distractor chosen | `b18_cause_unresolved` | successful file remains; explanation stays open | „השיפור ניתן לבידוד כי רק מגש היעד השתנה.” |
| `b18_valid` | correct sequence, rule, destination-only change and reason | `full_success` | approved sample file reaches approval tray with text-labelled passed checks | „נכון. שמרתם את החלקים שעבדו ושיניתם רק את היעד.” |

## 9. Feedback ladder

The same complete ladder applies independently to the highest-priority unresolved component:

1. „הפקודה עדיין אינה פועלת לפי הקריטריון. נסו שוב.”
2. Show the current static result and name only the unresolved structure/rule/iteration issue.
3. „בדקו את החלק המסומן ונסו תיקון נוסף.”
4. Statically emphasize the relevant area and offer exactly two meaningful choices.
5. „שמרו את החלקים הנכונים ותקנו רק את הבעיה שנותרה.”
6. Preserve correct work; mark the remaining correct action with icon, border and text.
7. Guided completion performs the unresolved action and guarantees victory.

No option disappears, fades or flashes. Correct parts carry a text label `נכון — נשמר`, not a color-only lock. Time, attempts and hints do not directly affect score.

## 10. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b18_score_structure` | Put open → check → move in order | `user_independent` | `user_choice_two` | `system_completed` |
| `b18_score_contradiction` | Replace conflict with one executable seal rule | `user_independent` | `user_choice_two` | `system_completed` |
| `b18_score_iteration` | Preserve correct parts and change only destination | `user_independent` | `user_choice_two` | `system_completed` |
| `b18_score_cause` | Explain why the destination caused the improvement | `user_independent` | `user_choice_two` | `system_completed` |

## 11. Copy registry

- `title`: „יציאה מהמבוך”
- `comic_setup`: „ההוראות מפוזרות וסותרות, ולכן הקובץ מגיע למגש שגוי.”
- `instruction_primary`: „סדרו, פתרו את הסתירה ובדקו שינוי ממוקד.”
- `structure_instruction`: „סדרו את הפעולות לפי מה שלופּ צריך לבצע.”
- `contradiction_instruction`: „בחרו כלל אחד שאפשר לבצע עם החותמת.”
- `iteration_instruction`: „שמרו את מה שעבד ושנו רק את מגש היעד.”
- `causal_instruction`: „למה אפשר לדעת שהיעד גרם לשיפור?”
- `concept_help`: „מבנה, כלל עקבי ושינוי ממוקד מאפשרים תיקון ברור.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”
- `region_success`: „יצאתם מהמבוך. מגדל הוודאות נפתח במפה.”

## 12. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b18_archive_station` | archive exit station | static |
| `ui_b18_order_cards` | semantic reorder controls | move-up/down buttons and numbered slots |
| `ui_b18_seal_rules` | contradiction repair choices | semantic text cards |
| `ui_b18_waiting_tray` | first result | labelled static tray |
| `ui_b18_approval_tray` | success result | labelled static tray |
| `ui_b18_saved_component` | retained-correct state | icon + border + `נכון — נשמר` |
| `char_loop_b18_file_test` | Loop-X running sample | static pose |
| `char_tangle_b18_region_exit` | Tangle's comic exit | static reaction, no threat |
| `sfx_b18_file_check` | dispatch | visible status text |
| `sfx_b18_region_success` | victory | stars + numeric score |

## 13. Accessibility and system behavior

- Reordering supports drag, keyboard move-up/down controls and numbered positions.
- Prompt cards, seal rule and tray names remain HTML text; no Hebrew text is baked into art.
- Correct, partial and saved states use icon + text and never color alone.
- At 360px, cards stack in one column without horizontal scrolling.
- Touch targets are at least 44×44px; focus returns to the unresolved component after feedback.
- Reduced-motion uses static before/after frames; muted mode preserves all information.
- No free text, actual file, PII, runtime AI, upload, analytics payload with task content or network request.
- Reward commit, Workshop 3 presentation and Bonus 3 award are independently idempotent.

### Post-region route

1. Commit Battle 18 score and region stamp once.
2. Open `workshop_3`; allow skip or one purchase/equip flow.
3. Offer `bonus_3` once because its `afterRegionId` matches `command_maze`.
4. Allow bonus skip without changing campaign progress.
5. Return to the map with `certainty_tower` and Battle 19 open.

`BattleReward` does not contain `unlockBonusId`.

## 14. Acceptance tests

- `TEST_B18_01_FAST_SUCCESS`: correct order + seal rule + destination-only change + reason → success.
- `TEST_B18_02_ORDER_PRECEDENCE`: order and rule wrong → only order feedback first.
- `TEST_B18_03_CHECK_BEFORE_OPEN`: deterministic unreadable-seal state, without damage.
- `TEST_B18_04_MOVE_BEFORE_CHECK`: routing-before-evidence is rejected.
- `TEST_B18_05_TRUE_CONTRADICTION`: check/ignore pair cannot pass together.
- `TEST_B18_06_INCOMPLETE_NEGATIVE`: `אל תתעלמו` is rejected as unspecified, not because negative language is forbidden.
- `TEST_B18_07_WAITING_OBSERVATION`: correct round one deterministically reaches waiting tray and preserves its correct work.
- `TEST_B18_08_ITERATION_WRONG_PART`: changing order restores prior correct order and focuses destination.
- `TEST_B18_09_MULTI_ITERATION`: two simultaneous edits cannot count as controlled iteration.
- `TEST_B18_10_LADDER_SCORE`: full ladder per precedence; four criteria use independent provenance.
- `TEST_B18_11_KEYBOARD_360_MUTED_RM_NO_NETWORK`: complete in every access mode with zero network calls.
- `TEST_B18_12_ROUTE_IDEMPOTENT`: double CTA/refresh commits once and routes Workshop 3 → optional Bonus 3 → map → Battle 19.

## 15. Self-check

The combo reuses prior skills without introducing a new concept. Its contradiction is logically genuine, its negative-language explanation remains consistent with Battle 16, and the second run changes one observable cause while preserving prior work.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "ההוראות מפוזרות וסותרות, והקובץ מגיע למגש שגוי."
- objective: "סדרו את מסלול הקובץ למגש האישור."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "בחרו סדר, כלל ושינוי ממוקד."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"העבירו → בדקו → פתחו"**: הקובץ הועבר לפני שנבדק. סדר הפעולות (המבנה) שגוי — תלות לא מכובדת.
  - **"בדקו וגם התעלמו מהחותמת"**: ההוראות עדיין סותרות — יש עדיין שתי הנחיות שלא יכולות להתקיים יחד.
  - **"שנו שוב את כל השלבים"**: שינוי כפול מסתיר מה השפיע. זה לא שינוי ממוקד — קשה לדעת מה תיקן את הבעיה.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"סדר נכון, כלל אחד ועקבי ושינוי ממוקד ליעד בלבד — שלושתם יחד מוציאים את הקובץ מהמבוך בלי לבלבל את לופּ. מבנה, פתרון סתירה ואיטרציה ממוקדת מאפשרים להסביר בדיוק למה התיקון עבד."
