---
title: "Carder — NFC Business Card Platform"
excerpt: "Multi-tenant NFC business card platform: per-client customised pages, 20+ link types, badge system, installable PWA, and custom analytics."
category: "Web App"
tags: ["Astro", "React", "Astro DB", "Drizzle ORM", "Tailwind", "DaisyUI", "Docker"]
year: "2025"
color: "oklch(0.24 0.09 265)"
liveUrl: "https://nsmobile6k.be"
---

Carder is a multi-tenant SaaS platform for NFC business cards, deployed at `nsmobile6k.be` and `techcard.be`. Each client gets a fully customised `/users/[slug]` page — logo, colours, links, badges — accessible with a single tap on any NFC-enabled smartphone.

## Architecture

The application is built with **Astro 5 SSR** using the standalone Node.js adapter. The database is **Astro DB** (hosted SQLite via libSQL), queried with **Drizzle ORM**. Interactive components are **React 19**; the UI uses **Tailwind + DaisyUI** for base theming and inline CSS variables for per-card colours.

```
Node.js (entry.mjs)
    │
    └── Astro SSR runtime
            ├── Public pages     (/users/[slug], /users/[slug]/badges/[id])
            ├── User dashboard   (/cards, /profile)
            ├── Admin panel      (/admin/cards, /admin/access)
            └── Astro Actions    (CRUD for cards, links, badges, auth)
```

Sessions use Astro's experimental `fs-lite` driver, persisted in a dedicated Docker volume.

## Per-card Customisation

Each card exposes a set of configurable properties:

- **Colours** — card background, text, logo background, link colours: all injected as inline styles for accurate per-client rendering without global CSS overrides.
- **DaisyUI theme** — applied via `data-theme` for per-client light/dark mode.
- **Border radius** — `rounded` or `square` style driven by the `theme` field.

## Link System

A card can display up to **8 links** arranged in a 2-column grid. Each link has one of 20+ types: phone, WhatsApp, Instagram, TikTok, Google Maps, Google reviews, menus, online ordering, calendar, forms, and more. The `size` property (`small` / `large`) controls whether the link spans 1 or 2 columns.

## Badges

Badges are visual buttons tied to an image or logo, with an optional URL or a dedicated sub-page at `/users/[slug]/badges/[id]`. They let clients showcase certifications, promotions, or media content directly on their card.

## Installable PWA

Each card page dynamically generates an inline **Web App Manifest** — `id`, `start_url`, `scope`, theme colours and icons are all computed from the card's database record. End users can add the card to their home screen without going through any app store, displayed in `fullscreen` mode.

## Custom Analytics

Page views and clicks are tracked through an internal service (`holmes.nsmobile.be`). Every event — page load or link/badge click — fires a `POST /api/hits/[slug]/[action]`. No cookies, no third-party dependencies.

## Deployment

The application runs on **Docker Compose** behind a **Caddy** reverse proxy (configured via container labels). Two volumes are mounted: `data/` for sessions and the local SQLite database, and `dist/client/assets/cards/` for card assets (logos, badges) persisted across image rebuilds.
