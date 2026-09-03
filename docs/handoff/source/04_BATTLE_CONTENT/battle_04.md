# battle_04.md — לא בערך, בדיוק

**Version:** 1.0  
**Date:** 01.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored `battleId=battle_04`.
- Removed loud audio and airborne-box outcomes.
- Replaced weak/silly distractors with plausible but insufficient goals.
- Added explicit identification of the vague phrase and a causal check.
- Rebuilt scoring as four distinct provenance-based criteria.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_04` |
| `regionId` | `fog_district` |
| `order` | 4 |
| title | לא בערך, בדיוק |
| villain | מר בערך |
| `skillCodes` | `["goal"]` |
| `battleType` | `fault_repair` |
| real-world need | להפוך בקשה עמומה למשימה ביצועית וממוקדת |
| objective | להחליף „תעשה משהו כיף” ב„ארגן משחק היכרות של חמש דקות” |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "safe_comic_outcomes"]` |

## 3. Story and learning

במפגש הגיוס מופיעה ההוראה:

> תעשה משהו כיף עם הסוכנים החדשים במפגש.

לופּ מחלק כובעים צבעוניים ומחכה. הוא ביצע פעולה שיכולה להיחשב „כיפית”, אבל לא נוצרה פעילות היכרות.

Learning objective: a clear goal names the action and intended result.

Primary instruction:

> מצאו את החלק העמום והחליפו אותו במשימה ברורה.

## 4. Flow and timing

| State | Purpose | Instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Show vague-goal result | „לופּ חילק כובעים, אבל המפגש עדיין לא התחיל.” | `locate_fault` | 10s |
| `locate_fault` | Identify vague phrase | „איזה חלק אינו אומר ללופּ מה לבצע?” | retry or `repair` | 15s |
| `repair` | Choose a concrete replacement | „החליפו את המטרה העמומה.” | `dispatch` | 20s |
| `dispatch` | Execute repaired goal | „מפעיל את המשימה…” | `outcome` | 3s |
| `outcome` | Show causal result | approved result + `המשך` | feedback or `causal_check` | 8s |
| `feedback` | One correction | ladder text + `חזרה לתיקון` | unresolved step | 8s |
| `causal_check` | Confirm principle | „מה הפך את המטרה לברורה?” | retry or victory | 10s |
| `victory` | Score/map | „מטרה ברורה אומרת מה לבצע ומה צריך לקרות.” | score/map | 10s |

## 5. Prompt components

### Fault location

Selectable phrase blocks:

- `b04_phrase_vague_goal`: „תעשה משהו כיף” — correct fault.
- `b04_phrase_audience`: „עם הסוכנים החדשים” — relevant context.
- `b04_phrase_setting`: „במפגש” — relevant setting.

### Replacement goals

| ID | Label | Why plausible | Outcome |
|---|---|---|---|
| `b04_goal_music` | הפעל מוזיקת רקע | Clear action associated with an event, but does not create introductions | Music starts softly; agents still wait |
| `b04_goal_surprise` | הכן הפתעה לקבוצה | Sounds purposeful but still does not define the intended activity | Loop-X places wrapped boxes on a table |
| `b04_goal_intro_game` | ארגן משחק היכרות של חמש דקות | Defines action, purpose and bounded duration | Loop-X displays a short pair-introduction game |

### Causal check

- Correct: `b04_reason_action_result` — „היא הגדירה פעולה ותוצאה”.
- Distractor: `b04_reason_more_words` — „היא השתמשה ביותר מילים”.
- Distractor: `b04_reason_fun_word` — „היא כללה את המילה כיף”.

## 6. States and outcomes

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b04_wrong_phrase` | audience/setting marked as fault | `b04_vague_goal_remains` | Vague goal remains outlined | „הקהל והמקום עוזרים. חפשו את החלק שלא מגדיר פעולה.” |
| `b04_music` | music goal | `b04_music_only` | Soft music begins; no interaction starts | „המוזיקה פועלת, אבל עדיין אין פעילות היכרות.” |
| `b04_surprise` | surprise goal | `b04_surprise_boxes` | Boxes are placed neatly; agents still wait | „הוכנה הפתעה, אבל לא הוגדרה פעילות לסוכנים.” |
| `b04_wrong_reason` | causal answer incorrect | `b04_reason_retry` | Successful game remains; explanation is corrected | „לא אורך המשפט קבע. מה הפרומפט הגדיר עכשיו?” |
| `b04_valid` | vague phrase located + intro game + correct reason | `full_success` | Agents begin the five-minute introduction game | „מדויק. לופּ ידע איזו פעילות לארגן.” |

`unsafeStates=[]`.

Priority: locate fault → replace goal → causal check.

## 7. Feedback ladder

1. „המטרה עדיין לא יוצרת פעילות היכרות. נסו לשפר אותה.”
2. „לופּ ביצע פעולה, אבל הפרומפט לא הגדיר משחק משותף.”
3. „נסו לבחור מטרה ברורה בעצמכם.”
4. Static emphasis with exactly two replacement options.
5. „בחרו במשימה שאומרת מה לארגן וכמה זמן.”
6. Preserve correct context blocks; highlight the correct remaining goal with icon and text.
7. Guided completion inserts the goal and proceeds.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b04_score_location` | Locate the vague goal phrase | `user_independent` | `user_choice_two` | `system_completed` |
| `b04_score_goal` | Select a concrete task | `user_independent` | `user_choice_two` | `system_completed` |
| `b04_score_iteration` | Test/correct from the outcome, or succeed first try | `user_independent` | `user_choice_two` | `system_completed` |
| `b04_score_cause` | Explain why the new goal is clearer | `user_independent` | `user_choice_two` | `system_completed` |

No score rule reads elapsed time or raw attempt count.

## 9. Copy registry

- `title`: „לא בערך, בדיוק”
- `comic_setup`: „לופּ עשה משהו כיפי, אבל לא התחילה פעילות.”
- `instruction_primary`: „מצאו את החלק העמום והחליפו אותו במשימה ברורה.”
- `locate_instruction`: „איזה חלק אינו אומר ללופּ מה לבצע?”
- `repair_instruction`: „החליפו את המטרה העמומה.”
- `causal_instruction`: „מה הפך את המטרה לברורה?”
- `goal_help`: „מטרה ברורה אומרת מה רוצים שיקרה בסוף.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced motion / muted |
|---|---|---|
| `bg_b04_recruit_meeting` | Meeting space | static |
| `char_loop_b04_colorful_hats` | Initial vague result | static |
| `char_loop_b04_music` | Music-only result | static music-note icon + text |
| `char_loop_b04_surprise_table` | Surprise result | static |
| `char_loop_b04_intro_game` | Success | static paired-agent layout |
| `sfx_b04_music` | Soft background cue | visible music state |
| `sfx_b04_success` | Victory | stars + numeric score |

No loud audio, objects in flight, flashing or threat.

## 11. Accessibility and system behavior

- Phrase blocks and alternatives are semantic buttons.
- Dragging has a complete click/keyboard alternative.
- Focus moves to result heading after dispatch.
- Correct retained blocks use icon/text/border.
- Entire flow works muted and reduced-motion.
- Refresh grants nothing and returns to battle start.
- No AI/network call or persistent session choices.

## 12. Acceptance tests

- `TEST_B04_01_FAST_SUCCESS`: vague phrase + correct goal + reason → 5.
- `TEST_B04_02_WRONG_PHRASE`: context phrase selected → targeted diagnosis.
- `TEST_B04_03_MUSIC`: music starts but agents remain waiting; causal feedback.
- `TEST_B04_04_SURPRISE`: boxes stay on table; no flying objects/threat.
- `TEST_B04_05_LADDER`: two options at step 4; correct parts locked at step 6.
- `TEST_B04_06_PROVENANCE`: each action has independent provenance.
- `TEST_B04_07_KEYBOARD`: complete without pointer.
- `TEST_B04_08_MUTED_RM`: all information survives muted/RM.
- `TEST_B04_09_REFRESH`: no pre-victory commit.
- `TEST_B04_10_REWARD`: duplicate score action grants once.

## 13. Self-check

The locked concrete-goal scenario is preserved with safe comic outcomes and four distinct scoring behaviors. No upstream schema change is required.
