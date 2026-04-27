---
title: "Dashboard Analytics SaaS"
excerpt: "Plateforme de visualisation de données traitant plus de 10 millions d'événements par jour avec des tableaux de bord en temps réel."
category: "Web App"
tags: ["Next.js", "D3.js", "Prisma", "TimescaleDB"]
year: "2025"
color: "oklch(0.28 0.06 150)"
---

Une société SaaS B2B avait besoin de donner à ses clients une visibilité en libre-service sur leurs données d'usage — conversions de tunnel, cohortes de rétention, séquences d'événements — traitées en temps réel depuis plusieurs systèmes sources.

## Le défi du pipeline de données

Avec plus de 10 millions d'événements par jour répartis sur 200+ comptes clients, interroger les tables d'événements bruts pour chaque requête de tableau de bord était insoutenable. L'implémentation initiale atteignait des temps de chargement de 4 à 8 secondes sur des requêtes non triviales. Les utilisateurs abandonnaient les tableaux de bord avant qu'ils ne se chargent.

## La stratégie de pré-agrégation

La solution consistait à déplacer le travail du moment de la requête vers le moment de l'ingestion. À l'arrivée des événements via Kafka, un processeur de flux maintient des agrégats incrémentiels à plusieurs résolutions temporelles — horaire, quotidien, hebdomadaire — en les écrivant dans des hypertables TimescaleDB.

```typescript
// Le planificateur de requêtes sélectionne la bonne table d'agrégation selon la plage temporelle
function selectAggregationLevel(from: Date, to: Date): AggLevel {
  const days = differenceInDays(to, from);
  if (days <= 2) return 'hourly';
  if (days <= 90) return 'daily';
  return 'weekly';
}
```

Les requêtes des tableaux de bord frappent les tables pré-agrégées, pas les événements bruts. Les temps de chargement sont passés de 4s à moins de 100ms.

## Visualisations personnalisées

Le produit utilise D3.js pour tous les graphiques plutôt qu'une bibliothèque toute faite, offrant un contrôle total sur les animations, les interactions et la mise en page. Une couche de configuration déclarative permet aux non-ingénieurs de définir de nouveaux types de graphiques en décrivant axes, échelles et transitions en JSON — sans écrire une ligne de D3.

## Isolation des données multi-tenant

Les données de chaque client sont isolées via des politiques de sécurité au niveau des lignes (RLS) dans PostgreSQL. L'API ne passe jamais les IDs clients comme paramètres de requête — le contexte de session délimite automatiquement chaque requête au tenant authentifié.

```sql
CREATE POLICY tenant_isolation ON events
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

## Résultats

- Temps de chargement des tableaux de bord : <100ms au P95 (contre 4 à 8s)
- 10M+ événements traités quotidiennement, zéro perte de données
- 200+ comptes clients avec données entièrement isolées
- 4 nouveaux types de graphiques livrés par des non-ingénieurs grâce à la couche de configuration
