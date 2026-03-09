# Deployment Notes

The MVP will target Cloudflare for both the Worker backend and static web deployment.

## Planned Deployment Shape

- `apps/server` deploys as a Cloudflare Worker with a Durable Object binding
- `apps/web` builds to static assets and can be served through Cloudflare Pages or a Worker asset binding
- the web app will use a configured API base URL for local development and production

Detailed deployment commands will be added after the apps are implemented and verified.
