# RESPONSIVE_RTL_SPEC.md

## 1. Targets

| Class | Widths | Status |
|---|---|---|
| Mobile primary | 360×800 · **390×844 (design baseline)** · 430×932 | designed and proved |
| Tablet | 768×1024 portrait and landscape | specified |
| Desktop | 1280×800 · 1440×900 | designed |

## 2. Breakpoint behaviour

Desktop is **not** a stretched mobile canvas. It is a focused game stage with useful side space.

| Range | Margin / gutter | Layout |
|---|---|---|
| 360–429 | 12 / 10 | One column. Choice cards stack. Node labels wrap to a second line rather than compressing. Sticky CTA bar. |
| 430–767 | 16 / 12 | Baseline. One column; two cards per row when labels are short. |
| 768–1279 | 32 | Centred 640 stage. Work area and feedback become two columns. DOM order unchanged. |
| 1280+ | — | Centred 720 stage on `desk #ECE7DC`. Regions rail right, next-mission rail left. Reading line ≤62 characters. |

Battle stage height: 40% of viewport, never below 210px. It shrinks to 160px while the work area is active so the action is always visible without scrolling.

## 3. Hard requirements

| ID | Requirement | How it is met |
|---|---|---|
| A11Y-RES-01 | No horizontal scroll at 360px | Proved in `11 כניסה גיוס ומפה.dc.html` (360 frame). Margins drop to 12; labels wrap. |
| A11Y-RES-02 | 390 design survives viewport-height change | `100dvh`; CTA in a sticky bar, not absolutely positioned. |
| A11Y-RES-03 | On-screen keyboard keeps field, counter, submit reachable | Battle 23 keeps field + counter + dispatch in one scroll container; sticky bar sits above the keyboard inset. |
| A11Y-RES-04 | Usable at 200% zoom | rem-relative type; no fixed-height text containers; no `overflow: hidden` on text blocks. |
| A11Y-RES-05 | Tablet/desktop preserve semantic order | Layout via CSS grid areas; DOM order is the reading order at every breakpoint. |
| A11Y-RES-06 | Sticky CTA never covers focused content or validation | Help sheet caps at 62% height; `scroll-padding-block-end` reserves the CTA height. |

**Safe area:** `padding-block-end: max(16px, env(safe-area-inset-bottom))` on every sticky bar.

**Mobile landscape:** may show an orientation recommendation. It must never lose progress, and the battle stays completable if the child ignores it.

## 4. RTL rules

### 4.1 Document

`<html lang="he" dir="rtl">` (A11Y-RTL-01).

### 4.2 Direction logic

- Spacing and positioning use `margin-inline`, `padding-inline`, `inset-inline`, `border-inline` **only**. No `left` / `right` in the codebase.
- Progress bars fill **right to left**.
- Solid shadow offset is always left-and-down (light source top-right).
- ״Next״ arrow points **left**; ״back״ points **right**.
- Half star fills from the **right** edge.
- Tab lists start at the right; ArrowRight/ArrowLeft are mirrored.
- Comic bubble tail sits on the right, pointing at the speaker.

### 4.3 Icon mirroring (A11Y-RTL-03)

**Mirror:** arrows, chevrons, back/next, move-before/move-after, replay.
**Do not mirror:** scan, guard, lock, star, verify, map, workshop, bonus, dispatch, format, criterion.

### 4.4 Mixed strings (A11Y-RTL-04, A11Y-RTL-07)

Every numeral, percentage, ID and Latin key is wrapped:

```html
<span dir="ltr" style="unicode-bidi: isolate; display: inline-block; font-family: Heebo, monospace;">4 / 5</span>
```

Verified strings: `קרב 23` · `4 / 5` · `3.5 / 5` · `80%` · `142 / 600` · `2 / 6` · `08:00` · `missing_success_criteria` · `char_loop_b03_map_lights`.

Without the isolate, `4 / 5` renders as `5 / 4` — this is the single most common RTL defect in this product and must be covered by a test.

### 4.5 Typography and alignment

- Multi-line instructional text is right-aligned, never centred (A11Y-RTL-05). Centring is allowed only for a single-line heading and the star row.
- Line height ≥1.4 so Hebrew glyphs and any diacritics are never clipped (A11Y-RTL-06).
- No `text-transform` on Hebrew.

### 4.6 DOM and focus order (A11Y-RTL-02)

Tab order follows the visible RTL task flow: battle bar → stage (skippable) → objective → work area → CTA → secondary actions. Reordering a prompt slot updates the announced position, not the tab order.

## 5. Manual verification matrix

Test at minimum: 360–390 iPhone-class Safari behaviour · 360–412 Android-class · tablet portrait and landscape · desktop 1280 at 100% and 200% zoom · keyboard only · VoiceOver or equivalent mobile SR · NVDA or equivalent desktop SR · muted · reduced motion · grayscale and high contrast.

All failed `MUST` items block release.
