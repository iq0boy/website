---
title: "Carder — NFC Visitekaartjesplatform"
excerpt: "Multi-tenant NFC-visitekaartjesplatform: gepersonaliseerde pagina's per klant, 20+ linktypes, badgesysteem, installeerbare PWA en eigen analytics."
category: "Web App"
tags: ["Astro", "React", "Astro DB", "Drizzle ORM", "Tailwind", "DaisyUI", "Docker"]
year: "2025"
color: "oklch(0.24 0.09 265)"
liveUrl: "https://nsmobile6k.be"
---

Carder is een multi-tenant SaaS-platform voor NFC-visitekaartjes, beschikbaar op `nsmobile6k.be` en `techcard.be`. Elke klant krijgt een volledig gepersonaliseerde `/users/[slug]`-pagina — logo, kleuren, links, badges — toegankelijk met één tik op een NFC-smartphone.

## Architectuur

De applicatie is gebouwd met **Astro 5 SSR** en de standalone Node.js-adapter. De database is **Astro DB** (gehoste SQLite via libSQL), bevraagd met **Drizzle ORM**. Interactieve componenten zijn **React 19**; de UI gebruikt **Tailwind + DaisyUI** voor basistheming en inline CSS-variabelen voor per-kaartse kleuren.

```
Node.js (entry.mjs)
    │
    └── Astro SSR runtime
            ├── Publieke pagina's  (/users/[slug], /users/[slug]/badges/[id])
            ├── Gebruikersruimte   (/cards, /profile)
            ├── Adminpanel         (/admin/cards, /admin/access)
            └── Astro Actions      (CRUD kaarten, links, badges, auth)
```

Sessies worden beheerd via Astro's experimentele `fs-lite`-driver, bewaard in een dedicated Docker-volume.

## Personalisatie per kaart

Elke kaart heeft een reeks instelbare eigenschappen:

- **Kleuren** — achtergrond kaart, tekst, achtergrond logo, kleur links: alles als inline stijlen ingevuld voor nauwkeurige weergave per klant zonder globale CSS-overrides.
- **DaisyUI-thema** — toegepast via `data-theme` voor lichte/donkere modus per klant.
- **Randradius** — `rounded` of `square` aangestuurd via het veld `theme`.

## Linksysteem

Een kaart toont tot **8 links** in een 2-kolommenraster. Elk link heeft een van de 20+ types: telefoon, WhatsApp, Instagram, TikTok, Google Maps, Google Reviews, menu's, online bestellen, agenda, formulieren en meer. De `size`-eigenschap (`small` / `large`) bepaalt of de link 1 of 2 kolommen beslaat.

## Badges

Badges zijn visuele knoppen gekoppeld aan een afbeelding of logo, met een optionele URL of een eigen subpagina op `/users/[slug]/badges/[id]`. Ze stellen klanten in staat om certificeringen, promoties of media-inhoud direct op hun kaart te tonen.

## Installeerbare PWA

Elke kaartpagina genereert dynamisch een inline **Web App Manifest** — `id`, `start_url`, `scope`, themakleuren en iconen worden berekend op basis van de kaartgegevens in de database. Eindgebruikers kunnen de kaart rechtstreeks op hun startscherm installeren zonder tussenkomst van een app store, in `fullscreen`-weergave.

## Eigen analytics

Paginabezoeken en klikken worden bijgehouden via een interne service (`holmes.nsmobile.be`). Elk event — laden van de pagina of klikken op een link/badge — stuurt een `POST /api/hits/[slug]/[action]`. Geen cookies, geen externe afhankelijkheden.

## Deployment

De applicatie draait op **Docker Compose** achter een **Caddy** reverse proxy (geconfigureerd via containerlabels). Twee volumes zijn gekoppeld: `data/` voor sessies en de lokale SQLite-database, en `dist/client/assets/cards/` voor kaartassets (logo's, badges) die bewaard blijven tussen image-rebuilds.
