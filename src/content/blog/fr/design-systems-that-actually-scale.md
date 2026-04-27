---
title: "Des systèmes de design qui passent vraiment à l'échelle"
excerpt: "Leçons tirées de la construction et de la maintenance de systèmes de design à travers plusieurs produits et équipes."
pubDate: 2026-02-10
category: "Design"
readTime: 10
---

Leçons tirées de la construction et de la maintenance de systèmes de design à travers plusieurs produits et équipes.

Un système de design est l'un de ces investissements qui rapporte énormément quand il est bien fait et devient un passif quand il est mal fait. La différence vient rarement des tokens ou de la bibliothèque de composants — elle vient du processus, de la gouvernance et de la volonté de traiter le système comme un produit à part entière.

## Commencer par les fondations, pas par les composants

L'erreur la plus courante est de construire des composants avant d'avoir établi les fondations. Les équipes se précipitent pour construire un composant Button avant d'avoir convenu de ce que signifie « primary », de quelle est l'échelle d'espacement, ou de comment les rôles de couleur se mappent à une intention sémantique.

Une fondation solide se compose de quatre couches :

1. **Tokens de design** — les valeurs brutes (couleurs, tailles, durées)
2. **Tokens sémantiques** — des alias mappés par intention (`color.action.primary` → `#5B6AD0`)
3. **Tokens de composant** — des surcharges spécifiques au composant (`button.bg` → `color.action.primary`)
4. **Composants** — construits en utilisant uniquement les tokens de composant

Cette hiérarchie signifie que changer la couleur de votre marque ne nécessite que de mettre à jour un seul token, sans avoir à traquer les styles dans tous les composants.

```css
/* Tokens de fondation */
:root {
  --color-blue-500: oklch(0.55 0.18 250);
  --space-4: 1rem;
  --radius-md: 0.375rem;
}

/* Tokens sémantiques */
:root {
  --color-action-primary: var(--color-blue-500);
  --space-component-padding-md: var(--space-4);
}

/* Composant */
.btn-primary {
  background: var(--color-action-primary);
  padding: var(--space-component-padding-md);
  border-radius: var(--radius-md);
}
```

## Le problème du versioning

Les systèmes de design vivent assez longtemps pour accumuler de la dette technique. La question est de savoir comment les faire évoluer sans casser les dizaines d'équipes qui en dépendent.

Le versioning sémantique est le minimum requis. Ce qui compte encore plus, c'est la **communication** :

- **Patch** (1.0.x) — corrections de bugs, jamais cassant
- **Minor** (1.x.0) — nouveaux composants, dépréciations annoncées
- **Major** (x.0.0) — changements cassants, guides de migration obligatoires

Nous avons adopté un cycle de dépréciation en deux étapes : déprécier en minor, supprimer dans la prochaine major. Cela donne aux équipes au moins une version complète pour migrer. Pour chaque dépréciation, nous avons livré un codemod qui automatisait 90 % de la migration.

## La documentation comme préoccupation de premier ordre

Un composant qui n'est pas documenté n'existe pas pour la plupart des développeurs. La documentation n'est pas seulement une référence d'API — c'est montrer le *pourquoi* derrière les décisions, démontrer ce qu'il faut faire et ne pas faire, et fournir des exemples copier-coller qui fonctionnent vraiment.

La documentation à plus haute valeur ajoutée que vous pouvez écrire est la section **guide d'utilisation** :

> ✓ Utilisez `<Button variant="primary">` pour l'action unique la plus importante par page.
>
> ✗ N'utilisez pas plusieurs boutons primaires dans la même section — cela dilue la hiérarchie.

Ces lignes courtes évitent que les mêmes questions soient posées 40 fois par semaine sur Slack.

## La gouvernance : la partie difficile

Le travail technique est la partie facile. La partie vraiment difficile est de décider qui détermine ce qui entre dans le système.

Un modèle de contribution ouverte où n'importe qui peut proposer et fusionner des composants semble inclusif mais conduit à une bibliothèque proliférante avec 12 variantes de cartes légèrement différentes et aucune propriété claire. Un modèle fermé où seule une équipe dédiée livre des composants crée un goulot d'étranglement.

Le modèle qui fonctionne : **RFC de contribution + revue**. N'importe qui peut proposer un composant via un court template RFC (cas d'usage, solutions existantes examinées, API proposée). L'équipe centrale évalue la faisabilité et la conception de l'API. Les contributeurs construisent avec un support de pair. L'équipe centrale gère la documentation et la maintenance à long terme.

Cela rend le système collaboratif tout en maintenant une qualité et une cohérence élevées.

## Points clés

Un système de design n'est jamais terminé — prévoyez 20 % de la capacité d'équipe pour la maintenance. Les tokens sont plus importants que les composants ; investissez-y en premier. Chaque changement cassant nécessite un chemin de migration, pas seulement une entrée dans le changelog. Et mesurez l'adoption : si les équipes n'utilisent pas le système, découvrez pourquoi avant d'ajouter plus de composants.
