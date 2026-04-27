---
title: "Patterns TypeScript pour les grandes bases de code"
excerpt: "Patterns et techniques TypeScript avancés pour garder votre code typé et maintenable à grande échelle."
pubDate: 2026-01-05
category: "Frontend"
readTime: 7
---

Patterns et techniques TypeScript avancés pour garder votre code typé et maintenable à grande échelle.

La valeur de TypeScript ne se limite pas à la détection de bugs — elle réside dans la navigabilité de votre base de code. Dans une grande équipe, les types sont une documentation qui ne devient jamais obsolète. Mais TypeScript peut aussi devenir un impôt : des génériques verbeux, des contournements pour le compilateur, une prolifération de `any`. Les patterns ci-dessous sont ceux vers lesquels je me tourne pour obtenir les bénéfices sans la douleur.

## Unions discriminées plutôt que champs optionnels

Quand un type a plusieurs états, résistez à la tentation de le modéliser avec des champs optionnels. Utilisez plutôt des unions discriminées :

```typescript
// ✗ Fragile — peu clair quels champs sont présents dans quel état
type AsyncData<T> = {
  data?: T;
  error?: Error;
  loading?: boolean;
};

// ✓ Chaque état est explicite et exhaustif
type AsyncData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

Avec les unions discriminées, le compilateur sait exactement ce qui est disponible à chaque branche :

```typescript
function render<T>(state: AsyncData<T>) {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'error': return <Error message={state.error.message} />; // error est garanti
    case 'success': return <Data value={state.data} />;           // data est garanti
    case 'idle': return null;
  }
}
```

Le `switch` est exhaustif — si vous ajoutez un nouveau statut, le compilateur émettra une erreur jusqu'à ce que vous le gériez.

## Template Literal Types pour les APIs de chaînes

Les template literal types vous permettent d'exprimer des patterns de chaînes au niveau des types. C'est particulièrement puissant pour les systèmes d'événements, le CSS-in-JS et le routage :

```typescript
type EventName = 'user' | 'order' | 'product';
type EventAction = 'created' | 'updated' | 'deleted';
type DomainEvent = `${EventName}.${EventAction}`;
// type DomainEvent = "user.created" | "user.updated" | "user.deleted" | "order.created" | ...

function emit(event: DomainEvent, payload: unknown) { ... }
emit('user.created', { id: 1 }); // ✓
emit('user.published', { id: 1 }); // ✗ Erreur de type
```

## L'opérateur `satisfies`

Introduit dans TypeScript 4.9, `satisfies` valide qu'une valeur est conforme à un type sans l'élargir :

```typescript
type Routes = Record<string, { path: string; auth: boolean }>;

// Sans satisfies : routes est élargi à Record<string, ...>, perdant les types littéraux
const routes = {
  home: { path: '/', auth: false },
  dashboard: { path: '/dashboard', auth: true },
} satisfies Routes;

// routes.home.path est toujours typé comme '/', pas string
// TypeScript sait exactement ce qui est là
```

C'est inestimable pour les objets de configuration où vous voulez à la fois validation et inférence précise.

## Types brandés pour la sécurité du domaine

Deux valeurs qui sont toutes deux des `string` sont structurellement équivalentes en TypeScript. Mais un `UserId` et un `OrderId` sont sémantiquement différents — vous ne devriez jamais en passer un là où l'autre est attendu.

Les types brandés appliquent cela au niveau des types avec zéro surcharge d'exécution :

```typescript
type Brand<T, B> = T & { readonly __brand: B };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): User { ... }

const orderId = createOrderId('ord_123');
getUser(orderId); // ✗ Erreur de type : L'argument de type 'OrderId' n'est pas assignable au paramètre de type 'UserId'
```

## `infer` pour l'extraction de types

Le mot-clé `infer` vous permet d'extraire des types d'autres types :

```typescript
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type UnpackArray<T> = T extends (infer U)[] ? U : T;

type ApiResponse = Promise<{ users: User[]; total: number }>;
type Resolved = UnpackPromise<ApiResponse>; // { users: User[]; total: number }
type UserArray = Resolved['users'];         // User[]
type SingleUser = UnpackArray<UserArray>;   // User
```

Ce pattern brille quand vous devez dériver des types à partir des valeurs de retour de bibliothèques sans les redéclarer manuellement.

## Points clés

Utilisez des unions discriminées chaque fois qu'un type a plusieurs états — la vérification d'exhaustivité rapporte des dividendes en maintenance. Utilisez `satisfies` pour construire des objets de configuration. Brandez vos identifiants de domaine dès le départ ; ajouter des brands à une base de code existante est douloureux. Et gardez vos génériques lisibles : une fonction avec quatre paramètres de type est généralement le signe que quelque chose doit être divisé ou simplifié.
