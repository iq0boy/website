---
title: "Healthcare Portal"
excerpt: "Patient management system with HIPAA compliance and telemedicine integration."
category: "Web App"
tags: ["Vue.js", "Node.js", "FHIR"]
year: "2024"
color: "oklch(0.30 0.04 180)"
---

A regional healthcare network needed to unify patient records across 15 clinics, enable telemedicine consultations, and give patients a self-service portal — all while meeting HIPAA requirements and integrating with four existing EHR systems.

## Interoperability with FHIR

The biggest technical challenge was bridging four different EHR systems, each with a proprietary API. FHIR (Fast Healthcare Interoperability Resources) provided the common language. A FHIR adapter layer translates between each EHR's data format and a canonical FHIR R4 representation, letting the application work with a single consistent API regardless of the underlying system.

```typescript
// Canonical FHIR R4 Patient — consistent across all EHR systems
interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  identifier: Identifier[];
  name: HumanName[];
  birthDate: string;
  address: Address[];
}
```

## HIPAA Compliance

HIPAA compliance shaped every architectural decision. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Access to PHI (Protected Health Information) requires role-based authorization with minimum-necessary enforcement — a receptionist sees scheduling data but not clinical notes.

Every access to PHI generates an immutable audit log entry, satisfying HIPAA's audit control requirements.

## Telemedicine Integration

Video consultations run over WebRTC, with a TURN server for NAT traversal. The telemedicine module integrates with the scheduling system, automatically generating encrypted meeting rooms for booked appointments and sending SMS reminders to patients 24 hours and 1 hour before their consultation.

## Patient Portal

Patients can view their records, request prescription refills, message their care team, and join video consultations from a single portal. Two-factor authentication is mandatory, with SMS or authenticator app as the second factor.

## Results

- 500+ healthcare providers across 15 clinics
- 98% EHR integration success rate (vs. 60% with direct integrations)
- 40% reduction in no-show appointments after SMS reminder integration
- Full HIPAA audit passed on first submission
