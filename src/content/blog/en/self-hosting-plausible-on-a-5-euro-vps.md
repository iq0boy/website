---
title: 'Self-hosting Plausible on a €5 VPS: end-to-end'
excerpt: "Cookieless analytics with no consent banner and no subscription: Plausible CE on the same VPS as everything else. Compose file, Caddy, backups — the full setup."
pubDate: 2026-06-12
category: 'Infrastructure'
readTime: 9
tags: ['Plausible', 'Analytics', 'Self-hosting', 'Docker', 'Caddy', 'GDPR']
draft: true
---

![Cover image — Self-hosting Plausible on a €5 VPS](../../../assets/blog/self-hosting-plausible-on-a-5-euro-vps/hero.png)

Google Analytics 4 has become unusable, cookie banners chase everyone away, and I don't want another subscription. Plausible Community Edition ticks every box: cookieless (no banner to show), data in Europe on my machine, and a dashboard you understand in ten seconds. Here's the full install on the VPS whose setup — Docker, Caddy, restic — I already described in [my VPS article](/en/blog/why-a-vps-and-how-to-set-it-up).

## TL;DR

A `docker-compose.yml` with three services (Plausible, Postgres, ClickHouse), a two-line Caddy block, one script tag in the layout. The piece that deserves attention is **ClickHouse**: it's the RAM eater. On 8 GB everything fits; on 4 GB, apply the low-resources config.

## The compose file

```yaml
services:
  plausible_db:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes: ['./postgres-data:/var/lib/postgresql/data']
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  plausible_events_db:
    image: clickhouse/clickhouse-server:24.3-alpine
    restart: unless-stopped
    volumes: ['./clickhouse-data:/var/lib/clickhouse']
    ulimits: { nofile: { soft: 262144, hard: 262144 } }

  plausible:
    image: ghcr.io/plausible/community-edition:v3
    restart: unless-stopped
    command: sh -c "/entrypoint.sh db createdb && /entrypoint.sh db migrate && /entrypoint.sh run"
    depends_on: [plausible_db, plausible_events_db]
    ports: ['127.0.0.1:8000:8000']
    environment:
      BASE_URL: https://plausible.example.com
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      DATABASE_URL: postgres://postgres:${POSTGRES_PASSWORD}@plausible_db:5432/plausible_db
      CLICKHOUSE_DATABASE_URL: http://plausible_events_db:8123/plausible_events_db
```

Generate the secret once: `openssl rand -base64 48`. The port is bound to `127.0.0.1` — only Caddy can reach it.

## Caddy: two lines

```
plausible.example.com {
    reverse_proxy 127.0.0.1:8000
}
```

Caddy fetches the certificate on its own. `docker compose up -d`, open the URL, create your account — then disable signups with `DISABLE_REGISTRATION: true` in the environment.

## ClickHouse on a small box

This is the only real watch-point. ClickHouse is built for analytics clusters; idle, it happily reserves 700 MB and more. On a shared VPS, two config files calm it down — this is Plausible's recommended "low resources" config:

```xml
<!-- clickhouse/low-resources.xml -->
<clickhouse>
  <mark_cache_size>524288000</mark_cache_size>
  <profiles><default>
    <max_threads>1</max_threads>
    <max_block_size>8192</max_block_size>
    <queue_max_wait_ms>1000</queue_max_wait_ms>
  </default></profiles>
</clickhouse>
```

Mount it into the container and watch `docker stats` for the first week. For a personal site or client sites with reasonable traffic, it holds without complaint.

## The tag in Astro

```html
<script defer data-domain="josephpire.dev"
        src="https://plausible.example.com/js/script.js"></script>
```

One line in the layout's `<head>`. No cookie is set, so there's **no consent banner** to add — that's the whole point. Exclude your own traffic with the official extension or a localStorage flag, or your own visits will pollute low-volume stats.

## Backups and updates

Two states to back up: Postgres (accounts, site config) and ClickHouse (the events). In the existing restic job:

```bash
docker compose exec -T plausible_db pg_dump -U postgres plausible_db > backup/plausible-pg.sql
docker compose exec -T plausible_events_db clickhouse-client \
  --query "BACKUP DATABASE plausible_events_db TO Disk('backups', 'events.zip')"
```

For updates: the image is pinned to `v3` (the major), so `docker compose pull && docker compose up -d` follows patches without surprises. Read the release notes before jumping a major — ClickHouse migrations can take a while.

## Trade-offs

You become the on-call team: if ClickHouse goes down, the night's visits are lost (the script fails silently; the site itself is never affected). Plausible Cloud at €9/month is an honest price to outsource that — I self-host because the machine is already running and the data stays with me, not because the cloud is a scam.

## Takeaway

If you already have a VPS with Caddy: this is an hour of work, backups included. Start with the compose file above, apply the ClickHouse low-resources config from day one, and add the tag to a single site to validate before rolling it out everywhere.
