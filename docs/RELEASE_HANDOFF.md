# Release handoff — סוכנות גיבורי ה־AI

Last updated: this document was introduced by the commit titled "fix: content-audit RTL and terminology fixes, add release handoff doc" on `master` (see `git log` for its hash — a commit can't correctly quote its own hash inline). Read this first if you're picking up this project cold — it's the fastest path to being productive without re-deriving decisions already made.

## 1. Product state

**Release-candidate quality.** The full campaign is playable end to end: onboarding → character select → briefing → 23 battles across 4 regions + a tutorial + a finale → 4 workshop visits → 3 optional bonuses → certification ceremony. All 23 battles have been cross-checked against their authoritative specs (`handoff/source/04_BATTLE_CONTENT/battle_01.md`–`battle_23.md`) at least twice across different audit rounds; two content bugs were found and fixed (see §7). Zero known P0s. One P1 remains, scoped to something this environment genuinely cannot verify (real screen reader, real device on-screen keyboard), not more engineering. Audio licensing for every shipped file is now project-owner-confirmed (see §6 and `docs/THIRD_PARTY_ASSETS.md`) — note the confirmed music license is personal/private/non-commercial use only, which matters if this build is ever deployed publicly.

**Onboarding now explains what a prompt is before battle_01.** The existing 3-panel `RecruitPage` briefing (unchanged screen, no new route) was rewritten to define "prompt," show a weak-vs-better example, and lightly preview the goal/context/constraint/format/test/improve skills, on top of the existing hero/villain-world framing — still 3 panels, still skippable. A returning player can reopen the same briefing (character selection skipped, no forced route into a battle) from Settings → "מה זה פרומפט?". See §5 items 10–11 for the two non-obvious bits this relies on.

**What's NOT done, by design, per explicit product decisions:** no login/account, no chat, no multiplayer, no public leaderboard, no teacher/parent mode, no real-money purchases, no cloud sync. Do not add any of these without an explicit, new instruction — they were deliberately excluded (`01_PRODUCT_SPEC.md` §"אין להוסיף Login...").

## 2. Core architecture (don't relitigate these)

```text
src/
  content/      battles.ts (23 battle definitions + skillCatalog), regions.ts, catalog.ts (cosmetics),
                bonus.ts (bonus topics/questions + anti-repeat picker), villains.ts (region -> villain
                character -> pose-kind -> asset id, with the finale villain's non-standard filenames)
  engine/       scoring.ts — pure, deterministic: calculateScore, evaluateSelections, computeFinalBattleProvenance
  services/     progress.ts (localStorage + migration), audio.ts (Howler-backed AudioManager), musicRouting.ts,
                finalBattle.ts (local safety gate + classifier interface)
  state/        GameContext.tsx — single source of truth, ref-backed to avoid double-award races
  features/     one folder per screen/flow (battles, map, workshop, bonus, onboarding, settings, finale)
  components/   ui.tsx (Button, Modal, Stars, AppShell, briefcase panel, etc.), ErrorBoundary.tsx,
                BonusWheel.tsx, VillainReaction.tsx (small in-battle villain cameo)
  utils/        shuffle.ts (Fisher-Yates + seeded RNG), wheelGeometry.ts (bonus wheel angle math)
  schemas/      game.ts — CampaignProgressV1 and all shared types
  tests/        16 files, 110 tests — content, scoring, progress/persistence, finalBattle safety, battleFlow
                (all 23), audio, UI keyboard behavior, ErrorBoundary recovery, battle-option shuffle, bonus
                wheel geometry/anti-repeat, onboarding routing, villain pose mapping/fallback
```

- **React + TypeScript + Vite SPA.** `HashRouter` (not `BrowserRouter`) — deliberate, so refresh survives on any static host without server-side rewrite rules. Don't switch back without first confirming the actual Base44 hosting target has SPA-fallback configured and testing a real refresh.
- **Routing note:** re-verify this decision once the actual Base44 hosting target is known — HashRouter is the safe default in the absence of that information, not a permanent architectural commitment.
- **State:** `GameProvider` (in `GameContext.tsx`) holds the only `CampaignProgressV1` instance, persisted to `localStorage` under key `ai_heroes_progress_v1`. All writes go through `persist()`, which reads/writes via a `progressRef` (not just React state) specifically so two synchronous calls in the same tick (double-click/double-tap) can't both read stale "not yet applied" state — this was a real bug, fixed and regression-tested.
- **Idempotency:** every reward path (`commitBattleBest`, `grantBonus`, `purchaseCosmetic`) builds a deterministic transaction ID and short-circuits if it's already in `appliedTransactionIds`. This is the actual mechanism preventing double-reward — the ref-based `persist()` above is defense-in-depth on top of it, not a replacement for it.
- **Battle 23 safety:** `services/finalBattle.ts` — `runLocalGate()` runs before anything else, always, and blocks personal-data patterns, unknown vocabulary, and out-of-scope input **before** any classifier call. `LocalFinalBattleClassifier` is a fully local, deterministic stand-in for the future Base44 adapter — see §8.
- **Audio:** Howler.js-backed (`docs/AUDIO_TECH_DECISION.md` has the full justification). Public API (`audio.play(cue, enabled)`, `audio.startMusic(enabled, cue)`, `audio.stopMusic()`, `audio.unlock()`) is intentionally stable — every `playCue()` call site across the app depends on that signature not changing.

## 3. Recent commits (newest first)

```
beba29d feat: integrate licensed music and gameplay sound cues
963c0f9 polish: error boundary, storage resilience, release traceability
41d4f91 feat: complete approved UX gaps and granular battle-23 scoring
df088e9 test: lock in that starting a new journey preserves comfort settings
6bb6f22 Fix asset background bug, route persistence, and double-submit races
e1bf630 test: verify campaign rules safety and persistence
cfbaafa feat: implement complete AI Heroes campaign
545e7c3 chore: bootstrap Vite app and asset pipeline
```

Plus this round's closing commit, titled "fix: content-audit RTL and terminology fixes, add release handoff doc" (the one that adds this document).

## 4. Verification commands

```bash
npm ci               # clean, lockfile-reproducible install
npm run typecheck    # tsc -b --pretty false
npm test             # vitest run — 16 files, 110 tests
npm run build        # tsc -b && vite build
npm run dev           # local dev server, http://127.0.0.1:5173 (or next free port)
npm run preview       # serve the production dist build for smoke testing
```

Asset/audio rebuild pipelines (only needed if the *source* files change):

```bash
npm run assets:optimize   # handoff/assets/characters/*.png -> public/assets/characters/*.webp (sharp)
npm run audio:optimize    # incoming/audio/**/*.{mp3,wav} -> public/audio/**/*.mp3 (ffmpeg-static)
```

No `npm run lint` exists in this project — ESLint is not wired into the pipeline. Don't assume lint is running in CI.

## 5. Decisions you must not silently change

These were made deliberately, in prior rounds, generally after hitting a real problem. Don't "fix" them without understanding why they're this way first.

1. **HashRouter, not BrowserRouter** — refresh-on-any-host safety. See §2.
2. **`saveProgress()` swallows storage write failures** (quota exceeded, private-mode, disabled storage) instead of throwing — a full/blocked localStorage must degrade to in-session-only play, not break every reward action for the rest of the session. Don't add back a `throw`.
3. **`GameContext.persist()` reads/writes through a ref, not just `useState`** — required for double-click-in-the-same-tick correctness (React state alone isn't synchronously readable across two calls before a re-render). Don't "simplify" this back to plain `setProgress`.
4. **Battle 23's local safety gate always runs before the classifier, and the classifier can never itself return `unsafe_personal_data`** (`validateClassifierOutcome` explicitly excludes it from the allowed set) — PII detection is local-only, by design, never delegated to any remote/future adapter.
5. **`select`/`dispatch`/`feedback`/`guard`/`equip`/`region` SFX cues stay synthesized tones, not licensed files** — none of the delivered audio files is a good fit for these (see `docs/AUDIO_TECH_DECISION.md`). Don't wire a file to these cues just because one exists.
6. **3 of the 12 delivered SFX files are deliberately never wired** (`sad-trombone`, the villain chuckle, "player losing") — they read as mocking or attach to a "failure" state this product doesn't have. Don't wire them without a product-level decision to add a genuinely new "villain gloats" moment first. See §8 for the exact disambiguation of "villain sound" (there are two, only one is wired).
7. **Battle 23 scoring is per-criterion, not a single flat provenance** (`engine/scoring.ts` → `computeFinalBattleProvenance`) — this produces real intermediate results (e.g. 4.5 stars) matching `battle_23.md` §י's rubric. Don't collapse it back to one shared value for all four criteria.
8. **`docs/handoff/` (tracked in git) vs `handoff/` (gitignored, root-only)** — `/handoff/` in `.gitignore` is anchored to the repo root specifically so it doesn't also match `docs/handoff/`. If you ever "clean up" the gitignore, make sure you don't re-break this.
9. **`incoming/audio/` is tracked in git** (26MB, unlike the 91MB duplicate PNGs that were deliberately excluded) — it's the source-of-truth for `npm run audio:optimize`, not dead weight. Don't delete it.
10. **`/bonus/:bonusId` renders through a small `BonusRoute` wrapper in `App.tsx` that sets `key={bonusId}`** — react-router-dom does not remount an element just because a route param changed within the same matched `Route`, but `BonusPage` reads its persisted wheel selection with a plain `useState` initializer that must re-run per visit. Don't drop the `key`; don't rely on "navigation always goes through /map between visits" as the safety net instead.
11. **`RecruitPage`'s onboarding briefing doubles as a review screen** via `navigate('/recruit', { state: { briefingOnly: true } })` (wired from Settings' "מה זה פרומפט?" button) — this skips character re-selection and, on the last panel, calls `navigate(-1)` instead of routing into `battle_01`. Don't remove the `reviewOnly` branch or a returning player revisiting the explanation will get shoved into a fresh battle.
12. **`scripts/optimize-assets.mjs`'s checkerboard removal has a second pass, not just the border flood fill** — the flood fill alone cannot clear a checker pocket fully enclosed by the character's own line art (e.g. under a raised arm); several already-shipped villain poses (`char_tangle_idle` among them — already in production use before this was found) had visible checkerboard remnants there. The second pass clears a still-opaque, checker-toned pixel only when a window around it (sized to the image's own detected checker-cell period) shows a strong, roughly-balanced mix of both checker tones — a real alternating pattern — as opposed to a solid fill (an off-white sleeve, gray glasses, a metal prosthetic), which is why it's safe against character art that happens to be light/gray. Don't revert to the single-pass version; re-run `npm run assets:optimize` if any character asset ever needs reprocessing.
13. **`villains.ts` is the single source of truth for which villain, and which pose file, a region shows** — `BattlePage`/`FinalBattlePage` never hardcode a `char_<name>_<pose>` id themselves (except the training battle's Aleph cameo, which isn't a villain). The finale villain's pose files are named differently from the other four (`defeat` not `defeat_exit`, `unverified_offer` not `action`) — that's handled entirely inside `villainPoseAssetId`'s override table; don't special-case it again at a call site.

## 6. Open gaps

**P0: none.**

**P1 (requires something this environment cannot do — not more engineering time):**
- No real assistive-technology pass (VoiceOver/NVDA) or physical/virtual on-screen-keyboard device test has been run — see `docs/RELEASE_TRACEABILITY.md`'s PARTIAL rows (AC-A11Y-004, 006, 009, AC-PERF-001/002). Code-level semantics (headings, `aria-live`, labels, 44px targets) are in place and reviewed, just not verified against real AT hardware/software.

**Resolved this round:** Audio file licenses are now confirmed by the project owner — see `docs/THIRD_PARTY_ASSETS.md`. The 7 music tracks are Suno Free generations by the project owner (personal/private/non-commercial use only — re-confirm before any public deployment); the 5 wired `mixkit-*.wav` SFX files carry the Mixkit Sound Effects Free License (https://mixkit.co/license/). The 2 remaining unconfirmed files are unused and not shipped in `public/audio/`.

**P2 (documented, deliberately not touched — cosmetic or out of this round's scope):**
- Battle 17's "many changes" distractor conflates two separate failure modes from the spec into one option (softens, doesn't break, the isolation lesson).
- Battle 18 compacts the spec's 3-option rule choice into 2, losing a bit of the "negative wording isn't automatically wrong" nuance.
- A handful of character illustrations may retain a barely-visible checkerboard fragment in a fully-enclosed pocket the border-flood-fill algorithm can't topologically reach (documented in earlier rounds; verified negligible on the assets actually checked).
- Full-journey timing (target 50–58 min) has not been measured in a real pilot with children — battle content alone sums to ~40 minutes of `estimatedSeconds`; onboarding/workshops/bonuses/ceremony add more but nothing has been clocked live.
- `unlockedPowerIds` includes the string `'full_cycle'` from battle 23's completion call — a harmless label that doesn't correspond to a `skillCatalog` entry, so it never renders anywhere (the briefcase panel filters to known power IDs). Not worth a schema change to remove.

## 7. This round's content audit — what was checked, what was fixed

Systematically compared all 23 `battles.ts` entries against their `handoff/source/04_BATTLE_CONTENT/battle_XX.md` specs (battles 1 and 23 read personally; battles 2–12 and 13–22 each covered by a dedicated read-only audit pass), checking for: tone violations (shaming/mocking/scary/babyish language — none found), causal clarity (every outcome traces to what was/wasn't in the prompt — confirmed throughout), misleading distractors (all plausible-but-wrong, none trick questions), placeholder/generic text (none), combo-battle retention structure (confirmed for 7/13/18/22), and RTL/LTR mixed-content rendering.

**Two real issues found and fixed, both content-only (no architecture/schema change):**

1. **`battle_12` (`מבחן איכות`)** — `successMessage` used Latin "Beta"/"Alpha" (`'סוללה Beta: 3 שעות — עבר. Alpha: 90 דקות — לא עבר.'`), deviating from the spec's Hebrew transliteration ("סוללה בטא") and adding unnecessary bidi risk. Fixed to `'סוללה בטא: 3 שעות — עברה. סוללה אלפא: 90 דקות — לא עברה.'` (also corrected gender agreement — סוללה is feminine).

2. **`battle_20` (`מי אמר?`)** — `promptFrame` (`'תשובת AI: 10:00 · מדריך מאושר: 08:00'`) and `successMessage` (`'השעה המאומתת היא 08:00.'`) rendered with visibly swapped glyph order in a live browser check — confirmed with pixel-level measurement (`Range.getBoundingClientRect()` on each substring), not just eyeballing. Root cause: raw "HH:MM" digit runs embedded in RTL Hebrew prose. Fix: wrap **only the pure digit runs** in Unicode isolate marks (U+2068 FSI / U+2069 PDI) — `'תשובת AI: ⁨10:00⁩ · מדריך מאושר: ⁨08:00⁩'`. Empirically verified two variants before landing on this one: wrapping the whole "AI: 10:00" fragment together as one isolate does **not** fix the ordering (still measured incorrect); isolating only the digit runs does. A regression test (`content.test.ts`) locks in the exact fix.

Everything else across all 23 battles matched its spec closely enough that any difference was a legitimate compaction/rephrasing, not a defect — see the individual audit notes if you need the full per-battle detail (not preserved verbatim here to keep this document short; re-run the same comparison against the spec files if you need to re-verify a specific battle).

## 8. Audio cue disambiguation (resolving last round's "villain sound" ambiguity)

A previous round's chat summary described **two different things** both loosely as "villain sound," which read as contradictory. They are not — verified against the actual shipped code (`src/services/audio.ts`, `public/audio/sfx/`) in this round:

| Cue | File | Wired? | Where it fires |
|---|---|---|---|
| `'boss'` (SFX cue) | `mixkit-ominous-drums-227.wav` → `public/audio/sfx/boss.mp3` | **Yes** | On a battle's briefing screen when `battle.villain` is set (`BattlePage.tsx`), and on battle 23's briefing when unlocked (`FinalBattlePage.tsx`) — a short dramatic drum sting on villain reveal. |
| villain chuckle | `male-laugh-evil-chuckle-gfx-sounds-shocked-meme-laugh-1-0m02s.mp3` | **No** | Never copied to `public/audio/`, never referenced anywhere in `src/` (verified: `grep -rn "laugh\|chuckle" src public dist` returns nothing). Stays in `incoming/audio/sound/` only. |

There is exactly **one** wired villain-related sound (the drum sting on the `'boss'` cue). The chuckle file was always deliberately excluded — the ambiguity was purely in how a prior summary described them to the user, not a code or doc inconsistency. `docs/AUDIO_TECH_DECISION.md` and `docs/THIRD_PARTY_ASSETS.md` were already internally consistent on this point before this round; this table exists so the next reader doesn't have to reconstruct that from prose.

## 9. Instructions for the next agent

- Read `docs/RELEASE_TRACEABILITY.md` before touching accessibility/responsive/AI-safety code — it maps every acceptance-criteria row to its evidence, so you can tell at a glance what's actually been verified vs. assumed.
- Read `docs/AUDIO_TECH_DECISION.md` and §5 item 6 above before touching anything in `src/services/audio.ts` or adding a new SFX cue — there's a specific reason 3 of 12 delivered files aren't wired, and it's a product-tone decision, not an oversight.
- If asked to "polish more content," re-run the same battle-by-battle spec comparison this round did (§7) rather than assuming everything not mentioned here is untouched — new drift is more likely than a repeat of the same two bugs.
- Don't re-derive the HashRouter/ref-based-persist/gitignore-anchoring decisions in §5 from scratch — they're already justified there with the "why," not just the "what."

## 10. Instructions for Base44 integration (unchanged scope, still not started)

1. Implement a Base44 backend function that receives **only already-locally-gated** text and returns a single `Battle23OutcomeKey`.
2. Write a new adapter implementing `FinalBattleClassifier` (`src/services/finalBattle.ts`) that calls it, and validate every response through `validateClassifierOutcome` before use.
3. Swap `new LocalFinalBattleClassifier()` for the new adapter in `FinalBattlePage.tsx` (currently line ~10), via a Vite environment variable pointing at the backend URL — never a hardcoded secret in client code.
4. Never persist, log, or store the free-text prompt anywhere in the Base44 function, database, or logs — the local gate already guarantees PII never leaves the device, but the backend must not undermine that by logging its own request bodies.
5. Do not add Base44 auth, a database for progress, or cloud sync as part of this — progress stays device-local `localStorage`, per `01_PRODUCT_SPEC.md`'s explicit decision. This integration is backend-function-only, for battle 23's classifier alone.
6. Confirm the actual Base44 hosting model supports the app's SPA routing (HashRouter should work anywhere without config, but re-verify with a real deployed refresh test before considering switching to BrowserRouter for cleaner URLs).
