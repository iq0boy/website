# TODO — josephpire.dev

Things to do on this site, grouped by urgency.
Edit ✅ in front of an item when done.
Last refreshed: 2026-05-15

---

## P0 — Legal (Belgium-required, do first)

- [x] **`/legal` page** — template shipped under `src/content/legal/<lang>/legal.md`. **Fill the `{{REPLACE_ME}}` placeholders**: legal name, BCE/KBO number, registered address, VAT number, hosting provider, court jurisdiction.
- [x] **`/privacy` page** — GDPR template shipped. **Fill** business name + BCE number in `src/content/legal/<lang>/privacy.md`.
- [x] **`/terms` page** — template shipped. **Fill** business name + jurisdiction in `src/content/legal/<lang>/terms.md`.
- [x] Footer links wired in all three locales.

## P1 — Replace placeholders with real data

These files exist; the data inside them is fake. Until you fix it, half the site is theatre.

- [ ] **`src/lib/profile.ts`**
  - [x] `PROFILE.bookingUrl` → real Cal.com link `https://cal.com/jpire/30min` (username `jpire`, looked up via the Cal.com API; only the public URL is stored, no key)
  - [ ] `STARTED_AT`, `PROJECT_COUNT`, `CLIENT_COUNT` → real-ish numbers (years is auto-computed)
  - [ ] `AVAILABILITY.status` + `nextSlotIso` → real status
  - [ ] `AVAILABILITY.lastUpdatedIso` → bump every time you tweak status
- [ ] **`src/lib/testimonials.ts`** — collect 2-3 real quotes. ⚠️ The three fake ones signed "Client Name" were **live in production** until 2026-09-01; the array is now empty and the whole section hides itself, so the site no longer shows invented quotes. Adding the first real quote brings the section back. Suggested outreach script:
  > "Quick favour: would you write 2 sentences about working with me? I'm refreshing my site. Anything honest is fine — I'd rather have real than glowing."
- [ ] **`src/lib/now-data.ts`** — replace the building / reading / learning / listening / saying-no-to entries with what's actually true. Bump `lastUpdatedIso`.
- [ ] **Client logos**
  - [ ] Get permission from past clients (or just use ones from publicly-shipped projects: Sobeltax, Altitude.Music, Eco-BBQ, Carder…)
  - [ ] Drop SVGs into `src/assets/logos/<slug>.svg` (or `.png` if SVG unavailable)
  - [ ] Add entries to `CLIENT_LOGOS` in `src/lib/profile.ts`
- [ ] **GitHub `sameAs` schema** — add LinkedIn / X URLs in `src/pages/index.astro` and `src/pages/[lang]/index.astro` (`sameAs` array).

## P1 — Portfolio depth

Carder is good. The other 7 are thin. Pick three to deepen.

- [x] **Sobeltax** — problem (legacy `.awp` site), constraints (API-first, no local DB), outcome (66 pages, 560 commits/17 months), lessons (defensive coding vs external API). ×3 locales.
- [x] **Altitude Music** — problem/constraints/outcome/lessons + new Sveltia CMS section (41 days, 11 tracks, hydration-boundary lesson). ×3 locales.
- [x] **Eco-BBQ** — v1→v2 rewrite story (79 commits/20+ layout fixes → 33-day rewrite, build −63%). Fixed testimonial count (8/language, not 14). ×3 locales.
- [x] For each, added `updatedDate: 2026-06-12` in frontmatter — verified `lastmod` appears in the built sitemap.

## P2 — Analytics & Search Console

- [x] **Umami self-hosted** — ✅ live at `https://stats.josephpire.dev` (2026-09-01). Swarm stack in the private repo `iq0boy/umami`, behind `caddy-docker-proxy`; whole stack idles at ~220 MB. Beacon wired in `Layout.astro` (production builds only) and allowed in `script-src` + `connect-src`; verified in a browser that it loads and sends. ⚠️ The rationale I first gave was wrong: the VPS has **15 GB RAM / 8 vCPU**, not the "5 €" box the blog post claims, so Plausible would have fit. Umami was kept for simplicity (one datastore, ~28 containers already on the machine), not necessity.
- [ ] ~~Umami self-hosted~~ (decided 2026-09-01, replaces Plausible) — Plausible CE needs PostgreSQL **and ClickHouse**, and ClickHouse alone wants ~700 MB idle / ~2 GB recommended. Putting that on the 5 € VPS that already serves `holmes.nsmobile.be` risks OOM-killing a client-facing app to count portfolio pageviews. Umami is Node + Postgres only, cookieless and GDPR-clean, ~10× lighter. Steps: deploy on the VPS behind Caddy → add the beacon to `Layout.astro` → **add its origin to `script-src` + `connect-src` in `scripts/generate-csp.mjs`** (otherwise the beacon is silently blocked in production) → re-run `scripts/check-csp.mjs`.
- [ ] ~~Plausible self-hosted~~ — rejected on resource grounds, see above. Plausible Cloud (9 €/mo, EU-hosted) stays the fallback if self-hosting turns into a maintenance burden.
- [ ] **Google Search Console** — verify ownership via DNS TXT, submit `sitemap-index.xml`.
- [ ] **Bing Webmaster Tools** — same (Bing is small but free CTR).
- [x] **IndexNow** — key generated (`873a5f9649e0286de0fe2c8a5d59b424`), saved at `public/873a5f9649e0286de0fe2c8a5d59b424.txt`, embedded in `scripts/indexnow.mjs`. Run `npm run build && npm run indexnow` after each deploy. Key can be rotated via the `INDEXNOW_KEY` env var.

## P2 — More content

SEO weight compounds. Two more posts per quarter is the minimum to keep the blog alive.

- [x] Draft more blog post topics in `src/content/blog/_template.md` style — **written as `draft: true` ×3 locales, awaiting your factual review before flipping to `draft: false`**:
  - [x] "Drizzle vs Prisma in production: 12 months later" — grounded in carder/booker (Drizzle) vs reporter (Prisma 5 + Postgres)
  - [x] ~~"I stopped using shadcn/ui"~~ — **removed at your request** (replaced by the Claude Code post below)
  - [ ] ~~"Self-hosting Plausible on a 5€ VPS: end-to-end"~~ — **unpublished 2026-09-01** (`draft: true` ×3 locales). It was published on 2026-06-12 describing, in the first person, an install that never happened ("voici l'installation complète sur le VPS…", "surveille `docker stats` la première semaine", "sur 8 Go tout passe" — for a 5 € box). Its ~3 months of indexed URLs now 302 to `/blog` via `public/_redirects`. **Replacement to write from the real Umami install**: "I wanted Plausible on a 5 € VPS, ClickHouse didn't fit, I shipped Umami" — a better post than the tutorial it replaces, and true. Repoint the three redirects when it ships.
  - [x] "Claude Code, level 2: MCP, skills, and persistent memory" — follow-up to the existing `claude-code-workflow` post; covers MCP servers, skills, memory/handoffs, sub-agents. Grounded in this session's real usage (Obsidian MCP, Explore agents mining client repos, chrome-devtools screenshots). Cross-links the original.
  - [x] (infra) `draft: true` posts are now excluded from build/RSS/search in production, visible in `npm run dev`
- [ ] **`/cv` page** — HTML version + downloadable `/cv.pdf` (drop the file into `public/`). `PROFILE.cvUrl` already wired.
- [ ] Cross-publish each new post to **dev.to** and **Hashnode** with canonical pointing back to `josephpire.dev`.

## P2 — Conversion polish

- [ ] **Newsletter** (Buttondown or Beehiiv). Card at bottom of each blog post.
- [ ] **Lead-magnet PDF** — e.g. "Project kickoff checklist for Belgian founders". Email-gated.
- [x] **`/start` form** — structured intake (timeline / budget band / stack / role) posting to Web3Forms. Pre-qualifies leads before the Cal.com call.

## P3 — Technical polish

- [x] **CI workflow** (.github/workflows/ci.yml): `astro check`, `astro build`, Pagefind sanity check on every PR, custom artifact-presence check.
- [x] **Lighthouse budget in CI** — `@lhci/cli` + `lighthouserc.json`: 4 URLs × 3 runs against `dist/`, fails on median LCP > 2.5s or CLS > 0.1 (desktop preset), warns under 0.9 perf score. Baseline 2026-06-12: LCP ~520-575ms, CLS 0.000, perf 1.00. Run locally with `CHROME_PATH=/usr/bin/chromium npm run lhci`. Reports uploaded as CI artifact.
- [x] **`_headers` file** for Cloudflare/Netlify — long-cache for `/_astro/*`, OG images, manifest; short cache for HTML.
- [x] **Per-locale OG images** — small `FR`/`EN`/`NL` chip in the top-right of the Satori output.
- [x] **EN/NL fallback** — when a translation is missing, the page is generated with FR content + `canonical` and `availableLocales` set to FR only.
- [x] **Per-locale RSS feeds** — `/en/rss.xml` and `/nl/rss.xml` now generated; `Layout` emits per-locale `<link rel="alternate">`.
- [x] **Service worker** — `public/sw.js` + `public/offline.html`, registered prod-only from `Layout.astro`. Conservative strategy (no stale-HTML risk): HTML = network-first → cache → offline page; `/_astro/*` + fonts = cache-first; images = stale-while-revalidate; everything else passes through. Verified offline/online end-to-end with Playwright `setOffline`. Bump `VERSION` in sw.js to invalidate caches on a breaking deploy.
- [x] **`Speakable` schema** on blog `Article` for voice-assistant readout.
- [x] **`BreadcrumbList` on listing pages** — added on `/blog`, `/portfolio` and legal pages.
- [x] **Critical CSS inline** — `inlineStylesheets: 'auto'` is Astro's default; now set explicitly in `astro.config.mjs`.
- [x] **Content-Security-Policy** — generated at build time by `scripts/generate-csp.mjs` and injected into `_headers`. Allowlists inline scripts **by sha256 hash, not `'unsafe-inline'`** (7 hashes, 4 of them Astro's hydration bootstrappers — hence generated, so an Astro upgrade can't silently break hydration). Carries `'wasm-unsafe-eval'` for Pagefind, `font-src data:` for the Vite-inlined @fontsource faces, Web3Forms in `connect-src`, Cal.com in `frame-src`. Verified in a real browser with `scripts/check-csp.mjs` (0 violations across home / search+WASM / View Transitions / `/book` / 404 / all 3 locales); guarded by `check-build.mjs` + a CI smoke test. Local: `node scripts/serve-csp.mjs 4399 && node scripts/check-csp.mjs`.

## P3 — Outreach & authority

- [x] **`/press` page** — bio (3 lengths: 30/100/300 words), copy-to-clipboard buttons, fact sheet, asset request flow. Headshots/logos to drop in `public/press/` when ready.
- [ ] **Open-source the hero generator** — `scripts/generate-blog-heroes.mjs` is a nice tiny tool. Extract it into its own repo with a README and a couple of demo gifs.
- [ ] **Public roadmap** — `/roadmap` listing what's coming on each side project. Public commitment = pressure to ship.
- [ ] **Talks / podcasts** — if you do any, add a `/speaking` page with `Event` schema.

## P4 — Nice-to-haves

- [ ] **Cookie banner** — only if you add analytics that drop cookies. Plausible doesn't, so skip until then.
- [x] **Theme system preference** — `prefers-color-scheme: light` fallback added in `Layout.astro` inline script + `getTheme()` in `src/lib/i18n.ts`; saved `jp-theme` still wins.
- [x] **Keyboard shortcut overlay** — `?` opens `ShortcutsOverlay.tsx` (global island, i18n) listing ⌘K / `/` (search), Esc (close), `?` (this panel). Verified: `?` opens, Esc closes, `/` still opens search (no conflict).
- [x] **Search-as-you-type on `/404.astro`** — added a "Rechercher sur le site (⌘K)" button that reuses the globally-mounted SearchModal via `window.__jpOpenSearch()`. Verified end-to-end: 404 → click → Pagefind modal → real results.
- [ ] **Hero animation** on home — micro-interaction that's identifiably yours.

---

## Done since this site rebuild

(Just for memory — these are shipped.)

- ✅ Astro 6 + React 19 + i18n (FR/EN/NL)
- ✅ SEO foundation: sitemap with hreflang, canonical, `WebSite` / `Person` / `ProfessionalService` / `Article` / `FAQPage` / `CreativeWork` / `BreadcrumbList` JSON-LD
- ✅ RSS feed with branded XSL stylesheet
- ✅ 404 page
- ✅ `manifest.webmanifest`
- ✅ Self-hosted fonts (`@fontsource`)
- ✅ Image optimization for project + blog hero images (PNGs → WebP, intrinsic dims)
- ✅ View Transitions
- ✅ Pagefind search (⌘K modal)
- ✅ Reading progress + table of contents on blog
- ✅ Related posts / projects
- ✅ Testimonials section with placeholder/real flag
- ✅ Per-post OG images (Satori) + branded hero images (Satori script)
- ✅ `/uses` page
- ✅ `/about` page
- ✅ `/now` page (data-driven)
- ✅ `/collaborate` page (for agencies / sub-contracting)
- ✅ `/book` page with Cal.com iframe
- ✅ Live availability badge (compact + card variants)
- ✅ Pricing bands on `/services`
- ✅ Nav CTA "Book a call"
- ✅ Footer with all new pages linked
- ✅ Client logos band (auto-hides until populated)
- ✅ GitHub activity widget (build-time fetch, silent fallback)
- ✅ Computed stats (no more fake numbers)
- ✅ 3 blog posts × 3 locales = 9 posts published
- ✅ CI workflow + build-artifact verification script
- ✅ `_headers` file (cache + security headers for static hosts)
- ✅ IndexNow ping script
- ✅ Per-locale OG image chip
- ✅ Per-locale RSS feeds
- ✅ `Speakable` schema on blog Articles
- ✅ `BreadcrumbList` on listing pages
- ✅ EN/NL fallback for missing translations (FR content + canonical to FR)
- ✅ `/press` page with copy-to-clipboard bios + fact sheet
- ✅ `/start` structured intake form
- ✅ Legal templates: `/legal`, `/privacy`, `/terms` × 3 locales
- ✅ Footer legal sub-row
