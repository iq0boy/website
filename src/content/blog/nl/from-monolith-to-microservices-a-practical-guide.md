---
title: "Van monoliet naar microservices: een praktische gids"
excerpt: "Praktische strategieën om monolithische applicaties op te splitsen zonder je verstand te verliezen."
pubDate: 2026-01-20
category: "Architectuur"
readTime: 12
---

Praktische strategieën om monolithische applicaties op te splitsen zonder je verstand te verliezen.

Elk team dat succesvol van een monoliet naar microservices heeft gemigreerd, zal je hetzelfde vertellen: het duurde drie keer zo lang als verwacht. Elk team dat heeft gefaald, zal je vertellen dat ze de operationele complexiteit hebben onderschat en de voordelen overschat. Beide groepen hebben gelijk.

Dit is geen argument tegen microservices. Het is een argument om er met open ogen in te gaan.

## Voor en tegen de monoliet

Een goed gestructureerde monoliet is geen mislukking. Het is vaak de juiste architectuur voor teams kleiner dan 20 engineers, producten jonger dan vijf jaar, of domeinen die nog ontdekt worden. Een monoliet heeft echte voordelen: één deployunit, geen netwerkgrenzen om over na te denken, gedeelde transacties en eenvoudige lokale ontwikkeling.

De druk die uiteindelijk richting services duwt, is ook reëel: teams die elkaars deployments verstoren, niet-gerelateerde features die geblokkeerd worden door één trage CI-pipeline, de behoefte om specifieke bottlenecks onafhankelijk te schalen, en verschillende delen van het systeem met genuïne verschillen in betrouwbaarheidseisen.

De vraag is niet "monoliet of microservices?" — het is "rechtvaardigt mijn specifieke pijn de operationele complexiteit die ik op het punt sta aan te nemen?"

## Het Strangler Fig-patroon

Als je besluit services te extraheren, probeer dan niet alles tegelijk te herschrijven. Het strangler fig-patroon is je vriend: plaats een proxy (een API-gateway, of een eenvoudige routinglaag) voor je monoliet, en leid geleidelijk verkeer voor specifieke routes om naar nieuwe services naarmate ze worden gebouwd.

```
                    ┌─────────────────┐
Browser ──────────► │   API Gateway   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌──────────────────┐         ┌──────────────────┐
    │    Monoliet      │         │ Betalingsservice  │
    │ /api/* (legacy)  │         │  /api/payments    │
    └──────────────────┘         └──────────────────┘
```

Begin met de naden die al bestaan. Als je `payments`-module nooit de databasetabellen van de `user`-module aanraakt, is het een goede kandidaat voor extractie.

## Domeinsgrenzen vóór codegrenzen

De meest voorkomende oorzaak van microservicefalen is extractie langs technische lijnen (frontend/backend/data) in plaats van domeinlijnen. Je eindigt met praatzieke services die strak gekoppeld zijn via netwerkaanroepen — het slechtste van beide werelden.

Het bounded context-concept uit Domain-Driven Design is hier de juiste lens. Een bounded context is een grens waarbinnen een bepaald domeinmodel consistent van toepassing is. "Order" betekent iets specifieks in de bestelcontext, iets anders in de factureringscontext, en weer iets anders in de logistiekcontext.

Splits het domeinmodel voordat je de code splitst:

1. Teken een contextkaart van je domein
2. Identificeer waar verschillende teams verschillende delen van het model bezitten
3. Zoek de natuurlijke naden — waar context A een referentie doorgeeft aan context B versus data kopieert van B

Die naden zijn je servicegrenzen.

## Het dataprobleem

Het moeilijkste deel van microservices is niet de code — het zijn de data. Gedistribueerde transacties zijn pijnlijk. Als "order aanmaken" zowel de orderdatabase als de voorraaddatabase atomisch moet bijwerken, heb je een probleem.

Twee patronen die echt werken op schaal:

**Saga-patroon** — splits de transactie op in een reeks lokale transacties, elk die een event publiceert. Als stap 3 mislukt, maken compenserende transacties stappen 1 en 2 ongedaan.

**Outbox-patroon** — schrijf je domeingebeurtenis naar een `outbox`-tabel in dezelfde databasetransactie als je domeinwijziging. Een apart proces publiceert die events betrouwbaar naar je message broker.

```sql
-- In één transactie:
INSERT INTO orders (id, status, ...) VALUES (...);
INSERT INTO outbox (aggregate_id, event_type, payload) 
  VALUES (order_id, 'order.created', '{"orderId": ...}');
```

## Observability eerst

Je kunt microservices niet opereren zonder distributed tracing. Elke cross-service aanroep moet een trace ID doorgeven, en elke service moet spans exporteren naar een collector (Jaeger, Tempo, Datadog — kies er één en wees consistent).

Stel dit in voordat je je eerste service extraheert. Observability achteraf inbouwen in vijf services in productie is aanzienlijk moeilijker dan het doen voor twee services in staging.

## Belangrijkste punten

Migreer niet omdat microservices populair zijn. Migreer omdat je een specifieke pijn hebt die services oplossen en je monoliet-niveau oplossingen hebt uitgeput. Begin met de strangler fig — nooit een big bang-herschrijving. Zorg dat je observability-stack op zijn plaats is voordat je het nodig hebt. En accepteer dat de eerste extractie je meer over je domein leert dan zes maanden architectuurdiagrammen.
