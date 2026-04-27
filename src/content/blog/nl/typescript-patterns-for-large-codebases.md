---
title: "TypeScript-patronen voor grote codebases"
excerpt: "Geavanceerde TypeScript-patronen en -technieken die je code typeveilig en onderhoudbaar houden op grote schaal."
pubDate: 2026-01-05
category: "Frontend"
readTime: 7
---

Geavanceerde TypeScript-patronen en -technieken die je code typeveilig en onderhoudbaar houden op grote schaal.

De waarde van TypeScript ligt niet alleen in het opsporen van bugs — het ligt in de navigeerbaarheid van je codebase. In een groot team zijn types documentatie die nooit veroudert. Maar TypeScript kan ook een last worden: uitgebreide generics, omwegen voor de compiler, sluipend gebruik van `any`. De onderstaande patronen zijn die waarnaar ik grijp om de voordelen te krijgen zonder de pijn.

## Discriminated unions boven optionele velden

Als een type meerdere staten heeft, weersta dan de neiging om het te modelleren met optionele velden. Gebruik in plaats daarvan discriminated unions:

```typescript
// ✗ Fragiel — onduidelijk welke velden aanwezig zijn in welke staat
type AsyncData<T> = {
  data?: T;
  error?: Error;
  loading?: boolean;
};

// ✓ Elke staat is expliciet en uitputtend
type AsyncData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

Met discriminated unions weet de compiler precies wat er beschikbaar is in elke tak:

```typescript
function render<T>(state: AsyncData<T>) {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'error': return <Error message={state.error.message} />; // error is gegarandeerd
    case 'success': return <Data value={state.data} />;           // data is gegarandeerd
    case 'idle': return null;
  }
}
```

De `switch` is uitputtend — als je een nieuwe status toevoegt, geeft de compiler een fout totdat je die afhandelt.

## Template Literal Types voor string-API's

Template literal types laten je stringpatronen uitdrukken op typeniveau. Dit is bijzonder krachtig voor eventsystemen, CSS-in-JS en routing:

```typescript
type EventName = 'user' | 'order' | 'product';
type EventAction = 'created' | 'updated' | 'deleted';
type DomainEvent = `${EventName}.${EventAction}`;
// type DomainEvent = "user.created" | "user.updated" | "user.deleted" | "order.created" | ...

function emit(event: DomainEvent, payload: unknown) { ... }
emit('user.created', { id: 1 }); // ✓
emit('user.published', { id: 1 }); // ✗ Typefout
```

## De `satisfies`-operator

Geïntroduceerd in TypeScript 4.9, valideert `satisfies` dat een waarde voldoet aan een type zonder het te verbreden:

```typescript
type Routes = Record<string, { path: string; auth: boolean }>;

// Zonder satisfies: routes wordt verbreed naar Record<string, ...>, met verlies van letterlijke typen
const routes = {
  home: { path: '/', auth: false },
  dashboard: { path: '/dashboard', auth: true },
} satisfies Routes;

// routes.home.path is nog steeds getypeerd als '/', niet string
// TypeScript weet precies wat er is
```

Dit is van onschatbare waarde voor configuratieobjecten waar je zowel validatie als nauwkeurige inferentie wilt.

## Branded types voor domeinveiligheid

Twee waarden die beide `string` zijn, zijn structureel equivalent in TypeScript. Maar een `UserId` en een `OrderId` zijn semantisch verschillend — je moet nooit de ene doorgeven waar de andere wordt verwacht.

Branded types dwingen dit af op typeniveau zonder runtime-overhead:

```typescript
type Brand<T, B> = T & { readonly __brand: B };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): User { ... }

const orderId = createOrderId('ord_123');
getUser(orderId); // ✗ Typefout: Argument van type 'OrderId' is niet toewijsbaar aan parameter van type 'UserId'
```

## `infer` voor type-extractie

Het sleutelwoord `infer` laat je typen extraheren uit andere typen:

```typescript
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type UnpackArray<T> = T extends (infer U)[] ? U : T;

type ApiResponse = Promise<{ users: User[]; total: number }>;
type Resolved = UnpackPromise<ApiResponse>; // { users: User[]; total: number }
type UserArray = Resolved['users'];         // User[]
type SingleUser = UnpackArray<UserArray>;   // User
```

Dit patroon blinkt uit als je typen moet afleiden uit bibliotheek-returnwaarden zonder ze handmatig opnieuw te declareren.

## Belangrijkste punten

Gebruik discriminated unions wanneer een type meerdere staten heeft — de uitputtendheidscontrole betaalt zich terug in onderhoud. Grijp naar `satisfies` bij het bouwen van configuratieobjecten. Brand je domein-ID's vanaf het begin; brands toevoegen aan een bestaande codebase is pijnlijk. En houd je generics leesbaar: een functie met vier typeparameters is gewoonlijk een teken dat iets gesplitst of vereenvoudigd moet worden.
