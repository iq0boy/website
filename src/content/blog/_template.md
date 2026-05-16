---
title: 'Article title — short and benefit-led'
excerpt: 'One or two sentences. Used as the meta description, the OG description, and the listing card preview. Aim for 140–160 characters.'
pubDate: 2026-05-14
updatedDate: 2026-05-14
category: 'Engineering'
readTime: 6
tags: ['Astro', 'SEO', 'Performance']
draft: true
---

## TL;DR

A few-sentence summary. Lead with the conclusion — readers decide whether to keep going from this paragraph.

## Why this matters

Set up the problem. What's the cost of getting it wrong? What's the prize for getting it right?

## How it works

Walk through the approach. One H2 per major section. Use H3 sparingly — the ToC only surfaces H2/H3.

```ts
// Real code beats pseudo-code. Show, don't tell.
export function example(input: string): string {
  return input.trim();
}
```

> Pull-quotes for memorable lines.

## Trade-offs

What did you give up to get this win? Name it explicitly — credibility rises when you admit the costs.

## Takeaway

End with one action the reader can take in the next 10 minutes.

---

**File naming:** kebab-case slug, e.g. `building-pagefind-search-into-astro.md`. Save under `src/content/blog/{lang}/<slug>.md` for each locale you publish. The slug must match across locales.

**Before publishing:** set `draft: false`, fill `pubDate` with today, and remove this trailing note.
