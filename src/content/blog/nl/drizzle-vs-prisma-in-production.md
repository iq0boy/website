---
title: 'Drizzle vs Prisma in productie: de balans na 12 maanden'
excerpt: "Een jaar lang draaide ik Prisma op Postgres en Drizzle op SQLite/libSQL, op echte klantprojecten. Verdict: Drizzle voor nieuw werk, Prisma blijft waar het al draait."
pubDate: 2026-06-12
category: 'Engineering'
readTime: 8
tags: ['Drizzle', 'Prisma', 'ORM', 'TypeScript', 'PostgreSQL', 'SQLite']
draft: false
---

![Coverbeeld — Drizzle vs Prisma in productie](../../../assets/blog/drizzle-vs-prisma-in-production/hero.png)

Ik heb beide ORM's al meer dan een jaar in productie: **Prisma 5 op PostgreSQL** voor een interne reportingtool, **Drizzle op SQLite/libSQL** voor een NFC-visitekaartjes-SaaS en een reserveringssysteem. Geen synthetische benchmarks hier — gewoon hoe het is om ermee te leven, schema's te migreren en om 23u te debuggen.

## TL;DR

Beide doen het werk. Maar voor elk nieuw project kies ik Drizzle: geen codegen-stap, geen binaire engine om mee te leveren, en de SQL die naar de database gaat is de SQL die je in de code leest. Prisma houdt de voorsprong op tooling (Studio, `migrate dev`) en blijft prima waar het al draait — ik migreer niets.

## Het schema: een DSL-bestand vs TypeScript

`schema.prisma` leest aangenaam — dat is zijn grote kracht. Maar het leeft buiten je taal: elke wijziging vraagt een `prisma generate` om de client opnieuw te bouwen, en je editor heeft een aparte plugin nodig om je te helpen.

Bij Drizzle **is** het schema TypeScript:

```ts
export const cards = sqliteTable('cards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  theme: text('theme').notNull().default('dark'),
  ownerId: integer('owner_id').references(() => users.id),
});
// Het type is er al. Geen codegen, geen build-stap.
type Card = typeof cards.$inferSelect;
```

De inferentie is onmiddellijk: hernoem een kolom en het hele project kleurt meteen rood. Bij Prisma hernoem je, regenereer je, en *dan* kleurt alles rood. Het is maar één stap — maar wel één extra stap in elke feedbackloop, duizend keer per jaar.

## De runtime: een library vs een engine

Prisma 5 brengt zijn query engine mee — een Rust-binary waar de client mee praat. Op een grote server voel je dat niet. Op een bescheiden VPS met zes containers wel: het is idle RAM en extra opstarttijd.

Drizzle is een pure TypeScript-library van enkele tientallen kilobytes. Ze praat rechtstreeks met de driver. Op de NFC-SaaS past de hele app (Astro SSR + Drizzle + libSQL) in één container die in minder dan een seconde opstart.

## Query's: weten wat naar de database gaat

Dit gaf voor mij de doorslag. Prisma's API is comfortabel — `include`, `select`, geneste relaties — maar ze **verbergt de SQL**. Een onschuldige `include` kan query's genereren die je nooit met de hand zou schrijven, en je ontdekt het pas door de querylogs aan te zetten.

Drizzle lijkt op SQL omdat het dat is, getypeerd:

```ts
const rows = await db
  .select({ slug: cards.slug, owner: users.email })
  .from(cards)
  .leftJoin(users, eq(cards.ownerId, users.id))
  .where(eq(cards.published, true));
```

Je weet precies wat er vertrekt. Als een query traag is, lees je ze in je code — niet in een debuglog.

## Migraties: voordeel Prisma, eerlijk is eerlijk

`prisma migrate dev` blijft de beste migratietool die ik gebruikt heb: shadow database, driftdetectie, propere historiek. `drizzle-kit generate` produceert correcte SQL, maar de workflow is handmatiger, en ik betrap mezelf erop dat ik de gegenereerde SQL herlees voor ik ze toepas.

En laten we eerlijk zijn: op het Drizzle-project schreef ik uiteindelijk **ad-hoc datamigratiescripts** (wachtwoorden, rollen, posities) die ik met de hand draaide. Het werkt, het staat in versiebeheer, maar Prisma had me waarschijnlijk naar iets gedisciplineerders geduwd.

`drizzle-kit studio` bestaat en volstaat, maar Prisma Studio blijft verzorgder om data aan een niet-technische klant te tonen.

## Wat Drizzle me kostte

- **De API beweegt.** Tussen de versie op mijn eerste project en die op het tweede kostten breaking changes me een ochtend aanpassen. Het ecosysteem is jong; pin je versies.
- **Minder kant-en-klare antwoorden.** Exotische gevallen los je op in de broncode of GitHub-issues, niet op Stack Overflow.

## Trade-offs

Prisma wint als: het team juniors heeft (de relationele API vergeeft meer), niet-devs Studio nodig hebben, een matuur ecosysteem vereist is. Drizzle wint als: kleine server of edge, lichte Astro/SSR, je je SQL wil zien, solo of klein team dat SQL beheerst.

## Conclusie

Start je deze week een project? Drizzle, gepinde versies, en herlees de SQL van gegenereerde migraties. Draait er Prisma in productie? Laat het draaien. Je ORM herschrijven is de minst renderende refactoring die ik ken.
