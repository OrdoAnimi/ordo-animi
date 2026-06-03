# VALOUR Solution Brief

Version: 0.1
Status: Private solution brief

## Purpose

This document defines the first practical solution shape for the VALOUR pilot.

The goal is to support the pilot workflow first, then decide what to automate after the workflow proves useful.

## First solution objective

Support the VALOUR pilot from intake through scenario selection, preparation, rehearsal, language refinement, review, pattern report, and evidence capture.

## In scope

User intake, scenario selection, preparation brief, rehearsal, language refinement, after-action review, pattern report, evidence capture, pilot records, and operator workflow.

## Out of scope

Full SaaS platform, live meeting support, calendar automation, enterprise login, payment, mobile app, full VITA product, and desktop agent.

## Logical components

Pilot interface: a simple form or document flow for users and operators.

Scenario library: the catalogue of architecture leadership situations.

Guided workflow: the sequence that moves the user through prepare, rehearse, review, and improve.

Record store: private pilot notes, scenario notes, rehearsal notes, and reports.

Evidence tracker: usefulness, confidence, repeat intent, and next action.

Operator workspace: private workspace for the founder to run the pilot.

## Data flow

1. User completes intake.
2. Scenario is selected.
3. Situation is framed.
4. Preparation brief is created.
5. Rehearsal is run.
6. Language is refined.
7. User applies the preparation.
8. Review is completed.
9. Pattern report is created.
10. Evidence is captured.

## Implementation options

Manual GitHub-first pilot: fastest and lowest cost.

Static site plus form: useful for early pilot intake.

Lightweight web app: useful after the manual loop is proven.

Cloud-native build: useful after stronger evidence and architecture decision.

## Candidate platform paths

Microsoft: useful for M365, Teams, Outlook, Azure OpenAI, Entra, and enterprise customers.

Google: useful for Workspace, Gemini, Drive, Calendar, Forms, and lightweight collaboration.

Amazon: useful for Bedrock, Lambda, DynamoDB, and scalable backend services.

Hybrid: useful for speed, low cost, and platform neutrality.

## Recommended near-term path

Use the hybrid low-cost path first.

GitHub remains the product source of truth. Markdown remains the operating record. Intake can be manual or form-based. Rehearsal can be manually operated. Reports can be generated from templates.

Automate only after the repeated workflow is proven.

## Controls

Keep the repo private.

Collect minimum data.

Use anonymised examples where possible.

Separate public material from pilot records.

Do not expose detailed internal operating material publicly.

## Conclusion

The first solution is a controlled pilot operating system, not a large platform.

The purpose is to prove the VALOUR loop before building heavier architecture.


---

*© 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.*