---
title: "Schaalbare API's bouwen met Node.js en GraphQL"
excerpt: "Een diepgaande verkenning van het ontwerpen van API's die miljoenen verzoeken verwerken terwijl ze onderhoudbaar en ontwikkelaarsvriendelijk blijven."
pubDate: 2026-03-15
category: "Backend"
readTime: 8
---

Een diepgaande verkenning van het ontwerpen van API's die miljoenen verzoeken verwerken terwijl ze onderhoudbaar en ontwikkelaarsvriendelijk blijven.

Het landschap van moderne API-ontwerp is de afgelopen jaren ingrijpend veranderd. REST heeft ons goed gediend, maar naarmate applicaties complexer werden, namen ook de knelpunten toe: over-fetching, under-fetching en het onderhouden van meerdere versioned endpoints werden echte bottlenecks. GraphQL, gecombineerd met de kracht van Node.js, biedt een overtuigend alternatief.

## Waarom GraphQL?

GraphQL laat clients precies de data opvragen die ze nodig hebben — niet meer, niet minder. Voor een productcatalogus die zowel een webapplicatie als een mobiele app bedient, maakt dit verschil enorm. De mobiele client die een productlijst ophaalt heeft misschien alleen `id`, `name` en `thumbnail` nodig, terwijl de webclient de volledige detailweergave nodig heeft. Met REST zou je ofwel over-fetchen op mobiel, ofwel twee endpoints moeten onderhouden. Met GraphQL expresseert elke client zijn eigen behoeften.

```graphql
# Mobiele query — lichtgewicht
query ProductList {
  products(first: 20) {
    id
    name
    thumbnail
  }
}

# Webquery — volledig detail
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

## Schema-First ontwerp

Voordat je een enkele resolver schrijft, ontwerp je het schema als een contract. Dit brengt frontend- en backendteams vroeg op één lijn en maakt breaking changes zichtbaar.

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

## Het N+1-probleem oplossen met DataLoader

Het meest voorkomende prestatieprobleem in GraphQL is het N+1-queryprobleem. Bij het ophalen van een lijst producten worden er bij het naïef resolven van `category` voor elk product N afzonderlijke databasequeries uitgevoerd.

DataLoader groepeert en cachet deze lookups binnen één enkele requestcyclus:

```typescript
const categoryLoader = new DataLoader<string, Category>(async (ids) => {
  const categories = await db.category.findMany({
    where: { id: { in: [...ids] } },
  });
  return ids.map(id => categories.find(c => c.id === id));
});
```

In je resolver:

```typescript
product: {
  category: (parent) => categoryLoader.load(parent.categoryId),
}
```

100 producten → 1 categoriequery in plaats van 100. Dit ene patroon kan de databasebelasting met ordes van grootte verminderen.

## Paginering op schaal

Cursorgebaseerde paginering presteert beter dan offset-paginering op schaal. Met offset-paginering dwingt `LIMIT 20 OFFSET 1000` de database om 1020 rijen te scannen en de eerste 1000 te negeren. Met cursors spring je direct naar de juiste rij.

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

## Belangrijkste punten

Bouw je schema als een product, niet als een weerspiegeling van je databaseschema. Gebruik DataLoader consequent — bijna elke lijstresolver heeft het nodig. Implementeer cursorpaginering vanaf dag één; het achteraf toevoegen is pijnlijk. En instrumenteer alles: volg de uitvoeringstijd van resolvers, querycomplexiteit en foutpercentages vanaf het begin.
