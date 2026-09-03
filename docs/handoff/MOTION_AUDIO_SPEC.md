# MOTION_AUDIO_SPEC.md

Restrained ״juice״: one primary animation at a time, and every animation has an equivalent static state that preserves meaning, causality, score and progression.

## 1. Motion tokens

| Token | Duration | Use |
|---|---|---|
| `m-quick` | 120ms | Press, select, tab change |
| `m-base` | 200ms | Card, sheet, dialog |
| `m-enter` | 320ms | Screen entry, node opening |
| `m-world` | 2400–4000ms | World result |
| `m-world-repeat` | 1200ms | Repeat of the same result |
| `m-stars` | 900ms | Star reveal, 180ms stagger |

Easing: `ease-out` `cubic-bezier(.2,.8,.2,1)` · `ease-soft` `cubic-bezier(.4,0,.2,1)`.

## 2. Prohibitions

No `shake`, no flash, no strobe, no rapid brightness change, no infinite loop. Maximum scale 1.06. No screen shake and no sudden frightening audio. Nothing required to be read disappears before it can be read (A11Y-MOT-08).

## 3. Cue list

| Screen / state | Motion | Sound | Visible when muted |
|---|---|---|---|
| Map entry | Nodes fade in, 60ms stagger | `sfx_map_enter` | — |
| Node open | `m-enter` scale 1→1.04→1 | `sfx_node_open` | Gold shadow appears |
| Scan | Scan frame sweeps once | `sfx_scan` | ״סורק״ label + scan frame |
| Dispatch | Progress bar RTL, 3s | `sfx_dispatch` | ״שולח…״ + bar |
| World result | Approved animation, `m-world` | `sfx_result_*` | Static frame + result heading |
| Repeat result | `m-world-repeat`, skippable | shortened | Same static frame |
| Feedback | Card slides 8px, `m-base` | `sfx_feedback` | Card + text |
| Repair / retain | Slot border settles, opacity only | `sfx_repair` | ״נכון — נשמר״ label |
| Victory | Character reaction + world repair | `sfx_success` | ״הצלחה״ heading + criteria table |
| Stars | `m-stars`, 180ms stagger, no strobe | `sfx_stars` | Full row immediately + `4 / 5` |
| Workshop equip | Item settles onto Loop-X, `m-base` | `sfx_equip` | ״מורכב״ label |
| Bonus wheel | One rotation, decelerating, ≤1.8s | `sfx_wheel` | Chosen category shown as text |
| Bonus reward | `+2` chip scales in | `sfx_stars` | `+2` chip + wallet total |
| Region transition | Stamp presses once | `sfx_region` | Region stamp + next region name |
| Safety guard | **none — already static** | `sfx_guard` soft lock click | Guard card + stop text |
| Ceremony | Certificate rises, `m-enter` ×2 | `sfx_ceremony` | Certificate + skill list |

## 4. Reduced-motion substitutions (A11Y-MOT-05 → 07)

| Motion | Static equivalent |
|---|---|
| Loop-X dispatch | ״שולח…״ + progress bar |
| World result | Static frame + result heading |
| Star reveal | Full row immediately + `3.5 / 5` |
| Region transition | Region card + stamp |
| Bonus wheel | Chosen category as text, no spin |
| Node open | Gold shadow, no scale |
| Safety guard | Unchanged — already static |

Honoured on first load. Score, causality and progression are identical in both modes — reduced motion is never a degraded experience.

## 5. Audio rules

- Separate **music** and **effects** toggles (A11Y-AUD-01). State written in words beside each switch, not implied by knob position.
- Entire journey completes muted (A11Y-AUD-02). Every cue has a visual or textual equivalent (A11Y-AUD-03).
- No loud autoplay before meaningful interaction (A11Y-AUD-04).
- Changes take effect immediately and persist locally (A11Y-AUD-05).
- Safety and error sound is soft and non-alarming (A11Y-AUD-06).
- Map/HQ music and battle music are short loops. Every effect is short and non-harsh.
- Full Hebrew voice-over is optional polish and must not block the core design.

## 6. Required audio inventory

Global: `sfx_map_enter` · `sfx_node_open` · `sfx_dispatch` · `sfx_scan` · `sfx_repair` · `sfx_feedback` · `sfx_success` · `sfx_stars` · `sfx_equip` · `sfx_wheel` · `sfx_guard` · `sfx_region` · `sfx_ceremony`.
Music: `mus_hq_loop` · `mus_battle_loop`.
Per-battle effects are already enumerated in `07_ASSET_MANIFEST.md` (e.g. `sfx_b03_switch`, `sfx_b08_conveyor`); each inherits the visual equivalent listed in its battle file.
