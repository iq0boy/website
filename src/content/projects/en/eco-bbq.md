---
title: 'Eco-BBQ — Disposable Eco-BBQ Marketing Site'
excerpt: 'Trilingual marketing and lead-generation site for a zero-waste disposable BBQ kit: Astro + Svelte islands, Swiper carousels, OpenLayers retailer map, and a B2B distributor partnership flow.'
category: 'Web App'
tags: ['Astro', 'Svelte', 'Tailwind', 'DaisyUI', 'OpenLayers', 'Swiper', 'TypeScript']
year: '2025'
color: 'oklch(0.30 0.08 145)'
liveUrl: 'https://www.eco-bbq.eu/'
updatedDate: 2026-06-12
---

Eco-BBQ is a disposable, zero-waste barbecue kit distributed across Belgium, France, Spain and Portugal. The site is both a consumer storefront (how it works, where to buy) and a B2B funnel for retailers who want to stock the product. Three locales, fully static, hosted on Combell.

![Eco-BBQ hero with the product kit and three feature pills: fast, zero-waste, simple](../../../assets/projects/eco-bbq-v2/hero.png)

## The problem

This site is a v2 — and v1 is the real lesson of the project. The first version had piled up 79 commits over two months: GSAP animations everywhere, a "story" page, a third-party Svelte carousel… and more than twenty layout and overflow fixes caused by that complexity. The build weighed 30 MB for a landing page. Rather than keep patching, the site was rewritten from scratch on a deliberately simpler base.

## Constraints

- **Combell shared hosting**: static only, no server, no host-side build.
- **Capture leads without a backend** — consumer contact and B2B retailer applications.
- **Three locales with translated slugs** (`/fr/partenariat`, `/en/partnership`, `/nl/partnerschap`).
- **A short rewrite**: v2 had to ship fast to avoid stalling the client a second time.

## Architecture

Astro 5 in fully static mode with Tailwind and DaisyUI for the design system. Most of the page is server-rendered `.astro` components shipping zero JavaScript; the only hydrated island is the **Svelte 5** retailer map, which would be wasteful to bundle for every visitor that scrolls past it.

```
.astro components       →  Navbar, Hero, Features, How-it-works, Testimonials, Footer
Svelte 5 island         →  OpenLayers retailer map (Map.svelte)
Swiper 11 vanilla       →  Hero carousel + testimonial carousel
```

Swiper is loaded as a standalone bundle for the two carousels rather than wrapped in a framework — keeps the runtime cost minimal and avoids dragging React or Vue in just to drive a slider.

## How It Works

The "how it works" section combines an embedded YouTube explainer with a 4-step pictogram strip. Content (titles, descriptions, illustrations) is sourced from `src/i18n/translatedContent/*.js` modules so editing copy doesn't require touching markup.

![Comment ça marche — YouTube explainer and 4-step pictograms](../../../assets/projects/eco-bbq-v2/how.png)

## Testimonials

Eight real customer testimonials per language are rendered as a static grid on desktop and as a Swiper-driven carousel on mobile. Each card is purely server-rendered HTML; the carousel JS only attaches under the mobile breakpoint, so desktop visitors pay nothing for it.

![Testimonial grid — real customer quotes with names](../../../assets/projects/eco-bbq-v2/testimonials.png)

## Retailer Map

The "Nous trouver" section uses **OpenLayers 8** to plot the retailer network on an interactive map, with a searchable list synced to the map state. OpenLayers was picked over Google Maps to keep the map free of API quotas and tracking cookies — the site never asks for cookie consent because it doesn't load any third-party tracker on the homepage.

![Find a retailer — partner logos, searchable list, and an OpenLayers map of the network](../../../assets/projects/eco-bbq-v2/find-us.png)

## i18n & Partnership Flow

Three locales (`fr`, `en`, `nl`) with the French prefix kept (`/fr/`, not the root) so the URL structure is uniform. Route slugs are translated per locale — `/fr/partenariat`, `/en/partnership`, `/nl/partnerschap` — handled by a `[lang]/[partnership].astro` dynamic page with a Formspree-backed B2B form. The sitemap integration auto-generates per-locale entries.

## Hosting

Static build pushed to **Combell** shared hosting. No server, no database, no API — the contact form goes to Formspree and the partnership form to a separate Formspree endpoint, so the site can stay on cheap static infrastructure while still capturing leads.

## What it shipped with

- Full rewrite in 33 days and 35 commits (December 21, 2024 → January 23, 2025)
- Build size cut by almost two thirds: 30 MB → 11 MB (−63%)
- 7 HTML pages across 3 locales, 61 points of sale on the map, 8 testimonials per language, 9 partner logos
- Two Formspree lead funnels: consumer contact and B2B partnership

## Lessons

- **Rewriting was cheaper than patching.** V1 kept accumulating layout fixes caused by its animations; v2 drops GSAP, the "story" page and the third-party carousel — the bugs disappeared along with the complexity.
- **One hydrated island is enough.** Only the retailer map earns framework JavaScript; everything else is static HTML. Every piece of interactivity has to justify its place.
- **Fewer libraries, fewer integration bugs.** Standalone Swiper replaces the third-party Svelte carousel that caused trouble in v1 — one battle-tested dependency instead of two fragile ones.
