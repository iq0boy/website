---
title: "Vastgoedmarktplaats"
excerpt: "Vastgoedplatform met 3D-tours, kaartzoeken en hypotheekcalculator."
category: "Web App"
tags: ["Next.js", "Mapbox", "Supabase"]
year: "2024"
color: "oklch(0.28 0.05 60)"
---

Een nationaal vastgoedkantoor wilde afstappen van een extern listingplatform en de technologie zelf in handen nemen — om controle te krijgen over UX, data en het klanttraject van eerste zoekopdracht tot getekend contract.

## Kaartgerichte zoekervaring

De kernervaring is een split-screen kaart + lijstweergave. De uitdaging: 100.000+ vastgoedmarkeringen weergeven zonder de prestaties te verslechteren. De oplossing is een multilevel clusteringstrategie met Mapbox GL's `supercluster`-integratie, die nabijgelegen markeringen dynamisch samenvoegt in clusters naarmate de gebruiker uitzoomt.

```typescript
// Dynamische clusterstraal op basis van zoomniveau
const clusterRadius = (zoom: number) => {
  if (zoom > 14) return 0;   // Individuele markeringen
  if (zoom > 11) return 40;  // Strakke clusters
  return 80;                  // Stadsniveau-clusters
};
```

Vastgoedkaarten in de lijstweergave zijn gevirtualiseerd — alleen zichtbare items worden gerenderd — waardoor het geheugen stabiel blijft, zelfs met duizenden resultaten.

## 3D Virtuele Tours

Elke woning kan een 3D-rondleiding bevatten, gemaakt van 360°-foto's verwerkt met Matterport's SDK, ingebed als een lazy-loaded iframe. Analyses toonden aan dat woningen met 3D-tours 3× meer opslagen ontvingen dan vergelijkbare woningen met alleen foto's.

## Hypotheekcalculator

Een geïntegreerde hypotheekcalculator laat kopers maandlasten in realtime modelleren terwijl ze aanbetaling, looptijd en renteaannames aanpassen. Rentes worden opgehaald uit een live datafeed die tweemaal daags wordt bijgewerkt. De calculatorstatus wordt geserialiseerd in de URL, zodat kopers een woning en betalingsscenario in één link kunnen delen.

## Supabase Backend

Supabase verwerkt authenticatie, de vastgoeddatabase (PostGIS-extensie voor georuimtelijke queries) en realtime-updates — makelaars zien nieuwe aanvragen zodra ze binnenkomen, zonder polling. Row-level security zorgt ervoor dat makelaars alleen aanvragen voor hun eigen woningen zien.

## Resultaten

- 100.000+ actieve woningen bij lancering
- 200% meer conversies op het contactformulier vs. het vorige platform
- Gemiddelde sessieduur: 7,5 minuten (van 2,8 minuten)
- Woningen met 3D-tour: 3× hogere opslagrate vs. foto-only woningen
