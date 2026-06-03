# VALOUR™ Agentic POC — v0.3 Release

> © 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.

Version: 0.3
Status: POC — live on Vercel
Date: 2026-06-03
URL: https://www.ordoanimi.com

---

## What is v0.3

VALOUR™ Pilot Console v0.3 is a working agentic AI copilot running on Vercel. It guides an architecture leader through the full VALOUR™ loop — preparation, rehearsal, language refinement, after-action review, and pattern report — with real AI generation backed by Claude (Anthropic) or GPT-4o-mini (OpenAI), or a deterministic local fallback when no key is set.

---

## How to use it

1. Open **https://www.ordoanimi.com**
2. Click **Enter pilot console** or navigate to `/#console`
3. Go to **Stage 01 — Intake** and fill in your role, situation, and desired outcome. Save.
4. Click through each stage. Use **Generate with VALOUR™** to generate AI output.
5. Edit any output. Stage status cycles: not-started → draft → complete → to-confirm.
6. Navigate to **Stage 07 — Pattern Summary** and generate your pattern report.
7. Click **Pattern →** in the topbar to view the full pattern report (rendered from live state).
8. Export as JSON or Markdown using the Export panel at the bottom.
9. Print or save as PDF from the Pattern Report page.

---

## Architecture

### Frontend (Vite + React + TypeScript)
- Hash-based routing: `/#console`, `/#pattern`, `/#scenarios`, `/#readiness`
- All pilot state in `localStorage` — no backend, no database, no auth required
- Fully functional without an AI key (local fallback)

### Server-side AI proxy (`app/api/ai.ts`)
- Vercel Edge Function — API keys never leave the server
- GET `/api/ai` → `{ provider, model }` — used by ProviderBadge for status display
- POST `/api/ai` → `{ source, content, model, provider, durationMs }` — called per stage generation
- Supports Anthropic (Claude Haiku) and OpenAI (GPT-4o-mini)
- Falls back to local signal if no key, provider unreachable, or request errors

### Agent functions (`app/src/services/agents.ts`)
Each agent is a typed async function:
- `scenarioSelectorAgent` — rationale for scenario fit
- `preparationAgent` — structured preparation brief
- `rehearsalAgent` — 4 realistic practice questions
- `languageRefinementAgent` — 4 versions of user's rehearsal answer
- `afterActionReviewAgent` — structured post-session review
- `patternReportAgent` — full leadership pattern report (renders to live PatternPage)
- `vallumHandoverAgent` — pilot completion + VITA™ handover

Context is carried forward: every agent receives all previous stage outputs plus intake data.

### Local fallback (`app/src/services/localGenerator.ts`)
When no AI key is configured, the local generator produces quality markdown outputs using VALOUR™ scenario templates. Clearly indicated as "Local fallback" in the console.

---

## Required Vercel environment variables

| Variable | Required | Description |
|---|---|---|
| `AI_PROVIDER` | Yes (if using AI) | `anthropic` or `openai` |
| `ANTHROPIC_API_KEY` | If anthropic | Your Anthropic API key |
| `OPENAI_API_KEY` | If openai | Your OpenAI API key |

Without any vars: console works in Local fallback mode.

### Setting env vars on Vercel
1. Vercel dashboard → your project → **Settings → Environment Variables**
2. Add `AI_PROVIDER = anthropic`
3. Add `ANTHROPIC_API_KEY = sk-ant-...`
4. Redeploy (or push a new commit)

---

## How to test on the live site

### Without AI key (local mode)
1. Open `https://www.ordoanimi.com/#console`
2. Check provider badge shows "Local fallback"
3. Stage 01: enter role and situation, save
4. Stage 02: click Generate — VALOUR™ template output appears immediately
5. Continue through all 8 stages

### With ANTHROPIC_API_KEY set
1. Set env vars in Vercel, redeploy
2. Open `/#console` — provider badge shows "Anthropic · Claude"
3. Stage 01: enter your real situation (or test context)
4. Stage 02 onwards: click Generate — real Claude-generated content appears
5. Stage 07 pattern report → click Pattern → in topbar → see AI-generated report
6. Export → download Markdown report

### Stage dependency validation
- Stage 05 (Language Refinement) will warn if no rehearsal answer exists
- Stage 06 onwards will warn if earlier stages have no output
- Warning clears when prerequisite is met

---

## Files changed in v0.3

| File | Change |
|---|---|
| `app/api/ai.ts` | Full rewrite: edge-safe response helpers, GET for status, better prompts per agent with full context forwarding, error logging |
| `app/src/data/types.ts` | Added AgentLogEntry, IntakeData, runLog to PilotState, provider/durationMs to StageOutput |
| `app/src/services/aiService.ts` | Provider caching, timing, full response including provider info |
| `app/src/services/agents.ts` | Dependency validation, intake JSON parsing, log entries, all agents return {output, logEntry} |
| `app/src/hooks/usePilotState.ts` | Added appendLog, runLog persistence, IntakeData type |
| `app/src/components/StageWorkspace.tsx` | Dependency warning, provider display per output, improved intake form, better markdown renderer |
| `app/src/components/PatternPage.tsx` | liveContent prop — shows AI-generated pattern from state instead of static seed |
| `app/src/components/ProviderBadge.tsx` | New — fetches and displays AI provider mode |
| `app/src/components/AgentLogPanel.tsx` | New — collapsible run log showing agent, provider, model, duration per generation |
| `app/src/App.tsx` | Removed IntakeForm standalone route, live pattern content from localStorage, ProviderBadge, AgentLogPanel wired |
| `app/src/styles/app.css` | Provider badge, dependency warning, agent log, live pattern content, output meta styles |
| `docs/47-valour-agentic-poc-v0.3-release.md` | This document |

---

## What works now (v0.3)

- Full VALOUR™ loop end-to-end on the live site
- Real AI generation when ANTHROPIC_API_KEY is set in Vercel
- Local fallback when no key — console always works
- Provider mode badge visible in the console (Anthropic · Claude / Local fallback)
- Agent run log showing which agent, provider, model, and time for each generation
- Stage dependency validation (blocks generation if prerequisites not met)
- Context carries forward: preparation output informs rehearsal, rehearsal answer informs language refinement, all outputs inform pattern report
- Pattern report page shows AI-generated content from stage-07 (not static seed data)
- Export JSON and Markdown
- Print/PDF pattern report
- State persists across page reloads
- Reset pilot clears all state

---

## What remains for v0.4

1. **Confidence before/after delta** — capture ending confidence in Stage 08 and display it alongside the starting score
2. **Multi-run support** — start a new pilot run without losing previous run data; archive completed runs
3. **Pilot 002 full population** — executive briefing scenario with real prompts and context
4. **Batch generation** — "Generate all stages" button that runs the full loop automatically
5. **Streaming responses** — stream Claude tokens to the UI for faster perceived generation
6. **Session sharing** — shareable read-only URL for a completed pilot run (would need a KV store or Supabase)
7. **Team mode** — multiple users on the same pilot run
8. **Custom scenario** — allow users to define a scenario outside the 10 presets
