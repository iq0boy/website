---
title: 'Claude Code: mijn setup, de plugins die ik gebruik, en hoe ik er écht mee werk'
excerpt: 'Mijn Claude Code-setup na maanden dagelijks gebruik — de drie plugins die ik op elk project installeer, de standaard workflow, en de anti-patterns.'
pubDate: 2026-05-14
category: 'AI'
readTime: 8
tags: ['Claude Code', 'AI', 'Workflow', 'Productivity']
---

![Headerbeeld — Claude Code: mijn setup, de plugins die ik gebruik, en hoe ik er écht mee werk](../../../assets/blog/claude-code-workflow/hero.png)

Cursor, Copilot, Windsurf, Cline, Continue, Aider — ik gaf elke tool minstens een week. Al maanden gebruik ik Claude Code dagelijks, en het is de enige AI-tool die mijn cycles écht verkortte in plaats van ze te verplaatsen.

Dit is wat ik geleerd heb.

## Waarom Claude Code en niet Cursor

Cursor is uitstekend als **editor**. Claude Code is uitstekend als **collega**.

Dat onderscheid is geen detail. Cursor optimaliseert voor autocomplete en inline diffs — jij blijft piloot, de AI assisteert. Claude Code optimaliseert voor delegatie: je beschrijft een taak, hij voert hem uit, je reviewt de diff. Voor 80% van mijn werk (refactors, SEO, methodische bugfixes, content-tooling) is delegatie sneller. Voor 20% (subtiele algoritmes, fijngevoelig debuggen) blijft de autocomplete van een klassieke editor onverslaanbaar.

Ik gebruik beide. Maar voor deze site was het Claude Code voor 95%.

## Installatie

```bash
npm install -g @anthropic-ai/claude-code
claude
```

Dat is alles. Bij de eerste run log je in met je Anthropic-account en kies je Sonnet of Opus. Voor code is **Sonnet 4.6 de sweet spot** — sneller dan Opus, en het kwaliteitsverschil zie je niet in dagelijks werk. Houd Opus voor grote architecturale refactors of design reviews.

Start `claude` in de root van een Git-project. Het bestand `CLAUDE.md` in de root dient als projectgeheugen — Claude leest het bij elk gesprek. Zet erin:

- De commando's van het project (`npm run dev`, enz.)
- De belangrijkste conventies (één paragraaf, geen bijbel)
- De bekende valkuilen (services die een specifieke env-variabele nodig hebben, migraties die niet handmatig mogen, enz.)

## De plugins die alles veranderen

Claude Code-plugins zijn packages die **skills**, **slash commands** en **hooks** toevoegen. Drie installeer ik op elk project:

### `superpowers`

De allernuttigste, met afstand. Activeert skills zoals `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`. Het idee: voordat er code wordt geschreven, start je `/brainstorming` en het dwingt je om te verduidelijken wat je wilt **voordat** er één regel wordt geschreven. Op echte features verandert dit een slordige halve dag in twee gerichte uren.

```
/brainstorming
```

Het stelt één vraag per keer, stelt 2-3 benaderingen voor met hun trade-offs, schrijft een spec in `docs/superpowers/specs/`, en vraagt **pas dán** of het mag beginnen met coderen.

### `commit-commands`

```
/commit
/commit-push-pr
```

Leest de staged + unstaged diff, stelt een commit message voor dat de conventie van de repo respecteert, commit, en — als je dat vraagt — pusht en opent de PR. Geen gekopieer en geplak van diffs in de sandbox van een andere tool meer.

### `frontend-design`

Een gespecialiseerde skill die het bouwen van componenten / pagina's begeleidt met een designfocus. Strenger dan "maak me een hero section" — hij vraagt naar de emotionele intentie, stelt concrete referenties voor, en levert productie-klare code op. Dat is wat ik gebruikte voor de hero en de portfolio grid op deze site.

## Het dagelijkse workflow

Mijn standaardpatroon voor een nieuwe feature:

1. **`/brainstorming`** — verduidelijk het wat en het waarom. Output: een korte spec.
2. **Directe implementatie** als de feature klein is. **`/writing-plans`** als ze meer dan 200 regels gaat.
3. **Tijdens de uitvoering** schrijft Claude, ik review elke diff. Ik valideer nooit in batch.
4. **`/commit`** wanneer de stap groen is.
5. **`/code-review`** of `/security-review` op de PR vóór merge.

Voor lange sessies gebruik ik **`/remember`**: aan het eind van de dag bewaart het een state-memo in `.remember/now.md`, die de volgende sessie automatisch herlaadt.

## Skills, hooks, settings: waar het leeft

- **`~/.claude/CLAUDE.md`**: je globale config (je rol, je stijlvoorkeuren, je conventies over projecten heen).
- **`./CLAUDE.md`**: config per project.
- **`./.claude/settings.json`**: permissies, hooks, MCP servers. In plaats van elk Bash-commando met de hand goed te keuren, allow ik veilige commando's vooraf (`git status`, `npm run`, `ls`) — grote ergonomiewinst na één dag.
- **Hooks**: shell-scripts die op events geactiveerd worden (PreToolUse, PostToolUse, SessionStart, enz.). Ik gebruik er precies één: een PreToolUse die `rm -rf` buiten de repo blokkeert.

## Anti-patterns om te vermijden

**1. Iets vaags vragen en achteraf corrigeren.** Als je prompt begint met "maak dit netter", verlies je. Wees specifiek: "hernoem `foo` naar `bar` en verplaats `baz()` naar `utils/`". Anders verzint hij "verbeteringen" die je later moet uitkammen.

**2. Brainstormen overslaan op echte features.** Je schrijft de code twee keer. Een brainstormsessie kost 5 minuten; een herwerking omdat de requirements zijn verschoven kost een dag.

**3. Diffs niet lezen.** Claude schrijft 95% van de tijd goede code. De 5% die overblijft is sluw — een voorbarige optimalisatie, een `any`-cast, een circulaire import. Lees alles, of delegeer niets.

**4. Meerdere intenties in één sessie mengen.** "Fix de bug EN voeg deze feature toe EN refactor de module." Je krijgt één gigantische commit die niemand kan reviewen. Eén intentie = één sessie = één commit.

**5. Je API-key hardcoderen in een gecommit bestand.** Voor de hand liggend. Gebeurt. Gebruik een `.env` en de secret manager van het project.

## Wat ik voor de toekomst verwacht

Sub-agents (de `Agent`-tool) worden écht nuttig — een agent die reviewt terwijl je codeert, een ander die parallel tests schrijft. Het patroon "main agent + 3 specialisten" wint uren per week op grote refactors.

Als je vandaag begint, doe dan gewoon deze drie dingen:

1. Installeer de plugin `superpowers` en draai één keer `/brainstorming` — je gaat het begrijpen.
2. Schrijf een eerlijke `CLAUDE.md` in de root van je project.
3. Review de diff bij elke commit.

De rest komt vanzelf.
