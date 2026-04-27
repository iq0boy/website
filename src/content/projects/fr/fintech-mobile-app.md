---
title: "Application Mobile FinTech"
excerpt: "Application bancaire avec authentification biométrique, virements instantanés et analyse des dépenses."
category: "Mobile"
tags: ["React Native", "TypeScript", "GraphQL"]
year: "2025"
color: "oklch(0.32 0.05 30)"
---

Une banque challenger avait besoin d'un produit mobile-first capable de rivaliser en expérience avec les néobanques établies, tout en répondant aux exigences de sécurité et de conformité d'un établissement financier réglementé.

## Architecture de sécurité

Chaque opération sensible est protégée par plusieurs couches. L'authentification biométrique (Face ID / empreinte digitale) contrôle l'accès à l'application et autorise les transactions individuelles au-delà d'un seuil. La clé de signature liée à l'appareil est stockée dans le Secure Enclave (iOS) ou l'Android Keystore — jamais en mémoire applicative ni dans le stockage de l'appareil.

Les tokens ont une durée de vie courte (15 minutes) et sont délimités à des opérations spécifiques. Un token de rafraîchissement stocké dans le keychain sécurisé gère la ré-authentification silencieuse en arrière-plan.

## Conception de l'API GraphQL

L'application utilise un seul endpoint GraphQL pour toutes les récupérations de données. Le schéma est conçu autour des parcours utilisateur, pas des tables de base de données — le type `AccountSummary` retourne exactement ce dont l'écran d'accueil a besoin en une seule requête, évitant la cascade d'appels REST qui pénalise typiquement les apps mobiles.

```typescript
const HOME_SCREEN_QUERY = gql`
  query HomeScreen {
    account {
      balance { amount currency }
      recentTransactions(first: 5) {
        id amount merchant date category
      }
      spendingInsights {
        topCategory weeklyTotal monthlyBudget
      }
    }
  }
`;
```

## Interface optimiste

Les confirmations de virement semblent instantanées car l'interface se met à jour de manière optimiste avant la réponse du serveur. Si le serveur rejette la transaction (solde insuffisant, signal de fraude), une animation de retour en arrière fluide restaure l'état de l'interface — des error boundaries garantissent qu'une transaction échouée ne laisse jamais l'interface dans un état incohérent.

## Analyse des dépenses

Le moteur de catégorisation fonctionne côté serveur, en combinant les codes MCC des marchands et un classificateur fine-tuné entraîné sur des descriptions de transactions anonymisées. Les catégories sont modifiables par l'utilisateur, et les corrections alimentent en retour le modèle pour l'améliorer continuellement.

## Résultats

- 4,8★ sur l'App Store et le Play Store
- 50 000+ utilisateurs actifs dans les 6 premiers mois
- Zéro incident de sécurité depuis le lancement
- Temps moyen de complétion d'un virement : 1,2 seconde
