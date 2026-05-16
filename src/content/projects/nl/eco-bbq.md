---
title: 'Eco-BBQ — Marketingsite voor de Wegwerp-Eco-BBQ'
excerpt: 'Drietalige marketing- en lead-generatie-site voor een zero-waste wegwerp-barbecuekit: Astro + Svelte-eilanden, Swiper-carrousels, OpenLayers verkopers-kaart en een B2B partner-flow.'
category: 'Web App'
tags: ['Astro', 'Svelte', 'Tailwind', 'DaisyUI', 'OpenLayers', 'Swiper', 'TypeScript']
year: '2025'
color: 'oklch(0.30 0.08 145)'
liveUrl: 'https://www.eco-bbq.eu/'
---

Eco-BBQ is een zero-waste wegwerp-barbecuekit die verdeeld wordt in België, Frankrijk, Spanje en Portugal. De site fungeert tegelijk als consumentenetalage (hoe het werkt, waar te kopen) en als B2B-funnel voor verkopers die het product willen aanbieden. Drie locales, volledig statisch, gehost bij Combell.

![Eco-BBQ hero met de productkit en drie voordeel-pillen: snel, zero-waste, eenvoudig](../../../assets/projects/eco-bbq-v2/hero.png)

## Architectuur

Astro 5 in volledig statische modus met Tailwind en DaisyUI als design-systeem. Het grootste deel van de pagina zit in `.astro`-componenten die server-side renderen en geen JavaScript meesturen; het enige gehydrateerde eiland is de **Svelte 5** verkopers-kaart, die het verspilling zou zijn om voor elke bezoeker te bundelen.

```
.astro-componenten      →  Navbar, Hero, Voordelen, Hoe het werkt, Testimonials, Footer
Svelte 5-eiland         →  OpenLayers verkopers-kaart (Map.svelte)
Swiper 11 vanilla       →  Hero-carrousel + testimonial-carrousel
```

Swiper wordt als standalone bundle geladen voor de twee carrousels in plaats van verpakt in een framework — de runtime-kost blijft minimaal en we hoeven geen React of Vue mee te slepen om gewoon een slider te draaien.

## Hoe Het Werkt

De "hoe het werkt"-sectie combineert een YouTube-uitleg met een strook van vier pictogrammen. De inhoud (titels, beschrijvingen, illustraties) komt uit `src/i18n/translatedContent/*.js`-modules, dus tekst aanpassen vraagt geen wijziging in de markup.

![Hoe het werkt — YouTube-uitleg en 4 pictogrammen](../../../assets/projects/eco-bbq-v2/how.png)

## Testimonials

Veertien echte klantverhalen worden als een statisch raster op desktop weergegeven en als een Swiper-carrousel op mobiel. Elke kaart is server-gerenderde HTML; de carrousel-JS hecht zich alleen onder de mobile-breakpoint aan, dus desktopbezoekers betalen er niets voor.

![Testimonial-raster — veertien echte klantcitaten met namen](../../../assets/projects/eco-bbq-v2/testimonials.png)

## Verkopers-Kaart

De "Nous trouver"-sectie gebruikt **OpenLayers 8** om het netwerk van verkopers op een interactieve kaart te tonen, met een filterbare lijst die synchroon loopt met de kaart-state. OpenLayers werd gekozen boven Google Maps om de kaart vrij te houden van API-quota en tracking-cookies — de site toont geen cookiebanner omdat hij op de homepage geen enkele derde-partij-tracker laadt.

## i18n & Partner-Flow

Drie locales (`fr`, `en`, `nl`) waarbij de Franse prefix behouden blijft (`/fr/`, niet de root) zodat de URL-structuur uniform blijft. Route-slugs worden per locale vertaald — `/fr/partenariat`, `/en/partnership`, `/nl/partnerschap` — afgehandeld door een dynamische `[lang]/[partnership].astro`-pagina met een B2B-formulier dat naar Formspree gaat. De sitemap-integratie genereert automatisch entries per locale.

## Hosting

Statische build gepusht naar **Combell** shared hosting. Geen server, geen database, geen API — het contactformulier gaat naar Formspree en het partnerformulier naar een aparte Formspree-endpoint, zodat de site op goedkope statische infrastructuur kan blijven en toch leads vangt.
