---
title: 'Tech Cards — Cartes de Visite NFC'
excerpt: 'SaaS multi-tenant de cartes de visite NFC : pages personnalisées par client, 20+ types de liens, système de badges, PWA installable et analytics sans cookies.'
category: 'Web App'
tags: ['Astro', 'React', 'Astro DB', 'Drizzle ORM', 'Tailwind', 'DaisyUI', 'Docker']
year: '2025'
color: 'oklch(0.24 0.09 265)'
liveUrl: 'https://nsmobile6k.be'
---

Tech Cards est une plateforme SaaS multi-tenant de cartes de visite NFC, déployée sous les domaines `nsmobile6k.be` et `techcard.be`. Chaque client dispose d'une page `/users/[slug]` entièrement personnalisée — logo, couleurs, liens, badges — accessible d'un simple effleurement de smartphone sur un support NFC.

![Landing marketing Tech Cards — « Révolutionnez votre business avec notre technologie NFC »](../../../assets/projects/tech-cards/hero.png)

## Architecture

Application **Astro 5 SSR** sur l'adaptateur Node.js standalone. La persistance se fait sur **Astro DB** (SQLite hébergé via libSQL), interrogée avec **Drizzle ORM**. Les composants interactifs sont en **React 19** ; l'UI utilise **Tailwind + DaisyUI** pour le theming de base et des variables CSS inline pour les couleurs per-card. Les mutations passent par les **Astro Actions** plutôt que des routes API ad hoc — type-safe de bout en bout et validées par **Zod**.

```
Node.js (entry.mjs)
    │
    └── Runtime Astro SSR
            ├── Pages publiques    /users/[slug], /users/[slug]/badges/[id]
            ├── Espace utilisateur /cards, /cards/[slug]/edit, /profile
            ├── Panel admin        /admin/cards, /admin/access
            └── Astro Actions      CRUD cartes, liens, badges, auth
```

Les sessions sont gérées avec le driver expérimental `fs-lite` d'Astro, persisté dans un volume Docker dédié.

## Gamme de supports

La landing publique vend quatre supports NFC physiques — plaques, tags, stickers et cartes — tous adossés au même enregistrement de carte dans la plateforme.

![Gamme produits — plaques, tags, stickers et cartes](../../../assets/projects/tech-cards/products.png)

## Panel admin

Les admins créent les slugs, gèrent les assets et nettoient le catalogue depuis un seul tableau de bord. Chaque carte dispose d'un formulaire `/cards/[slug]/edit` où le client (ou l'agence pour lui) configure tout ce qui suit.

![Tableau admin des cartes avec le catalogue client complet](../../../assets/projects/tech-cards/admin-cards.png)

## Personnalisation par carte

Chaque carte expose un ensemble de propriétés configurables :

- **Couleurs** — fond de carte, texte, fond logo, couleur des liens : toutes injectées en style inline pour un rendu fidèle sans CSS global à surcharger.
- **Thème DaisyUI** — appliqué via `data-theme` pour le mode clair/sombre par client.
- **Rayon** — style `rounded` ou `square` piloté par le champ `theme`.

## Système de liens

La carte affiche jusqu'à **8 liens** sur une grille à 2 colonnes. Chaque lien a un type parmi 20+ — téléphone, WhatsApp, Instagram, TikTok, Google Maps, avis Google, menus, commande en ligne, calendrier, formulaire, etc. La taille (`small` / `large`) pilote l'occupation de 1 ou 2 colonnes.

## Badges

Les badges sont des boutons visuels associés à une image ou un logo, avec lien optionnel ou page dédiée `/users/[slug]/badges/[id]`. Les clients s'en servent pour afficher des certifications, des promos en cours, un menu ou du contenu média riche directement sur la carte.

![Carte client en production — restaurant « Black and White » : 8 types de liens et 3 badges](../../../assets/projects/tech-cards/card-view.png)

## PWA installable

Chaque page carte génère dynamiquement un **Web App Manifest** inline — `id`, `start_url`, `scope`, couleurs et icônes sont calculés à partir de l'enregistrement de la carte. L'utilisateur final ajoute la carte sur son écran d'accueil sans passer par un store ; la page se lance en `fullscreen` sans chrome du navigateur, ce qui rend l'expérience indistinguable d'une app native pour les visites répétées.

## Analytics sans cookies

Les visites et clics sont tracés via un service interne (`holmes.nsmobile.be`). Chaque événement — chargement de page ou clic sur un lien/badge — envoie un `POST /api/hits/[slug]/[action]`. Aucun cookie, aucun JS tiers, pas de bannière de consentement.

## Déploiement

L'application tourne sur **Docker Compose** derrière un reverse proxy **Caddy** configuré par labels de container. Deux volumes sont montés : `data/` pour les sessions et la base SQLite locale, et `dist/client/assets/cards/` pour les assets des cartes (logos, badges) persistés entre les rebuilds.
