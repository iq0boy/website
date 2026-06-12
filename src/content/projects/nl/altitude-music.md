---
title: 'Altitude.Music — Studio & Label Website'
excerpt: 'Drietalige marketingsite voor een opnamestudio in Louvain-la-Neuve: island-architectuur, sticky now-playing speler, geïntegreerde reservatiekalender en volledige SEO met MusicRecordingStudio gestructureerde data.'
category: 'Web App'
tags: ['Astro', 'React', 'TypeScript', 'Netlify', 'Leaflet', 'i18n']
year: '2026'
color: 'oklch(0.25 0.08 90)'
liveUrl: 'https://altitudemusic.be'
updatedDate: 2026-06-12
---

Altitude.Music is een opnamestudio en label voor opkomende artiesten in Louvain-la-Neuve. De site fungeert tegelijk als marketing-etalage en als reservatieoppervlak: een bezoeker moet in twee klikken een nummer kunnen beluisteren, het aanbod in tien seconden begrijpen en een sessie bevestigen zonder de pagina te verlaten.

![Altitude.Music hero — "Le son qui te ressemble" met het studio-team](../../../assets/projects/altitude-music/hero.png)

## Het probleem

Een opnamestudio verkoopt luisteren: als een bezoeker in de eerste seconden niets hoort, is het bezoek verloren. Het studioteam moest de site bovendien zelf kunnen beheren — een nummer aan het portfolio toevoegen, een journalbericht publiceren, een testimonial bijwerken — zonder telkens via een ontwikkelaar te passeren. En dat alles zonder backend om te hosten of te onderhouden.

## Beperkingen

- **Geen backend.** Statische hosting op Netlify: geen server, geen database, niets te onderhouden aan de infra-kant.
- **Inhoud bewerkbaar door de studio.** Tracks, journal, testimonials en diensten moeten aanpasbaar zijn zonder code aan te raken.
- **Echte audio zonder runtime-API** — geen Spotify-credentials te beheren in productie.
- **Drie locales** (`fr`, `en`, `nl`) met volledige SEO per taal.
- **Mobile-first performance**: het doelpubliek (opkomende artiesten) surft vrijwel uitsluitend op de telefoon.

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

## Contentbeheer door de studio

De site bevat **Sveltia CMS**, gekoppeld aan de zes content collections (tracks, journal, testimonials, diensten…). Het studioteam bewerkt de inhoud vanuit de browser; elke save is een Git-commit die een Netlify-rebuild triggert. De studio is autonoom over zijn content, en de site blijft 100% statisch — er is onderweg geen database bijgekomen.

## Wat er werd opgeleverd

- 41 dagen tussen de eerste commit en productie (30 april → 9 juni 2026)
- 11 portfoliotracks met echte audio, 6 diensten, 5 testimonials, 3 locales
- Slechts een tiental runtime-dependencies; het grootste deel van de homepage verstuurt geen JavaScript
- Gehashte assets geserveerd met een immutable cache van één jaar
- Sveltia CMS actief op alle 6 collecties — de studio publiceert zonder ontwikkelaar

## Lessen

- **Kritieke content hoort niet in een eiland.** Sectietitels leefden aanvankelijk in de React-componenten: ze verschenen pas na hydratatie. Ze zijn verplaatst naar statische `.astro` — wat de first paint en crawlers moeten zien, moet server-side gerenderd worden.
- **Het Spotify-syncscript is een bewust compromis.** Het parseert de publieke embed-pagina in plaats van de officiële API: geen credentials te beheren, maar niet-contractuele HTML die kan breken. Aanvaardbaar omdat het lokaal draait bij het toevoegen van een nummer — nooit at runtime, nooit in CI.
