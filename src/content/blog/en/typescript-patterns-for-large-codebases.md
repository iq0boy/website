---
title: "TypeScript Patterns for Large Codebases"
excerpt: "Advanced TypeScript patterns and techniques that keep your code type-safe and maintainable at scale."
pubDate: 2026-01-05
category: "Frontend"
readTime: 7
---

Advanced TypeScript patterns and techniques that keep your code type-safe and maintainable at scale.

TypeScript's value isn't just in catching bugs — it's in making your codebase navigable. In a large team, types are documentation that never goes stale. But TypeScript can also become a tax: verbose generics, workarounds for the compiler, `any` creep. The patterns below are the ones I reach for to get the benefits without the pain.

## Discriminated Unions Over Optional Fields

When a type has multiple states, resist the urge to model it as optional fields. Instead, use discriminated unions:

```typescript
// ✗ Fragile — unclear which fields are present in which state
type AsyncData<T> = {
  data?: T;
  error?: Error;
  loading?: boolean;
};

// ✓ Each state is explicit and exhaustive
type AsyncData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

With discriminated unions, the compiler knows exactly what's available at each branch:

```typescript
function render<T>(state: AsyncData<T>) {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'error': return <Error message={state.error.message} />; // error is guaranteed
    case 'success': return <Data value={state.data} />;           // data is guaranteed
    case 'idle': return null;
  }
}
```

The `switch` is exhaustive — if you add a new status, the compiler will error until you handle it.

## Template Literal Types for String APIs

Template literal types let you express string patterns at the type level. This is particularly powerful for event systems, CSS-in-JS, and routing:

```typescript
type EventName = 'user' | 'order' | 'product';
type EventAction = 'created' | 'updated' | 'deleted';
type DomainEvent = `${EventName}.${EventAction}`;
// type DomainEvent = "user.created" | "user.updated" | "user.deleted" | "order.created" | ...

function emit(event: DomainEvent, payload: unknown) { ... }
emit('user.created', { id: 1 }); // ✓
emit('user.published', { id: 1 }); // ✗ Type error
```

## The `satisfies` Operator

Introduced in TypeScript 4.9, `satisfies` validates that a value conforms to a type without widening it:

```typescript
type Routes = Record<string, { path: string; auth: boolean }>;

// Without satisfies: routes is widened to Record<string, ...>, losing literal types
const routes = {
  home: { path: '/', auth: false },
  dashboard: { path: '/dashboard', auth: true },
} satisfies Routes;

// routes.home.path is still typed as '/', not string
// TypeScript knows exactly what's there
```

This is invaluable for config objects where you want both validation and precise inference.

## Branded Types for Domain Safety

Two values that are both `string` are structurally equivalent in TypeScript. But a `UserId` and an `OrderId` are semantically different — you should never pass one where the other is expected.

Branded types enforce this at the type level with zero runtime overhead:

```typescript
type Brand<T, B> = T & { readonly __brand: B };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): User { ... }

const orderId = createOrderId('ord_123');
getUser(orderId); // ✗ Type error: Argument of type 'OrderId' is not assignable to parameter of type 'UserId'
```

## `infer` for Type Extraction

The `infer` keyword lets you extract types from other types:

```typescript
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type UnpackArray<T> = T extends (infer U)[] ? U : T;

type ApiResponse = Promise<{ users: User[]; total: number }>;
type Resolved = UnpackPromise<ApiResponse>; // { users: User[]; total: number }
type UserArray = Resolved['users'];         // User[]
type SingleUser = UnpackArray<UserArray>;   // User
```

This pattern shines when you need to derive types from library return values without manually re-declaring them.

## Key Takeaways

Use discriminated unions whenever a type has multiple states — the exhaustiveness checking pays dividends in maintenance. Reach for `satisfies` when building config objects. Brand your domain identifiers from the start; adding brands to an existing codebase is painful. And keep your generics readable: a function with four type parameters is usually a sign that something needs to be split or simplified.
