# آینه | Ayneh Hair Studio

Private Persian hair consultation app, independently rebuilt from the project proposal.

## Source

- `worker/index.js`: Cloudflare-compatible Worker, embedded RTL interface and server-side KIE integration.
- `dev.mjs`: local preview server.
- `scripts/build.sh`: packages the Worker and hosting manifest into `dist/`.
- `scripts/validate-artifact.mjs`: validates the packaged ESM entrypoint.
- `.openai/hosting.json`: existing Sites project identity; preserve when deploying updates.

## Run and validate

Requires Node.js 22 or newer and Bash. No npm dependencies.

```sh
npm run dev
bash scripts/build.sh
node scripts/validate-artifact.mjs
```

The preview runs on port 4173 unless PORT or --port is specified.

## Production configuration

Set `KIE_API_KEY` as a production runtime secret through Sites. Never put it in source or GitHub. Local preview intentionally has no provider key.

Production: https://ayneh-hair-studio.roya-mh96.chatgpt.site

GitHub is the source and validation destination. Production remains hosted on Sites; pushing to GitHub alone does not deploy it. For each change, validate, synchronize GitHub, then publish the corresponding source through Sites.

## Current scope and limits

- Persian interface, 20 selectable styles, free-text color, photo upload, session history, original/result comparison and optional estimated eight-view rendering.
- KIE server routes implemented; live paid generation is unverified until a key is configured and an authorized test is run.
- Catalog illustrations are schematic, not verified photographic references.
- Owner-private single-studio release. Do not expose publicly: multi-salon roles, persistent billing, server-side rate limits and durable idempotency are not implemented.
- Session history is held in page memory; pending task recovery uses sessionStorage. Original photo must be uploaded again after reload.
- Photos are sent to KIE only when the user initiates generation with consent. Clearing the local session does not delete provider-held files.
