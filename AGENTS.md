# Base44 Dev Environment

## What this is
A self-contained Hebrew educational SPA (React + TypeScript + Vite). No backend, no database, no auth, no external services. Everything runs client-side; progress persists in LocalStorage.

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Vite dev server on host port 3000 (live reload enabled).
- `npm ci` runs at container startup; `node_modules` lives in a named volume.
- No secrets required.

## Setup notes
- The repo's `vite.config.ts` originally bound the dev server to `127.0.0.1`, which blocked the preview's external hostname. It now uses `host: true, allowedHosts: true` so the preview proxy can reach it.
- Compose passes `--host 0.0.0.0 --port 3000` to `vite` to ensure the server binds all interfaces on the expected port.

## Verification
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the HTML shell with `/src/main.tsx` (live source, not a prebuilt bundle).
- Healthcheck: `docker compose ps` shows `healthy`.

## QA commands (inside container or locally with Node 20+)
- `npm run typecheck` — TypeScript
- `npm test` — Vitest
- `npm run build` — production build
