---
title: 'Auto-héberger Umami sur Docker Swarm : trois pannes qui ne disent rien'
excerpt: "Analytics sans cookies sur ma propre machine, en une heure et 220 Mo. Le déploiement est simple ; ce sont les trois échecs silencieux du parcours qui méritent l'article."
pubDate: 2026-09-01
category: 'Infrastructure'
readTime: 9
tags: ['Umami', 'Analytics', 'Self-hosting', 'Docker Swarm', 'Caddy', 'CSP', 'RGPD']
draft: false
---

![Visuel d'en-tête — Auto-héberger Umami sur Docker Swarm](../../../assets/blog/self-hosting-umami-on-docker-swarm/hero.png)

Ce site n'avait aucune mesure. Pas « une mesure imparfaite » : zéro. Je publiais des articles sans savoir si quiconque les lisait, et j'optimisais des Core Web Vitals sans savoir quelle page comptait.

C'est réglé : Umami tourne sur ma machine, derrière Caddy, sans cookie et donc sans bannière de consentement. Le déploiement lui-même est ennuyeux — un fichier compose, un `make deploy`. Ce qui vaut d'être écrit, ce sont les **trois pannes qui ne produisent aucun message d'erreur**.

## TL;DR

Umami 3.3.1 + Postgres en stack Docker Swarm, routé par `caddy-docker-proxy` via des labels. La stack au repos consomme **220 Mo**. Les trois pièges : `depends_on` est ignoré par `docker stack deploy`, l'endpoint de changement de mot de passe des vieux guides renvoie 404 en laissant les identifiants par défaut actifs, et un CSP qui n'autorise qu'une moitié du beacon donne un tableau de bord vide sans la moindre erreur console.

## D'abord, une correction : ce n'est pas un problème de RAM

J'allais écrire l'article inverse. « Plausible ne rentre pas sur mon petit VPS, donc Umami. » C'était faux, et je ne l'ai découvert qu'en allant regarder la machine.

Plausible Community Edition a besoin de **PostgreSQL et de ClickHouse**. ClickHouse est un moteur colonne conçu pour l'analytique de masse ; il réserve volontiers plusieurs centaines de mégaoctets au repos. J'avais en tête « VPS à 5 € », la formule de [mon article sur le sujet](/blog/why-a-vps-and-how-to-set-it-up), et j'en avais tiré une contrainte qui n'existait pas. Deux fois, même : le Hetzner CX22 que j'y recommande à 4,51 € embarque **8 Go de RAM**, de quoi encaisser ClickHouse sans drame. Et ma propre machine n'est de toute façon pas un CX22.

La machine réelle :

```
Debian 13 · 15 Gio de RAM (7,3 Gio disponibles) · 8 vCPU · 150 Go
~28 conteneurs déjà en place
```

Plausible serait passé sans broncher. **Le choix d'Umami n'est donc pas une contrainte, c'est une préférence** — et je préfère l'annoncer que la maquiller en nécessité technique. Une base de données au lieu de deux, sur une machine qui fait déjà tourner 28 conteneurs. Un moteur OLAP pour compter les visites d'un portfolio, c'est une pièce mobile qu'il faudra sauvegarder, migrer et réparer, pour un volume qui tiendrait dans une feuille de calcul.

> Vérifiez la machine avant d'écrire l'argument. La contrainte que vous invoquez n'existe peut-être pas.

## La stack

Rien d'exotique. Deux services, des labels Caddy, pas de Caddyfile :

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
    # Volontairement absent de edge-swarm : la base n'est joignable
    # que par l'app, jamais depuis l'edge.
    networks: [internal]
```

`caddy-docker-proxy` lit les labels, provisionne le certificat, et c'est fini. L'app est sans état et sans port hôte, donc `start-first` : la nouvelle tâche démarre avant que l'ancienne disparaisse, redéploiement sans coupure. La base, écrivain unique sur un volume local, reste en `stop-first`.

## Panne muette n°1 : `depends_on` ne fait rien

Le fichier ressemble à du Docker Compose, donc on écrit `depends_on: [db]` par réflexe. **`docker stack deploy` l'ignore purement et simplement.**

Au démarrage à froid, l'app peut donc booter avant que Postgres accepte les connexions, échouer, et sortir. Ce qui fait converger la stack, ce n'est pas l'ordre de démarrage, c'est le `restart_policy`. Quelques redémarrages dans les premières secondes sont le fonctionnement *normal*, pas un incident.

Le piège n'est pas la panne — elle se répare toute seule. C'est de passer une demi-heure à débugger une base de données parfaitement saine.

## Panne muette n°2 : l'endpoint fantôme qui laisse le mot de passe par défaut

Celle-ci est la seule vraie faille de sécurité du lot, et elle est vicieuse.

Umami sème un compte `admin` / `umami`. Le tableau de bord est sur un domaine public **dès l'instant où Caddy a émis le certificat**. Ce n'est pas théorique : depuis une autre machine, hors du serveur, une requête sur `/api/auth/login` avec ces identifiants m'a renvoyé un jeton de session valide.

On change donc le mot de passe. La plupart des guides indiquent :

```bash
# ❌ renvoie 404 en v3 — et ne change rien
POST /api/users/{userId}/password
```

C'est le chemin des versions précédentes. En v3, le bon est :

```bash
# ✅
TOKEN=$(curl -sS -X POST https://$DOMAIN/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"umami"}' | jq -r .token)

curl -sS -X POST https://$DOMAIN/api/me/password \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"currentPassword":"umami","newPassword":"<nouveau>"}'
```

Le danger n'est pas le 404. C'est ce qu'on en conclut : « bizarre, l'appel a échoué », on passe à autre chose, et le mot de passe par défaut reste **actif sur un panneau d'administration public**. L'échec ressemble à un détail technique alors que c'est une porte ouverte.

D'où la seule règle qui compte ici : **ne vérifiez pas que le changement a réussi, vérifiez que l'ancien a cessé de fonctionner.**

```bash
# doit renvoyer 401. Tout autre code = la porte est encore ouverte.
curl -o /dev/null -w '%{http_code}' -X POST https://$DOMAIN/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"umami"}'
```

Tant qu'à faire, un mot pour la même famille de pièges : les images v3 sur le registre officiel sont en **semver nu** (`3.3.1`). Le préfixe `postgresql-` que tout le monde recopie est l'ancien nommage v1/v2, encore publié sur ghcr.io — qui s'arrête en v2.x. Épinglez `3.3.1`, pas `postgresql-latest`.

## Panne muette n°3 : le CSP à deux moitiés

Ce site sert un Content-Security-Policy strict, qui autorise les scripts inline par hash plutôt que par `'unsafe-inline'`. Ajouter un beacon d'analytics y demande **deux** autorisations, pas une :

```
script-src  … https://stats.example.com   ← charge /script.js
connect-src … https://stats.example.com   ← POST de chaque visite sur /api/send
```

N'en mettre qu'une est l'erreur la plus chère du lot, parce qu'elle ne ressemble à rien. Le site fonctionne. Aucune erreur console visible. Les Core Web Vitals sont intacts. Le tableau de bord est simplement vide — et on le découvre trois semaines plus tard, en se demandant si personne ne visite le site.

Ne pouvant pas faire confiance à ma vigilance sur ce point, je l'ai automatisé. La vérification extrait l'origine de **tout** `<script src="https://…">` du HTML produit et fait échouer le build si elle manque de `script-src` :

```js
const scriptSrc = csp.match(/script-src ([^;]+)/)?.[1] ?? '';
for (const origin of externalScriptOrigins()) {
  if (!scriptSrc.includes(origin)) {
    problems.push(`${origin} est chargé mais absent de script-src — il serait bloqué en silence`);
  }
}
```

Puis un test navigateur confirme, contre la vraie policy, que `script.js` charge et que la requête vers `/api/send` atteint bien le réseau.

## L'ironie finale : l'outil de mesure qui fausse la mesure

La première chose que la mesure m'a apprise, c'est que mon propre test de vérification injectait de fausses visites dans le tableau de bord.

Mon test interceptait `/api/send` pour ne rien enregistrer. Sauf qu'Umami émet par **`navigator.sendBeacon()`**, que l'interception réseau de Playwright ne capte pas. Constaté en comptant : 9 visites avant le test, 11 après.

La correction utilise le mécanisme prévu par Umami plutôt qu'une ruse d'interception — on coupe le tracker à la source :

```js
await ctx.addInitScript(() => {
  try { localStorage.setItem('umami.disabled', '1'); } catch {}
});
```

Il y a une leçon plus large là-dedans, et elle vaut au-delà d'Umami : **un instrument de mesure fait partie du système mesuré.** Le seul moyen de le savoir était de compter avant et après.

## Trade-offs

Vous devenez l'astreinte. Si Postgres tombe, les visites de la nuit sont perdues — le script échoue en silence côté client, le site n'est jamais impacté, mais les données ne reviendront pas. Umami Cloud existe, et ce n'est pas une arnaque : c'est le prix honnête pour ne pas être d'astreinte.

Je m'auto-héberge parce que la machine tourne déjà et que les données restent chez moi. Si ce n'est pas votre cas, la version hébergée est probablement le bon choix.

Et il faut le dire : Umami est plus pauvre que Plausible. Moins de finition, des rapports plus rudimentaires. Pour un portfolio, la question qui compte est « quelles pages sont lues et d'où viennent les gens », et il y répond.

## À retenir

Si vous déployez Umami cette semaine, faites les trois vérifications qui ne se voient pas :

1. `POST /api/auth/login` avec `admin`/`umami` doit renvoyer **401** depuis l'extérieur.
2. Après ajout du beacon, chargez le site et confirmez qu'une visite apparaît **réellement** dans le tableau de bord — pas seulement que la page s'affiche.
3. Si vous avez un CSP, vérifiez `script-src` **et** `connect-src`.

Les trois échouent en silence. Aucune ne se signalera toute seule.
