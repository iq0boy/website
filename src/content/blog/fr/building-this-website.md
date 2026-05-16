---
title: 'Comment j''ai construit ce site avec Astro, React et Claude Code'
excerpt: 'Pourquoi Astro plutôt que Next.js, comment j''ai monté l''i18n trilingue, et la liste de tout ce que j''ai branché sur le SEO de ce site.'
pubDate: 2026-05-14
category: 'Build'
readTime: 7
tags: ['Astro', 'React', 'SEO', 'i18n', 'Claude Code']
---

![Visuel d'en-tête — Comment j'ai construit ce site avec Astro](../../../assets/blog/building-this-website/hero.png)

Refaire son propre site, c'est le projet qu'on repousse à l'infini — parce qu'aucun client ne paie pour. J'ai fini par y consacrer quelques soirées : une pour l'architecture, une pour le contenu, une pour le SEO. Voici les choix que j'ai faits et pourquoi.

## Astro plutôt que Next.js

J'ai démarré sur Next.js par réflexe. Au bout d'une heure, je l'ai jeté.

Le site est statique. Aucun composant n'a besoin de rendu serveur. Pas de session, pas de paywall, pas de revalidation incrémentale. Next.js me facturait un runtime React entier pour livrer un blog et un portfolio.

Astro fait exactement le compromis inverse : tout est statique par défaut, et les composants React passent en `client:load` (ou `client:visible`, ou `client:idle`) **uniquement** là où l'interactivité l'exige. Sur ce site, ça donne trois îlots React — la nav, le formulaire de contact, le modal de recherche — et tout le reste est du HTML servi en moins de 30 ko.

Lighthouse mobile : 100 / 100 / 100 / 100. C'était l'objectif.

## L'i18n sans framework supplémentaire

Trois langues, FR par défaut. Astro 6 a un i18n intégré, mais il fait juste le routage — pour les traductions, j'avais le choix entre `i18next`, `astro-i18n`, ou rouler ma propre solution.

J'ai roulé ma propre solution. Tout tient dans `src/lib/i18n.ts` :

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

Pas de JSON externe, pas de loader async, pas de hot-reload bizarre. 300 lignes de TypeScript et toute l'interface est traduite. Quand j'ajoute une chaîne, je l'ajoute aux trois locales dans le même commit — git me sert de garde-fou.

Le routage suit la convention Astro : `src/pages/` est FR, `src/pages/[lang]/` est EN+NL via `getStaticPaths`. Les balises `<link rel="alternate" hreflang>` sont générées dans le layout, et le sitemap inclut les variantes via la config `i18n` du plugin `@astrojs/sitemap`.

## Le contenu en collections

Blog et projets vivent dans `src/content/{blog,projects}/<lang>/<slug>.md`. Schéma Zod, validation à la compilation, types générés automatiquement :

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

Le `!**/_*.md` exclut les templates (`_template.md`) qui servent de squelette quand je démarre un nouveau projet. Sans ce filtre, ils planteraient le build à la validation.

## SEO : tout ce qui compte vraiment

Les listes Lighthouse sont une distraction. Pour qu'un site se positionne, il faut :

1. **Un sitemap propre avec hreflang** — fait par `@astrojs/sitemap`, qui émet des `xhtml:link` pour chaque URL.
2. **Un `WebSite` JSON-LD global** — eligible pour le sitelinks search box.
3. **Un `Person` + `ProfessionalService` JSON-LD sur l'accueil** — déclare aux moteurs que tu es une vraie personne et un vrai business, avec `areaServed`, `priceRange`, `contactPoint`.
4. **Un `Article` + `BreadcrumbList` JSON-LD sur chaque post** — ce que tu lis là, en bas du HTML.
5. **Un `FAQPage` JSON-LD sur la page Services** — rich snippet quasi-garanti si les questions sont pertinentes.
6. **Un OG image par post**, généré dynamiquement avec Satori — gros gain de CTR sur LinkedIn et X.

Et surtout : **canonical URLs** correctes, **alternates** correctes, **dates ISO** correctes. Quatre-vingts pour cent des erreurs SEO viennent de bricoles bêtes dans les en-têtes.

## Performance

Trois leviers, par ordre d'impact :

- **Self-hosted fonts** via `@fontsource`. Pas de `fonts.googleapis.com`, pas de DNS lookup tiers, pas de FOIT.
- **Image optimization built-in** : les images du portfolio vivent dans `src/assets/projects/<slug>/` et sont référencées en chemin relatif. Astro génère du WebP avec largeur/hauteur intrinsèques. Sur ce site, **5,8 Mo de PNG ont été compressés à 780 ko de WebP**.
- **`<ViewTransitions />`** : la navigation est animée nativement, mais surtout, la nav et le modal de recherche sont marqués `transition:persist`, donc leur état (scroll, query) survit aux navigations.

## La recherche

[Pagefind](https://pagefind.app). Zéro runtime au load, indexation post-build, ~150 ko d'index pour 24 pages × 3 langues. Le modal s'ouvre avec ⌘K (ou `/`) et lazy-load `/pagefind/pagefind.js` à la première ouverture.

```ts
const mod = await import(/* @vite-ignore */ url);
await mod.init();
```

Le `@vite-ignore` est obligatoire — sinon Rollup essaie de résoudre l'import au build et fail.

## Claude Code dans la boucle

J'ai écrit la quasi-totalité du SEO, du i18n et du modal de recherche en pair avec [Claude Code](https://claude.com/claude-code). Pas en mode "génère-moi un site" — en mode "voici la structure que je veux, valide les choix, écris le code, montre-moi le diff". Le résultat tient mieux que ce que j'aurais écrit seul, parce que j'ai eu un binôme infatigable pour challenger les détails (genre : "pourquoi tu hardcodes `https://josephpire.dev` alors qu'Astro a `Astro.site` ?").

J'écris un post séparé sur ma config Claude Code et les plugins que j'utilise vraiment.

## Pour finir

Quelques soirées de travail. Un score Lighthouse propre, un SEO carré, trois langues, et un blog qui me permet enfin d'écrire **ça**. C'est suffisant.

Le code est lisible sur [GitHub](https://github.com/iq0boy) — si quelque chose t'intrigue, écris-moi.
