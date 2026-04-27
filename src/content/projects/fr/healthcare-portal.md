---
title: "Portail de Santé"
excerpt: "Système de gestion de patients avec conformité HIPAA et intégration de télémédecine."
category: "Web App"
tags: ["Vue.js", "Node.js", "FHIR"]
year: "2024"
color: "oklch(0.30 0.04 180)"
---

Un réseau de santé régional avait besoin d'unifier les dossiers patients de 15 cliniques, d'activer les consultations de télémédecine et d'offrir un portail en libre-service aux patients — tout en respectant les exigences HIPAA et en s'intégrant à quatre systèmes de dossiers médicaux existants.

## Interopérabilité avec FHIR

Le plus grand défi technique était de s'interfacer avec quatre systèmes de dossiers médicaux différents, chacun avec une API propriétaire. FHIR (Fast Healthcare Interoperability Resources) a fourni le langage commun. Une couche d'adaptation FHIR traduit entre le format de données de chaque système et une représentation canonique FHIR R4, permettant à l'application de travailler avec une API unique et cohérente quel que soit le système sous-jacent.

```typescript
// Ressource Patient FHIR R4 canonique — cohérente sur tous les systèmes
interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  identifier: Identifier[];
  name: HumanName[];
  birthDate: string;
  address: Address[];
}
```

## Conformité HIPAA

La conformité HIPAA a influencé chaque décision architecturale. Toutes les données sont chiffrées au repos (AES-256) et en transit (TLS 1.3). L'accès aux PHI (Protected Health Information) nécessite une autorisation basée sur les rôles avec application du principe du minimum nécessaire — une réceptionniste voit les données de planification mais pas les notes cliniques.

Chaque accès aux PHI génère une entrée de journal d'audit immuable, répondant aux exigences de contrôle d'audit HIPAA.

## Intégration de télémédecine

Les consultations vidéo fonctionnent sur WebRTC, avec un serveur TURN pour la traversée NAT. Le module de télémédecine s'intègre au système de planification, générant automatiquement des salles de réunion chiffrées pour les rendez-vous réservés et envoyant des rappels SMS aux patients 24 heures et 1 heure avant leur consultation.

## Portail patient

Les patients peuvent consulter leurs dossiers, demander des renouvellements d'ordonnances, envoyer des messages à leur équipe soignante et rejoindre des consultations vidéo depuis un portail unique. L'authentification à deux facteurs est obligatoire, avec SMS ou application d'authentification comme second facteur.

## Résultats

- 500+ professionnels de santé dans 15 cliniques
- Taux de succès d'intégration des dossiers médicaux : 98% (contre 60% avec les intégrations directes)
- Réduction de 40% des rendez-vous manqués après l'intégration des rappels SMS
- Audit HIPAA complet réussi à la première soumission
