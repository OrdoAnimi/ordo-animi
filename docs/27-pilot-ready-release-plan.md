# Pilot Ready Release Plan

Version: 0.1
Status: Private release plan
Release: Pilot Ready

## Purpose

This document defines the work required to move VALOUR from documentation into an actual pilot-ready state.

The founder has already built the original pilot concept previously and has provided the use cases, scenarios, partner context, and operating intent. That prior pilot was deleted, so this release recreates the pilot package as a clean private source of truth.

## Release objective

Make VALOUR ready to run as a manual or lightly assisted pilot for architecture leadership.

The release must provide everything needed up to the point where technical architecture can be discussed and selected.

## Position

The product can be built on several cloud platforms because the founder has Microsoft, Google, and Amazon partner context.

Architecture selection is not required before pilot readiness.

The pilot should remain platform-neutral until the user journey, data model, workflow, and operating controls are clear.

## Release scope

The Pilot Ready release includes pilot workflow, user journey, role model, data capture model, scenario operating model, prompt operating model, feedback and evidence model, manual delivery runbook, pilot success metrics, and architecture decision inputs.

## Out of scope

The following are not required before Pilot Ready: final cloud architecture, full SaaS build, desktop agent build, mobile app, calendar integration, payment system, enterprise SSO, full VITA product launch, or public launch.

## Pilot Ready definition

VALOUR is Pilot Ready when one user can be taken from intake to scenario selection, preparation, rehearsal, language refinement, real-world use, after-action review, pattern report, and feedback capture using the documents in this repo.

## Release deliverables

### Pilot workflow

Defines the step-by-step flow from user intake to pilot completion.

### User journey

Defines what the pilot user experiences and what the operator does behind the scenes.

### Data model

Defines the information captured during the pilot.

### Manual runbook

Defines how to run the pilot without software.

### Evidence model

Defines how outcomes, feedback, learning, and pilot proof are captured.

### Success metrics

Defines what counts as useful signal.

### Architecture inputs

Defines the functional and non-functional requirements needed for the later technical architecture discussion.

## Release sequencing

Step 1: Create the pilot workflow.

Step 2: Create the user journey.

Step 3: Create the data model.

Step 4: Create the manual runbook.

Step 5: Create the evidence model.

Step 6: Create the success metrics.

Step 7: Create the architecture input brief.

Step 8: Update release summary and README.

## Decision gate

After Pilot Ready is complete, the next discussion is architecture.

That discussion should decide whether the first build should be based on Microsoft, Google, Amazon, GitHub-first static tooling, or a hybrid low-cost approach.

## Release principle

Do not let cloud architecture slow pilot readiness.

Get the pilot workflow ready first.

Then choose architecture based on the workflow, not the other way around.


---

*© 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.*