#!/usr/bin/env node
// Injects a Content-Security-Policy into dist/_headers after the Astro build.
//
// Why generated instead of hand-written: the policy allowlists inline <script>
// blocks by sha256 hash rather than 'unsafe-inline', and those hashes cover
// Astro's own hydration runtime (client:load / client:idle / client:visible
// bootstrappers). Those change whenever Astro is upgraded. Hard-coding the
// hashes would mean a silent, total JS breakage on the next `npm update` —
// so we re-derive them from the built HTML on every build instead.
//
// Runs as part of `npm run build`. Static hosts (Netlify, Cloudflare Pages)
// read dist/_headers; `astro preview` does NOT, so use scripts/serve-csp.mjs
// to exercise the policy locally.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { glob } from 'node:fs/promises';

const DIST = resolve('dist');
const HEADERS = join(DIST, '_headers');

// Collect the sha256 of every inline, executable <script> in the output.
// `src=` scripts are covered by 'self'; application/ld+json is a data block,
// not executed, and browsers don't apply script-src to it.
const SCRIPT_RE = /<script([^>]*)>([\s\S]*?)<\/script>/g;

async function collectHashes() {
  const hashes = new Set();
  let pages = 0;
  for await (const file of glob('**/*.html', { cwd: DIST })) {
    pages++;
    const html = readFileSync(join(DIST, file), 'utf-8');
    for (const [, attrs, body] of html.matchAll(SCRIPT_RE)) {
      if (/\ssrc=/.test(attrs)) continue;
      if (/ld\+json/.test(attrs)) continue;
      if (!body.trim()) continue;
      hashes.add(`'sha256-${createHash('sha256').update(body, 'utf-8').digest('base64')}'`);
    }
  }
  return { hashes: [...hashes].sort(), pages };
}

// Self-hosted Umami. Must match ANALYTICS.origin in src/lib/profile.ts — the
// beacon needs script-src (to load /script.js) AND connect-src (it POSTs each
// pageview to /api/send). Miss either and it fails silently: no console error
// on the site, no data in the dashboard. check-build.mjs asserts the two agree.
const ANALYTICS_ORIGIN = 'https://stats.josephpire.dev';

function buildPolicy(hashes) {
  return [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'self'`,
    `form-action 'self'`,
    // 'wasm-unsafe-eval' is required by Pagefind, which runs its search index
    // through WebAssembly. It permits WASM compilation only — not eval().
    `script-src 'self' 'wasm-unsafe-eval' ${ANALYTICS_ORIGIN} ${hashes.join(' ')}`,
    // Unavoidable: the React components style themselves with inline style={{…}}
    // objects throughout. Far lower risk than inline script.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    // `data:` is required: Vite inlines the small @fontsource subsets (Instrument
    // Serif / Space Grotesk / JetBrains Mono) straight into Layout.*.css as
    // base64 data URIs. Verified by scripts/check-csp.mjs.
    `font-src 'self' data:`,
    // Web3Forms receives the /contact and /start form submissions (fetch POST).
    `connect-src 'self' https://api.web3forms.com ${ANALYTICS_ORIGIN}`,
    // The Cal.com booking widget on /book is embedded in an iframe.
    `frame-src https://cal.com https://app.cal.com`,
    `manifest-src 'self'`,
    `worker-src 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

if (!existsSync(HEADERS)) {
  console.error(`✗ ${HEADERS} not found — did the build run and is public/_headers present?`);
  process.exit(1);
}

const { hashes, pages } = await collectHashes();
if (hashes.length === 0) {
  console.error('✗ no inline scripts found — refusing to ship a policy that would break hydration');
  process.exit(1);
}

const policy = buildPolicy(hashes);
const headers = readFileSync(HEADERS, 'utf-8');
const MARKER = '  # {{CSP}}';

if (!headers.includes(MARKER)) {
  console.error(`✗ marker "${MARKER.trim()}" missing from public/_headers — cannot inject the CSP`);
  process.exit(1);
}

writeFileSync(HEADERS, headers.replace(MARKER, `  Content-Security-Policy: ${policy}`), 'utf-8');
console.log(`✓ CSP injected into dist/_headers — ${hashes.length} inline-script hashes from ${pages} pages`);
