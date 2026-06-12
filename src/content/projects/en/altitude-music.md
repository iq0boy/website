---
title: 'Altitude.Music — Recording Studio & Label Site'
excerpt: 'Trilingual marketing site for a Louvain-la-Neuve recording studio: island architecture, sticky now-playing player, integrated booking calendar, and full SEO with MusicRecordingStudio structured data.'
category: 'Web App'
tags: ['Astro', 'React', 'TypeScript', 'Netlify', 'Leaflet', 'i18n']
year: '2026'
color: 'oklch(0.25 0.08 90)'
liveUrl: 'https://altitudemusic.be'
updatedDate: 2026-06-12
---

Altitude.Music is a recording studio and emerging-artist label based in Louvain-la-Neuve. The site doubles as a marketing front and a booking surface: a visitor should hear a track in two clicks, understand the offer in ten seconds, and confirm a session without leaving the page.

![Altitude.Music hero — "Le son qui te ressemble" with the studio crew](../../../assets/projects/altitude-music/hero.png)

## The problem

A recording studio sells listening: if a visitor hears nothing within the first few seconds, the visit is lost. The studio team also needed to run the site themselves — add a track to the portfolio, publish a journal entry, update a testimonial — without going back through a developer every time. All of it with no backend to host or maintain.

## Constraints

- **Zero backend.** Static hosting on Netlify: no server, no database, nothing to maintain on the infra side.
- **Content editable by the studio.** Tracks, journal, testimonials and services must be editable without touching code.
- **Real audio with no runtime API** — no Spotify credentials to manage in production.
- **Three locales** (`fr`, `en`, `nl`) with full per-language SEO.
- **Mobile-first performance**: the target audience (emerging artists) browses almost entirely on phones.

## Architecture

Static-rendered Astro 6 site (SSG) deployed on Netlify. The rendering strategy is deliberately split between static `.astro` components and React islands, hydrated only when actually needed:

```
.astro (zero JS)      →  Nav, Hero, Marquee, Services, About, Blog, Footer
.tsx client:visible   →  Portfolio, Videos, Testimonials, Booking, Contact
.tsx client:idle      →  Floating WhatsApp widget
.tsx client:load      →  Service modal (listens to hashchange on first paint)
```

Most of the homepage ships zero JavaScript. Interactive sections only boot when they enter the viewport, which keeps Time to Interactive tight on mobile.

## Portfolio & Now-Playing Player

The portfolio section pulls tracks from a content collection — one Markdown file per track, sorted by a `sortOrder` frontmatter field. The React island handles genre filtering, simulated playback, and a sticky now-playing bar that follows the user as they scroll.

![Track portfolio with genre filter and per-track metadata](../../../assets/projects/altitude-music/work.png)

A Node script (`npm run sync:music`) pulls Spotify preview URLs into the Markdown frontmatter so the player has real audio without any runtime API call.

## Services & Pricing

Service descriptions live in `src/data/services.ts` rather than i18n JSON — they are long-form prose tied to service identity, which makes per-locale editing easier without polluting the UI strings file. Each service opens a detail modal routed by URL hash (`#service/<key>`), so deep links survive a reload.

![Services and pricing grid with "Popular" tag on Mix & Master](../../../assets/projects/altitude-music/services.png)

## Booking Calendar

A React-hydrated calendar lets visitors pick a date, duration (1h / 2h / 4h / day), and time slot. Bookings synchronise with the studio's calendar — the visitor confirms the session in three clicks without leaving the homepage.

![Booking calendar with date grid, duration picker, and confirmation button](../../../assets/projects/altitude-music/booking.png)

## i18n & SEO

Three locales (`fr`, `en`, `nl`) with `prefixDefaultLocale: true` — every page lives under its locale prefix and the root redirects to `/fr/`. The layout emits canonical URLs, hreflang alternates including `x-default`, and a `MusicRecordingStudio` JSON-LD block. The sitemap integration auto-generates per-locale sitemaps for `fr-BE`, `en-BE` and `nl-BE`.

## Hosting

The site builds to static files and ships to Netlify on every push to `main`. No backend, no database, no edge functions — the calendar is wired to the studio's existing booking system, and the contact form submits via a transactional email endpoint.

## Studio-Run Content Editing

The site embeds **Sveltia CMS** wired to its six content collections (tracks, journal, testimonials, services…). The studio team edits content from the browser; every save is a Git commit that triggers a Netlify rebuild. The studio is autonomous on its content, and the site stays 100% static — no database snuck in along the way.

## What it shipped with

- 41 days from first commit to production (April 30 → June 9, 2026)
- 11 portfolio tracks with real audio, 6 services, 5 testimonials, 3 locales
- Only about ten runtime dependencies; most of the homepage ships zero JavaScript
- Hashed assets served with a one-year immutable cache
- Sveltia CMS live on all 6 collections — the studio publishes without a developer

## Lessons

- **Critical content does not belong in an island.** Section headings initially lived inside the React components: they only appeared after hydration. They were lifted into static `.astro` — anything the first paint and crawlers must see has to be server-rendered.
- **The Spotify sync script is a deliberate trade-off.** It parses the public embed page rather than the official API: zero credentials to manage, but non-contractual HTML that can break. Acceptable because it runs locally when adding a track — never at runtime, never in CI.
