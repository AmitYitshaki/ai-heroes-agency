# 05_UX_FLOWS.md — סוכנות גיבורי ה־AI

**Version:** 1.0 · **Date:** 02.09.2026 · **Status:** Design delivered

Screen IDs referenced here (`S01`–`S52`) are defined in `DESIGN_SCREEN_INVENTORY.md`.

## 1. Entry

```
load → S01 splash
  ├── no local progress → S02 first entry
  │     └── התחילו מסע → S05 character select → S06 recruitment comic (4 panels) → battle_01
  └── local progress found → S03 returning entry
        ├── המשך משימה → S08 map (scrolled to next node)
        ├── מסע חדש → S04 confirm → clear → S02
        └── הגדרות ונגישות → S15
```

Rules:
- No account, name, avatar or permission gate. Sound choice (`S07`) is a card **inside** `S02`, never a gate (A11Y-AUD-04).
- `S04` itemises exactly what will be erased (battles, stars, cosmetics).
- `S01` always terminates in `S02`/`S03` or an error — never an unbounded spinner (A11Y-SR-06).
- `prefers-reduced-motion` is honoured on first load (A11Y-MOT-05).

## 2. Map navigation

```
S08 map
  ├── next node → battle shell
  ├── completed node → S12 replay confirm → battle shell (replay mode)
  ├── locked node → inline reason ״נפתח אחרי קרב NN״ (no dialog)
  ├── character chip → S14 hero switch (progress preserved)
  ├── settings icon → S15
  └── progress chip → S16 briefcase
```

The map is linear: all four regions are visible from the first load, only the next battle is open. The next node is 24% larger and carries the only gold shadow on screen. The next region's band is already visible at the bottom edge to create anticipation without opening it.

## 3. Shared battle shell (battles 1–22)

```
S17 villain panel (10s)
  → S18 objective + S19 problem scan
  → S20 prompt work area          ← the only layer the seven templates change
  → S21 dispatch (3s)
  → S22 world result (2–4s; 1.2s on repeat)
  → branch:
      full success        → S27 victory
      partial / wrong     → S23 feedback → S24 retry (correct parts retained)
      unsafe input        → S30 guard  (bypasses the help ladder)
      schema/network fail → S29 technical recovery
```

### 3.1 Help ladder (identical in all 23 battles)

| Step | Content |
|---:|---|
| 1 | ״הפרומפט עדיין לא מספיק מדויק. נסו לשפר אותו.״ |
| 2 | Show the causal result and name **one** missing component |
| 3 | Invite an independent retry with no new information |
| 4 | Static outline plus exactly two meaningful options |
| 5 | Independent retry with earlier correct parts retained |
| 6 | Preserve correct parts and complete one part together |
| Guided | `S26` half-open builder guarantees victory and continuation |

The ladder never flashes and never reduces score from attempt count alone (A11Y-COG-07). Unsafe input skips the whole ladder.

### 3.2 Scoring

Base 1 star. Four criteria per battle, each `1` (independent) / `0.5` (chose from two) / `0` (system completed). Stored as integer half-units `2..10`. `S27` explains **what was demonstrated**, never a mistake count. Only the final best-score transaction persists.

Replay (`S28`): improvement over personal best adds the delta; equal or lower adds `+0` with no negative copy. Transactions are idempotent — a double tap cannot award twice (A11Y-INP-05).

## 4. Seven interaction templates

Each replaces only the work area of `S20`. Full designs in `12 שבע תבניות קרב.dc.html`.

| ID | Template | Child action | Battles |
|---|---|---|---|
| T1 | הרכבת פרומפט | Order 2–4 power cards | 1, 11, 14 |
| T2 | סריקת תקלה | Mark what is missing or contradictory | 2, 9, 15, 21 |
| T3 | בחירת כוח | Pick one of 2–4 options | 3, 5, 8, 10 |
| T4 | תיקון תקלה | Replace a faulty phrase inside the prompt | 4, 16 |
| T5 | מבחן רובוט | Compare two results against a visible criterion | 6, 12, 17, 19 |
| T6 | מגן אחריות | Verify against the approved source, then decide | 20 |
| T7 | קרב שילוב | Fill 3 slots, dispatch once | 7, 13, 18, 22, 23 |

## 5. Post-region routing (deterministic)

```
Regions 1–3:  region combo → workshop → matching optional bonus → map
Region 4:     battle_22 → workshop_4 → battle_23 (finale)
```

- `BattleReward.unlockWorkshopVisitId` selects the workshop.
- The bonus is resolved by matching the completed `regionId` to `BonusDefinition.afterRegionId`. No duplicate `unlockBonusId`.
- Skipping the workshop or bonus never reverses a region or battle unlock.
- Each workshop presentation and each bonus reward is idempotent.

### 5.1 Workshop

```
S31 visit → 4 slot tabs (head / armor / movement / emblem)
  ├── affordable item → S34 purchase confirm → purchase → equipped
  ├── already owned  → S34b ״כבר בבעלותכם״ (no second charge)
  ├── insufficient   → dashed card + ״חסרים N כוכבים״ (no upsell)
  └── דלגו → S35 skip confirm → next route step
```

Exactly three items per visit. Prices in stars: visits 1–3 use `5 / 8 / 12`; visit 4 uses `4 / 8 / 12` (×2 for half-units). Purchases are cosmetic only and the screen says so in words. **Accessibility and comfort features are never sold for stars.**

### 5.2 Bonus

```
S36 offer (reward stated as fixed 2 stars BEFORE the category is drawn)
  ├── קחו את הבונוס → S37 category wheel → one question → S38 outcome
  │     ├── success       → +2 stars (rewardHalfUnits: 4)
  │     ├── already taken → no second award
  │     └── —
  └── המשיכו למפה → skip, region stays unlocked
```

The wheel varies only the **topic**, never the reward value. Under reduced motion there is no spin — the chosen category is shown immediately as text.

## 6. Battle 23 and ending

```
S43 free text (600-char counter) + S44 approved guide, privacy lure, unverified lure
  → local validation
      ├── personal-data pattern → S45 local block  (nothing sent; category only)
      └── clean → classifier request
            → schema validation
                ├── invalid / timeout → S47 technical (text kept in-screen only)
                └── valid → one of seven closed result families (S46)
                      ├── full_success → S49 final victory
                      └── any partial → focused feedback → retry
                            └── after the ladder → S48 half-open builder → guaranteed S49
S49 → S50 ceremony → S51 generic certificate → S52 journey summary → map / replay
```

### 6.1 Defence order before any request leaves the device

1. Local 600-char counter. Nothing transmitted while typing.
2. Local block — a personal-data pattern is stopped **before** the model request. The text is never displayed, logged or sent.
3. Closed classifier — the model classifies and routes only, choosing a key from a closed list. It does not author content.
4. Schema validation — an out-of-catalogue key, a missing response or a parse error routes to `S47`.
5. Presentation from the approved store — text and animation both come from pre-written, reviewed material.

### 6.2 Seven closed result families

`unsafe_personal_data` · `unclear_goal_or_context` · `missing_constraint` · `missing_format` · `missing_success_criteria` · `unverified_information` · `full_success`.

Each has a static reduced-motion frame, a spoken-as-text outcome, exactly one component to improve, and stays local — no publishing, broadcasting or leak imagery.

### 6.3 Ending

The certificate certifies **demonstrated skills** and carries no name, photo or identifier. Sharing produces a generic card identical for every child. All certificate text is live accessible UI, never baked into an image.

## 7. Recovery flows

| Trigger | Screen | Continuations |
|---|---|---|
| Asset or route load failure | `S29` | retry · guided builder · map |
| Classifier timeout / offline (b23) | `S47` | retry dispatch · guided builder · map (says the draft will be erased) |
| Schema violation | `S47` | same as above |
| Refresh before victory | back to battle start | grants nothing; no partial commit |
| Unsafe input | `S30` / `S45` | fix the field · ״מה מותר לכתוב?״ |

No recovery path claims persistence that did not occur (A11Y-B23-06).
