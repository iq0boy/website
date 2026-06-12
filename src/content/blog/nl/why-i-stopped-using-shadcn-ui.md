---
title: 'Ik ben gestopt met shadcn/ui — dit doe ik in de plaats'
excerpt: "Ik installeerde shadcn/ui op een project, gebruikte twee componenten, en besefte dat ik net code-om-te-onderhouden had geadopteerd. Negen projecten later doe ik het anders: DaisyUI + CSS-variabelen."
pubDate: 2026-06-12
category: 'Engineering'
readTime: 7
tags: ['shadcn/ui', 'DaisyUI', 'Tailwind', 'React', 'CSS', 'Design']
draft: true
---

![Coverbeeld — Ik ben gestopt met shadcn/ui](../../../assets/blog/why-i-stopped-using-shadcn-ui/hero.png)

Op een project vorig jaar deed ik wat iedereen doet: `npx shadcn init`, new-york-stijl, lucide, de aliassen netjes ingericht. Drie maanden later telde ik wat ik werkelijk gebruikte: **twee componenten**. Een knop en een navigatiemenu. Daarvoor had ik `cn()`, tailwind-merge, Radix-primitieven en een update-schuld gevendored die niemand ooit zal betalen.

Ondertussen draaien negen van mijn klantprojecten op DaisyUI zonder dat ik eraan denk. Dit is de redenering.

## TL;DR

shadcn/ui is uitstekend in wat het is: een start-designsystem voor een productteam dat het zal onderhouden. Voor een freelancer die klantsites oplevert — waar elk project zijn eigen identiteit nodig heeft en nul onderhoud na oplevering — is het het verkeerde gereedschap. Semantische klassen (DaisyUI), CSS-variabelen voor theming, en het zeldzame complexe component met de hand geschreven: minder sexy, veroudert beter.

## "You own the code" snijdt aan twee kanten

Het centrale argument van shadcn is verleidelijk: de code wordt naar jouw repo gekopieerd, jij bent eigenaar. Maar eigenaar zijn betekent **onderhouden**. Wanneer Radix een toegankelijkheidsbug fixt of shadcn een component herziet, beweegt jouw gevendorde kopie niet. Updaten betekent jouw aangepaste code diffen tegen de nieuwe canon, component per component. Op een product met een team gebeurt dat werk. Op een klantsite die acht maanden geleden werd opgeleverd, nooit.

Een gekopieerd component is geen dependency minder. Het is een **bevroren** dependency, zonder changelog.

## De instapkost is reëel

Je eerste shadcn-knop komt niet alleen: de `cn()`-utility, `tailwind-merge`, `class-variance-authority`, Radix-primitieven, aliasconventies. Redelijke tooling voor een designsystem. Buiten proportie voor een vitrinesite die een knop, een kaart en een formulier nodig heeft.

En dan is er de uniformiteit. shadcn is *dé* look van de productlanceringen van dit jaar geworden — zozeer dat "het lijkt op shadcn" designkritiek is. Mijn klanten betalen voor een identiteit; vertrekken van dezelfde kit als iedereen is vertrekken met een handicap.

## Wat ik in de plaats doe

**DaisyUI als basis.** Semantische klassen (`btn`, `card`, `badge`, `modal`) die de markup leesbaar houden — `class="btn btn-primary"` lees je over zes maanden nog vlot, een string van twintig Tailwind-utilities niet. Het is pure CSS: nul JavaScript, nul hydratatie, werkt in Astro, Svelte, React of helemaal niets.

**CSS-variabelen voor de identiteit.** Elk project herdefinieert een handvol variabelen (kleuren, radii, fonts) en DaisyUI volgt via `data-theme`. Op het NFC-kaartenplatform is dat tot het uiterste gedreven: elke klantenkaart injecteert **haar eigen kleuren als inline variabelen** en haar licht/donker-thema via `data-theme` — theming per databaserecord, zonder de globale CSS aan te raken.

```html
<div data-theme="dark" style="--card-bg: #16161f; --link-color: oklch(0.7 0.15 220)">
  <!-- Elke klant krijgt zijn kaart in zijn kleuren. Nul CSS per klant. -->
</div>
```

**Complexe componenten met de hand, als ze het verdienen.** Een echte date-picker of een toegankelijke combobox improviseer je niet — maar op een vitrinesite kom ik er één per jaar tegen. Die dag haal ik de juiste headless primitive binnen, voor dat ene component, en niets anders.

## Wanneer shadcn wél de juiste keuze blijft

Eerlijk: een React-productteam dat een intern dashboard bouwt, Radix-toegankelijkheid wil zonder ze met de hand te betalen, en het designsystem zal onderhouden — voor hen is shadcn een uitstekend startpunt. Mijn probleem is niet de kwaliteit van het project, maar de mismatch met het vak van klantsites opleveren die op eigen benen moeten staan.

## Conclusie

Open je laatste shadcn-project en tel de componenten in `components/ui/` die werkelijk ergens geïmporteerd worden. Vind je er minder dan vijf, dan gebruik je geen designsystem — je draagt het gewicht van een designsystem voor het voordeel van één knop.
