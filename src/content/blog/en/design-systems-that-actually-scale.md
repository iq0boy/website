---
title: "Design Systems That Actually Scale"
excerpt: "Lessons learned from building and maintaining design systems across multiple products and teams."
pubDate: 2026-02-10
category: "Design"
readTime: 10
---

Lessons learned from building and maintaining design systems across multiple products and teams.

A design system is one of those investments that pays off enormously when done right and becomes a liability when done wrong. The difference is rarely about the tokens or the component library — it's about the process, governance, and the willingness to treat the system as a product.

## Start With Foundations, Not Components

The most common mistake is building components before establishing foundations. Teams rush to build a Button component before they've agreed on what "primary" means, what the spacing scale is, or how color roles map to semantic intent.

A solid foundation consists of four layers:

1. **Design tokens** — the raw values (colors, sizes, durations)
2. **Semantic tokens** — intent-mapped aliases (`color.action.primary` → `#5B6AD0`)
3. **Component tokens** — component-specific overrides (`button.bg` → `color.action.primary`)
4. **Components** — built using component tokens only

This hierarchy means that changing your brand color requires updating a single token, not hunting through component styles.

```css
/* Foundation tokens */
:root {
  --color-blue-500: oklch(0.55 0.18 250);
  --space-4: 1rem;
  --radius-md: 0.375rem;
}

/* Semantic tokens */
:root {
  --color-action-primary: var(--color-blue-500);
  --space-component-padding-md: var(--space-4);
}

/* Component */
.btn-primary {
  background: var(--color-action-primary);
  padding: var(--space-component-padding-md);
  border-radius: var(--radius-md);
}
```

## The Versioning Problem

Design systems live long enough to accumulate technical debt. The question is how to evolve them without breaking the dozens of teams depending on them.

Semantic versioning is table stakes. What matters more is **communication**:

- **Patch** (1.0.x) — bug fixes, never breaking
- **Minor** (1.x.0) — new components, deprecations announced
- **Major** (x.0.0) — breaking changes, migration guides required

We adopted a two-step deprecation cycle: deprecate in minor, remove in the next major. This gives teams at least one full version to migrate. For every deprecation, we shipped a codemod that automated 90% of the migration.

## Documentation as a First-Class Concern

A component that isn't documented doesn't exist for most developers. Documentation isn't just API reference — it's showing the *why* behind decisions, demonstrating the do's and don'ts, and providing copy-paste examples that actually work.

The highest-value documentation you can write is the **usage guidance** section:

> ✓ Use `<Button variant="primary">` for the single most important action per page.
>
> ✗ Don't use multiple primary buttons in the same section — it dilutes hierarchy.

These one-liners prevent the same questions from being asked in Slack 40 times a week.

## Governance: The Hard Part

The technical work is the easy part. The genuinely hard part is who decides what goes into the system.

An open contribution model where anyone can propose and merge components sounds inclusive but leads to a sprawling library with 12 slightly different card variants and no clear ownership. A closed model where only a dedicated team ships components creates a bottleneck.

The model that works: **contribution RFC + review**. Anyone can propose a component via a short RFC template (use case, existing solutions reviewed, proposed API). The core team reviews feasibility and API design. Contributors build with pairing support. The core team owns documentation and long-term maintenance.

This makes the system feel collaborative while keeping quality and coherence high.

## Key Takeaways

A design system is never done — plan for 20% of team capacity to go to maintenance. Tokens are more important than components; invest there first. Every breaking change needs a migration path, not just a changelog entry. And measure adoption: if teams aren't using the system, find out why before adding more components.
