---
title: "Sobeltax — Voertuigverhuursplatform"
excerpt: "SSR webapplicatie voor voertuigverhuur in België: meerstaps reserveringsflow, geolocaliseerde agentuurzoekopdracht en volledig klantendashboard."
category: "Web App"
tags: ["Astro", "Svelte", "Fastify", "TypeScript", "OpenLayers", "Redis", "Docker"]
year: "2025"
color: "oklch(0.28 0.10 155)"
liveUrl: "https://sobeltax.nsmobile.be"
---

Sobeltax is een voertuigverhuursplatform voor de Belgische markt, beschikbaar in het Frans, Nederlands en Engels. De uitdaging was het leveren van een vlotte reserveringsflow, multi-agentuur beheer met kaartgebaseerde zoekopdracht en een volledig klantengebied — zonder afhankelijkheid van een monolithisch framework.

## Architectuur

De applicatie is gebouwd met **Astro 5 in SSR-modus** met de Node.js-adapter, geserveerd door **Fastify 5** als HTTP-runtime. Interactieve componenten zijn **Svelte 5**-eilanden: elke pagina verstuurt alleen het JavaScript voor de componenten die ze daadwerkelijk gebruikt, zonder globale bundle. Dit verbetert de Time to Interactive direct, vooral op mobiel.

```
Fastify 5 (server.js)
    │
    ├── Middlewares: CORS, Helmet, statische bestanden
    │
    └── Astro SSR-runtime
            ├── .astro-pagina's (server-gerenderd)
            ├── Svelte-eilanden (gerichte interactiviteit)
            └── API-routes (acties, betalingscallbacks)
```

**Redis** slaat beschikbaarheidsdata van voertuigen en agentuurinformatie op in de cache, om herhaalde aanroepen naar externe diensten bij elke request te vermijden.

## Reserveringsflow in 5 stappen

De kern van de applicatie is een begeleide reserveringsprocedure:

1. **Datums en agentuur** — selectie via Pikaday en de OpenLayers-kaart
2. **Voertuigcategorie** — dynamisch filteren op basis van werkelijke beschikbaarheid
3. **Details** — bestuurdersinformatie, extra opties
4. **Verzekering** — dekking selecteren en valideren
5. **Bevestiging** — overzicht en betalingsstart

De reserveringsstatus wordt client-side bewaard met **Nanostores**, zodat gebruikers tussen stappen kunnen navigeren zonder ingevoerde gegevens te verliezen, ook na herladen van de pagina.

## Geolocaliseerde agentuurzoekopdracht

De agentuurpagina integreert **OpenLayers 10** voor een interactieve kaart van het netwerk. Zoeken werkt op naam of adres; de agentuurlijst synchroniseert in realtime met de kaart. OpenLayers werd gekozen als open source-alternatief voor Google Maps — geen quota, geen API-kosten.

## Belgisch meertalig

i18n-routing volgt het Astro-patroon: `/` voor Frans (standaardlocale, geen prefix), `/nl/` en `/en/` voor Nederlands en Engels. De locales `fr-BE` en `nl-BE` zijn gedeclareerd in de sitemap en metatags voor datum- en valuta-opmaak aangepast aan de lokale markt.

## Deployment

De applicatie draait op **Docker Swarm** met een dedicated productie-Compose-bestand. De Fastify-server luistert op poort 3000 achter een reverse proxy. Een multi-stage build scheidt ontwikkelingsafhankelijkheden van productie-artefacten voor een slanke uiteindelijke image.
