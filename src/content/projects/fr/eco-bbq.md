---
title: 'Eco-BBQ — Site Marketing du Barbecue Jetable Éco'
excerpt: "Site marketing et de génération de leads trilingue pour un kit barbecue jetable zéro déchet : Astro + îlots Svelte, carrousels Swiper, carte des revendeurs OpenLayers et tunnel partenariat B2B."
category: 'Web App'
tags: ['Astro', 'Svelte', 'Tailwind', 'DaisyUI', 'OpenLayers', 'Swiper', 'TypeScript']
year: '2025'
color: 'oklch(0.30 0.08 145)'
liveUrl: 'https://www.eco-bbq.eu/'
updatedDate: 2026-06-12
---

Eco-BBQ est un kit barbecue jetable zéro déchet distribué en Belgique, en France, en Espagne et au Portugal. Le site joue à la fois le rôle de vitrine grand public (comment ça marche, où l'acheter) et celui d'entonnoir B2B pour les revendeurs qui veulent référencer le produit. Trois locales, entièrement statique, hébergé chez Combell.

![Hero Eco-BBQ avec le kit produit et trois pastilles de bénéfices : rapide, zéro déchet, simple](../../../assets/projects/eco-bbq-v2/hero.png)

## Le problème

Ce site est une v2 — et la v1 est la vraie leçon du projet. La première version avait accumulé 79 commits sur deux mois : animations GSAP partout, une page « story », un carrousel Svelte tiers… et plus de vingt correctifs de layout et d'overflow causés par cette complexité. Le build pesait 30 Mo pour une landing page. Plutôt que de continuer à rafistoler, le site a été réécrit de zéro sur une base volontairement plus simple.

## Contraintes

- **Hébergement mutualisé Combell** : statique uniquement, pas de serveur, pas de build côté hébergeur.
- **Capter des leads sans backend** — contact grand public et candidatures revendeurs B2B.
- **Trois locales avec slugs traduits** (`/fr/partenariat`, `/en/partnership`, `/nl/partnerschap`).
- **Réécriture courte** : la v2 devait sortir vite pour ne pas immobiliser le client une deuxième fois.

## Architecture

Astro 5 en mode entièrement statique avec Tailwind et DaisyUI pour le design system. La plupart de la page tient dans des composants `.astro` rendus serveur, sans JavaScript livré au client ; le seul îlot hydraté est la carte des revendeurs en **Svelte 5**, qu'il serait gaspilleur de bundler pour chaque visiteur qui passe à côté.

```
Composants .astro       →  Navbar, Hero, Bénéfices, Comment ça marche, Témoignages, Footer
Îlot Svelte 5           →  Carte revendeurs OpenLayers (Map.svelte)
Swiper 11 vanilla       →  Carrousel hero + carrousel témoignages
```

Swiper est chargé en bundle standalone pour les deux carrousels plutôt qu'enveloppé dans un framework — le coût runtime reste minimal et on évite de tirer React ou Vue juste pour piloter un slider.

## Comment Ça Marche

La section « comment ça marche » combine une vidéo explicative YouTube et une frise de quatre pictogrammes. Le contenu (titres, descriptions, illustrations) vient des modules `src/i18n/translatedContent/*.js`, donc éditer la copie ne demande pas de toucher au markup.

![Comment ça marche — vidéo explicative YouTube et 4 pictogrammes](../../../assets/projects/eco-bbq-v2/how.png)

## Témoignages

Huit vrais témoignages clients par langue sont rendus en grille statique sur desktop et en carrousel Swiper sur mobile. Chaque carte est du HTML rendu côté serveur ; le JS du carrousel ne s'attache que sous le breakpoint mobile, donc les visiteurs desktop ne le payent pas.

![Grille de témoignages — avis clients réels avec leurs prénoms](../../../assets/projects/eco-bbq-v2/testimonials.png)

## Carte des Revendeurs

La section « Nous trouver » utilise **OpenLayers 8** pour afficher le réseau de revendeurs sur une carte interactive, avec une liste filtrable synchronisée à l'état de la carte. OpenLayers a été choisi plutôt que Google Maps pour garder la carte sans quota API ni cookie de tracking — le site n'affiche pas de bannière de consentement parce qu'il ne charge aucun tracker tiers sur la page d'accueil.

![Trouver un revendeur — logos partenaires, liste filtrable et carte OpenLayers du réseau](../../../assets/projects/eco-bbq-v2/find-us.png)

## i18n & Tunnel Partenariat

Trois locales (`fr`, `en`, `nl`) avec le préfixe français conservé (`/fr/`, pas la racine) pour garder une structure d'URL uniforme. Les slugs de route sont traduits par locale — `/fr/partenariat`, `/en/partnership`, `/nl/partnerschap` — gérés par une page dynamique `[lang]/[partnership].astro` avec un formulaire B2B branché sur Formspree. L'intégration sitemap génère automatiquement les entrées par locale.

## Hébergement

Build statique poussé sur l'hébergement mutualisé **Combell**. Pas de serveur, pas de base de données, pas d'API — le formulaire de contact part chez Formspree et le formulaire partenariat sur un autre endpoint Formspree, donc le site peut rester sur une infrastructure statique économique tout en captant des leads.

## Ce qui a été livré

- Réécriture complète en 33 jours et 35 commits (21 décembre 2024 → 23 janvier 2025)
- Build divisé par presque trois : 30 Mo → 11 Mo (−63 %)
- 7 pages HTML sur 3 locales, 61 points de vente sur la carte, 8 témoignages par langue, 9 logos partenaires
- Deux entonnoirs de leads Formspree : contact grand public et partenariat B2B

## Leçons

- **Réécrire a coûté moins cher que rafistoler.** La v1 accumulait les correctifs de layout dus aux animations ; la v2 supprime GSAP, la page « story » et le carrousel tiers, et les bugs ont disparu avec la complexité.
- **Un seul îlot hydraté suffit.** Seule la carte des revendeurs justifie du JavaScript de framework ; tout le reste est du HTML statique. Chaque ajout d'interactivité doit gagner sa place.
- **Moins de bibliothèques, moins de bugs d'intégration.** Swiper en standalone remplace le carrousel Svelte tiers qui causait des problèmes en v1 — une dépendance éprouvée plutôt que deux fragiles.
