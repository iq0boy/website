---
title: "E-Commerce Platform"
excerpt: "Een volledig uitgeruste e-commerce platform met real-time voorraadbeheer, betalingen en admin dashboard."
category: "Web App"
tags: ["React", "Node.js", "Stripe", "PostgreSQL"]
year: "2026"
color: "oklch(0.30 0.06 250)"
---

De klant exploiteerde een snelgroeiend direct-to-consumer merk dat WooCommerce was ontgroeid. Flitsverkopen en productlanceringen lieten de winkel crashen, zorgden voor oververkoop en lieten de klantenservice de schade opruimen. Het doel: een platform bouwen dat verkeerspieken soepel verwerkt en het operationele team realtime controle geeft.

## Architectuuroverzicht

Het systeem bestaat uit een React SPA via een CDN, een Node.js API-laag, PostgreSQL als primaire database en Redis voor caching en sessiebeheer. SEO-kritieke productpagina's worden server-side gerenderd; winkelwagen en checkout zijn volledig client-side voor responsiviteit.

## Het oversell-probleem oplossen

Bij flitsverkopen konden honderden gebruikers gelijktijdig de laatste eenheid proberen te kopen. Naïeve benaderingen — stock lezen, dan decrementeren — creëren race conditions. De oplossing: een reserveringssysteem op PostgreSQL-niveau met `SELECT ... FOR UPDATE SKIP LOCKED`, dat gelijktijdige checkout-pogingen op databaseniveau serialiseert zonder applicatievergrendeling.

```sql
-- Atomische voorraadreservering
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

Reserveringen verlopen na 15 minuten als er niet betaald is, waardoor de voorraad via een achtergrondtaak terugkeert naar de pool.

## Betalingsverwerking

Stripe Checkout verwerkt alle betalingsstromen. Een webhooklistener verwerkt betalingsgebeurtenissen en beweegt een eindige toestandsmachine voor elke bestelling: `pending → reserved → paid → fulfilled → shipped`. Bestelstatus wordt altijd aangestuurd door bevestigde Stripe-gebeurtenissen — nooit door optimistische frontend-updates.

## Admin Dashboard

Het operationele team had realtime zicht op voorraadniveaus tijdens verkoopevents nodig. Een WebSocket-verbinding pusht voorraadwijzigingen naar het dashboard bij elke reservering of vervaldatum, zodat de aantallen accuraat blijven zonder polling.

## Resultaten

- 50.000+ actieve SKU's verdeeld over 12 productcategorieën
- Nul oversell-incidenten tijdens de eerste flitsverkoop (5.000 gelijktijdige gebruikers)
- P95 API-reactietijd: 180ms
- Orderverwerking volledig geautomatiseerd — geen handmatige tussenkomst vereist
