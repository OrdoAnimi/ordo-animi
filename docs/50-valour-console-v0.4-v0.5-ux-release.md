# VALOUR™ Console v0.4–v0.5 UX Release Notes

**Release:** v0.4 — Guided Copilot UX  
**Date:** 2026-06-03  
**Deployed to:** www.ordoanimi.com via Vercel auto-deploy from main

---

## What Changed in v0.4

### 1. Stage Guidance Panel

Every stage now shows a collapsible "About this stage" panel with four fields:
- **What this stage does** — plain-language description of purpose
- **You provide** — what the user needs to bring
- **VALOUR generates** — what the AI produces
- **Recommended next** — where to go after completing this stage

Collapsed by default. Click to expand.

### 2. Workflow Stepper

A 7-step horizontal stepper appears at the top of every stage workspace:

`Context · Scenario · Prepare · Rehearse · Refine · Review · Report`

- Completed stages (with AI output): green dot
- Active stage: accent blue dot + bold label
- Upcoming stages: muted

Stage 08 (Outcome Record) is the epilogue and is not shown in the stepper.

### 3. Rehearsal Answer Panel (Stage 04)

The rehearsal answer panel is now always visible in Stage 04 — it no longer requires AI generation first.

States:
- **Before generation:** "Generate rehearsal questions above, then record your answer here."
- **After generation:** Question selector dropdown (parsed from AI output) + textarea + save button
- **After saving:** Answer preview with edit link

Answer stored as `{question, answer}` JSON in localStorage.

### 4. Language Refinement Gate (Stage 05)

Stage 05 now requires a saved rehearsal answer before generation is enabled.

If no answer: dependency warning shows:
> "Record your rehearsal answer first. VALOUR needs your answer before it can refine your language."

The agent always reads the answer from Stage 04 — no need to re-enter in Stage 05.

### 5. Pattern Report Action Bar

The Pattern Report page now has a full action bar at the bottom:

| Action | Behaviour |
|--------|-----------|
| Copy report | Copies AI report (or fallback text) to clipboard |
| ↓ Markdown | Downloads `.md` report file |
| ↓ JSON | Downloads `.json` with full pilot state |
| Print / PDF | Opens browser print dialog |
| Email to myself | Opens mailto with report snippet |
| Start another pilot | Navigates to console |
| Reset pilot | Clears localStorage state, returns to console |

### 6. Context Rename

"Intake" renamed "Context" in all user-facing messages and dependency warnings. Stage IDs unchanged.

---

## Testing Checklist (Verify on Vercel)

- [ ] Stage guidance panel expands/collapses on all 8 stages
- [ ] Stepper shows correct active stage at each step
- [ ] Completed stages (after generation) show green dot in stepper
- [ ] Stage 04: rehearsal panel visible before AI generation
- [ ] Stage 04: question dropdown populated after AI generates questions
- [ ] Stage 04: answer saves to localStorage; persists on page refresh
- [ ] Stage 05: "Record your rehearsal answer first" message shown when no answer
- [ ] Stage 05: generation succeeds after recording rehearsal answer
- [ ] Stage 05: language agent uses rehearsal answer (not empty)
- [ ] Pattern Report: Copy button works (no error)
- [ ] Pattern Report: Markdown download works
- [ ] Pattern Report: JSON download works
- [ ] Pattern Report: Print/PDF opens dialog
- [ ] Pattern Report: Email opens mailto client
- [ ] Pattern Report: Reset clears state and returns to console
- [ ] Dependency message in Stage 02 says "Context" not "Intake"

---

## Known Limitations in v0.4

- Question selector only parses numbered/bulleted lines — if AI generates questions in a different format, dropdown may be empty (textarea still functional)
- "Start another pilot" navigates to console (no new pilot creation yet — v0.6)
- No toast/confirmation on copy success (v0.5)
- Stepper labels not clickable (navigation via Sidebar + Prev/Next only)
