---
title: "Marketplace Immobilière"
excerpt: "Plateforme d'annonces immobilières avec visites 3D, recherche par carte et simulateur de crédit."
category: "Web App"
tags: ["Next.js", "Mapbox", "Supabase"]
year: "2024"
color: "oklch(0.28 0.05 60)"
---

Une agence immobilière nationale souhaitait quitter une plateforme tierce et reprendre la maîtrise de sa technologie — pour contrôler l'UX, les données et le parcours client de la première recherche jusqu'au contrat signé.

## Recherche centrée sur la carte

L'expérience principale est une vue split-screen carte + liste. Le défi : afficher plus de 100 000 marqueurs de propriétés sans dégrader les performances. La solution est une stratégie de clustering multi-niveaux utilisant l'intégration `supercluster` de Mapbox GL, qui regroupe dynamiquement les marqueurs proches en clusters quand l'utilisateur dézoome.

```typescript
// Rayon de cluster dynamique selon le niveau de zoom
const clusterRadius = (zoom: number) => {
  if (zoom > 14) return 0;   // Marqueurs individuels
  if (zoom > 11) return 40;  // Clusters serrés
  return 80;                  // Clusters vue ville
};
```

Les cartes de propriétés dans la liste sont virtualisées — seuls les éléments visibles sont rendus — maintenant la mémoire stable même avec des milliers de résultats.

## Visites virtuelles 3D

Chaque annonce peut inclure une visite 3D construite à partir de photos 360° traitées avec le SDK Matterport, intégrée en tant qu'iframe à chargement différé. Les analyses ont montré que les annonces avec visites 3D reçoivent 3× plus de sauvegardes que les annonces équivalentes avec photos uniquement.

## Simulateur de crédit

Un simulateur de crédit intégré permet aux acheteurs de modéliser les mensualités en temps réel en ajustant apport, durée et hypothèses de taux. Les taux sont récupérés depuis un flux de données mis à jour deux fois par jour. L'état du simulateur est sérialisé dans l'URL, permettant aux acheteurs de partager une annonce et un scénario de financement en un seul lien.

## Backend Supabase

Supabase gère l'authentification, la base de données de propriétés (extension PostGIS pour les requêtes géospatiales) et les mises à jour en temps réel — les agents voient les nouvelles demandes de contact à leur arrivée sans polling. La sécurité au niveau des lignes garantit que les agents n'accèdent qu'aux demandes concernant leurs propres annonces.

## Résultats

- 100 000+ annonces actives au lancement
- Augmentation de 200% des conversions sur le formulaire de contact vs. la plateforme précédente
- Durée moyenne de session : 7,5 minutes (contre 2,8 minutes)
- Annonces avec visite 3D : taux de sauvegarde 3× supérieur aux annonces photo uniquement
