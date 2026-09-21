---
title: "Laure au bout des doigts — Laserinstituut in Waals-Brabant"
excerpt: "Migratie van een trage Wix-site naar Astro 7 + Svelte 5 voor een instituut voor laserontharing: negen keer lichter, drie keer sneller, en plaatspagina's gebouwd op wat mensen echt zoeken."
category: 'Vitrinesite'
tags: ['Astro', 'Svelte', 'TypeScript', 'Leaflet', 'Lokale SEO', 'Netlify']
year: '2026'
color: 'oklch(0.45 0.13 10)'
liveUrl: 'https://www.laureauboutdesdoigts.net'
updatedDate: 2026-09-21
---

**Laure au bout des doigts** is een privé-instituut voor definitieve laserontharing, gezichtsverjonging en body contouring, gevestigd in een huis in Hévillers (Mont-Saint-Guibert, Waals-Brabant). Eén behandelaarster, sinds 2017. De vorige site, op Wix, woog 4,6 MB en had bijna zes seconden nodig om zijn hoofdinhoud op mobiel te tonen. De nieuwe is negen keer lichter en mikt eindelijk op de zoekopdrachten die mensen werkelijk intypen.

![Startpagina — identiteit met boogmotief, roze en bordeaux palet, "Une peau lisse, durablement."](../../../assets/projects/laure-au-bout-des-doigts/accueil.png)

## Het probleem

De oude site was niet alleen traag, hij was **onzichtbaar voor de juiste zoekopdrachten**. Een doorlichting van de zeven publieke pagina's, begin september 2026, leverde op:

- **Geen enkele `<h1>`-tag** op de hele site. Wix toonde titels visueel, zonder ze ooit als zodanig te markeren.
- Dezelfde **meta-beschrijving** herhaald van pagina tot pagina.
- Titels en URL's opgebouwd rond de **naam van de apparaatfabrikant** — een term die niemand zoekt — in plaats van rond "épilation laser" en een plaatsnaam.

En een valkuil die meteen met de klant moest worden opgeruimd: **Lighthouse gaf de oude site 100 voor SEO.** Die score meet alleen of tags aanwezig zijn, nooit of ze nuttig zijn. Hij maakte geen enkel onderscheid tussen beide sites — terwijl hij volstond om te besluiten dat "de SEO al goed zit".

## Beperkingen

- **Niemand zoekt op "laserontharing Hévillers".** Het dorp is piepklein. De vraag zit in Waver, Louvain-la-Neuve, Ottignies en Gembloers — en die moest bereikt worden zonder te liegen over het adres.
- **Eén behandelaarster**, die de deur opent, elke sessie doet en de telefoon opneemt. De site moest precies dát verkopen, geen kliniek nabootsen.
- **Geen professionele fotografie** bij de lancering. De artistieke richting moest het zonder redden.
- Het budget en de planning van een zelfstandige: van eerste maquette tot productie in **negentien dagen**.

## Wat ik heb gebouwd

Een statische **Astro 7 + Svelte 5**-site, gegenereerd bij de build, uitgerold op Netlify. Achttien pagina's, waarvan drie uit één dynamische route.

Alle inhoud staat in `src/data/` als getypeerde TypeScript — veertig behandelzones met prijs en duur, de FAQ, de reviews, de reistijden — in plaats van in de opmaak. De klant wijzigt een prijs op precies één plek.

**De plaatspagina's vormen de kern van de strategie.** Drie steden, gekozen op basis van wie werkelijk op pagina één staat: Ottignies en Louvain-la-Neuve (geen enkel gespecialiseerd lasercentrum), Gembloers (geen centrum ter plaatse), Waver (drie gevestigde centra — je kunt vóór de bedrijvengidsen komen, niet vóór hen).

De voor de hand liggende valkuil was één pagina dupliceren en de plaatsnaam vervangen. Google filtert zulke *doorway pages*. Elke pagina vertelt dus wat er verandert **voor wie daarvandaan komt**: de route en de parkeerplaats, wat ze lokaal al vindt, en het argument dat op die specifieke situatie antwoordt. En de titel zegt altijd "près de", nooit "à": het instituut ligt in Hévillers, en de pagina blijft dat herhalen.

```ts
// src/data/localites.ts — één entry per stad, nooit een gedupliceerd sjabloon.
// De minuten komen uit `trajets`; de routes zijn van de kaart gelezen.
{
  cle: 'ottignies-louvain-la-neuve',
  titre: "L'épilation laser, à dix minutes de Louvain-la-Neuve et d'Ottignies",
  trajet: { porte: 'N25', minutes: 10 },
  // wat ze lokaal al vindt — daar volgt het argument uit
  histoire: 'IPL rond LLN, ketens verderop in Waver',
}
```

Voor interactiviteit slechts drie Svelte-eilanden, gehydrateerd zodra ze in beeld komen: een prijssimulator per zone, het formulier voor de gratis lasertest, en de reviewcarrousel. **Vijf van de zes hoofdpagina's leveren helemaal geen framework-JavaScript.**

![Tarievenpagina — veertig zones met prijs en duur, in drie kolommen](../../../assets/projects/laure-au-bout-des-doigts/tarifs.png)

## Wat is opgeleverd

Lighthouse, gesimuleerd mobiel, dezelfde pagina vergeleken:

| | Oud (Wix) | Nieuw (Astro) |
|---|---|---|
| Performance | 45 | 92 – 100 |
| Largest Contentful Paint | 5,7 s | 1,8 – 2,9 s |
| Total Blocking Time | 2 140 ms | 0 ms |
| Paginagewicht | 4 631 kB | 526 kB |

- **8,8× lichter**, hoofdinhoud twee tot drie keer sneller getoond.
- **2 140 ms blokkering teruggebracht tot nul**: geen genegeerde taps of haperend scrollen meer op mobiel.
- Achttien pagina's met een unieke `<h1>`, een eigen beschrijving, en URL's die de gezochte term dragen.
- 146 commits in negentien dagen.

De repository bevat meer dan de site: het grafisch charter, vijf maquette-iteraties, een analyse van de lokale markt met prijzen en apparatuur van de concurrentie, en het acquisitieplan dat de site moet dienen.

![Plaatspagina — "L'épilation laser, à dix minutes de Louvain-la-Neuve et d'Ottignies"](../../../assets/projects/laure-au-bout-des-doigts/localite.png)

## Lessen

**Een perfecte score kan de slechtste diagnose zijn.** De 100/100 voor SEO van de oude site zou de discussie hebben gesloten. Er was pagina per pagina in de HTML kijken voor nodig om te zien dat er geen enkele `<h1>` stond. Een indicator die twee tegengestelde situaties niet onderscheidt, meet niets nuttigs — en is duur zodra je erop vertrouwt.

**Het moeilijke deel was niet technisch.** Een maquette naar Astro porteren is bekend werk. Beslissen *welke drie steden* een pagina verdienden, en drie werkelijk verschillende teksten schrijven in plaats van één gedupliceerd sjabloon, kostte meer tijd dan de bouw.

**Wat nog ontbreekt weegt het zwaarst.** De site is snel en goed gestructureerd, maar mist professionele fotografie — en voor een instituut voor esthetische verzorging is dat wellicht wat het meest converteert. Een technisch onberispelijke site compenseert geen ontbrekende beelden.
