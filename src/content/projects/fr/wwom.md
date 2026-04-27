---
title: "Wwom — Campagnes SMS pour Salons"
excerpt: "Application B2B de gestion de campagnes SMS et de validation de codes promotionnels pour salons de coiffure et de beauté, avec tableau de bord par enseigne."
category: "Web App"
tags: ["Nuxt", "Vue", "Strapi", "MongoDB", "Tailwind", "OVH SMS", "PWA"]
year: "2023"
color: "oklch(0.26 0.10 310)"
---

Wwom est une application B2B permettant aux salons de coiffure et de beauté de créer, envoyer et suivre des campagnes SMS marketing, et de gérer des codes promotionnels à valider en caisse.

## Architecture

```
Nuxt 2 (front)          Strapi 3 (back)
     │                       │
     ├── @nuxtjs/auth-next    ├── strapi-connector-mongoose (MongoDB)
     ├── @nuxtjs/axios        ├── strapi-plugin-users-permissions (JWT)
     ├── Vuex                 ├── ovh (API SMS OVH)
     └── Tailwind CSS         └── API REST auto-générée
```

Chaque salon dispose de son propre espace : les campagnes sont filtrées par identifiant de salon (`/salons/:id/campaigns`). L'authentification repose sur le système JWT intégré à Strapi, géré côté front par `@nuxtjs/auth-next`.

## Gestion des campagnes SMS

L'interface principale affiche la liste des campagnes du salon connecté avec création, modification et suppression individuelle ou par lot. Chaque campagne dispose d'un rapport de livraison SMS récupéré depuis l'API OVH, et d'un paramétrage du nombre de visites requis avant déclenchement.

## Validation de codes

Une page dédiée permet au personnel en salon de saisir un code promotionnel et d'obtenir instantanément son statut :

- **À vérifier** — code inconnu ou en attente
- **Code valide** — code actif, marqué comme utilisé après confirmation
- **Code utilisé** — code déjà consommé

Le résultat est affiché visuellement avec un jeu d'icônes cadenas ouvert/fermé et un code couleur vert/rouge.

## PWA

L'application est configurée comme **Progressive Web App** via `@nuxtjs/pwa`, installable sur tablette en caisse sans passer par un store.
