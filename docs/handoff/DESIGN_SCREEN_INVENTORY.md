# DESIGN_SCREEN_INVENTORY.md

**52 / 52 designed.** No row is a placeholder.
Column *File* names the delivered design file: `11` = `11 כניסה גיוס ומפה.dc.html` · `12` = `12 שבע תבניות קרב.dc.html` · `13` = `13 סדנאות בונוסים ואזורים.dc.html` · `14` = `14 קרב 23 והסמכה.dc.html`.

| # | Screen / material state | File |
|---:|---|---|
| 01 | Loading / splash | 11 |
| 02 | First entry · התחילו מסע | 11 |
| 03 | Returning entry · המשך משימה / מסע חדש | 11 |
| 04 | New-journey confirmation dialog | 11 |
| 05 | Hero / heroine selection (equal status) | 11 |
| 06 | Recruitment comic + Loop-X introduction | 11 |
| 07 | Sound choice, never blocking | 11 |
| 08 | Full campaign map, all regions visible | 11 |
| 09 | Locked battle node | 11 |
| 10 | Next available battle node | 11 |
| 11 | Completed node with best score | 11 |
| 12 | Replay state | 11 |
| 13 | Region opening / completion transition | 11 + 13 |
| 14 | Hero switch from map, no progress loss | 11 |
| 15 | Settings and accessibility panel | 11 |
| 16 | Compact progress, star balance, collected powers | 11 |
| 17 | Villain setup / comic panel | 12 |
| 18 | Mission objective | 12 |
| 19 | Problem scan | 12 |
| 20 | Prompt-building work area | 12 |
| 21 | Dispatch / launch | 12 |
| 22 | World result, 2–4s | 12 |
| 23 | Concise feedback | 12 |
| 24 | Retry with correct components retained | 12 |
| 25 | Help ladder steps 1–6 | 12 |
| 26 | Guided completion | 12 |
| 27 | Victory + 1–5 score in half-star increments | 12 |
| 28 | Replay result, improvement delta only | 12 |
| 29 | Technical / offline recovery | 12 |
| 30 | Protected safety stop | 12 |
| 31 | Four workshop visits | 13 |
| 32 | Exactly three cosmetic choices per visit | 13 |
| 33 | Owned / equipped / affordable / insufficient | 13 |
| 34 | Purchase confirmation + idempotent completed purchase | 13 |
| 35 | Skip workshop | 13 |
| 36 | Three optional bonus-stage offers | 13 |
| 37 | Category wheel with fixed visible two-star reward | 13 |
| 38 | Bonus success / already-claimed / skip | 13 |
| 39 | Opening and completion treatment per region (×4) | 13 |
| 40 | Region-villain reaction and safe defeat/exit | 13 |
| 41 | Route workshop → optional bonus → map (regions 1–3) | 13 |
| 42 | Route workshop → finale (region 4) | 13 |
| 43 | Free-text prompt input, 600-character counter | 14 |
| 44 | Approved guide, fictional privacy lure, unverified lure | 14 |
| 45 | Local safety rejection before any AI request | 14 |
| 46 | All seven approved closed result families | 14 |
| 47 | Technical timeout / offline, text retained in-screen only | 14 |
| 48 | Half-open guided builder preserving correct components | 14 |
| 49 | Final victory | 14 |
| 50 | Certification ceremony | 14 |
| 51 | Generic certificate without player name | 14 |
| 52 | Final journey summary + replay / map options | 14 |

## Battle → template coverage

All 23 battles map onto a designed template; every template is used.

| Template | Battles | Count |
|---|---|---:|
| T1 הרכבת פרומפט | 1, 11, 14 | 3 |
| T2 סריקת תקלה | 2, 9, 15, 21 | 4 |
| T3 בחירת כוח | 3, 5, 8, 10 | 4 |
| T4 תיקון תקלה | 4, 16 | 2 |
| T5 מבחן רובוט | 6, 12, 17, 19 | 4 |
| T6 מגן אחריות | 20 | 1 |
| T7 קרב שילוב | 7, 13, 18, 22, 23 | 5 |

Campaign validation holds: no two consecutive battles share the same template + skill pair; every region ends with a combo (7, 13, 18, 22); the finale introduces no new conceptual vocabulary; bonuses and workshops are not among the numbered 23.
