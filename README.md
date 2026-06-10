# Ordo Animi

**Private — Zencloud Advisory flagship AI product.**

*Ordo Animi* — Latin: *Order of the Mind* — is ZenCloud's agentic AI leadership platform.
A command-and-control system for professional and personal life, built on guardrails,
governance, and structured decision intelligence.

## Purpose

Ordo Animi gives individuals and leaders an AI-powered operating system for their life —
not a productivity app, not a chatbot. A governed, agentic system that structures decisions,
enforces personal guardrails, tracks commitments, and coordinates across professional and
personal domains with the discipline of enterprise architecture applied to human leadership.

## Core Capabilities

- **Agentic command layer** — structured task execution with human-in-the-loop governance
- **Personal guardrail system** — non-negotiables, constraints, and operating principles enforced by AI
- **Decision governance** — every significant decision traced, recorded, and reviewed
- **Professional/personal integration** — one system governing both domains with appropriate separation
- **Leadership intelligence** — AI-assisted thinking for senior leaders navigating complex decisions

## Design Principles

- Guardrails first — the system knows what you will not do before it suggests what you should
- Decision traceability — every commitment has a record
- Human authority — the agent advises and executes, the human decides and governs
- Aligned to VAF™ — decision governance architecture applied to personal and professional life

## How It Fits the Ecosystem

- **VAF™** — decision governance method that underpins Ordo Animi's architecture
- **StudioSix** — delivery studio that will commercialise Ordo Animi for enterprise clients
- **PMO Portal** — operational counterpart for project and programme governance

## Application

The first user-facing product surface is the **VALOUR™ Pilot Console** (`app/`) — a
browser application that guides architecture and technical leaders through a structured
preparation, rehearsal, language-refinement and after-action review workflow.

- **Frontend** — React 19 + TypeScript, built with Vite (`app/src`)
- **AI layer** — provider-agnostic edge function (`app/api/ai.ts`) calling Anthropic
  (Claude) or OpenAI; API keys stay server-side and are never exposed to the browser
- **Deployment** — Vercel (Vite framework preset; see `app/vercel.json`); CI build in
  `.github/workflows/build.yml`

```bash
npm run install:app   # install app dependencies
npm run dev           # local dev server
npm run build         # type-check and production build
```

### AI configuration

The AI provider is selected at runtime from environment variables, set in the deployment
environment (never committed):

- `ANTHROPIC_API_KEY` — use Anthropic (Claude)
- `OPENAI_API_KEY` — use OpenAI
- `AI_PROVIDER` — optional explicit override
- With no key configured, the console runs in a local-fallback mode

## Place In The Ordo Animi Estate

Ordo Animi is part of the Ordo Animi institutional estate. It is authoritative for the
primary user experience and the VALOUR product surface. The canonical institutional
relationship is:

- Magister Automatorum governs the estate.
- Imperium determines what deserves investment.
- Mercatus takes products to market.
- Velocity Architecture defines the professional method.
- Lex defines policy and processing rules.
- Ordo Animi operates the intelligence and user experience.
- Civitas manages identity, organisations, engagements and authority.
- Memoria manages approved and consented runtime context.
- Fabrica produces canonical artefacts.
- Probatio validates claims and evidence.
- Archivum preserves artefacts, evidence and engagement history.
- Nexus transfers canonical objects into external systems.
- Praesidium protects infrastructure, deployments and supply chains.
- Specula observes runtime and governance behaviour.
- Forma provides shared experience and design standards.
- Arcadium presents authorised Archivum content to clients.

## Status

Active development. Private repository. The constitutional baseline (v0.1 Fundamentum)
is established and the VALOUR Pilot Console MVP is in progress.

## Licence

Proprietary. © 2026 Zencloud Advisory. All rights reserved.
See LICENSE.md for terms.

## Constitutional Documents

- [Charter](CHARTER.md)
- [Agent Instructions](AGENTS.md)
- [Security](SECURITY.md)
- [Data Rules](DATA.md)
- [Interfaces](INTERFACES.md)
- [Roadmap](ROADMAP.md)
- [Kanban](KANBAN.md)
- [Architecture](docs/architecture/README.md)
- [Decisions](docs/decisions/README.md)
- [Releases](docs/releases/README.md)
- [Schemas](schemas/README.md)
- [Examples](examples/README.md)

---
© 2026 Zencloud Advisory. All rights reserved. Proprietary and confidential.

