---
title: "SaaS Analytics Dashboard"
excerpt: "Datavisualisatieplatform dat dagelijks 10M+ events verwerkt met realtime dashboards."
category: "Web App"
tags: ["Next.js", "D3.js", "Prisma", "TimescaleDB"]
year: "2025"
color: "oklch(0.28 0.06 150)"
---

Een B2B SaaS-bedrijf had selfservice-inzicht nodig in productgebruiksdata voor hun klanten — trechterconversies, retentiecohorten, eventsequenties — verwerkt in realtime vanuit meerdere bronsystemen.

## De data-pipelinechallenge

Met 10M+ events per dag verspreid over 200+ klantaccounts was het opvragen van ruwe eventtabellen voor elk dashboardverzoek onhoudbaar. De initiële implementatie haalde laadtijden van 4–8 seconden op niet-triviale queries. Gebruikers verlieten dashboards voordat ze geladen waren.

## De pre-aggregatiestrategie

De oplossing was om werk te verschuiven van querytijd naar ingesttijd. Naarmate events via Kafka binnenkomen, onderhoudt een streamprocessor incrementele aggregaten op meerdere tijdsresoluties — uurlijks, dagelijks, wekelijks — die worden weggeschreven naar TimescaleDB hypertabellen.

```typescript
// Queryplanner kiest de juiste aggregatietabel op basis van tijdsbereik
function selectAggregationLevel(from: Date, to: Date): AggLevel {
  const days = differenceInDays(to, from);
  if (days <= 2) return 'hourly';
  if (days <= 90) return 'daily';
  return 'weekly';
}
```

Dashboardqueries raken pre-geaggregeerde tabellen, niet ruwe events. Laadtijden daalden van 4s naar minder dan 100ms.

## Aangepaste visualisaties

Het product gebruikt D3.js voor alle grafieken in plaats van een kant-en-klare bibliotheek, wat volledige controle geeft over animatie, interactie en layout. Een declaratieve configuratielaag laat niet-engineers nieuwe grafiektypen definiëren door assen, schalen en overgangen in JSON te beschrijven — geen D3-code vereist.

## Multi-tenant data-isolatie

De data van elke klant is geïsoleerd via row-level security (RLS) beleid in PostgreSQL. De API geeft nooit klant-ID's mee als queryparameters — de sessiecontext beperkt elke query automatisch tot de geauthenticeerde tenant.

```sql
CREATE POLICY tenant_isolation ON events
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

## Resultaten

- Dashboardlaadtijd: <100ms bij P95 (van 4–8s)
- 10M+ events dagelijks verwerkt, nul dataverlies
- 200+ klantaccounts met volledig geïsoleerde data
- 4 nieuwe grafiektypen geleverd door niet-engineers via de configuratielaag
