---
title: 'Drizzle vs Prisma en production : bilan après 12 mois'
excerpt: "J'ai fait tourner Prisma sur Postgres et Drizzle sur SQLite/libSQL pendant un an, sur de vrais projets clients. Verdict : Drizzle pour le neuf, Prisma reste où il est."
pubDate: 2026-06-12
category: 'Engineering'
readTime: 8
tags: ['Drizzle', 'Prisma', 'ORM', 'TypeScript', 'PostgreSQL', 'SQLite']
draft: false
---

![Visuel d'en-tête — Drizzle vs Prisma en production](../../../assets/blog/drizzle-vs-prisma-in-production/hero.png)

J'ai les deux ORMs en production depuis plus d'un an : **Prisma 5 sur PostgreSQL** pour un outil de reporting interne, **Drizzle sur SQLite/libSQL** pour une plateforme SaaS de cartes NFC et un système de réservation. Pas de benchmark synthétique ici — juste ce que ça fait de vivre avec, de migrer des schémas et de débugger à 23 h.

## TL;DR

Les deux font le travail. Mais pour tout nouveau projet, je pars sur Drizzle : pas d'étape de codegen, pas de moteur binaire à embarquer, et le SQL qui part en base est celui que tu lis dans le code. Prisma garde l'avantage sur l'outillage (Studio, `migrate dev`) et reste très bien là où il tourne déjà — je ne migre rien.

## Le schéma : un fichier DSL contre du TypeScript

Le `schema.prisma` est agréable à lire — c'est sa grande force. Mais il vit hors de ton langage : chaque modification demande un `prisma generate` pour régénérer le client, et ton éditeur a besoin d'un plugin dédié pour t'aider.

Avec Drizzle, le schéma **est** du TypeScript :

```ts
export const cards = sqliteTable('cards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  theme: text('theme').notNull().default('dark'),
  ownerId: integer('owner_id').references(() => users.id),
});
// Le type est déjà là. Pas de codegen, pas d'étape de build.
type Card = typeof cards.$inferSelect;
```

L'inférence est immédiate : tu renommes une colonne, tout le projet rougit instantanément. Avec Prisma, tu renommes, tu régénères, *puis* tout rougit. Ce n'est qu'une étape — mais c'est une étape de plus dans chaque boucle de feedback, mille fois par an.

## Le runtime : une lib contre un moteur

Prisma 5 embarque son query engine — un binaire Rust que le client interroge. Sur un gros serveur, on ne le sent pas. Sur un VPS modeste qui fait tourner six containers, si : c'est de la RAM au repos et du temps de démarrage en plus.

Drizzle est une bibliothèque TypeScript pure de quelques dizaines de kilo-octets. Elle parle directement au driver. Sur le SaaS NFC, l'app entière (Astro SSR + Drizzle + libSQL) tient dans un container qui démarre en moins d'une seconde.

## Les requêtes : savoir ce qui part en base

Le point qui m'a fait basculer. L'API de Prisma est confortable — `include`, `select`, relations imbriquées — mais elle **cache le SQL**. Un `include` innocent peut générer des requêtes que tu n'aurais jamais écrites à la main, et tu ne le découvres qu'en activant les logs.

Drizzle ressemble à du SQL parce que c'en est, typé :

```ts
const rows = await db
  .select({ slug: cards.slug, owner: users.email })
  .from(cards)
  .leftJoin(users, eq(cards.ownerId, users.id))
  .where(eq(cards.published, true));
```

Tu sais exactement quel SQL part. Quand une requête est lente, tu la lis dans ton code — pas dans un log de debug.

## Les migrations : avantage Prisma, honnêtement

`prisma migrate dev` reste le meilleur outil de migration que j'aie utilisé : shadow database, détection de drift, historique propre. `drizzle-kit generate` produit du SQL correct, mais le workflow est plus manuel et il m'est arrivé de relire le SQL généré avant de l'appliquer.

Et soyons honnête : sur le projet Drizzle, j'ai fini par écrire des **scripts de migration de données ad hoc** (migration de mots de passe, de rôles, de positions) lancés à la main. Ça fonctionne, c'est versionné, mais Prisma m'aurait probablement poussé vers quelque chose de plus discipliné.

`drizzle-kit studio` existe et dépanne, mais Prisma Studio reste plus abouti pour montrer des données à un client non technique.

## Ce qui m'a coûté avec Drizzle

- **L'API bouge.** Entre la version que j'ai posée sur le premier projet et celle du second, des breaking changes ont demandé une matinée d'adaptation. L'écosystème est jeune ; épingle tes versions.
- **Moins de réponses toutes faites.** Les cas exotiques se résolvent dans le code source ou les issues GitHub, pas sur Stack Overflow.

## Trade-offs

Prisma gagne si : équipe avec des juniors (l'API relationnelle pardonne plus), besoin de Studio pour des non-devs, écosystème mûr exigé. Drizzle gagne si : petit serveur ou edge, Astro/SSR léger, envie de voir ton SQL, projets solo ou petite équipe à l'aise avec SQL.

## À retenir

Si tu démarres un projet cette semaine : Drizzle, versions épinglées, et relis le SQL des migrations générées. Si tu as du Prisma en prod qui tourne : laisse-le tourner. La réécriture d'ORM est le refactoring le moins rentable que je connaisse.
