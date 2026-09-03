# 06_DESIGN_SYSTEM.md — סוכנות גיבורי ה־AI

**Version:** 1.0 · **Date:** 02.09.2026 · **Status:** Design delivered
**Visual system name:** ״דיו וזהב״ (Ink & Gold)
**Live reference:** `10 מערכת עיצוב פלטפורמה.dc.html`

## 0. Rationale

Printed comic paper plus an agency control panel. Depth comes from a **solid offset shadow**, never a blur, so every element stays crisp at 360px and legible in grayscale. Colour is derived from the four learning regions, not from an external palette. Saturation and motion are reserved for the current action; everything else stays paper.

## 1. Colour tokens

All ratios measured against `paper #FFF7E9` for text on paper, and against white for text on a coloured fill.

### 1.1 Core

| Token | HEX | Role | Contrast |
|---|---|---|---|
| `ink-900` | #14171F | Outline, primary text, solid shadow | 15.9:1 |
| `ink-700` | #3A3630 | Secondary and body text | 10.9:1 |
| `ink-500` | #6B6355 | Meta text only — never instructions | 5.2:1 |
| `ink-300` | #94897A | Neutral border, disabled only | — |
| `paper` | #FFF7E9 | Screen and primary panel background | — |
| `paper-sunken` | #F4EAD6 | Work area, empty slot, safety guard | — |
| `surface` | #FFFFFF | Card, dialog, comic bubble | — |
| `desk` | #ECE7DC | Desktop frame outside the game stage | — |

### 1.2 Functional semantics

| Token | HEX | Role | Contrast |
|---|---|---|---|
| `primary` | #1E4FD8 | Single CTA per screen | 6.6:1 on white text |
| `primary-press` | #17369B | Pressed only | — |
| `primary-tint` | #E7EDFD | Selected card, neutral feedback fill | — |
| `success-deep` | #0B7350 | White text on green | 5.9:1 |
| `success` | #0F8A5F | Border and emphasis | 4.1:1 vs paper |
| `success-tint` | #E3F5EC | ״נכון — נשמר״ fill | — |
| `improve` | #A85C00 | Partial success, feedback, destructive action | 5.0:1 on white text |
| `improve-tint` | #FFF0D6 | Feedback card fill | — |
| `gold` | #F0A81E | Star, wallet, celebration | 8.9:1 with ink |
| `guard` | paper-sunken + ink-900 3px + #A85C00 mark | Safety state | — |
| `energy` | #C2321F | **Villain decoration only — forbidden for any UI state** | 5.6:1 on white |
| `focus` | 3px #F0A81E + 3px #14171F double ring | Focus indicator, works on paper and colour | ≥3:1 |

**Locked rule:** red never signals a child's error. Safety has no hue of its own — that absence is what makes it calm.

### 1.3 Region extensions

One hue + one tint per region. The hue colours background, pattern and villain decoration. It never touches the primary button, stars or the guard.

| Region | `id` | Hue | Tint | Pattern | Contrast |
|---|---|---|---|---|---|
| רובע הערפל | `fog_district` | #4A5B7E | #EAEDF5 | 115° diagonal mist bands | 6.8:1 |
| מפעל בלי גבולות | `no_limits_factory` | #B8480C | #FDEBDB | 90° vertical conveyor bands | 5.3:1 |
| מבוך הפקודות | `command_maze` | #6A3FA8 | #F0E9FB | ±45° crossed lattice | 7.2:1 |
| מגדל הוודאות | `certainty_tower` | #0F6E6E | #E1F2F2 | Mirror-polished upper half | 6.1:1 |
| Finale | `finale` | ink + gold + 3 accent chips | #F4EAD6 | All three prior patterns at reduced saturation | — |

## 2. Typography

Three families, all Google Fonts under OFL — no licensing blocker.

| Family | Use | Licensing-safe alternative |
|---|---|---|
| Secular One | display, h1–h3 | Rubik 700 |
| Assistant 400/600/700/800 | every instruction, feedback, body | Heebo 400/700 |
| Heebo 500 | technical keys and numerals, LTR only | Roboto Mono |

### 2.1 Type scale

| Token | Size / line | Family & weight | Use |
|---|---|---|---|
| `display` | 40 / 1.12 | Secular One | Splash, final victory, ceremony |
| `h1` | 30 / 1.15 | Secular One | Single screen heading (A11Y-SR-01) |
| `h2` | 24 / 1.2 | Secular One | Battle title, region name, workshop name |
| `h3` | 20 / 1.25 | Secular One | Panel heading, dialog heading |
| `instruction` | 19 / 1.45 | Assistant 700 | Primary instruction. ≤12 words. Never centred |
| `body` | 17 / 1.55 | Assistant 400 | Story, feedback, term explanation |
| `body-min` | 16 / 1.5 | Assistant 400 | Reading floor — nothing readable below this |
| `label` | 16 / 1.3 | Assistant 700 | Button, field label, card name |
| `meta` | 14 / 1.4 | Heebo 500 LTR | Numerals and IDs only; never uniquely-carried information |

**Locked rule:** multi-line instructional text is right-aligned, never centred (A11Y-RTL-05). Centring is allowed only for a single-line heading and for the star row.

## 3. Spacing, radius, elevation

**Spacing (base 4):** 4, 8, 12, 16, 20, 24, 32, 40, 56, 72.

**Radius:** `r-chip` 8 · `r-card` 14 · `r-panel` 20 · `r-sheet` 28 · `r-pill` 999.

**Border:** 2px ink standard, 3px for emphasis and selection.

**Elevation — solid offsets only, no blur anywhere:** `e-1` 3px · `e-2` 5px · `e-3` 8px · `e-gold` 5px #F0A81E.
Offset direction is always **left-and-down** in RTL (light source top-right).

## 4. Grid and breakpoints

| Range | Margin / gutter | Layout |
|---|---|---|
| 360–429 | 12 / 10 | One column. Choice cards stack. Sticky bottom CTA bar. |
| 430–767 | 16 / 12 | Design baseline 390. One column; two cards per row when labels are short. |
| 768–1279 | 32 | Centred 640 stage. Work area and feedback drop to two columns; DOM order preserved. |
| 1280+ | — | Centred 720 stage on `desk`. Progress rail right, feedback log left. Reading line ≤62 characters. |

**Safe area:** sticky CTA uses `padding-block-end: max(16px, env(safe-area-inset-bottom))`. Viewport height uses `100dvh`.

## 5. Components

Full visual states are in `10 מערכת עיצוב פלטפורמה.dc.html`; the state grid is in `COMPONENT_STATE_MATRIX.md`.

### 5.1 Buttons

One primary per screen. Minimum height 48 (44 touch target guaranteed even in the compact variant). Press embeds the offset rather than moving the button.

- **Primary** — `primary` fill, 2px ink, `r-pill`, `e-1` 4px. `disabled` replaces the label with the reason (A11Y-INP-06); never a mute grey button.
- **Secondary** — white fill, 2px ink. ״נסו שוב״ always uses the `improve` variant so no screen offers two competing blue actions.
- **Tertiary** — text with a 2px underline in `primary`.
- **Icon** — 48×48 with a 22px glyph and a unique `aria-label`.

### 5.2 Prompt components

The mechanical core. A power card is a `<button>`; drag is an addition, never the only route (A11Y-INP-03).

Power card states: default · selected · `נכון — נשמר` (retained) · locked (lock + when it opens) · previously-tried (`improve`, ״התוצאה לא התאימה״).

Prompt slot: numbered, with move-up / move-down buttons at 44×44 and a spoken position (״מקום 2 מתוך 3״) per A11Y-KEY-07.

Skill chips: earned (ink border) vs locked (dashed + battle number).

״מה זה אומר?״ opens a local sheet with definition + one example; full battle state is preserved (A11Y-TXT-07).

### 5.3 Map nodes — five states

| State | Treatment | Grayscale differentiator |
|---|---|---|
| Locked | `desk` fill, dashed `ink-300`, lock + number | dashed + lock |
| Next | `#FFF1D2`, 3px ink, `e-gold`, arrow + number, **24% larger** | thick border + arrow |
| Completed | `success-tint`, `success` border, stars + `3.5 / 5` | green frame + numeral |
| Replay | white, ink border, replay arrow + best score | replay arrow |
| Perfect | `gold` fill, 3px ink, filled star + `5 / 5` | full fill + star |

### 5.4 Score, wallet, stamps

Half star splits **vertically at the right edge** (RTL reading direction). The numeral is always visible — never a tooltip (A11Y-COL-06). Wallet derives from `walletHalfUnits / 2`; a half shows as `18.5`. Accessible name: ״ארנק: 18 כוכבים״. Region stamp: continuous border + ✓ when sealed, dashed with no mark when open.

### 5.5 Input, counter, validation, guard

Free text exists in battle 23 only. Counter is `aria-live="off"` until 90%, then `polite` once (A11Y-B23-02). The guard is a local, calm state: sunken paper, 3px ink, mustard mark. It never displays or transmits the blocked text (A11Y-B23-03). Technical errors never claim persistence that did not happen, and always offer three continuations: retry / alternative / map.

### 5.6 Dialog, sheet, bubble, tabs

Destructive actions use `improve`, not blue. Focus enters the heading; Esc equals ״חזרה״ (A11Y-KEY-05). Help sheet occupies at most 62% of height so feedback stays above it (A11Y-RES-06). Comic bubble tail is always on the **right** in RTL. Commander Aleph's bubble is colour-inverted to distinguish speaker without an extra icon. Tab list starts at the right; arrow keys are mirrored for RTL; active tab is inverted plus `aria-selected`.

## 6. Icons

2.2px stroke, rounded caps, 24 grid, no fill. Every icon always carries a text label — it reinforces, never replaces. Only arrows and locks mirror in RTL (A11Y-RTL-03).

Semantic set: `scan` · `goal` · `context` · `constraint` · `format` · `example` · `criterion` · `iterate` · `guard` · `verify` · `locked` · `retained` · `map` · `workshop` · `bonus` · `dispatch`.

## 7. Character scale and placement

Mobile: Loop-X 96px · hero 128px · Aleph 84px · villain 112px · map figures 56px. Multiply by 1.4 on tablet and desktop.

**RTL placement:** Loop-X always **right** of the stage (he is ״ours״ and reading starts there). Villain always **left**, facing inward. Commander Aleph enters from bottom-right as a briefing layer, not a stage character. World result takes centre stage. A character never covers text.

Required state sheets: Loop-X (idle · scan · build · launch · confused · partial · safety · victory) · hero/heroine (idle · selected · map · victory · certificate) · Aleph (neutral · briefing · hint · celebration) · each villain (idle · action · reaction · defeat/exit).

## 8. Motion and audio

See `MOTION_AUDIO_SPEC.md`.

## 9. RTL for mixed content

Every numeral and identifier is wrapped in `unicode-bidi: isolate` + `dir="ltr"` (A11Y-RTL-04), so `4 / 5` never renders as `5 / 4`. Spacing and position use `margin-inline` / `inset-inline` only — no `left`/`right` in code. Progress fills right-to-left. ״Next״ arrow points **left**; ״back״ points **right**. DOM order equals visual reading order at every breakpoint (A11Y-RTL-02, A11Y-RES-05).

## 10. Global state inventory

Applies to every component: `loading` (paper skeleton + `aria-busy`, always resolves to success or error) · `empty` (what will appear + one action) · `offline` (sunken paper + three continuations, no persistence promise) · `error` (identifies the field or action, never the child) · `disabled` (dashed + reason text) · `locked` (lock + when it opens) · `selected` (3px border + check + ״נבחר״) · `retained` (״נכון — נשמר״, visible across every retry) · `completed` (stamp + numeral + stars) · `guarded` (calm stop + safe alternative).

**Never use colour, motion or audio as the only information channel.**
