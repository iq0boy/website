---
title: "Ogbay — Plateforme e-Commerce & Commandes"
excerpt: "Plateforme multi-tenant de gestion de commandes : API Symfony 7, vitrine Astro, dashboard SvelteKit, machine d'état des commandes, temps réel Mercure, POS et programme de fidélité."
category: "Web App"
tags: ["Symfony", "PHP", "Astro", "SvelteKit", "PostgreSQL", "Redis", "Mercure", "Docker"]
year: "2026"
color: "oklch(0.26 0.10 165)"
---

Ogbay est une plateforme multi-tenant de gestion des commandes et du catalogue produit, composée de trois applications indépendantes derrière un reverse proxy Nginx partagé.

![Vitrine Ogbay — « Votre grossiste à tout prix », hero B2B & B2C avec carte de fidélité](../../../assets/projects/ogbay/home.png)

## Architecture

```
Nginx
  │
  ├── /api/*              → Symfony 7.4 via FastCGI (PHP-FPM :9000)
  ├── /.well-known/mercure → Hub Mercure (temps réel WebSocket)
  ├── app.{domaine}        → Dashboard SvelteKit 2
  └── /                   → Vitrine Astro 6
```

Les trois applications sont orchestrées par **Docker Compose** avec des surcharges par environnement (`dev`, `test`, `staging`, `prod`). Un Makefile centralise toutes les opérations courantes pour éviter d'appeler docker compose directement.

## API Symfony 7.4

L'API REST est organisée par **domaine métier** dans `src/Controller/` : Auth, Admin, Catalogue, Orders, Delivery, POS, Loyalty, Stock, Promo, Public. Le même découpage s'applique aux couches `Service/` et `Repository/`.

Les 29 entités Doctrine utilisent des **UUID** comme clés primaires. Les principales :

- **Order** — machine d'état complète : création → confirmation → préparation → livraison → annulation/remboursement
- **User** — rôles multiples : client, admin, livreur, staff POS
- **DeliveryAssignment** — assignation du livreur et suivi de statut
- **PosTicket / PosSession** — module caisse pour les commandes en magasin
- **LoyaltyTransaction** — programme de fidélité par points
- **StockMovement** — mouvements d'inventaire par produit et magasin
- **PromoCode** — codes de réduction avec règles de validité

L'authentification repose sur **LexikJWT** (RSA keypair) avec refresh tokens. Les emails transactionnels (confirmation, réinitialisation de mot de passe) sont envoyés via l'API **Brevo**. Les PDFs (tickets, factures) sont générés en transmettant du HTML au sidecar **Gotenberg**.

## Temps réel avec Mercure

Les changements d'état des commandes sont publiés sur le **hub Mercure**. Le dashboard admin et l'application livreur reçoivent les mises à jour en direct via EventSource, sans polling.

## Vitrine (Astro 6)

La vitrine publique est construite en **Astro 6 SSR** avec des îles **React 19** pour l'interactivité. Le routing i18n couvre le français et le néerlandais. L'UI utilise **Tailwind 4 + DaisyUI 5**.

![Page « Pourquoi Ogbay » — proposition de valeur et chiffres clés du grossiste](../../../assets/projects/ogbay/pourquoi.png)

![Page fidélité de la vitrine — paliers Bronze / Argent / Or « 1 € dépensé = 1 point »](../../../assets/projects/ogbay/fidelite.png)

## Dashboard admin (SvelteKit 2)

Le dashboard admin est une application **SvelteKit 2** en full SSR, servie sur un sous-domaine dédié. Routes imbriquées, form actions, protection JWT. Il couvre la gestion du catalogue, le suivi des commandes en temps réel, la configuration des créneaux de livraison, les rapports et l'administration des utilisateurs.

## Qualité

La suite de tests **PHPUnit** tourne dans un environnement Docker isolé (`docker-compose.test.yml`) avec une base de données séparée. Les migrations Doctrine s'exécutent automatiquement au démarrage du conteneur de développement. **PHP-CS-Fixer** et **PHPStan** sont intégrés au pipeline.
