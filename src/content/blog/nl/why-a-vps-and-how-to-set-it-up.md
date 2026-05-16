---
title: 'Waarom ik een VPS verkies boven serverless — en hoe ik hem opzet'
excerpt: 'Waarom een VPS van €5 vaak een dure serverless-stack vervangt — en de exacte setup die ik draai: Docker, Caddy, fail2ban, restic-backups.'
pubDate: 2026-05-14
category: 'Infrastructure'
readTime: 9
tags: ['VPS', 'DevOps', 'Hetzner', 'Docker', 'Caddy', 'Self-hosting']
---

![Headerbeeld — Waarom ik een VPS verkies boven serverless](../../../assets/blog/why-a-vps-and-how-to-set-it-up/hero.png)

De belofte van serverless luidt: *nul infra te beheren, je betaalt wat je verbruikt*. De realiteit: cold starts, facturen die uit de hand lopen zodra een crawler enthousiast wordt, vendor lock-in vermomd als een SDK, en drie managed services om te doen wat één enkele binary prima kan.

Ik zeg niet dat serverless slecht is. Ik zeg dat het zelden de juiste keuze is voor 90 % van de projecten die ik voorbij zie komen. Hier is waarom ik op een VPS draai — en de exacte setup die ik in 30 minuten op elke nieuwe machine uitrol.

## Waarom een VPS vaak wint

**Voorspelbare prijs.** Een Hetzner CX22 (4 shared vCPU, 8 GB RAM, 80 GB SSD, 20 TB egress) kost €4,51 per maand. Voor die prijs host je comfortabel meerdere projecten. Dezelfde belasting op Vercel + Supabase + Upstash + Sentry tikt al snel €80/maand aan — voor minder controle.

**Geen cold starts.** Een HTTP-request die je server raakt duurt 50 ms, geen 800 ms. Op een marketingsite onzichtbaar; op een API achter een dashboard het verschil tussen "werkt" en "voelt traag".

**Self-hosting is triviaal.** Postgres, Redis, MinIO, Plausible, Umami, Uptime Kuma, n8n, Grafana — je start ze met `docker compose up -d` en klaar. Geen externe API-key te managen, geen verrassings-quota.

**Portabiliteit.** Je infra zit in een `docker-compose.yml`. Je migreert van Hetzner naar OVH naar Scaleway in één namiddag. Vergelijk met een 100 % Vercel + AWS-project — de dag dat je weg wilt, herschrijf je de helft.

**Je leert.** Een jaar een VPS draaien leert je meer over het web dan een cloud-native cursus. Je begrijpt DNS, TLS, reverse proxies, processen en logs — fundamenten die managed abstractions je laten vergeten.

## Wanneer serverless toch wint

Eerlijk gezegd:

- **Massieve en erratische verkeer** (200 req/sec dat 's nachts naar nul valt). Een onder-geprovisioneerde VPS gaat onderuit; een autoscaler redt je.
- **Bijna-nul belasting** (een side-project met 50 bezoekers per maand). De free tiers van Vercel/Cloudflare zijn onverslaanbaar.
- **Een team zonder ops-ervaring.** Liever een Vercel die werkt dan een slecht geconfigureerde VPS.

## Keuze van de provider

Ik gebruik **Hetzner** sinds 2022. Datacenters in Helsinki en Falkenstein, IPv4 + IPv6 inbegrepen, behoorlijke support, en een controle panel dat niet alsof doet. Geloofwaardige alternatieven: **Scaleway**, **Vultr**, **DigitalOcean** (duurder maar gepolijster).

Voor de meeste projecten is de **CX22 aan €4,51/maand voldoende**. Je gaat naar de CX32 als je twee Postgres-databases met serieus verkeer host.

## Dag 1: de machine hardenen

Sla deze stap nooit over. Een VPS die zonder hardening wordt uitgerold, wordt binnen het uur gescand en binnen de dag brute-forced.

```bash
# 1. Maak een non-root user aan
adduser deploy
usermod -aG sudo deploy

# 2. Kopieer je SSH-key
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys

# 3. Zet root-login en password-auth over SSH uit
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# 4. Firewall: SSH (standaard- of custompoort), HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 5. fail2ban tegen SSH brute-forces
apt install -y fail2ban
systemctl enable --now fail2ban

# 6. Automatische beveiligingsupdates
apt install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

Verifieer daarna met `ssh deploy@your-server` vanuit een andere sessie **voor** je de root-sessie sluit. Werkt het? Dan mag je uitloggen.

## Docker, want docker-compose

Officiële installatie (nooit `apt install docker.io` — verouderd):

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
```

Al mijn infra past in één `docker-compose.yml` per project. Geen orchestrator, geen Kubernetes — ik host meestal 3 tot 10 projecten op één machine, ver onder de drempel waar k8s zichzelf terugverdient.

## Caddy: reverse proxy met automatische TLS

[Caddy](https://caddyserver.com) genereert en vernieuwt automatisch Let's Encrypt-certificaten. Het enige verschil met nginx, maar dat verandert alles — geen `certbot` te schedulen, geen `cron` te onderhouden.

Een minimale `Caddyfile` voor twee apps:

```caddy
nsmobile6k.be {
  reverse_proxy carder_app:3000
  encode gzip zstd
}

josephpire.dev {
  root * /srv/site
  file_server
  encode gzip zstd
}
```

Wijs je DNS A-record naar het IP van de VPS, start Caddy, en je hebt HTTPS in 60 seconden. Geen controle panel (Plesk, cPanel, enz.) nodig — die kosten tijd en zijn een extra aanvalsoppervlak.

## Deployment: gewoon git pull

Voor 90 % van de projecten is deployment:

```bash
ssh deploy@server "cd /srv/project && git pull && docker compose up -d --build"
```

Eventueel ingepakt in een GitHub Actions workflow:

```yaml
- name: Deploy
  run: |
    ssh deploy@${{ secrets.HOST }} \
      "cd /srv/project && git pull && docker compose up -d --build"
```

Geen Vercel preview deployments, maar ook geen verrassingsrekening voor build-minuten.

## Monitoring

Drie gratis tools, drie verschillende jobs:

- **[Uptime Kuma](https://github.com/louislam/uptime-kuma)** (self-hosted, in dezelfde `docker-compose.yml`) — checkt elke endpoint om de 60 seconden, alert via Discord/Telegram bij een uitval.
- **[Plausible](https://plausible.io)** of **[Umami](https://umami.is)** (self-hosted) — propere analytics, zonder cookies, GDPR-vriendelijk.
- **[Grafana Cloud free tier](https://grafana.com)** — 10.000 series, 50 GB logs, alerting inbegrepen. Meer dan voldoende voor 95 % van de gevallen.

## Backups: restic + Backblaze B2

Maak niet de fout te denken dat "Hetzner heeft snapshots, dat volstaat". Een snapshot op dezelfde provider als je machine is een nep-backup.

[restic](https://restic.net) met een B2 bucket (client-side encryptie, dedup, incrementele snapshots):

```bash
# Dagelijkse backup met 7 dagelijkse + 4 weekly + 6 monthly retentie
restic -r b2:my-bucket:server-name backup /srv /etc
restic -r b2:my-bucket:server-name forget --prune \
  --keep-daily 7 --keep-weekly 4 --keep-monthly 6
```

Aangezet door een cron om 3 uur 's nachts, met alerting als de job faalt. B2-kost: ~€1/maand voor 20 GB.

## De valkuilen die je pas achteraf ziet

**1. Swap-geheugen.** Op een CX22 zonder swap kan een Docker build OOM gaan. Voeg dag één 4 GB swap toe.

**2. Docker logs vreten je disk op.** Zonder config groeien ze eindeloos. Voeg toe aan `/etc/docker/daemon.json`:

```json
{ "log-driver": "json-file", "log-opts": { "max-size": "50m", "max-file": "3" } }
```

**3. Geen CPU/disk-monitoring.** Drie maanden later vraag je je af waarom de site traag aanvoelt — de disk staat op 98 %. Installeer `node_exporter` + Grafana, of zet op zijn minst een cron die mailt als `df` boven 80 % gaat.

**4. SSH op poort 22.** Geen securityprobleem — gewoon ruis in de logs. Verplaats naar 2222 als je rust wil.

**5. Geen USER-directive in je Dockerfiles.** Containers die binnenin als `root` draaien zijn een ontsnappingsluik dat wacht om misbruikt te worden. Voeg `USER node` (of vergelijkbaar) toe aan het eind van elke Dockerfile.

## Kort samengevat

Voor €5 per maand heb je een machine waarop je meerdere projecten host, meerdere databases, je monitoring, je analytics, je backups. De leercurve is een paar dagen; de payoff duurt jaren.

Serverless is een uitstekende tool. Maar het is een tool tussen andere — geen modern default.
