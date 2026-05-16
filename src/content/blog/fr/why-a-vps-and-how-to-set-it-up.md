---
title: 'Pourquoi je préfère un VPS au serverless — et comment je le configure'
excerpt: 'Pourquoi un VPS à 5 € remplace souvent un stack serverless coûteux — et le setup exact que j''utilise : Docker, Caddy, fail2ban, backups restic.'
pubDate: 2026-05-14
category: 'Infrastructure'
readTime: 9
tags: ['VPS', 'DevOps', 'Hetzner', 'Docker', 'Caddy', 'Self-hosting']
---

![Visuel d'en-tête — Pourquoi je préfère un VPS au serverless](../../../assets/blog/why-a-vps-and-how-to-set-it-up/hero.png)

La promesse du serverless, c'est : *zéro infra à gérer, tu paies ce que tu consommes*. La réalité, c'est : cold starts, factures qui décollent dès qu'un crawler s'excite, vendor lock-in déguisé en SDK, et trois services managés pour faire ce qu'un single binary ferait très bien.

Je ne dis pas que le serverless est mauvais. Je dis qu'il est rarement le bon choix pour 90 % des projets que je vois passer. Voici pourquoi je tourne sur VPS — et le setup exact que je déploie en 30 minutes sur chaque nouvelle machine.

## Pourquoi un VPS gagne souvent

**Prix prévisible.** Un Hetzner CX22 (4 vCPU partagés, 8 Go RAM, 80 Go SSD, 20 To de trafic) coûte 4,51 € par mois. À ce prix-là, tu héberges plusieurs projets confortablement. La même charge sur Vercel + Supabase + Upstash + Sentry, c'est rapidement 80 €/mois — pour moins de contrôle.

**Pas de cold starts.** Une requête HTTP qui hit ton serveur prend 50 ms, pas 800 ms. Pour un site marketing c'est invisible ; pour une API utilisée par un dashboard, c'est la différence entre "ça marche" et "c'est lent".

**Self-hosting trivial.** Postgres, Redis, MinIO, Plausible, Umami, Uptime Kuma, n8n, Grafana — tu les lances en `docker compose up -d` et c'est fini. Pas d'API key tierce à gérer, pas de quota surprise.

**Portabilité.** Ton infra est dans `docker-compose.yml`. Tu migres de Hetzner à OVH à Scaleway en une après-midi. Compare avec un projet 100 % Vercel + AWS — le jour où tu veux partir, tu réécris la moitié.

**Tu apprends.** Tourner un VPS pendant un an enseigne plus sur le web qu'une formation cloud-native. Tu comprends DNS, TLS, reverse proxy, processus, journaux — des fondamentaux que les abstractions managées te font oublier.

## Quand le serverless reste meilleur

Pour être honnête :

- **Trafic massif et erratique** (200 req/sec qui chute à 0 le soir). Un VPS sous-provisionné se fait submerger ; un autoscaler te sauve.
- **Charges quasi-nulles** (un side-project qui prend 50 visiteurs par mois). Le free tier Vercel/Cloudflare est imbattable.
- **Équipe sans aucune expérience ops**. Mieux vaut un Vercel qui marche qu'un VPS mal configuré.

## Choix du provider

J'utilise **Hetzner** depuis 2022. Datacenter à Helsinki ou Falkenstein, IPv4 + IPv6 inclus, support correct, et un panneau de contrôle qui ne fait pas semblant. Alternatives crédibles : **Scaleway**, **Vultr**, **DigitalOcean** (plus cher mais polish supérieur).

Pour la majorité des projets, **CX22 à 4,51 €/mois suffit**. Tu passes au CX32 si tu héberges deux bases Postgres avec du trafic.

## Jour 1 : durcir la machine

Ne saute jamais cette étape. Un VPS qu'on déploie sans hardening se fait scanner dans l'heure et brute-force dans la journée.

```bash
# 1. Créer un utilisateur non-root
adduser deploy
usermod -aG sudo deploy

# 2. Copier ta clé SSH
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys

# 3. Désactiver le login root + password en SSH
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# 4. Firewall : autorise SSH (port standard ou custom), HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 5. fail2ban pour bloquer les brute-force SSH
apt install -y fail2ban
systemctl enable --now fail2ban

# 6. Mises à jour de sécurité automatiques
apt install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

Vérifie ensuite avec `ssh deploy@your-server` depuis une autre session **avant** de fermer la session root. Si ça marche, tu peux te déconnecter.

## Docker, parce que docker-compose

Installation officielle (jamais `apt install docker.io` — version périmée) :

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
```

Toute mon infra tient dans un seul `docker-compose.yml` par projet. Pas d'orchestrateur, pas de Kubernetes — j'héberge généralement 3 à 10 projets sur la même machine, c'est très loin de justifier la complexité k8s.

## Caddy : reverse proxy + TLS automatique

[Caddy](https://caddyserver.com) génère et renouvelle automatiquement les certificats Let's Encrypt. C'est la seule différence avec nginx, mais elle change tout — zéro `certbot` à scheduler, zéro `cron` à maintenir.

`Caddyfile` minimal pour servir deux apps :

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

Tu fais pointer ton DNS A record vers l'IP du VPS, tu lances Caddy, tu as HTTPS en 60 secondes. Aucun panneau de contrôle (Plesk, cPanel, etc.) n'est nécessaire — c'est une perte de temps et une surface d'attaque en plus.

## Déploiement : git pull, c'est tout

Pour 90 % des projets, le déploiement est :

```bash
ssh deploy@server "cd /srv/project && git pull && docker compose up -d --build"
```

Que tu enrobes éventuellement dans un workflow GitHub Actions :

```yaml
- name: Deploy
  run: |
    ssh deploy@${{ secrets.HOST }} \
      "cd /srv/project && git pull && docker compose up -d --build"
```

Pas de Vercel preview deployments, mais aussi pas de surprise de build minutes consommés.

## Monitoring

Trois outils gratuits, trois rôles distincts :

- **[Uptime Kuma](https://github.com/louislam/uptime-kuma)** (self-hosted, dans le `docker-compose.yml`) — check chaque endpoint toutes les 60 secondes, alerte Discord/Telegram quand ça tombe.
- **[Plausible](https://plausible.io)** ou **[Umami](https://umami.is)** (self-hosted) — analytics propre, sans cookies, GDPR-clean.
- **[Grafana Cloud free tier](https://grafana.com)** — 10 000 séries, 50 Go de logs, alerting inclus. Plus que largement pour 95 % des cas.

## Backups : restic + Backblaze B2

Ne fais pas l'erreur de penser que "Hetzner a des snapshots, c'est suffisant". Un snapshot stocké chez le même provider que ta machine est un faux backup.

[restic](https://restic.net) avec un bucket B2 (chiffrement client-side, dédup, snapshots incrémentaux) :

```bash
# Backup quotidien, kept rétention 7 derniers + 4 hebdo + 6 mensuels
restic -r b2:my-bucket:server-name backup /srv /etc
restic -r b2:my-bucket:server-name forget --prune \
  --keep-daily 7 --keep-weekly 4 --keep-monthly 6
```

Lancé par un cron à 3 h du matin, alerting si le job échoue. Coût B2 : ~1 € par mois pour 20 Go.

## Les pièges qu'on ne voit qu'après coup

**1. Mémoire swap.** Sur un CX22, sans swap, un build Docker peut OOM. Ajoute 4 Go de swap dès le jour 1.

**2. Logs Docker qui mangent le disque.** Sans config, ils grossissent à l'infini. Ajoute dans `/etc/docker/daemon.json` :

```json
{ "log-driver": "json-file", "log-opts": { "max-size": "50m", "max-file": "3" } }
```

**3. Pas de monitoring CPU/disk.** Trois mois plus tard, tu te demandes pourquoi le site est lent — c'est le disque à 98 %. Installe `node_exporter` + Grafana, ou au minimum un cron qui mail si `df` dépasse 80 %.

**4. SSH sur le port 22.** Pas un trou de sécurité — juste du bruit dans les logs. Bouge sur 2222 si tu veux la paix.

**5. Pas de user dans tes containers.** Les Dockerfiles qui tournent en `root` à l'intérieur sont une faille en cas d'escape. Ajoute `USER node` (ou autre) en fin de Dockerfile.

## En résumé

Pour 5 € par mois, tu as une machine sur laquelle tu héberges plusieurs projets, plusieurs bases de données, ton monitoring, tes analytics, tes backups. La courbe d'apprentissage est de quelques jours ; le payoff dure des années.

Le serverless est un excellent outil. Mais c'est un outil parmi d'autres, pas un défaut moderne.
