# VALOUR Pilot Console

VALOUR is a rehearsal-driven leadership practice product for architects and technical leaders preparing for high-stakes conversations.

This MVP stabilisation release separates the product into three modes and makes one submitted rehearsal response the core completion evidence.

## Modes

### Participant

The default experience. Participants move through:

`Context → Scenario → Prepare → Rehearse → Refine → Reflect → Report → Complete`

Participant mode hides provider diagnostics, agent logs, product decisions, pilot switching, raw source paths, and destructive developer controls.

Open locally at:

`/#console`

### Facilitator

A review surface for progress and evidence. It may inspect run status and evidence without changing participant content.

Open locally at:

`/#console?mode=facilitator`

### Developer

A diagnostic surface exposing provider status, model provenance, agent logs, pilot switching, exports, reset controls, and source artefacts.

Open locally at:

`/#console?mode=developer`

Developer mode is not intended for participant navigation.

## Rehearsal completion contract

Rehearsal is complete only when:

1. A challenge question is selected.
2. The participant submits a real response.
3. The Refine stage produces language alternatives.
4. The participant saves a preferred response.

Generating rehearsal questions alone does not complete the stage. Reflection remains locked until a preferred response is saved.

## AI behaviour

The browser calls the same-origin `/api/ai` endpoint. Provider keys remain server-side.

Supported provider selection:

- `AI_PROVIDER=anthropic` with `ANTHROPIC_API_KEY`
- `AI_PROVIDER=openai` with `OPENAI_API_KEY`
- no configured provider uses the structured local VALOUR fallback

Participant mode shows simple provenance language. Detailed provider, model, duration, and fallback information is restricted to developer mode.

## Persistence

MVP state is stored in browser `localStorage` under a pilot-specific key. The state includes a schema version and migrates legacy rehearsal answers into the explicit rehearsal model.

This is not suitable for shared devices, regulated data, multi-user programmes, or production tenancy. Authentication and server-side persistence remain GA work.

## Local development

```bash
cd app
npm install
npm run dev
```

## Release validation

```bash
npm run typecheck
npm run build
```

## MVP boundaries

Included:

- participant-first workflow;
- explicit rehearsal response capture;
- saved preferred response;
- facilitator and developer mode separation;
- AI provider or local fallback;
- local state migration and resume.

Not included:

- authentication;
- database storage;
- multi-tenancy;
- billing;
- organisation administration;
- real-time facilitator chat;
- production analytics;
- voice recording;
- additional Ordo Animi product modules.

## Product guardrail

Every feature must help a participant prepare, rehearse, refine, reflect, or learn from a real leadership moment. Internal controls belong outside participant mode.
