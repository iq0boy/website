// Loads the built site through scripts/serve-csp.mjs (which applies the
// generated Content-Security-Policy) and walks the paths that depend on
// something the policy could plausibly block: the inline theme script, Astro's
// hydration bootstrappers, Pagefind's WebAssembly, the Cal.com iframe, and a
// View Transitions navigation. Fails on any CSP violation or JS error.
//
//   node scripts/generate-csp.mjs && node scripts/serve-csp.mjs 4399 &
//   node scripts/check-csp.mjs [baseUrl]

import { chromium } from 'playwright';

const BASE = process.argv[2] ?? process.env.CSP_BASE_URL ?? 'http://localhost:4399';
const violations = [];
const errors = [];
const failed = [];
const thirdParty = [];

// The /book page embeds the Cal.com booking widget. Everything inside that
// iframe is governed by Cal.com's own CSP and origin, not ours — its console
// noise (next-auth, Sentry, avatar loads) says nothing about this site's policy.
const THIRD_PARTY = /cal\.com|sentry\.io|googleusercontent\.com|next-auth/i;

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

page.on('console', m => {
  const t = m.text();
  const from = m.location()?.url ?? '';
  if (THIRD_PARTY.test(t) || THIRD_PARTY.test(from)) return void thirdParty.push(t.slice(0, 100));
  // The 404 probe below deliberately requests a missing page; its own 404 is expected.
  if (/status of 404/.test(t) && page.url().includes('definitely-not-a-page')) return;
  if (/Content Security Policy|Refused to/i.test(t)) violations.push(`[${page.url()}] ${t}`);
  else if (m.type() === 'error') errors.push(`[${page.url()}] ${t}`);
});
page.on('pageerror', e => {
  if (THIRD_PARTY.test(e.message)) return void thirdParty.push(e.message.slice(0, 100));
  errors.push(`[${page.url()}] pageerror: ${e.message}`);
});
page.on('requestfailed', r => {
  const u = r.url();
  if (THIRD_PARTY.test(u)) return void thirdParty.push(u.slice(0, 100));
  failed.push(`[${u}] ${r.failure()?.errorText}`);
});

const step = async (name, fn) => { console.log(`\n▶ ${name}`); await fn(); };

await step('home loads + hydrates', async () => {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const navReady = await page.locator('header, nav').first().isVisible();
  console.log('  nav visible:', navReady);
});

await step('theme toggle (inline script + localStorage)', async () => {
  const before = await page.getAttribute('html', 'data-theme');
  const btn = page.locator('[aria-label*="theme" i], [aria-label*="thème" i]').first();
  if (await btn.count()) { await btn.click(); await page.waitForTimeout(300); }
  const after = await page.getAttribute('html', 'data-theme');
  console.log(`  theme ${before} → ${after}`, before !== after ? '(toggled)' : '(unchanged)');
});

await step('Pagefind search — WASM under wasm-unsafe-eval', async () => {
  await page.keyboard.press('/');
  await page.waitForTimeout(600);
  const input = page.locator('input[type="search"], input[placeholder]').first();
  await input.fill('astro');
  await page.waitForTimeout(2500);
  const html = await page.content();
  const hits = (html.match(/pagefind|résultat|result/gi) || []).length;
  console.log('  search modal open:', await input.isVisible(), '| result markers:', hits);
  await page.keyboard.press('Escape');
});

await step('View Transitions navigation (script hashes after swap)', async () => {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.locator('a[href="/portfolio"], a[href="/blog"]').first().click();
  await page.waitForTimeout(1200);
  console.log('  now at:', page.url());
  await page.locator('a[href="/services"], a[href="/about"]').first().click();
  await page.waitForTimeout(1200);
  console.log('  now at:', page.url());
});

await step('shortcuts overlay (?)', async () => {
  await page.keyboard.press('?');
  await page.waitForTimeout(500);
  const vis = await page.locator('text=/Esc|⌘K/').first().isVisible().catch(() => false);
  console.log('  overlay visible:', vis);
  await page.keyboard.press('Escape');
});

for (const p of ['/book', '/contact', '/start', '/blog/building-this-website', '/portfolio/sobeltax', '/now', '/en/', '/nl/']) {
  await step(`page ${p}`, async () => {
    await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle' });
    console.log('  title:', (await page.title()).slice(0, 60));
  });
}

await step('404 + search recovery button', async () => {
  await page.goto(`${BASE}/definitely-not-a-page`, { waitUntil: 'networkidle' });
  const btn = page.locator('#search-404');
  if (await btn.count()) { await btn.click(); await page.waitForTimeout(800); console.log('  recovery clicked'); }
});

await browser.close();

console.log('\n' + '='.repeat(60));
console.log(`CSP VIOLATIONS: ${violations.length}`);
violations.forEach(v => console.log('  ✗', v.slice(0, 200)));
console.log(`JS ERRORS: ${errors.length}`);
errors.forEach(e => console.log('  ✗', e.slice(0, 200)));
console.log(`FAILED REQUESTS: ${failed.length}`);
failed.forEach(f => console.log('  ✗', f.slice(0, 200)));
console.log(`third-party iframe noise (ignored): ${thirdParty.length}`);
console.log('='.repeat(60));
process.exit(violations.length || errors.length || failed.length ? 1 : 0);
