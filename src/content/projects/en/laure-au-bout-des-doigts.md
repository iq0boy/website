---
title: "Laure au bout des doigts — Laser Institute in Walloon Brabant"
excerpt: "Migrating a slow Wix site to Astro 7 + Svelte 5 for a laser hair-removal institute: nine times lighter, three times faster, and locality pages built for the searches people actually make."
category: 'Marketing Site'
tags: ['Astro', 'Svelte', 'TypeScript', 'Leaflet', 'Local SEO', 'Netlify']
year: '2026'
color: 'oklch(0.45 0.13 10)'
liveUrl: 'https://www.laureauboutdesdoigts.net'
updatedDate: 2026-09-21
---

**Laure au bout des doigts** is a private institute for permanent laser hair removal, facial anti-ageing and body contouring, run out of a house in Hévillers (Mont-Saint-Guibert, Walloon Brabant, Belgium). One practitioner, since 2017. The previous site, on Wix, weighed 4.6 MB and took nearly six seconds to render its main content on mobile. The new one is nine times lighter and finally targets the searches people actually type.

![Home page — arch motif identity, rose and burgundy palette, "Une peau lisse, durablement."](../../../assets/projects/laure-au-bout-des-doigts/accueil.png)

## The problem

The old site wasn't just slow, it was **invisible to the right searches**. A survey of its seven public pages, early September 2026, found:

- **Not one `<h1>` tag** across the entire site. Wix rendered headings visually without ever marking them up as such.
- The **same meta description** repeated from page to page.
- Titles and URLs built around the **name of the device manufacturer** — a term nobody searches for — rather than around "épilation laser" and a town name.

And a trap to clear with the client up front: **Lighthouse scored the old site 100 for SEO.** That score only measures whether tags are present, never whether they're useful. It didn't separate the two sites at all — yet it would have been enough to conclude "SEO is already fine".

## Constraints

- **Nobody searches for "laser hair removal Hévillers".** The village is tiny. Demand lives in Wavre, Louvain-la-Neuve, Ottignies and Gembloux — and it had to be reached without lying about the address.
- **A single practitioner**, who opens the door, runs every session and answers the phone. The site had to sell exactly that, not impersonate a clinic.
- **No professional photography** at launch. The art direction had to hold without it.
- A sole trader's budget and timeline: from first mockup to production in **nineteen days**.

## What I built

A static **Astro 7 + Svelte 5** site, generated at build time, deployed on Netlify. Eighteen pages, three of them from one dynamic route.

All content lives in `src/data/` as typed TypeScript — forty treatment zones with price and duration, the FAQ, the reviews, the travel times — rather than in markup. The client changes a price in exactly one place.

**The locality pages are the core of the strategy.** Three towns, chosen from an analysis of who actually ranks on page one: Ottignies and Louvain-la-Neuve (no dedicated laser centre), Gembloux (none on site), Wavre (three established centres — you can outrank the directories, not them).

The obvious trap would have been duplicating one page and swapping the town name. Google filters those *doorway pages*. So each one tells what changes **for the person coming from there**: the road and the parking, what they already have locally, and the argument that answers that specific situation. And the title always says "près de", never "à": the institute is in Hévillers, and the page keeps saying so.

```ts
// src/data/localites.ts — one entry per town, never a duplicated template.
// Minutes come from `trajets`; the routes are read off the map.
{
  cle: 'ottignies-louvain-la-neuve',
  titre: "L'épilation laser, à dix minutes de Louvain-la-Neuve et d'Ottignies",
  trajet: { porte: 'N25', minutes: 10 },
  // what she already finds locally — the argument follows from this
  histoire: 'IPL around LLN, chains further out in Wavre',
}
```

For interactivity, just three Svelte islands, hydrated when they scroll into view: a per-zone price simulator, the free laser test form, and the reviews carousel. **Five of the six main pages ship no framework JavaScript at all.**

![Pricing page — forty zones with price and duration, in three columns](../../../assets/projects/laure-au-bout-des-doigts/tarifs.png)

## What it shipped with

Lighthouse, simulated mobile, same page compared:

| | Old (Wix) | New (Astro) |
|---|---|---|
| Performance | 45 | 92 – 100 |
| Largest Contentful Paint | 5.7 s | 1.8 – 2.9 s |
| Total Blocking Time | 2,140 ms | 0 ms |
| Page weight | 4,631 kB | 526 kB |

- **8.8× lighter**, main content painted two to three times sooner.
- **2,140 ms of blocking reduced to zero**: no more ignored taps or stuttering scroll on mobile.
- Eighteen pages with a unique `<h1>`, a description of their own, and URLs carrying the searched term.
- 146 commits in nineteen days.

The repository holds more than the site: the brand charter, five mockup iterations, a local market analysis with competitors' prices and devices, and the acquisition plan the site is meant to serve.

![Locality page — "L'épilation laser, à dix minutes de Louvain-la-Neuve et d'Ottignies"](../../../assets/projects/laure-au-bout-des-doigts/localite.png)

## Lessons

**A perfect score can be the worst possible diagnosis.** The old site's 100/100 for SEO would have closed the subject. It took opening the HTML page by page to find there wasn't a single `<h1>`. A metric that fails to separate two opposite situations measures nothing useful — and is expensive when trusted.

**The hard part wasn't technical.** Porting a mockup to Astro is known work. Deciding *which three towns* deserved a page, and writing three genuinely different texts instead of one duplicated template, took longer than the build.

**What's still missing matters most.** The site is fast and well structured, but it lacks professional photography — and for an aesthetic-care institute that is probably what converts hardest. A technically flawless site does not make up for absent images.
