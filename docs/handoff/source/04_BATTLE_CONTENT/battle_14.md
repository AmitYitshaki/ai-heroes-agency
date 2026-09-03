# battle_14.md — לפי הסדר

**Version:** 1.0  
**Date:** 02.09.2026  
**Status:** Approved for Design and Build  
**Owner:** Gemini draft + Codex review  
**Authority:** `PRODUCT_SPEC.md`, `03_CAMPAIGN_MAP.md`

## 1. Codex review corrections

- Restored canonical `battleId=battle_14` and added structured reward/safety fields.
- Rebuilt the malformed flow and asset tables as a valid Production contract.
- Replaced the absolute claim that AI has no common sense with the accurate lesson that dependencies should be stated rather than assumed.
- Removed throwing/chasing actions and color-only slot states; all outcomes remain safe and statically readable.
- Added a dependency check and causal check so four score criteria measure distinct behaviors.
- Replaced the constant/attempt-based score and expanded the acceptance suite.

## 2. Identity

| Field | Value |
|---|---|
| `battleId` | `battle_14` |
| `regionId` | `command_maze` |
| `order` | 14 |
| title | לפי הסדר |
| villain | תסבוכת |
| `skillCodes` | `["structure_order"]` |
| `battleType` | `prompt_assembly` |
| real-world need | לפרק משימה לשלבים ולציין סדר שמכבד את התלויות ביניהם |
| objective | לסדר הכנסת מכתב, סגירת קופסה והעברה למסוע בסדר ביצוע תקין |
| `estimatedSeconds` | 105 |
| reward | `{ stampId: "stamp_mission_complete", unlockPowerIds: [] }` |
| `safetyTags` | `["closed_choices", "no_runtime_ai", "safe_physical_sequence"]` |

## 3. Story and learning

תסבוכת ערבבה את שלבי אריזת ערכות הקבלה. לופּ מבצע את השלבים לפי הסדר שנשלח, ולכן קופסאות עלולות להיסגר לפני שהמכתב נכנס או לעבור לאזור האיסוף לפני שהאריזה הסתיימה.

Learning objective: when one step depends on another, a prompt should state the intended order. AI may not reliably infer missing dependencies from the user's unstated intention.

Primary instruction:

> בדקו מה תלוי במה וסדרו את שלושת השלבים.

## 4. Flow and timing

| State | Purpose | Exact instruction/action | Transition | Target |
|---|---|---|---|---:|
| `intro` | Establish mixed order | „תסבוכת ערבבה את שלבי האריזה. המכתב נשאר מחוץ לקופסה.” | `dependency_check` | 12s |
| `dependency_check` | Identify prerequisite | „מה חייב לקרות לפני שסוגרים את הקופסה?” | feedback or `assembly` | 15s |
| `assembly` | Order three steps | „סדרו את הכרטיסים בשלבים 1, 2 ו־3.” | `dispatch` | 30s |
| `dispatch` | Execute sequence | „לופּ אורז ערכה לדוגמה…” | `outcome` | 3s |
| `outcome` | Show first invalid action or success | approved result + `המשך` | feedback or `causal_check` | 12s |
| `feedback` | Repair current order | ladder; retain current arrangement | `assembly` | 8s |
| `causal_check` | Confirm dependency reasoning | „למה הסגירה היא השלב השני?” | retry or `victory` | 10s |
| `victory` | Score | „סדר ברור שמר על התלויות בין הפעולות.” | score/map | 15s |

Fast path is approximately 97 seconds. One short correction remains within the 105-second target.

## 5. Prompt components and ordering

### Dependency check

- Correct `b14_dependency_insert_before_close`: „להכניס את מכתב הברכה”.
- Distractor `b14_dependency_move_before_close`: „להעביר את הקופסה למסוע”.
- Distractor `b14_dependency_label_before_close`: „לצבוע את מדף האיסוף”.

### Ordered cards

| `componentId` | Label | Required position | Preconditions |
|---|---|---:|---|
| `b14_step_insert_letter` | הכניסו את מכתב הברכה | 1 | open box at packing station |
| `b14_step_close_box` | סגרו את הקופסה | 2 | letter is inside |
| `b14_step_move_conveyor` | העבירו את הקופסה למסוע | 3 | box is closed |

Correct order: insert → close → move.

### Causal check

- Correct `b14_reason_dependency`: „כי המכתב צריך להיות בפנים לפני הסגירה”.
- Distractor `b14_reason_number`: „כי שלב 2 תמיד חשוב יותר”.
- Distractor `b14_reason_retry`: „כי לופּ כבר ניסה פעם אחת”.

## 6. Sequence evaluator and outcomes

The engine simulates the submitted order. The first action whose precondition is false selects the outcome; this makes all six permutations deterministic.

| `stateId` | First violated precondition | `outcomeKey` | World result | Feedback |
|---|---|---|---|---|
| `b14_move_before_ready` | move occurs while letter absent or box open | `b14_move_early` | Box moves into a stopped collection bay; remaining cards stay at station | „הקופסה עברה לפני שהאריזה הסתיימה.” |
| `b14_close_before_letter` | close occurs while letter absent | `b14_closed_early` | Closed empty box and letter remain side by side | „לופּ סגר את הקופסה לפני שהמכתב נכנס.” |
| `b14_wrong_reason` | sequence valid, reason wrong | `b14_reason_unresolved` | Correct package remains; explanation panel stays open | „איזו תלות הופכת את הסגירה לשלב השני?” |
| `b14_valid` | all preconditions satisfied and reason correct | `full_success` | Letter inside, box closed, package in collection bay | „נכון. כל פעולה התחילה רק כשהשלב הקודם הושלם.” |

The sequence evaluator checks actions in submitted order, not by a fixed failure priority. `unsafeStates=[]`.

## 7. Feedback ladder

The ladder preserves the current arrangement and targets the earliest invalid dependency.

1. „הערכה עדיין לא נארזה נכון. בדקו את סדר הפעולות.”
2. Show the first invalid action and its unmet precondition.
3. „שנו את הסדר ונסו שוב.”
4. Statically emphasize the unresolved position and offer exactly two relevant cards.
5. „בחרו בפעולה שהתנאים שלה כבר מוכנים.”
6. Preserve correct positions; place the correct remaining card with icon, border and text.
7. Guided completion orders the remaining cards and guarantees victory after `שגרו`.

No card disappears merely to reveal the answer. Time, attempts and help views are not score fields.

## 8. Scoring

Base: 1 star.

| `criterionId` | Criterion | 1 | 0.5 | 0 |
|---|---|---|---|---|
| `b14_score_dependency` | Identify what must happen before closing | `user_independent` | `user_choice_two` | `system_completed` |
| `b14_score_sequence` | Build insert → close → move | `user_independent` | `user_choice_two` | `system_completed` |
| `b14_score_iteration` | Test and improve, or succeed on first dispatch | `user_independent` | `user_choice_two` | `system_completed` |
| `b14_score_cause` | Explain why closing is second | `user_independent` | `user_choice_two` | `system_completed` |

Correct positions keep their provenance across retries; a wrong permutation does not automatically cap the final score.

## 9. Copy registry

- `title`: „לפי הסדר”
- `comic_setup`: „תסבוכת ערבבה את שלבי האריזה.”
- `instruction_primary`: „בדקו מה תלוי במה וסדרו את שלושת השלבים.”
- `dependency_instruction`: „מה חייב לקרות לפני שסוגרים את הקופסה?”
- `assembly_instruction`: „סדרו את הכרטיסים בשלבים 1, 2 ו־3.”
- `dispatch_label`: „שגרו את הסדר”
- `causal_instruction`: „למה הסגירה היא השלב השני?”
- `concept_help`: „סדר ברור מציין איזו פעולה קודמת לפעולה שתלויה בה.”
- `technical_error`: „משהו לא נטען. נסו שוב או חזרו למפה.”

## 10. Assets and media

| `assetId` | Use | Reduced-motion / muted equivalent |
|---|---|---|
| `bg_b14_packing_station` | Packing station and stopped collection bay | static |
| `ui_b14_order_slots` | Numbered semantic slots | icon + number + text state |
| `char_loop_b14_closed_early` | Close-before-letter result | static box and letter |
| `char_loop_b14_move_early` | Move-before-ready result | static box in stopped bay |
| `char_loop_b14_package_success` | Correct sequence | static completed package |
| `sfx_b14_sequence` | Execute steps | visible numbered progress |
| `sfx_b14_success` | Victory | stars + numeric score |

No thrown objects, chase, crushed paper, flashing or color-only information. All card text remains semantic UI.

## 11. Accessibility and system behavior

- At 360px, three numbered slots stack vertically above/below the card bank without horizontal scrolling.
- Select-card then select-slot supports touch, keyboard and switch-style interaction; drag is optional.
- Every slot announces position, card label and state.
- Current order remains editable before dispatch and preserved after partial outcomes.
- Reduced-motion executes as numbered static frames; muted mode preserves sequence text.
- Refresh before victory restarts the battle without reward.
- Commit is idempotent; no runtime AI, network call or free text.

## 12. Acceptance tests

- `TEST_B14_01_FAST_SUCCESS`: dependency, correct order and reason → `full_success`.
- `TEST_B14_02_CLOSE_FIRST`: close→insert→move → `b14_closed_early`.
- `TEST_B14_03_MOVE_FIRST`: either sequence beginning with move → `b14_move_early`.
- `TEST_B14_04_INSERT_MOVE_CLOSE`: insert→move→close → `b14_move_early` because box is open.
- `TEST_B14_05_ALL_PERMUTATIONS`: six permutations map deterministically; only one succeeds.
- `TEST_B14_06_RETAIN`: submitted order remains available for focused repair.
- `TEST_B14_07_LADDER`: step 4 has exactly two cards; step 7 guarantees completion.
- `TEST_B14_08_SCORE`: four behaviors use independent provenance; retries alone do not reduce score.
- `TEST_B14_09_KEYBOARD_360_MUTED_RM`: complete without drag/audio/motion at 360px.
- `TEST_B14_10_REFRESH_IDEMPOTENT`: refresh/double CTA cannot duplicate reward.

## 13. Self-check

The battle preserves the locked physical ordering problem while teaching explicit dependencies without making an absolute claim about AI reasoning ability.


## עדכון תוכן שוגר — סבב פדגוגי 03.09.2026 (פרומפט 10/10)

> מסמך זה הוא מפרט Production טרום־בנייה. העותק המשוגר בפועל (ומקור האמת המחייב) הוא `src/content/battles.ts`. הבלוק הבא הוא ה־copy הסופי, מסונכרן לאחר סבב שיפור פדגוגי — פתיחת המשימה, משוב על תשובה שגויה שמפרט את רכיב הפרומפט החסר/עמום, והסבר הצלחה שמסביר *למה* התשובה נכונה ואיזה רכיב פרומפט היא מחזקת. אין לראות בטבלאות שלמעלה (תסריט מסך־אחר־מסך, Copy מלא וכו') כמקור מחייב במקום שהן סותרות את הבלוק הזה.

**פתיחת המשימה (מוצג במסך התדריך):**
- story: "תסבוכת ערבבה את שלבי האריזה."
- objective: "הכניסו מכתב, סגרו והעבירו למסוע."

**הוראת הביצוע (מוצגת במסך ההרכבה):** "בחרו את שלושת השלבים לפי הסדר."

**משוב על בחירה שגויה (שם את הרכיב החסר/עמום, לא חושף את התשובה):**
  - **"צבעו את המדף"**: המדף נצבע, אך הקופסה אינה מוכנה. זו פעולה שלא שייכת כלל לשלושת השלבים הנדרשים.

**הסבר הצלחה (מוצג עם "למה זה עבד?" לאחר ניצחון):**
"הכנסת המכתב חייבת לקרות לפני סגירת הקופסה, ורק קופסה סגורה אפשר להעביר למסוע — זה הסדר היחיד שעובד. סדר פעולות אומר ל־AI איזו פעולה תלויה באיזו, לא רק אילו פעולות לבצע."
