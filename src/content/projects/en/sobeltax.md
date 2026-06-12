---
title: 'Sobeltax — Vehicle Rental Platform'
excerpt: 'SSR web application for vehicle rentals in Belgium: multi-step booking flow, geolocated agency search, and a full customer dashboard.'
category: 'Web App'
tags:
  ['Astro', 'Svelte', 'Fastify', 'TypeScript', 'OpenLayers', 'Redis', 'Docker']
year: '2025'
color: 'oklch(0.28 0.10 155)'
liveUrl: 'https://sobeltaxrental.be'
updatedDate: 2026-06-12
---

Sobeltax is a vehicle rental platform targeting the Belgian market, available in French, Dutch and English. The challenge was delivering a smooth booking flow, multi-agency management with map-based search, and a full customer area — without relying on a monolithic framework.

![Sobeltax homepage with the booking widget and featured fleet](../../../assets/projects/sobeltax/home.png)

## The problem

The previous site ran on a legacy stack (WebDev-generated `.awp` pages): hard to evolve, impossible to align with the brand, and with no real online booking flow. The business data — fleet, availability, agencies, customer accounts — already lived in the internal platform at `platform.sobeltaxrental.be`. The new site therefore had to be a pure front-end: zero local database, every read and write going through the platform's API.

## Constraints

- **No local database.** The business platform stays the single source of truth; the site consumes its API for everything: availability, agencies, bookings, the customer area.
- **An API that predates the site.** It wasn't designed for this front-end — some data (vehicle families and categories in particular) arrives incomplete and needs client-side mapping.
- **Three languages from day one** — `fr`, `nl`, `en`, for the Belgian market.
- **Delegated authentication**: sessions on the site side, tokens refreshed against the platform API through a dedicated middleware.
- **Payment via callbacks** from an external provider, integrated into the funnel without breaking its state.

## Architecture

The application is built with **Astro 5 in SSR mode** using the Node.js adapter, served by **Fastify 5** as the HTTP runtime. Interactive components are **Svelte 5** islands: each page ships only the JavaScript for the components it actually uses, with no global bundle. This directly improves Time to Interactive, especially on mobile.

```
Fastify 5 (server.js)
    │
    ├── Middlewares: CORS, Helmet, static files
    │
    └── Astro SSR runtime
            ├── .astro pages (server-rendered)
            ├── Svelte islands (targeted interactivity)
            └── API routes (actions, payment callbacks)
```

**Redis** caches vehicle availability data and agency information to avoid repeated calls to third-party services on every request.

## 5-Step Booking Flow

The core of the application is a guided reservation process:

1. **Dates & agency** — selection via Pikaday and the OpenLayers map
2. **Vehicle category** — dynamic filtering based on real availability
3. **Details** — driver information, additional options
4. **Insurance** — coverage selection and validation
5. **Confirmation** — summary and payment trigger

The booking state is persisted client-side with **Nanostores**, so users can navigate between steps without losing entered data, even after a page reload.

![Sobeltax fleet catalogue showing the Compact, Large and Full Size with tailgate categories](../../../assets/projects/sobeltax/fleet.png)

## Geolocated Agency Search

The agencies page integrates **OpenLayers 10** to display the network on an interactive map. Search works by name or address; the agency list synchronises with the map state in real time. OpenLayers was chosen as an open source alternative to Google Maps — no quota, no API cost.

![OpenLayers interactive map showing the Sobeltax agency network across Belgium](../../../assets/projects/sobeltax/agencies.png)

## Belgian Multi-Language

i18n routing follows the Astro pattern: `/` for French (default locale, no prefix), `/nl/` and `/en/` for Dutch and English. The `fr-BE` and `nl-BE` locales are declared in the sitemap and meta tags for date and currency formats adapted to the local market.

## Deployment

The application runs on **Docker Swarm** with a dedicated production Compose file. The Fastify server listens on port 3000 behind a reverse proxy. A multi-stage build separates dev dependencies from production artefacts, keeping the final image lean.

## What it shipped with

- 66 pages and 53 components, across 3 locales
- 5-step booking funnel, full customer area, 14 mapped agencies, 10 vehicle families
- Around 560 commits over 17 months (January 2025 → May 2026) — the project is in production and still actively maintained
- Redis sessions with a 7-day TTL, server-side availability caching

## Lessons

- **An API you don't control gets coded defensively.** Token refresh produced its share of edge cases, and the API's incomplete data forced a hardcoded vehicle-category mapping on the front-end — a workable trade-off, but one that has to be maintained every time the fleet changes.
- **Validate early, against real cases.** Belgian VAT number validation generated several after-the-fact fixes; realistic test data from the start would have been cheaper.
- **Redis between the SSR and the API changes everything.** The availability cache keeps pages fast even when the upstream platform is slow — on an SSR site backed by a third-party API, that's the difference between a snappy site and one that inherits everyone else's latency.

