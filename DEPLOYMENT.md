# Cloudflare Workers deployment

Live site: https://fabihashaheen.art

Use Node.js 22 or newer, then run:

```sh
npm ci
npm run deploy
```

The app uses the OpenNext Cloudflare adapter. `wrangler.jsonc` selects the
`fabiha-portfolio` Worker and the deployment account. Log in with `npx wrangler login`
when needed. `npm run preview` builds and previews the Workers version locally.

## Contact form secret

Set `SLACK_WEBHOOK_URL` in Cloudflare Workers Settings → Variables and Secrets
as an encrypted secret, or use `npx wrangler secret put SLACK_WEBHOOK_URL`.
Do not add its value to Git or to a public environment variable.

For Next.js local development, put the value in the ignored `.env.local` file.
For Workers preview, put it in the ignored `.dev.vars` file.
The Cloudflare build script strips the local Slack secret from OpenNext's
generated environment module before upload. Use `npm run deploy` for future builds.

The custom domain is recorded in `wrangler.jsonc` for future deployments.
Cloudflare Git auto-deployment is not configured.
