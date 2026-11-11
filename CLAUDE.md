# Wel-House Residency — CLAUDE.md

## What This Project Is

A water bill splitting app for a shared residential property. It calculates fair monthly water charges per apartment unit based on individual meter readings. Hosted on Cloudflare Workers + KV.

## Critical: Production Safety

**There is no backup.** This app's KV store is live production data. No staging environment exists.

- **Never** run `wrangler kv:key put` or `wrangler kv:bulk put` commands directly — they write to the live store.
- **Never** deploy (`wrangler deploy` or `wrangler publish`) without the user explicitly confirming.
- **Never** delete or overwrite `seed-data.json` — it is the only local reference of historical data.
- For any change that touches the API (`functions/api/data.js`) or KV access patterns, review carefully before suggesting a deploy.
- When testing API changes, test locally with `wrangler dev` — it uses a local KV simulation by default.

## Architecture

```
worker.js               # Routes /api/* to data.js, falls back to static assets
functions/api/data.js   # REST API: GET/PUT /api/data, history, restore
public/index.html       # Single-page app — all UI + business logic inline
wrangler.jsonc          # Cloudflare config (KV namespace binding: DATA)
seed-data.json          # Historical data reference (Oct–Dec 2026)
```

**No build step.** No package.json. Pure static assets + Cloudflare Workers.

## Tech Stack

- **Frontend**: Vanilla JS, HTML, CSS (no framework, no bundler)
- **Backend**: Cloudflare Workers (worker.js)
- **Storage**: Cloudflare KV — namespace binding `DATA`
- **Deployment**: Cloudflare Pages via Wrangler

## Key Logic (public/index.html)

- `HOUSES` array (line ~167): defines the 11 apartment units (11C, 11D, 1/1–3/3)
- `compute()`: core bill calculation — usage per house, common share, largest-remainder rounding
- Handles meter rollover (0–9999 range)
- Flags suspicious readings > 1500 units
- Edit mode unlocked via URL hash: `#key=<editor-key>`

## API (functions/api/data.js)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/data` | Public | Fetch current data |
| GET | `/api/data?check=1` | Edit key | Verify key |
| PUT | `/api/data` | Edit key | Save full document |
| GET | `/api/data?history=1` | Edit key | List last 50 versions |
| POST | `/api/data?restore=<id>` | Edit key | Restore a version |

Auth via `x-edit-key` header. Keys stored in `EDIT_KEYS` env var (Cloudflare secret), format: `"Name:key, Name2:key2"`.

## Limits

- 600 months max per document
- 512 KB document size limit
- KV free tier: ~1,000 writes/day, 100,000 reads/day
- KV propagation delay: ~1 minute

## Local Development

```bash
npx wrangler dev        # Starts local dev server with local KV simulation
```

Do not use `--remote` flag — that would point to the live production KV store.

## Deployment

Only deploy when explicitly asked by the user:

```bash
npx wrangler deploy
```

Always confirm with the user before running this — there is no rollback beyond KV version history (last 50 versions via the app's own restore feature).
