---
title: "Designsystemen die echt schaalbaar zijn"
excerpt: "Lessen geleerd uit het bouwen en onderhouden van designsystemen voor meerdere producten en teams."
pubDate: 2026-02-10
category: "Design"
readTime: 10
---

Lessen geleerd uit het bouwen en onderhouden van designsystemen voor meerdere producten en teams.

Een designsysteem is een van die investeringen die enorm loont als het goed wordt gedaan, en een blok aan het been wordt als het fout gaat. Het verschil ligt zelden aan de tokens of de componentenbibliotheek — het ligt aan het proces, de governance en de bereidheid om het systeem als een product te behandelen.

## Begin met fundamenten, niet met componenten

De meest gemaakte fout is het bouwen van componenten voordat de fundamenten zijn vastgelegd. Teams haasten zich om een Button-component te bouwen voordat ze het eens zijn over wat "primary" betekent, wat de spacingschaal is, of hoe kleurrollenaan semantische intentie worden gekoppeld.

Een solide fundament bestaat uit vier lagen:

1. **Design tokens** — de ruwe waarden (kleuren, maten, duurtes)
2. **Semantische tokens** — intent-gemappe aliassen (`color.action.primary` → `#5B6AD0`)
3. **Componenttokens** — componentspecifieke overrides (`button.bg` → `color.action.primary`)
4. **Componenten** — gebouwd met uitsluitend componenttokens

Deze hiërarchie betekent dat het wijzigen van je merkkleur slechts één tokenupdate vereist, in plaats van het doorzoeken van alle componentstijlen.

```css
/* Fundamenttokens */
:root {
  --color-blue-500: oklch(0.55 0.18 250);
  --space-4: 1rem;
  --radius-md: 0.375rem;
}

/* Semantische tokens */
:root {
  --color-action-primary: var(--color-blue-500);
  --space-component-padding-md: var(--space-4);
}

/* Component */
.btn-primary {
  background: var(--color-action-primary);
  padding: var(--space-component-padding-md);
  border-radius: var(--radius-md);
}
```

## Het versieprobleem

Designsystemen leven lang genoeg om technische schulden op te bouwen. De vraag is hoe je ze kunt laten evolueren zonder de tientallen teams die ervan afhankelijk zijn te breken.

Semantisch versiebeheer is het absolute minimum. Wat nog meer telt, is **communicatie**:

- **Patch** (1.0.x) — bugfixes, nooit breaking
- **Minor** (1.x.0) — nieuwe componenten, deprecations aangekondigd
- **Major** (x.0.0) — breaking changes, migratiegidsen verplicht

We hebben een tweestaps-deprecatiecyclus aangenomen: depreceren in minor, verwijderen in de volgende major. Dit geeft teams minstens één volledige versie om te migreren. Voor elke deprecation leverden we een codemod die 90% van de migratie automatiseerde.

## Documentatie als prioriteit

Een component dat niet gedocumenteerd is, bestaat niet voor de meeste ontwikkelaars. Documentatie is niet alleen een API-referentie — het toont het *waarom* achter beslissingen, demonstreert do's en don'ts, en biedt kopieer-plak-voorbeelden die echt werken.

De meest waardevolle documentatie die je kunt schrijven is de **gebruiksrichtlijnen**-sectie:

> ✓ Gebruik `<Button variant="primary">` voor de enige meest belangrijke actie per pagina.
>
> ✗ Gebruik geen meerdere primaire knoppen in dezelfde sectie — dit verdunt de hiërarchie.

Deze korte regels voorkomen dat dezelfde vragen 40 keer per week op Slack worden gesteld.

## Governance: het moeilijke deel

Het technische werk is het gemakkelijke deel. Het echt moeilijke deel is wie beslist wat er in het systeem komt.

Een open bijdragemodel waarbij iedereen componenten kan voorstellen en samenvoegen klinkt inclusief, maar leidt tot een uitdijende bibliotheek met 12 licht verschillende kaartsvarianten en geen duidelijk eigenaarschap. Een gesloten model waarbij alleen een toegewijd team componenten uitbrengt, creëert een bottleneck.

Het model dat werkt: **bijdrage RFC + review**. Iedereen kan een component voorstellen via een kort RFC-sjabloon (use case, bestaande oplossingen bekeken, voorgestelde API). Het kernteam beoordeelt haalbaarheid en API-ontwerp. Bijdragers bouwen met paarsupportondersteuning. Het kernteam beheert documentatie en langdurig onderhoud.

Dit maakt het systeem collaboratief terwijl de kwaliteit en samenhang hoog blijven.

## Belangrijkste punten

Een designsysteem is nooit klaar — plan voor 20% van de teamcapaciteit voor onderhoud. Tokens zijn belangrijker dan componenten; investeer daar eerst. Elke breaking change heeft een migratiepad nodig, niet alleen een changelog-vermelding. En meet adoptie: als teams het systeem niet gebruiken, zoek dan uit waarom voordat je meer componenten toevoegt.
