---
title: "Gezondheidsportaal"
excerpt: "Patiëntbeheersysteem met HIPAA-naleving en telemedicijne-integratie."
category: "Web App"
tags: ["Vue.js", "Node.js", "FHIR"]
year: "2024"
color: "oklch(0.30 0.04 180)"
---

Een regionaal zorgnetwerk moest patiëntendossiers van 15 klinieken samenvoegen, teleconsultaties mogelijk maken en patiënten een selfserviceportaal bieden — alles terwijl aan HIPAA-vereisten werd voldaan en integratie met vier bestaande EPD-systemen werd gerealiseerd.

## Interoperabiliteit met FHIR

De grootste technische uitdaging was het koppelen aan vier verschillende EPD-systemen, elk met een eigen API. FHIR (Fast Healthcare Interoperability Resources) bood de gemeenschappelijke taal. Een FHIR-adapterlaag vertaalt tussen het dataformaat van elk EPD en een canonieke FHIR R4-representatie, waardoor de applicatie met één consistente API kan werken ongeacht het onderliggende systeem.

```typescript
// Canonieke FHIR R4 Patiënt — consistent over alle EPD-systemen
interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  identifier: Identifier[];
  name: HumanName[];
  birthDate: string;
  address: Address[];
}
```

## HIPAA-naleving

HIPAA-naleving bepaalde elke architectuurbeslissing. Alle data is versleuteld in rust (AES-256) en in transit (TLS 1.3). Toegang tot PHI (Protected Health Information) vereist op rollen gebaseerde autorisatie met minimaal-noodzakelijk-handhaving — een receptionist ziet planningsdata maar geen klinische notities.

Elke toegang tot PHI genereert een onveranderlijk auditlogboekvermelding, waarmee aan de auditcontrole-eisen van HIPAA wordt voldaan.

## Telemedicijne-integratie

Videoconsultaties lopen over WebRTC, met een TURN-server voor NAT-traversal. De teleconsultatiemodule integreert met het planningssysteem en genereert automatisch versleutelde vergaderruimtes voor geboekte afspraken, met sms-herinneringen naar patiënten 24 uur en 1 uur voor hun consultatie.

## Patiëntenportaal

Patiënten kunnen hun dossiers bekijken, herhaalrecepten aanvragen, berichten sturen naar hun zorgteam en videoconsultaties bijwonen vanuit één portaal. Tweefactorauthenticatie is verplicht, met sms of authenticator-app als tweede factor.

## Resultaten

- 500+ zorgverleners in 15 klinieken
- EPD-integratiesucces: 98% (vs. 60% met directe integraties)
- 40% minder no-shows na sms-herinneringintegratie
- Volledige HIPAA-audit geslaagd bij eerste indiening
