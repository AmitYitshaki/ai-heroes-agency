# סוכנות גיבורי ה־AI — Design Handoff Package

**Product:** a mobile-first Hebrew (RTL) educational game for ages 11–14. The player joins ״סוכנות גיבורי ה־AI״, operates the robot ״לופּ-X״, completes 23 prompt-engineering micro-battles across four themed regions plus a finale, and is certified as a young prompt engineer.

**Core promise:** כוח־העל שלכם הוא לדעת לבקש.

**Target platform:** Base44 (React + CSS). Design is complete; art assets are not yet produced.

---

## Read in this order

| # | File | What it gives you |
|---:|---|---|
| 1 | `README_FOR_CODING_AGENTS.md` | This file — orientation and rules of engagement |
| 2 | `source/01_PRODUCT_SPEC.md` | Approved product rules. **Highest authority after child-safety constraints.** |
| 3 | `source/03_CAMPAIGN_MAP.md` | The locked 23-battle sequence, skills, types, target times |
| 4 | `05_UX_FLOWS.md` | Every flow: entry, map, battle shell, help ladder, workshops, bonuses, battle 23, ending |
| 5 | `06_DESIGN_SYSTEM.md` | Colour, type, spacing, components, region kits — with HEX values and contrast ratios |
| 6 | `BASE44_DESIGN_IMPLEMENTATION_NOTES.md` | CSS tokens, semantics, state derivation, idempotency, the battle-23 client contract |
| 7 | `COMPONENT_STATE_MATRIX.md` | Every component × every state, so nothing has to be invented |
| 8 | `RESPONSIVE_RTL_SPEC.md` | Breakpoints and the RTL rules that are release blockers |
| 9 | `MOTION_AUDIO_SPEC.md` | Motion tokens, cue list, reduced-motion substitutions |
| 10 | `DESIGN_SCREEN_INVENTORY.md` | 52 screens, each mapped to the design file that shows it |
| 11 | `source/09_DATA_SCHEMAS.md` | Types, persistence, transactions. Implement exactly. |
| 12 | `source/10_AI_SAFETY_SPEC.md` | The only place an AI call happens (battle 23) and how it is fenced |
| 13 | `source/11_ACCESSIBILITY_CHECKLIST.md` | Every `MUST` blocks release |
| 14 | `source/04_BATTLE_CONTENT/battle_01.md` … `battle_23.md` | Per-battle content objects: states, outcomes, copy, scoring, assets, tests |
| 15 | `ASSET_PRODUCTION_SPEC.md` + `ASSET_MANIFEST_PATCH.md` | What art must be produced and how it is named |
| 16 | `assets/ASSETS_README.md` + `assets/characters/` | **42 character PNGs, delivered and ready to use.** Status, coverage table, and the three fixes still queued |
| 17 | `source/12_TEST_PLAN.md`, `source/13_ACCEPTANCE_CRITERIA.md` | Definition of done |

## The visual designs

`design/*.dc.html` — open each in a browser. They are the visual source of truth.

| File | Contents |
|---|---|
| `10 מערכת עיצוב פלטפורמה` | Full design system: tokens, type scale, every component in every state, four region kits, icon set, motion table |
| `11 כניסה גיוס ומפה` | Screens S01–S16 at 390×844, plus a 360px proof and the 1280px desktop map |
| `12 שבע תבניות קרב` | Battle shell S17–S30, then all seven interaction templates on real approved battle content |
| `13 סדנאות בונוסים ואזורים` | S31–S42: workshop, purchase, bonus, and the opening/closing treatment for each region |
| `14 קרב 23 והסמכה` | S43–S52: free text, local block, all seven result families, ceremony, certificate, summary |
| `15 מטריצות ושלמות` | Battle→template matrix, component→state matrix, 52-screen inventory, self-audit |

Every dashed rectangle in these files is a **waiting asset slot**. Its label is the `assetId` — and for all 42 character poses the real PNG is now in `assets/characters/<assetId>.png`. Swap the dashed rectangle for the image at the size given in `06_DESIGN_SYSTEM.md §7`.

---

## Authority order when documents disagree

1. Child safety, privacy and competition constraints
2. `source/01_PRODUCT_SPEC.md`
3. `source/00_README_BUILD_ORDER.md`
4. `source/03_CAMPAIGN_MAP.md`
5. `source/04_BATTLE_CONTENT/*`
6. `source/09_DATA_SCHEMAS.md` and `source/10_AI_SAFETY_SPEC.md`
7. Accessibility, architecture, test and acceptance documents
8. This design package

**Never change an approved product rule to make implementation easier.** Record the conflict instead.

---

## Twelve rules that break the product if you get them wrong

1. `<html lang="he" dir="rtl">`. **No `left` / `right` in CSS** — `margin-inline`, `inset-inline`, `padding-inline` only.
2. Wrap every numeral and Latin key in `dir="ltr"` + `unicode-bidi: isolate`. Without it `4 / 5` renders as `5 / 4`.
3. **No horizontal scroll at 360px.** Labels wrap; they never compress.
4. Interactive targets ≥44×44. Body text ≥16px. Instructions 19px.
5. Every choice card and map node is a `<button>`. Drag is an optional enhancement on top of a full click and keyboard path.
6. Red never marks a child's error. The safety guard has no hue: sunken paper + 3px ink + a `#A85C00` mark.
7. Elevation is a **solid offset** (`Npx Npx 0 #14171F`). No blur anywhere.
8. Correct prompt components stay visible across every retry, labelled `נכון — נשמר` with icon, frame and text.
9. Feedback names **one** missing component at a time and evaluates the prompt, never the child.
10. Reduced motion is not just suppressed animation — render the static substitutions in `MOTION_AUDIO_SPEC.md §4`. Score, causality and progression are identical in both modes.
11. Battle 23's local personal-data block runs **before any network call**. Report the category; never the matched text. Never log or transmit it.
12. Never claim persistence that did not happen. The battle-23 draft lives in component state only, and the copy says so.

## Never build

Lives · energy · purchases · ads · paywall · countdown · streak pressure · loot boxes · casino presentation · random reward value · public leaderboard · social comparison · red-only error states · colour-only, motion-only or audio-only information · Hebrew text baked into an image · any accessibility or comfort feature behind a star price.

---

## Suggested build order

1. **Shell and tokens** — document direction, CSS custom properties, type scale, focus ring, reduced-motion block.
2. **Primitives** — button hierarchy, power card, prompt slot, star row, wallet, dialog, bottom sheet, safety guard. Build against `COMPONENT_STATE_MATRIX.md` and stop when every state renders.
3. **Progress layer** — `CampaignProgressV1`, the idempotent transaction sequence, and derived UI state. Do not persist display state.
4. **Map** — five node states, region bands, linear unlock, hero switch, settings, briefcase.
5. **Battle shell** — S17–S30 with the help ladder and scoring, driven entirely by a battle content object.
6. **Seven templates** — one at a time, each verified against its battles from the matrix.
7. **Battles 1–22** — content-driven. If a battle needs code, the template is wrong.
8. **Workshops, bonuses, region moments** — including the deterministic post-region route.
9. **Battle 23** — the five-layer defence order, then the seven result families, then the half-open builder.
10. **Ending** — victory, ceremony, generic certificate, journey summary.
11. **Accessibility pass** — the full manual matrix in `RESPONSIVE_RTL_SPEC.md §5`. Every failed `MUST` blocks release.

Battles 1–22 must be **data, not code**. A new battle should be a new content object and nothing else.

---

## Open items — not design gaps

| # | Item | Owner |
|---:|---|---|
| 1 | Region backgrounds, map bands, UI icons, stars, stamps, cosmetics (characters are **done** — see `assets/ASSETS_README.md`) | Art |
| 2 | Three character re-runs: baked-in text on 3 files, non-transparent background on `char_certainty_*`, background residue on `char_bearach_*` | Art |
| 3 | Final per-villain dialogue library (Pending in `source/02_CONTENT_BIBLE.md`) | Content |
| 4 | Final audio cue list and licences | Audio |
| 5 | Cosmetic item display names (prices are locked by the schema) | Content |
| 6 | Contrast re-verification on a real device after assets are injected | Design + QA |

## Fastest path to a playable MVP

If hours matter, build in this order and stop when it plays:

1. Shell + tokens + the primitives from `COMPONENT_STATE_MATRIX.md`.
2. `CampaignProgressV1` with the idempotent transaction sequence.
3. The map with five node states — only region 1 needs to be open.
4. The battle shell (S17–S30) driven by a battle content object.
5. Templates **T3** and **T2** only — they cover battles 2, 3, 5, 8, 9, 10, 15, 21.
6. Battles 1–7 from `source/04_BATTLE_CONTENT/`. That is a complete region with a real arc.
7. Victory, score, map return.

That is a genuine vertical slice: entry → map → battle → feedback → score → progression, with real approved content and real character art. Everything after it — the remaining five templates, workshops, bonuses, battle 23, the ceremony — is additive and already designed.

Do **not** shortcut the RTL rules, the 44px targets, the retained-component behaviour or the safety guard to save time. They are the product, not polish.

## Design assumptions recorded

1. Region hues (`#4A5B7E` / `#B8480C` / `#6A3FA8` / `#0F6E6E`) were derived by the design; the source locked no palette.
2. The settings ״גודל טקסט״ control is a design addition on top of `A11Y-RES-04`. It changes no score, content or progression.
3. Cosmetic names shown in the screens are placeholders. Prices `5/8/12` and visit-4 `4/8/12` come from the schema.
4. Three bonus categories are a design division of the existing pool; the spec permits 3–4.
