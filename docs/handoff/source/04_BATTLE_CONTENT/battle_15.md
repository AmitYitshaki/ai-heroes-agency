# battle_15.md — הפרדת כוחות

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_15`, structured reward and safety fields.
- Rebuilt malformed screen/asset tables and removed flashing/color-only cues.
- Replaced triple-quote-only syntax with a readable Hebrew start/end delimiter pair suitable for ages 11–14 and RTL.
- Removed the false implication that politeness itself causes AI to summarize the instruction.
- Separated boundary detection, delimiter choice, iteration and conceptual distinction into four provenance criteria.
- Added exact source text, deterministic output, full help ladder and complete acceptance coverage.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_15` |
| `regionId` | `command_maze` |
| `order` | 15 |
| title | הפרדת כוחות |
| villain | תסבוכת |
| `skillCodes` | `["instruction_data_separation"]` |
| `battleType` | `fault_scan` |
| real-world need | להפריד בבירור בין הוראה לבין טקסט שה־AI צריך לעבד |
| objective | לזהות את גבול היומן ולתחום את חומר הגלם בסימני התחלה וסיום |
| `estimatedSeconds` | 105 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "approved_source_text", "no_runtime_ai", "no_personal_data"]` |

## 3. Story and learning

תסבוכת מחק את הגבול בין פקודת הסיכום לבין יומן המסע. לופּ קיבל בלוק אחד רציף ובחר את קטע הטקסט הלא נכון, ולכן הפלט מתאר את משימת הסיכום במקום לסכם את היומן.

Learning objective: explicit delimiters mark where source data begins and ends. They help separate the instruction from the material being processed; they are not a request to reveal hidden reasoning.

Primary instruction:

> מצאו היכן מתחיל היומן ותחמו אותו בנפרד.

## 4. Approved source material

Instruction:

> סכמו את יומן המסע במשפט אחד לצוות הסוכנות.

Diary data:

> היום סרקנו את שביל הערפל ומצאנו תיבת אספקה ליד התחנה הישנה.

Approved success output:

> הצוות מצא תיבת אספקה ליד התחנה הישנה.

The source is fictional, contains no personal data and is rendered as semantic text.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Show mixed block | „ההוראה והיומן התחברו לבלוק אחד, ולופּ סיכם את הקטע הלא נכון.” | `fault_scan` | 12s |
| `fault_scan` | Locate instruction/data boundary | „סמנו את המקום שבו מתחיל יומן המסע.” | feedback or `repair_action` | 22s |
| `repair_action` | Choose delimiter method | „בחרו סימון שמקיף את היומן מתחילתו ועד סופו.” | `dispatch` | 20s |
| `dispatch` | Apply delimiter | „לופּ קורא שוב את החלקים…” | `outcome` | 3s |
| `outcome` | Show selected data block and summary | approved result + `המשך` | feedback or `causal_check` | 12s |
| `feedback` | Repair current issue | ladder + `חזרה` | unresolved state | 8s |
| `causal_check` | Confirm distinction | „איזה חלק לופּ צריך לסכם?” | retry or `victory` | 10s |
| `victory` | Score | „ההוראה אמרה מה לעשות; המפרידים סימנו על איזה מידע.” | score/map | 15s |

## 6. Prompt components

### Boundary scan

The interface divides the mixed block into three semantic segments:

1. `b15_segment_instruction`: „סכמו את יומן המסע במשפט אחד לצוות הסוכנות.”
2. `b15_boundary_instruction_data`: the boundary immediately before „היום סרקנו…” — correct.
3. `b15_segment_middle_data`: boundary inside the diary after „שביל הערפל” — distractor.

Selecting ordinary instruction words as the start leaves part of the instruction inside the data block. Selecting the middle loses the first half of the diary.

### Delimiter cards

| `componentId` | Label | Result |
|---|---|---|
| `b15_delimiter_polite_word` | הוסיפו „בבקשה” לפני היומן | respectful wording, but no visible data boundary |
| `b15_delimiter_start_only` | הוסיפו „תחילת היומן” בלבד | start is marked, but the end remains open |
| `b15_delimiter_start_end` | הוסיפו „תחילת היומן” ו„סוף היומן” | correct closed data block |

Final approved prompt layout:

```text
סכמו את יומן המסע במשפט אחד לצוות הסוכנות.
--- תחילת היומן ---
היום סרקנו את שביל הערפל ומצאנו תיבת אספקה ליד התחנה הישנה.
--- סוף היומן ---
```

### Causal check

- Correct `b15_reason_data`: „את הטקסט שבין תחילת היומן לסופו”.
- Distractor `b15_reason_instruction`: „את משפט ההוראה בלבד”.
- Distractor `b15_reason_everything`: „את כל הטקסט כולל הסימונים”.

## 7. States, precedence and outcomes

Priority: boundary location → delimiter completeness → causal check → success. `unsafeStates=[]`.

| `stateId` | Condition | `outcomeKey` | World/UI result | Feedback |
|---|---|---|---|---|
| `b15_wrong_boundary_instruction` | boundary placed inside instruction | `b15_instruction_inside_data` | data highlight includes instruction words | „הסימון התחיל מוקדם מדי והכניס חלק מההוראה לחומר.” |
| `b15_wrong_boundary_middle` | boundary placed inside diary | `b15_diary_start_missing` | first diary phrase stays outside highlight | „הסימון התחיל באמצע, ולכן חלק מהיומן חסר.” |
| `b15_polite_no_delimiter` | polite-word card | `b15_boundary_still_missing` | continuous block remains; selected input region is ambiguous | „‘בבקשה’ משנה את הניסוח, אבל אינה מסמנת היכן הנתונים.” |
| `b15_open_ended_delimiter` | start-only card | `b15_end_still_open` | start label appears; end of data remains unmarked | „סימנתם התחלה. הוסיפו גם סוף כדי לסגור את קטע הנתונים.” |
| `b15_wrong_reason` | causal answer incorrect | `b15_reason_unresolved` | Correct summary stays; data block remains outlined | „ההוראה אומרת מה לעשות. איזה חלק הוא חומר הגלם?” |
| `b15_valid` | boundary, start/end delimiters and reason correct | `full_success` | Diary block is outlined and approved one-sentence summary prints | „נכון. לופּ סיכם רק את המידע שסומן כיומן.” |

## 8. Feedback ladder

1. „לופּ עדיין מערבב בין ההוראה ליומן. בדקו את הסימון.”
2. Show which instruction/data segment was wrongly included or omitted.
3. „נסו לסמן מחדש את גבולות חומר הגלם.”
4. Statically outline the relevant boundary and offer exactly two delimiter choices.
5. „בחרו סימון שמגדיר גם התחלה וגם סוף.”
6. Preserve the correct boundary; highlight the complete delimiter pair with icon, border and text.
7. Guided completion applies the remaining delimiter and guarantees victory.

No cursor, card or delimiter flashes. Opening the concept explanation does not change score.

## 9. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b15_score_boundary` | Locate where diary data begins | `user_independent` | `user_choice_two` | `system_completed` |
| `b15_score_delimiter` | Enclose data with start and end markers | `user_independent` | `user_choice_two` | `system_completed` |
| `b15_score_iteration` | Test and improve, or succeed on first dispatch | `user_independent` | `user_choice_two` | `system_completed` |
| `b15_score_distinction` | Identify the data that should be summarized | `user_independent` | `user_choice_two` | `system_completed` |

The score does not change merely because the child first selected a plausible wrong boundary or opened help.

## 10. Copy registry

- `title`: „הפרדת כוחות”
- `comic_setup`: „תסבוכת חיבר את ההוראה והיומן לבלוק אחד.”
- `instruction_primary`: „מצאו היכן מתחיל היומן ותחמו אותו בנפרד.”
- `scan_instruction`: „סמנו את המקום שבו מתחיל יומן המסע.”
- `repair_instruction`: „בחרו סימון שמקיף את היומן מתחילתו ועד סופו.”
- `delimiter_start`: „תחילת היומן”
- `delimiter_end`: „סוף היומן”
- `causal_instruction`: „איזה חלק לופּ צריך לסכם?”
- `concept_help`: „הוראה אומרת מה לעשות. נתונים הם החומר שעליו מבצעים את הפעולה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b15_data_archive` | Agency archive terminal | static |
| `ui_b15_mixed_text_block` | Fault-scan content | semantic HTML segments |
| `ui_b15_delimited_diary` | Correct start/end block | static outline + labels |
| `char_loop_b15_wrong_excerpt` | Wrong-boundary result | static document panel |
| `char_loop_b15_open_delimiter` | Start-only result | static open bracket diagram |
| `char_loop_b15_good_summary` | Success | semantic approved summary |
| `sfx_b15_scan` | Scan action | visible focus/selection label |
| `sfx_b15_print` | Summary print | visible status text |
| `sfx_b15_success` | Victory | stars + numeric score |

Hebrew source/output text remains HTML and is never burned into an image.

## 12. Accessibility and system behavior

- Instruction, boundary and diary segments are keyboard-focusable semantic controls with full spoken labels.
- Visual outlines are paired with labels `הוראה` and `נתונים`; color is supplementary.
- Mixed Hebrew/code-style delimiter rendering preserves RTL reading and isolates punctuation correctly.
- At 360px, the source can expand vertically without horizontal scrolling.
- Click/keyboard fully replace precision pointing or drag.
- Reduced-motion and muted modes preserve all selection and output information.
- No Chain-of-Thought request, upload, personal data, free text, runtime AI or network call.
- Refresh before victory resets the session; score/reward commit is idempotent.

## 13. Acceptance tests

- `TEST_B15_01_FAST_SUCCESS`: correct boundary, start/end pair and data answer → `full_success`.
- `TEST_B15_02_EARLY_BOUNDARY`: boundary inside instruction includes instruction text and gives causal feedback.
- `TEST_B15_03_MIDDLE_BOUNDARY`: boundary inside diary omits its first phrase.
- `TEST_B15_04_POLITE_WORD`: „please” does not create a delimiter and does not imply politeness is harmful.
- `TEST_B15_05_START_ONLY`: start-only marker reports missing end marker.
- `TEST_B15_06_APPROVED_SUMMARY`: success output exactly matches the approved local summary.
- `TEST_B15_07_LADDER`: step 4 offers exactly two choices; step 7 guarantees completion.
- `TEST_B15_08_SCORE`: four behaviors use independent provenance; attempts alone do not lower score.
- `TEST_B15_09_KEYBOARD_360_RTL`: source selection and delimiter choice work keyboard-only at 360px RTL.
- `TEST_B15_10_MUTED_RM_REFRESH`: full path works muted/RM; refresh/double commit grants no duplicate reward.

## 14. Self-check

The battle preserves the locked instruction/data separation skill, uses an age-appropriate delimiter and explicitly excludes hidden-reasoning instruction.
