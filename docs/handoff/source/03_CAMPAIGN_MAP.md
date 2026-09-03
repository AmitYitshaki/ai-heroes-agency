# Approved Campaign Map

**Version:** 1.4  
**Approved:** 31.08.2026  
**Content synchronized:** 02.09.2026  
**Status:** Approved  
**Owner:** Product/Content  
**Authority:** `PRODUCT_SPEC.md`, Decision 12

## 1. Locked structure

- Exactly 23 micro-battles.
- Tutorial: 1.
- Region battles: `6 / 6 / 5 / 4`.
- Final: 1.
- Normal battles target 75–105 seconds.
- Combo battles target 120–150 seconds.
- Final target 150–180 seconds.
- Typical active battle time: approximately 38.75 minutes.
- Typical full journey: approximately 52 minutes; release target 50–58 measured minutes.

The sequence, skill mapping, battle type, causal failure and target time are locked. Full Production copy and result-state objects are approved for all 23 battles.

## 2. Battle map

| # | Region / threat | Battle | Skill | Interaction | Causal outcome and required improvement | Independence | Target |
|---:|---|---|---|---|---|---|---:|
| 1 | Recruitment simulator | קריאת כיוון | Clear goal | Prompt assembly | Loop-X receives a scan without an action; add a clear action and relaunch | Guided | 90s |
| 2 | רובע הערפל / מר בערך | למי זה מיועד? | Relevant context: audience | Fault scan | Equipment does not fit because the user was unspecified; add audience | Guided | 90s |
| 3 | רובע הערפל / מר בערך | היכן אנחנו? | Relevant context: place/time | Power selection | Lighting is unsuitable because place/time were missing; add outdoor evening context | Semi-guided | 90s |
| 4 | רובע הערפל / מר בערך | לא בערך, בדיוק | Concrete task | Fault repair | “Do something fun” produces the wrong activity; define a five-minute introduction game | Semi-guided | 90s |
| 5 | רובע הערפל / מר בערך | שפה אחת | Output format | Power selection | Dense text appears because no format was requested; request bullets | Semi-guided | 90s |
| 6 | רובע הערפל / מר בערך | השוואת צורות | Useful output format | Robot test | A schedule appears as a hard-to-compare paragraph; choose a table | Semi-guided | 90s |
| 7 | רובע הערפל / מר בערך | שילוב עוטף | Goal + context + format | Combo | Signs and equipment mix because goal, audience and layout are incomplete; combine all three | Independent | 135s |
| 8 | מפעל בלי גבולות / עוד־ועוד | כמה זה מספיק | Quantity/length constraints | Power selection | Conveyor overflows because no stop point exists; require exactly five boxes | Semi-guided | 90s |
| 9 | מפעל בלי גבולות / עוד־ועוד | נימוסים במפעל | Tone/language constraint | Fault scan | Signs are unsuitable because tone was unspecified; require calm respectful language | Semi-guided | 90s |
| 10 | מפעל בלי גבולות / עוד־ועוד | הראו לי איך | Positive example | Power selection | A symbol misses the intended style; attach the approved example | Semi-guided | 90s |
| 11 | מפעל בלי גבולות / עוד־ועוד | רק לא זה | Counterexample | Prompt assembly | Rubber ducks fill the room because an exaggerated style was not excluded; add a counterexample | Independent | 90s |
| 12 | מפעל בלי גבולות / עוד־ועוד | מבחן איכות | Measurable success criterion | Robot test | Weak batteries pass because “good” is unmeasurable; use the displayed two-hour criterion | Semi-guided | 90s |
| 13 | מפעל בלי גבולות / עוד־ועוד | פס הייצור | Constraint + example + criterion | Combo | Packaging passes without limit, reference or test; combine all three | Independent | 135s |
| 14 | מבוך הפקודות / תסבוכת | לפי הסדר | Ordered structure | Prompt assembly | A box closes before the letter enters; reorder the steps | Independent | 105s |
| 15 | מבוך הפקודות / תסבוכת | הפרדת כוחות | Separate instructions/data | Fault scan | Loop-X summarizes the instruction itself; delimit the diary text | Semi-guided | 105s |
| 16 | מבוך הפקודות / תסבוכת | סתירה פנימית | Contradictions + positive phrasing | Fault repair | Huge text cannot fit a small note; replace conflict with one positive medium-size rule | Independent | 105s |
| 17 | מבוך הפקודות / תסבוכת | צעד אחר צעד | Controlled iteration | Robot test | Multiple changes hide what worked; restore and change one component | Independent | 105s |
| 18 | מבוך הפקודות / תסבוכת | יציאה מהמבוך | Structure + contradiction + iteration | Combo | Files reach wrong trays due to scattered/conflicting instructions; structure and revise one element | Independent | 135s |
| 19 | מגדל הוודאות / ד״ר ודאות | אותו הדבר בדיוק? | Probabilistic model | Robot test | Same prompt yields two designs; evaluate both against the displayed criterion | Semi-guided | 90s |
| 20 | מגדל הוודאות / ד״ר ודאות | מי אמר? | Independent verification | Responsibility shield | A plausible schedule is wrong; stop and compare with the agency guide | Independent | 105s |
| 21 | מגדל הוודאות / ד״ר ודאות | סודות רשת | Privacy | Fault scan | Privacy shield highlights fictional personal fields; remove them before sending | Independent | 105s |
| 22 | מגדל הוודאות / ד״ר ודאות | שומר הסף | Verification + privacy + probability | Combo | A report contains an unverified claim and personal field; verify, remove and reassess | Independent | 135s |
| 23 | Final / המשבש | שחזור התכנית | Full safe cycle | Free-text combo | Closed result family identifies one missing/unsafe component; preserve correct parts and revise | Independent + graded help | 165s |

## 3. Learning coverage

| Competency | Introduced | Practised | Combined | Final |
|---|---|---|---|---|
| Clear goal | 1 | 4 | 7, 18 | 23 |
| Relevant context | 2 | 3 | 7 | 23 |
| Output format | 5 | 6 | 7 | 23 |
| Constraints | 8 | 9 | 13 | 23 |
| Examples/counterexamples | 10 | 11 | 13 | optional support |
| Success criteria | 12 | — | 13 | 23 |
| Structure and contradictions | 14 | 15, 16 | 18 | 23 |
| Testing and iteration | 17 | core loop | 18 | 23 |
| Probability, verification and privacy | 19, 20, 21 | — | 22 | 23 |

## 4. Content-object requirement

Before implementation, every battle must define:

`battleId`, `regionId`, `order`, `title`, `villain`, `skillCodes`, `battleType`, `realWorldNeed`, `comicSetup`, `objective`, `promptComponents`, `validStates`, `partialStates`, `unsafeStates`, `robotOutcomes`, `feedbackAttempts`, `scoreCriteria`, `estimatedSeconds`, `reward`, `artDirection`, and `safetyTags`.

The builder must not generate missing values at runtime.

## 5. Campaign-level validation

- No two consecutive battles use the same battle type and skill.
- Every region ends with a combo.
- Every correct factual answer is provable from on-screen material.
- Every outcome has an explicit prompt-to-world causal explanation.
- Every battle can be completed without audio.
- Every battle supports keyboard input and reduced motion.
- The final battle introduces no new conceptual vocabulary.
- Bonuses and workshop visits are not included in the numbered 23 battles.
