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
      status: 'to-confirm',
      evidenceCaptured: true,
      operatorNote: 'Confirm the exact artefact filename, then bind the card to the completed intake record.',
    },
    {
      id: 'scenario-selection',
      label: 'Scenario Selection',
      description: 'Select the Architecture Review Board scenario from the VALOUR scenario library.',
      sourceFile: `${sourceRoot}/scenario-selection.md`,
      status: 'to-confirm',
      evidenceCaptured: true,
      operatorNote: 'The scenario is confirmed by the run README. Attach the dedicated scenario artefact when available.',
    },
    {
      id: 'preparation',
      label: 'Preparation',
      description: 'Clarify audience, decision, context, risk, likely pushback, key message, opening frame, and close.',
      sourceFile: `${sourceRoot}/scenario-preparation.md`,
      status: 'to-confirm',
      evidenceCaptured: true,
      operatorNote: 'This is the strongest candidate for the first artefact viewer because it proves decision framing.',
    },
    {
      id: 'rehearsal',
      label: 'Rehearsal',
      description: 'Run the AI role-play and challenge clarity, cadence, empathy, authority, and decision framing.',
      sourceFile: `${sourceRoot}/ai-rehearsal.md`,
      status: 'to-confirm',
      evidenceCaptured: true,
      operatorNote: 'Keep the transcript summarised. The console needs evidence, not raw conversational noise.',
    },
    {
      id: 'language-refinement',
      label: 'Language Refinement',
      description: 'Convert long or overly technical answers into short, executive, empathetic, boundary, and decision versions.',
      sourceFile: `${sourceRoot}/language-refinement.md`,
      status: 'to-confirm',
      evidenceCaptured: true,
      operatorNote: 'This stage is central to VALOUR value because it turns expert thinking into usable leadership language.',
    },
    {
      id: 'after-action-review',
      label: 'After-Action Review',
      description: 'Capture what happened, what worked, what failed, what changed, and whether VALOUR helped.',
      sourceFile: `${sourceRoot}/after-action-review.md`,
      status: 'to-confirm',
      evidenceCaptured: true,
      operatorNote: 'Future pilots should make this a strict completion gate.',
    },
    {
      id: 'pattern-report',
      label: 'Pattern Report',
      description: 'Identify the recurring leadership pattern, primary strength, primary risk, and next development focus.',
      sourceFile: `${sourceRoot}/pattern-report.md`,
      status: 'to-confirm',
      evidenceCaptured: true,
      operatorNote: 'This is where VALOUR becomes repeatable IP rather than a one-off coaching conversation.',
    },
    {
      id: 'evidence-record',
      label: 'Evidence Record',
      description: 'Record the product learning, evidence strength, testimonial candidate status, and next product decision.',
      sourceFile: `${sourceRoot}/evidence-record.md`,
      status: 'to-confirm',
      evidenceCaptured: true,
      operatorNote: 'This closes the pilot loop and should drive the decision to repeat, revise, pause, or archive.',
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
