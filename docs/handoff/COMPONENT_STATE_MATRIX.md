# COMPONENT_STATE_MATRIX.md

`✓` = designed and specified · `—` = not applicable to the component.
Visual reference: `10 מערכת עיצוב פלטפורמה.dc.html`; interactive matrix: `15 מטריצות ושלמות.dc.html`.

| Component | default | hover | focus | pressed | selected | locked | blocked | retained | error |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Primary button | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — |
| Secondary button | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — |
| Power card | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Prompt slot | ✓ | — | ✓ | — | ✓ | ✓ | — | ✓ | ✓ |
| Skill chip | ✓ | — | ✓ | — | ✓ | ✓ | — | — | — |
| Map node | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Text field (600) | ✓ | — | ✓ | — | — | — | ✓ | — | ✓ |
| Character counter | ✓ | — | — | — | — | — | ✓ | — | ✓ |
| Star row | ✓ | — | — | — | — | — | — | — | — |
| Wallet | ✓ | — | ✓ | — | — | — | ✓ | — | — |
| Cosmetic item | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — |
| Dialog | ✓ | — | ✓ | — | — | — | — | — | — |
| Help sheet | ✓ | — | ✓ | — | ✓ | — | — | ✓ | — |
| Safety guard | ✓ | — | ✓ | — | — | — | ✓ | — | — |

## Per-component specification

### Primary button
**Purpose** the single dominant action on a screen. **Variants** default / compact. **Content limit** 3 words, 22 characters.
**Sizes** min-height 48 (compact 44). **Mobile/tablet/desktop** full width mobile; intrinsic width from 768.
**RTL** label centred; any icon sits at the leading (right) edge. **Keyboard** Enter and Space. **SR** the label is the accessible name; no extra description.
**Reduced motion** press offset only, no scale. **Muted** unaffected.
**`disabled`** replaces the label with the reason (״בחרו רכיב כדי לשגר״) — never a mute grey button (A11Y-INP-06).
**Base44** `<button>`, `box-shadow: 4px 4px 0 #14171F`, `transform: translate(-3px, 3px)` on `:active`.

### Power card
**Purpose** choose or order one prompt component. **Variants** single-select / multi-order / read-only.
**Content limit** title 32 characters, subtitle 24. **Sizes** min-height 52; 62 with a subtitle.
**RTL** check indicator at the leading (right) edge; subtitle indented by `padding-inline-start`.
**Keyboard** Tab to reach, Enter/Space to select; in ordering mode two 44×44 move buttons expose `move-before` / `move-after` and announce position (A11Y-KEY-07).
**SR** locked cards expose the reason and what was retained (A11Y-SR-08).
**`retained`** ״נכון — נשמר״ with icon, frame and text — colour alone is insufficient (A11Y-COL-04). Stays visible across every retry (A11Y-COG-02).
**Base44** `<button>` element, never a `div`. Drag is optional enhancement on top of the click path.

### Prompt slot
**Purpose** show the prompt Loop-X will actually execute. **Variants** filled-correct / active-empty / locked-future.
**Content limit** 48 characters per slot. **Sizes** min-height 48; 56 when active.
**RTL** number badge leading, status label trailing. **Keyboard** reachable and reorderable without a pointer.
**SR** ״חריץ 2 מתוך 3, הקשר, ריק״. **Reduced motion** fill transition is opacity only.
**Base44** slot order is data, not DOM position — reordering must not remount children.

### Map node
**Purpose** one battle on the linear route. **Five states** locked / next / completed / replay / perfect.
**Content limit** two-line label; wraps rather than truncating at 360px.
**Sizes** 64 base, **84 for next** (24% larger), 56 on desktop rails.
**RTL** nodes alternate right/left along a dashed route; the route is decorative and `aria-hidden`.
**Keyboard** locked nodes are focusable and announce when they open — they are not removed from the tab order.
**Grayscale** all five states remain distinguishable (A11Y-COL-07) — verified in the design file.
**Base44** derive state from `nextBattleOrder` and `battleBestHalfUnits`; never store a display state.

### Text field (600) + counter
**Purpose** battle 23 free text only. **Content limit** hard 600 characters.
**Counter** `aria-live="off"` until 90%, then `polite` once; a second announcement at the limit (A11Y-B23-02).
**`blocked`** the local guard replaces the dispatch action; the field keeps its content and focus returns to the field.
**RTL** field is `dir="rtl"`; the counter is `dir="ltr"` inside an isolate.
**Keyboard** on-screen keyboard must keep field, counter and submit reachable (A11Y-RES-03).
**Base44** never log, store or transmit the field value except as validated `normalizedText`.

### Safety guard
**Purpose** calm local stop. **Variants** pre-send block / in-battle unsafe state.
**Treatment** `paper-sunken` fill, 3px ink border, `#A85C00` shield mark. **No red, no alarm, no flash** (A11Y-COL-05).
**Content** what happened · why · exactly two safe alternatives.
**Never** displays the blocked text, stores it, or sends it (A11Y-B23-03). Never reduces score, never counts as an attempt.
**Audio** soft lock click only (A11Y-AUD-06). **Reduced motion** already static — unchanged.

### Cosmetic item
**Four states** equipped (green frame + ״מורכב״) / owned-not-equipped (ink frame) / affordable (blue price button) / insufficient (dashed + ״חסרים N כוכבים״).
**Idempotency** a repeat purchase returns the same state and charges nothing (A11Y-INP-05).
**Copy rule** never implies stronger learning ability.
**Base44** price is `priceHalfUnits`; display divides by 2.

## Cross-cutting rules

- Every state above is reachable by keyboard alone (A11Y-KEY-01).
- `focus` is visually distinct from `selected`: gold-ink double ring vs 3px border + check + label (A11Y-KEY-03).
- Validation messages are programmatically associated with their field (A11Y-SR-04).
- On state transition, focus moves to the new heading or status, never arbitrarily to page top (A11Y-KEY-06).
- No modal, workshop, help sheet or builder is a keyboard trap (A11Y-KEY-04).
