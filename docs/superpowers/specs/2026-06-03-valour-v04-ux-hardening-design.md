---
title: VALOUR v0.4 — UX Hardening Design
date: 2026-06-03
status: approved
---

# VALOUR v0.4 — Guided Copilot UX Design

## Scope

First-time user experience hardening for the VALOUR Pilot Console. Targets v0.4 (guided copilot UX) acceptance criteria. No new AI agents. No backend changes.

## Problem

The agentic workflow works technically but first-time users cannot self-navigate:
- Stage 04 Rehearsal hides the answer panel until AI generates (blocking the loop)
- Stage 05 Language can be attempted with no rehearsal answer (produces poor output)
- Pattern Report page has no export/action surface (doesn't feel like destination)
- No stage guidance — users don't know what each stage does or what they need to provide
- No visible progress stepper
- "Intake" label confuses non-technical users

## Design

### 1. Rehearsal UX (Stage 04)

**Always-visible answer panel.** Not gated on AI output existing.

States:
- No output yet: "Generate rehearsal questions above, then record your answer here."
- Output exists: question dropdown populated by parsing numbered/bulleted lines from output content
- Answer saved: preview shown below textarea with edit link

Storage: `userInput` stores `{"question":"<selected question text>","answer":"<user answer>"}` as JSON.

### 2. Language Refinement Gate (Stage 05)

`checkDependency` for `stage-05-language` changes from:
```
userInput || output  →  { ok: true }
```
to:
```
userInput with parseable {answer: non-empty}  →  { ok: true }
else  →  { ok: false, message: "Record your rehearsal answer first. VALOUR needs your answer before it can refine your language." }
```

Stage 05 agent call unchanged — already receives `userInput` and passes to `languageRefinementAgent`.

### 3. Pattern Report — Action Bar

PatternPage receives additional props: `state: PilotState`, `pilotId: string`, `onReset: () => void`.

App.tsx reads full pilot state from localStorage for PatternPage (already reads `liveContent` this way).

Actions rendered below report content:
- Copy report — `navigator.clipboard.writeText(liveContent)`
- Export Markdown — download `.md`
- Export JSON — download `.json`
- Print / PDF — `window.print()`
- Email to myself — `mailto:` link with subject + body (truncated)
- Start another pilot — nav to `#console`
- Reset pilot — calls `onReset` with confirm dialog

### 4. Stage Guidance Panel

Add to `PilotStage` type:
```typescript
guidance?: {
  what: string;      // what this stage does
  provides: string;  // what the user provides
  generates: string; // what VALOUR generates
  next: string;      // next recommended action
}
```

Each stage in pilot-001.ts gets its guidance text.

StageWorkspace renders guidance as always-visible collapsed `<details>` block under stage description. Heading: "About this stage".

### 5. Visible Stepper

7-label compact bar in StageWorkspace header:
`Context · Scenario · Prepare · Rehearse · Refine · Review · Report`

Stage 08 (Outcome Record) excluded from stepper — it is the epilogue.

Visual state per step:
- Completed (has output): checkmark + muted style
- Active: highlighted accent
- Upcoming: muted

Stepper labels are not clickable in this release (navigation is via Prev/Next and Sidebar).

### 6. "Intake" Rename

User-facing strings that say "Intake" → "Context". Stage ID `stage-01-intake` retained internally. `isIntake` check in StageWorkspace stays on the ID. Dependency messages updated.

### 7. Docs

- `docs/49-release-phases-and-ux-roadmap.md`
- `docs/50-valour-console-v0.4-v0.5-ux-release.md`

## Files Changing

| File | Change |
|------|--------|
| `app/src/data/types.ts` | Add `guidance?` to `PilotStage` |
| `app/src/data/pilot-001.ts` | Add `guidance` to all 8 stages |
| `app/src/services/agents.ts` | Tighten Stage 05 dependency check |
| `app/src/components/StageWorkspace.tsx` | Rehearsal panel, guidance, stepper, language block |
| `app/src/components/PatternPage.tsx` | Export/action bar |
| `app/src/App.tsx` | Pass state + handlers to PatternPage |
| `app/src/styles/app.css` | Stepper, guidance, report action styles |
| `docs/49-*.md` | New doc |
| `docs/50-*.md` | New doc |

## Acceptance Criteria

- Rehearsal answer can be entered and saved before AI generation
- Refinement blocked with clear message when no rehearsal answer exists
- Final report has copy/export/print/email/reset actions
- Pattern report generated from live localStorage state
- First-time user understands each stage without explanation
- Stepper shows progress across 7 stages
- No Formspree dependency
- Vercel deploy succeeds

## Out of Scope (v0.5+)

- Multi-question rehearsal workspace (multiple saved answers)
- New pilot creation flow
- Pilot run management
- Smarter agent state/context
