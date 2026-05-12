---
title: 'Sobeltax — Réservation de Véhicules'
excerpt: "Application web SSR pour la location de véhicules en Belgique : tunnel de réservation multi-étapes, recherche d'agence géolocalisée et espace client complet."
category: 'Web App'
tags:
  ['Astro', 'Svelte', 'Fastify', 'TypeScript', 'OpenLayers', 'Redis', 'Docker']
year: '2025'
color: 'oklch(0.28 0.10 155)'
liveUrl: 'https://sobeltaxrental.be'
---

Sobeltax est une plateforme de location de véhicules ciblant le marché belge, disponible en français, néerlandais et anglais. L'enjeu était de livrer un tunnel de réservation fluide, une gestion multi-agences avec localisation cartographique et un espace client complet, dans une application performante sans dépendre d'un framework monolithique.

## Architecture

L'application est construite en **Astro 5 en mode SSR** avec l'adaptateur Node.js, servi par **Fastify 5** comme runtime HTTP. Les composants interactifs sont des îles **Svelte 5** : chaque page envoie uniquement le JavaScript des composants qu'elle utilise, sans bundle global. C'est un gain direct sur le Time to Interactive, particulièrement important sur mobile.

```
Fastify 5 (server.js)
    │
    ├── Middlewares : CORS, Helmet, static files
    │
    └── Astro SSR runtime
            ├── Pages .astro (rendu serveur)
            ├── Îles Svelte (interactivité ciblée)
            └── API routes (actions, callbacks paiement)
```

**Redis** cache les données de disponibilité des véhicules et les informations d'agences, pour éviter des appels répétés aux services tiers sur chaque requête.

## Tunnel de réservation en 5 étapes

Le cœur de l'application est un processus guidé :

1. **Dates et agence** — sélection via Pikaday et la carte OpenLayers
2. **Catégorie de véhicule** — filtrage dynamique selon disponibilité réelle
3. **Détails** — informations conducteur, options additionnelles
4. **Assurance** — sélection et validation de la couverture
5. **Confirmation** — récapitulatif et déclenchement du paiement

L'état du tunnel est persisté avec **Nanostores** côté client, ce qui permet à l'utilisateur de naviguer entre les étapes sans perdre les données saisies, même après un rechargement de page.

## Recherche d'agence géolocalisée

La page agences intègre **OpenLayers 10** pour afficher le réseau sur une carte interactive. La recherche fonctionne par nom ou par adresse ; la liste des agences se synchronise avec l'état de la carte en temps réel. OpenLayers a été retenu comme alternative open source à Google Maps — sans quota ni coût d'API.

## Multi-langue belge

Le routing i18n suit le pattern Astro : `/` pour le français (locale par défaut, sans préfixe), `/nl/` et `/en/` pour le néerlandais et l'anglais. Les locales `fr-BE` et `nl-BE` sont déclarées dans le sitemap et les meta pour les formats de date et de devise adaptés au marché local.

## Déploiement

L'application tourne sur **Docker Swarm** avec un fichier Compose dédié à la production. Le serveur Fastify écoute sur le port 3000 derrière un reverse proxy. Le build multi-stage réduit la taille de l'image finale en séparant les dépendances de développement des artefacts de production.

