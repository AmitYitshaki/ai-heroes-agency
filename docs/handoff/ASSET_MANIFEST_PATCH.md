# ASSET_MANIFEST_PATCH.md

Patch list against `07_ASSET_MANIFEST.md` v1.5. Nothing existing is renamed or removed — these are additions and clarifications produced by the design.

## 1. Additions — global UI

| `assetId` | Description | Format | Priority |
|---|---|---|---|
| `ui_node_locked` / `_next` / `_completed` / `_replay` / `_perfect` | Five map-node states, 168×168 | SVG | MUST |
| `ui_star_full` / `_half` / `_empty` | Half star splits vertically, fills from the right | SVG | MUST |
| `ui_stamp_fog` / `_factory` / `_maze` / `_tower` / `_finale` | Sealed + open variants | SVG | MUST |
| `ui_wallet_chip` | Ink pill with gold numeral | SVG | MUST |
| `ui_focus_ring` | 3px gold + 3px ink double ring | CSS token, no asset | MUST |
| `ui_guard_shield` | Mustard shield + lock, calm state | SVG | MUST |
| `ui_progress_bar_rtl` | Fills right-to-left | CSS token, no asset | MUST |
| `ui_bubble_loop` / `ui_bubble_aleph` | Comic bubble frames, right-side tail | SVG | SHOULD |
| `icon_arrow_next` / `_back` / `_move_up` / `_move_down` | Mirrored in RTL | SVG | MUST |
| `icon_settings` / `_mute` / `_music` / `_close` | Chrome icons | SVG | MUST |
| `icon_goal` `_context` `_constraint` `_format` `_example` `_criterion` `_iterate` `_verify` `_retained` `_locked` `_scan` `_guard` `_map` `_workshop` `_bonus` `_dispatch` | Semantic set, 24 grid | SVG | MUST |

## 2. Additions — regions

| `assetId` | Description | Priority |
|---|---|---|
| `bg_region_fog` / `_factory` / `_maze` / `_tower` | Region base scenery, 1536×1024 | MUST |
| `bg_finale_disrupted` / `bg_finale_restored` | Finale, two states | MUST |
| `map_route_fog` / `_factory` / `_maze` / `_tower` | Per-region map band, 1170×900 | MUST |
| `map_transition_1`…`_4` | Region transition card, 780×520 | SHOULD |

**Clarification:** region patterns (mist bands, conveyor bands, lattice, mirror split) are CSS-generated, not baked into these files. The background asset carries scenery only.

## 3. Additions — characters

| `assetId` | Note |
|---|---|
| `char_loop_{idle,scan,build,launch,confused,partial,safety,victory}` | Base state sheet, distinct from per-battle result poses |
| `char_hero_{idle,selected,map,victory,certificate}` | 512×640 @2x |
| `char_heroine_{idle,selected,map,victory,certificate}` | Equal in status and capability |
| `char_aleph_{neutral,briefing,hint,celebration}` | 336×448 @2x |
| `char_bearach_{idle,action,reaction,defeat_exit}` | Fog district |
| `char_odveod_{idle,action,reaction,defeat_exit}` | Factory |
| `char_tangle_{idle,action,reaction,defeat_exit}` | Maze — supersedes the isolated `char_tangle_b18_region_exit`, which stays valid as a battle-18 pose |
| `char_certainty_{idle,action,reaction,defeat_exit}` | Tower |
| `char_mashbesh_{idle,unverified_offer,defeat}` | Finale |

## 4. Additions — workshop, bonus, ending

| `assetId` | Note |
|---|---|
| `cos_head_{1..3}` `cos_armor_{1..3}` `cos_movement_{1..3}` `cos_emblem_{1..3}` | 12 cosmetics, 3 per visit, transparent overlays on fixed Loop-X anchors |
| `ui_bonus_wheel` | **Static frame required** — reduced motion shows the category as text |
| `ui_bonus_cat_goal_context` / `_constraint_format` / `_verify_privacy` | Three categories (spec allows 3–4) |
| `ui_bonus_reward_two_stars` | Fixed visible reward |
| `bg_ceremony` | Ink ceremony background |
| `ui_certificate_frame` | **Frame only** — every line of certificate text is live UI |
| `ui_badge_certified` | Certification badge |
| `ui_share_card_generic` | Identical for every child; no name, photo or personal link |

## 5. Clarifications to existing entries

1. **Loop-X cosmetic layering** — the existing Loop-X entries must be authored so `head`, `armor`, `movement` and `emblem` are separate layers on fixed anchors. Cosmetics persist across battles, so a per-battle flattened pose cannot be the only delivery.
2. **`ui_slot_locked_correct`** — confirmed as a global component, not a battle-7/13/18 local asset. Ships icon + frame + the text `נכון — נשמר`.
3. **Battle 19** — both outcomes are approved static simulations; the design must not imply real-time generation. No ״generating״ animation on that screen.
4. **Battle 23 `full_success`** — the board is lit as a **static state**. The manifest's ״לוח מסודר ומואר״ must not be produced as an ignition animation.
5. **Personal-data fields (battles 21–22, 23)** — dummy labels rendered as live UI. No asset may contain a name-shaped string.
6. **Every per-battle `sfx_*`** — inherits the visual equivalent listed in its battle file; no new audio-only information.

## 6. Still open before Release Gate

| # | Item | Owner |
|---:|---|---|
| 1 | Character asset production — every dashed rectangle in the delivered design files is a waiting slot, not final art | Art |
| 2 | Final per-villain dialogue library (marked Pending in `02_CONTENT_BIBLE.md`) | Content |
| 3 | Final audio cue list and licences | Audio |
| 4 | Cosmetic item display names (the names in the design screens are placeholders; prices are locked by the schema) | Content |
| 5 | Contrast re-verification on a real device after assets are injected | Design + QA |
