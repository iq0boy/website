---
title: "Sobeltax — Vehicle Rental Platform"
excerpt: "SSR web application for vehicle rentals in Belgium: multi-step booking flow, geolocated agency search, and a full customer dashboard."
category: "Web App"
tags: ["Astro", "Svelte", "Fastify", "TypeScript", "OpenLayers", "Redis", "Docker"]
year: "2025"
color: "oklch(0.28 0.10 155)"
liveUrl: "https://sobeltax.nsmobile.be"
---

Sobeltax is a vehicle rental platform targeting the Belgian market, available in French, Dutch and English. The challenge was delivering a smooth booking flow, multi-agency management with map-based search, and a full customer area — without relying on a monolithic framework.

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

## Geolocated Agency Search

The agencies page integrates **OpenLayers 10** to display the network on an interactive map. Search works by name or address; the agency list synchronises with the map state in real time. OpenLayers was chosen as an open source alternative to Google Maps — no quota, no API cost.

## Belgian Multi-Language

i18n routing follows the Astro pattern: `/` for French (default locale, no prefix), `/nl/` and `/en/` for Dutch and English. The `fr-BE` and `nl-BE` locales are declared in the sitemap and meta tags for date and currency formats adapted to the local market.

## Deployment

The application runs on **Docker Swarm** with a dedicated production Compose file. The Fastify server listens on port 3000 behind a reverse proxy. A multi-stage build separates dev dependencies from production artefacts, keeping the final image lean.
