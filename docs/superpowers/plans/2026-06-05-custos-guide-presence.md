# v0.5 Custos Guide Presence — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Custos — a persistent floating guide presence — to the Valour landing page and console, with stage-aware guidance and quick actions, without modifying any existing service, data, or component files except App.tsx.

**Architecture:** Single new `CustosPanel.tsx` component mounted via `App.tsx` in both the landing and console render paths. CSS additions in `app.css`. Custos reads `stage.guidance` from the existing `PilotStage` type — no new data structures. AI quick actions call `/api/ai` directly with a POST fetch (same pattern as `callAgent` in `aiService.ts`) and show a preview panel before applying.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, pure CSS variables, no new dependencies.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `app/src/styles/app.css` | Add Custos CSS classes + minor softening tweaks |
| Create | `app/src/components/CustosPanel.tsx` | Full Custos component |
| Modify | `app/src/App.tsx` | Mount CustosPanel in landing + console paths |
| Create | `docs/56-valour-v05-custos-release.md` | Release documentation |

---

## Task 1: Add Custos CSS to app.css

**Files:**
- Modify: `app/src/styles/app.css` (append after the final `@media print` block, and update 3 existing rules)

- [ ] **Step 1: Apply softening tweaks to three existing rules**

In `app/src/styles/app.css`, find and update these existing declarations:

Find `.main {` and change `gap: 16px;` → `gap: 24px;` and `padding: 24px;` → `padding: 28px;`

Find `.workspace {` and change `padding: 22px;` → `padding: 28px;`

Find `.ws-guidance-item:nth-child(odd) {` and change `background: rgba(14,24,37,.8);` → `background: rgba(14,24,37,.45);`

Find `.ws-desc  {` and change `max-width: 560px;` → `max-width: 600px;`

- [ ] **Step 2: Append Custos CSS block at end of app.css**

Add this entire block at the very end of `app/src/styles/app.css`:

```css
/* ══════════════════════════════════════════
   CUSTOS GUIDE PRESENCE (v0.5)
   ══════════════════════════════════════════ */

.custos-trigger {
  position: fixed;
  bottom: 28px;
  right: 24px;
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px 8px 12px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: var(--shadow-md);
  transition: border-color .15s, color .15s, box-shadow .15s;
  letter-spacing: .04em;
}
.custos-trigger:hover {
  border-color: rgba(232,99,10,.4);
  color: var(--accent);
}
.custos-trigger-open {
  border-color: rgba(232,99,10,.4);
  color: var(--accent);
  box-shadow: 0 0 0 3px rgba(232,99,10,.1), var(--shadow-md);
}
.custos-trigger-icon {
  color: var(--accent);
  font-size: 13px;
  line-height: 1;
}

.custos-panel {
  position: fixed;
  bottom: 76px;
  right: 24px;
  z-index: 9001;
  width: 320px;
  max-height: 540px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-md), 0 8px 32px rgba(15,23,42,.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: custos-appear .15s ease-out;
}

@keyframes custos-appear {
  from { opacity: 0; transform: translateY(10px) scale(.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

.custos-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 14px 11px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.custos-header-label {
  color: var(--accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .2em;
  text-transform: uppercase;
  flex: 1;
}
.custos-back-btn {
  background: none;
  border: none;
  color: var(--text-dim);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: inherit;
  transition: color .12s;
}
.custos-back-btn:hover { color: var(--accent); }
.custos-close-btn {
  background: none;
  border: none;
  color: var(--text-faint);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  font-family: inherit;
  transition: color .12s;
}
.custos-close-btn:hover { color: var(--text); }

.custos-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.custos-section { display: flex; flex-direction: column; gap: 4px; }
.custos-section-label {
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  display: block;
}
.custos-section-value {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.65;
  margin: 0;
}

.custos-landing-para {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
}

.custos-quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 10px 14px 14px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.custos-qa-btn {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  line-height: 1.35;
  transition: border-color .12s, color .12s;
}
.custos-qa-btn:hover { border-color: var(--accent); color: var(--accent); }
.custos-qa-btn-ai { border-color: rgba(232,99,10,.18); }
.custos-qa-btn-ai:hover { background: rgba(232,99,10,.04); }

.custos-preview { display: flex; flex-direction: column; gap: 10px; }
.custos-preview-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
  font-size: 12px;
  padding: 8px 0;
}
.custos-preview-content {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.65;
  max-height: 240px;
  overflow-y: auto;
  white-space: pre-wrap;
  scrollbar-width: thin;
}
.custos-preview-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.custos-apply-btn { padding: 6px 14px; font-size: 11px; }
```

- [ ] **Step 3: Verify build**

```bash
cd app && npm run build
```

Expected: successful build, zero TypeScript errors, zero warnings about CSS.

- [ ] **Step 4: Commit**

```bash
git add app/src/styles/app.css
git commit -m "style: add Custos CSS, minor whitespace softening"
```

---

## Task 2: Create CustosPanel component

**Files:**
- Create: `app/src/components/CustosPanel.tsx`

- [ ] **Step 1: Create the file with the complete component**

Create `app/src/components/CustosPanel.tsx` with the following content:

```tsx
import { useState, useEffect } from 'react';
import type { PilotStage, PilotStateEntry } from '../data/types';

type CustosPanelProps = {
  page: 'landing' | 'console';
  activeStage?: PilotStage;
  activeEntry?: PilotStateEntry;
  onApplyOutput?: (content: string) => void;
};

type ActiveView = 'guide' | 'quick-result';

const STAGE_TIPS: Record<string, string> = {
  'stage-01-intake':
    'Be specific about the situation. Include the room: who is in it, what decision they need to make, and what success looks like for you.',
  'stage-02-scenario':
    'Review the scenario variant and fit score. If the variant feels off, note what is different — this will improve your preparation brief.',
  'stage-03-prep':
    'Read the brief as if you were walking into the room. Does the key message land in one sentence? If not, simplify it.',
  'stage-04-rehearsal':
    'Answer as if the clock is running. Aim for 90 seconds. Do not edit — record your first instinct, then move to Stage 05 to refine.',
  'stage-05-language':
    'Look for answers that start with technical context rather than the decision. Those are the ones to reframe.',
  'stage-06-review':
    'Be honest about what felt uncomfortable. The after-action review is more useful when it names a real pattern, not just what went well.',
  'stage-07-pattern':
    'Your pattern report is a coaching artefact. Read it before your next real conversation — even a 2-minute review helps.',
};

const DEFAULT_TIP =
  'Work through this stage at your own pace. Valour saves your progress automatically.';

export function CustosPanel({ page, activeStage, activeEntry, onApplyOutput }: CustosPanelProps) {
  const [isOpen, setIsOpen]                       = useState(false);
  const [activeView, setActiveView]               = useState<ActiveView>('guide');
  const [quickActionLabel, setQuickActionLabel]   = useState('');
  const [quickActionResult, setQuickActionResult] = useState('');
  const [quickActionLoading, setQuickActionLoading] = useState(false);

  // Reset to guide when stage changes so stale quick-result is never shown
  useEffect(() => {
    setActiveView('guide');
  }, [activeStage?.id]);

  const hasOutput = !!activeEntry?.output?.content;
  const guidance  = activeStage?.guidance;

  // ── Trigger ─────────────────────────────────────────────────────────────────

  function toggleOpen() {
    setIsOpen(prev => {
      if (prev) {
        setActiveView('guide');
        return false;
      }
      return true;
    });
  }

  function close() {
    setIsOpen(false);
    setActiveView('guide');
  }

  // ── Static quick actions ─────────────────────────────────────────────────────

  function showResult(label: string, text: string) {
    setQuickActionLabel(label);
    setQuickActionResult(text);
    setQuickActionLoading(false);
    setActiveView('quick-result');
    if (!isOpen) setIsOpen(true);
  }

  function handleWhatNext() {
    showResult('Recommended next', guidance?.next ?? DEFAULT_TIP);
  }

  function handleExplain() {
    showResult('This stage', guidance?.what ?? DEFAULT_TIP);
  }

  function handleHelpAnswer() {
    const tip = activeStage ? (STAGE_TIPS[activeStage.id] ?? DEFAULT_TIP) : DEFAULT_TIP;
    showResult('Guidance', tip);
  }

  // ── AI quick actions ─────────────────────────────────────────────────────────

  async function handleAiAction(type: 'executive' | 'shorter') {
    if (!activeEntry?.output?.content) return;

    const label   = type === 'executive' ? 'More executive' : 'Shorter';
    const content = activeEntry.output.content;
    const userInput = type === 'executive'
      ? `Rewrite the following in a shorter, more executive tone suitable for a CxO audience. Lead with the decision or outcome. Remove technical detail. Maximum 200 words.\n\n${content}`
      : `Shorten the following to roughly 50% of its current length while preserving all key points. Do not add new content. Return only the shortened text.\n\n${content}`;

    setQuickActionLabel(label);
    setQuickActionResult('');
    setQuickActionLoading(true);
    setActiveView('quick-result');
    if (!isOpen) setIsOpen(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: type === 'executive' ? 'custos-executive' : 'custos-shorter',
          context: {
            pilotId: 'custos',
            scenarioTitle: activeStage?.label ?? '',
            scenarioDescription: activeStage?.description ?? '',
            previousOutputs: {},
            userInput,
          },
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (res.ok) {
        const data = await res.json() as { content?: string; source?: string };
        if (data.content && data.source !== 'local') {
          setQuickActionResult(data.content);
          setQuickActionLoading(false);
          return;
        }
      }
    } catch { /* fall through to local message */ }

    setQuickActionResult(
      'An AI provider is not configured. Set an Anthropic API key to use this quick action.'
    );
    setQuickActionLoading(false);
  }

  function handleApply() {
    if (quickActionResult && onApplyOutput) {
      onApplyOutput(quickActionResult);
      setActiveView('guide');
    }
  }

  function handleDismiss() {
    setActiveView('guide');
    setQuickActionResult('');
  }

  // ── Renderers ────────────────────────────────────────────────────────────────

  function renderLandingBody() {
    return (
      <div className="custos-body">
        <p className="custos-landing-para">
          Valour is an AI-guided rehearsal system for architecture leaders.
          It helps you prepare for the conversations that determine whether others
          trust your recommendations — review boards, executive briefings,
          stakeholder workshops, and delivery conflicts.
        </p>
        <p className="custos-landing-para">
          It is built for enterprise architects, solution architects, and technical
          leaders who need to communicate clearly at the leadership level, not just
          produce good work.
        </p>
        <p className="custos-landing-para">
          Start by describing your situation in Stage 01 — your role and the real
          conversation you are preparing for. Valour selects a scenario, builds a
          preparation brief, generates rehearsal questions, and refines your language.
          You leave with a pattern report you keep.
        </p>
      </div>
    );
  }

  function renderGuideBody() {
    if (!guidance) {
      return (
        <div className="custos-body">
          <p className="custos-landing-para">{DEFAULT_TIP}</p>
        </div>
      );
    }
    return (
      <div className="custos-body">
        <div className="custos-section">
          <span className="custos-section-label">This stage</span>
          <p className="custos-section-value">{guidance.what}</p>
        </div>
        <div className="custos-section">
          <span className="custos-section-label">You provide</span>
          <p className="custos-section-value">{guidance.provides}</p>
        </div>
        <div className="custos-section">
          <span className="custos-section-label">Valour generates</span>
          <p className="custos-section-value">{guidance.generates}</p>
        </div>
        <div className="custos-section">
          <span className="custos-section-label">Recommended next</span>
          <p className="custos-section-value">{guidance.next}</p>
        </div>
      </div>
    );
  }

  function renderQuickResult() {
    const isProviderError = quickActionResult.startsWith('An AI provider');
    return (
      <div className="custos-body">
        <div className="custos-preview">
          <span className="custos-section-label">{quickActionLabel}</span>
          {quickActionLoading ? (
            <div className="custos-preview-loading">
              <div className="ws-generating-spinner" />
              <span>Generating…</span>
            </div>
          ) : (
            <>
              <div className="custos-preview-content">{quickActionResult}</div>
              {!isProviderError && onApplyOutput && (
                <div className="custos-preview-actions">
                  <button className="btn btn-primary custos-apply-btn" onClick={handleApply}>
                    Apply to stage
                  </button>
                  <button className="btn btn-ghost custos-apply-btn" onClick={handleDismiss}>
                    Dismiss
                  </button>
                </div>
              )}
              {isProviderError && (
                <button className="btn btn-ghost custos-apply-btn" onClick={handleDismiss}>
                  Dismiss
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  function renderQuickActions() {
    if (page !== 'console') return null;
    return (
      <div className="custos-quick-actions">
        <button className="custos-qa-btn" onClick={handleWhatNext}>
          What should I do next?
        </button>
        <button className="custos-qa-btn" onClick={handleExplain}>
          Explain this stage
        </button>
        <button className="custos-qa-btn" onClick={handleHelpAnswer}>
          Help me answer this
        </button>
        {hasOutput && (
          <>
            <button className="custos-qa-btn custos-qa-btn-ai" onClick={() => handleAiAction('executive')}>
              Make this more executive
            </button>
            <button className="custos-qa-btn custos-qa-btn-ai" onClick={() => handleAiAction('shorter')}>
              Make this shorter
            </button>
          </>
        )}
      </div>
    );
  }

  const bodyContent =
    activeView === 'quick-result'
      ? renderQuickResult()
      : page === 'landing'
        ? renderLandingBody()
        : renderGuideBody();

  return (
    <>
      <button
        className={`custos-trigger${isOpen ? ' custos-trigger-open' : ''}`}
        onClick={toggleOpen}
        aria-label="Open Custos guide"
      >
        <span className="custos-trigger-icon">◈</span>
        <span>Custos</span>
      </button>

      {isOpen && (
        <div className="custos-panel" role="complementary" aria-label="Custos guide panel">
          <div className="custos-header">
            <span className="custos-header-label">Custos</span>
            {activeView === 'quick-result' && !quickActionLoading && (
              <button className="custos-back-btn" onClick={() => setActiveView('guide')}>
                ← Guide
              </button>
            )}
            <button className="custos-close-btn" onClick={close} aria-label="Close Custos">
              ×
            </button>
          </div>

          {bodyContent}

          {activeView === 'guide' && renderQuickActions()}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd app && npm run build
```

Expected: clean build, no errors, no warnings.

- [ ] **Step 3: Commit**

```bash
git add app/src/components/CustosPanel.tsx
git commit -m "feat: add CustosPanel component — floating guide presence"
```

---

## Task 3: Mount CustosPanel in App.tsx

**Files:**
- Modify: `app/src/App.tsx`

- [ ] **Step 1: Add import**

At the top of `app/src/App.tsx`, add this import after the existing component imports:

```tsx
import { CustosPanel } from './components/CustosPanel';
```

- [ ] **Step 2: Mount on landing path**

Find this block in `App.tsx`:

```tsx
  if (page === 'landing') {
    return (
      <LandingPage
        onEnterConsole={nav('#console')}
        onJoinPilot={nav('#console')}
        onViewScenarios={nav('#scenarios')}
      />
    );
  }
```

Replace with:

```tsx
  if (page === 'landing') {
    return (
      <>
        <LandingPage
          onEnterConsole={nav('#console')}
          onJoinPilot={nav('#console')}
          onViewScenarios={nav('#scenarios')}
        />
        <CustosPanel page="landing" />
      </>
    );
  }
```

- [ ] **Step 3: Mount in Console component**

Find the `return (` at the bottom of the `Console` function (the one that opens with `<div className="shell">`):

```tsx
  return (
    <div className="shell">
      <TopBar
```

Replace the entire return statement with:

```tsx
  return (
    <>
      <div className="shell">
        <TopBar
          pilot={{ ...pilot, stages: liveStages }}
          onViewPattern={onViewPattern}
          onViewReadiness={() => { window.location.hash = '#readiness'; }}
          onViewComparison={() => { window.location.hash = '#comparison'; }}
        />
        <div className="body">
          <Sidebar
            stages={liveStages}
            pilotId={pilot.id}
            scenario={pilot.scenario}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            allPilots={ALL_PILOTS.map(p => ({ id: p.id, title: p.title.replace('Pilot ', 'P').split(':')[0].trim(), status: p.status }))}
            onSwitchPilot={switchPilot}
          />
          <main className="main">
            <div className="console-provider-row">
              <ProviderBadge />
            </div>
            <StageWorkspace
              stage={activeStage}
              entry={activeEntry}
              index={activeIndex}
              total={pilot.stages.length}
              hasAgent={activeStage.id in STAGE_AGENTS}
              dependency={dependency}
              completedStageIds={completedStageIds}
              rehearsalAnswer={rehearsalAnswer}
              onGenerate={handleGenerate}
              onSaveOutput={handleSaveOutput}
              onSaveUserInput={(input) => setUserInput(activeStage.id, input)}
              onCycleStatus={handleCycleStatus}
              onPrev={() => setActiveIndex(i => Math.max(0, i - 1))}
              onNext={() => setActiveIndex(i => Math.min(pilot.stages.length - 1, i + 1))}
            />
            <div className="bottom-row">
              <EvidencePanel evidence={pilot.evidence} />
              <ProductDecisionPanel decision={pilot.productDecision} />
            </div>
            <AgentLogPanel log={state.runLog ?? []} />
            <ExportPanel pilot={pilot} state={state} onReset={resetPilot} />
          </main>
        </div>
      </div>
      <CustosPanel
        page="console"
        activeStage={activeStage}
        activeEntry={activeEntry}
        onApplyOutput={(content) =>
          setOutput(activeStage.id, {
            content,
            source: 'manual',
            generatedAt: new Date().toISOString(),
          })
        }
      />
    </>
  );
```

- [ ] **Step 4: Verify TypeScript**

```bash
cd app && npm run build
```

Expected: clean build. Verify that `CustosPanel` import resolves and both mounting points compile without type errors.

- [ ] **Step 5: Commit**

```bash
git add app/src/App.tsx
git commit -m "feat: mount CustosPanel on landing and console"
```

---

## Task 4: Write release documentation

**Files:**
- Create: `docs/56-valour-v05-custos-release.md`

- [ ] **Step 1: Create the release doc**

Create `docs/56-valour-v05-custos-release.md`:

```markdown
# Valour v0.5 Custos — Release Notes

> © 2026 The OrdoAnimi Group. Proprietary and confidential. All rights reserved.

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
- **Console mode:** Stage-aware guidance drawn from `stage.guidance` — what the stage does, what the user provides, what Valour generates, and the recommended next action.

**Quick actions (console only):**
- "What should I do next?" — renders `stage.guidance.next`
- "Explain this stage" — renders `stage.guidance.what`
- "Help me answer this" — per-stage coaching tip (static, no API required)
- "Make this more executive" — visible only when stage output exists; calls AI provider; shows preview before applying
- "Make this shorter" — visible only when stage output exists; calls AI provider; shows preview before applying

The AI quick actions show a preview panel — the user must click "Apply to stage" to overwrite the stage output. Dismissing discards the suggestion. If no AI provider is configured, a clear message is shown instead of a silent failure.

### CSS additions

New `.custos-*` CSS classes in `app/src/styles/app.css`. No existing class names changed.

Minor whitespace softening:
- Console main area: more vertical gap between panels
- Stage workspace: increased padding
- Stage guidance dark items: lighter background
- Stage description: wider max-width

### App.tsx

`CustosPanel` mounted in two places:
- Landing page render path (no props beyond `page="landing"`)
- Console render path (receives `activeStage`, `activeEntry`, `onApplyOutput`)

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
2. Confirm "Custos" pill appears bottom-right.
3. Click it → Custos panel opens with landing explanation prose.
4. Click "Enter VALOUR™ →" → lands on console (Stage 01).
5. Confirm Custos trigger still visible. Click it → panel shows Stage 01 guidance.
6. Click "Explain this stage" → result appears in panel.
7. Click "← Guide" → returns to guidance view.
8. Navigate to Stage 02 → Custos guidance updates to Stage 02 content.
9. Generate output for any stage → "Make this more executive" and "Make this shorter" appear.
10. Click one → loading spinner shows, then suggested text appears.
11. Click "Apply to stage" → stage output updates. Verify it shows as source: manual.
12. Click "Dismiss" instead → stage output unchanged.
13. Verify all v0.4 features still work: rehearsal answer input, Stage 05 gate, pattern report actions, export, print, localStorage persistence.

---

## Known issues

- On very small viewports (< 360px wide), the Custos panel may overflow horizontally. Not addressed in v0.5.
- The AI quick actions ("Make this more executive", "Make this shorter") use agent names `custos-executive` and `custos-shorter`. If the server-side handler does not recognise these agent names and falls back to local generation, the local fallback returns a standard "No generator defined" message, which CustosPanel treats as an API failure and shows the provider error message. To use these actions, an Anthropic API key must be configured.
- Custos panel z-index (9001) may conflict if other fixed elements are added in future.

---

## What remains for v0.6 Exploratio

- **Custos memory:** Remember guidance already seen; skip repeated content.
- **Custos-initiated prompts:** Contextual nudges at key stage transitions ("Ready to rehearse your answer?").
- **Session state:** Custos remembers if it was open when the user navigated between stages.
- **AI quick action expansion:** Multi-turn refinement — "Make it even shorter", "Try again with more empathy".
- **Stage confidence check-in:** Custos asks for a quick confidence rating after each stage.
- **Custos voice settings:** Formal / direct / coaching tone switch.
```

- [ ] **Step 2: Commit**

```bash
git add docs/56-valour-v05-custos-release.md
git commit -m "docs: add Valour v0.5 Custos release notes"
```

---

## Task 5: Final build verification

- [ ] **Step 1: Clean build**

```bash
cd app && npm run build
```

Expected output includes:
```
✓ built in X.XXs
```
No TypeScript errors. No unresolved imports.

- [ ] **Step 2: Verify file exists in build output**

```bash
ls app/dist/assets/
```

Expected: one or two JS chunk files and one CSS file. Confirm they exist.

- [ ] **Step 3: Final commit if any loose changes**

```bash
git status
```

If clean, done. If any unstaged changes, stage and commit them before pushing.

---

## Self-review notes

**Spec coverage check:**
- ✓ Floating Custos trigger on landing and console
- ✓ Landing body: plain prose, no VALOUR™ in prose
- ✓ Console body: stage-aware, reads from `stage.guidance`
- ✓ Stage change resets to guide view (`useEffect` on `activeStage?.id`)
- ✓ Quick actions: all 5 implemented
- ✓ AI quick actions: preview panel, Apply + Dismiss, no silent overwrite
- ✓ Local/provider fallback: clear error message shown
- ✓ `onApplyOutput` uses `source: 'manual'` — same path as manual edit
- ✓ CSS softening: main gap, workspace padding, guidance dark items, ws-desc width
- ✓ Release doc at `docs/56-valour-v05-custos-release.md`
- ✓ TypeScript passes at each task
- ✓ No new dependencies added
- ✓ No changes to services, data files, or other components
