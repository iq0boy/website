---
title: 'Plausible zelf hosten op een VPS van €5: van A tot Z'
excerpt: "Analytics zonder cookies, zonder toestemmingsbanner en zonder abonnement: Plausible CE op dezelfde VPS als al de rest. Compose file, Caddy, backups — de volledige setup."
pubDate: 2026-06-12
category: 'Infrastructure'
readTime: 9
tags: ['Plausible', 'Analytics', 'Self-hosting', 'Docker', 'Caddy', 'GDPR']
draft: false
---

![Coverbeeld — Plausible zelf hosten op een VPS van €5](../../../assets/blog/self-hosting-plausible-on-a-5-euro-vps/hero.png)

Google Analytics 4 is onbruikbaar geworden, cookiebanners jagen iedereen weg, en ik wil geen abonnement extra. Plausible Community Edition vinkt alle vakjes aan: cookieloos (geen banner te tonen), data in Europa op mijn machine, en een dashboard dat je in tien seconden begrijpt. Hier is de volledige installatie op de VPS waarvan ik de setup — Docker, Caddy, restic — al beschreef in [mijn VPS-artikel](/nl/blog/why-a-vps-and-how-to-set-it-up).

## TL;DR

Een `docker-compose.yml` met drie services (Plausible, Postgres, ClickHouse), een Caddy-blok van twee regels, één script-tag in de layout. Het stuk dat aandacht verdient is **ClickHouse**: dat is de RAM-vreter. Op 8 GB past alles; op 4 GB pas je de low-resources-config toe.

## De compose file

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

Genereer het secret één keer: `openssl rand -base64 48`. De poort is gebonden aan `127.0.0.1` — alleen Caddy kan erbij.

## Caddy: twee regels

```
plausible.example.com {
    reverse_proxy 127.0.0.1:8000
}
```

Caddy haalt het certificaat zelf op. `docker compose up -d`, open de URL, maak je account aan — en schakel daarna registraties uit met `DISABLE_REGISTRATION: true` in de environment.

## ClickHouse op een kleine machine

Dit is het enige echte aandachtspunt. ClickHouse is gebouwd voor analytics-clusters; idle reserveert het vlot 700 MB en meer. Op een gedeelde VPS kalmeren twee configbestanden het — dit is de door Plausible aanbevolen "low resources"-config:

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

Mount het in de container en hou `docker stats` de eerste week in de gaten. Voor een persoonlijke site of klantsites met redelijk verkeer houdt het moeiteloos stand.

## De tag in Astro

```html
<script defer data-domain="josephpire.dev"
        src="https://plausible.example.com/js/script.js"></script>
```

Eén regel in de `<head>` van de layout. Er wordt geen cookie gezet, dus er is **geen toestemmingsbanner** nodig — dat is het hele punt. Sluit je eigen verkeer uit met de officiële extensie of een localStorage-vlag, anders vervuilen je eigen bezoeken statistieken met laag volume.

## Backups en updates

Twee toestanden om te back-uppen: Postgres (accounts, siteconfig) en ClickHouse (de events). In de bestaande restic-job:

```bash
docker compose exec -T plausible_db pg_dump -U postgres plausible_db > backup/plausible-pg.sql
docker compose exec -T plausible_events_db clickhouse-client \
  --query "BACKUP DATABASE plausible_events_db TO Disk('backups', 'events.zip')"
```

Voor updates: de image is gepind op `v3` (de major), dus `docker compose pull && docker compose up -d` volgt de patches zonder verrassingen. Lees de release notes voor je een major overslaat — ClickHouse-migraties kunnen lang duren.

## Trade-offs

Jij wordt het wachtdienstteam: valt ClickHouse uit, dan zijn de bezoeken van die nacht verloren (het script faalt stil; de site zelf wordt nooit geraakt). Plausible Cloud aan €9/maand is een eerlijke prijs om dat uit te besteden — ik self-host omdat de machine toch al draait en de data bij mij blijft, niet omdat de cloud oplichterij is.

## Conclusie

Heb je al een VPS met Caddy: dit is een uur werk, backups inbegrepen. Begin met de compose file hierboven, zet de ClickHouse low-resources-config vanaf dag één, en voeg de tag toe aan één site om te valideren voor je overal uitrolt.
