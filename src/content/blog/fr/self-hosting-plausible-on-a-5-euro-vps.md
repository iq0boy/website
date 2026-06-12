---
title: 'Auto-héberger Plausible sur un VPS à 5 € : de A à Z'
excerpt: "Analytics sans cookies, sans bannière de consentement et sans abonnement : Plausible CE sur le même VPS que tout le reste. Compose file, Caddy, backups — le setup complet."
pubDate: 2026-06-12
category: 'Infrastructure'
readTime: 9
tags: ['Plausible', 'Analytics', 'Self-hosting', 'Docker', 'Caddy', 'RGPD']
draft: true
---

![Visuel d'en-tête — Auto-héberger Plausible sur un VPS à 5 €](../../../assets/blog/self-hosting-plausible-on-a-5-euro-vps/hero.png)

Google Analytics 4 est devenu inutilisable, les bannières de cookies font fuir tout le monde, et je n'ai pas envie d'un abonnement de plus. Plausible Community Edition coche toutes les cases : sans cookies (pas de bannière à afficher), données en Europe sur ma machine, et un dashboard qu'on comprend en dix secondes. Voici l'installation complète sur le VPS dont j'ai déjà décrit le setup — Docker, Caddy, restic — dans [mon article VPS](/blog/why-a-vps-and-how-to-set-it-up).

## TL;DR

Un `docker-compose.yml` avec trois services (Plausible, Postgres, ClickHouse), un bloc Caddy de deux lignes, une balise script dans le layout. Le morceau qui mérite attention, c'est **ClickHouse** : c'est lui qui consomme la RAM. Sur 8 Go tout passe ; sur 4 Go, applique la config low-resources.

## Le compose file

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

Génère le secret une fois : `openssl rand -base64 48`. Le port est bindé sur `127.0.0.1` — seul Caddy y accède.

## Caddy : deux lignes

```
plausible.example.com {
    reverse_proxy 127.0.0.1:8000
}
```

Caddy obtient le certificat tout seul. `docker compose up -d`, ouvre l'URL, crée ton compte — puis désactive les inscriptions avec `DISABLE_REGISTRATION: true` dans l'environnement.

## ClickHouse sur petite machine

C'est le seul vrai point de vigilance. ClickHouse est conçu pour des clusters analytiques ; au repos il réserve volontiers 700 Mo et plus. Pour un VPS partagé, deux fichiers de config le calment — c'est la config « low resources » recommandée par Plausible :

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

Monte-le dans le container et surveille `docker stats` la première semaine. Pour un site perso ou des sites clients à trafic raisonnable, ça tient sans broncher.

## La balise dans Astro

```html
<script defer data-domain="josephpire.dev"
        src="https://plausible.example.com/js/script.js"></script>
```

Une ligne dans le `<head>` du layout. Pas de cookie déposé, donc **pas de bannière de consentement** à ajouter — c'est tout l'intérêt. Exclus ton propre trafic avec l'extension officielle ou un flag localStorage, sinon tes propres visites pollueront des stats à petit volume.

## Backups et mises à jour

Les deux états à sauvegarder : Postgres (comptes, config des sites) et ClickHouse (les events). Dans le job restic existant :

```bash
docker compose exec -T plausible_db pg_dump -U postgres plausible_db > backup/plausible-pg.sql
docker compose exec -T plausible_events_db clickhouse-client \
  --query "BACKUP DATABASE plausible_events_db TO Disk('backups', 'events.zip')"
```

Pour les mises à jour : l'image est épinglée sur `v3` (la majeure), donc `docker compose pull && docker compose up -d` suit les patchs sans surprise. Lis les notes de version avant de sauter une majeure — les migrations ClickHouse peuvent être longues.

## Trade-offs

Tu deviens l'équipe d'astreinte : si ClickHouse tombe, les visites de la nuit sont perdues (le script échoue silencieusement, le site n'est jamais impacté). Plausible Cloud à 9 €/mois est un prix honnête pour externaliser ça — je self-host parce que la machine tourne déjà et que les données restent chez moi, pas parce que le cloud est une arnaque.

## À retenir

Si tu as déjà un VPS avec Caddy : c'est une heure de travail, backups compris. Commence par le compose file ci-dessus, mets la config ClickHouse low-resources dès le premier jour, et ajoute la balise sur un seul site pour valider avant de déployer partout.
