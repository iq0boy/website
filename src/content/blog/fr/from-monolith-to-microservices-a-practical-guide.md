---
title: "Du monolithe aux microservices : un guide pratique"
excerpt: "Stratégies concrètes pour décomposer des applications monolithiques sans perdre la tête."
pubDate: 2026-01-20
category: "Architecture"
readTime: 12
---

Stratégies concrètes pour décomposer des applications monolithiques sans perdre la tête.

Toutes les équipes qui ont réussi à migrer d'un monolithe vers des microservices vous diront la même chose : ça a pris trois fois plus de temps que prévu. Toutes celles qui ont échoué vous diront qu'elles avaient sous-estimé la complexité opérationnelle et surestimé les bénéfices. Les deux ont raison.

Ce n'est pas un argument contre les microservices. C'est un argument pour y aller les yeux ouverts.

## Pour et contre le monolithe

Un monolithe bien structuré n'est pas un échec. C'est souvent la bonne architecture pour les équipes de moins de 20 ingénieurs, les produits de moins de cinq ans, ou les domaines encore en cours d'exploration. Un monolithe a de vrais avantages : une unité de déploiement unique, pas de frontières réseau à gérer, des transactions partagées et un développement local ultra-simple.

Les pressions qui poussent finalement vers les services sont réelles aussi : des équipes qui marchent sur les déploiements des autres, des fonctionnalités non liées bloquées par un pipeline CI lent, le besoin de scaler des goulots d'étranglement spécifiques indépendamment, et différentes parties du système ayant des exigences de fiabilité genuinement différentes.

La question n'est pas « monolithe ou microservices ? » — c'est « ma douleur spécifique justifie-t-elle la complexité opérationnelle que je suis sur le point d'assumer ? »

## Le pattern Strangler Fig

Quand vous décidez d'extraire des services, n'essayez pas de tout réécrire d'un coup. Le pattern strangler fig est votre ami : placez un proxy (une API gateway, ou une simple couche de routage) devant votre monolithe, et redirigez progressivement le trafic pour des routes spécifiques vers de nouveaux services au fur et à mesure qu'ils sont construits.

```
                    ┌─────────────────┐
Browser ──────────► │   API Gateway   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌──────────────────┐         ┌──────────────────┐
    │    Monolithe     │         │ Service Paiements │
    │ /api/* (legacy)  │         │  /api/payments    │
    └──────────────────┘         └──────────────────┘
```

Commencez par les coutures qui existent déjà. Si votre module `payments` ne touche jamais les tables de base de données du module `user`, c'est un bon candidat à l'extraction.

## Les frontières de domaine avant les frontières de code

La cause la plus fréquente d'échec des microservices est d'extraire selon des lignes techniques (frontend/backend/données) plutôt que des lignes de domaine. On se retrouve avec des services bavards fortement couplés via des appels réseau — le pire des deux mondes.

Le concept de contexte délimité du Domain-Driven Design est la bonne perspective ici. Un contexte délimité est une frontière à l'intérieur de laquelle un modèle de domaine particulier s'applique de manière cohérente. « Commande » signifie quelque chose de précis dans le contexte de la commande, quelque chose de différent dans le contexte de la facturation, et autre chose dans le contexte de la logistique.

Avant de diviser le code, divisez le modèle de domaine :

1. Dessinez une carte de contexte de votre domaine
2. Identifiez où différentes équipes possèdent différentes parties du modèle
3. Trouvez les coutures naturelles — là où le contexte A passe une référence au contexte B vs. copie des données de B

Ces coutures sont vos frontières de service.

## Le problème des données

La partie la plus difficile des microservices n'est pas le code — c'est les données. Les transactions distribuées sont pénibles. Si « créer une commande » doit mettre à jour à la fois la base de données des commandes et la base de données des stocks de manière atomique, vous avez un problème.

Deux patterns qui fonctionnent vraiment à grande échelle :

**Pattern Saga** — décomposez la transaction en une séquence de transactions locales, chacune publiant un événement. Si l'étape 3 échoue, des transactions compensatoires annulent les étapes 1 et 2.

**Pattern Outbox** — écrivez votre événement de domaine dans une table `outbox` dans la même transaction de base de données que votre changement de domaine. Un processus séparé publie de manière fiable ces événements vers votre broker de messages.

```sql
-- Dans une seule transaction :
INSERT INTO orders (id, status, ...) VALUES (...);
INSERT INTO outbox (aggregate_id, event_type, payload) 
  VALUES (order_id, 'order.created', '{"orderId": ...}');
```

## L'observabilité en premier

Vous ne pouvez pas opérer des microservices sans tracing distribué. Chaque appel inter-services doit propager un trace ID, et chaque service doit exporter des spans vers un collecteur (Jaeger, Tempo, Datadog — choisissez-en un et soyez cohérent).

Mettez cela en place avant d'extraire votre premier service. Rétrofiter l'observabilité dans cinq services en production est significativement plus difficile que de le faire pour deux services en staging.

## Points clés

Ne migrez pas parce que les microservices sont à la mode. Migrez parce que vous avez une douleur spécifique que les services résolvent et que vous avez épuisé les solutions au niveau du monolithe. Commencez avec le strangler fig — jamais une réécriture big bang. Mettez en place votre stack d'observabilité avant d'en avoir besoin. Et acceptez que la première extraction vous apprendra plus sur votre domaine que six mois de diagrammes d'architecture.
