# Valour v0.5 Custos — Release Notes

> © 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.

Release: v0.5 Custos
Date: 2026-06-05
Repo: ordo-animi
Deployment: https://www.ordoanimi.com/

---

## What Custos is

Custos is a persistent guide presence inside Valour. It is not a chatbot. It is a calm architecture leadership guide that surfaces contextual help at the right moment — on the landing page and at every stage of the console workflow.

The name is drawn from the Ordo Animi system: Custos is the watchful keeper, the guide that stays present without being intrusive.

---

## What changed in v0.5

### CustosPanel component (`app/src/components/CustosPanel.tsx`)

A new floating guide presence mounted on both the landing page and the console.

**Collapsed state:** A pill trigger fixed at bottom-right of the viewport, labelled "Custos". Visible but unobtrusive.

**Expanded state:** A 320px card above the trigger. Contains:

- **Landing mode:** Three paragraphs of plain prose explaining what Valour does, who it is for, and what the user should do first.
- **Console mode:** Stage-aware guidance drawn from `stage.guidance` — what the stage does, what the user provides, what Valour generates, and the recommended next action. Updates automatically when the user navigates between stages.

**Quick actions (console only):**
- "What should I do next?" — renders `stage.guidance.next` (no API required)
- "Explain this stage" — renders `stage.guidance.what` (no API required)
- "Help me answer this" — per-stage coaching tip, static (no API required)
- "Make this more executive" — visible only when stage output exists; calls AI provider; shows preview before applying
- "Make this shorter" — visible only when stage output exists; calls AI provider; shows preview before applying

The AI quick actions show a preview panel — the user must click "Apply to stage" to overwrite the stage output. Dismissing discards the suggestion without touching saved state. If no AI provider is configured, a clear message is shown instead of a silent failure.

### App.tsx changes

`CustosPanel` mounted in two places:
- Landing page render path — `page="landing"`, no other props
- Console render path — receives `activeStage`, `activeEntry`, and `onApplyOutput`

`onApplyOutput` calls `setOutput` with `source: 'manual'` — same path used by the existing manual edit flow in StageWorkspace.

### CSS additions (`app/src/styles/app.css`)

New `.custos-*` CSS classes appended at end of file. No existing class names changed.

Minor whitespace softening to existing classes:
- `.main` — gap `16px → 24px`, padding `24px → 28px`
- `.workspace` — padding `22px → 28px`
- `.ws-guidance-item:nth-child(odd)` — background `rgba(14,24,37,.8) → rgba(14,24,37,.45)`
- `.ws-desc` — max-width `560px → 600px`

---

## What was intentionally excluded

| Item | Reason |
|------|--------|
| Database / auth / payments | Out of scope for v0.5 |
| Formspree | Removed in v0.4, not reintroduced |
| New external integrations | None added |
| Changes to any service file | `aiService.ts`, `agents.ts`, `localGenerator.ts` untouched |
| Changes to any data file | `pilot-001.ts`, `pilot-002.ts`, `types.ts`, `scenarios.ts` untouched |
| Changes to other components | All existing components untouched except mounting point in `App.tsx` |
| Cross-repo changes | None |
| Private doctrine | None exposed publicly |
| Custos "memory" across sessions | Planned for v0.6 |
| Custos-initiated prompts | Planned for v0.6 |

---

## How to test live

1. Open https://www.ordoanimi.com/
2. Confirm "Custos" pill appears bottom-right of the page.
3. Click it → panel opens with landing explanation in plain prose.
4. Click "Enter VALOUR™ →" on the landing page → lands on console (Stage 01).
5. Confirm Custos trigger still visible. Click it → panel shows Stage 01 guidance.
6. Click "Explain this stage" → result appears; click "← Guide" to return.
7. Click "What should I do next?" → shows recommended next action for Stage 01.
8. Click "Help me answer this" → shows per-stage coaching tip.
9. Navigate to Stage 02 → close and reopen Custos → guidance updates to Stage 02 content.
10. Generate output for any stage → "Make this more executive" and "Make this shorter" appear in quick actions.
11. Click one → loading spinner shows, then suggested text appears in preview panel.
12. Click "Apply to stage" → stage output updates with `source: manual`. Verify it shows correctly.
13. Click "Dismiss" instead → stage output unchanged from before.
14. Verify all v0.4 features still work:
    - Rehearsal answer input (Stage 04)
    - Stage 05 dependency gate (requires saved rehearsal answer)
    - Pattern report actions (export, print)
    - Export panel
    - localStorage persistence (refresh page, data persists)
    - Anthropic provider path (if API key configured)
    - Local fallback path (if no API key)

---

## Known issues

- On very small viewports (< 360px wide), the Custos panel may overflow horizontally. Not addressed in v0.5.
- The AI quick actions use agent names `custos-executive` and `custos-shorter` posted to `/api/ai`. If the server-side handler does not recognise these names and falls back to the local generator, the response will have `source: 'local'` and CustosPanel treats this as an API failure, showing the provider error message. To use these actions, an Anthropic API key must be configured on the deployment.
- Custos panel z-index (9001) may conflict if other fixed elements are added in future versions.

---

## What remains for v0.6 Exploratio

- **Custos memory:** Remember guidance already seen; surface fresh content on repeat visits to the same stage.
- **Custos-initiated prompts:** Contextual nudges at key stage transitions ("Ready to rehearse your answer?").
- **Session persistence:** Custos remembers whether it was open when the user navigated away.
- **AI quick action chaining:** Multi-turn refinement ("Make it even shorter", "Try again with more empathy").
- **Stage confidence check-in:** Custos requests a quick confidence rating after each stage completes.
- **Custos voice settings:** Formal / direct / coaching tone preference.
