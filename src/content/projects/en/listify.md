---
title: 'Listify — Real-Time Collaborative Lists'
excerpt: "Real-time collaborative lists and kanban app built on Elixir/Phoenix/Ash: live sync, roles and invitations, optimistic locking, LexoRank ordering, and GDPR compliance."
category: 'Web App'
tags: ['Elixir', 'Phoenix', 'Ash', 'LiveView', 'PostgreSQL', 'Oban', 'Docker']
year: '2026'
color: 'oklch(0.30 0.10 290)'
liveUrl: 'https://listify.josephpire.dev'
updatedDate: 2026-06-17
---

Listify is a **real-time collaborative lists and kanban** app: several people edit the same lists, see changes appear instantly, and manage members, roles and notifications. A greenfield project driven by a detailed specification, in production and self-hosted.

![Listify dashboard — "My lists" with active, shared, and progress-tracked lists](../../../assets/projects/listify/dashboard.png)

## The problem

I wanted a real testbed to push the **Elixir/Phoenix/Ash** stack on a non-trivial domain: real-time collaboration. Not a demo to-do list, but a complete app — edit concurrency, roles, invitations, notifications, audit, GDPR — driven by a spec written before the code, to lock the architecture decisions up front rather than improvising them.

## Constraints

- **Real-time multi-user** with no lost conflicts and no stale payloads.
- **Architecture decisions frozen at the spec** (v1.3/v1.4, numbered sections): ordering, locking, job-queue topology.
- **Self-hosting**: everything has to fit in a Docker Swarm deployment with no third-party managed service.
- **GDPR compliance** from the start (data export, account deletion).

## Architecture

The app is 100% **Phoenix LiveView** — no SPA framework, interactivity is server-driven over WebSocket. Business logic, persistence and authorization all go through **Ash 3.4** (AshPostgres), organised into domains: `Accounts`, `Lists`, `Messaging`, `Notifications`, `Audit`, `Backups`, `Moderation`.

```
Phoenix LiveView (server-driven UI)
    │
    ├── Ash domains (logic, authorization, persistence)
    │      Accounts · Lists · Messaging · Notifications · Audit · Backups
    ├── Phoenix PubSub (real-time signalling)
    ├── Oban (jobs: mailer, exports, scheduled, critical)
    └── PostgreSQL 16 + Redis (sessions)
```

## Real-time: signalling, not payload

Every item or list mutation publishes a message to a PubSub topic (`items:list:<id>`). But the key point: the LiveView **does not consume the broadcast payload** — it receives a plain signal (`{:item_updated, id}`) and **re-reads the full resource** through Ash, with authorization and policies applied. PubSub is a signalling mechanism, not a data transport — which eliminates the entire class of "stale payload" bugs.

## Selective optimistic locking

Concurrent item edits are guarded by a `lock_version` checked **atomically in the SQL WHERE clause** (not after fetch — so no race). A conflict returns a 409 with the server's version so the client can re-fetch. But only the "heavy" fields (title, description, labels) are guarded; hot fields (status, rank, assignment) go through separate *last-write-wins* actions to stay fast. This isn't pessimistic locking — it's targeted conflict detection.

![Collaborative list in kanban view — To do / In progress / Done columns, members, roles and messaging](../../../assets/projects/listify/board.png)

## LexoRank ordering

Item ordering uses **LexoRank** (rank strings) rather than integer positions: reordering inserts a rank *between* two neighbours in O(1), never renumbering or locking a global sequence. Two concurrent reorders don't coordinate — the bit-string math guarantees monotonicity.

## Background jobs (Oban)

Queue topology fixed in the spec: `default` (10), `mailer` (5), `exports` (3), `scheduled` (2), `critical` (1). Around fifteen workers: invitation and mention mailers, due-date reminders, daily digest, recurring-list resets, GDPR export, deferred account purge, S3 backup cleanup.

## What it shipped with

- 33 days, 185 commits — **in production** at `listify.josephpire.dev` (Docker Swarm, 2 replicas, rolling updates)
- Auth (AshAuthentication + bcrypt + magic links), real-time lists/items, owner/editor/viewer roles, invitations
- Notifications (bell + toast), append-only audit log, CSV export, **REST API + OpenAPI/Swagger docs**
- GDPR: data export and account deletion with a grace period; Web Push (PWA); S3 backups

## Lessons

- **A spec written before the code locks in the right decisions.** LexoRank ordering, locking strategy, Oban topology: decided once, never re-litigated mid-build.
- **PubSub as a signal, not a transport.** Broadcasting an id and re-reading behind the authorization layer is one DB round-trip slower, but it removes data leaks and stale payloads — a trade-off worth making.
- **Ash rewards rigor.** Modelling authorization in the resources rather than the views takes discipline up front, then every new surface (REST API, LiveView) inherits it for free.
