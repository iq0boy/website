---
title: 'Altitude.Music — Studio & Label Website'
excerpt: 'Drietalige marketingsite voor een opnamestudio in Louvain-la-Neuve: island-architectuur, sticky now-playing speler, geïntegreerde reservatiekalender en volledige SEO met MusicRecordingStudio gestructureerde data.'
category: 'Web App'
tags: ['Astro', 'React', 'TypeScript', 'Netlify', 'Leaflet', 'i18n']
year: '2026'
color: 'oklch(0.25 0.08 90)'
liveUrl: 'https://altitudemusic.be'
---

Altitude.Music is een opnamestudio en label voor opkomende artiesten in Louvain-la-Neuve. De site fungeert tegelijk als marketing-etalage en als reservatieoppervlak: een bezoeker moet in twee klikken een nummer kunnen beluisteren, het aanbod in tien seconden begrijpen en een sessie bevestigen zonder de pagina te verlaten.

![Altitude.Music hero — "Le son qui te ressemble" met het studio-team](../../../assets/projects/altitude-music/hero.png)

## Architectuur

Statisch gerenderde Astro 6 site (SSG), gehost op Netlify. De renderingstrategie scheidt bewust statische `.astro` componenten en React-eilanden, die alleen hydrateren wanneer dat echt nodig is:

```
.astro (geen JS)      →  Nav, Hero, Marquee, Diensten, Over, Blog, Footer
.tsx client:visible   →  Portfolio, Video's, Testimonials, Boeking, Contact
.tsx client:idle      →  Zwevende WhatsApp-widget
.tsx client:load      →  Service-modal (luistert naar hashchange bij eerste render)
```

Het grootste deel van de homepage verstuurt geen JavaScript. Interactieve secties starten pas wanneer ze in beeld komen, wat de Time to Interactive strak houdt op mobiel.

## Portfolio & Now-Playing Speler

De portfolio-sectie haalt tracks uit een content collection — één Markdown-bestand per nummer, gesorteerd via een `sortOrder` frontmatter-veld. Het React-eiland verzorgt het genrefilter, gesimuleerde playback en een sticky now-playing balk die meeschuift met de gebruiker.

![Track-portfolio met genrefilter en metadata per nummer](../../../assets/projects/altitude-music/work.png)

Een Node-script (`npm run sync:music`) trekt Spotify-previewURL's in de frontmatter van de Markdown, zodat de speler echte audio afspeelt zonder runtime API-aanroep.

## Diensten & Tarieven

Servicebeschrijvingen leven in `src/data/services.ts` in plaats van in de i18n-JSON — het gaat om lange tekst die sterk verbonden is met de identiteit van elke service, wat per-locale bewerken vergemakkelijkt zonder de UI-strings te vervuilen. Elke service opent een detailmodal die via URL-hash (`#service/<key>`) wordt gerouteerd, zodat deeplinks een reload overleven.

![Diensten- en tariefraster met "Populair"-badge op Mix & Master](../../../assets/projects/altitude-music/services.png)

## Reservatiekalender

Een React-gehydrateerde kalender laat bezoekers een datum, duur (1u / 2u / 4u / dag) en tijdslot kiezen. Reserveringen synchroniseren met de studiokalender — de bezoeker bevestigt de sessie in drie klikken zonder de homepage te verlaten.

![Reservatiekalender met datumraster, duurkeuze en bevestigingsknop](../../../assets/projects/altitude-music/booking.png)

## i18n & SEO

Drie locales (`fr`, `en`, `nl`) met `prefixDefaultLocale: true` — elke pagina leeft onder zijn taalprefix en de root redirect naar `/fr/`. De layout zendt canonical URL's, hreflang-alternates inclusief `x-default`, en een `MusicRecordingStudio` JSON-LD blok. De sitemap-integratie genereert automatisch een sitemap per locale voor `fr-BE`, `en-BE` en `nl-BE`.

## Hosting

De site bouwt naar statische bestanden en gaat naar Netlify bij elke push op `main`. Geen backend, geen database, geen edge functions — de kalender hangt op het bestaande reservatiesysteem van de studio en het contactformulier verloopt via een transactional-email endpoint.
