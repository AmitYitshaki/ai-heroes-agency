# BASE44_DESIGN_IMPLEMENTATION_NOTES.md

Everything an implementer needs that is not already in `06_DESIGN_SYSTEM.md`. Nothing here requires inventing a missing component state.

## 1. Document shell

```html
<html lang="he" dir="rtl">
```

Load Assistant (400/600/700/800), Secular One, Heebo (400/500/700) from Google Fonts. Set `font-family: Assistant, system-ui, sans-serif` on `body`.

Reset: `box-sizing: border-box` globally; `margin: 0` on `html, body`; `background: #FFF7E9`. Define `a` and `a:hover` colours (`#1E4FD8` / `#14171F`) up front.

## 2. Tokens as CSS custom properties

```css
:root {
  --ink-900:#14171F; --ink-700:#3A3630; --ink-500:#6B6355; --ink-300:#94897A;
  --paper:#FFF7E9; --paper-sunken:#F4EAD6; --surface:#FFFFFF; --desk:#ECE7DC;
  --primary:#1E4FD8; --primary-press:#17369B; --primary-tint:#E7EDFD;
  --success:#0F8A5F; --success-deep:#0B7350; --success-tint:#E3F5EC;
  --improve:#A85C00; --improve-tint:#FFF0D6; --gold:#F0A81E; --energy:#C2321F;
  --r-chip:8px; --r-card:14px; --r-panel:20px; --r-sheet:28px; --r-pill:999px;
  --e-1:3px 3px 0 var(--ink-900); --e-2:5px 5px 0 var(--ink-900); --e-3:8px 8px 0 var(--ink-900);
  --m-quick:120ms; --m-base:200ms; --m-enter:320ms;
  --ease-out:cubic-bezier(.2,.8,.2,1);
}
[data-region="fog_district"]     { --region:#4A5B7E; --region-tint:#EAEDF5; }
[data-region="no_limits_factory"]{ --region:#B8480C; --region-tint:#FDEBDB; }
[data-region="command_maze"]     { --region:#6A3FA8; --region-tint:#F0E9FB; }
[data-region="certainty_tower"]  { --region:#0F6E6E; --region-tint:#E1F2F2; }
```

Set `data-region` on the battle shell root. Region theming is then one attribute, and the primary button, stars and guard stay untouched by design.

## 3. Non-negotiable CSS rules

1. **No `left` / `right`.** Use `margin-inline`, `padding-inline`, `inset-inline`, `border-inline`. An RTL bug here is a release blocker.
2. **No `blur` in any shadow.** All elevation is `Npx Npx 0 var(--ink-900)`.
3. Solid shadow offset is positive on both axes, which in RTL renders left-and-down. Do not flip it per direction.
4. `100dvh`, never `100vh`, for full-height layouts.
5. Sticky bars: `padding-block-end: max(16px, env(safe-area-inset-bottom))`.
6. Scroll containers holding a sticky CTA get `scroll-padding-block-end` equal to the bar height.
7. Wrap every numeral and Latin key:
   ```html
   <span dir="ltr" style="unicode-bidi:isolate;display:inline-block">4 / 5</span>
   ```
8. Focus:
   ```css
   :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--gold), 0 0 0 6px var(--ink-900); }
   ```
9. Reduced motion:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
   }
   ```
   Then render the static substitutions from `MOTION_AUDIO_SPEC.md §4` — suppressing animation is not sufficient on its own.

## 4. Semantics

- Every choice card, power card and map node is a `<button>`, never a `div` with a click handler.
- Toggles: `<button role="switch" aria-checked>` with the state also written in adjacent text.
- Tabs: `role="tablist"` / `tab` / `tabpanel` with `aria-selected`; ArrowRight/ArrowLeft mirrored for RTL.
- One `<h1>` per screen (A11Y-SR-01). Battle heading, not the app name.
- Every icon-only control gets a unique `aria-label` (A11Y-SR-02).
- Result-bearing images get a concise `alt`; decorative scenery and the map route get `aria-hidden="true"`.
- Validation messages use `aria-describedby` on the field (A11Y-SR-04).
- New results announce once via a single `aria-live="polite"` region that receives only the outcome heading and the one-line feedback — never the whole scene.
- On state transition, move focus to the new heading or status node (A11Y-KEY-06).
- The 600-char counter is `aria-live="off"` until 90%, then `polite` once (A11Y-B23-02).

## 5. State derivation, not state storage

Derive from `CampaignProgressV1`; never persist a display state.

| UI state | Derived from |
|---|---|
| Node locked / next / completed | `nextBattleOrder`, `battleBestHalfUnits[battleId]` |
| Node perfect | `battleBestHalfUnits === 10` |
| Star display | `halfUnits / 2`, with a half rendered as `.5` |
| Wallet | `walletHalfUnits / 2` |
| Region stamp sealed | region's combo battle present in `battleBestHalfUnits` |
| Skill chip earned | battle that introduces it is completed |
| Cosmetic owned / equipped | `purchasedCosmeticIds`, `equippedCosmetics[slot]` |
| Bonus already claimed | `completedBonusIds` |
| Workshop available | `BattleReward.unlockWorkshopVisitId` |

Persistence key `ai_heroes_progress_v1`. Forbidden fields: `name`, `email`, `phone`, `prompt`, `attemptHistory`, `classifierInput`, `classifierOutput`.

## 6. Idempotency

Every reward path (battle victory, bonus grant, cosmetic purchase, equip) runs the transaction sequence: validate → build deterministic transaction ID → if already applied return unchanged → update best/total/wallet by delta → advance `nextBattleOrder` monotonically → append transaction ID → serialise once.

UI consequence: the confirm button becomes `aria-busy` and non-repeatable for the duration, and a repeat activation renders the ״כבר בבעלותכם״ / ״כבר הושלם״ state instead of a second charge (A11Y-INP-05).

## 7. Battle 23 client contract

1. Validate locally. On a personal-data pattern, render the guard and **return without any network call**. Report the category only; never the matched substring.
2. Send only validated `normalizedText`. No player, browser, score, attempt or progress identifier travels with it.
3. Validate the response schema, the score ranges and every key against the local catalogue before rendering. Any failure routes to the technical screen.
4. Render from the approved content store keyed by `outcomeKey`. Never render model prose directly.
5. The draft lives in component state only. Say so in the copy, and warn before navigation destroys it (A11Y-B23-06/07).

## 8. Content limits to enforce in code

Primary instruction ≤12 words. Feedback ≤2 short sentences. Power card title ≤32 characters, subtitle ≤24. Prompt slot ≤48 characters. Button label ≤22 characters. Free text 600 characters hard.

At most one new technical term per screen (A11Y-TXT-06); ״מה זה אומר?״ opens the definition without losing battle state.

Forbidden copy: ״נכשלתם״, ״טעיתם שוב״, ״זה קל״, ״לא הקשבתם״. Preferred: ״חסר לפרומפט…״, ״התוצאה עדיין…״, ״נסו להוסיף…״. Copy evaluates the prompt, never the child.

## 9. Performance

Any single screen loads under 400KB of imagery on a cold cache. Region backgrounds lazy-load per region. Character state sheets are sprite sheets. Icons are inline SVG or a single sprite — no icon font (icon fonts break with assistive technology and with `font-size` overrides).

## 10. What must never be built

No lives, energy, purchases, ads, paywall, countdown, streak pressure, loot box, casino presentation, random reward value, public leaderboard or social comparison. No red-only error state. No colour-only, motion-only or audio-only information channel. No Hebrew text baked into an image. No accessibility or comfort feature behind a star price.
