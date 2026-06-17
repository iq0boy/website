---
title: 'Listify — Listes Collaboratives Temps Réel'
excerpt: "Application de listes et kanban collaboratives en temps réel, construite sur Elixir/Phoenix/Ash : synchronisation live, rôles et invitations, verrouillage optimiste, ordre LexoRank et conformité RGPD."
category: 'Web App'
tags: ['Elixir', 'Phoenix', 'Ash', 'LiveView', 'PostgreSQL', 'Oban', 'Docker']
year: '2026'
color: 'oklch(0.30 0.10 290)'
liveUrl: 'https://listify.josephpire.dev'
updatedDate: 2026-06-17
---

Listify est une application de **listes et tableaux kanban collaboratifs en temps réel** : plusieurs personnes éditent les mêmes listes, voient les changements apparaître instantanément, et gèrent membres, rôles et notifications. Un projet greenfield piloté par une spécification détaillée, en production et auto-hébergé.

![Tableau de bord Listify — « Mes listes » avec listes actives, partagées et barres de progression](../../../assets/projects/listify/dashboard.png)

## Le problème

Je voulais un terrain réel pour pousser la stack **Elixir/Phoenix/Ash** sur un domaine non trivial : la collaboration temps réel. Pas un todo-list de démo, mais une application complète — concurrence d'édition, rôles, invitations, notifications, audit, RGPD — pilotée par une spec écrite avant le code, pour verrouiller les décisions d'architecture en amont plutôt que de les improviser.

## Contraintes

- **Temps réel multi-utilisateur** sans conflits perdus ni payloads périmés.
- **Décisions d'archi figées dès la spec** (v1.3/v1.4, sections numérotées) : ordre, verrouillage, topologie des files de jobs.
- **Auto-hébergement** : tout doit tenir dans un déploiement Docker Swarm sans service managé tiers.
- **Conformité RGPD** dès le départ (export de données, suppression de compte).

## Architecture

L'application est 100 % **Phoenix LiveView** — aucun framework SPA, l'interactivité est pilotée par le serveur via WebSocket. La logique métier, la persistance et l'autorisation passent par **Ash 3.4** (AshPostgres), organisée en domaines : `Accounts`, `Lists`, `Messaging`, `Notifications`, `Audit`, `Backups`, `Moderation`.

```
Phoenix LiveView (UI server-driven)
    │
    ├── Ash domains (logique, autorisation, persistance)
    │      Accounts · Lists · Messaging · Notifications · Audit · Backups
    ├── Phoenix PubSub (signalisation temps réel)
    ├── Oban (jobs : mailer, exports, scheduled, critical)
    └── PostgreSQL 16 + Redis (sessions)
```

## Temps réel : la signalisation plutôt que le payload

Chaque mutation d'item ou de liste publie un message sur un topic PubSub (`items:list:<id>`). Mais le point clé : la LiveView **ne consomme pas le payload diffusé** — elle reçoit un simple signal (`{:item_updated, id}`) et **relit la ressource complète** via Ash, autorisations et policies appliquées. Le PubSub sert de mécanisme de signalisation, pas de transport de données — ce qui élimine la classe entière des bugs de « payload périmé ».

## Verrouillage optimiste sélectif

L'édition concurrente d'un item est protégée par un `lock_version` vérifié **atomiquement dans la clause SQL WHERE** (pas après lecture — donc pas de race). Un conflit renvoie un 409 avec la version serveur pour que le client recharge. Mais seuls les champs « lourds » (titre, description, labels) sont protégés ; les champs chauds (statut, rang, assignation) passent par des actions *last-write-wins* séparées pour rester rapides. Ce n'est pas du verrouillage pessimiste — c'est de la détection de conflit ciblée.

![Liste collaborative en vue kanban — colonnes À faire / En cours / Terminé, membres, rôles et messagerie](../../../assets/projects/listify/board.png)

## Ordre LexoRank

Le classement des items utilise **LexoRank** (chaînes de rang) plutôt que des positions entières : réordonner insère un rang *entre* deux voisins en O(1), sans jamais renuméroter ni verrouiller une séquence globale. Deux réordonnancements concurrents ne se coordonnent pas — la math des chaînes garantit la monotonie.

## Jobs en arrière-plan (Oban)

Topologie de files fixée dans la spec : `default` (10), `mailer` (5), `exports` (3), `scheduled` (2), `critical` (1). Une quinzaine de workers : mails d'invitation et de mention, rappels d'échéance, digest quotidien, réinitialisation des listes récurrentes, export RGPD, purge de compte différée, nettoyage des sauvegardes S3.

## Ce qui a été livré

- 33 jours, 185 commits — **en production** sur `listify.josephpire.dev` (Docker Swarm, 2 répliques, rolling updates)
- Auth (AshAuthentication + bcrypt + magic links), listes/items temps réel, rôles owner/editor/viewer, invitations
- Notifications (cloche + toast), journal d'audit append-only, export CSV, **API REST + doc OpenAPI/Swagger**
- RGPD : export de données et suppression de compte avec délai de grâce ; Web Push (PWA) ; sauvegardes S3

## Leçons

- **Une spec écrite avant le code fige les bonnes décisions.** Ordre LexoRank, stratégie de verrouillage, topologie Oban : décidés une fois, jamais re-débattus en cours de route.
- **Le PubSub comme signal, pas comme transport.** Diffuser un identifiant et relire derrière la couche d'autorisation est plus lent d'un aller-retour DB, mais supprime les fuites de données et les payloads périmés — un compromis qui en vaut la peine.
- **Ash récompense la rigueur.** Modéliser l'autorisation dans les ressources plutôt que dans les vues demande de la discipline au départ, puis chaque nouvelle surface (API REST, LiveView) en hérite gratuitement.
