// Pings IndexNow (used by Bing and a few other engines) with a list of recently
// changed URLs. Run after every deploy. Usage:
//
//   node scripts/indexnow.mjs
//   node scripts/indexnow.mjs --since 7d   # only URLs whose lastmod is < 7d
//
// One-time setup:
//   1. Generate a random 32-char hex key (e.g. `openssl rand -hex 16`)
//   2. Save it to public/<KEY>.txt with the key itself as the single line of content
//   3. Set INDEXNOW_KEY in your deploy env (or hardcode below — it's public anyway).

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = 'https://josephpire.dev';
// IndexNow keys are public by design — they have to be retrievable at
// https://<site>/<key>.txt for IndexNow servers to verify ownership. There's
// no security value in keeping this out of the repo. Override via env if you
// rotate it.
const KEY = process.env.INDEXNOW_KEY ?? '873a5f9649e0286de0fe2c8a5d59b424';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

const sinceArg = process.argv.indexOf('--since');
const sinceDays = sinceArg !== -1 ? parseInt(process.argv[sinceArg + 1]) : Infinity;
const cutoff = Date.now() - sinceDays * 86400000;

// Parse sitemap-0.xml from the built dist/ directory.
const sitemapPath = resolve(process.cwd(), 'dist/sitemap-0.xml');
let xml;
try {
  xml = readFileSync(sitemapPath, 'utf-8');
} catch {
  console.error(`No sitemap found at ${sitemapPath}. Run \`npm run build\` first.`);
  process.exit(1);
}

const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
const urls = [];
for (const block of urlBlocks) {
  const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
  if (!loc) continue;
  const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
  if (lastmod && new Date(lastmod).getTime() < cutoff) continue;
  urls.push(loc);
}

if (urls.length === 0) {
  console.log('No URLs to submit.');
  process.exit(0);
}

console.log(`Submitting ${urls.length} URL(s) to IndexNow…`);
const body = {
  host: new URL(SITE).host,
  key: KEY,
  keyLocation: `${SITE}/${KEY}.txt`,
  urlList: urls,
};

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

if (res.ok) {
  console.log(`✓ IndexNow accepted ${urls.length} URLs (HTTP ${res.status})`);
} else {
  const text = await res.text();
  console.error(`✗ IndexNow rejected (HTTP ${res.status}): ${text}`);
  process.exit(1);
}
