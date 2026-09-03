# Base44 integration guide

Status: **not connected**. This repository is a complete Vite frontend and currently has no `base44/config.jsonc`, Base44 SDK, remote classifier, authentication, database, or cloud persistence. The only approved Base44 scope is a future backend function for battle 23.

## Current architecture

```text
HashRouter UI
  └─ GameProvider
      ├─ localStorage progress (`ai_heroes_progress_v1`)
      ├─ deterministic battles 1–22
      └─ battle 23
          1. runLocalGate(raw draft)
          2. classifyWithSafeFallback(classifier, normalizedText)
          3. validateClassifierOutcome(raw classifier output)
          4. approved local outcome copy OR offline guided builder
```

Relevant files:

- `src/services/finalBattle.ts` — `runLocalGate`, `FinalBattleClassifier`, `classifyWithSafeFallback`, `validateClassifierOutcome`, and the current local classifier.
- `src/features/battles/FinalBattlePage.tsx` — the only classifier call site.
- `src/schemas/game.ts` — the closed `Battle23OutcomeKey` union.
- `src/services/progress.ts` — device-local persistence; deliberately unrelated to Base44.

## Clean install and build

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run preview
```

The build output is `dist/`. Routing uses `HashRouter`, so static-host refreshes do not require a server rewrite rule.

## Expected environment variables

No environment variables are required by the current release candidate.

When the remote adapter is implemented, add exactly one public client variable:

```dotenv
VITE_BASE44_CLASSIFIER_URL=https://<approved-base44-function-url>
```

This value is an endpoint, not a secret. Do not place API keys, service-role credentials, provider tokens, or any other secret in a `VITE_*` variable. No provider-specific server secret is defined yet; if the eventual Base44 function needs one, choose and document its exact name at implementation time and store it only in Base44 secrets.

## Backend connection point

1. After explicit approval, initialize this **existing** frontend with the Base44 `backend-only` template. Do not replace the Vite client.
2. Add one Deno backend function, suggested directory `base44/functions/classify-final-battle/`, with `function.jsonc` and `index.ts`.
3. The function request body contains only `{ "normalizedText": string }`. It must never receive character, progress, score, name, device, session, or analytics fields.
4. The function returns only `{ "outcome": Battle23OutcomeKey }`; it must never return generated child-facing prose.
5. Implement a client adapter satisfying `FinalBattleClassifier` and point it at `VITE_BASE44_CLASSIFIER_URL`.
6. Replace the constructed `LocalFinalBattleClassifier` in `FinalBattlePage.tsx` through a small environment-driven factory. Preserve the local classifier as the default/fallback.
7. Keep the call through `classifyWithSafeFallback`; do not call any adapter directly from a component.

The required ordering is invariant:

```ts
const gate = runLocalGate(draft);
if (!gate.ok) return; // zero network calls
const outcome = await classifyWithSafeFallback(classifier, gate.normalizedText);
if (!outcome) openOfflineBuilder();
```

`classifyWithSafeFallback` validates every adapter response through `validateClassifierOutcome`. A rejected request, timeout, malformed JSON, unexpected key, or unavailable service must not become an unhandled promise or visible external text. Transport failures enter the deterministic offline builder. Invalid outcome values collapse to the approved closed fallback key.

## Rules Base44 must not break

- `runLocalGate` always executes locally before the first network instruction.
- A blocked prompt produces exactly zero requests.
- Raw drafts and normalized prompts are never stored, logged, cached, placed in URLs, analytics, entities, request metadata, or error reporting.
- `unsafe_personal_data` is local-gate-only. A backend response with that value is rejected by `validateClassifierOutcome`.
- Visible messages remain the approved local `outcomes` map. Never display model or backend prose.
- Progress, settings, wallet, purchases, and scores remain localStorage-only.
- Do not add login, auth, entities, cloud sync, analytics, chat, leaderboard, teacher mode, or multiplayer.
- Battles 1–22 remain deterministic and make no network calls.
- The offline builder always remains available and never lowers a score because of a technical failure.
- Preserve `HashRouter` unless a real Base44 deployment proves SPA fallback and refresh behavior on every route.
- Keep Howler and the existing `AudioManager` public API unchanged by the integration.

## Post-integration checklist

- [ ] Run `npm ci`, typecheck, all tests, build, and preview.
- [ ] Add adapter tests for success, timeout, rejection, invalid JSON, invalid outcome, and aborted request.
- [ ] Prove with a request spy that blocked PII/unknown-token input produces zero network calls.
- [ ] Prove every external response passes `validateClassifierOutcome`.
- [ ] Prove no prompt appears in localStorage, URL, console, backend logs, Base44 entities, analytics, or error telemetry.
- [ ] Verify timeout/offline routes directly to the local builder with no score penalty.
- [ ] Verify all 23 battles and all replay/idempotency tests still pass.
- [ ] Refresh deep links on the deployed Base44 host.
- [ ] Run mobile checks at 360, 390, and 430px plus a real on-screen keyboard test.
- [ ] Verify no client bundle contains backend secrets.
- [ ] Confirm audio-license records before public release.
- [ ] Create a pre-integration Git tag and record the deployed commit hash.

## Rollback plan

1. Keep the pre-integration tag and this RC commit available.
2. Disable the remote adapter by removing `VITE_BASE44_CLASSIFIER_URL` or selecting the local classifier in the factory; rebuild and redeploy. No data migration is needed because progress never leaves localStorage.
3. If the Base44 function itself is faulty, roll back its deployment independently while the frontend runs `LocalFinalBattleClassifier`.
4. If hosting introduces route or asset regressions, redeploy the last known-good `dist/` from the pre-integration tag. Keep `HashRouter` during rollback.
5. Re-run the full release gate before enabling the remote adapter again.

Do not run `base44 create`, `base44 link`, `base44 deploy`, or any push command until the Base44 app name, ownership, endpoint policy, and deployment authorization are explicitly provided.
