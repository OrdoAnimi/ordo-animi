# Architecture Decision Log

Version: 0.1
Status: Private decision log

## Purpose

This document records key architecture decisions for VALOUR and Ordo Animi.

## Decision format

Each decision records context, decision, options, impact, and next action.

## ADR-001: First product wedge

Status: Accepted

Context: Ordo Animi can become many products, so the first product needs a clear entry point.

Decision: VALOUR for Architecture Leadership is the first product wedge.

Options considered: architecture leadership, broad leadership, personal wellbeing, industry-specific vertical, full platform.

Impact: The first release stays focused on architects and technical leaders. VITA, VALLUM, VERITAS, and VIA remain part of the wider system.

## ADR-002: Pilot before platform

Status: Accepted

Context: A large platform before workflow proof would create cost and delivery risk.

Decision: Run a manual or lightly assisted pilot before building a full software platform.

Options considered: full platform first, desktop agent first, manual pilot first, static website first.

Impact: The first build focuses on workflow, templates, prompts, records, and evidence.

## ADR-003: Platform-neutral until workflow proof

Status: Accepted

Context: The product could be built on Microsoft, Google, Amazon, GitHub-first tooling, or a hybrid approach.

Decision: Stay platform-neutral until the pilot workflow is clear.

Options considered: Microsoft-first, Google-first, Amazon-first, GitHub-first, hybrid low-cost.

Impact: The near-term approach remains workflow-first and platform-light.

## ADR-004: Private source of truth

Status: Accepted

Context: The product contains founder material, product strategy, system architecture, prompts, and pilot materials.

Decision: Use the private GitHub repository as the product source of truth.

Options considered: public repo, Obsidian only, private repo, local documents only.

Impact: The product gains version history, access control, and structured documentation.

## ADR-005: Agentic implementation path

Status: Proposed

Context: The product can be implemented as separate deployed agents, structured prompt workflow, or hybrid orchestration.

Decision: Start with structured prompt workflow and evolve into agent orchestration after pilot proof.

Options considered: separate agents immediately, structured prompt workflow first, manual operator only, full orchestration first.

Impact: The early product remains faster and cheaper while preserving the agent model.

## ADR-006: First implementation architecture

Status: Pending

Context: A technical implementation path must be selected after workflow and architecture artefacts are complete.

Decision: Pending.

Options to compare: GitHub-first pilot, static site plus forms, lightweight web app, Microsoft path, Google path, Amazon path, hybrid path.

Next action: Create platform option briefs and compare them against workflow, cost, speed, privacy, and likely customer path.


---

*© 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.*