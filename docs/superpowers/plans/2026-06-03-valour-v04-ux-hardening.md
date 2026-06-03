# VALOUR v0.4 — Guided Copilot UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the VALOUR Pilot Console UX so a first-time user can self-navigate without explanation — guided rehearsal panel, language refinement gate, pattern report action bar, stage guidance panels, visible stepper.

**Architecture:** All changes are in the React/TypeScript client — no backend, no new routes. `types.ts` gets a new optional field; `agents.ts` gets a tighter dependency check; `StageWorkspace.tsx` gains stepper + guidance + rehearsal panel; `PatternPage.tsx` gains an export/action bar; `App.tsx` wires new props.

**Tech Stack:** React 18, TypeScript, Vite, plain CSS custom properties — no new dependencies.

---

## File Map

| File | Changes |
|------|---------|
| `app/src/data/types.ts` | Add `guidance?` field to `PilotStage` |
| `app/src/data/pilot-001.ts` | Add `guidance` object to all 8 stages |
| `app/src/services/agents.ts` | Tighten stage-05 dependency; fix stage-02 message; parse JSON answer in `languageRefinementAgent` |
| `app/src/styles/app.css` | Add stepper, guidance, rehearsal panel, select, pattern action styles |
| `app/src/components/StageWorkspace.tsx` | New props; stepper; guidance panel; rehearsal panel rewrite; language preview fix; `RehearsalAnswerPanel` sub-component |
| `app/src/components/PatternPage.tsx` | New props; full export/action bar |
| `app/src/App.tsx` | Pass `completedStageIds` + `rehearsalAnswer` to StageWorkspace; pass `pilot`, `liveState`, `onReset`, `onStartNew` to PatternPage |
| `docs/49-release-phases-and-ux-roadmap.md` | New doc |
| `docs/50-valour-console-v0.4-v0.5-ux-release.md` | New doc |

---

## Task 1: Add guidance field to PilotStage type

**Files:**
- Modify: `app/src/data/types.ts`

- [ ] **Step 1: Add guidance field to PilotStage**

Open `app/src/data/types.ts`. Replace the `PilotStage` type (lines 6–14) with:

```typescript
export type StageGuidance = {
  what: string;
  provides: string;
  generates: string;
  next: string;
};

export type PilotStage = {
  id: string;
  label: string;
  description: string;
  sourceFile: string;
  status: StageStatus;
  evidenceCaptured: boolean;
  operatorNote: string;
  guidance?: StageGuidance;
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run from `app/` directory:
```
npm run build
```
Expected: no type errors. Exit code 0.

- [ ] **Step 3: Commit**

```
git add app/src/data/types.ts
git commit -m "feat(types): add guidance field to PilotStage"
```

---

## Task 2: Add guidance data to all 8 stages in pilot-001.ts

**Files:**
- Modify: `app/src/data/pilot-001.ts`

- [ ] **Step 1: Add guidance to all 8 stages**

In `app/src/data/pilot-001.ts`, add a `guidance` property to each stage object. Add each block directly after `operatorNote`:

**stage-01-intake:**
```typescript
guidance: {
  what: 'VALOUR maps your situation and role to personalise every stage of the workflow.',
  provides: 'Your role, the leadership situation, desired outcome, and starting confidence.',
  generates: 'Nothing — your context drives all downstream AI generation.',
  next: 'Save your context, then move to Stage 02 to identify the best-fit scenario.',
},
```

**stage-02-scenario:**
```typescript
guidance: {
  what: 'VALOUR maps your situation to the best-fit leadership scenario and variant.',
  provides: 'Your saved context from Stage 01.',
  generates: 'A scenario match with variant, fit score, and scenario-specific framing.',
  next: 'Review the scenario selection, then generate your Preparation Brief in Stage 03.',
},
```

**stage-03-prep:**
```typescript
guidance: {
  what: 'VALOUR builds a concise brief covering audience, decision frame, key message, likely questions, and closing statement.',
  provides: 'Your context and scenario from earlier stages.',
  generates: 'A structured preparation brief ready to use as a rehearsal reference.',
  next: 'Read the brief, then record your rehearsal answer in Stage 04.',
},
```

**stage-04-rehearsal:**
```typescript
guidance: {
  what: 'VALOUR generates practice board questions based on your scenario. You record your first answer to one question.',
  provides: 'Your rehearsal answer to a selected question.',
  generates: 'Board-level rehearsal questions tailored to your scenario.',
  next: 'Save your rehearsal answer, then move to Stage 05 to refine your language.',
},
```

**stage-05-language:**
```typescript
guidance: {
  what: 'VALOUR takes your rehearsal answer and produces four refined versions: short, executive, empathetic, and decision-oriented.',
  provides: 'Your saved rehearsal answer from Stage 04.',
  generates: 'Four language variants to use in your actual conversation.',
  next: 'Choose the best variant or combine elements, then generate your After-Action Review in Stage 06.',
},
```

**stage-06-review:**
```typescript
guidance: {
  what: 'VALOUR reviews what worked, what to change, and where your clarity and cadence improved.',
  provides: 'All outputs from earlier stages.',
  generates: 'A structured after-action review with key learnings and next actions.',
  next: 'Review your learnings, then generate your Pattern Summary in Stage 07.',
},
```

**stage-07-pattern:**
```typescript
guidance: {
  what: 'VALOUR identifies your primary leadership communication pattern and generates a personal development focus.',
  provides: 'Your full workflow history from this pilot run.',
  generates: 'A personalised Pattern Report — primary pattern, strengths, risks, and next focus.',
  next: 'Review your Pattern Report, then record your outcome in Stage 08.',
},
```

**stage-08-outcome:**
```typescript
guidance: {
  what: 'VALOUR captures your final confidence score, usefulness assessment, and product recommendation signal.',
  provides: 'Your self-assessed outcome scores after completing the workflow.',
  generates: 'An outcome record summarising your VALOUR pilot run.',
  next: 'Review your completed report and export or share the results.',
},
```

- [ ] **Step 2: Verify TypeScript compiles**

```
npm run build
```
Expected: exit 0, no errors.

- [ ] **Step 3: Commit**

```
git add app/src/data/pilot-001.ts
git commit -m "feat(data): add stage guidance to all pilot-001 stages"
```

---

## Task 3: Fix agents.ts — dependency check, message copy, and JSON answer parsing

**Files:**
- Modify: `app/src/services/agents.ts`

- [ ] **Step 1: Fix stage-02 dependency message (Intake → Context)**

In `checkDependency`, find:
```typescript
case 'stage-02-scenario':
  return e('stage-01-intake')?.userInput
    ? { ok: true }
    : { ok: false, message: 'Save your context in Stage 01 (Intake) first.' };
```

Replace with:
```typescript
case 'stage-02-scenario':
  return e('stage-01-intake')?.userInput
    ? { ok: true }
    : { ok: false, message: 'Save your context in Stage 01 (Context) first.' };
```

- [ ] **Step 2: Replace stage-05-language dependency check**

Find the current `case 'stage-05-language':` block:
```typescript
case 'stage-05-language':
  return e('stage-04-rehearsal')?.userInput || e('stage-04-rehearsal')?.output
    ? { ok: true }
    : { ok: false, message: 'Record your rehearsal answer in Stage 04 first.' };
```

Replace with:
```typescript
case 'stage-05-language': {
  const rehearsalEntry = e('stage-04-rehearsal');
  const raw = rehearsalEntry?.userInput ?? '';
  if (!rehearsalEntry) {
    return { ok: false, message: 'Record your rehearsal answer first. VALOUR needs your answer before it can refine your language.' };
  }
  try {
    const parsed = JSON.parse(raw) as { answer?: string };
    if (parsed.answer?.trim()) return { ok: true };
  } catch { /* ignore — check raw below */ }
  if (raw.trim()) return { ok: true };
  return { ok: false, message: 'Record your rehearsal answer first. VALOUR needs your answer before it can refine your language.' };
}
```

- [ ] **Step 3: Fix languageRefinementAgent to read answer from stage-04**

Find `languageRefinementAgent`:
```typescript
export async function languageRefinementAgent(pilot: PilotRun, state: PilotState, userInput: string): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const result = await callAgent('languageRefinement', buildContext(pilot, state, { userInput }));
  return { output: result, logEntry: makeLogEntry('stage-05-language', 'languageRefinementAgent', result) };
}
```

Replace with:
```typescript
export async function languageRefinementAgent(pilot: PilotRun, state: PilotState, _userInput: string): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const raw = state.entries['stage-04-rehearsal']?.userInput ?? '';
  let answer = raw;
  try {
    const parsed = JSON.parse(raw) as { answer?: string };
    if (parsed.answer?.trim()) answer = parsed.answer;
  } catch { /* use raw text */ }
  const result = await callAgent('languageRefinement', buildContext(pilot, state, { userInput: answer }));
  return { output: result, logEntry: makeLogEntry('stage-05-language', 'languageRefinementAgent', result) };
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```
npm run build
```
Expected: exit 0.

- [ ] **Step 5: Commit**

```
git add app/src/services/agents.ts
git commit -m "fix(agents): tighten stage-05 dependency gate; parse JSON rehearsal answer"
```

---

## Task 4: Add new CSS rules

**Files:**
- Modify: `app/src/styles/app.css`

- [ ] **Step 1: Add stepper styles**

Append to the end of `app/src/styles/app.css` (before the closing `@media` block — actually, append after the existing last rule):

```css
/* ══════════════════════════════════════════
   WORKFLOW STEPPER
   ══════════════════════════════════════════ */
.ws-stepper {
  display: flex;
  align-items: center;
  gap: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  scrollbar-width: none;
}
.ws-stepper::-webkit-scrollbar { display: none; }

.ws-stepper-item {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}
.ws-stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 6px;
}
.ws-stepper-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.15);
  transition: all .15s;
}
.ws-stepper-label {
  color: var(--text-faint);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  white-space: nowrap;
}
.ws-stepper-connector {
  width: 20px;
  height: 1px;
  background: var(--border);
  flex-shrink: 0;
}
.ws-stepper-item.done .ws-stepper-dot {
  background: var(--green);
  border-color: var(--green);
}
.ws-stepper-item.done .ws-stepper-label { color: var(--text-dim); }
.ws-stepper-item.active .ws-stepper-dot {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56,189,248,.2);
}
.ws-stepper-item.active .ws-stepper-label { color: var(--accent); font-weight: 800; }
.ws-stepper-item.done + .ws-stepper-item .ws-stepper-connector { background: rgba(52,211,153,.3); }

/* ══════════════════════════════════════════
   STAGE GUIDANCE PANEL
   ══════════════════════════════════════════ */
.ws-guidance {
  background: rgba(56,189,248,.04);
  border: 1px solid rgba(56,189,248,.1);
  border-radius: 10px;
  overflow: hidden;
}
.ws-guidance-summary {
  padding: 10px 14px;
  color: var(--text-dim);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  transition: color .12s;
}
.ws-guidance-summary::-webkit-details-marker { display: none; }
.ws-guidance-summary::before {
  content: '▸';
  color: var(--text-faint);
  font-size: 9px;
  transition: transform .15s;
}
details[open] .ws-guidance-summary::before { transform: rotate(90deg); }
.ws-guidance-summary:hover { color: var(--text); }

.ws-guidance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(56,189,248,.08);
  border-top: 1px solid rgba(56,189,248,.1);
}
.ws-guidance-item {
  padding: 12px 14px;
  background: var(--surface);
}
.ws-guidance-item:nth-child(odd) { background: rgba(14,24,37,.8); }
.ws-guidance-label {
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  margin-bottom: 4px;
  display: block;
}
.ws-guidance-value {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}

/* ══════════════════════════════════════════
   REHEARSAL ANSWER PANEL
   ══════════════════════════════════════════ */
.ws-rehearsal-panel {
  background: rgba(0,0,0,.14);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ws-rehearsal-panel-label {
  color: var(--accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.ws-rehearsal-hint-text {
  color: var(--text-dim);
  font-size: 12px;
  font-style: italic;
  line-height: 1.5;
}
.ws-question-selector { display: flex; flex-direction: column; gap: 6px; }
.ws-select {
  width: 100%;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  color: var(--text);
  font-size: 12px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color .15s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%235a7a96'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}
.ws-select:focus { border-color: var(--accent); }
.ws-select option { background: var(--surface-raised); color: var(--text); }

.ws-answer-preview {
  background: rgba(56,189,248,.05);
  border: 1px solid rgba(56,189,248,.12);
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ws-answer-question {
  color: var(--text-dim);
  font-size: 11px;
  line-height: 1.4;
  font-style: italic;
}
.ws-answer-text {
  color: var(--text);
  font-size: 13px;
  line-height: 1.6;
  font-style: italic;
}

/* ══════════════════════════════════════════
   PATTERN REPORT ACTIONS
   ══════════════════════════════════════════ */
.pattern-actions {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}
.pattern-actions-label {
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.pattern-actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pattern-action-btn {
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  transition: all .12s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.pattern-action-btn:hover { border-color: var(--accent); color: var(--accent); }
.pattern-action-start {
  border-color: rgba(52,211,153,.3);
  color: var(--green);
}
.pattern-action-start:hover { border-color: var(--green); background: rgba(52,211,153,.07); color: var(--green); }
.pattern-action-reset {
  border-color: rgba(248,113,113,.2);
  color: #f87171;
}
.pattern-action-reset:hover { border-color: #f87171; background: rgba(248,113,113,.07); color: #f87171; }
```

- [ ] **Step 2: Commit**

```
git add app/src/styles/app.css
git commit -m "feat(styles): add stepper, guidance, rehearsal panel, pattern action styles"
```

---

## Task 5: StageWorkspace — new props and stepper

**Files:**
- Modify: `app/src/components/StageWorkspace.tsx`

- [ ] **Step 1: Add new props and stepper constants**

At the top of `StageWorkspace.tsx`, add the `STEPPER_STAGE_IDS` and `STEPPER_LABELS` constants right after the existing constants (after `STATUS_CYCLE`, before the `Props` type). Then update the `Props` type to add `completedStageIds`.

Add after the `PROVIDER_LABELS` constant (around line 27):
```typescript
const STEPPER_STAGE_IDS = [
  'stage-01-intake', 'stage-02-scenario', 'stage-03-prep',
  'stage-04-rehearsal', 'stage-05-language', 'stage-06-review', 'stage-07-pattern',
];
const STEPPER_LABELS = ['Context', 'Scenario', 'Prepare', 'Rehearse', 'Refine', 'Review', 'Report'];
```

- [ ] **Step 2: Add completedStageIds and rehearsalAnswer to Props type**

Find the `type Props = {` block and add two new fields after `dependency`:
```typescript
type Props = {
  stage: PilotStage;
  entry: PilotStateEntry;
  index: number;
  total: number;
  hasAgent: boolean;
  dependency: DependencyCheck;
  completedStageIds: string[];   // <-- add this
  rehearsalAnswer?: string;       // <-- add this
  onGenerate: () => Promise<void>;
  onSaveOutput: (output: StageOutput) => void;
  onSaveUserInput: (input: string) => void;
  onCycleStatus: (status: StageStatus) => void;
  onPrev: () => void;
  onNext: () => void;
};
```

- [ ] **Step 3: Destructure new props in StageWorkspace function signature**

Find:
```typescript
export function StageWorkspace({
  stage, entry, index, total, hasAgent, dependency,
  onGenerate, onSaveOutput, onSaveUserInput, onCycleStatus,
  onPrev, onNext,
}: Props) {
```

Replace with:
```typescript
export function StageWorkspace({
  stage, entry, index, total, hasAgent, dependency,
  completedStageIds, rehearsalAnswer,
  onGenerate, onSaveOutput, onSaveUserInput, onCycleStatus,
  onPrev, onNext,
}: Props) {
```

- [ ] **Step 4: Remove showUserInput and userInputDraft state**

Find and remove these two lines:
```typescript
  const [showUserInput, setShowUserInput] = useState(false);
  const [userInputDraft, setUserInputDraft] = useState(entry.userInput ?? '');
```

- [ ] **Step 5: Clean up useEffect — remove showUserInput and userInputDraft refs**

Find:
```typescript
  useEffect(() => {
    setUserInputDraft(entry.userInput ?? '');
    setEditing(false);
    setShowUserInput(false);
  }, [stage.id, entry.userInput]);
```

Replace with:
```typescript
  useEffect(() => {
    setEditing(false);
  }, [stage.id]);
```

- [ ] **Step 6: Remove saveUserInput function**

Find and remove:
```typescript
  function saveUserInput() {
    onSaveUserInput(userInputDraft);
    setShowUserInput(false);
  }
```

- [ ] **Step 7: Render stepper above the workspace header**

Find the opening of the return statement: `return (` followed by `<div className="workspace">`.

After `<div className="workspace">` and before `{/* Header */}`, add the stepper:

```tsx
      {/* Stepper */}
      <div className="ws-stepper">
        {STEPPER_STAGE_IDS.map((id, i) => {
          const isDone = completedStageIds.includes(id) && id !== stage.id;
          const isActive = id === stage.id;
          return (
            <div key={id} className="ws-stepper-item">
              {i > 0 && <div className="ws-stepper-connector" />}
              <div className={`ws-stepper-step${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}>
                <div className="ws-stepper-dot" />
                <div className="ws-stepper-label">{STEPPER_LABELS[i]}</div>
              </div>
            </div>
          );
        })}
      </div>
```

Note: The `.ws-stepper-item` needs the class modifier. Update the map to apply the class on the outer div:

```tsx
      <div className="ws-stepper">
        {STEPPER_STAGE_IDS.map((id, i) => {
          const isDone = completedStageIds.includes(id) && id !== stage.id;
          const isActive = id === stage.id;
          const cls = isDone ? ' done' : isActive ? ' active' : '';
          return (
            <div key={id} className={`ws-stepper-item${cls}`}>
              {i > 0 && <div className="ws-stepper-connector" />}
              <div className="ws-stepper-step">
                <div className="ws-stepper-dot" />
                <div className="ws-stepper-label">{STEPPER_LABELS[i]}</div>
              </div>
            </div>
          );
        })}
      </div>
```

- [ ] **Step 8: Verify TypeScript compiles**

```
npm run build
```
Expected: TypeScript errors only for unused `showUserInput`/`userInputDraft` references still in the JSX — those will be fixed in Task 6–7.

- [ ] **Step 9: Commit**

```
git add app/src/components/StageWorkspace.tsx
git commit -m "feat(workspace): add stepper + new props (completedStageIds, rehearsalAnswer)"
```

---

## Task 6: StageWorkspace — guidance panel

**Files:**
- Modify: `app/src/components/StageWorkspace.tsx`

- [ ] **Step 1: Add guidance panel after ws-desc**

Find:
```tsx
      <div className="ws-desc">{stage.description}</div>
```

Replace with:
```tsx
      <div className="ws-desc">{stage.description}</div>

      {/* Stage guidance */}
      {stage.guidance && (
        <details className="ws-guidance">
          <summary className="ws-guidance-summary">About this stage</summary>
          <div className="ws-guidance-grid">
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">What this stage does</span>
              <div className="ws-guidance-value">{stage.guidance.what}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">You provide</span>
              <div className="ws-guidance-value">{stage.guidance.provides}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">VALOUR generates</span>
              <div className="ws-guidance-value">{stage.guidance.generates}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">Recommended next</span>
              <div className="ws-guidance-value">{stage.guidance.next}</div>
            </div>
          </div>
        </details>
      )}
```

- [ ] **Step 2: Verify TypeScript compiles**

```
npm run build
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```
git add app/src/components/StageWorkspace.tsx
git commit -m "feat(workspace): add collapsible stage guidance panel"
```

---

## Task 7: StageWorkspace — rehearsal panel rewrite + language fix + cleanup

**Files:**
- Modify: `app/src/components/StageWorkspace.tsx`

- [ ] **Step 1: Replace old rehearsal section with RehearsalAnswerPanel**

Find this entire rehearsal block (lines ~129–143):
```tsx
      {/* Rehearsal answer prompt */}
      {isRehearsal && output && !showUserInput && (
        <div className="ws-rehearsal-hint">
          <p className="ws-hint-text">Read the rehearsal questions. When ready, record your answer below:</p>
          <button className="btn btn-primary ws-answer-btn"
            onClick={() => { setShowUserInput(true); setUserInputDraft(entry.userInput ?? ''); }}>
            Record my answer →
          </button>
          {entry.userInput && (
            <div className="ws-answer-saved">
              Answer saved. <button className="link-btn" onClick={() => { setShowUserInput(true); setUserInputDraft(entry.userInput ?? ''); }}>Edit</button>
            </div>
          )}
        </div>
      )}
```

Replace with:
```tsx
      {/* Rehearsal answer panel — always visible in stage 04 */}
      {isRehearsal && (
        <RehearsalAnswerPanel
          output={output}
          savedUserInput={entry.userInput}
          onSave={onSaveUserInput}
        />
      )}
```

- [ ] **Step 2: Replace language input preview section**

Find the language preview block (lines ~146–162):
```tsx
      {/* Language refinement — show input from rehearsal */}
      {isLanguage && (
        <div className="ws-input-preview">
          <div className="ws-input-preview-label">
            {entry.userInput ? 'Your rehearsal answer' : 'No rehearsal answer yet'}
          </div>
          {entry.userInput
            ? <div className="ws-input-preview-value">"{entry.userInput}"</div>
            : <div className="ws-input-preview-missing">Record your answer in Stage 04 first, then return here to generate refined versions.</div>
          }
          {entry.userInput && (
            <button className="btn btn-ghost ws-edit-input"
              onClick={() => { setShowUserInput(true); setUserInputDraft(entry.userInput ?? ''); }}>
              Edit answer
            </button>
          )}
        </div>
      )}
```

Replace with:
```tsx
      {/* Language refinement — preview rehearsal answer */}
      {isLanguage && (
        <div className="ws-input-preview">
          <div className="ws-input-preview-label">
            {rehearsalAnswer ? 'Your rehearsal answer' : 'No rehearsal answer yet'}
          </div>
          {rehearsalAnswer
            ? <div className="ws-input-preview-value">"{rehearsalAnswer}"</div>
            : <div className="ws-input-preview-missing">Record your answer in Stage 04 (Rehearse) first, then return here to generate refined versions.</div>
          }
          {rehearsalAnswer && (
            <p style={{ color: 'var(--text-faint)', fontSize: '11px', marginTop: '4px' }}>
              To edit your answer, return to Stage 04.
            </p>
          )}
        </div>
      )}
```

- [ ] **Step 3: Remove old showUserInput panel**

Find and remove this entire block (lines ~164–185):
```tsx
      {/* User input panel */}
      {showUserInput && (
        <div className="ws-user-input">
          <div className="ws-user-input-label">
            {isRehearsal ? 'Your rehearsal answer' : 'Edit your answer'}
          </div>
          <textarea
            className="ws-textarea"
            value={userInputDraft}
            onChange={e => setUserInputDraft(e.target.value)}
            placeholder="Type your answer here…"
            rows={6}
            autoFocus
          />
          <div className="ws-user-input-actions">
            <button className="btn btn-primary" onClick={saveUserInput} disabled={!userInputDraft.trim()}>
              Save answer
            </button>
            <button className="btn btn-ghost" onClick={() => setShowUserInput(false)}>Cancel</button>
          </div>
        </div>
      )}
```

- [ ] **Step 4: Add helper functions and RehearsalAnswerPanel component**

Add these at the bottom of the file, after the `simpleMarkdown` function and before the last closing brace of the file:

```typescript
// ── Rehearsal helpers ─────────────────────────────────────────────────────────

function parseQuestions(content: string): string[] {
  const questions: string[] = [];
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (/^(\d+\.|[-*]|\*\*Q\d+\*\*:?|Q\d+:|\*\*Question \d+:\*\*)\s+.{10,}/.test(t)) {
      const text = t
        .replace(/^(\d+\.|[-*]|\*\*Q\d+\*\*:?\s*|Q\d+:\s*|\*\*Question \d+:\*\*\s*)/, '')
        .replace(/\*\*/g, '')
        .trim();
      if (text.length > 10) questions.push(text);
    }
  }
  return questions;
}

function parseRehearsalUserInput(raw: string | undefined): { question: string; answer: string } | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as { question?: string; answer?: string };
    if (parsed.answer) return { question: parsed.question ?? '', answer: parsed.answer };
  } catch { /* ignore */ }
  return { question: '', answer: raw };
}

// ── RehearsalAnswerPanel ───────────────────────────────────────────────────────

function RehearsalAnswerPanel({ output, savedUserInput, onSave }: {
  output: StageOutput | undefined;
  savedUserInput: string | undefined;
  onSave: (value: string) => void;
}) {
  const saved = parseRehearsalUserInput(savedUserInput);
  const questions = output ? parseQuestions(output.content) : [];

  const [editing, setEditing] = useState(!saved);
  const [selectedQuestion, setSelectedQuestion] = useState(saved?.question ?? '');
  const [answer, setAnswer] = useState(saved?.answer ?? '');
  const [justSaved, setJustSaved] = useState(!!saved?.answer);

  function handleSave() {
    if (!answer.trim()) return;
    onSave(JSON.stringify({ question: selectedQuestion, answer: answer.trim() }));
    setJustSaved(true);
    setEditing(false);
  }

  return (
    <div className="ws-rehearsal-panel">
      <div className="ws-rehearsal-panel-label">Record your answer</div>

      {!output && (
        <p className="ws-rehearsal-hint-text">
          Generate rehearsal questions above, then record your answer here.
        </p>
      )}

      {output && justSaved && !editing && (
        <div className="ws-answer-preview">
          {selectedQuestion && (
            <div className="ws-answer-question">Q: {selectedQuestion}</div>
          )}
          <div className="ws-answer-text">"{answer}"</div>
          <button className="link-btn" onClick={() => setEditing(true)}>Edit answer</button>
        </div>
      )}

      {output && (editing || !justSaved) && (
        <>
          {questions.length > 0 && (
            <div className="ws-question-selector">
              <span className="ws-guidance-label">Select a question to practise</span>
              <select
                className="ws-select"
                value={selectedQuestion}
                onChange={e => setSelectedQuestion(e.target.value)}
              >
                <option value="">— Choose a question —</option>
                {questions.map((q, i) => (
                  <option key={i} value={q}>
                    {q.length > 90 ? q.slice(0, 90) + '…' : q}
                  </option>
                ))}
              </select>
            </div>
          )}
          <textarea
            className="ws-textarea"
            value={answer}
            onChange={e => { setAnswer(e.target.value); setJustSaved(false); }}
            placeholder="Type your answer here…"
            rows={6}
            autoFocus={!!output}
          />
          <div className="ws-user-input-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={!answer.trim()}>
              Save answer
            </button>
            {justSaved && (
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify TypeScript compiles with no errors**

```
npm run build
```
Expected: exit 0, zero TypeScript errors. If there are unused variable errors, remove any remaining `showUserInput`, `userInputDraft`, or `saveUserInput` references.

- [ ] **Step 6: Commit**

```
git add app/src/components/StageWorkspace.tsx
git commit -m "feat(workspace): rehearsal answer panel, language preview fix, cleanup"
```

---

## Task 8: PatternPage — export/action bar

**Files:**
- Modify: `app/src/components/PatternPage.tsx`

- [ ] **Step 1: Update imports and Props type**

Replace the existing `import` and `Props` type at the top of `PatternPage.tsx`:

```typescript
import type { PatternSummary, PilotRun, PilotState } from '../data/types';
import { simpleMarkdown } from './StageWorkspace';

type Props = {
  pilot: PilotRun;
  liveContent?: string;
  liveState?: PilotState;
  onBack: () => void;
  onReset: () => void;
  onStartNew: () => void;
};
```

- [ ] **Step 2: Replace function signature and derive locals**

Replace:
```typescript
export function PatternPage({ pattern, pilotTitle, liveContent, onBack }: Props) {
  const hasLive = !!liveContent;
```

With:
```typescript
export function PatternPage({ pilot, liveContent, liveState, onBack, onReset, onStartNew }: Props) {
  const { pattern } = pilot;
  const pilotTitle = pilot.title.replace(': ', ' · ');
  const hasLive = !!liveContent;
```

- [ ] **Step 3: Add download helper and action handlers inside the function**

Add after `const hasLive = !!liveContent;`:

```typescript
  function download(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  function fallbackText(p: PatternSummary): string {
    return [
      `Primary Pattern: ${p.primaryPattern}`,
      `Starting Challenge: ${p.startingChallenge}`,
      `Main Improvement: ${p.mainImprovement}`,
      `Primary Strength: ${p.primaryStrength}`,
      `Primary Risk: ${p.primaryRisk}`,
      `Next Focus: ${p.nextFocus}`,
      `Useful Language: ${p.usefulLanguage.join('; ')}`,
      `Usefulness Score: ${p.usefulnessScore}/10`,
    ].join('\n');
  }

  function handleCopy() {
    const text = liveContent ?? fallbackText(pattern);
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function handleExportMarkdown() {
    const body = liveContent ?? fallbackText(pattern);
    const lines = [
      `# ${pilotTitle}`,
      `**Scenario:** ${pilot.scenario}`,
      `**Generated:** ${new Date().toLocaleString('en-AU')}`,
      '',
      body,
      '',
      '*Generated by VALOUR™ · © 2026 ZenCloud Global Consultants*',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    download(blob, `${pilot.id.toLowerCase()}-pattern-report.md`);
  }

  function handleExportJSON() {
    const payload = {
      pilot: pilot.id,
      title: pilotTitle,
      scenario: pilot.scenario,
      generatedAt: new Date().toISOString(),
      pattern: pilot.pattern,
      liveReport: liveContent ?? null,
      state: liveState ?? null,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    download(blob, `${pilot.id.toLowerCase()}-pattern-report.json`);
  }

  function handleEmail() {
    const subject = encodeURIComponent(`VALOUR™ Pattern Report — ${pilotTitle}`);
    const snippet = (liveContent ?? fallbackText(pattern)).slice(0, 1200);
    const body = encodeURIComponent(`${snippet}\n\n[Full report generated by VALOUR™ Pilot Console]`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function handleReset() {
    if (confirm('Reset all pilot state? This cannot be undone.')) onReset();
  }
```

- [ ] **Step 4: Update nav bar (remove inline print button — will go in action bar)**

Find inside the `<nav>` element:
```tsx
          <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => window.print()}>
            Print / PDF
          </button>
```

Remove it (print will live in the action bar).

- [ ] **Step 5: Add action bar at the end of the page, before the closing `</div>`**

Find the final closing `</div>` of `pattern-page`:
```tsx
    </div>
  );
}
```

Before that, add:
```tsx
      {/* Report action bar */}
      <div className="pattern-actions no-print">
        <div className="pattern-actions-label">Report actions</div>
        <div className="pattern-actions-grid">
          <button className="pattern-action-btn" onClick={handleCopy}>Copy report</button>
          <button className="pattern-action-btn" onClick={handleExportMarkdown}>↓ Markdown</button>
          <button className="pattern-action-btn" onClick={handleExportJSON}>↓ JSON</button>
          <button className="pattern-action-btn" onClick={() => window.print()}>Print / PDF</button>
          <button className="pattern-action-btn" onClick={handleEmail}>Email to myself</button>
          <button className="pattern-action-btn pattern-action-start" onClick={onStartNew}>Start another pilot</button>
          <button className="pattern-action-btn pattern-action-reset" onClick={handleReset}>Reset pilot</button>
        </div>
      </div>
```

- [ ] **Step 6: Verify TypeScript compiles**

```
npm run build
```
Expected: exit 0.

- [ ] **Step 7: Commit**

```
git add app/src/components/PatternPage.tsx
git commit -m "feat(pattern): add export/action bar (copy, md, json, print, email, reset)"
```

---

## Task 9: App.tsx — wire new props

**Files:**
- Modify: `app/src/App.tsx`

- [ ] **Step 1: Add PilotState import**

Find:
```typescript
import type { StageOutput, StageStatus } from './data/types';
```

Replace with:
```typescript
import type { StageOutput, StageStatus, PilotState } from './data/types';
```

- [ ] **Step 2: Update PatternPage block to pass new props**

Find the `if (page === 'pattern')` block:

```tsx
  if (page === 'pattern') {
    const pid = getParam('pilot') ?? 'PILOT-001';
    const pilot = getPilotById(pid);
    // Read live pattern content from localStorage state
    let liveContent: string | undefined;
    try {
      const saved = localStorage.getItem(`valour:state:${pid}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        liveContent = parsed?.entries?.['stage-07-pattern']?.output?.content;
      }
    } catch { /* ignore */ }
    return (
      <PatternPage
        pattern={pilot.pattern}
        pilotTitle={pilot.title.replace(': ', ' · ')}
        liveContent={liveContent}
        onBack={nav('#console')}
      />
    );
  }
```

Replace with:
```tsx
  if (page === 'pattern') {
    const pid = getParam('pilot') ?? 'PILOT-001';
    const pilot = getPilotById(pid);
    let liveContent: string | undefined;
    let liveState: PilotState | undefined;
    try {
      const saved = localStorage.getItem(`valour:state:${pid}`);
      if (saved) {
        const parsed = JSON.parse(saved) as PilotState;
        liveContent = parsed?.entries?.['stage-07-pattern']?.output?.content;
        liveState = parsed;
      }
    } catch { /* ignore */ }
    return (
      <PatternPage
        pilot={pilot}
        liveContent={liveContent}
        liveState={liveState}
        onBack={nav('#console')}
        onReset={() => {
          localStorage.removeItem(`valour:state:${pid}`);
          window.location.hash = `#console?pilot=${pid}`;
        }}
        onStartNew={() => { window.location.hash = '#console'; }}
      />
    );
  }
```

- [ ] **Step 3: Compute completedStageIds and rehearsalAnswer in Console**

In the `Console` component, find:
```typescript
  const dependency = checkDependency(activeStage.id, state);
```

After that line, add:
```typescript
  const completedStageIds = Object.keys(state.entries).filter(id => !!state.entries[id]?.output);

  const rehearsalAnswer = (() => {
    const raw = state.entries['stage-04-rehearsal']?.userInput;
    if (!raw?.trim()) return undefined;
    try {
      const parsed = JSON.parse(raw) as { answer?: string };
      if (parsed.answer?.trim()) return parsed.answer;
    } catch { /* ignore */ }
    return raw || undefined;
  })();
```

- [ ] **Step 4: Pass new props to StageWorkspace**

Find the `<StageWorkspace` element in the Console render. It currently has these props:
```tsx
          <StageWorkspace
            stage={activeStage}
            entry={activeEntry}
            index={activeIndex}
            total={pilot.stages.length}
            hasAgent={activeStage.id in STAGE_AGENTS}
            dependency={dependency}
            onGenerate={handleGenerate}
            onSaveOutput={handleSaveOutput}
            onSaveUserInput={(input) => setUserInput(activeStage.id, input)}
            onCycleStatus={handleCycleStatus}
            onPrev={() => setActiveIndex(i => Math.max(0, i - 1))}
            onNext={() => setActiveIndex(i => Math.min(pilot.stages.length - 1, i + 1))}
          />
```

Replace with:
```tsx
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
```

- [ ] **Step 5: Verify full TypeScript build with zero errors**

```
npm run build
```
Expected: exit 0, zero errors, zero warnings about type mismatches.

- [ ] **Step 6: Commit**

```
git add app/src/App.tsx
git commit -m "feat(app): wire completedStageIds/rehearsalAnswer to StageWorkspace; extend PatternPage props"
```

---

## Task 10: Write release documentation

**Files:**
- Create: `docs/49-release-phases-and-ux-roadmap.md`
- Create: `docs/50-valour-console-v0.4-v0.5-ux-release.md`

- [ ] **Step 1: Create docs/49-release-phases-and-ux-roadmap.md**

```markdown
# VALOUR™ Release Phases and UX Roadmap

**Product:** VALOUR™ for Architecture Leadership  
**Owner:** ZenCloud Global Consultants  
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
```

- [ ] **Step 2: Create docs/50-valour-console-v0.4-v0.5-ux-release.md**

```markdown
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
```

- [ ] **Step 3: Commit**

```
git add docs/49-release-phases-and-ux-roadmap.md docs/50-valour-console-v0.4-v0.5-ux-release.md
git commit -m "docs: add v0.4-v0.5 release notes and UX roadmap (docs/49, docs/50)"
```

---

## Task 11: Final verification and push

- [ ] **Step 1: Full build check**

From `app/` directory:
```
npm run build
```
Expected: Build succeeds. No TypeScript errors. Output in `app/dist/`.

- [ ] **Step 2: Check for any remaining references to old patterns**

Search for stale references:
```
grep -rn "showUserInput\|userInputDraft\|saveUserInput\|Intake)" app/src/
```
Expected: No matches (or only in comments).

- [ ] **Step 3: Push to main**

```
git push origin main
```

Vercel auto-deploy triggers. Expected deploy time: 1–2 minutes.

- [ ] **Step 4: Verify deployment**

Visit www.ordoanimi.com/#console and confirm:
1. Stepper visible at top of stage workspace
2. "About this stage" panel present and expandable
3. Stage 04 shows rehearsal answer panel immediately
4. Visit /#pattern?pilot=PILOT-001 — action bar at bottom with all 7 buttons

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|-------------|------|
| Record your answer panel in Stage 04 with question selector, textarea, save, preview | Task 7 |
| localStorage persistence of rehearsal answer | Task 7 (JSON in userInput) |
| Stage 05 uses saved answer | Task 3 (languageRefinementAgent reads stage-04) |
| Stage 05 gate with exact message | Task 3 (checkDependency) |
| Copy report | Task 8 |
| Export Markdown | Task 8 |
| Export JSON | Task 8 |
| Print/PDF | Task 8 |
| Email to myself (mailto) | Task 8 |
| Start another pilot | Task 8 |
| Reset pilot | Task 8 |
| Stage guidance (what/provides/generates/next) on every stage | Tasks 1, 2, 6 |
| Visible stepper Context→…→Report | Tasks 4, 5 |
| Rename Intake → Context (user-facing) | Task 3 |
| docs/49 | Task 10 |
| docs/50 | Task 10 |

All requirements covered. No gaps found.

**Type consistency check:**
- `StageGuidance` defined in Task 1, used in Tasks 2 and 6
- `completedStageIds: string[]` defined in Task 5 Props, computed in Task 9, passed in Task 9
- `rehearsalAnswer?: string` defined in Task 5 Props, computed in Task 9, used in Task 7
- `parseRehearsalUserInput` defined in Task 7, used in Task 7 (`RehearsalAnswerPanel`) and Task 9 (`rehearsalAnswer` computation — same logic inline)
- PatternPage new Props: `pilot: PilotRun`, `liveState?: PilotState`, `onReset`, `onStartNew` — all defined in Task 8 and passed in Task 9
