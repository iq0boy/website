---
title: "Building Scalable APIs with Node.js and GraphQL"
excerpt: "A deep dive into designing APIs that handle millions of requests while staying maintainable and developer-friendly."
pubDate: 2026-03-15
category: "Backend"
readTime: 8
---

A deep dive into designing APIs that handle millions of requests while staying maintainable and developer-friendly.

The landscape of modern API design has shifted dramatically over the past few years. REST served us well, but as applications grew in complexity, so did the pain points: over-fetching, under-fetching, and maintaining multiple versioned endpoints became real bottlenecks. GraphQL, combined with the power of Node.js, offers a compelling alternative.

## Why GraphQL?

GraphQL lets clients request exactly the data they need — nothing more, nothing less. For a product catalog serving both a web app and a mobile app, this distinction matters enormously. The mobile client fetching a product list might only need `id`, `name`, and `thumbnail`, while the web client needs the full detail view. With REST, you'd either over-fetch on mobile or maintain two endpoints. With GraphQL, both clients express their own needs.

```graphql
# Mobile query — lightweight
query ProductList {
  products(first: 20) {
    id
    name
    thumbnail
  }
}

# Web query — full detail
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

## Schema-First Design

Before writing a single resolver, design the schema as a contract. This aligns frontend and backend teams early and makes breaking changes visible.

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

## Solving the N+1 Problem with DataLoader

The most common performance pitfall in GraphQL is the N+1 query problem. When fetching a list of products, naively resolving `category` for each one fires N separate database queries.

DataLoader batches and caches these lookups within a single request cycle:

```typescript
const categoryLoader = new DataLoader<string, Category>(async (ids) => {
  const categories = await db.category.findMany({
    where: { id: { in: [...ids] } },
  });
  return ids.map(id => categories.find(c => c.id === id));
});
```

In your resolver:

```typescript
product: {
  category: (parent) => categoryLoader.load(parent.categoryId),
}
```

100 products → 1 category query instead of 100. This single pattern can reduce database load by orders of magnitude.

## Pagination at Scale

Cursor-based pagination outperforms offset pagination at scale. With offset pagination, `LIMIT 20 OFFSET 1000` forces the database to scan 1020 rows and discard the first 1000. With cursors, you jump directly to the right row.

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

## Key Takeaways

Build your schema as a product, not as a reflection of your database schema. Use DataLoader aggressively — almost every list resolver needs it. Implement cursor pagination from day one; retrofitting it later is painful. And instrument everything: track resolver execution time, query complexity, and error rates from the start.
