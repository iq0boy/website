---
title: 'Self-hosting Umami on Docker Swarm: three failures that say nothing'
excerpt: "Cookieless analytics on my own machine, in an hour and 220 MB. The deployment is dull; the three silent failures along the way are what earn the article."
pubDate: 2026-09-01
category: 'Infrastructure'
readTime: 9
tags: ['Umami', 'Analytics', 'Self-hosting', 'Docker Swarm', 'Caddy', 'CSP', 'GDPR']
draft: false
---

![Hero image — Self-hosting Umami on Docker Swarm](../../../assets/blog/self-hosting-umami-on-docker-swarm/hero.png)

This site had no measurement at all. Not "imperfect measurement": none. I was publishing articles without knowing whether anyone read them, and tuning Core Web Vitals without knowing which page mattered.

That's fixed: Umami now runs on my own machine, behind Caddy, cookieless and therefore with no consent banner. The deployment itself is boring — one compose file, one `make deploy`. What's worth writing down are the **three failures that produce no error message at all**.

## TL;DR

Umami 3.3.1 + Postgres as a Docker Swarm stack, routed by `caddy-docker-proxy` through labels. The whole stack idles at **220 MB**. The three traps: `depends_on` is ignored by `docker stack deploy`, the password endpoint every older guide cites returns 404 while leaving the default credentials live, and a CSP that allows only half the beacon gives you an empty dashboard with no console error.

## First, a correction: this was never a RAM problem

I was about to write the opposite article. "Plausible doesn't fit on my small VPS, so Umami." That was wrong, and I only found out by going and looking at the machine.

Plausible Community Edition needs **PostgreSQL and ClickHouse**. ClickHouse is a column store built for analytics at scale; it happily reserves several hundred megabytes at idle. I had "5 € VPS" in my head, the phrase from [my own post on the subject](/en/blog/why-a-vps-and-how-to-set-it-up), and had derived a constraint from it that didn't exist. Twice over, in fact: the Hetzner CX22 I recommend there at 4.51 € ships **8 GB of RAM**, enough to take ClickHouse without drama. And my own machine isn't a CX22 anyway.

The actual machine:

```
Debian 13 · 15 GiB RAM (7.3 GiB available) · 8 vCPU · 150 GB
~28 containers already running
```

Plausible would have fit without complaint. **So choosing Umami isn't a constraint, it's a preference** — and I'd rather say that than dress it up as a technical necessity. One database instead of two, on a machine already running 28 containers. An OLAP engine to count a portfolio's pageviews is a moving part you'll have to back up, migrate and repair, for a volume that would fit in a spreadsheet.

> Check the machine before writing the argument. The constraint you're invoking may not exist.

## The stack

Nothing exotic. Two services, Caddy labels, no Caddyfile:

```yaml
services:
  umami:
    image: docker.umami.is/umami-software/umami:3.3.1
    env_file: [.env]
    environment:
      DATABASE_URL: postgresql://umami:${POSTGRES_PASSWORD}@db:5432/umami
    networks: [edge-swarm, internal]
    deploy:
      replicas: 1
      update_config:
        order: start-first
      restart_policy:
        condition: on-failure
        delay: 5s
      labels:
        caddy: ${UMAMI_DOMAIN}
        caddy.reverse_proxy: "{{upstreams 3000}}"

  db:
    image: postgres:17-alpine
    volumes: [umami_db_data:/var/lib/postgresql/data]
    # Deliberately not on edge-swarm: the database is reachable
    # from the app only, never from the edge.
    networks: [internal]
```

`caddy-docker-proxy` reads the labels, provisions the certificate, done. The app is stateless with no host port, so `start-first`: the new task comes up before the old one goes away, no downtime on redeploy. The database, a single writer on a local volume, stays `stop-first`.

## Silent failure #1: `depends_on` does nothing

The file looks like Docker Compose, so you write `depends_on: [db]` out of habit. **`docker stack deploy` ignores it outright.**

On a cold start the app can therefore boot before Postgres accepts connections, fail, and exit. What converges the stack isn't start ordering, it's the `restart_policy`. A couple of restarts in the first seconds is *normal operation*, not an incident.

The trap isn't the failure — it heals itself. It's spending half an hour debugging a perfectly healthy database.

## Silent failure #2: the phantom endpoint that leaves the default password live

This is the only real security hole of the three, and it's a nasty one.

Umami seeds an `admin` / `umami` account. The dashboard is on a public domain **the instant Caddy issues the certificate**. This isn't theoretical: from another machine, off the server, a request to `/api/auth/login` with those credentials returned me a valid session token.

So you change the password. Most guides tell you:

```bash
# ❌ returns 404 on v3 — and changes nothing
POST /api/users/{userId}/password
```

That's the path from earlier versions. On v3 the right one is:

```bash
# ✅
TOKEN=$(curl -sS -X POST https://$DOMAIN/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"umami"}' | jq -r .token)

curl -sS -X POST https://$DOMAIN/api/me/password \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"currentPassword":"umami","newPassword":"<new>"}'
```

The danger isn't the 404. It's what you conclude from it: "odd, that call failed", you move on, and the default password stays **live on a public admin panel**. The failure looks like a technical detail when it is an open door.

Hence the only rule that matters here: **don't verify that the change succeeded, verify that the old one stopped working.**

```bash
# must return 401. Any other code means the door is still open.
curl -o /dev/null -w '%{http_code}' -X POST https://$DOMAIN/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"umami"}'
```

While we're in the same family of traps: v3 images on the official registry use **bare semver** (`3.3.1`). The `postgresql-` prefix everyone copies is the legacy v1/v2 naming, still published to ghcr.io — which stops at v2.x. Pin `3.3.1`, not `postgresql-latest`.

## Silent failure #3: the half-allowed beacon

This site serves a strict Content-Security-Policy that allowlists inline scripts by hash rather than `'unsafe-inline'`. Adding an analytics beacon to it needs **two** permissions, not one:

```
script-src  … https://stats.example.com   ← loads /script.js
connect-src … https://stats.example.com   ← POSTs each pageview to /api/send
```

Getting only one is the most expensive mistake of the three, because it looks like nothing. The site works. No visible console error. Core Web Vitals untouched. The dashboard is simply empty — and you find out three weeks later, wondering whether anybody visits at all.

Not trusting my own vigilance here, I automated it. The check extracts the origin of **every** `<script src="https://…">` in the built HTML and fails the build if it's missing from `script-src`:

```js
const scriptSrc = csp.match(/script-src ([^;]+)/)?.[1] ?? '';
for (const origin of externalScriptOrigins()) {
  if (!scriptSrc.includes(origin)) {
    problems.push(`${origin} is loaded but absent from script-src — it would be blocked silently`);
  }
}
```

A browser test then confirms, against the real policy, that `script.js` loads and that the request to `/api/send` actually reaches the network.

## The closing irony: the instrument that skews the measurement

The first thing measurement taught me is that my own verification test was injecting fake pageviews into the dashboard.

My test intercepted `/api/send` so nothing would be recorded. Except Umami sends via **`navigator.sendBeacon()`**, which Playwright's network interception doesn't catch. Caught by counting: 9 pageviews before the run, 11 after.

The fix uses the mechanism Umami provides rather than an interception trick — switch the tracker off at the source:

```js
await ctx.addInitScript(() => {
  try { localStorage.setItem('umami.disabled', '1'); } catch {}
});
```

There's a broader lesson in there, and it goes well beyond Umami: **an instrument is part of the system it measures.** The only way to know was to count before and after.

## Trade-offs

You become the on-call. If Postgres goes down, the night's visits are gone — the script fails silently client-side, the site is never affected, but the data doesn't come back. Umami Cloud exists, and it isn't a rip-off: it's the honest price of not being on call.

I self-host because the machine is already running and the data stays with me. If that isn't your situation, the hosted version is probably the right call.

And it should be said: Umami is poorer than Plausible. Less polish, blunter reports. For a portfolio the question that matters is "which pages get read and where do people come from", and it answers that.

## Takeaway

If you're deploying Umami this week, run the three checks that can't be seen:

1. `POST /api/auth/login` with `admin`/`umami` must return **401** from outside.
2. After adding the beacon, load the site and confirm a pageview **actually** lands in the dashboard — not merely that the page renders.
3. If you have a CSP, check `script-src` **and** `connect-src`.

All three fail silently. None of them will tell you.
