---
title: 'Project name — short tagline'
excerpt: 'One sentence: who it's for, what it does, what makes it interesting. Used as meta description and listing preview.'
category: 'Web App'
tags: ['Astro', 'React', 'PostgreSQL', 'Drizzle']
year: '2026'
color: 'oklch(0.55 0.15 70)'
liveUrl: 'https://example.com'
githubUrl: 'https://github.com/yourname/project'
updatedDate: 2026-05-14
featured: false
---

A 2-3 sentence opener: the client/context, the headline result. Don't bury the lede.

![Hero shot describing what the screenshot shows](../../../assets/projects/project-slug/hero.png)

## The problem

What was the client trying to do? Why was their current setup not working? Quantify if you can — "support tickets up 40% during peak"; "checkout took 6.2s on a fresh device".

## Constraints

What was *non-negotiable*?

- Budget / timeline
- Existing stack you had to play nice with
- Compliance, accessibility, or performance bars
- People (e.g. "the only frontend dev is part-time")

## What I built

The interesting half. Architecture diagrams, data flow, one or two implementation details that someone in the trade would recognise as non-trivial.

```ts
// A code snippet that shows judgment, not just syntax.
```

## What it shipped with

A blunt summary of the outcome. Numbers if you have them.

- LCP dropped from 4.1s to 1.2s on 4G Slow
- 12 weeks elapsed, 38 days of focused work
- Handed over with runbook + monitoring dashboards

## Lessons

One or two surprises. Honesty here is a trust signal — perfect post-mortems read like marketing.

---

**File naming:** kebab-case slug. Save under `src/content/projects/{lang}/<slug>.md`. Drop hero / detail images into `src/assets/projects/<slug>/` (keep filenames lowercase). Astro auto-optimizes them — generates AVIF/WebP and adds intrinsic `width`/`height` to prevent layout shift.
