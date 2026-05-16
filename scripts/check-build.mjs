// Post-build sanity check. Fails CI if expected outputs are missing.
// Add to this list whenever you commit a feature that ships a build artifact.

import { existsSync, statSync } from 'node:fs';
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

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll required build artifacts present.');
