# ASSET_PRODUCTION_SPEC.md

## 1. Global rules

- Every asset original or appropriately licensed.
- Icons and vector elements: **SVG**. Characters and backgrounds: **WebP** with PNG fallback, transparent. Lottie only where a reduced-motion alternative exists.
- Every animation ships a poster frame or static state.
- Filenames English, lowercase, `snake_case`.
- **No Hebrew text baked into any image.** All copy stays live accessible UI.
- Delivered per asset: `assetId`, description, screen/state, dimensions, format, transparency, animation duration, reduced-motion fallback, license/source, priority (`MUST` / `SHOULD`).

## 2. Art direction summary

Printed comic paper plus agency control panel. 2px ink outline on every shape. Solid offset shadow, never blur. Flat fills with a single soft highlight. Bright but not glossy; no gel, no bloom, no lens flare. Characters read at 96px on a phone.

**Forbidden:** weapons, injury, chases, smoke, fire, shake, flash, humiliated defeat, anything that reads as dark or militaristic.

## 3. Characters

### 3.1 Loop-X — `MUST`
`char_loop_idle` · `_scan` · `_build` · `_launch` · `_confused` · `_partial` · `_safety` · `_victory`
384×512 @2x (renders at 96px mobile, 134px desktop). Transparent. Friendly technological robot, expressive at small size. Executes the prompt literally enough to reveal what was missing. **Never blames the player.** The safety pose pauses and protects — it does not panic.

Cosmetic slots must be authored as separate overlay layers registering to fixed anchors: `head`, `armor`, `movement`, `emblem`.

### 3.2 Hero and heroine — `MUST`
`char_hero_{idle,selected,map,victory,certificate}` · `char_heroine_{...}`
512×640 @2x (128px mobile). Two visually distinct, mechanically identical options. No name, avatar upload or personal customisation. Uniform, not personal identity.

### 3.3 Commander Aleph — `MUST`
`char_aleph_{neutral,briefing,hint,celebration}` · 336×448 @2x (84px mobile). Competent, warm, concise. Enters from bottom-right as a briefing layer.

### 3.4 Villains — `MUST`
Each: `idle`, `action`, `reaction`, `defeat_exit` · 448×576 @2x (112px mobile).

| `assetId` prefix | Villain | Visual language |
|---|---|---|
| `char_bearach_` | מר בערך | Fog, blurred signs, approximate arrows, mismatched labels |
| `char_odveod_` | עוד־ועוד | Overflowing production lines, repeated items, comic excess |
| `char_tangle_` | תסבוכת | Tangled paths, swapped labels, reversible knots |
| `char_certainty_` | ד״ר ודאות | Polished certificates, confident stamps, checkable displays |
| `char_mashbesh_` | המשבש | Controlled remix of prior errors — never horror or destruction |

**Defeat is restoration of order:** the villain collects their tools and leaves. No violence, no falling, no humiliation.

## 4. Regions and map

| `assetId` | Content | Size |
|---|---|---|
| `bg_region_fog` | Fog district base | 1536×1024 |
| `bg_region_factory` | Factory base | 1536×1024 |
| `bg_region_maze` | Command maze base | 1536×1024 |
| `bg_region_tower` | Certainty tower base | 1536×1024 |
| `bg_finale_disrupted` / `bg_finale_restored` | Finale, two states | 1536×1024 |
| `map_route_fog` … `map_route_tower` | Per-region map band | 1170×900 |
| `map_transition_{1..4}` | Region transition card | 780×520 |

Region patterns are **CSS-generated** (`repeating-linear-gradient`), not baked into the image — see `06_DESIGN_SYSTEM.md §1.3`. The background asset carries scenery only.

## 5. Battle result frames

All per-battle asset IDs are already locked in `07_ASSET_MANIFEST.md`. Production rules:

- Every world result ships a **full static frame** for reduced motion.
- No flashing, strobing or motion-dependent meaning anywhere.
- Menu text, schedules, orders, prompts, battery times, guide rules and test results stay accessible HTML — never part of the image.
- `ui_slot_locked_correct` includes icon, frame and the text `נכון — נשמר`; colour alone is insufficient.
- Battle 13's water test happens on an empty demo package inside a closed station.
- Battle 16's clipped text is a layout demonstration only; the full text stays available to assistive technology.
- Battle 19's two outcomes are approved static simulations — the design must not imply real-time AI generation.
- Battles 21–22 personal-data fields are dummy labels only, never baked into a visual asset.

## 6. Battle 23 — seven result families

| `outcomeKey` | Asset | Static state |
|---|---|---|
| `unsafe_personal_data` | `char_loop_b23_safety` | Neutral static shield and lock |
| `unclear_goal_or_context` | `char_loop_b23_unfocused` | Unfocused action |
| `missing_constraint` | `char_loop_b23_long_plan` | Over-long plan |
| `missing_format` | `char_loop_b23_text_blob` | Dense text block |
| `missing_success_criteria` | `char_loop_b23_missing_step` | Static list with one empty item |
| `unverified_information` | `char_loop_b23_balloons` | Comic balloons |
| `full_success` | `char_loop_b23_board_ready` | Ordered, lit board — **no ignition animation** |

Plus `bg_b23_disrupted`, `bg_b23_restored`, `ui_b23_approved_guide`, `ui_b23_privacy_note`, `ui_b23_unverified_bubble`, and `char_mashbesh_{idle,unverified_offer,defeat}`.

## 7. UI, workshop, bonus, ending

**Icon set — `MUST`, SVG, 24 grid, 2.2px stroke, no fill:** `scan` `goal` `context` `constraint` `format` `example` `criterion` `iterate` `guard` `verify` `locked` `retained` `map` `workshop` `bonus` `dispatch`, plus `arrow_next` `arrow_back` `move_up` `move_down` `settings` `mute` `music` `close`.

**Stars:** `ui_star_full`, `ui_star_half` (vertical split, right-filled), `ui_star_empty` — 96×96 SVG.

**Map nodes:** `ui_node_{locked,next,completed,replay,perfect}` — 168×168 SVG.

**Stamps:** `ui_stamp_{fog,factory,maze,tower,finale}` sealed and open — 124×124 SVG.

**Workshop — 12 cosmetics, 3 per visit, across 4 slots:** `cos_head_{1..3}`, `cos_armor_{1..3}`, `cos_movement_{1..3}`, `cos_emblem_{1..3}`. 256×256 @2x transparent overlays on Loop-X anchors. Prices come from the schema (`5/8/12`, visit 4 `4/8/12`) — never baked into the art.

**Bonus:** `ui_bonus_wheel` (static frame required), `ui_bonus_cat_{goal_context,constraint_format,verify_privacy}`, `ui_bonus_reward_two_stars`.

**Ending:** `bg_ceremony`, `ui_certificate_frame` (frame only — all text is live UI), `ui_badge_certified`, `ui_share_card_generic` (identical for every child, no personal link).

**Brand:** `brand_agency_mark`, `brand_wordmark_he`, `brand_loop_emblem`, `favicon`, `app_icon` 1024×1024.

## 8. Compression and delivery

- SVG: cleaned, no editor metadata, `currentColor` where the icon inherits colour.
- WebP: quality 82, lossless for flat-fill art with fewer than 32 colours.
- Sprite sheets for character state sets; single files for backgrounds.
- Every raster ships @1x and @2x; @3x only for the hero on the certificate screen.
- Target: any single screen loads under 400KB of imagery on a cold cache.
