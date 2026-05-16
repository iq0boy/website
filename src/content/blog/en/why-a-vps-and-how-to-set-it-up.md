---
title: 'Why I prefer a VPS over serverless — and how I set it up'
excerpt: 'Why a €5 VPS often replaces a costly serverless stack — and the exact setup I run: Docker, Caddy, fail2ban, restic backups.'
pubDate: 2026-05-14
category: 'Infrastructure'
readTime: 9
tags: ['VPS', 'DevOps', 'Hetzner', 'Docker', 'Caddy', 'Self-hosting']
---

![Cover image — Why I prefer a VPS over serverless](../../../assets/blog/why-a-vps-and-how-to-set-it-up/hero.png)

The serverless promise is: *zero infra to manage, you pay for what you use*. The reality is: cold starts, bills that spike the moment a crawler gets excited, vendor lock-in dressed up as an SDK, and three managed services to do what a single binary would do fine.

I'm not saying serverless is bad. I'm saying it's rarely the right call for 90% of the projects I see. Here's why I run on a VPS — and the exact setup I deploy in 30 minutes on each new machine.

## Why a VPS often wins

**Predictable pricing.** A Hetzner CX22 (4 shared vCPU, 8 GB RAM, 80 GB SSD, 20 TB egress) is €4.51/month. At that price you host several projects comfortably. The same load on Vercel + Supabase + Upstash + Sentry quickly hits €80/month — for less control.

**No cold starts.** An HTTP request hitting your server takes 50 ms, not 800 ms. Invisible on a marketing site; the difference between "works" and "feels slow" on an API powering a dashboard.

**Self-hosting is trivial.** Postgres, Redis, MinIO, Plausible, Umami, Uptime Kuma, n8n, Grafana — you spin them up with `docker compose up -d` and you're done. No third-party API key to babysit, no surprise quota.

**Portability.** Your infra lives in `docker-compose.yml`. You migrate from Hetzner to OVH to Scaleway in an afternoon. Compare with a 100% Vercel + AWS project — the day you want out, you rewrite half of it.

**You learn.** Running a VPS for a year teaches more about the web than a cloud-native course. You actually understand DNS, TLS, reverse proxies, processes, journals — fundamentals that managed abstractions let you forget.

## When serverless still wins

To be fair:

- **Massive and erratic traffic** (200 req/sec dropping to zero overnight). An under-provisioned VPS gets swamped; an autoscaler saves you.
- **Near-zero load** (a side-project getting 50 monthly visitors). Vercel/Cloudflare free tiers are unbeatable.
- **A team with zero ops experience.** Better a Vercel that works than a misconfigured VPS.

## Picking a provider

I've used **Hetzner** since 2022. Datacenters in Helsinki and Falkenstein, IPv4 + IPv6 included, decent support, and a control panel that doesn't pretend. Credible alternatives: **Scaleway**, **Vultr**, **DigitalOcean** (pricier but more polished).

For most projects, **CX22 at €4.51/month is enough**. Move to CX32 if you host two Postgres databases with traffic.

## Day 1: harden the machine

Never skip this step. A VPS deployed without hardening gets scanned within an hour and brute-forced within a day.

```bash
# 1. Create a non-root user
adduser deploy
usermod -aG sudo deploy

# 2. Copy your SSH key
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys

# 3. Disable root login + password auth over SSH
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# 4. Firewall: allow SSH (standard or custom port), HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 5. fail2ban to throttle SSH brute-forces
apt install -y fail2ban
systemctl enable --now fail2ban

# 6. Automatic security upgrades
apt install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

Then verify with `ssh deploy@your-server` from another session **before** you close the root session. If it works, you can sign out.

## Docker, because docker-compose

Official install (never `apt install docker.io` — outdated):

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
```

All my infra fits in a single `docker-compose.yml` per project. No orchestrator, no Kubernetes — I typically host 3 to 10 projects on one machine, nowhere near the threshold where k8s pays off.

## Caddy: reverse proxy with automatic TLS

[Caddy](https://caddyserver.com) automatically issues and renews Let's Encrypt certificates. It's the only difference with nginx, but it changes everything — no `certbot` to schedule, no `cron` to maintain.

A minimal `Caddyfile` serving two apps:

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

Point your DNS A record at the VPS IP, start Caddy, and you have HTTPS in 60 seconds. No control panel (Plesk, cPanel, etc.) needed — they're a time sink and an extra attack surface.

## Deployment: just git pull

For 90% of projects, deployment is:

```bash
ssh deploy@server "cd /srv/project && git pull && docker compose up -d --build"
```

Wrapped in a GitHub Actions workflow if you want:

```yaml
- name: Deploy
  run: |
    ssh deploy@${{ secrets.HOST }} \
      "cd /srv/project && git pull && docker compose up -d --build"
```

No Vercel preview deployments, but no surprise build-minute bills either.

## Monitoring

Three free tools, three distinct jobs:

- **[Uptime Kuma](https://github.com/louislam/uptime-kuma)** (self-hosted, in the same `docker-compose.yml`) — checks each endpoint every 60 seconds, alerts Discord/Telegram on failure.
- **[Plausible](https://plausible.io)** or **[Umami](https://umami.is)** (self-hosted) — clean analytics, cookie-free, GDPR-friendly.
- **[Grafana Cloud free tier](https://grafana.com)** — 10,000 series, 50 GB logs, alerting included. More than enough for 95% of cases.

## Backups: restic + Backblaze B2

Don't make the mistake of thinking "Hetzner has snapshots, that's enough". A snapshot stored on the same provider as your machine is a fake backup.

[restic](https://restic.net) with a B2 bucket (client-side encryption, dedup, incremental snapshots):

```bash
# Daily backup with 7 daily + 4 weekly + 6 monthly retention
restic -r b2:my-bucket:server-name backup /srv /etc
restic -r b2:my-bucket:server-name forget --prune \
  --keep-daily 7 --keep-weekly 4 --keep-monthly 6
```

Run by cron at 3 AM, with alerting if the job fails. B2 cost: ~€1/month for 20 GB.

## The gotchas you only see after the fact

**1. Swap memory.** On a CX22 without swap, a Docker build can OOM. Add 4 GB of swap on day one.

**2. Docker logs eat disk.** Without config, they grow forever. Add to `/etc/docker/daemon.json`:

```json
{ "log-driver": "json-file", "log-opts": { "max-size": "50m", "max-file": "3" } }
```

**3. No CPU/disk monitoring.** Three months later, you wonder why the site feels slow — the disk's at 98%. Install `node_exporter` + Grafana, or at minimum a cron that mails you if `df` crosses 80%.

**4. SSH on port 22.** Not a security hole — just noise in the logs. Move to 2222 if you want quiet.

**5. No USER directive in your Dockerfiles.** Containers running as `root` inside are an escape hatch waiting to happen. Add `USER node` (or similar) at the end of each Dockerfile.

## In short

For €5 a month, you have a machine hosting several projects, several databases, your monitoring, your analytics, your backups. The learning curve is a few days; the payoff lasts years.

Serverless is a great tool. But it's a tool among others — not a modern default.
