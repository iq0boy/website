---
title: "E-Commerce Platform"
excerpt: "A full-featured e-commerce platform with real-time inventory, payments, and admin dashboard."
category: "Web App"
tags: ["React", "Node.js", "Stripe", "PostgreSQL"]
year: "2026"
color: "oklch(0.30 0.06 250)"
---

The client operated a fast-growing direct-to-consumer brand that had outgrown WooCommerce. Flash sales and product drops would crash the store, oversell inventory, and leave customer service dealing with the fallout. The goal: build a platform that could handle traffic spikes gracefully and give the ops team real-time control.

## Architecture Overview

The system consists of a React SPA served via a CDN, a Node.js API layer, PostgreSQL as the primary database, and Redis for caching and session management. SEO-critical product pages are server-side rendered; the cart and checkout are fully client-side for responsiveness.

## Solving the Oversell Problem

Flash sales meant hundreds of users could attempt to purchase the last unit simultaneously. Naive approaches — read stock, then decrement — create race conditions. The solution: a PostgreSQL-level reservation system using `SELECT ... FOR UPDATE SKIP LOCKED`, which serializes concurrent checkout attempts at the database level without application locks.

```sql
-- Atomic stock reservation
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

Reservations expire after 15 minutes if unpaid, releasing stock back to the pool via a background job.

## Payment Processing

Stripe Checkout handles all payment flows. A webhook listener processes payment events and advances a finite state machine for each order: `pending → reserved → paid → fulfilled → shipped`. Order state is always driven by confirmed Stripe events — never by optimistic frontend updates.

## Admin Dashboard

The operations team needed live visibility into stock levels during sales events. A WebSocket connection pushes inventory deltas to the dashboard whenever a reservation is made or expires, keeping counts accurate without polling.

## Results

- 50,000+ active SKUs across 12 product categories
- Zero oversell incidents during the first flash sale (5,000 concurrent users)
- P95 API response time: 180ms
- Order processing fully automated — no manual intervention required
