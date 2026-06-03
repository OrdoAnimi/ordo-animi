import type { PilotRun } from './types';

export const pilot002: PilotRun = {
  id: 'PILOT-002',
  title: 'Pilot 002: Executive Briefing',
  status: 'planned',
  scenario: 'Briefing senior stakeholders on a complex cloud migration decision.',
  productQuestion:
    'Does VALOUR™ help a solution architect translate a technical migration decision into executive language?',
  runObjective:
    'Prove the VALOUR loop with a real or simulated executive briefing scenario.',
  sourcePath: 'pilot/runs/pilot-002-executive-briefing',
  stages: [
    { id: 'p2-s01', label: 'Intake',              description: 'Capture user role, context, and leadership situation.', sourceFile: '01-intake.md',          status: 'not-started', evidenceCaptured: false, operatorNote: '' },
    { id: 'p2-s02', label: 'Scenario',             description: 'Select and validate the executive briefing scenario.',  sourceFile: '02-scenario.md',       status: 'not-started', evidenceCaptured: false, operatorNote: '' },
    { id: 'p2-s03', label: 'Preparation Brief',    description: 'Build preparation brief for the executive audience.',   sourceFile: '03-preparation.md',    status: 'not-started', evidenceCaptured: false, operatorNote: '' },
    { id: 'p2-s04', label: 'Rehearsal',            description: 'Practise the five-minute executive briefing format.',   sourceFile: '04-rehearsal.md',      status: 'not-started', evidenceCaptured: false, operatorNote: '' },
    { id: 'p2-s05', label: 'Language Refinement',  description: 'Refine answers into executive-ready language.',        sourceFile: '05-language.md',       status: 'not-started', evidenceCaptured: false, operatorNote: '' },
    { id: 'p2-s06', label: 'After-Action Review',  description: 'Review what worked and what failed.',                  sourceFile: '06-review.md',         status: 'not-started', evidenceCaptured: false, operatorNote: '' },
    { id: 'p2-s07', label: 'Pattern Summary',      description: 'Identify primary pattern and next focus.',             sourceFile: '07-pattern.md',        status: 'not-started', evidenceCaptured: false, operatorNote: '' },
    { id: 'p2-s08', label: 'Outcome Record',       description: 'Record final confidence, scores, and product decision.', sourceFile: '08-outcome.md',      status: 'not-started', evidenceCaptured: false, operatorNote: '' },
  ],
  evidence: {
    clarityImprovement: 'Pending — pilot not yet run.',
    mainPattern:        'Pending.',
    mainProductLearning: 'Pending.',
    testimonialCandidate: false,
  },
  productDecision: {
    decision: 'continue',
    rationale: 'Planned — awaiting real pilot user.',
    nextStep:  'Recruit an executive briefing pilot user and run intake.',
  },
  pattern: {
    scenarioUsed:      'Executive briefing for a cloud migration decision.',
    startingChallenge: 'Pending.',
    mainImprovement:   'Pending.',
    primaryPattern:    'Pending.',
    primaryStrength:   'Pending.',
    primaryRisk:       'Pending.',
    nextFocus:         'Pending.',
    usefulLanguage:    [],
    usefulnessScore:   0,
  },
  operatorNotes: [
    'PILOT-002 is planned but not yet run.',
    'Awaiting first real pilot user recruitment.',
  ],
};
