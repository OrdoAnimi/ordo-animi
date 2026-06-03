# Design: Pilot 001 Console Wire-Up + IP Protection

Date: 2026-06-03
Status: Approved
Author: Phil Myint / ZenCloud Global Consultants

## Scope

Two parallel tracks:
1. Wire the existing React components to real Pilot 001 data.
2. Apply Option C IP protection across the repo.

## Track 1 — Pilot Console

**Data file:** `app/src/data/pilot-001.ts`
- Typed as `PilotRun` from `types.ts`
- 8 stages sourced from `pilot/runs/pilot-001-architecture-review-board/`
- Evidence from outcome record (confidence 5 → 8, continue decision)

**App.tsx:** Restore full component layout:
- `PilotHeader` — pilot meta, status, product question
- `PilotStageTimeline` — 8 stages with status
- `EvidencePanel` — confidence shift + patterns
- `ProductDecisionPanel` — continue / rationale / next step
- `ArtifactViewer` — pattern summary artefact
- `OperatorNotes` — guardrail notes

## Track 2 — IP Protection (Option C Hybrid)

**LICENSE.md:** Add all pending ™ names:
VALOUR™, Ordo Animi™, VITA™, VALLUM™, VERITAS™, VIA™

**All docs (45 files):** Add copyright notice line below the `# Title`:
`> © 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.`

**Key external-facing docs:** Add ™ on first occurrence of each product name.
Priority docs: 00, 01, 03, 05, 06, 10, 11, 14, 15, 17, 20, 21, 27, 41.

**App metadata:** Add copyright to `index.html` meta tag.

## Success criteria

- Console renders Pilot 001 data with all 6 component panels visible.
- LICENSE.md lists all ™ product names.
- All 45 docs have copyright notice.
- Key docs have ™ on first product name occurrence.
