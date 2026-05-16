---
title: 'Hoe ik deze site bouwde met Astro, React en Claude Code'
excerpt: 'Waarom Astro in plaats van Next.js, hoe ik een drietalige i18n-setup oplever, en de volledige lijst van SEO-knoppen die ik op deze site heb omgezet.'
pubDate: 2026-05-14
category: 'Build'
readTime: 7
tags: ['Astro', 'React', 'SEO', 'i18n', 'Claude Code']
---

![Headerbeeld — Hoe ik deze site bouwde met Astro](../../../assets/blog/building-this-website/hero.png)

Je eigen site herbouwen is het project dat iedereen eindeloos uitstelt — omdat geen enkele klant ervoor betaalt. Ik heb er uiteindelijk een paar avonden aan besteed: één voor de architectuur, één voor de content, één voor de SEO. Hier zijn de keuzes die ik maakte, en waarom.

## Astro in plaats van Next.js

Ik begon uit gewoonte in Next.js. Na een uur gooide ik het weg.

De site is statisch. Geen enkel component heeft server-rendering nodig. Geen sessies, geen paywall, geen incremental revalidation. Next.js rekende mij een volledige React-runtime aan om een blog en een portfolio te serveren.

Astro maakt precies de tegenovergestelde keuze: alles is standaard statisch, en React-componenten hydraten met `client:load` (of `client:visible`, of `client:idle`) **alleen** waar interactiviteit het vereist. Op deze site geeft dat drie React-eilanden — de nav, het contactformulier, de zoekmodal — en de rest wordt geserveerd als HTML van minder dan 30 kB.

Lighthouse mobile: 100 / 100 / 100 / 100. Dat was het doel.

## i18n zonder extra framework

Drie talen, FR als default. Astro 6 heeft ingebouwde i18n, maar alleen voor routing — voor de vertalingen zelf had ik de keuze tussen `i18next`, `astro-i18n`, of mijn eigen oplossing schrijven.

Ik schreef mijn eigen oplossing. Alles past in `src/lib/i18n.ts`:

```ts
export const TRANSLATIONS = {
  fr: { nav_home: 'Accueil', /* … */ },
  en: { nav_home: 'Home',    /* … */ },
  nl: { nav_home: 'Home',    /* … */ },
} as const;

export function useLang(lang: Lang) {
  return { t: (key: string) => TRANSLATIONS[lang][key] ?? key };
}
```

Geen externe JSON, geen async loader, geen rare hot-reload. 300 regels TypeScript en de hele UI is vertaald. Als ik een string toevoeg, voeg ik hem aan alle drie de locales toe in dezelfde commit — git is mijn vangnet.

De routing volgt de Astro-conventie: `src/pages/` serveert FR, `src/pages/[lang]/` serveert EN+NL via `getStaticPaths`. De `<link rel="alternate" hreflang>`-tags worden gegenereerd in de layout, en de sitemap bevat de varianten via de `i18n`-optie van `@astrojs/sitemap`.

## Content als collecties

Blog en projecten leven onder `src/content/{blog,projects}/<lang>/<slug>.md`. Zod-schema, validatie tijdens compilatie, types automatisch gegenereerd:

```ts
const blog = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    pubDate: z.date(),
    category: z.string(),
    readTime: z.number(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});
```

De `!**/_*.md` sluit templates uit (`_template.md`) die ik als skelet gebruik wanneer ik een nieuw project start. Zonder die filter zouden ze de build doen crashen tijdens validatie.

## SEO: wat écht telt

Lighthouse-checklists zijn een afleiding. Om te ranken heb je nodig:

1. **Een schone sitemap met hreflang** — gedaan door `@astrojs/sitemap`, dat `xhtml:link` emit per URL.
2. **Een globale `WebSite` JSON-LD** — geldig voor de sitelinks-zoekbox.
3. **`Person` + `ProfessionalService` JSON-LD op de homepage** — vertelt zoekmachines dat je een echt persoon en een echt bedrijf bent, met `areaServed`, `priceRange`, `contactPoint`.
4. **`Article` + `BreadcrumbList` JSON-LD op elke post** — wat je nu leest, onderaan de HTML.
5. **`FAQPage` JSON-LD op de Diensten-pagina** — bijna gegarandeerd rich snippet als de vragen relevant zijn.
6. **Een OG-image per post**, dynamisch gegenereerd met Satori — grote CTR-boost op LinkedIn en X.

En vooral: correcte **canonical URLs**, correcte **alternates**, correcte **ISO-datums**. Tachtig procent van de SEO-fouten komt door domme slordigheden in de headers.

## Performance

Drie hefbomen, in volgorde van impact:

- **Self-hosted fonts** via `@fontsource`. Geen `fonts.googleapis.com`, geen DNS-lookup van derden, geen FOIT.
- **Ingebouwde image-optimalisatie**: portfolio-afbeeldingen staan in `src/assets/projects/<slug>/` en worden via een relatief pad gerefereerd. Astro genereert WebP met intrinsieke breedte/hoogte. Op deze site werd **5,8 MB aan PNG's gecomprimeerd tot 780 kB aan WebP's**.
- **`<ViewTransitions />`**: navigatie wordt native geanimeerd, maar belangrijker nog: de nav en de zoekmodal zijn gemarkeerd als `transition:persist`, waardoor hun state (scroll, query) navigatie overleeft.

## Zoekfunctie

[Pagefind](https://pagefind.app). Geen runtime bij laden, indexatie na de build, ~150 kB index voor 24 pagina's × 3 talen. De modal opent met ⌘K (of `/`) en lazy-load `/pagefind/pagefind.js` bij de eerste opening.

```ts
const mod = await import(/* @vite-ignore */ url);
await mod.init();
```

De `@vite-ignore` is verplicht — anders probeert Rollup de import tijdens de build te resolven en faalt het.

## Claude Code in de loop

Ik schreef vrijwel alle SEO, i18n en de zoekmodal samen met [Claude Code](https://claude.com/claude-code). Niet in "genereer een site voor me"-modus — in "hier is de structuur die ik wil, valideer de keuzes, schrijf de code, toon me het diff"-modus. Het resultaat is beter dan wat ik alleen had geschreven, omdat ik een onvermoeibare partner had die de details uitdaagde (zoals: "waarom hardcodeer je `https://josephpire.dev` terwijl Astro `Astro.site` heeft?").

Ik schrijf een aparte post over mijn Claude Code-setup en de plugins die ik écht gebruik.

## Tot slot

Een paar avonden werk. Een nette Lighthouse-score, strakke SEO, drie talen, en een blog waarmee ik eindelijk **dit** kan schrijven. Dat is genoeg.

De code is leesbaar op [GitHub](https://github.com/iq0boy) — als iets je intrigeert, stuur me een berichtje.
