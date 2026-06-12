---
title: 'Sobeltax — Réservation de Véhicules'
excerpt: "Application web SSR pour la location de véhicules en Belgique : tunnel de réservation multi-étapes, recherche d'agence géolocalisée et espace client complet."
category: 'Web App'
tags:
  ['Astro', 'Svelte', 'Fastify', 'TypeScript', 'OpenLayers', 'Redis', 'Docker']
year: '2025'
color: 'oklch(0.28 0.10 155)'
liveUrl: 'https://sobeltaxrental.be'
updatedDate: 2026-06-12
---

Sobeltax est une plateforme de location de véhicules ciblant le marché belge, disponible en français, néerlandais et anglais. L'enjeu était de livrer un tunnel de réservation fluide, une gestion multi-agences avec localisation cartographique et un espace client complet, dans une application performante sans dépendre d'un framework monolithique.

![Page d'accueil Sobeltax avec tunnel de réservation et flotte mise en avant](../../../assets/projects/sobeltax/home.png)

## Le problème

Le site historique tournait sur une stack legacy (pages `.awp` générées par WebDev) : difficile à faire évoluer, impossible à aligner sur l'image de la marque, et sans véritable tunnel de réservation en ligne. Les données métier — flotte, disponibilités, agences, comptes clients — vivaient déjà dans la plateforme interne `platform.sobeltaxrental.be`. Le nouveau site devait donc être un front pur : zéro base de données locale, chaque lecture et chaque écriture passe par l'API de la plateforme.

## Contraintes

- **Pas de base de données locale.** La plateforme métier reste la source de vérité unique ; le site consomme son API pour tout : disponibilités, agences, réservations, espace client.
- **Une API qui précède le site.** Elle n'a pas été dessinée pour ce front — certaines données (familles et catégories de véhicules notamment) arrivent incomplètes et demandent un mapping côté front.
- **Trois langues dès le premier jour** — `fr`, `nl`, `en`, sur le marché belge.
- **Authentification déléguée** : sessions côté site, tokens rafraîchis contre l'API de la plateforme via un middleware dédié.
- **Paiement par callbacks** d'un prestataire externe, à intégrer dans le tunnel sans en casser l'état.

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

![Catalogue de la flotte Sobeltax avec catégories Compact, Large et Full Size Hayon](../../../assets/projects/sobeltax/fleet.png)

## Recherche d'agence géolocalisée

La page agences intègre **OpenLayers 10** pour afficher le réseau sur une carte interactive. La recherche fonctionne par nom ou par adresse ; la liste des agences se synchronise avec l'état de la carte en temps réel. OpenLayers a été retenu comme alternative open source à Google Maps — sans quota ni coût d'API.

![Carte interactive OpenLayers affichant le réseau d'agences Sobeltax en Belgique](../../../assets/projects/sobeltax/agencies.png)

## Multi-langue belge

Le routing i18n suit le pattern Astro : `/` pour le français (locale par défaut, sans préfixe), `/nl/` et `/en/` pour le néerlandais et l'anglais. Les locales `fr-BE` et `nl-BE` sont déclarées dans le sitemap et les meta pour les formats de date et de devise adaptés au marché local.

## Déploiement

L'application tourne sur **Docker Swarm** avec un fichier Compose dédié à la production. Le serveur Fastify écoute sur le port 3000 derrière un reverse proxy. Le build multi-stage réduit la taille de l'image finale en séparant les dépendances de développement des artefacts de production.

## Ce qui a été livré

- 66 pages et 53 composants, sur 3 locales
- Tunnel de réservation en 5 étapes, espace client complet, 14 agences cartographiées, 10 familles de véhicules
- Environ 560 commits sur 17 mois (janvier 2025 → mai 2026) — le projet est en production et toujours activement maintenu
- Sessions Redis avec TTL de 7 jours, cache de disponibilité côté serveur

## Leçons

- **Une API qu'on ne contrôle pas se code défensivement.** Le rafraîchissement de tokens a produit ses cas limites, et les données incomplètes de l'API ont imposé un mapping en dur des catégories de véhicules côté front — un compromis qui fonctionne, mais qu'il faut maintenir à chaque évolution de la flotte.
- **Valider tôt, contre des cas réels.** La validation des numéros de TVA belges a généré plusieurs correctifs après coup ; des données de test réalistes dès le départ auraient coûté moins cher.
- **Redis entre le SSR et l'API change tout.** Le cache de disponibilité garde des pages rapides même quand la plateforme amont est lente — sur un site SSR adossé à une API tierce, c'est la différence entre un site vif et un site qui traîne la latence des autres.

