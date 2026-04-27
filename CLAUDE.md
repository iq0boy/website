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
