---
title: "Construire des APIs scalables avec Node.js et GraphQL"
excerpt: "Une plongée en profondeur dans la conception d'APIs capables de gérer des millions de requêtes tout en restant maintenables et agréables à utiliser."
pubDate: 2026-03-15
category: "Backend"
readTime: 8
---

Une plongée en profondeur dans la conception d'APIs capables de gérer des millions de requêtes tout en restant maintenables et agréables à utiliser.

Le paysage de la conception d'API moderne a radicalement évolué ces dernières années. REST nous a bien servi, mais à mesure que les applications gagnaient en complexité, les points de friction se sont multipliés : sur-fetching, under-fetching et maintenance de multiples endpoints versionnés sont devenus de véritables goulots d'étranglement. GraphQL, combiné à la puissance de Node.js, offre une alternative convaincante.

## Pourquoi GraphQL ?

GraphQL permet aux clients de demander exactement les données dont ils ont besoin — ni plus, ni moins. Pour un catalogue produit servant à la fois une application web et une application mobile, cette distinction est capitale. Le client mobile qui récupère une liste de produits n'a peut-être besoin que de `id`, `name` et `thumbnail`, tandis que le client web a besoin de la vue détaillée complète. Avec REST, il faudrait soit sur-fetcher côté mobile, soit maintenir deux endpoints. Avec GraphQL, chaque client exprime ses propres besoins.

```graphql
# Requête mobile — légère
query ProductList {
  products(first: 20) {
    id
    name
    thumbnail
  }
}

# Requête web — détail complet
query ProductDetail($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price
    images
    variants { size color stock }
  }
}
```

## Conception Schema-First

Avant d'écrire un seul resolver, concevez le schéma comme un contrat. Cela aligne les équipes frontend et backend dès le départ et rend les changements cassants visibles.

```graphql
type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  category: Category!
  variants: [Variant!]!
}

type Query {
  product(id: ID!): Product
  products(first: Int, after: String, category: String): ProductConnection!
}
```

## Résoudre le problème N+1 avec DataLoader

Le piège de performance le plus courant en GraphQL est le problème des requêtes N+1. Lors de la récupération d'une liste de produits, résoudre naïvement `category` pour chacun d'eux déclenche N requêtes séparées vers la base de données.

DataLoader regroupe et met en cache ces appels au sein d'un même cycle de requête :

```typescript
const categoryLoader = new DataLoader<string, Category>(async (ids) => {
  const categories = await db.category.findMany({
    where: { id: { in: [...ids] } },
  });
  return ids.map(id => categories.find(c => c.id === id));
});
```

Dans votre resolver :

```typescript
product: {
  category: (parent) => categoryLoader.load(parent.categoryId),
}
```

100 produits → 1 requête de catégorie au lieu de 100. Ce seul pattern peut réduire la charge base de données de plusieurs ordres de grandeur.

## Pagination à grande échelle

La pagination par curseur surpasse la pagination par offset à grande échelle. Avec la pagination par offset, `LIMIT 20 OFFSET 1000` force la base de données à scanner 1020 lignes et à en ignorer les 1000 premières. Avec les curseurs, vous sautez directement à la bonne ligne.

```typescript
async products(_, { first = 20, after }) {
  const cursor = after ? decodeCursor(after) : undefined;
  const items = await db.product.findMany({
    take: first + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  const hasNextPage = items.length > first;
  return {
    edges: items.slice(0, first).map(item => ({
      node: item,
      cursor: encodeCursor(item.id),
    })),
    pageInfo: { hasNextPage, endCursor: encodeCursor(items[first - 1]?.id) },
  };
}
```

## Points clés

Construisez votre schéma comme un produit, pas comme un reflet de votre schéma de base de données. Utilisez DataLoader de manière systématique — presque tous les resolvers de liste en ont besoin. Implémentez la pagination par curseur dès le premier jour ; la rétrofiter plus tard est douloureux. Et instrumentez tout : suivez le temps d'exécution des resolvers, la complexité des requêtes et les taux d'erreur dès le départ.
