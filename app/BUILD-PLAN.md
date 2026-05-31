# VALOUR Pilot Console v0.1 Build Plan

Status: Planning baseline  
Scope: Private pilot console  
Product: VALOUR for Architecture Leadership  
Primary pilot mapping: `pilot/runs/pilot-001-architecture-review-board/`

## Purpose

The VALOUR Pilot Console v0.1 is a private operator console for running, reviewing, and improving the VALOUR pilot workflow.

It is not a public SaaS product. It is not the full Ordo Animi operating system. It is not a user-facing coaching marketplace.

The purpose of `app/` is to turn the completed Pilot 001 Architecture Review Board run into a simple working console that helps the founder/operator move through the pilot loop with less manual file navigation and better evidence capture.

The console should directly reflect the existing VALOUR operating model:

Intake -> Scenario Selection -> Preparation -> Rehearsal -> Language Refinement -> After-Action Review -> Pattern Report -> Evidence Record.

## Product boundary

This build remains inside the current MVP discipline.

VALOUR is still validating the behaviour loop before scaling into software. The console exists to support the founder-led pilot, not to replace the pilot method.

The console should help answer one question:

Can VALOUR turn a high-pressure architecture leadership moment into a clearer decision conversation?

## Source-of-truth mapping

The console must map directly to the Pilot 001 folder:

`pilot/runs/pilot-001-architecture-review-board/`

The first version should treat that folder as the reference run and display its artefacts as the canonical example of a completed pilot.

Expected pilot artefact categories:

- Run overview
- Intake
- Scenario selection
- Scenario preparation
- AI rehearsal setup
- Rehearsal notes or transcript summary
- Language refinement
- After-action review
- Leadership pattern snapshot
- Pilot completion report
- Evidence record

If exact filenames differ, the app should use a small manifest file rather than hard-coded assumptions.

Recommended manifest:

`pilot/runs/pilot-001-architecture-review-board/manifest.json`

The manifest should describe the stage order, display labels, source markdown files, completion status, and evidence status for each stage.

## v0.1 user

The v0.1 user is the founder/operator.

The console is used to:

- See the pilot run at a glance
- Move through the VALOUR workflow stages
- Open the relevant artefact for each stage
- Track whether each stage is complete
- Capture what evidence exists
- Identify gaps before moving to real pilot users
- Reuse Pilot 001 as the reference pattern for future pilot runs

The pilot participant does not need access in v0.1.

## v0.1 experience

The private console opens to a single Pilot Run page for Pilot 001.

The page should show:

- Pilot name: Architecture Review Board
- Pilot status: Simulated pilot complete
- Product question
- Scenario summary
- Run objective
- Workflow progress
- Evidence status
- Operator notes
- Next product decision

The main interface should be calm, plain, and operator-oriented. It should not expose the full Ordo Animi doctrine. It should stay focused on the practical pilot loop.

## App structure

Recommended initial structure:

```text
app/
  README.md
  BUILD-PLAN.md
  package.json
  index.html
  src/
    main.tsx
    App.tsx
    data/
      pilotRuns.ts
      pilot001.ts
    components/
      PilotHeader.tsx
      PilotStageTimeline.tsx
      PilotStageCard.tsx
      EvidencePanel.tsx
      OperatorNotes.tsx
      ProductDecisionPanel.tsx
    styles/
      app.css
```

This structure keeps the first build small. It avoids premature backend, auth, database, user accounts, payments, or integrations.

## Data approach

For v0.1, use static local data checked into the repo.

The app should not require a database. The first objective is to represent the pilot method clearly and prove the console shape.

Recommended data model:

```ts
type PilotRun = {
  id: string;
  title: string;
  status: 'planned' | 'in-progress' | 'complete' | 'archived';
  scenario: string;
  productQuestion: string;
  runObjective: string;
  sourcePath: string;
  stages: PilotStage[];
  evidence: EvidenceSummary;
  productDecision?: ProductDecision;
};

type PilotStage = {
  id: string;
  label: string;
  description: string;
  sourceFile?: string;
  status: 'not-started' | 'draft' | 'complete';
  evidenceCaptured: boolean;
  operatorNote?: string;
};

type EvidenceSummary = {
  startingConfidence?: number;
  endingConfidence?: number;
  clarityImprovement?: string;
  mainPattern?: string;
  mainProductLearning?: string;
  testimonialCandidate?: boolean;
};

type ProductDecision = {
  decision: 'continue' | 'repeat' | 'revise' | 'pause' | 'archive';
  rationale: string;
  nextStep: string;
};
```

For the first build, `pilot001.ts` can manually mirror the completed Pilot 001 artefacts. Later versions can load from markdown front matter or a manifest.

## Screen 1: Pilot Console Home

The v0.1 home screen should show only the private pilot console context.

Required content:

- VALOUR Pilot Console v0.1
- Private operator workspace
- Pilot 001 Architecture Review Board card
- Status indicator
- Evidence readiness indicator
- Link or button to open the run

Do not add marketing copy.

## Screen 2: Pilot Run Detail

The run detail page is the core of v0.1.

Required sections:

- Pilot header
- Scenario summary
- Product question
- Workflow timeline
- Stage cards
- Evidence panel
- Product decision panel
- Operator notes

The workflow timeline must use the VALOUR pilot sequence:

Intake -> Scenario Selection -> Preparation -> Rehearsal -> Language Refinement -> After-Action Review -> Pattern Report -> Evidence Record.

Each stage card should show:

- Stage name
- Purpose
- Completion status
- Evidence captured yes/no
- Source artefact path
- Operator note

## Screen 3: Artefact Viewer v0.1

The v0.1 artefact viewer can be simple.

Minimum acceptable version:

- Show the artefact title
- Show the source path
- Show a short summary of the artefact
- Link back to the stage card

Do not overbuild a markdown editor yet.

A markdown-rendering viewer can come later, but v0.1 only needs to prove navigation and traceability.

## Design principles

The console should feel like an operator cockpit, not a wellness app.

Design language:

- Private
- Calm
- Clear
- Founder/operator focused
- Evidence-led
- Minimal doctrine
- Minimal animation
- No gamification
- No public product polish yet

The layout should support fast reading and decision making.

## Acceptance criteria

VALOUR Pilot Console v0.1 is acceptable when:

- `app/` can run locally as a lightweight front end
- The console opens to Pilot 001
- Pilot 001 maps directly to `pilot/runs/pilot-001-architecture-review-board/`
- The full VALOUR pilot workflow is visible in order
- Each stage has a status and evidence indicator
- The product question is visible
- The evidence panel shows what was learned from the run
- The product decision panel states whether the pilot loop should continue, repeat, revise, pause, or archive
- No backend, login system, SaaS shell, payment, external integration, or public branding is introduced

## Non-goals for v0.1

Do not build:

- Authentication
- Database
- Multi-user access
- Public landing page
- Payment flow
- Calendar integration
- AI API integration
- Chat interface
- Full markdown editor
- VITA, VALLUM, VERITAS, or VIA user experiences
- Generic coaching dashboard

These can wait until the pilot loop proves repeatability.

## Build sequence

### Step 1: Create app shell

Create a minimal front-end app under `app/`.

Recommended stack: Vite, React, TypeScript, plain CSS.

Reason: fast, portable, easy to deploy later, and consistent with lightweight private tooling.

### Step 2: Add Pilot 001 static data

Create a typed data file for Pilot 001 that mirrors the completed run.

The data should include the product question, scenario summary, run objective, workflow stages, evidence summary, and product decision.

### Step 3: Build console layout

Create the console home and run detail components.

Keep the first version single-route if needed. Routing can wait.

### Step 4: Add stage timeline and evidence panel

Make the workflow visually obvious.

The operator should be able to see immediately where evidence exists and where the repeatable pilot pack needs strengthening.

### Step 5: Add artefact traceability

Each stage should reference the relevant markdown artefact path in the Pilot 001 folder.

If exact artefact filenames are not final, use placeholder source paths and mark them as `to-confirm` in the data file.

### Step 6: Add operator decision panel

The console must end in a product decision, not just a pretty dashboard.

The decision panel should answer:

- What did Pilot 001 prove?
- What remains weak?
- What should happen before Pilot 002?

### Step 7: Document how to run the app

Add `app/README.md` with local setup, run command, product boundary, and v0.1 scope.

## Recommended v0.1 product decision for Pilot 001

Decision: repeat.

Rationale: Pilot 001 proves the manual workflow can be represented end to end and that the console has a clear reference pattern. The next useful step is not scaling the app. The next useful step is to run or simulate Pilot 002 with the same structure and check whether the console model still holds.

Next step: build the static private console, then add a second pilot run only after Pilot 001 is visible and traceable.

## Release guardrail

Every new feature must pass this test:

Does this help the operator prepare, rehearse, review, or learn from a real architecture leadership moment?

If not, it waits.

## End-of-day Codex execution protocol

Status: Active for 7 a.m. to end-of-day build execution.

Execution model: ChatGPT is the planning, product, UX, and architecture control layer. Codex is the large-change implementation layer. Token usage is a hard constraint, so ChatGPT should avoid repeated micro-instructions and Codex should execute complete deployment slices without repeated confirmation prompts.

Codex must work as the senior engineer and release operator for `app/`. It must inspect before changing, fix before expanding, and verify before committing. The working prototype target is a deployable private VALOUR Pilot Console that can run locally and be deployed as a static/internal prototype by end of day.

Codex is authorised to execute the full implementation loop in one run: inspect, repair, implement, test, build, document, commit, and report. Codex must not stop for clarification unless the repository is missing, credentials are unavailable, or a destructive action would be required. Codex must prefer safe assumptions over blocking questions.

The end-of-day prototype target is not a SaaS launch. It is a working internal prototype of the VALOUR Pilot Console that supports Pilot 001 and prepares the repository for Pilot 002. The product remains founder-led and pilot-first.

Required working state by end of day:

- The app renders visibly from `app/` without a blank screen.
- The page title and primary surface say VALOUR Pilot Console v0.1.
- The console maps directly to `pilot/runs/pilot-001-architecture-review-board/`.
- Pilot 001 shows the VALOUR workflow in order.
- Pilot 001 stage artefacts exist or are generated as markdown files.
- `manifest.json` is the source of truth for the pilot run.
- Stage status is no longer left as `to-confirm` where an artefact exists.
- `npm install` succeeds.
- `npm run build` succeeds.
- The local preview/dev server shows a visible page.
- The README explains how to run and deploy the prototype.
- No backend, auth, database, payment flow, public SaaS shell, or AI API integration is introduced.

Codex must use this repair-first sequence:

1. Confirm `app/index.html` is being served.
2. Confirm static render works.
3. Restore or replace React only after static render is proven.
4. Run `npm install`.
5. Run `npm run build`.
6. Fix all TypeScript, JSX, import, CSS, and runtime errors.
7. Reintroduce the console panels only after the minimal render works.
8. Create missing Pilot 001 artefact markdown files.
9. Update Pilot 001 manifest statuses to match real artefacts.
10. Add a Pilot 002 template folder only after Pilot 001 is stable.
11. Run the final build again.
12. Commit the working prototype.

Codex must not overwrite product strategy documents unless directly instructed. Codex must not delete the existing Ordo Animi source-of-truth documents. Codex must not turn the project into a broad wellness product, generic coaching app, or full Ordo Animi platform. Codex must keep VALOUR as the first commercial wedge.

Codex must make the smallest viable technical decisions that produce a working prototype. If React/Vite remains unstable, Codex may choose a static HTML prototype for the end-of-day deployment, but it must document that decision and preserve the React source for later rebuild. Visible working prototype beats incomplete framework purity.

Codex must end with a concise release report containing what was changed, what was verified, how to run locally, what remains incomplete, and the next build step.
