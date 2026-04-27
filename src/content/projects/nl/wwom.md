---
title: "Wwom — SMS-campagnes voor Salons"
excerpt: "B2B-applicatie voor het beheer van SMS-marketingcampagnes en de validatie van promotiecodes voor haar- en beautysalons, met een dashboard per zaak."
category: "Web App"
tags: ["Nuxt", "Vue", "Strapi", "MongoDB", "Tailwind", "OVH SMS", "PWA"]
year: "2023"
color: "oklch(0.26 0.10 310)"
---

Wwom is een B2B-applicatie waarmee haar- en beautysalons SMS-marketingcampagnes kunnen aanmaken, versturen en opvolgen, en promotiecodes kunnen beheren voor validatie aan de kassa.

## Architectuur

```
Nuxt 2 (front)          Strapi 3 (back)
     │                       │
     ├── @nuxtjs/auth-next    ├── strapi-connector-mongoose (MongoDB)
     ├── @nuxtjs/axios        ├── strapi-plugin-users-permissions (JWT)
     ├── Vuex                 ├── ovh (OVH SMS API)
     └── Tailwind CSS         └── Automatisch gegenereerde REST API
```

Elke salon heeft zijn eigen werkruimte: campagnes worden gefilterd op salon-ID (`/salons/:id/campaigns`). Authenticatie verloopt via het ingebouwde JWT-systeem van Strapi, beheerd aan de frontkant door `@nuxtjs/auth-next`.

## Beheer van SMS-campagnes

Het hoofdscherm toont de campagnes van de ingelogde salon, met aanmaken, bewerken en (individueel of bulksgewijs) verwijderen. Elke campagne bevat een leveringsrapport opgehaald via de OVH API, en een instelbaar aantal bezoeken dat vereist is voordat de campagne wordt getriggerd.

## Validatie van promotiecodes

Een aparte pagina laat salonpersoneel een promotiecode invoeren en geeft onmiddellijk de status weer:

- **Te controleren** — onbekende of openstaande code
- **Geldige code** — actieve code, na bevestiging gemarkeerd als gebruikt
- **Gebruikte code** — code al ingewisseld

Het resultaat wordt visueel weergegeven met een open/gesloten hangslotpictogram en een groen/rood kleurenschema.

## PWA

De applicatie is geconfigureerd als **Progressive Web App** via `@nuxtjs/pwa`, installeerbaar op een kassatablet zonder tussenkomst van een app store.
