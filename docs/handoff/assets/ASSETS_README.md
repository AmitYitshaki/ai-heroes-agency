# Character assets — status and usage

**42 files delivered**, renamed to the exact `assetId` the code expects. Path: `assets/characters/<assetId>.png`.

All are transparent PNG, flat 2D comic art with a black ink outline, no baked-in Hebrew.

## Coverage

| Character | Files | assetIds |
|---|---:|---|
| Loop-X | 8 | `char_loop_` + idle · scan · build · launch · confused · partial · safety · victory |
| Hero | 5 | `char_hero_` + idle · selected · map · victory · certificate |
| Heroine | 5 | `char_heroine_` + idle · selected · map · victory · certificate |
| Commander Aleph | 4 | `char_aleph_` + neutral · briefing · hint · celebration |
| מר בערך | 4 | `char_bearach_` + idle · action · reaction · defeat_exit |
| עוד־ועוד | 4 | `char_odveod_` + idle · action · reaction · defeat_exit |
| תסבוכת | 4 | `char_tangle_` + idle · action · reaction · defeat_exit |
| ד״ר ודאות | 4 | `char_certainty_` + idle · action · reaction · defeat_exit |
| המשבש | 4 | `char_mashbesh_` + idle · unverified_offer · reaction · defeat |

Renames applied on import: `char_hero_cartificated` → `char_hero_certificate` · `char_heroine_selecte` → `char_heroine_selected` · all `*_exit` → `*_defeat_exit` (Mashbesh: `*_defeat`) · `char_mashbesh_action` → `char_mashbesh_unverified_offer`.

## Ship as-is for the MVP

Every state the battle shell needs exists. Loop-X, the hero, the heroine and Aleph are consistent and read clearly at 96px. Build the game on these now.

## Three fixes to queue (not MVP blockers)

**1 — Baked-in English text.** `char_hero_map`, `char_heroine_map` and `char_heroine_certificate` carry the label `char_loop_map` / `char_loop_certificate` rendered into the image. Crop it off, or re-run with `absolutely no text, letters, numbers or labels anywhere in the image` appended.

**2 — Non-transparent background.** The four `char_certainty_*` files have a solid beige background plus a floor line and a cast shadow. Re-run with `fully transparent background, PNG, no floor, no ground line, no cast shadow`. Until then the Certainty Tower battles (19–22) will show a beige rectangle behind him.

**3 — Background residue.** `char_bearach_*` carry faint grey haze, and `char_tangle_action` has blurred shelves. Harmless on a light paper background; clean up when there's time.

## Two assets still missing

- `char_loop_idle_bare` — Loop-X with a bare head and no antenna, so workshop cosmetics can sit on the head anchor without colliding. Needed only when the workshop ships.
- `char_mashbesh_action` — a distinct mischief pose. The finale currently reuses `unverified_offer`, which is acceptable.

## Note on style

Loop-X, hero, heroine and Aleph share one flat treatment. The villains — Tangle, Certainty and Mashbesh especially — are drawn with heavier pop-art line detail and rendering. They still hold together because they sit on region-tinted backgrounds, but if there is a second art pass, flattening the villains to the Loop-X level of detail is the single highest-value fix.

## Rendering rules

Sizes come from `06_DESIGN_SYSTEM.md §7`: Loop-X 96px, hero 128px, Aleph 84px, villain 112px, map figures 56px, ×1.4 on tablet and desktop.

RTL placement is locked: **Loop-X right, villain left facing inward, result centre.** A character never covers text. Villain art faces inward as delivered — do not mirror it.
