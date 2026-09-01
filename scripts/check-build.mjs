// Post-build sanity check. Fails CI if expected outputs are missing.
// Add to this list whenever you commit a feature that ships a build artifact.

import { existsSync, statSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'dist');

const REQUIRED_FILES = [
  'index.html',
  '404.html',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'rss.xml',
  'robots.txt',
  'manifest.webmanifest',
  'rss-styles.xsl',
  'og.png',
  'pagefind/pagefind.js',
  'en/index.html',
  'nl/index.html',
];

const REQUIRED_DIRS = ['pagefind/fragment', 'pagefind/index', '_astro'];

// The CSP is written into _headers by scripts/generate-csp.mjs. If the marker
// silently stopped matching, the site would ship with no policy at all — and
// nothing else in the pipeline would notice.
function checkCsp() {
  const headers = resolve(ROOT, '_headers');
  if (!existsSync(headers)) return ['_headers is missing from dist/'];
  const csp = readFileSync(headers, 'utf-8').match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1];
  if (!csp) return ['no Content-Security-Policy in dist/_headers — did generate-csp.mjs run?'];
  if (csp.includes('{{CSP}}')) return ['CSP marker was never substituted'];
  const problems = [];
  const hashes = (csp.match(/'sha256-/g) ?? []).length;
  // 7 inline scripts as of the Astro 6 hydration runtime; a sharp drop means the
  // scanner stopped matching and hydration would break in the browser.
  if (hashes < 5) problems.push(`only ${hashes} inline-script hashes in the CSP — expected ~7`);
  if (/script-src[^;]*'unsafe-inline'/.test(csp)) problems.push("script-src regressed to 'unsafe-inline'");
  if (!/'wasm-unsafe-eval'/.test(csp)) problems.push("script-src lost 'wasm-unsafe-eval' — Pagefind search would break");
  if (!/font-src[^;]*data:/.test(csp)) problems.push('font-src lost `data:` — inlined @fontsource faces would be blocked');
  if (!problems.length) console.log(`✓ Content-Security-Policy (${hashes} script hashes)`);
  return problems;
}

let failures = 0;

for (const file of REQUIRED_FILES) {
  const full = resolve(ROOT, file);
  if (!existsSync(full)) {
    console.error(`✗ Missing required file: ${file}`);
    failures++;
    continue;
  }
  const size = statSync(full).size;
  if (size === 0) {
    console.error(`✗ Empty file (size 0): ${file}`);
    failures++;
    continue;
  }
  console.log(`✓ ${file} (${(size / 1024).toFixed(1)} kB)`);
}

for (const dir of REQUIRED_DIRS) {
  const full = resolve(ROOT, dir);
  if (!existsSync(full)) {
    console.error(`✗ Missing required dir: ${dir}`);
    failures++;
  } else {
    console.log(`✓ ${dir}/`);
  }
}

for (const problem of checkCsp()) {
  console.error(`✗ CSP: ${problem}`);
  failures++;
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll required build artifacts present.');
