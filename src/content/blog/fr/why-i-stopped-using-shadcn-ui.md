---
title: "J'ai arrêté shadcn/ui — voici ce que je fais à la place"
excerpt: "J'ai installé shadcn/ui sur un projet, utilisé deux composants, et compris que je venais d'adopter du code à maintenir. Neuf projets plus tard, je fais autrement : DaisyUI + variables CSS."
pubDate: 2026-06-12
category: 'Engineering'
readTime: 7
tags: ['shadcn/ui', 'DaisyUI', 'Tailwind', 'React', 'CSS', 'Design']
draft: true
---

![Visuel d'en-tête — J'ai arrêté shadcn/ui](../../../assets/blog/why-i-stopped-using-shadcn-ui/hero.png)

Sur un projet l'an dernier, j'ai fait comme tout le monde : `npx shadcn init`, style new-york, lucide, les alias bien rangés. Trois mois plus tard, j'ai compté ce que j'utilisais réellement : **deux composants**. Un bouton et un menu de navigation. Pour ça, j'avais vendored `cn()`, tailwind-merge, des primitives Radix et une dette de mise à jour que personne ne paiera jamais.

Pendant ce temps, neuf de mes projets clients tournent sur DaisyUI sans que j'y pense. Voici le raisonnement.

## TL;DR

shadcn/ui est excellent pour ce qu'il est : un design system de départ pour une équipe produit qui va le faire vivre. Pour un freelance qui livre des sites clients — où chaque projet doit avoir sa propre identité et coûter zéro maintenance après livraison — c'est le mauvais outil. Des classes sémantiques (DaisyUI), des variables CSS pour le theming, et les rares composants complexes écrits à la main : c'est moins sexy et ça vieillit mieux.

## « You own the code » coupe dans les deux sens

L'argument central de shadcn est séduisant : le code est copié chez toi, tu en es propriétaire. Mais propriétaire, ça veut dire **mainteneur**. Quand Radix corrige un bug d'accessibilité ou que shadcn révise un composant, ton exemplaire vendored ne bouge pas. Le mettre à jour, c'est diff-er ton code modifié contre le nouveau canon, composant par composant. Sur un produit avec une équipe, ce travail se fait. Sur un site client livré il y a huit mois, il ne se fera jamais.

Un composant copié n'est pas une dépendance en moins. C'est une dépendance **gelée**, sans changelog.

## Le coût d'entrée est réel

Le premier bouton shadcn n'arrive pas seul : utilitaire `cn()`, `tailwind-merge`, `class-variance-authority`, primitives Radix, conventions d'alias. C'est de l'outillage raisonnable pour un design system. C'est disproportionné pour un site vitrine qui a besoin d'un bouton, d'une carte et d'un formulaire.

Et il y a l'uniformité. shadcn est devenu *le* look des produits lancés cette année — au point que « ça ressemble à du shadcn » est une critique de design. Mes clients paient pour une identité ; partir du même kit que tout le monde, c'est partir avec un handicap.

## Ce que je fais à la place

**DaisyUI pour la base.** Des classes sémantiques (`btn`, `card`, `badge`, `modal`) qui gardent le markup lisible — `class="btn btn-primary"` se relit dans six mois, une chaîne de vingt utilitaires Tailwind non. C'est du CSS pur : zéro JavaScript, zéro hydratation, ça marche en Astro, Svelte, React ou rien du tout.

**Des variables CSS pour l'identité.** Chaque projet redéfinit une poignée de variables (couleurs, rayons, fontes) et DaisyUI suit via `data-theme`. Sur la plateforme de cartes NFC, c'est poussé au maximum : chaque carte cliente injecte **ses propres couleurs en variables inline** et son thème clair/sombre par `data-theme` — du theming par enregistrement de base de données, sans toucher au CSS global.

```html
<div data-theme="dark" style="--card-bg: #16161f; --link-color: oklch(0.7 0.15 220)">
  <!-- Chaque client a sa carte à ses couleurs. Zéro CSS par client. -->
</div>
```

**Les composants complexes à la main, quand ils se justifient.** Un vrai date-picker ou un combobox accessible, ça ne s'improvise pas — mais sur un site vitrine, j'en croise un par an. Ce jour-là, je prends la primitive headless qu'il faut, pour ce composant-là, et rien d'autre.

## Quand shadcn reste le bon choix

Honnêtement : une équipe produit React qui construit un dashboard interne, qui veut l'accessibilité Radix sans la payer à la main, et qui fera vivre le design system — shadcn est un excellent point de départ. Mon problème n'est pas la qualité du projet, c'est l'inadéquation avec le travail de livrer des sites clients qui doivent vivre seuls.

## À retenir

Ouvre ton dernier projet shadcn et compte les composants de `components/ui/` réellement importés quelque part. Si tu en trouves moins de cinq, tu n'utilises pas un design system — tu transportes le poids d'un design system pour le bénéfice d'un bouton.
