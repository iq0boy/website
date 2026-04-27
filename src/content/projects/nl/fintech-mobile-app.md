---
title: "FinTech Mobiele App"
excerpt: "Bankieren-app met biometrische authenticatie, directe overboekingen en uitgavenoverzichten."
category: "Mobile"
tags: ["React Native", "TypeScript", "GraphQL"]
year: "2025"
color: "oklch(0.32 0.05 30)"
---

Een challenger bank had een mobile-first product nodig dat qua ervaring kon concurreren met gevestigde neobanken, terwijl het voldeed aan de beveiligings- en nalevingsvereisten van een gereguleerde financiële instelling.

## Beveiligingsarchitectuur

Elke gevoelige operatie is beschermd door meerdere lagen. Biometrische authenticatie (Face ID / vingerafdruk) bewaakt de toegang tot de app en autoriseert individuele transacties boven een drempelwaarde. De apparaatgebonden ondertekeningssleutel is opgeslagen in de Secure Enclave (iOS) of Android Keystore — nooit in het geheugen van de app of in de opslag van het apparaat.

Tokens hebben een korte levensduur (15 minuten) en zijn beperkt tot specifieke operaties. Een vernieuwingstoken in de beveiligde sleutelhanger verzorgt stille her-authenticatie op de achtergrond.

## GraphQL API-ontwerp

De app gebruikt één enkel GraphQL-eindpunt voor alle data-opvragingen. Het schema is ontworpen rond gebruikersreizen, niet databasetabellen — het type `AccountSummary` geeft precies wat het beginscherm nodig heeft in één verzoek, waardoor de cascade van REST-aanroepen die mobiele apps typisch plagen wordt vermeden.

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

## Optimistische UI

Overboekingsbevestigingen voelen direct aan omdat de interface optimistisch bijwerkt voordat de server reageert. Als de server de transactie afwijst (onvoldoende saldo, fraudesignaal), draait een vloeiende ongedaan-animatie de UI-staat terug — foutgrenzen zorgen ervoor dat een mislukte transactie de interface nooit in een inconsistente staat achterlaat.

## Uitgavenanalyse

De categorisatie-engine draait server-side, met een combinatie van MCC-codes van handelaren en een fine-tuned classifier getraind op geanonimiseerde transactiebeschrijvingen. Categorieën zijn door gebruikers aanpasbaar, waarbij correcties worden teruggekoppeld om het model continu te verbeteren.

## Resultaten

- 4,8★ in zowel de App Store als de Play Store
- 50.000+ actieve gebruikers in de eerste 6 maanden
- Nul beveiligingsincidenten sinds de lancering
- Gemiddelde tijd om een overboeking te voltooien: 1,2 seconden
