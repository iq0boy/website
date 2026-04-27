---
title: "AI Content Studio"
excerpt: "Plateforme de génération de contenu par IA avec des modèles fine-tunés personnalisés."
category: "IA"
tags: ["Python", "OpenAI", "React", "FastAPI"]
year: "2025"
color: "oklch(0.25 0.07 300)"
---

Une agence de marketing digital gérant 200+ comptes de marques avait besoin de scaler la production de contenu sans augmenter les effectifs. La demande : une plateforme où les brand managers pouvaient générer du contenu on-brand pour les réseaux sociaux, l'email et le web — avec une IA qui comprenait réellement la voix de chaque marque.

## Le problème de la voix de marque

Les LLMs génériques produisent un contenu générique. Le défi principal était de faire en sorte que le contenu généré ressemble à chaque marque individuelle, et non à du texte marketing IA standard. La solution : des modèles fine-tunés par marque, entraînés sur le contenu approuvé existant de chaque client.

Le fine-tuning a été réalisé sur GPT-3.5-turbo à partir de paires structurées (prompt, contenu_approuvé) issues de l'historique de contenu de chaque marque. Un modèle entraîné sur 400 à 600 exemples capture fidèlement la voix, le ton et les préférences lexicales — suffisamment pour être reconnaissable sans halluciner des faits sur la marque.

## Pipeline de génération asynchrone

La génération de contenu est intrinsèquement lente (2 à 8 secondes par requête). Une API synchrone bloquerait l'interface et expirerait sur les requêtes complexes. À la place, les jobs de génération sont envoyés dans une file Celery, avec les résultats streamés vers le navigateur via Server-Sent Events.

```python
@app.post("/generate")
async def generate(request: GenerateRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid4())
    background_tasks.add_task(run_generation, job_id, request)
    return {"jobId": job_id, "streamUrl": f"/stream/{job_id}"}
```

Les utilisateurs voient une animation de frappe en direct à l'arrivée des tokens — l'attente semble active plutôt que passive.

## Révision humaine dans la boucle

Chaque contenu généré passe par une file de révision avant publication. Les réviseurs peuvent approuver, modifier ou rejeter avec un motif. Les rejets avec modifications alimentent en retour le dataset de fine-tuning, améliorant continuellement le modèle de chaque marque.

## Résultats

- Vitesse de production de contenu multipliée par 10 vs. les workflows manuels
- 85% des brouillons générés approuvés sans modification (contre 40% au lancement)
- 200+ comptes de marques, chacun avec un modèle fine-tuné dédié
- Score de qualité moyen : 4,3/5 sur la grille d'évaluation interne
