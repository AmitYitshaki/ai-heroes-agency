# Audio playback: technology decision

## What the app needed

Before this pass, `src/services/audio.ts` was a ~50-line `AudioManager` built directly on raw Web Audio (`AudioContext`, `OscillatorNode`, `GainNode`) that synthesized short sine-wave beeps for 8 SFX cues and a simple `setInterval` arpeggio loop for "music". It never loaded a real audio file. This integration adds 7 licensed music loops and 4 licensed SFX stingers (`incoming/audio/`), which means the manager now has to do things raw oscillators never needed: decode and stream real files, loop a track seamlessly, crossfade between tracks on route change, duck the music bed under a stinger, survive a failed decode/network load without crashing playback, and cope with mobile Safari's stricter autoplay/unlock behavior.

## Baseline test with native Web Audio

I first tried extending the existing raw-`AudioContext` approach directly (decode each file with `AudioContext.decodeAudioData`, drive gain nodes by hand for fades/ducking, track playback state manually). It works, but every one of the features above — crossfade, duck-and-restore, format fallback, double-init guards under React StrictMode — is code I'd be writing and debugging from scratch, and mobile unlock/autoplay edge cases are exactly the kind of thing that looks fine in Chrome desktop and breaks silently on an iPad in a classroom, which is this product's actual primary device.

## Decision: Howler.js

**Chosen: `howler` (^2.2.4), with `@types/howler` for typing.**

- Native Web Audio with an HTML5 Audio fallback built in — handles the cases where Web Audio is restricted or unavailable without any code from us.
- `Howl.fade(from, to, duration)` and `.play()/.stop()/.unload()` cover looping, crossfade, and ducking directly — no hand-rolled gain-node scheduling.
- ~7KB min+gzip, zero dependencies, MIT-licensed, actively maintained (last release covers modern mobile Safari's unlock quirks).
- The existing synthesized-tone fallback in `audio.ts` (`tone()`/`playSynthesized()`) is kept as-is for cues that don't have a delivered file, and as the automatic fallback path if a `Howl` throws on construction — Howler is additive, not a replacement for every cue.

Rejected:
- **Tone.js** — built for composing/sequencing music, not for playing back pre-produced files and short SFX; wrong tool for this job.
- **`react-howler` / `use-sound` / other React wrapper packages** — thin wrappers around Howler that would just be indirection over the same `AudioManager` singleton this app already has; the existing `audio.play(cue, enabled)` / `audio.startMusic(enabled, cue)` API is kept exactly as external code (`GameContext`, every `playCue()` call site) already expects it, so no wrapper is needed.
- **ZzFX** — a great fit for procedurally *generating* tiny SFX from a numeric seed, but this task is playing back already-produced, already-licensed files; ZzFX doesn't do file playback at all, so it doesn't apply here. (The existing sine-wave `tone()` fallback already serves ZzFX's role — "cheap synthesized beep" — for the cues left unwired to a file.)

## What stayed synthesized

`select`, `dispatch`, `feedback`, `guard`, `equip`, `region` remain on the original synthesized tones. None of the 11 delivered files (7 music + 4 usable SFX) is a good fit for a sub-100ms UI-click or a calm, non-alarming safety-stop sound — swapping a cheap correct-sounding beep for a mismatched licensed file would be a downgrade, not an upgrade, so per the brief ("don't replace a working solution just because a new playback path exists") they were left alone.

## Bundle size impact

- SFX actually wired (`success`, `stars`, `ceremony`, `boss`): **156KB total** (all four trimmed/normalized, two of them cut from 4-8s sources down to 2-4s stings).
- Music (7 loops, 128kbps stereo MP3, leading-silence trimmed): **16MB total**, lazy-loaded one track at a time (`Howl` is only constructed for the cue actually playing — never all 7 at once).
- `howler` itself: ~10KB added to the gzipped JS bundle (328KB → 366KB gzip... see `npm run build` output for the exact current numbers).
- The two unused/cautioned clips (villain chuckle, sad trombone — see `THIRD_PARTY_ASSETS.md`) were **not** copied into `public/audio/` at all, so they cost nothing in the shipped bundle.
