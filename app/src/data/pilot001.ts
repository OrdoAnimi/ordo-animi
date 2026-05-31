import type { PilotRun } from './types';

const sourceRoot = 'pilot/runs/pilot-001-architecture-review-board';

export const pilot001: PilotRun = {
  id: 'pilot-001-architecture-review-board',
  title: 'Pilot 001: Architecture Review Board',
  status: 'complete',
  sourcePath: sourceRoot,
  scenario:
    'A solution architect is preparing for an architecture review board under delivery pressure and needs to make the decision, trade-off, and risk position clear without drowning the room in technical detail.',
  productQuestion:
    'Can VALOUR turn a high-pressure architecture leadership moment into a clearer decision conversation?',
  runObjective:
    'Use the manual VALOUR pilot templates to prove that one user can move through the full workflow from intake through evidence record before the console becomes a repeatable operator tool.',
  stages: [
    {
      id: 'intake',
      label: 'Intake',
      description: 'Capture the role, context, leadership challenge, upcoming scenario, desired outcome, and starting confidence.',
      sourceFile: `${sourceRoot}/intake.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Complete intake captures the architect role, review board challenge, confidence baseline, desired outcome, and selected scenario.',
    },
    {
      id: 'scenario-selection',
      label: 'Scenario Selection',
      description: 'Select the Architecture Review Board scenario from the VALOUR scenario library.',
      sourceFile: `${sourceRoot}/scenario-selection.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Architecture Review Board is confirmed as the best scenario for testing decision framing under technical challenge.',
    },
    {
      id: 'preparation',
      label: 'Preparation',
      description: 'Clarify audience, decision, context, risk, likely pushback, key message, opening frame, and close.',
      sourceFile: `${sourceRoot}/scenario-preparation.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Preparation brief defines the board audience, decision required, trade-off, pushback, response options, and close.',
    },
    {
      id: 'rehearsal',
      label: 'Rehearsal',
      description: 'Run the AI role-play and challenge clarity, cadence, empathy, authority, and decision framing.',
      sourceFile: `${sourceRoot}/ai-rehearsal.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Rehearsal shows challenge questions, draft answers, VALOUR feedback, and improved decision-oriented responses.',
    },
    {
      id: 'language-refinement',
      label: 'Language Refinement',
      description: 'Convert long or overly technical answers into short, executive, empathetic, boundary, and decision versions.',
      sourceFile: `${sourceRoot}/language-refinement.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Language refinement turns technical and defensive answers into executive, empathetic, boundary, and decision language.',
    },
    {
      id: 'after-action-review',
      label: 'After-Action Review',
      description: 'Capture what happened, what worked, what failed, what changed, and whether VALOUR helped.',
      sourceFile: `${sourceRoot}/after-action-review.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'After-action review records clarity improvement, composure under challenge, feedback, and ending confidence.',
    },
    {
      id: 'pattern-report',
      label: 'Pattern Report',
      description: 'Identify the recurring leadership pattern, primary strength, primary risk, and next development focus.',
      sourceFile: `${sourceRoot}/pattern-report.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Pattern report identifies technical over-explanation under pressure as the repeatable leadership pattern.',
    },
    {
      id: 'evidence-record',
      label: 'Evidence Record',
      description: 'Record the product learning, evidence strength, testimonial candidate status, and next product decision.',
      sourceFile: `${sourceRoot}/evidence-record.md`,
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Evidence record closes the loop with confidence shift, observed improvement, product learning, and repeat decision.',
    },
  ],
  evidence: {
    startingConfidence: 5,
    endingConfidence: 8,
    clarityImprovement:
      'The run shifts the architecture conversation from technical explanation toward decision framing, risk positioning, and stakeholder-ready language.',
    mainPattern:
      'The architect tends to over-explain technical context when the room needs the decision, trade-off, and recommendation first.',
    mainProductLearning:
      'VALOUR has a credible first loop when it helps the operator convert expert architecture thinking into clear leadership language before and after a high-stakes meeting.',
    testimonialCandidate: false,
  },
  productDecision: {
    decision: 'repeat',
    rationale:
      'Pilot 001 proves the end-to-end manual workflow can be represented as a console and gives the operator a strong reference pattern. It does not yet prove repeatability across real users.',
    nextStep:
      'Use this console as the reference cockpit, confirm the Pilot 001 artefact filenames, then run or simulate Pilot 002 with the same structure before adding backend or AI integration.',
  },
  operatorNotes: [
    'Keep v0.1 private and operator-led.',
    'Do not expose the full Ordo Animi doctrine to pilot users.',
    'Use Pilot 001 to harden the evidence model before adding new scenarios.',
    'Every feature must support prepare, rehearse, perform, review, or improve.',
  ],
};
