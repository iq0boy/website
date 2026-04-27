---
title: "Wwom — SMS Campaigns for Salons"
excerpt: "B2B application for SMS campaign management and promotional code validation for hair and beauty salons, with a per-venue dashboard."
category: "Web App"
tags: ["Nuxt", "Vue", "Strapi", "MongoDB", "Tailwind", "OVH SMS", "PWA"]
year: "2023"
color: "oklch(0.26 0.10 310)"
---

Wwom is a B2B application that lets hair and beauty salons create, send, and track SMS marketing campaigns, and manage promotional codes for validation at the till.

## Architecture

```
Nuxt 2 (front)          Strapi 3 (back)
     │                       │
     ├── @nuxtjs/auth-next    ├── strapi-connector-mongoose (MongoDB)
     ├── @nuxtjs/axios        ├── strapi-plugin-users-permissions (JWT)
     ├── Vuex                 ├── ovh (OVH SMS API)
     └── Tailwind CSS         └── Auto-generated REST API
```

Each salon has its own workspace: campaigns are filtered by salon ID (`/salons/:id/campaigns`). Authentication uses Strapi's built-in JWT system, managed on the front end by `@nuxtjs/auth-next`.

## SMS Campaign Management

The main interface lists the campaigns for the logged-in salon, with individual or bulk create, update, and delete. Each campaign includes an SMS delivery report fetched from the OVH API, and a configurable number of visits required before the campaign triggers.

## Code Validation

A dedicated page lets salon staff enter a promotional code and instantly see its status:

- **To check** — unknown or pending code
- **Valid code** — active code, marked as used upon confirmation
- **Used code** — code already redeemed

The result is shown visually with an open/closed padlock icon and a green/red colour scheme.

## PWA

The application is configured as a **Progressive Web App** via `@nuxtjs/pwa`, installable on a till tablet without going through an app store.
