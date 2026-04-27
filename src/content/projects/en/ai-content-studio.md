---
title: "AI Content Studio"
excerpt: "AI-powered content generation platform with custom fine-tuned models."
category: "AI"
tags: ["Python", "OpenAI", "React", "FastAPI"]
year: "2025"
color: "oklch(0.25 0.07 300)"
---

A digital marketing agency handling 200+ brand accounts needed to scale content production without scaling headcount. The brief: a platform where brand managers could generate on-brand content for social, email, and web — with AI that actually understood each brand's voice.

## The Brand Voice Problem

Generic LLM output sounds generic. The core challenge was making generated content feel like each individual brand, not like off-the-shelf AI copy. The solution: per-brand fine-tuned models trained on each client's existing approved content.

Fine-tuning was done on GPT-3.5-turbo using structured (prompt, approved_content) pairs from each brand's content history. A model trained on 400–600 examples reliably captures voice, tone, and vocabulary — enough to be recognizably on-brand without hallucinating brand facts.

## Async Generation Pipeline

Content generation is inherently slow (2–8 seconds per request). A synchronous API would block the UI and time out on complex requests. Instead, generation jobs are dispatched to a Celery task queue, with results streamed back to the browser via Server-Sent Events.

```python
@app.post("/generate")
async def generate(request: GenerateRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid4())
    background_tasks.add_task(run_generation, job_id, request)
    return {"jobId": job_id, "streamUrl": f"/stream/{job_id}"}
```

Users see a live typing animation as tokens arrive — the wait feels active rather than passive.

## Human-in-the-Loop Review

Every piece of AI-generated content passes through a review queue before publishing. Reviewers can approve, edit, or reject with a reason. Rejections with edits feed back into the fine-tuning dataset, continuously improving each brand's model.

## Results

- 10× content production speed vs. manual workflows
- 85% of generated drafts approved without edits (up from 40% at launch)
- 200+ brand accounts, each with a dedicated fine-tuned model
- Average content quality score: 4.3/5 on internal rubric
