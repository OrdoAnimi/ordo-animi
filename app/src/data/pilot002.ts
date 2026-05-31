import type { PilotRun } from './types';

const sourceRoot = 'pilot/runs/pilot-002-executive-briefing';

export const pilot002: PilotRun = {
  id: 'pilot-002-executive-briefing',
  title: 'Pilot 002: Executive Briefing',
  status: 'complete',
  sourcePath: sourceRoot,
  scenario:
    'A technical leader needs to brief senior executives on a complex technology decision without losing attention or hiding the business implications.',
  productQuestion:
    'Can VALOUR help a technical leader convert a complex technology recommendation into a concise executive decision briefing?',
  runObjective:
    'Use the same VALOUR operating structure from Pilot 001 to prove the pilot engine can support a second leadership scenario.',
  stages: [
    {
      id: 'intake',
      label: 'Intake',
      description: 'Capture the technical leader role, executive audience, decision pressure, starting confidence, desired outcome, and selected scenario.',
      sourceFile: `${sourceRoot}/intake.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Complete intake captures the executive briefing challenge and the risk of too much technical detail.',
    },
    {
      id: 'scenario-selection',
      label: 'Scenario Selection',
      description: 'Select Executive Briefing as the VALOUR scenario for business decision framing.',
      sourceFile: `${sourceRoot}/scenario-selection.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Executive Briefing is confirmed as the scenario for compressing technical judgement into business language.',
    },
    {
      id: 'preparation',
      label: 'Preparation',
      description: 'Clarify audience, decision required, business risk, options, trade-offs, pushback, opening frame, and close.',
      sourceFile: `${sourceRoot}/scenario-preparation.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Preparation defines the executive decision, cost and timing implications, business risk, and next action.',
    },
    {
      id: 'rehearsal',
      label: 'Rehearsal',
      description: 'Run executive challenge questions on cost, timing, business relevance, and the lower-cost alternative.',
      sourceFile: `${sourceRoot}/ai-rehearsal.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Rehearsal improves technical draft answers into concise business-focused responses.',
    },
    {
      id: 'language-refinement',
      label: 'Language Refinement',
      description: 'Convert detailed technical briefing language into executive, business, trade-off, and decision language.',
      sourceFile: `${sourceRoot}/language-refinement.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Language refinement removes technical drag and makes the recommendation easier for executives to act on.',
    },
    {
      id: 'after-action-review',
      label: 'After-Action Review',
      description: 'Capture what changed, what worked, where clarity improved, feedback received, and ending confidence.',
      sourceFile: `${sourceRoot}/after-action-review.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'After-action review confirms the briefing became shorter, clearer, and more decision-oriented.',
    },
    {
      id: 'pattern-report',
      label: 'Pattern Report',
      description: 'Identify the recurring pattern, strength, risk, scenario fit, development focus, and coaching note.',
      sourceFile: `${sourceRoot}/pattern-report.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Pattern report identifies technical detail before executive relevance as the repeatable leadership pattern.',
    },
    {
      id: 'evidence-record',
      label: 'Evidence Record',
      description: 'Record product evidence, confidence shift, observed improvement, remaining weakness, and repeat decision.',
      sourceFile: `${sourceRoot}/evidence-record.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Evidence record supports the Release 0.2 repeatability claim and recommends another repeat.',
    },
  ],
  evidence: {
    startingConfidence: 6,
    endingConfidence: 8,
    clarityImprovement:
      'The run shifts the briefing from technical dependencies and constraints toward executive decision, business risk, cost and timing trade-offs, and next action.',
    mainPattern:
      'The technical leader starts with implementation context before executive relevance, which risks losing attention before the recommendation is understood.',
    mainProductLearning:
      'The VALOUR pilot loop is repeatable across a second architecture leadership scenario without adding platform mechanics.',
    testimonialCandidate: false,
  },
  productDecision: {
    decision: 'repeat',
    rationale:
      'Pilot 002 supports the Release 0.2 repeatability claim by using the same artefact structure to produce a complete executive briefing run.',
    nextStep:
      'Use Pilot 001 and Pilot 002 as the reference set for Release 0.3 evidence comparison and a minimum repeatable pilot pack.',
  },
  operatorNotes: [
    'Keep Release 0.2 static and operator-led.',
    'Use Pilot 002 to compare repeatability against Pilot 001.',
    'Do not add backend workflow until the pilot pack is stable.',
    'The next evidence question is whether a third scenario shows the same improvement pattern.',
  ],
};
