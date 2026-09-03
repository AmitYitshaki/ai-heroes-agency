# battle_19.md — אותו הדבר בדיוק?

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_19` and the complete content-object contract.
- Added a first observation step so the probability concept is measured, not merely narrated.
- Clarified that variation is possible, not guaranteed, and that a different result is not automatically correct.
- Replaced the shortened binary help path with the complete six-attempt ladder plus guided completion.
- Removed attempt-based scoring, color-only cues and threatening access-control consequences.
- Expanded deterministic fixtures; both “AI results” are pre-approved static content and no runtime AI is called.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_19` |
| `regionId` | `certainty_tower` |
| `order` | 19 |
| title | אותו הדבר בדיוק? |
| villain | ד״ר ודאות |
| `skillCodes` | `["probability"]` |
| `battleType` | `robot_test` |
| real-world need | להבין שאותה בקשה עשויה להחזיר תוצאות שונות ולבדוק כל תוצאה מחדש |
| objective | לזהות ששתי תוצאות הגיעו מאותה בקשה ולבחור בזו שעומדת בקריטריון |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "static_simulation", "no_runtime_ai"]` |

## 3. Story and learning

ד״ר ודאות טוענת שאותה בקשה תמיד מחזירה בדיוק אותו דבר. לופּ מציג שתי הצעות מוכנות מראש שנוצרו מאותה בקשה: שני עיצובי מדים שונים. לוח הבדיקה דורש סמל סוכנות ברור.

Learning objective: generative AI may produce different outputs for the same request. Every current output must therefore be evaluated against the user's goal and criteria. Variation alone proves neither correctness nor error.

Primary instruction:

> השוו את התוצאות ובחרו בזו שעומדת בקריטריון.

## 4. Approved source material

- Same displayed request above both results: `עצבו מדי סוכנות חדשים`.
- Result A: silver uniform, no agency emblem.
- Result B: simple blue uniform with a clearly labelled agency emblem.
- Displayed criterion: `המדים חייבים לכלול סמל סוכנות ברור`.

All text, images and labels are static approved assets. The system does not generate either result at runtime.

## 5. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Challenge certainty claim | „לופּ קיבל אותה בקשה פעמיים. התוצאות אינן זהות.” | `variation_check` | 12s |
| `variation_check` | Notice what changed | „מה השתנה בין שתי ההרצות?” | feedback or `criterion_test` | 15s |
| `criterion_test` | Apply visible criterion | „בחרו את המדים שעומדים בקריטריון.” | `dispatch` | 20s |
| `dispatch` | Run static check | „בודק את הבחירה…” | `outcome` | 3s |
| `outcome` | Show causal result | approved result + `המשך` | feedback or `causal_check` | 10s |
| `feedback` | Explain unresolved skill | ladder + `חזרה` | unresolved state | 8s |
| `causal_check` | State implication | „למה צריך לבדוק כל תוצאה?” | retry or `victory` | 10s |
| `victory` | Score | „אותה בקשה עשויה להחזיר תוצאה אחרת.” | score/map | 12s |

## 6. Components and choices

### Variation check

| `componentId` | Label | Role |
|---|---|---|
| `b19_changed_output` | „התוצאה השתנתה” | correct |
| `b19_changed_prompt` | „הבקשה השתנתה” | distractor; displayed request is identical |
| `b19_changed_criterion` | „הקריטריון השתנה” | distractor; criterion stays visible |

### Criterion test

| `componentId` | Label | Role | Causal result |
|---|---|---|---|
| `b19_uniform_silver` | „מדים כסופים ללא סמל” | distractor | test panel reports `חסר סמל סוכנות`; no one is endangered or rejected |
| `b19_uniform_badge` | „מדים עם סמל סוכנות” | correct | test panel confirms the displayed criterion |

### Causal check

- Correct `b19_reason_check_each`: „כי כל תוצאה יכולה להשתנות וצריך לבדוק אותה”.
- Distractor `b19_reason_first_best`: „כי התוצאה הראשונה תמיד טובה יותר”.
- Distractor `b19_reason_any_valid`: „כי כל תוצאה שונה היא נכונה”.

## 7. States, precedence and outcomes

Priority: variation recognition → criterion application → causal check → success. `unsafeStates=[]`.

| `stateId` | Condition | `outcomeKey` | World/UI result | Feedback |
|---|---|---|---|---|
| `b19_wrong_change` | prompt/criterion chosen | `b19_variation_unnoticed` | identical request and criterion receive text callouts | „הבקשה והקריטריון זהים. רק התוצאות שונות.” |
| `b19_missing_badge` | silver uniform chosen | `b19_criterion_missing` | static panel: icon + `חסר סמל סוכנות` | „התוצאה שונה ומרשימה, אבל אינה עומדת בקריטריון.” |
| `b19_wrong_reason` | causal distractor chosen | `b19_reason_unresolved` | correct uniform remains selected; explanation stays open | „שונות אינה מבטיחה איכות. מה צריך לבדוק בכל פעם?” |
| `b19_valid` | all three behaviors complete | `full_success` | result B receives icon + text `עומד בקריטריון` | „נכון. בדקתם את התוצאה הנוכחית במקום להניח שהיא קבועה.” |

## 8. Feedback ladder

1. „יש כאן עוד פרט שצריך לבדוק. נסו שוב.”
2. Show the current comparison or test result and name the missing behavior.
3. „השוו בין הבקשה, התוצאות והקריטריון.”
4. Statically emphasize the unresolved area and offer exactly two meaningful choices.
5. „בחרו את התוצאה שעומדת בכלל שמופיע במסך.”
6. Preserve correct answers; mark the correct remaining choice with icon, border and text.
7. Guided completion applies the remaining choice and guarantees victory.

No option disappears, flashes or becomes correct merely because it is the only one left. Time, hints and attempts do not directly affect score.

## 9. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b19_score_variation` | Identify that the output changed | `user_independent` | `user_choice_two` | `system_completed` |
| `b19_score_criterion` | Select the uniform with the required emblem | `user_independent` | `user_choice_two` | `system_completed` |
| `b19_score_iteration` | Inspect, test and improve or pass on first run | `user_independent` | `user_choice_two` | `system_completed` |
| `b19_score_cause` | Explain why each output needs evaluation | `user_independent` | `user_choice_two` | `system_completed` |

## 10. Copy registry

- `title`: „אותו הדבר בדיוק?”
- `comic_setup`: „אותה בקשה, שתי תוצאות שונות. ד״ר ודאות לא ציפתה לזה.”
- `instruction_primary`: „השוו את התוצאות ובחרו בזו שעומדת בקריטריון.”
- `variation_instruction`: „מה השתנה בין שתי ההרצות?”
- `criterion_text`: „המדים חייבים לכלול סמל סוכנות ברור.”
- `causal_instruction`: „למה צריך לבדוק כל תוצאה?”
- `concept_help`: „AI עשוי להציע תוצאה שונה גם כשהבקשה זהה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b19_uniform_lab` | Tower uniform test station | static |
| `ui_b19_same_prompt` | shared request above both outputs | semantic HTML |
| `ui_b19_uniform_silver` | result A | labelled static image |
| `ui_b19_uniform_badge` | result B | labelled static image |
| `ui_b19_criterion_panel` | criterion and result status | icon + text; no color-only state |
| `char_loop_b19_compare` | Loop-X presenting both outcomes | static pose |
| `sfx_b19_compare` | comparison | visible status text |
| `sfx_b19_success` | victory | stars + numeric score |

## 12. Accessibility and system behavior

- Result cards announce request identity, result label and emblem presence.
- The emblem is named in text; success does not depend on recognizing a tiny picture.
- At 360px, result cards stack; the identical request remains associated with both via heading IDs.
- Touch targets are at least 44×44px; keyboard and screen-reader order follows the flow.
- Reduced-motion and muted modes preserve all causal information.
- No runtime AI, free text or network request.
- Refresh before victory resets only the active battle; reward commit is idempotent.

## 13. Acceptance tests

- `TEST_B19_01_FAST_SUCCESS`: output changed + badge uniform + correct reason → `full_success`.
- `TEST_B19_02_PROMPT_DISTRACTOR`: identical request remains visible and feedback names it.
- `TEST_B19_03_CRITERION_DISTRACTOR`: criterion remains visible and feedback names it.
- `TEST_B19_04_SILVER`: no-badge result produces deterministic `חסר סמל` state.
- `TEST_B19_05_VARIATION_LANGUAGE`: copy says `עשוי`, never guarantees a different result every run.
- `TEST_B19_06_NOT_ANY_OUTPUT`: causal distractor never teaches that every AI output is valid.
- `TEST_B19_07_NO_AI_NETWORK`: whole battle completes with zero runtime AI/network calls.
- `TEST_B19_08_LADDER_SCORE`: full ladder works; four criteria use provenance, not attempt count.
- `TEST_B19_09_KEYBOARD_360_MUTED_RM`: complete with all access variants.
- `TEST_B19_10_REFRESH_IDEMPOTENT`: refresh/double CTA never duplicates rewards.

## 14. Self-check

The battle teaches uncertainty through a controlled simulation. It does not imply that AI is random on every run, that different outputs are equally good or that visual appeal replaces a criterion.
