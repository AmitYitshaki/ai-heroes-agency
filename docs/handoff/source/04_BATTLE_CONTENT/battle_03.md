# battle_03.md — היכן אנחנו?

**Version:** 1.0  
**Date:** 01.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored `battleId=battle_03`.
- Removed flashing party lights and all animation-dependent meaning.
- Added explicit diagnosis of the missing place/time context.
- Added complete outcome states, full help behavior and non-duplicative scoring.
- Replaced personal names with role-neutral teams.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_03` |
| `regionId` | `fog_district` |
| `order` | 3 |
| title | היכן אנחנו? |
| villain | מר בערך |
| `skillCodes` | `["context"]` |
| `battleType` | `power_selection` |
| real-world need | הוספת מקום וזמן לבקשה כדי להתאים פעולה לסביבה |
| objective | להגדיר תאורה לקריאת מפות בחוץ בערב |
| `estimatedSeconds` | 90 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "no_flashing"]` |

## 3. Story and learning

סיור המפות ברובע מתחיל בערב. מר בערך מחק את המקום והזמן מהבקשה, ולופּ הפעיל תאורה צבעונית שמסתירה את סימוני המפה.

Learning objective: context can specify where and when, not only who.

Primary instruction:

> זהו איזה הקשר חסר ובחרו תאורה מתאימה.

## 4. On-screen material

- Prompt: `הפעל תאורה עבור הסיור [חסר]`.
- Street map with small labels.
- Static unsuitable colored-light state.
- Diagnosis and context cards.

## 5. Flow and timing

| State | Purpose | Instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Show mismatch | „לופּ הפעיל תאורה צבעונית על מפת הסיור.” / `המשך` | `diagnose` | 10s |
| `diagnose` | Identify context category | „איזה סוג הקשר חסר?” | retry or `select_context` | 15s |
| `select_context` | Choose place/time card | „איפה ומתי מתקיים הסיור?” | `dispatch` | 20s |
| `dispatch` | Apply selected context | „מעדכן מקום וזמן…” | `outcome` | 3s |
| `outcome` | Causal world response | approved outcome + `המשך` | feedback or `causal_check` | 8s |
| `feedback` | Correct one component | ladder text + `חזרה` | unresolved step | 8s |
| `causal_check` | Verify understanding | „למה התאורה התאימה הפעם?” | retry or victory | 10s |
| `victory` | Score and map | „מקום וזמן עזרו ללופּ להתאים את התאורה.” | score/map | 10s |

## 6. Prompt components

### Context diagnosis

| ID | Label | Role |
|---|---|---|
| `b03_diag_place_time` | איפה ומתי | correct |
| `b03_diag_audience` | למי מיועד הסיור | plausible previous-skill distractor |
| `b03_diag_format` | איך להציג את התשובה | plausible upcoming-skill distractor |

### Place/time cards

| ID | Label | Causal outcome |
|---|---|---|
| `b03_context_indoor_morning` | בתוך חדר בבוקר, לקריאת מסמכים | bright indoor panels wash out the outdoor map |
| `b03_context_stage` | באולם חשוך, להצגה | one static stage spotlight reveals only a small map corner |
| `b03_context_outdoor_evening` | בחוץ בערב, לקריאת מפות | warm map lights reveal the whole route clearly |

### Causal check

- Correct: `b03_reason_context` — „כי הוספנו מקום וזמן”.
- Distractor: `b03_reason_color` — „כי בחרנו את הצבע היפה ביותר”.
- Distractor: `b03_reason_repeat` — „כי שלחנו את אותה בקשה שוב”.

## 7. States and outcomes

| `stateId` | Condition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b03_wrong_diagnosis` | audience/format diagnosis | `b03_missing_place_time` | Context slot stays visibly empty | „הבעיה היא התאמת הפעולה לסביבה. חסרים מקום וזמן.” |
| `b03_indoor` | indoor morning | `b03_indoor_lighting` | Indoor panels make the street map hard to read | „התאורה מתאימה לחדר, לא למפה בחוץ בערב.” |
| `b03_stage` | stage context | `b03_stage_lighting` | One map corner is lit; most of the route remains hidden | „תאורת במה מאירה נקודה אחת. הסיור צריך לראות את כל המסלול.” |
| `b03_wrong_reason` | causal explanation incorrect | `b03_reason_retry` | Correct lighting remains; explanation panel stays open | „איזה מידע חדש שינה את התוצאה?” |
| `b03_valid` | place/time diagnosed, correct context and reason | `full_success` | Entire route becomes clearly visible | „מעולה. המקום והזמן התאימו את התוצאה לסביבה.” |

`unsafeStates=[]`.

Priority: diagnosis → place/time selection → causal check.

## 8. Feedback ladder

1. „התאורה עדיין לא מתאימה לסיור. נסו לשפר את ההקשר.”
2. „חסרים לנו המקום והזמן שבהם התאורה תפעל.”
3. „נסו לבחור הקשר אחר בעצמכם.”
4. Static outline and exactly two relevant choices.
5. „בחרו את האפשרות שמתאימה למפה בחוץ לאחר השקיעה.”
6. Preserve correct parts with `נכון` icon/text and highlight the remaining correct option.
7. Guided completion applies the remaining option and continues.

The ladder never flashes and never changes score from attempt count alone.

## 9. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b03_score_diagnosis` | Identify place/time as missing context | `user_independent` | `user_choice_two` | `system_completed` |
| `b03_score_context` | Select outdoor-evening map context | `user_independent` | `user_choice_two` | `system_completed` |
| `b03_score_iteration` | Test/correct based on outcome, or succeed first try | `user_independent` | `user_choice_two` | `system_completed` |
| `b03_score_cause` | Explain why the result changed | `user_independent` | `user_choice_two` | `system_completed` |

Persist only the final best score transaction, never session attempts.

## 10. Copy registry

- `title`: „היכן אנחנו?”
- `comic_setup`: „מר בערך מחק את המקום והזמן מהבקשה.”
- `instruction_primary`: „זהו איזה הקשר חסר ובחרו תאורה מתאימה.”
- `diagnose_instruction`: „איזה סוג הקשר חסר?”
- `context_instruction`: „איפה ומתי מתקיים הסיור?”
- `causal_instruction`: „למה התאורה התאימה הפעם?”
- `context_help`: „הקשר יכול להסביר למי, איפה ומתי.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 11. Assets and media

| `assetId` | Use | Reduced motion / muted equivalent |
|---|---|---|
| `bg_b03_fog_street_map` | Street-map background | static |
| `char_loop_b03_colored_lights` | Initial unsuitable state | static colored light shapes; no flashing |
| `char_loop_b03_indoor_lights` | Indoor outcome | static |
| `char_loop_b03_stage_spot` | Stage outcome | static |
| `char_loop_b03_map_lights` | Success | static readable route |
| `sfx_b03_switch` | Lighting change | visual state label |
| `sfx_b03_success` | Victory | stars + numeric score |

## 12. Accessibility and system behavior

- No flashing, strobing or moving light pattern.
- Light states differ by coverage, icon and text, not color alone.
- Cards are buttons with optional drag.
- Keyboard and screen-reader paths complete every step.
- Focus moves to outcome heading after dispatch.
- Muted and reduced-motion paths preserve causality.
- Refresh before victory returns to start and grants nothing.
- No network/AI call or persistent session data.

## 13. Acceptance tests

- `TEST_B03_01_FAST_SUCCESS`: correct diagnosis/context/reason → 5.
- `TEST_B03_02_DIAGNOSIS`: audience selected as missing type → diagnosis feedback only.
- `TEST_B03_03_INDOOR`: indoor card → full map remains hard to read with textual explanation.
- `TEST_B03_04_STAGE`: stage card → only one map corner visible.
- `TEST_B03_05_NO_FLASH`: no CSS/asset flashing in any state.
- `TEST_B03_06_LADDER`: exact two-choice step 4 and preserved correct parts.
- `TEST_B03_07_PROVENANCE`: independent correction after an error can still earn independent credit.
- `TEST_B03_08_KEYBOARD`: full completion without pointer.
- `TEST_B03_09_MUTED_RM`: full completion without audio/strong motion.
- `TEST_B03_10_REFRESH_COMMIT`: no reward before victory; commit once after score.

## 14. Self-check

The battle preserves the locked context objective and time while removing flashing and duplicated scoring. No upstream schema change is required.
