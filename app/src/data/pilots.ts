import { pilot001 } from './pilot-001';
import { pilot002 } from './pilot-002';
import { SCENARIOS } from './scenarios';
import type { PilotRun } from './types';

const generatedPilots: PilotRun[] = SCENARIOS.slice(2).map((scenario) => ({
  ...pilot001,
  id: `PILOT-${scenario.id.replace('VALOUR-', '')}`,
  title: `Pilot: ${scenario.title}`,
  status: 'planned',
  scenario: scenario.situation,
  productQuestion: `Does the VALOUR prepare-rehearse-debrief loop help the participant handle the ${scenario.title} scenario with clearer framing and stronger language?`,
  runObjective: scenario.desiredOutcome,
  sourcePath: `generated/${scenario.id.toLowerCase()}`,
  stages: pilot001.stages.map((stage) => ({
    ...stage,
    status: 'not-started',
    evidenceCaptured: false,
    operatorNote: '',
    description: stage.label === 'Scenario Selection'
      ? `Confirm the selected scenario: ${scenario.title}. ${scenario.situation}`
      : stage.label === 'Rehearsal'
        ? `Practise a realistic challenge from ${scenario.counterpart ?? 'the stakeholder'} and respond as ${scenario.yourRole ?? 'the participant'}.`
        : stage.description,
  })),
  evidence: {
    clarityImprovement: '',
    mainPattern: '',
    mainProductLearning: '',
    testimonialCandidate: false,
  },
  productDecision: {
    decision: 'continue',
    rationale: 'Session template ready for participant rehearsal.',
    nextStep: 'Complete the session and review the generated debrief.',
  },
  pattern: {
    scenarioUsed: scenario.title,
    startingChallenge: scenario.userRisk,
    mainImprovement: '',
    primaryPattern: '',
    primaryStrength: '',
    primaryRisk: scenario.userRisk,
    nextFocus: scenario.desiredOutcome,
    usefulLanguage: [],
    usefulnessScore: 0,
  },
  operatorNotes: [],
}));

export const ALL_PILOTS: PilotRun[] = [pilot001, pilot002, ...generatedPilots];

export function getPilotById(id: string): PilotRun {
  return ALL_PILOTS.find(pilot => pilot.id === id) ?? pilot001;
}
