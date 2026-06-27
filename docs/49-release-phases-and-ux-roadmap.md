# VALOUR™ Release Phases and UX Roadmap

**Product:** VALOUR™ for Architecture Leadership  
**Owner:** The OrdoAnimi Group  
**Last updated:** 2026-06-03

---

## Release History

| Version | Name | Status | Key capability |
|---------|------|--------|----------------|
| v0.1 | Console foundation | shipped | Hash routing, sidebar, stage cards |
| v0.2 | Agentic workflow | shipped | AI agents per stage, localStorage state |
| v0.3 | Agentic AI POC | shipped | Full 8-stage agent loop, pattern report page |
| v0.4 | Guided copilot UX | in progress | Stage guidance, rehearsal panel, stepper, export actions |
| v0.5 | Smart report/export | planned | Enhanced report, sharing, email delivery |
| v0.6 | Pilot run management | planned | New pilot creation, pilot history, pilot switching |
| v0.7 | Smarter agent state | planned | Context persistence, agent memory, multi-scenario |
| v0.8 | Founder demo readiness | planned | Polish, testimonial capture, demo mode |

---

## v0.4 — Guided Copilot UX

**Theme:** First-time user can self-navigate without explanation.

**Capabilities shipped:**
- Stage guidance panel (what / provides / generates / next) on every stage
- Visible 7-step workflow stepper (Context → Report)
- Rehearsal answer panel always visible in Stage 04 with question selector
- Language refinement gate — blocked until rehearsal answer exists
- Pattern Report action bar: copy, markdown, JSON, print, email, start new, reset
- "Intake" renamed "Context" in all user-facing text

**Acceptance criteria:**
- Rehearsal answer entry + save works without generating AI first
- Stage 05 blocks generation with exact spec message when no answer
- Pattern Report feels like the destination
- No Formspree dependency
- localStorage persistence across page refresh
- Vercel deploy succeeds

---

## v0.5 — Smart Report/Export Actions

**Theme:** Pattern Report is a shareable deliverable.

**Planned capabilities:**
- Copy-to-clipboard confirmation toast
- Report permalink / share link
- Email delivery via mailto with formatted body
- PDF export via browser print stylesheet improvements
- Report versioning (track regeneration)

---

## v0.6 — Pilot Run Management

**Theme:** Users can run multiple pilot sessions and compare results.

**Planned capabilities:**
- New pilot creation flow (guided intake wizard)
- Pilot history list
- Pilot status management (active / archived)
- Cross-pilot pattern comparison (basic)

---

## v0.7 — Smarter Agent State/Context

**Theme:** Agents use richer context and produce better outputs.

**Planned capabilities:**
- Agent context includes all prior stage outputs by default
- User can flag preferred language variants
- Multi-scenario support (pick from scenario library)
- Context persistence across sessions

---

## v0.8 — Founder Demo Readiness

**Theme:** Live demo to founder-selected early adopters.

**Planned capabilities:**
- Demo mode (pre-populated state, no API key needed)
- Testimonial / NPS capture widget
- Onboarding flow for first-time users
- Mobile layout polish
