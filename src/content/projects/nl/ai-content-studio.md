---
title: "AI Content Studio"
excerpt: "AI-aangedreven contentgeneratieplatform met aangepaste fine-tuned modellen."
category: "AI"
tags: ["Python", "OpenAI", "React", "FastAPI"]
year: "2025"
color: "oklch(0.25 0.07 300)"
---

Een digitaal marketingbureau met 200+ merkaccounts moest contentproductie opschalen zonder meer mensen aan te nemen. De opdracht: een platform waar merkmanagers on-brand content konden genereren voor social media, e-mail en web — met AI die de stem van elk merk echt begreep.

## Het merkstemprobleem

Generieke LLM-output klinkt generiek. De kernuitdaging was om gegenereerde content te laten aanvoelen als elk individueel merk, niet als standaard AI-marketingtekst. De oplossing: per-merk fine-tuned modellen getraind op de bestaande goedgekeurde content van elke klant.

Fine-tuning werd gedaan op GPT-3.5-turbo met gestructureerde (prompt, goedgekeurde_content)-paren uit de contentgeschiedenis van elk merk. Een model getraind op 400–600 voorbeelden legt stem, toon en woordvoorkeur betrouwbaar vast — genoeg om herkenbaar on-brand te zijn zonder merkfeiten te hallucineren.

## Asynchroon generatiepijplijn

Contentgeneratie is inherent traag (2–8 seconden per verzoek). Een synchrone API zou de interface blokkeren en time-outen bij complexe verzoeken. In plaats daarvan worden generatietaken verzonden naar een Celery-taakwachtrij, met resultaten die via Server-Sent Events worden gestreamd naar de browser.

```python
@app.post("/generate")
async def generate(request: GenerateRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid4())
    background_tasks.add_task(run_generation, job_id, request)
    return {"jobId": job_id, "streamUrl": f"/stream/{job_id}"}
```

Gebruikers zien een live typanimatie terwijl tokens aankomen — het wachten voelt actief aan in plaats van passief.

## Menselijke controle in de lus

Elk stuk AI-gegenereerde content doorloopt een reviewwachtrij voordat het gepubliceerd wordt. Reviewers kunnen goedkeuren, bewerken of afwijzen met een reden. Afwijzingen met bewerkingen worden teruggekoppeld in de fine-tuning dataset, waardoor het model van elk merk continu verbetert.

## Resultaten

- 10× snellere contentproductie vs. handmatige workflows
- 85% van gegenereerde concepten goedgekeurd zonder bewerkingen (van 40% bij lancering)
- 200+ merkaccounts, elk met een dedicated fine-tuned model
- Gemiddelde kwaliteitsscore: 4,3/5 op interne rubric
