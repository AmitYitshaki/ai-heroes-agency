# Third-party audio assets

`incoming/audio/` was delivered as plain music/SFX files with **no accompanying license file, readme, or attribution metadata** of any kind — just the folders and the audio files themselves. I have not fabricated a source, license, or author for anything below: every `source`, `license`, and `url` field is marked `REQUIRES_USER_CONFIRMATION` because I cannot verify it from the files alone, and none of it should be treated as confirmed until a human checks it against the actual purchase/download record for these files.

**This must be resolved before public release** — `AC-MEDIA-006` ("every asset is original or properly licensed") in `13_ACCEPTANCE_CRITERIA.md` cannot be marked PASS on unconfirmed licensing, competition rules require original-or-licensed assets, and Mixkit's own free-license terms (if that is in fact the source — see note below) prohibit reselling/sublicensing the files standalone, which is a different question from "can this specific product use them," so the actual license terms need eyes-on confirmation either way.

## Filename-pattern observations (not a license determination)

- The `mixkit-*.wav` naming convention (`mixkit-game-level-completed-2059.wav`, `mixkit-winning-a-coin-video-game-2069.wav`, `mixkit-medieval-show-fanfare-announcement-226.wav`, `mixkit-ominous-drums-227.wav`, `mixkit-player-losing-or-failing-2042.wav`) matches the filename format Mixkit's free sound-effects library publishes its downloads under. This is a pattern match on the filename only — I have not fetched or verified anything from mixkit.co, and cannot confirm these specific files still correspond to what's currently published there, under what license, or whether attribution is required for this use case.
- `male-laugh-evil-chuckle-gfx-sounds-shocked-meme-laugh-1-0m02s.mp3` and `sad-trombone-classic-wah-wah-wah-fail-brukowskij-classic-trombone-fail-4-3-0m03s.mp3` follow a different, longer descriptive-slug-plus-duration naming pattern more typical of Pixabay or a similar community sound library. Same caveat: unverified.
- The 7 music tracks (`Buggy Robot Quest.mp3`, `Caketown 1.mp3`, `djartmusic-best-game-console-301284.mp3`, `Friendly Robot Adventure.mp3`, `Playful Adventure.mp3`, `the_mountain-children-522447.mp3`, `Welcome to the Future.mp3`) don't share one consistent naming convention with each other — `djartmusic-...-301284` and `the_mountain-children-522447` look like Pixabay-style `<slug>-<id>` downloads; the other five look like they could be from a royalty-free game-music pack (title-cased track names) but I have no way to confirm which one from the filename alone.

## Manifest

| File (`incoming/audio/...`) | Used as | Source | License | Author/attribution | URL | Confirmed? |
|---|---|---|---|---|---|---|
| `music/Welcome to the Future.mp3` | `onboarding` music cue | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `music/Friendly Robot Adventure.mp3` | `headquarters` music cue | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `music/Playful Adventure.mp3` | `zone_fog` music cue | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `music/Caketown 1.mp3` | `zone_factory` music cue | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `music/Buggy Robot Quest.mp3` | `zone_maze` music cue | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `music/djartmusic-best-game-console-301284.mp3` | `zone_tower_finale` music cue | REQUIRES_USER_CONFIRMATION (filename suggests Pixabay) | REQUIRES_USER_CONFIRMATION | "djartmusic" (from filename only — unverified) | REQUIRES_USER_CONFIRMATION | No |
| `music/the_mountain-children-522447.mp3` | `certification` music cue | REQUIRES_USER_CONFIRMATION (filename suggests Pixabay) | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `sound/mixkit-winning-a-coin-video-game-2069.wav` | `success` SFX cue | REQUIRES_USER_CONFIRMATION (filename suggests Mixkit) | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `sound/mixkit-game-level-completed-2059.wav` | `stars` SFX cue | REQUIRES_USER_CONFIRMATION (filename suggests Mixkit) | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `sound/mixkit-medieval-show-fanfare-announcement-226.wav` | `ceremony` SFX cue | REQUIRES_USER_CONFIRMATION (filename suggests Mixkit) | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `sound/mixkit-ominous-drums-227.wav` | `boss` SFX cue | REQUIRES_USER_CONFIRMATION (filename suggests Mixkit) | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `sound/mixkit-player-losing-or-failing-2042.wav` | **not wired to any cue** — see `AUDIO_TECH_DECISION.md` | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `sound/male-laugh-evil-chuckle-gfx-sounds-shocked-meme-laugh-1-0m02s.mp3` | **not wired to any cue** | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |
| `sound/sad-trombone-classic-wah-wah-wah-fail-brukowskij-classic-trombone-fail-4-3-0m03s.mp3` | **not wired to any cue** (explicitly excluded — see below) | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | REQUIRES_USER_CONFIRMATION | No |

## Why 3 of the 12 delivered SFX files are unused

Per the integration brief's own caution and this product's "never punish, never mock" tone rules (`01_PRODUCT_SPEC.md` §11, `BASE44_DESIGN_IMPLEMENTATION_NOTES.md` §8 forbidden copy list):

- **`sad-trombone-...`** — reads as mocking/sarcastic; this product deliberately frames every wrong answer as a learning moment ("Loop-X did exactly what you asked — try a more precise goal"), never a punchline. Kept on disk, never wired.
- **`male-laugh-evil-chuckle-...`** — a villain-gloat sting only makes sense for a specific, consistent "the villain just won a round" beat, which doesn't exist as a distinct moment in the current battle flow (every "wrong" outcome is framed the same neutral way). Kept on disk in case a future iteration adds a dedicated villain-gloat beat; not wired by default.
- **`mixkit-player-losing-or-failing-...`** — same reasoning: the app has no "you failed" state to attach it to (a wrong answer is "not yet," not a failure), so using it on `feedback` would misrepresent the product's own tone rules.

None of these three were converted or copied into `public/audio/` — they cost nothing in the shipped bundle and remain exactly as delivered in `incoming/audio/sound/`.

## What to do next

A human needs to check the actual purchase/download source for each file (email receipts, download-page history, or a saved license PDF, if one exists outside what was handed to me) and fill in this table with the real license terms, then flip `Confirmed?` to `Yes` per row. Until then, treat every file here as **not cleared for public release** even though it's already wired into the running build for development/testing purposes.
