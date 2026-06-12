---
title: "I stopped using shadcn/ui — here's what I do instead"
excerpt: "I installed shadcn/ui on a project, used two components, and realised I'd just adopted code to maintain. Nine projects later, I do it differently: DaisyUI + CSS variables."
pubDate: 2026-06-12
category: 'Engineering'
readTime: 7
tags: ['shadcn/ui', 'DaisyUI', 'Tailwind', 'React', 'CSS', 'Design']
draft: true
---

![Cover image — I stopped using shadcn/ui](../../../assets/blog/why-i-stopped-using-shadcn-ui/hero.png)

On a project last year I did what everyone does: `npx shadcn init`, new-york style, lucide, the aliases all neatly set up. Three months later I counted what I actually used: **two components**. A button and a navigation menu. For that, I had vendored `cn()`, tailwind-merge, Radix primitives, and an update debt nobody will ever pay.

Meanwhile, nine of my client projects run on DaisyUI without me ever thinking about it. Here's the reasoning.

## TL;DR

shadcn/ui is excellent at what it is: a starter design system for a product team that will keep it alive. For a freelancer shipping client sites — where every project needs its own identity and zero post-delivery maintenance — it's the wrong tool. Semantic classes (DaisyUI), CSS variables for theming, and the rare complex component hand-written: less sexy, ages better.

## "You own the code" cuts both ways

shadcn's central pitch is seductive: the code is copied into your repo, you own it. But owning means **maintaining**. When Radix fixes an accessibility bug or shadcn revises a component, your vendored copy doesn't move. Updating means diffing your modified code against the new canon, component by component. On a product with a team, that work happens. On a client site delivered eight months ago, it never will.

A copied component is not one dependency fewer. It's a **frozen** dependency, with no changelog.

## The entry cost is real

Your first shadcn button doesn't come alone: the `cn()` utility, `tailwind-merge`, `class-variance-authority`, Radix primitives, alias conventions. That's reasonable tooling for a design system. It's disproportionate for a brochure site that needs a button, a card and a form.

And there's the uniformity. shadcn has become *the* look of this year's product launches — to the point where "it looks like shadcn" is design criticism. My clients pay for an identity; starting from the same kit as everyone else is starting with a handicap.

## What I do instead

**DaisyUI for the base.** Semantic classes (`btn`, `card`, `badge`, `modal`) that keep markup readable — `class="btn btn-primary"` still reads fine in six months, a twenty-utility Tailwind string doesn't. It's pure CSS: zero JavaScript, zero hydration, works in Astro, Svelte, React, or nothing at all.

**CSS variables for identity.** Each project redefines a handful of variables (colors, radii, fonts) and DaisyUI follows via `data-theme`. On the NFC card platform this is pushed to the limit: every client card injects **its own colors as inline variables** and its light/dark theme via `data-theme` — theming per database record, without touching global CSS.

```html
<div data-theme="dark" style="--card-bg: #16161f; --link-color: oklch(0.7 0.15 220)">
  <!-- Every client gets their card in their colors. Zero per-client CSS. -->
</div>
```

**Complex components by hand, when they earn it.** A real date-picker or an accessible combobox isn't something you improvise — but on a brochure site I meet one a year. That day, I pull in the right headless primitive, for that component, and nothing else.

## When shadcn is still the right call

Honestly: a React product team building an internal dashboard, wanting Radix accessibility without paying for it by hand, and committed to keeping the design system alive — shadcn is an excellent starting point. My problem isn't the project's quality; it's the mismatch with the job of shipping client sites that have to live on their own.

## Takeaway

Open your last shadcn project and count the components in `components/ui/` that are actually imported somewhere. If you find fewer than five, you're not using a design system — you're carrying a design system's weight for the benefit of one button.
