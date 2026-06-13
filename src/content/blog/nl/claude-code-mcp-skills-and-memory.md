---
title: 'Claude Code, niveau 2: MCP, skills en persistent geheugen'
excerpt: "Vervolg op mijn eerste Claude Code-post: MCP-servers, het skills-systeem, persistent geheugen en sub-agents — de setup die het werk echt doet, met voorbeelden van deze site."
pubDate: 2026-06-12
category: 'AI'
readTime: 10
tags: ['Claude Code', 'AI', 'MCP', 'Workflow', 'Productivity']
draft: false
---

![Coverbeeld — Claude Code, niveau 2: MCP, skills en persistent geheugen](../../../assets/blog/claude-code-mcp-skills-and-memory/hero.png)

In [mijn eerste Claude Code-post](/nl/blog/claude-code-workflow) behandelde ik de basis: installatie, de drie startplugins, de standaardworkflow. Zes maanden later is mijn setup flink gegroeid — en het zijn de lagen die ik toen niet behandelde die nu het echte verschil maken. Vier ervan: **MCP**-servers, het **skills**-systeem, **persistent geheugen** en **sub-agents**.

Alle voorbeelden hieronder komen uit echt werk op deze site en mijn klantprojecten.

## TL;DR

Een kale Claude Code is een goede pair programmer. Gekoppeld aan MCP-servers (mijn Obsidian-vault, de browser, actuele docs), gevoed door skills die een methode afdwingen, voorzien van geheugen dat sessies overleeft, en in staat om in parallel te delegeren aan sub-agents, wordt het een collega die mijn context en gewoontes kent. De kost: setup, en de discipline om dat alles eerlijk te houden.

## MCP-servers: Claude handen geven

Het **Model Context Protocol** is een open standaard waarmee Claude Code via servers met externe tools praat. In de praktijk voegt elke MCP-server een bundel tools toe die Claude kan aanroepen zoals het `Read` of `Bash` aanroept. Drie die ik dagelijks gebruik:

**Obsidian.** Mijn notitievault (klanten, projecten, freelance-administratie) is ontsloten via de Local REST API-plugin. Claude leest, zoekt en schrijft er rechtstreeks in. Wanneer ik een werksessie op een klantproject afrond, documenteert het wat er gedaan is in de juiste notitie, met de juiste `[[wikilinks]]` — zonder dat ik de terminal verlaat. De notitie van deze site en die van de klantprojecten blijven actueel als neveneffect van het werk, niet als aparte karwei.

**Chrome DevTools.** Een server die een echte browser aanstuurt: navigeren, klikken, screenshots nemen, de console lezen, een Lighthouse-audit draaien. Zo illustreer ik mijn portfolio-cases — Claude draait het project lokaal, legt de echte pagina's vast en voegt ze in de Markdown in. Geen handmatige screenshots meer om bij te snijden.

**Context7.** Haalt actuele bibliotheekdocs op op het moment dat je ze nodig hebt. De trainingsdata van een model heeft altijd een horizon; Context7 vult het gat voor API's die recent veranderd zijn. Ik roep het aan zodra ik een lib aanraak die ik niet goed ken of waarvan de versie gewijzigd is.

> De regel die ik mezelf opleg: een MCP-server moet zijn plaats verdienen. Elk ervan vergroot de aanvalsoppervlakte en de geladen context. Drie goed gekozen zijn beter dan tien uit nieuwsgierigheid.

## Skills: methode, niet alleen antwoorden

Een **skill** is een bundel instructies die Claude op aanvraag laadt wanneer de taak past. Het verschil met een gewone prompt: een skill dwingt een *manier van werken* af, niet alleen een resultaat.

De `superpowers`-plugin levert er een hele bibliotheek van. Degene die ik echt gebruik:

- **`brainstorming`** — vóór elk creatief werk grilt het me over intentie en beperkingen. Eén vraag per keer, tot de behoefte scherp is.
- **`systematic-debugging`** — bij een bug reproduceert het, minimaliseert, vormt een hypothese, instrumenteert, *en pas dan* fixt het. Het belet me meteen naar de plausibele-maar-foute patch te springen.
- **`test-driven-development`** — red-green-refactor, strikte discipline. Op bedrijfslogica is dat niet onderhandelbaar.
- **`writing-plans`** en daarna **`executing-plans`** — voor taken die een sessie overleven, een geschreven plan dat ik nalees voor er een regel code wordt geproduceerd.

Wat alles verandert: deze skills overschrijven het standaardgedrag van het model, **maar mijn eigen instructies komen vóór de skills**. Een `CLAUDE.md` die zegt "geen TDD hier" wint van een skill die TDD predikt. De hiërarchie is duidelijk: ik, dan skills, dan het model.

## Persistent geheugen: je context niet opnieuw uitleggen

Standaard start elke sessie van nul. Twee mechanismen lossen dat op.

**Achtergrondgeheugen.** Claude houdt geheugenbestanden bij — wie ik ben, mijn werkvoorkeuren, projectbeslissingen die je niet uit de code kunt afleiden. Over de sessies heen stopt het met opnieuw vragen wat het al zou moeten weten: mijn standaardstack, mijn toon, het feit dat ik in bijberoep freelance.

**Sessie-handoffs.** Een `SessionStart`-hook herlaadt automatisch een statusmemo van de vorige sessie (`.remember/`). Op het einde van de dag schrijft de `remember`-skill wat gedaan is, wat overblijft, en de valkuilen die we tegenkwamen. De dag erna start ik niet koud — de volgende sessie weet waar we waren.

Dat is precies wat een reeks sessies samenhangend maakt: deze post, de cases, het Lighthouse-budget in CI — elke stap werd door de volgende sessie opgepakt zonder dat ik de context opnieuw uitlegde.

## Sub-agents: in parallel delegeren

De echte recente productiviteitssprong zijn **sub-agents**. Claude kan gespecialiseerde agents in parallel lanceren, elk met een eigen context, en alleen de conclusie terughalen.

Een concreet voorbeeld van deze site: om mijn portfolio-cases te verdiepen had ik *geverifieerde* feiten nodig — geen verzonnen — over drie klantprojecten. In plaats van elke repo met de hand uit te pluizen, werden drie `Explore`-agents tegelijk gelanceerd, één per project. Elk groef in zijn repo (Git-historiek, dependencies, README, pijnpunten in de commits) en leverde een feitelijk rapport. Ik schreef de cases op basis van die rapporten — met echte cijfers: aantal commits, duur, buildgrootte, aantal pagina's.

Voor meer gestructureerde taken orkestreert de **Workflow**-tool agents deterministisch — fan-out voor brede dekking, adversariële verificatie voor er besloten wordt. Het patroon "hoofdagent + N specialisten" bespaart uren op grote refactors en grondige reviews.

De kanttekening: een sub-agent levert je tekst, geen diff die je gelezen hebt. Ik behandel hun output altijd als een *te verifiëren bron*, nooit als vaststaande waarheid — zeker wanneer ze richting publicatie gaat.

## De eerlijke workflow

Mijn standaardlus vandaag:

1. **Context voor mij geladen** — geheugen + handoff van gisteren bij het opstarten.
2. **`/brainstorming`** op echte features; directe implementatie op kleine.
3. **Parallelle delegatie** wanneer het werk netjes splitst (research, repo-mining, multi-angle review).
4. **Lees elke diff.** Niet onderhandelbaar. Sub-agents en MCP verbreden wat ik delegeer, niet wat ik blind goedkeur.
5. **`/commit`** als het groen is, **`/code-review`** voor merge.
6. **`remember`** op het einde van de sessie voor de volgende.

## Trade-offs

Dit alles heeft een prijs. Meer MCP-servers = meer oppervlakte en meer context per beurt geladen. Geheugen kan verouderen: een notitie die zegt "flag X bestaat" wordt fout wanneer de flag verdwijnt — ik verifieer voor ik erop vertrouw. En parallelle delegatie verbrandt snel tokens; ik reserveer het voor taken die het echt rechtvaardigen.

De onderliggende valkuil is dezelfde als in de eerste post: **delegeren is niet abdiceren.** Hoe krachtiger de tooling, hoe verleidelijker het is om in batch te valideren. Dat is precies waar de sluwe 5% fouten doorglipt.

## Conclusie

Heb je de Claude Code-basis al? Voeg deze week *één* laag toe: koppel een enkele MCP-server die nuttig is voor je echte werk (voor mij was dat Obsidian) en gebruik die op een echte taak. Je voelt meteen het verschil tussen een assistent die antwoordt en een collega die je context kent. De rest bouwt daarbovenop.
