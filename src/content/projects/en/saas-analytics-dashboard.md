---
title: "SaaS Analytics Dashboard"
excerpt: "Data visualization platform processing 10M+ events daily with real-time dashboards."
category: "Web App"
tags: ["Next.js", "D3.js", "Prisma", "TimescaleDB"]
year: "2025"
color: "oklch(0.28 0.06 150)"
---

A B2B SaaS company needed to give their customers self-serve visibility into product usage data — funnel conversions, retention cohorts, event sequences — processed in real time from multiple source systems.

## The Data Pipeline Challenge

At 10M+ events per day across 200+ customer accounts, querying raw event tables for every dashboard request was unsustainable. The initial implementation hit 4–8 second load times on non-trivial queries. Users were abandoning dashboards before they loaded.

## The Pre-Aggregation Strategy

The fix was to shift work from query time to ingest time. As events arrive via Kafka, a stream processor maintains incremental aggregates at multiple time resolutions — hourly, daily, weekly — writing them into TimescaleDB hypertables.

```typescript
// Query planner selects the right aggregation table based on time range
function selectAggregationLevel(from: Date, to: Date): AggLevel {
  const days = differenceInDays(to, from);
  if (days <= 2) return 'hourly';
  if (days <= 90) return 'daily';
  return 'weekly';
}
```

Dashboard queries hit pre-aggregated tables, not raw events. Load times dropped from 4s to under 100ms.

## Custom Visualizations

The product uses D3.js for all charts rather than an off-the-shelf library, giving full control over animation, interaction, and layout. A declarative config layer lets non-engineers define new chart types by describing axes, scales, and transitions in JSON — no D3 code required.

## Multi-Tenant Data Isolation

Each customer's data is isolated via row-level security (RLS) policies in PostgreSQL. The API never passes customer IDs as query parameters — the session context automatically scopes every query to the authenticated tenant.

```sql
CREATE POLICY tenant_isolation ON events
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

## Results

- Dashboard load time: <100ms at P95 (down from 4–8s)
- 10M+ events processed daily, zero data loss
- 200+ customer accounts with fully isolated data
- 4 new chart types shipped by non-engineers using the config layer
