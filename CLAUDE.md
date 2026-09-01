# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at localhost:4321
npm run build      # Build to ./dist/
npm run preview    # Preview the production build
npm run astro      # Run Astro CLI (e.g. npm run astro check)
```

No test runner is configured. Type-check with `npm run astro check`.

## Architecture

This is a personal portfolio/freelance site for Joseph Pire, built with **Astro 6 + React 19**.

### i18n routing

Three locales: `fr` (default), `en`, `nl`. French routes have no prefix (`/`, `/services`, `/blog`…); English and Dutch are prefixed (`/en/`, `/nl/`).

- Root pages in `src/pages/` serve French.
- `src/pages/[lang]/` mirrors every route for `en` and `nl` via `getStaticPaths()`.
- `localePath(lang, path)` in `src/lib/i18n.ts` generates the correct href for a given locale.

### Page pattern

Astro page files are thin shells. They import a React `*Content` component from `src/components/pages/` and pass `lang` as a prop with `client:load`. All rendering logic lives in those React components.

```astro
<!-- src/pages/services.astro -->
<Layout ... lang="fr">
  <ServicesContent lang="fr" client:load />
</Layout>
```

### Translations

All UI strings live in a single `TRANSLATIONS` object in `src/lib/i18n.ts`, keyed by locale then flat string key. Use the `useLang(lang)` hook inside React components:

```ts
const { t } = useLang(lang);   // t('nav_home') → 'Accueil' | 'Home' | 'Home'
```

When adding new UI text, add all three locale entries to `TRANSLATIONS` in the same commit.

### Content collections

Blog posts and portfolio projects are Markdown files under `src/content/blog/{lang}/` and `src/content/projects/{lang}/`. Each locale subfolder holds the same filenames translated. Collections are defined in `src/content.config.ts`.

### Theming

Dark/light theme is stored in `localStorage` under the key `jp-theme` and applied as `data-theme="dark|light"` on `<html>`. An inline script in `Layout.astro` applies the saved theme before first paint to prevent flash. Use the `useTheme()` hook in React components; never read `localStorage` directly.

### Shared utilities in `src/lib/i18n.ts`

Beyond translations, this module also exports reusable React hooks:
- `useTheme()` — dark/light toggle
- `useReveal(threshold)` / `useRevealEffect()` — IntersectionObserver-based scroll reveal
- `useAnimatedCounter(end)` — count-up animation on scroll into view

### Content-Security-Policy

The CSP is **generated at build time**, not hand-written. `npm run build` runs
`scripts/generate-csp.mjs`, which scans `dist/**/*.html`, sha256-hashes every inline
`<script>`, and substitutes them into the `# {{CSP}}` marker in `public/_headers`.

This exists because the policy allowlists inline scripts **by hash instead of
`'unsafe-inline'`** — and four of those seven hashes belong to Astro's own hydration
bootstrappers (`client:load` / `client:idle` / `client:visible`). Hard-coding them
would mean total, silent JS breakage the next time Astro is upgraded.

Consequences to keep in mind:

- Don't hand-edit the `Content-Security-Policy` line in `public/_headers`; edit the
  directive list in `scripts/generate-csp.mjs`. Leave the `# {{CSP}}` marker alone —
  the build fails loudly if it disappears.
- `astro preview` does **not** apply `_headers`. To exercise the real policy locally:
  `node scripts/serve-csp.mjs 4399` then `node scripts/check-csp.mjs`.
- Adding any new third-party origin (analytics, embeds, fonts, a form endpoint)
  requires a matching directive, or it is blocked in production with no fallback.
  Currently allowed: Web3Forms and the Umami beacon in `connect-src`, the Umami
  beacon in `script-src`, Cal.com in `frame-src`.
- `check-build.mjs` extracts the origin of every `<script src="https://…">` in
  the built HTML and fails if one is missing from `script-src`. That is the
  drift worth catching automatically: a blocked beacon logs nothing on the site
  and simply produces an empty dashboard weeks later.
- `scripts/check-build.mjs` asserts the policy is present and hasn't regressed;
  CI additionally runs the browser smoke test.

### Analytics

Self-hosted Umami at `stats.josephpire.dev` (repo `iq0boy/umami`, deployed to the
VPS). Cookieless, so there is no consent banner to add. Config lives in
`ANALYTICS` in `src/lib/profile.ts`; the beacon is emitted from `Layout.astro`
for **production builds only**, so `astro dev` never pollutes the stats.

The origin is duplicated in `scripts/generate-csp.mjs` (`ANALYTICS_ORIGIN`) and
must stay in both `script-src` and `connect-src` — the tracker loads
`/script.js` and POSTs each pageview to `/api/send`. `check-build.mjs` fails the
build if the two ever disagree, and `check-csp.mjs` proves in a real browser
that the script loads and the send request is permitted (it stubs `/api/send`,
so running the check does not create fake pageviews).

### Environment variables

Copy `.env.example` to `.env` and fill in:
- `PUBLIC_WEB3FORMS_KEY` — Web3Forms access key used by `ContactSection.tsx` to submit the contact form. Public by design (domain-restricted on Web3Forms' side).
