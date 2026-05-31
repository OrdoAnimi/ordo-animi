# VALOUR Pilot Console

Private operator console for the VALOUR Architecture Leadership pilot workflow.

The console maps directly to:

`pilot/runs/pilot-001-architecture-review-board/`

Its purpose is to make the pilot workflow visible, traceable, and repeatable before Ordo Animi expands into a broader platform.

## Scope

This app is intentionally small.

The console currently provides:

- Pilot 001 workflow visibility
- Stage timeline rendering
- Evidence review
- Product decision capture
- Operator guidance and guardrails

The app does not yet include:

- Authentication
- Database storage
- AI APIs
- Multi-user support
- External integrations
- Public product surfaces

## Local development

```bash
cd app
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Product boundary

VALOUR remains a pilot-first system.

The product being validated is the behavioural loop:

Prepare -> Rehearse -> Perform -> Review -> Improve.

The console exists to support that loop, not replace it.
