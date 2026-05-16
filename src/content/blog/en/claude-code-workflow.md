---
title: 'Claude Code: my setup, the plugins I use, and how I actually work with it'
excerpt: 'My Claude Code setup after months of daily use — the three plugins I install on every project, the default workflow, and anti-patterns to avoid.'
pubDate: 2026-05-14
category: 'AI'
readTime: 8
tags: ['Claude Code', 'AI', 'Workflow', 'Productivity']
---

![Cover image — Claude Code: my setup, the plugins I use, and how I actually work with it](../../../assets/blog/claude-code-workflow/hero.png)

Cursor, Copilot, Windsurf, Cline, Continue, Aider — I gave each at least a week. For months now, Claude Code is what I use every day, and it's the only AI tool that actually shortened my cycles rather than displacing them.

Here's what I learned.

## Why Claude Code and not Cursor

Cursor is excellent as an **editor**. Claude Code is excellent as a **colleague**.

That distinction isn't a detail. Cursor optimizes for autocomplete and inline diffs — you stay in the pilot seat, the AI assists. Claude Code optimizes for delegation: you describe a task, it runs it, you review the diff. For 80% of my work (refactors, SEO, methodical bugfixes, content tooling), delegation is faster. For 20% (subtle algorithms, careful debugging), a classic editor's autocomplete is still unbeatable.

I use both. But for this site, it was Claude Code at 95%.

## Installation

```bash
npm install -g @anthropic-ai/claude-code
claude
```

That's it. On first run, log in with your Anthropic account and pick Sonnet or Opus. For code, **Sonnet 4.6 is the sweet spot** — faster than Opus, and the quality gap doesn't show on day-to-day work. Reserve Opus for big architectural refactors or design reviews.

Run `claude` at the root of a Git project. The `CLAUDE.md` file at the root is the project memory — Claude reads it at every conversation. Put in:

- Project commands (`npm run dev`, etc.)
- Key conventions (one paragraph, not a bible)
- Known pitfalls (services that need a specific env var, migrations not to run by hand, etc.)

## The plugins that change everything

Claude Code plugins are packages that add **skills**, **slash commands**, and **hooks**. Three I install on every project:

### `superpowers`

The single most useful one. Enables skills like `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`. The idea: before any code, you run `/brainstorming` and it forces you to clarify what you want **before** a single line gets written. On real features, this turns a sloppy half-day into a focused two hours.

```
/brainstorming
```

It asks one question at a time, proposes 2-3 approaches with their trade-offs, writes a spec into `docs/superpowers/specs/`, and **only then** asks whether it can start coding.

### `commit-commands`

```
/commit
/commit-push-pr
```

Reads the staged + unstaged diff, drafts a commit message that respects the repo's convention, commits, and — if you ask — pushes and opens the PR. No more copy-pasting diffs into a separate tool's sandbox.

### `frontend-design`

A specialized skill that guides component / page creation with a design focus. More rigorous than "make me a hero section" — it asks for emotional intent, suggests concrete references, and outputs production-ready code. It's what I used for the hero and the portfolio grid on this site.

## The daily workflow

My default pattern on a new feature:

1. **`/brainstorming`** — clarify the what and the why. Output: a short spec.
2. **Direct implementation** if the feature is small. **`/writing-plans`** if it'll exceed 200 lines.
3. **During execution**, Claude writes, I review every diff. I never validate in batch.
4. **`/commit`** when the step is green.
5. **`/code-review`** or `/security-review` on the PR before merge.

For long sessions, I use **`/remember`**: at the end of the day it saves a state memo into `.remember/now.md`, which the next session reloads automatically.

## Skills, hooks, settings: where they live

- **`~/.claude/CLAUDE.md`**: your global config (your role, your style preferences, your cross-project conventions).
- **`./CLAUDE.md`**: per-project config.
- **`./.claude/settings.json`**: permissions, hooks, MCP servers. Rather than approving each Bash command by hand, I pre-allow safe commands (`git status`, `npm run`, `ls`) — big ergonomic win after one day.
- **Hooks**: shell scripts triggered on events (PreToolUse, PostToolUse, SessionStart, etc.). I use exactly one: a PreToolUse that blocks `rm -rf` outside the repo.

## Anti-patterns to avoid

**1. Asking for something vague and correcting afterwards.** If your prompt starts with "make this cleaner", you lose. Be specific: "rename `foo` to `bar` and move `baz()` into `utils/`". Otherwise it invents "improvements" you'll have to unweave.

**2. Skipping brainstorming on real features.** You'll write the code twice. A brainstorming session costs 5 minutes; a rewrite because requirements drifted costs a day.

**3. Not reading diffs.** Claude writes good code 95% of the time. The 5% that remain are sneaky — a premature optimization, an `any` cast, a circular import. Read everything, or delegate nothing.

**4. Mixing intentions in one session.** "Fix the bug AND add this feature AND refactor the module." You end up with a giant un-reviewable commit. One intention = one session = one commit.

**5. Hardcoding your API key in a committed file.** Obvious. Happens. Use a `.env` and the project's secret manager.

## What I'm looking forward to

Sub-agents (the `Agent` tool) are becoming genuinely useful — a reviewer running while you code, another writing tests in parallel. The "main agent + 3 specialists" pattern saves hours per week on big refactors.

If you're starting today, just do these three things:

1. Install the `superpowers` plugin and run `/brainstorming` once — you'll get it.
2. Write an honest `CLAUDE.md` at the root of your project.
3. Review the diff at every commit.

The rest will come naturally.
