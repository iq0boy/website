---
title: "Plateforme E-Commerce"
excerpt: "Une plateforme e-commerce complète avec gestion des stocks en temps réel, paiements et tableau de bord administrateur."
category: "Web App"
tags: ["React", "Node.js", "Stripe", "PostgreSQL"]
year: "2026"
color: "oklch(0.30 0.06 250)"
---

Le client exploitait une marque en forte croissance en vente directe qui avait dépassé les capacités de WooCommerce. Les ventes flash et les lancements de produits faisaient planter la boutique, entraînaient des surventes et laissaient le service client gérer les conséquences. L'objectif : construire une plateforme capable d'absorber les pics de trafic sans broncher et donner à l'équipe opérationnelle une visibilité en temps réel.

## Vue d'ensemble de l'architecture

Le système se compose d'une SPA React servie via un CDN, d'une couche API Node.js, de PostgreSQL comme base de données principale et de Redis pour le cache et la gestion des sessions. Les pages produits critiques pour le SEO sont rendues côté serveur ; le panier et le tunnel d'achat sont entièrement côté client pour la réactivité.

## Résoudre le problème de survente

Lors des ventes flash, des centaines d'utilisateurs pouvaient tenter d'acheter la dernière unité simultanément. Les approches naïves — lire le stock, puis décrémenter — créent des conditions de course. La solution : un système de réservation au niveau de PostgreSQL utilisant `SELECT ... FOR UPDATE SKIP LOCKED`, qui sérialise les tentatives d'achat concurrentes au niveau base de données, sans verrou applicatif.

```sql
-- Réservation atomique du stock
WITH reserved AS (
  SELECT id FROM inventory
  WHERE sku = $1 AND available > 0
  LIMIT $2
  FOR UPDATE SKIP LOCKED
)
UPDATE inventory SET available = available - $2
WHERE id IN (SELECT id FROM reserved)
RETURNING id;
```

Les réservations expirent après 15 minutes si le paiement n'est pas effectué, restituant le stock au pool via un job d'arrière-plan.

## Traitement des paiements

Stripe Checkout gère tous les flux de paiement. Un listener webhook traite les événements de paiement et fait avancer une machine à états finis pour chaque commande : `pending → reserved → paid → fulfilled → shipped`. L'état d'une commande est toujours piloté par des événements Stripe confirmés — jamais par des mises à jour optimistes du frontend.

## Tableau de bord administrateur

L'équipe opérationnelle avait besoin d'une visibilité en temps réel sur les niveaux de stock pendant les événements de vente. Une connexion WebSocket pousse les deltas de stock au tableau de bord à chaque réservation ou expiration, maintenant les compteurs précis sans polling.

## Résultats

- 50 000+ SKUs actifs répartis sur 12 catégories de produits
- Zéro incident de survente lors de la première vente flash (5 000 utilisateurs simultanés)
- Temps de réponse API au P95 : 180ms
- Traitement des commandes entièrement automatisé — aucune intervention manuelle requise
