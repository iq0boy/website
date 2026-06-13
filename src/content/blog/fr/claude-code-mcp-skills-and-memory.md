---
title: 'Claude Code, niveau 2 : MCP, skills et mémoire persistante'
excerpt: "Suite de mon premier billet sur Claude Code : les serveurs MCP, le système de skills, la mémoire persistante et les sous-agents — le setup qui fait réellement le travail, avec des exemples tirés de ce site."
pubDate: 2026-06-12
category: 'AI'
readTime: 10
tags: ['Claude Code', 'AI', 'MCP', 'Workflow', 'Productivity']
draft: false
---

![Visuel d'en-tête — Claude Code, niveau 2 : MCP, skills et mémoire persistante](../../../assets/blog/claude-code-mcp-skills-and-memory/hero.png)

Dans [mon premier billet sur Claude Code](/blog/claude-code-workflow), je décrivais les bases : l'installation, les trois plugins de départ, le workflow par défaut. Six mois plus tard, mon setup a beaucoup grossi — et ce sont les couches que je n'avais pas couvertes qui font aujourd'hui la vraie différence. Quatre d'entre elles : les serveurs **MCP**, le système de **skills**, la **mémoire persistante**, et les **sous-agents**.

Tous les exemples ci-dessous viennent de vrai travail sur ce site et sur mes projets clients.

## TL;DR

Un Claude Code "nu" est un bon pair-programmeur. Branché sur des serveurs MCP (mon vault Obsidian, le navigateur, la doc à jour), nourri par des skills qui imposent une méthode, doté d'une mémoire qui survit aux sessions, et capable de déléguer à des sous-agents en parallèle, il devient un collègue qui connaît mon contexte et mes habitudes. Le coût : du setup, et la discipline de garder tout ça honnête.

## Les serveurs MCP : donner des mains à Claude

Le **Model Context Protocol** est un standard ouvert qui laisse Claude Code parler à des outils externes via des serveurs. Concrètement, chaque serveur MCP ajoute un paquet d'outils que Claude peut appeler comme il appelle `Read` ou `Bash`. Trois que j'utilise au quotidien :

**Obsidian.** Mon vault de notes (clients, projets, démarches d'indépendant) est exposé via le plugin Local REST API. Claude lit, cherche et écrit dedans directement. Quand je termine une session de travail sur un projet client, il documente ce qui a été fait dans la bonne note, avec les bons `[[wikilinks]]` — sans que je quitte le terminal. La note de ce site et celles des projets clients sont tenues à jour comme un effet de bord du travail, pas comme une corvée séparée.

**Chrome DevTools.** Un serveur qui pilote un vrai navigateur : naviguer, cliquer, prendre des screenshots, lire la console, lancer un audit Lighthouse. C'est avec ça que j'illustre mes études de cas portfolio — Claude lance le projet en local, capture les pages réelles, et les insère dans le Markdown. Plus de captures manuelles à recadrer.

**Context7.** Récupère la doc à jour d'une librairie au moment où on en a besoin. Le training data d'un modèle a toujours un horizon ; Context7 comble le trou pour les API qui ont bougé récemment. Je l'invoque dès que je touche à une lib que je connais mal ou dont la version a changé.

> La règle que je me donne : un serveur MCP doit gagner sa place. Chacun élargit la surface d'attaque et le contexte chargé. Trois bien choisis valent mieux que dix par curiosité.

## Les skills : de la méthode, pas juste des réponses

Un **skill** est un paquet d'instructions que Claude charge à la demande quand la tâche correspond. La différence avec un simple prompt : le skill impose une *manière de faire*, pas juste un résultat.

Le plugin `superpowers` en fournit toute une bibliothèque. Ceux que j'utilise vraiment :

- **`brainstorming`** — avant toute création, il me cuisine sur l'intention et les contraintes. Une question à la fois, jusqu'à ce que le besoin soit net.
- **`systematic-debugging`** — face à un bug, il reproduit, minimise, formule une hypothèse, instrumente, *puis* corrige. Il m'empêche de sauter direct au correctif plausible-mais-faux.
- **`test-driven-development`** — red-green-refactor, discipline stricte. Sur de la logique métier, c'est non négociable.
- **`writing-plans`** puis **`executing-plans`** — pour les tâches qui dépassent une session, un plan écrit que je relis avant qu'une ligne de code soit produite.

Le point qui change tout : ces skills ont la priorité sur le comportement par défaut du modèle, **mais mes instructions à moi passent avant les skills**. Un `CLAUDE.md` qui dit "pas de TDD ici" gagne contre un skill qui prêche le TDD. La hiérarchie est claire : moi, puis les skills, puis le modèle.

## La mémoire persistante : ne pas réexpliquer son contexte

Par défaut, chaque session repart de zéro. Deux mécanismes corrigent ça.

**La mémoire de fond.** Claude tient des fichiers de mémoire — qui je suis, mes préférences de travail, les décisions de projet non déductibles du code. Au fil des sessions, il arrête de me redemander ce qu'il devrait déjà savoir : ma stack par défaut, mon ton, le fait que je travaille en indépendant complémentaire.

**Les handoffs entre sessions.** Un hook `SessionStart` recharge automatiquement un mémo de l'état laissé par la session précédente (`.remember/`). En fin de journée, la skill `remember` écrit ce qui a été fait, ce qui reste, et les pièges rencontrés. Le lendemain, je ne repars pas de zéro — la session suivante sait où on en était.

C'est précisément ce qui rend une suite de sessions cohérente : ce billet, les études de cas, le budget Lighthouse en CI — chaque étape a été reprise par la session suivante sans que je réexplique le contexte.

## Les sous-agents : déléguer en parallèle

Le vrai saut de productivité récent, ce sont les **sous-agents**. Claude peut lancer des agents spécialisés en parallèle, chacun avec son propre contexte, et n'en récupérer que la conclusion.

Exemple concret de ce site : pour approfondir mes études de cas portfolio, j'avais besoin de faits *vérifiés* — pas inventés — sur trois projets clients. Plutôt que de fouiller chaque repo à la main, trois agents `Explore` ont été lancés en même temps, un par projet. Chacun a creusé son repo (historique Git, dépendances, README, points de douleur dans les commits) et m'a rendu un rapport factuel. J'ai écrit les études de cas à partir de ces rapports — avec des vrais chiffres : nombre de commits, durée, taille du build, nombre de pages.

Pour les tâches plus structurées, le **Workflow** orchestre des agents de façon déterministe — fan-out pour couvrir large, vérification adversariale avant de conclure. Le pattern "agent principal + N spécialistes" gagne des heures sur les gros refactors et les revues exhaustives.

L'avertissement : un sous-agent te rend du texte, pas un diff que tu as lu. Je traite toujours leur sortie comme une *source à vérifier*, jamais comme une vérité acquise — surtout quand elle va finir publiée.

## Le workflow honnête

Ma boucle par défaut aujourd'hui :

1. **Contexte chargé tout seul** — mémoire + handoff de la veille au démarrage.
2. **`/brainstorming`** sur les vraies features ; implémentation directe sur les petites.
3. **Délégation en parallèle** quand le travail se découpe (recherche, mining de repos, revue multi-angle).
4. **Lecture de chaque diff.** Non négociable. Les sous-agents et MCP élargissent ce que je délègue, pas ce que je valide à l'aveugle.
5. **`/commit`** quand c'est vert, **`/code-review`** avant merge.
6. **`remember`** en fin de session pour la suivante.

## Trade-offs

Tout ça a un prix. Plus de serveurs MCP = plus de surface et plus de contexte chargé à chaque tour. La mémoire peut vieillir : une note qui dit "le flag X existe" devient fausse quand le flag disparaît — je vérifie avant de m'y fier. Et la délégation en parallèle brûle des tokens vite ; je la réserve aux tâches qui le justifient vraiment.

Le piège de fond reste le même que dans le premier billet : **déléguer n'est pas abdiquer.** Plus l'outillage est puissant, plus il est tentant de valider en batch. C'est exactement là que les 5 % d'erreurs sournoises passent.

## À retenir

Si tu as déjà les bases de Claude Code, ajoute *une* couche cette semaine : branche un seul serveur MCP utile à ton vrai travail (pour moi, ça a été Obsidian) et utilise-le sur une vraie tâche. Tu sentiras tout de suite la différence entre un assistant qui répond et un collègue qui connaît ton contexte. Le reste se construit par-dessus.
