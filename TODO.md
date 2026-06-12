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
  - [ ] `PROFILE.bookingUrl` → your real Cal.com / Calendly link
  - [ ] `STARTED_AT`, `PROJECT_COUNT`, `CLIENT_COUNT` → real-ish numbers (years is auto-computed)
  - [ ] `AVAILABILITY.status` + `nextSlotIso` → real status
  - [ ] `AVAILABILITY.lastUpdatedIso` → bump every time you tweak status
- [ ] **`src/lib/testimonials.ts`** — collect 2-3 real quotes, set `placeholder: false`. Until then the placeholder banner shows. Suggested outreach script:
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

- [ ] **Plausible self-hosted** — add it to the VPS (per your own blog post), configure `josephpire.dev` site, paste the script tag in `Layout.astro` head.
- [ ] **Google Search Console** — verify ownership via DNS TXT, submit `sitemap-index.xml`.
- [ ] **Bing Webmaster Tools** — same (Bing is small but free CTR).
- [x] **IndexNow** — key generated (`873a5f9649e0286de0fe2c8a5d59b424`), saved at `public/873a5f9649e0286de0fe2c8a5d59b424.txt`, embedded in `scripts/indexnow.mjs`. Run `npm run build && npm run indexnow` after each deploy. Key can be rotated via the `INDEXNOW_KEY` env var.

## P2 — More content

SEO weight compounds. Two more posts per quarter is the minimum to keep the blog alive.

- [ ] Draft 3 more blog post topics in `src/content/blog/_template.md` style:
  - [ ] "Drizzle vs Prisma in production: 12 months later"
  - [ ] "I stopped using shadcn/ui — here's what I do instead"
  - [ ] "Self-hosting Plausible on a 5€ VPS: end-to-end"
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
- [ ] **Service worker** — basic offline support since the manifest is already there. (Astro PWA integration; deferred.)
- [x] **`Speakable` schema** on blog `Article` for voice-assistant readout.
- [x] **`BreadcrumbList` on listing pages** — added on `/blog`, `/portfolio` and legal pages.
- [x] **Critical CSS inline** — `inlineStylesheets: 'auto'` is Astro's default; now set explicitly in `astro.config.mjs`.

## P3 — Outreach & authority

- [x] **`/press` page** — bio (3 lengths: 30/100/300 words), copy-to-clipboard buttons, fact sheet, asset request flow. Headshots/logos to drop in `public/press/` when ready.
- [ ] **Open-source the hero generator** — `scripts/generate-blog-heroes.mjs` is a nice tiny tool. Extract it into its own repo with a README and a couple of demo gifs.
- [ ] **Public roadmap** — `/roadmap` listing what's coming on each side project. Public commitment = pressure to ship.
- [ ] **Talks / podcasts** — if you do any, add a `/speaking` page with `Event` schema.

## P4 — Nice-to-haves

- [ ] **Cookie banner** — only if you add analytics that drop cookies. Plausible doesn't, so skip until then.
- [x] **Theme system preference** — `prefers-color-scheme: light` fallback added in `Layout.astro` inline script + `getTheme()` in `src/lib/i18n.ts`; saved `jp-theme` still wins.
- [ ] **Keyboard shortcut overlay** — `?` key opens a panel listing ⌘K, `/`, ESC, etc.
- [ ] **Search-as-you-type on `/404.astro`** — embed Pagefind so a wrong URL still recovers.
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
