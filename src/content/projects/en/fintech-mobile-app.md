---
title: "FinTech Mobile App"
excerpt: "Banking app with biometric auth, instant transfers, and spending insights."
category: "Mobile"
tags: ["React Native", "TypeScript", "GraphQL"]
year: "2025"
color: "oklch(0.32 0.05 30)"
---

A challenger bank needed a mobile-first product that could compete on experience with established neobanks while meeting the security and compliance requirements of a regulated financial institution.

## Security Architecture

Every sensitive operation is protected by multiple layers. Biometric authentication (Face ID / fingerprint) gates app access and authorizes individual transactions above a threshold. The device-bound signing key is stored in the Secure Enclave (iOS) or Android Keystore — never in app memory or on-device storage.

Tokens are short-lived (15 minutes) and scoped to specific operations. A refresh token stored in the secure keychain handles silent re-authentication in the background.

## GraphQL API Design

The app uses a single GraphQL endpoint for all data fetching. The schema is designed around user journeys, not database tables — the `AccountSummary` type returns exactly what the home screen needs in one request, avoiding the waterfall of REST calls that typically plagues mobile apps.

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

## Optimistic UI

Transfer confirmations feel instant because the UI updates optimistically before the server responds. If the server rejects the transaction (insufficient funds, fraud flag), a smooth undo animation rolls back the UI state — error boundaries ensure a failed transaction never leaves the UI inconsistent.

## Spending Insights

The categorization engine runs server-side, using a combination of merchant MCC codes and a fine-tuned classifier trained on anonymized transaction descriptions. Categories are user-editable, with corrections fed back to improve the model over time.

## Results

- 4.8★ on both App Store and Play Store
- 50,000+ active users in the first 6 months
- Zero security incidents since launch
- Average transfer completion time: 1.2 seconds
