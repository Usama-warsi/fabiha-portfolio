import { readFileSync, writeFileSync } from "node:fs";

// OpenNext copies local environment files into this module. Runtime secrets
// must come from Cloudflare bindings instead of being bundled with the app.
const path = new URL("../.open-next/cloudflare/next-env.mjs", import.meta.url);
const source = readFileSync(path, "utf8");
const sanitized = source.replace(/export const (production|development|test) = (.*);/g, (_, mode, json) => {
  const env = JSON.parse(json);
  delete env.SLACK_WEBHOOK_URL;
  return `export const ${mode} = ${JSON.stringify(env)};`;
});
writeFileSync(path, sanitized);
console.log("Runtime Slack secret excluded from Worker bundle.");
