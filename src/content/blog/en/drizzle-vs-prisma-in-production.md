---
title: 'Drizzle vs Prisma in production: 12 months later'
excerpt: "I ran Prisma on Postgres and Drizzle on SQLite/libSQL for a year, on real client projects. Verdict: Drizzle for new work, Prisma stays where it already runs."
pubDate: 2026-06-12
category: 'Engineering'
readTime: 8
tags: ['Drizzle', 'Prisma', 'ORM', 'TypeScript', 'PostgreSQL', 'SQLite']
draft: false
---

![Cover image — Drizzle vs Prisma in production](../../../assets/blog/drizzle-vs-prisma-in-production/hero.png)

I've had both ORMs in production for over a year: **Prisma 5 on PostgreSQL** for an internal reporting tool, **Drizzle on SQLite/libSQL** for an NFC business-card SaaS and a booking system. No synthetic benchmarks here — just what it's like to live with them, migrate schemas, and debug at 11pm.

## TL;DR

Both do the job. But for any new project I reach for Drizzle: no codegen step, no binary engine to ship, and the SQL hitting the database is the SQL you read in the code. Prisma keeps the edge on tooling (Studio, `migrate dev`) and is perfectly fine where it already runs — I'm not migrating anything.

## The schema: a DSL file vs TypeScript

`schema.prisma` is pleasant to read — that's its great strength. But it lives outside your language: every change needs a `prisma generate` to rebuild the client, and your editor needs a dedicated plugin to help you.

With Drizzle, the schema **is** TypeScript:

```ts
export const cards = sqliteTable('cards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  theme: text('theme').notNull().default('dark'),
  ownerId: integer('owner_id').references(() => users.id),
});
// The type is already there. No codegen, no build step.
type Card = typeof cards.$inferSelect;
```

Inference is immediate: rename a column and the whole project lights up red instantly. With Prisma you rename, regenerate, *then* everything lights up. It's only one step — but it's one extra step in every feedback loop, a thousand times a year.

## The runtime: a library vs an engine

Prisma 5 ships its query engine — a Rust binary the client talks to. On a big server you don't feel it. On a modest VPS running six containers, you do: it's idle RAM and extra startup time.

Drizzle is a pure TypeScript library weighing a few dozen kilobytes. It talks straight to the driver. On the NFC SaaS, the whole app (Astro SSR + Drizzle + libSQL) fits in one container that boots in under a second.

## Queries: knowing what hits the database

This is what tipped me over. Prisma's API is comfortable — `include`, `select`, nested relations — but it **hides the SQL**. An innocent `include` can generate queries you'd never write by hand, and you only find out by turning on query logs.

Drizzle looks like SQL because it is, typed:

```ts
const rows = await db
  .select({ slug: cards.slug, owner: users.email })
  .from(cards)
  .leftJoin(users, eq(cards.ownerId, users.id))
  .where(eq(cards.published, true));
```

You know exactly what's sent. When a query is slow, you read it in your code — not in a debug log.

## Migrations: advantage Prisma, honestly

`prisma migrate dev` is still the best migration tool I've used: shadow database, drift detection, clean history. `drizzle-kit generate` produces correct SQL, but the workflow is more manual, and I've caught myself re-reading the generated SQL before applying it.

And let's be honest: on the Drizzle project I ended up writing **ad-hoc data migration scripts** (password migration, roles, positions) that I ran by hand. It works, it's versioned, but Prisma would probably have nudged me toward something more disciplined.

`drizzle-kit studio` exists and gets you by, but Prisma Studio is still more polished for showing data to a non-technical client.

## What Drizzle cost me

- **The API moves.** Between the version on my first project and the second, breaking changes cost me a morning of adaptation. The ecosystem is young; pin your versions.
- **Fewer ready-made answers.** Exotic cases get solved in the source code or GitHub issues, not on Stack Overflow.

## Trade-offs

Prisma wins when: the team has juniors (the relational API is more forgiving), non-devs need Studio, a mature ecosystem is required. Drizzle wins when: small server or edge, lightweight Astro/SSR, you want to see your SQL, solo or small teams comfortable with SQL.

## Takeaway

Starting a project this week? Drizzle, pinned versions, and re-read the SQL of generated migrations. Got Prisma running in prod? Leave it running. Rewriting your ORM is the lowest-yield refactoring I know.
