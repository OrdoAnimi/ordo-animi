# VALOUR Architecture Input Brief

Version: 0.1
Status: Private architecture input
Release: Pilot Ready

## Purpose

This document defines the functional and non-functional inputs required before choosing the technical architecture for VALOUR.

The goal is to avoid selecting Microsoft, Google, Amazon, GitHub-first tooling, or another stack before the pilot workflow is clear.

## Architecture principle

Choose architecture based on the workflow.

Do not let the platform choice drive the product.

The first pilot can run manually. The first build should automate the smallest repeatable workflow that has been proven useful.

## Product boundary for first build

The first build should support VALOUR for Architecture Leadership only.

It does not need to support the full Ordo Animi desktop companion, VITA consumer experience, enterprise SSO, full billing, or live meeting support.

## Core functional requirements

### User intake

The system should capture pilot user details, role, context, scenario, confidence baseline, desired outcome, and communication challenge.

### Scenario selection

The system should allow the user or operator to select one VALOUR scenario.

### Preparation brief

The system should generate or assist with a preparation brief covering audience, decision, risks, key message, likely questions, and closing statement.

### Rehearsal

The system should support AI-assisted rehearsal using the selected scenario.

### Language refinement

The system should generate improved versions of key user responses.

### After-action review

The system should capture what happened after the real conversation and help identify lessons.

### Pattern report

The system should produce a short user-facing pattern report.

### Evidence capture

The system should capture usefulness, confidence shift, repeat intent, recommendation signal, and next action.

## Core non-functional requirements

### Privacy

The system must avoid unnecessary capture of confidential organisational material.

### Data minimisation

The system should collect only what is required to run the pilot and assess usefulness.

### Auditability

Pilot records should be traceable enough to understand what was prepared, rehearsed, and reviewed.

### Portability

The first design should not lock the product into a stack before validation.

### Cost control

The first technical build should be low-cost and easy to operate.

### Founder operability

The founder should be able to run and update the pilot without needing a large development team.

### Future extensibility

The design should allow later expansion into VITA, VALLUM, VERITAS, VIA, calendar integration, and richer agentic mode switching.

## Candidate architecture paths

### GitHub-first manual pilot

Markdown files, GitHub repository, prompt templates, and manual operator workflow.

Best for lowest cost and fastest control.

### Static site plus forms

Landing page, intake form, and manual backend processing.

Best for early public-facing pilot access.

### Microsoft-oriented path

Useful if integrating with Microsoft 365, Teams, Outlook calendar, Azure OpenAI, Entra ID, SharePoint, or enterprise clients.

### Google-oriented path

Useful if integrating with Google Workspace, Gemini, Drive, Calendar, Forms, and lightweight collaboration workflows.

### Amazon-oriented path

Useful if building scalable backend services, Bedrock-based agent workflows, or AWS-native SaaS foundations.

### Hybrid low-cost path

Use GitHub for source of truth, a lightweight web front end, forms for intake, and manual AI orchestration until usage justifies deeper platform build.

## Recommended first architecture posture

For Pilot Ready, remain platform-neutral.

For the first technical implementation, prefer a hybrid low-cost path:

- GitHub as product source of truth.
- Simple landing page.
- Intake form.
- Manual or semi-automated prompt workflow.
- Private pilot-data folder.
- No full SaaS platform until evidence supports it.

## Architecture decision gate

Choose technical architecture after at least one pilot workflow has been run end to end.

The architecture decision should answer:

- What workflow is repeated most often?
- What user step creates the most friction?
- What data must be stored?
- What can remain manual?
- What must be automated first?
- What cloud platform best matches the customer path?
- What is the cheapest reliable build?

## Architecture discussion trigger

Architecture discussion begins after Pilot Ready is complete.

At that point, compare Microsoft, Google, Amazon, GitHub-first, and hybrid low-cost options against the actual workflow rather than the abstract vision.
