# Design: v0.5 Custos — Persistent Guide Presence for Valour

Date: 2026-06-05
Status: Approved
Release: v0.5 Custos
Author: Phil Myint / The OrdoAnimi Group

---

## Context

Valour is a guided AI rehearsal product for architecture leaders. The v0.4 console is functionally complete but reads as a workflow tool — stages, statuses, generate buttons. A cold user cannot understand what to do next without founder explanation.

v0.5 introduces Custos: a persistent guide presence inside Valour that makes the product feel guided rather than processed. Custos is not a chatbot. It is a calm architecture leadership guide that surfaces contextual help at the right moment.

---

## Scope

### In scope
- CustosPanel component: floating trigger → contextual card
- Landing page: Custos explains Valour in plain English
- Console: Custos shows stage-aware guidance (derived from existing `stage.guidance` data)
- Quick actions: "What should I do next?", "Explain this stage", "Help me answer this", "Make this more executive", "Make this shorter"
- Quick actions that generate text (last two) show a preview panel — user applies or dismisses, never silently overwrites
- Minor CSS softening: more whitespace, lighter panel density
- Release doc: `docs/56-valour-v05-custos-release.md`

### Explicitly out of scope
- No new database, auth, payments, or external integrations
- No Formspree dependency
- No changes to SA Generator, EA Velocity, or any other repo
- No private doctrine exposed publicly
- No broad refactor
- No changes to: StageWorkspace, Sidebar, TopBar, PatternPage, ScenariosPage, ExportPanel, AgentLogPanel, EvidencePanel, ProductDecisionPanel, all services, all data files

---

## Architecture

### New file: `app/src/components/CustosPanel.tsx`

**Props:**
```typescript
type CustosPanelProps = {
  page: 'landing' | 'console';
  activeStage?: PilotStage;
  activeEntry?: PilotStateEntry;
  onApplyOutput?: (content: string) => void;
};
```

**State:**
```typescript
isOpen: boolean                        // panel expanded/collapsed
activeView: 'guide' | 'quick-result'  // guide prose vs. quick action result
quickActionLabel: string              // which action ran
quickActionResult: string             // AI or static result text
quickActionLoading: boolean           // spinner while AI runs
```

**Collapsed state:**
A fixed-position pill button `bottom: 28px; right: 24px`. Label: "Custos". Subtle accent-coloured ring. Click opens panel.

**Expanded state (320px card above trigger):**

1. **Header** — "Custos" label + `×` close. No chatbot avatar or chat bubbles.

2. **Guide body — landing:**
   Three paragraphs of plain prose explaining what Valour does, who it is for, and what the user should do first ("Start by describing your situation in Stage 01"). No CTA inside the panel — the landing page already has prominent entry buttons.

3. **Guide body — console:**
   Stage-aware prose built from `stage.guidance`. Each section presented as a labelled paragraph, not a table or collapsed details element:
   - **This stage:** `stage.guidance.what`
   - **You provide:** `stage.guidance.provides`
   - **Valour generates:** `stage.guidance.generates`
   - **Recommended next:** `stage.guidance.next`
   
   If `stage.guidance` is undefined, render a neutral fallback.

4. **Quick actions (console only, 2-col grid):**
   - "What should I do next?" — renders `guidance.next` in the body area (no AI)
   - "Explain this stage" — renders `guidance.what` in the body area (no AI)
   - "Help me answer this" — renders a static per-stage tip (no AI)
   - "Make this more executive" — visible only when `activeEntry.output` exists; calls aiService
   - "Make this shorter" — visible only when `activeEntry.output` exists; calls aiService

5. **Preview panel (for AI quick actions):**
   When an AI quick action completes, replaces the guide body with:
   - Label: "Suggested refinement"
   - The generated text in a scrollable read-only area
   - Two buttons: "Apply to stage" (calls `onApplyOutput`) + "Dismiss"
   - `onApplyOutput` sets the stage output content with `source: 'manual'` — same path as the existing manual edit save

### Modified: `app/src/App.tsx`

**Landing path:**
```tsx
<LandingPage ... />
<CustosPanel page="landing" />
```

**Console path (`<Console>` component):**
Pass `activeStage` and `activeEntry` to `<CustosPanel>`. Wire `onApplyOutput` to call `setOutput` with `source: 'manual'`.

```tsx
<CustosPanel
  page="console"
  activeStage={activeStage}
  activeEntry={activeEntry}
  onApplyOutput={(content) =>
    setOutput(activeStage.id, { content, source: 'manual', generatedAt: new Date().toISOString() })
  }
/>
```

### Modified: `app/src/styles/app.css`

**Custos CSS additions:**
```
.custos-trigger         fixed pill button, bottom-right
.custos-trigger-open    accent ring when panel is open
.custos-panel           320px card, position above trigger, opacity/transform transition
.custos-panel-visible   shown state
.custos-header          flex row, label + close button
.custos-body            scrollable content area, max-height 420px
.custos-section         labelled guidance paragraph
.custos-section-label   uppercase 9px accent label
.custos-section-value   13px muted text
.custos-quick-actions   2-col grid of action buttons
.custos-qa-btn          soft ghost button, 11px
.custos-qa-btn-ai       slightly accented border for AI actions
.custos-preview         preview panel container
.custos-preview-label   "Suggested refinement" eyebrow
.custos-preview-content read-only scrollable text area
.custos-preview-actions apply + dismiss buttons
```

**Minor CSS softening (existing classes):**
- `.main` — gap `16px → 24px`, padding `24px → 28px`
- `.workspace` — padding `22px → 28px`
- `.ws-guidance-item:nth-child(odd)` — background soften: `rgba(14,24,37,.8) → rgba(14,24,37,.5)`
- `.ws-desc` — max-width `560px → 600px`

---

## AI quick action prompts

These are short, stateless calls via existing `callAgent` / `aiService.ts` path.

**Make this more executive:**
```
You are an executive communication coach for architecture leaders.
Rewrite the following in a shorter, more executive tone — suitable for a CxO audience.
Lead with the decision or outcome. Remove technical detail. Maximum 200 words.

[output.content]
```

**Make this shorter:**
```
You are an editing assistant.
Shorten the following to 50% of its current length while preserving all key points.
Do not add new content. Return only the shortened text.

[output.content]
```

Both calls use the same provider path as stage generation (Anthropic → local fallback).

---

## "Valour" naming convention

In all Custos-generated prose and UI labels:
- "Valour" in normal prose
- "Valour™" only in formal product mentions (nav logo, footer, generate button)
- Never ALL-CAPS in prose

---

## Quick action — static tips per stage

| Stage ID | "Help me answer this" tip |
|---|---|
| stage-01-intake | "Be specific about the situation. Include the room: who is in it, what decision they need to make, and what success looks like for you." |
| stage-02-scenario | "Review the scenario variant and fit score. If the variant feels off, note what's different — this will improve your prep brief." |
| stage-03-prep | "Read the brief as if you were walking into the room. Does the key message land in one sentence? If not, simplify it." |
| stage-04-rehearsal | "Answer as if the clock is running. Aim for 90 seconds. Don't edit — record your first instinct, then move to Stage 05 to refine." |
| stage-05-language | "Look for answers that start with technical context rather than the decision. Those are the ones to reframe." |
| stage-06-review | "Be honest about what felt uncomfortable. The after-action review is more useful when it names a real pattern, not just what went well." |
| stage-07-pattern | "Your pattern report is a coaching artefact. Read it before your next real conversation — even a 2-minute review helps." |
| default | "Work through this stage at your own pace. Valour saves your progress automatically." |

---

## Acceptance criteria

- Vercel build succeeds (TypeScript passes, no new deps)
- Custos trigger visible on landing and console
- Custos panel opens and closes cleanly
- Landing Custos shows Valour explanation in plain prose
- Console Custos shows guidance that changes with active stage
- "What should I do next?" and "Explain this stage" work without API
- "Help me answer this" shows static tip
- "Make this more executive" and "Make this shorter" only appear when output exists
- Both AI quick actions show preview; user must click "Apply" to change stage output
- Existing v0.4 features all work: rehearsal answer input, Stage 05 gate, pattern actions, export, print, localStorage, Anthropic path, local fallback
- Release doc written at `docs/56-valour-v05-custos-release.md`

---

## What remains for v0.6 Exploratio

- Custos "memory" — remembers guidance already shown and skips it
- Custos-initiated prompts ("Ready to rehearse?") at key moments
- Custos voice/tone settings
- More sophisticated quick-action routing (multi-turn refinement)
- Stage-by-stage confidence check-in
