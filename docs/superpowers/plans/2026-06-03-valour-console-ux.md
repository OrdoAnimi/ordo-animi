# VALOUR™ Console UX & Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace warm amber stacked layout with azure sidebar-navigator console — distinct palette, reduced information density, one stage in focus at a time.

**Architecture:** Full CSS rewrite with azure palette tokens. App.tsx gains `activeStageIndex` state. PilotHeader/PilotStageTimeline/PilotStageCard replaced by TopBar/Sidebar/StageDetail. EvidencePanel and ProductDecisionPanel restyled. ArtifactViewer and OperatorNotes removed from App (not shown in approved design).

**Tech Stack:** React 18, TypeScript, Vite, plain CSS custom properties.

---

### Task 1: Rewrite app.css — azure palette + sidebar layout

**Files:**
- Modify: `app/src/styles/app.css`

- [ ] **Replace entire contents of `app/src/styles/app.css`:**

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: #e2f0ff;
  background: #07111e;

  --bg:             #07111e;
  --surface:        #0e1825;
  --surface-raised: #162338;
  --sidebar-bg:     #0b1520;
  --border:         rgba(56,189,248,.1);
  --border-strong:  rgba(56,189,248,.25);
  --accent:         #38bdf8;
  --accent-soft:    rgba(56,189,248,.08);
  --green:          #34d399;
  --text:           #e2f0ff;
  --text-muted:     #7a9ab8;
  --text-dim:       #5a7a96;
  --text-faint:     #3d5a72;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 16px 48px;
}

/* ── Shell ─────────────────────────────── */
.shell {
  width: min(1200px, 100%);
  border: 1px solid rgba(56,189,248,.12);
  border-radius: 18px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: 0 32px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(56,189,248,.06);
}

/* ── Top bar ────────────────────────────── */
.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
  background: var(--sidebar-bg);
  border-bottom: 1px solid var(--border);
  min-height: 52px;
}
.topbar-logo {
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .22em;
  text-transform: uppercase;
  flex-shrink: 0;
}
.topbar-divider {
  width: 1px;
  height: 18px;
  background: rgba(56,189,248,.18);
  flex-shrink: 0;
}
.topbar-title {
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.topbar-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.topbar-metric {
  display: flex;
  align-items: center;
  gap: 5px;
}
.topbar-metric-label {
  color: var(--text-dim);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.topbar-metric-value       { color: var(--text); font-size: 12px; font-weight: 700; }
.topbar-metric-value.azure { color: var(--accent); }
.topbar-metric-value.green { color: var(--green); }

/* ── Pills ──────────────────────────────── */
.pill {
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.pill-complete { background: rgba(52,211,153,.12); border: 1px solid rgba(52,211,153,.28); color: var(--green); }
.pill-azure    { background: var(--accent-soft);   border: 1px solid var(--border-strong); color: var(--accent); }
.pill-paused   { background: rgba(251,191,36,.1);  border: 1px solid rgba(251,191,36,.25); color: #fbbf24; }

/* ── Body ───────────────────────────────── */
.body {
  display: flex;
  height: 540px;
}

/* ── Sidebar ────────────────────────────── */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.sidebar-pilot {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}
.sidebar-pilot-label {
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.sidebar-pilot-name {
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
}
.sidebar-pilot-sub {
  color: var(--text-dim);
  font-size: 11px;
  margin-top: 3px;
}
.sidebar-section-label {
  padding: 12px 16px 6px;
  color: var(--text-faint);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.stage-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  cursor: pointer;
  user-select: none;
  border-left: 2px solid transparent;
  transition: background .12s;
}
.stage-item:hover { background: rgba(56,189,248,.05); }
.stage-item.active {
  background: var(--accent-soft);
  border-left-color: var(--accent);
  padding-left: 14px;
}
.stage-item.done { opacity: .6; }
.stage-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.stage-dot.done    { background: var(--green); }
.stage-dot.active  { background: var(--accent); box-shadow: 0 0 0 3px rgba(56,189,248,.2); }
.stage-dot.pending { background: rgba(255,255,255,.12); }
.stage-num  { color: var(--text-faint); font-size: 10px; font-weight: 700; flex-shrink: 0; width: 16px; }
.stage-name { color: #c8dff0; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stage-item.active .stage-name { color: var(--text); font-weight: 600; }
.stage-item.done   .stage-name { color: var(--text-dim); }

/* ── Main ───────────────────────────────── */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
  overflow-y: auto;
}

/* ── Stage detail card ──────────────────── */
.stage-card {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
  flex-shrink: 0;
}
.stage-card-eyebrow {
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.stage-card-title {
  color: var(--text);
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}
.stage-card-desc {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.6;
  max-width: 560px;
}
.stage-badges {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.badge {
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 700;
}
.badge-evidence { background: rgba(52,211,153,.1); border: 1px solid rgba(52,211,153,.22); color: var(--green); }
.badge-missing  { background: rgba(251,191,36,.08); border: 1px solid rgba(251,191,36,.2); color: #fbbf24; }
.badge-source   { background: var(--accent-soft); border: 1px solid var(--border); color: var(--text-dim); font-family: ui-monospace, monospace; }
.stage-note {
  margin-top: 14px;
  padding: 12px 14px;
  background: rgba(56,189,248,.05);
  border-left: 2px solid rgba(56,189,248,.3);
  border-radius: 0 8px 8px 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}
.stage-actions {
  display: flex;
  gap: 8px;
  margin-top: 18px;
}
.btn {
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border-strong);
  background: var(--accent-soft);
  color: #c8dff0;
  transition: opacity .12s;
}
.btn:disabled { opacity: .3; cursor: not-allowed; }
.btn-primary  { background: var(--accent); color: var(--sidebar-bg); border-color: var(--accent); font-weight: 700; }
.btn-ghost    { background: transparent; color: var(--text-dim); border-color: var(--border); }

/* ── Bottom row ─────────────────────────── */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex-shrink: 0;
}
.info-card {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
}
.info-card-label {
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.confidence-row { display: flex; align-items: baseline; gap: 10px; }
.confidence-before { color: var(--text-dim); font-size: 28px; font-weight: 800; }
.confidence-arrow  { color: var(--accent);   font-size: 16px; }
.confidence-after  { color: var(--green);    font-size: 36px; font-weight: 800; }
.confidence-label  { color: var(--text-dim); font-size: 11px; margin-top: 6px; line-height: 1.5; }
.decision-value { color: var(--accent); font-size: 22px; font-weight: 800; text-transform: capitalize; margin-bottom: 6px; }
.decision-desc  { color: var(--text-dim); font-size: 11px; line-height: 1.5; }

@media (max-width: 900px) {
  .body { flex-direction: column; height: auto; }
  .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border); }
  .bottom-row { grid-template-columns: 1fr; }
}
```

- [ ] **Verify:** `npm run dev` in `app/` — page should show dark azure background, no layout yet (components still use old class names).

---

### Task 2: Create TopBar component (replaces PilotHeader)

**Files:**
- Create: `app/src/components/TopBar.tsx`
- Delete: `app/src/components/PilotHeader.tsx` (after App.tsx updated in Task 6)

- [ ] **Create `app/src/components/TopBar.tsx`:**

```tsx
import type { PilotRun } from '../data/types';

export function TopBar({ pilot }: { pilot: PilotRun }) {
  const isComplete = pilot.status === 'complete';
  const pillClass = isComplete ? 'pill-complete'
    : pilot.status === 'in-progress' ? 'pill-azure'
    : 'pill-paused';

  return (
    <header className="topbar">
      <span className="topbar-logo">VALOUR™</span>
      <div className="topbar-divider" />
      <span className="topbar-title">
        {pilot.id} · {pilot.scenario.replace('.', '')}
      </span>
      <div className="topbar-meta">
        {pilot.evidence.startingConfidence != null && (
          <div className="topbar-metric">
            <span className="topbar-metric-label">Confidence</span>
            <span className="topbar-metric-value azure">
              {pilot.evidence.startingConfidence} → {pilot.evidence.endingConfidence}
            </span>
          </div>
        )}
        <div className="topbar-metric">
          <span className="topbar-metric-label">Decision</span>
          <span className={`topbar-metric-value ${pilot.productDecision.decision === 'continue' ? 'green' : ''}`}>
            {pilot.productDecision.decision}
          </span>
        </div>
        <span className={`pill ${pillClass}`}>{pilot.status}</span>
      </div>
    </header>
  );
}
```

- [ ] **Commit:**
```bash
git add app/src/components/TopBar.tsx app/src/styles/app.css
git commit -m "feat(ux): azure palette + TopBar component"
```

---

### Task 3: Create Sidebar component (replaces PilotStageTimeline)

**Files:**
- Create: `app/src/components/Sidebar.tsx`
- Delete: `app/src/components/PilotStageTimeline.tsx` (after Task 6)

- [ ] **Create `app/src/components/Sidebar.tsx`:**

```tsx
import type { PilotStage } from '../data/types';

type SidebarProps = {
  stages: PilotStage[];
  pilotId: string;
  scenario: string;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function Sidebar({ stages, pilotId, scenario, activeIndex, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-pilot">
        <div className="sidebar-pilot-label">Active pilot</div>
        <div className="sidebar-pilot-name">{pilotId}</div>
        <div className="sidebar-pilot-sub">{scenario.replace('.', '')}</div>
      </div>

      <div className="sidebar-section-label">Workflow</div>

      {stages.map((stage, i) => {
        const isActive = i === activeIndex;
        const isDone = stage.status === 'complete' && !isActive;
        const dotClass = isDone ? 'done' : isActive ? 'active' : 'pending';
        const itemClass = `stage-item${isDone ? ' done' : ''}${isActive ? ' active' : ''}`;

        return (
          <div key={stage.id} className={itemClass} onClick={() => onSelect(i)}>
            <div className={`stage-dot ${dotClass}`} />
            <span className="stage-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="stage-name">{stage.label}</span>
          </div>
        );
      })}
    </aside>
  );
}
```

- [ ] **Commit:**
```bash
git add app/src/components/Sidebar.tsx
git commit -m "feat(ux): Sidebar stage navigator component"
```

---

### Task 4: Create StageDetail component (replaces PilotStageCard)

**Files:**
- Create: `app/src/components/StageDetail.tsx`
- Delete: `app/src/components/PilotStageCard.tsx` (after Task 6)

- [ ] **Create `app/src/components/StageDetail.tsx`:**

```tsx
import type { PilotStage } from '../data/types';

type StageDetailProps = {
  stage: PilotStage;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export function StageDetail({ stage, index, total, onPrev, onNext }: StageDetailProps) {
  const num = String(index + 1).padStart(2, '0');
  const tot = String(total).padStart(2, '0');

  return (
    <div className="stage-card">
      <div className="stage-card-eyebrow">Stage {num} of {tot} · {stage.label}</div>
      <div className="stage-card-title">{stage.label}</div>
      <div className="stage-card-desc">{stage.description}</div>

      <div className="stage-badges">
        <span className={`badge ${stage.evidenceCaptured ? 'badge-evidence' : 'badge-missing'}`}>
          {stage.evidenceCaptured ? 'Evidence captured' : 'Evidence missing'}
        </span>
        <span className="badge badge-source">{stage.sourceFile}</span>
      </div>

      {stage.operatorNote && (
        <div className="stage-note">{stage.operatorNote}</div>
      )}

      <div className="stage-actions">
        <button className="btn btn-ghost" onClick={onPrev} disabled={index === 0}>
          ← Prev
        </button>
        <button className="btn btn-primary" onClick={onNext} disabled={index === total - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Commit:**
```bash
git add app/src/components/StageDetail.tsx
git commit -m "feat(ux): StageDetail focused single-stage component"
```

---

### Task 5: Restyle EvidencePanel and ProductDecisionPanel

**Files:**
- Modify: `app/src/components/EvidencePanel.tsx`
- Modify: `app/src/components/ProductDecisionPanel.tsx`

- [ ] **Replace `app/src/components/EvidencePanel.tsx`:**

```tsx
import type { EvidenceSummary } from '../data/types';

export function EvidencePanel({ evidence }: { evidence: EvidenceSummary }) {
  return (
    <div className="info-card">
      <div className="info-card-label">Confidence shift</div>
      <div className="confidence-row">
        <span className="confidence-before">{evidence.startingConfidence ?? '—'}</span>
        <span className="confidence-arrow">→</span>
        <span className="confidence-after">{evidence.endingConfidence ?? '—'}</span>
      </div>
      <div className="confidence-label">{evidence.clarityImprovement}</div>
    </div>
  );
}
```

- [ ] **Replace `app/src/components/ProductDecisionPanel.tsx`:**

```tsx
import type { ProductDecision } from '../data/types';

export function ProductDecisionPanel({ decision }: { decision: ProductDecision }) {
  return (
    <div className="info-card">
      <div className="info-card-label">Product decision</div>
      <div className="decision-value">{decision.decision}</div>
      <div className="decision-desc">{decision.nextStep}</div>
    </div>
  );
}
```

- [ ] **Commit:**
```bash
git add app/src/components/EvidencePanel.tsx app/src/components/ProductDecisionPanel.tsx
git commit -m "feat(ux): restyle evidence and decision panels"
```

---

### Task 6: Rewire App.tsx — sidebar layout + active stage state

**Files:**
- Modify: `app/src/App.tsx`

- [ ] **Replace `app/src/App.tsx`:**

```tsx
import { useState } from 'react';
import { pilot001 } from './data/pilot-001';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { StageDetail } from './components/StageDetail';
import { EvidencePanel } from './components/EvidencePanel';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';

function defaultActiveIndex(): number {
  const first = pilot001.stages.findIndex(s => s.status !== 'complete');
  return first === -1 ? pilot001.stages.length - 1 : first;
}

export function App() {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  return (
    <div className="shell">
      <TopBar pilot={pilot001} />
      <div className="body">
        <Sidebar
          stages={pilot001.stages}
          pilotId={pilot001.id}
          scenario={pilot001.scenario}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
        <main className="main">
          <StageDetail
            stage={pilot001.stages[activeIndex]}
            index={activeIndex}
            total={pilot001.stages.length}
            onPrev={() => setActiveIndex(i => Math.max(0, i - 1))}
            onNext={() => setActiveIndex(i => Math.min(pilot001.stages.length - 1, i + 1))}
          />
          <div className="bottom-row">
            <EvidencePanel evidence={pilot001.evidence} />
            <ProductDecisionPanel decision={pilot001.productDecision} />
          </div>
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Verify in browser:** `npm run dev` — console should render with topbar, sidebar, stage detail, evidence + decision panels. Click sidebar stages — main panel should update.

- [ ] **Commit:**
```bash
git add app/src/App.tsx
git commit -m "feat(ux): sidebar layout + active stage navigation"
```

---

### Task 7: Delete unused components + final commit

**Files:**
- Delete: `app/src/components/PilotHeader.tsx`
- Delete: `app/src/components/PilotStageTimeline.tsx`
- Delete: `app/src/components/PilotStageCard.tsx`
- Delete: `app/src/components/ArtifactViewer.tsx` (not in approved layout)
- Delete: `app/src/components/OperatorNotes.tsx` (not in approved layout)

- [ ] **Delete unused files:**
```bash
cd app/src/components
rm PilotHeader.tsx PilotStageTimeline.tsx PilotStageCard.tsx ArtifactViewer.tsx OperatorNotes.tsx
```

- [ ] **Verify TypeScript compiles clean:**
```bash
cd app && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Final commit:**
```bash
git add -A
git commit -m "feat(ux): complete azure console redesign — sidebar nav, azure palette, reduced density"
```
