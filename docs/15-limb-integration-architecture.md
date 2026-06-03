# Limb Integration Architecture

> © 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.

Release: 0.3
Date: 2026-06-04
Status: Baseline — contract defined, wiring deferred

---

## Overview

This note defines the integration architecture between Ordo Animi and the artefact generator limb repositories. It establishes the conceptual model, the initial contract, and the boundary of what Release 0.3 implements.

---

## Conceptual Model

**Ordo Animi is the brain.**
Ordo Animi holds the VALOUR product strategy, pilot evidence records, leadership reasoning patterns, and the intelligence layer that determines what downstream work is needed.

**VALOUR is the pilot evidence and leadership reasoning layer.**
The VALOUR Pilot Console captures a complete leadership preparation cycle: context intake, scenario selection, preparation brief, rehearsal, language refinement, after-action review, pattern report, and outcome record. Each completed pilot run produces structured evidence: a primary leadership pattern, a confidence shift, a product learning, and a repeatability signal.

**The artefact generator repositories are execution limbs.**
Each limb repository generates professional artefacts for a specific delivery discipline. Limbs receive structured requests derived from pilot evidence and return artefacts to their own surfaces. Limbs do not know about each other. Limbs do not know about Ordo Animi's internal state. Limbs receive only what they need.

```
Ordo Animi (Brain)
└── VALOUR (Leadership Reasoning Layer)
    └── Pilot Evidence → Evidence Comparison → Limb Routing Decision

Limbs (Execution Layer — independent repositories)
├── ea-artefact-generator   → Enterprise architecture artefacts
├── sa-artefact-generator   → Solution architecture artefacts
├── ba-artefact-generator   → Business analysis and architecture artefacts
├── pm-artefact-generator   → Project and programme management artefacts
└── pmi-portal              → Governed programme delivery workspace
```

---

## Limb Repository Status (Release 0.3 Assessment)

| Limb | URL | Stack | Maturity | Invocation | API Contract |
|---|---|---|---|---|---|
| ea-artefact-generator | ea.velocityarchitecture.com.au | React 19, Vite, Cloudflare Pages | Usable | Browser UI | None — browser only |
| sa-artefact-generator | Cloudflare Pages | JS, Vite | Minimal | Browser UI | None — browser only |
| ba-artefact-generator | ba.velocityarchitecture.com.au | React 19, Vite, Cloudflare Workers | MVP 0.1.0 Alpha | Browser UI + `/api/generate` Worker route | `/api/generate` exists but not yet documented as external contract |
| pm-artefact-generator | pm.velocityarchitecture.com.au | React+JSX, Vite, Cloudflare Pages | v0.1.0-uat | Browser UI | None — browser only |
| pmi-portal | GitHub Pages | React 18, TypeScript, Vite, Tailwind | Prototype | Browser UI | Anthropic API path configured but no external API surface |

**Key finding:** No limb repository exposes a stable, documented external API contract in Release 0.3. `ba-artefact-generator` has a Cloudflare Worker with `/api/generate`, making it the most integration-ready. All others are browser-only surfaces.

---

## Initial Integration Contract

A VALOUR pilot evidence record can generate an artefact request using the following minimum metadata:

```json
{
  "pilotId": "PILOT-001",
  "scenarioType": "architecture-review-board",
  "primaryPattern": "Technical confidence without decision framing",
  "confidenceDelta": 3,
  "evidenceSignals": ["architecture-decision-framing"],
  "requestedArtefacts": ["Architecture Decision Record", "Governance Brief"],
  "targetLimb": "ea-artefact-generator",
  "targetLimbUrl": "https://ea.velocityarchitecture.com.au/",
  "requestedAt": "2026-06-04T00:00:00Z",
  "requestVersion": "0.3.0"
}
```

This contract is defined here but not yet wired. In Release 0.3 it exists as a documented intention, not a live API call.

### Minimum metadata required to request an artefact

| Field | Required | Description |
|---|---|---|
| `pilotId` | Yes | Source pilot run identifier |
| `scenarioType` | Yes | VALOUR scenario category |
| `primaryPattern` | Yes | Leadership pattern identified |
| `evidenceSignals` | Yes | One or more evidence outcome tags |
| `requestedArtefacts` | Yes | Target artefact types for the limb |
| `targetLimb` | Yes | Limb repository identifier |
| `targetLimbUrl` | Yes | Limb surface URL |
| `confidenceDelta` | Recommended | Before/after confidence shift |
| `requestedAt` | Recommended | ISO 8601 timestamp |
| `requestVersion` | Recommended | Integration contract version |

---

## Evidence Signal to Limb Mapping

The `pilot/evidence-comparison/artefact-limb-map.json` file defines the machine-readable routing table. Summary:

| Evidence Signal | Primary Limb | Secondary Limb |
|---|---|---|
| `architecture-decision-framing` | ea-artefact-generator | sa-artefact-generator |
| `executive-translation` | pmi-portal | ba-artefact-generator |
| `delivery-risk-and-action` | pm-artefact-generator | pmi-portal |
| `business-stakeholder-clarification` | ba-artefact-generator | — |
| `programme-communication` | pmi-portal | pm-artefact-generator |
| `confidence-calibration` | (all limbs — context-dependent) | — |

---

## Limits of Release 0.3

Release 0.3 establishes the integration baseline. It does **not** implement:

- Live API calls from Ordo Animi to any limb repository
- Shared authentication or session passing
- Automated artefact generation triggered by pilot completion
- Event bus or message queue between brain and limbs
- Feedback loop from limb output back to Ordo Animi
- Tenant or user identity propagation
- Billing, persistence, or SaaS mechanics

What Release 0.3 **does** implement:

- The integration contract (this document)
- The evidence signal to limb routing map (`artefact-limb-map.json`)
- A pilot evidence comparison across Pilot 001 and Pilot 002
- A console view showing which limbs are relevant to completed pilot evidence
- Honest assessment of each limb's current readiness for integration

---

## Future Path Toward Orchestration

Release 0.4 should establish the first live integration with one limb — the recommended candidate is `ba-artefact-generator` because it already has a Cloudflare Worker `/api/generate` endpoint.

The integration sequence should be:

1. **Release 0.4 — First live limb call:** VALOUR sends a structured artefact request to `ba-artefact-generator /api/generate`. Response is rendered in the VALOUR console. No persistent storage. Single limb only.

2. **Release 0.5 — Multi-limb routing:** VALOUR can route to ea, sa, or ba based on evidence signals. User selects which artefact to generate. Results are displayed but not stored.

3. **Release 0.6 — Evidence-driven pack generation:** A completed pilot run triggers an artefact pack recommendation. User reviews, selects, and initiates generation. Output is downloadable.

4. **Future — Orchestration platform:** If volume and complexity justify it, an orchestration layer (API gateway, event bus, or serverless workflow) replaces direct point-to-point calls. This should not be built until at least three limbs are live and the call patterns are understood.

**Constraint:** Do not build the orchestration platform before the first live integration is proven. Premature orchestration before contract stability is waste.

---

## Guiding Principles

- The brain decides. The limbs execute.
- No limb should pull state from Ordo Animi. The brain pushes only what is needed.
- Integration contracts must be versioned and explicit before wiring begins.
- No monolith. Repositories stay independent.
- No fake automation. If a call is not live, document it as a future intent.
- Reliability over framework purity at every release boundary.

---

*© 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.*
