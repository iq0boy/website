---
title: 'Claude Code : ma config, mes plugins et comment je l''utilise vraiment'
excerpt: 'Ma config Claude Code après plusieurs mois d''usage quotidien — les trois plugins indispensables, le workflow par défaut, et les anti-patterns à éviter.'
pubDate: 2026-05-14
category: 'AI'
readTime: 8
tags: ['Claude Code', 'AI', 'Workflow', 'Productivity']
---

![Visuel d'en-tête — Claude Code : ma config, mes plugins et comment je l'utilise vraiment](../../../assets/blog/claude-code-workflow/hero.png)

Cursor, Copilot, Windsurf, Cline, Continue, Aider — j'ai testé sérieusement chacun pendant au moins une semaine. Depuis quelques mois, c'est Claude Code que j'utilise tous les jours, et c'est le seul outil IA qui ait réellement raccourci mes cycles plutôt que de les déplacer ailleurs.

Voici ce que j'ai retenu.

## Pourquoi Claude Code et pas Cursor

Cursor est excellent comme **éditeur**. Claude Code est excellent comme **collègue**.

La distinction n'est pas un détail. Cursor optimise l'autocomplete et le diff inline — tu restes pilote, l'IA assiste. Claude Code optimise la délégation : tu décris une tâche, il l'exécute, tu reviewes le diff. Pour 80 % de mon travail (refactos, SEO, bugfixes méthodiques, content tooling), la délégation est plus rapide. Pour 20 % (algo subtil, debug fin), l'autocomplete d'un éditeur classique reste imbattable.

J'utilise les deux. Mais pour ce site, c'est Claude Code à 95 %.

## Installation

```bash
npm install -g @anthropic-ai/claude-code
claude
```

C'est tout. À la première exécution, tu te connectes avec ton compte Anthropic et tu choisis Sonnet ou Opus. Pour du code, **Sonnet 4.6 est le sweet-spot** — plus rapide qu'Opus, et la différence de qualité ne se voit pas sur du dev quotidien. Opus pour les refontes structurelles ou la review d'archi.

Lance `claude` dans la racine d'un projet Git. Le fichier `CLAUDE.md` à la racine sert de mémoire projet — Claude le lit à chaque conversation. Mets-y :

- Les commandes du projet (`npm run dev`, etc.)
- Les conventions clés (un paragraphe, pas une bible)
- Les pièges connus (les services qui demandent une variable d'env précise, les migrations à ne pas faire en main, etc.)

## Les plugins qui changent tout

Les plugins Claude Code, ce sont des packages qui ajoutent des **skills**, des **slash commands** et des **hooks**. Trois que j'installe sur tous mes projets :

### `superpowers`

Le plus utile, et de loin. Active des skills comme `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`. Le concept : avant qu'il code, tu lances `/brainstorm` et il te force à clarifier ce que tu veux **avant** d'écrire la moindre ligne. Sur les vraies features, ça transforme une demi-journée brouillonne en deux heures cadrées.

```
/brainstorming
```

Il pose une question à la fois, propose 2-3 approches avec leurs trade-offs, écrit un spec dans `docs/superpowers/specs/`, et **seulement ensuite** demande s'il peut commencer à coder.

### `commit-commands`

```
/commit
/commit-push-pr
```

Lis le diff staged + unstaged, propose un message de commit qui respecte la convention du repo, commit, et — si tu lui demandes — push et ouvre la PR. Aucun cycle de copy-paste de diff dans la sandbox d'un autre outil.

### `frontend-design`

Une skill spécialisée qui guide la création de composants/pages avec un focus design. Plus rigoureuse que "make me a hero section" — elle te demande l'intention émotionnelle, propose des références concrètes, et sort du code production-ready. C'est ce que j'ai utilisé pour le hero et la grille de portfolio de ce site.

## Le workflow quotidien

Mon pattern par défaut sur une nouvelle feature :

1. **`/brainstorming`** — clarifier le quoi et le pourquoi. Output : un spec court.
2. **Implémentation directe** si la feature est petite. **`/writing-plans`** si elle dépasse 200 lignes.
3. **Pendant l'exécution**, Claude écrit, je relis chaque diff. Je ne valide jamais en batch.
4. **`/commit`** quand l'étape est verte.
5. **`/code-review`** ou `/security-review` sur la PR avant merge.

Pour les sessions longues, j'utilise **`/remember`** : à la fin de la journée, ça sauvegarde un mémo de l'état dans `.remember/now.md`, que la session suivante recharge automatiquement.

## Skills, hooks, settings : où ça vit

- **`~/.claude/CLAUDE.md`** : ta config globale (ton rôle, tes préférences de style, tes conventions trans-projet).
- **`./CLAUDE.md`** : config par projet.
- **`./.claude/settings.json`** : permissions, hooks, MCP servers. Plutôt que d'approuver chaque commande Bash manuellement, je préconfigure les commandes safe (`git status`, `npm run`, `ls`) — gros gain d'ergonomie après une journée.
- **Hooks** : scripts shell déclenchés sur des événements (PreToolUse, PostToolUse, SessionStart, etc.). J'en utilise un seul : un PreToolUse qui bloque `rm -rf` sur des chemins en dehors du repo.

## Les anti-patterns à éviter

**1. Demander un truc vague et corriger après coup.** Si ton prompt commence par "rends ça plus propre", tu perds. Sois spécifique : "renomme `foo` en `bar`, et déplace `baz()` dans `utils/`". Sinon il invente des "améliorations" que tu vas devoir détricoter.

**2. Skip le brainstorming sur les vraies features.** Tu vas écrire deux fois le code. Le coût d'une session brainstorming est de 5 minutes ; le coût d'une refonte parce que les requirements ont dérivé, c'est une journée.

**3. Ne pas lire les diffs.** Claude écrit du bon code 95 % du temps. Les 5 % qui restent sont sournois — une optimisation prématurée, un cast `any`, un import circulaire. Lis tout, ou ne délègue rien.

**4. Mélanger plusieurs intentions dans une session.** "Fix le bug ET ajoute cette feature ET refacto le module". Tu vas obtenir un commit géant impossible à reviewer. Une intention = une session = un commit.

**5. Hardcoder ta clé API dans un fichier commité.** Évident. Ça arrive. Utilise un `.env` et le gestionnaire de secrets du projet.

## Ce que j'attends pour la suite

Les sub-agents (`Agent` tool) sont en train de devenir vraiment utiles — un agent qui review pendant que tu codes, un autre qui écrit des tests en parallèle. Le pattern "main agent + 3 spécialistes" gagne plusieurs heures par semaine sur les gros refactos.

Si tu démarres aujourd'hui, fais juste ces trois choses :

1. Installe le plugin `superpowers` et utilise `/brainstorming` une fois — tu vas comprendre.
2. Écris un `CLAUDE.md` honnête à la racine de ton projet.
3. Reviewе le diff à chaque commit.

Le reste viendra naturellement.
