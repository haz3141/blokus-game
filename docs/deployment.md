# Deployment Notes

The MVP targets Cloudflare for both the Worker backend and the static web frontend.

## Backend

Deploy the Worker from `apps/server`:

```bash
pnpm install
pnpm --filter @cornerfall/server build
pnpm --filter @cornerfall/server exec wrangler deploy
```

The backend expects the Durable Object binding already declared in [wrangler.jsonc](/Users/hazael/Code/blokus-game/apps/server/wrangler.jsonc).

## Frontend

Build the static app from `apps/web`:

```bash
pnpm --filter @cornerfall/web build
```

If the frontend is hosted on a separate origin, set:

```bash
VITE_API_BASE_URL=https://your-worker-domain.example
```

Then deploy the contents of `apps/web/dist` to your preferred static host, or wire them into Cloudflare Pages.

## Suggested Cloudflare Shape

- `apps/server` deploys as a Cloudflare Worker with a Durable Object binding
- `apps/web` builds to static assets and can be served through Cloudflare Pages
- keep the frontend and Worker on the same origin when convenient so `VITE_API_BASE_URL` can stay unset

## Post-Deploy Check

- create a room from `/`
- open the invite URL on a second device
- start a match
- confirm that an opening move syncs across clients
- refresh one player and confirm reconnect
