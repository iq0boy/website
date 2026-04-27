---
title: "Carder — Cartes de Visite NFC"
excerpt: "Plateforme multi-tenant de cartes de visite NFC : pages personnalisées par client, 20+ types de liens, système de badges, PWA installable et analytics custom."
category: "Web App"
tags: ["Astro", "React", "Astro DB", "Drizzle ORM", "Tailwind", "DaisyUI", "Docker"]
year: "2025"
color: "oklch(0.24 0.09 265)"
liveUrl: "https://nsmobile6k.be"
---

Carder est une plateforme SaaS multi-tenant de cartes de visite NFC destinée au marché belge, déployée sous les domaines `nsmobile6k.be` et `techcard.be`. Chaque client dispose d'une page `/users/[slug]` entièrement personnalisée — logo, couleurs, liens, badges — accessible d'un simple effleurement de smartphone sur un support NFC.

## Architecture

L'application est construite en **Astro 5 SSR** avec l'adaptateur Node.js standalone. La base de données est **Astro DB** (SQLite hébergé via libSQL), interrogée avec **Drizzle ORM**. Les composants interactifs sont en **React 19** ; l'UI utilise **Tailwind + DaisyUI** pour le theming par défaut et des variables CSS inline pour les couleurs per-card.

```
Node.js (entry.mjs)
    │
    └── Astro SSR runtime
            ├── Pages publiques  (/users/[slug], /users/[slug]/badges/[id])
            ├── Espace utilisateur (/cards, /profile)
            ├── Panel admin      (/admin/cards, /admin/access)
            └── Actions Astro    (CRUD cartes, liens, badges, auth)
```

Les sessions sont gérées avec le driver expérimental `fs-lite` d'Astro, persisté dans un volume Docker dédié.

## Personnalisation par carte

Chaque carte expose un ensemble de propriétés configurables :

- **Couleurs** — fond de carte, texte, fond logo, couleur des liens : toutes injectées en style inline pour un rendu fidèle sans CSS global à surcharger.
- **Thème DaisyUI** — appliqué via `data-theme` pour le mode clair/sombre par client.
- **Rayon** — style `rounded` ou `square` piloté par le champ `theme`.

## Système de liens

La carte affiche jusqu'à **8 liens** répartis sur une grille 2 colonnes. Chaque lien a un type parmi 20+  : téléphone, WhatsApp, Instagram, TikTok, Google Maps, avis Google, menus, commande en ligne, calendrier, formulaire, etc. La taille (`small` / `large`) pilote l'occupation de 1 ou 2 colonnes dans la grille.

## Badges

Les badges sont des boutons visuels associés à une image ou un logo, avec lien optionnel ou page dédiée `/users/[slug]/badges/[id]`. Ils permettent d'afficher des certifications, promotions ou contenus médias directement sur la carte.

## PWA installable

Chaque page carte génère dynamiquement un **Web App Manifest** inline — `id`, `start_url`, `scope`, couleurs et icônes sont calculés à partir des données de la carte. L'utilisateur final peut ajouter la carte sur son écran d'accueil sans passer par un store, avec un affichage `fullscreen`.

## Analytics custom

Les visites et clics sont tracés via un service interne (`holmes.nsmobile.be`). Chaque événement — chargement de page ou clic sur un lien/badge — envoie un `POST /api/hits/[slug]/[action]`. Aucun cookie, aucune dépendance à un tiers.

## Déploiement

L'application tourne sur **Docker Compose** derrière un reverse proxy **Caddy** (configuré via labels). Deux volumes sont montés : le dossier `data/` pour les sessions et la base SQLite locale, et `dist/client/assets/cards/` pour les assets des cartes (logos, badges) persistés entre les rebuilds.
