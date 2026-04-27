---
title: "Real Estate Marketplace"
excerpt: "Property listing platform with 3D tours, map search, and mortgage calculator."
category: "Web App"
tags: ["Next.js", "Mapbox", "Supabase"]
year: "2024"
color: "oklch(0.28 0.05 60)"
---

A national real estate agency wanted to move away from a third-party listing platform and own their technology — gaining control over UX, data, and the customer journey from first search to signed contract.

## Map-First Search

The core experience is a split-screen map + list view. The challenge: rendering 100,000+ property markers without degrading performance. The solution is a multi-level clustering strategy using Mapbox GL's `supercluster` integration, which dynamically merges nearby markers into clusters as the user zooms out.

```typescript
// Dynamic cluster radius based on zoom level
const clusterRadius = (zoom: number) => {
  if (zoom > 14) return 0;   // Individual markers
  if (zoom > 11) return 40;  // Tight clusters
  return 80;                  // City-level clusters
};
```

Property cards in the list view are virtualized — only visible items render — keeping memory stable even with thousands of results.

## 3D Virtual Tours

Each listing can include a 3D walkthrough built from 360° photos processed with Matterport's SDK, embedded as a lazy-loaded iframe. Analytics showed listings with 3D tours received 3× more saves than equivalent photo-only listings.

## Mortgage Calculator

An integrated mortgage calculator lets buyers model monthly payments in real time as they adjust deposit, term, and rate assumptions. Rates are pulled from a live rate feed updated twice daily. The calculator state is serialized into the URL, so buyers can share a listing and payment scenario in a single link.

## Supabase Backend

Supabase handles authentication, the property database (PostGIS extension for geospatial queries), and real-time updates — agents see new inquiries as they arrive without polling. Row-level security ensures agents only access inquiries for their own listings.

## Results

- 100,000+ active listings at launch
- 200% increase in contact form conversions vs. the previous platform
- Average session duration: 7.5 minutes (up from 2.8 minutes)
- 3D tour listings: 3× higher save rate vs. photo-only listings
