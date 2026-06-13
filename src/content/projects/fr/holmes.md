---
title: "Holmes — Microservice d'Analytics"
excerpt: "Microservice Go de tracking d'événements : enregistrement de hits par client et par action, agrégation mensuelle, dashboard admin et interface client protégés par session."
category: "API"
tags: ["Go", "Echo", "GORM", "SQLite", "Templ", "Tailwind", "DaisyUI", "Docker"]
year: "2025"
color: "oklch(0.27 0.09 48)"
liveUrl: "https://holmes.nsmobile.be"
---

Holmes est le service d'analytics maison de la plateforme Carder. Il expose un endpoint public `POST /api/hits/:client_id/:action_id` consommé par chaque page de carte NFC pour tracer les vues et les clics sur les liens ou badges — sans cookie, sans script tiers.

![Page de connexion Holmes — accès admin et client protégé par session](../../../assets/projects/holmes/login.png)

## Architecture

L'application est écrite entièrement en **Go 1.23**. La structure suit un découpage en couches classique, câblé par injection de dépendances via **Uber fx**.

```
main.go  (fx.New → DI container)
    │
    ├── Config      (Viper — app.env + cors.yaml)
    ├── Database    (GORM + SQLite)
    ├── Service     (logique métier)
    ├── Middleware  (session auth : admin / customer)
    └── Handler     (Echo routes)
```

Les templates HTML sont générés avec **Templ** — un compilateur qui transforme des fichiers `.templ` en fonctions Go typées, sans concaténation de chaînes ni `html/template` à l'exécution.

## Tracking des hits

Le cœur du service est un upsert minimal :

1. `UPDATE Views SET Count = Count + 1 WHERE client_id = ? AND action_id = ? AND month = ? AND year = ?`
2. Si `RowsAffected == 0`, `INSERT` d'une nouvelle ligne avec `Count = 1`

Chaque entrée est dimensionnée par `(client_id, action_id, month, year)`. Les requêtes de lecture agrègent avec `SUM(Count) GROUP BY client_id, action_id` pour consolider les totaux sur une période.

## Dashboard

Deux niveaux d'accès protégés par **Gorilla Sessions** :

- **Admin** — vision globale sur tous les clients, triée par volume de hits décroissant
- **Customer** — vue restreinte aux slugs rattachés au compte connecté

Le filtre mois/année du dashboard est un formulaire htmx-boosted : le rechargement partiel évite un full-page refresh sans ajouter de JavaScript custom.

## Configuration

Les origines CORS autorisées sont déclarées dans `config/cors.yaml`, rechargé à chaud via **Viper** + `fsnotify`. Les secrets (mot de passe admin, clé de cookie) sont injectés depuis un fichier `app.env` au démarrage, avec un panic explicite si `COOKIE_SECRET` est absent.

## Déploiement

L'image Docker est déployée sur le même réseau Swarm que Carder, derrière **Caddy** (`holmes.nsmobile.be`). La base SQLite est persistée dans un volume `./database` monté en bind. Un pipeline **GitHub Actions** build et déploie l'image automatiquement à chaque push sur la branche principale.
