import type { PilotRun } from './types';

export const pilot001: PilotRun = {
  id: 'PILOT-001',
  title: 'Pilot 001: Architecture Review Board',
  status: 'complete',
  scenario: 'Architecture review board for a cloud integration design.',
  productQuestion:
    'Does the VALOUR prepare-rehearse-refine-review loop help an architect enter a board-level conversation with clearer framing and better language?',
  runObjective:
    'Prove the VALOUR loop end-to-end with one simulated pilot user preparing for an architecture review board.',
  sourcePath: 'pilot/runs/pilot-001-architecture-review-board',
  stages: [
    {
      id: 'stage-01-intake',
      label: 'Context',
      description:
        'Capture your role, the leadership situation you are preparing for, and your desired outcome. VALOUR™ uses this to personalise every stage.',
      sourceFile: '01-intake.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote:
        'User: Senior Solution Architect, enterprise transformation. Key risk: technical correctness without decision clarity. Baseline confidence: 5/10.',
      guidance: {
        what: 'VALOUR maps your situation and role to personalise every stage of the workflow.',
        provides: 'Your role, the leadership situation, desired outcome, and starting confidence.',
        generates: 'Nothing — your context drives all downstream AI generation.',
        next: 'Save your context, then move to Stage 02 to identify the best-fit scenario.',
      },
    },
    {
      id: 'stage-02-scenario',
      label: 'Scenario Selection',
      description:
        'Map the user situation to the best-fit VALOUR scenario and variant.',
      sourceFile: '02-scenario-selection.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote:
        'VALOUR-S01 Architecture Review Board selected. Variant: cloud integration design under delivery pressure. Fit score: 9/10.',
      guidance: {
        what: 'VALOUR maps your situation to the best-fit leadership scenario and variant.',
        provides: 'Your saved context from Stage 01.',
        generates: 'A scenario match with variant, fit score, and scenario-specific framing.',
        next: 'Review the scenario selection, then generate your Preparation Brief in Stage 03.',
      },
    },
    {
      id: 'stage-03-prep',
      label: 'Preparation Brief',
      description:
        'Build a short preparation brief with audience, decision, key message, likely questions, and closing statement.',
      sourceFile: '03-preparation-brief.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote:
        'Brief strong enough for rehearsal. Main test: can the architect keep answers short when challenged?',
      guidance: {
        what: 'VALOUR builds a concise brief covering audience, decision frame, key message, likely questions, and closing statement.',
        provides: 'Your context and scenario from earlier stages.',
        generates: 'A structured preparation brief ready to use as a rehearsal reference.',
        next: 'Read the brief, then record your rehearsal answer in Stage 04.',
      },
    },
    {
      id: 'stage-04-rehearsal',
      label: 'Rehearsal',
      description:
        'Practise one board question. Record first answer, improved answer, and learning point.',
      sourceFile: '04-board-question.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote:
        'Key learning: start with decision frame before implementation detail. Improved answer led with conditional approval framing.',
      guidance: {
        what: 'VALOUR generates practice board questions based on your scenario. You record your first answer to one question.',
        provides: 'Your rehearsal answer to a selected question.',
        generates: 'Board-level rehearsal questions tailored to your scenario.',
        next: 'Save your rehearsal answer, then move to Stage 05 to refine your language.',
      },
    },
    {
      id: 'stage-05-language',
      label: 'Language Refinement',
      description:
        'Refine a rough answer into short, executive, empathetic, and decision-oriented versions.',
      sourceFile: '05-language-refinement.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote:
        'Executive version recommended as primary. Decision version used as close. Clear product value demonstrated.',
      guidance: {
        what: 'VALOUR takes your rehearsal answer and produces four refined versions: short, executive, empathetic, and decision-oriented.',
        provides: 'Your saved rehearsal answer from Stage 04.',
        generates: 'Four language variants to use in your actual conversation.',
        next: 'Choose the best variant or combine elements, then generate your After-Action Review in Stage 06.',
      },
    },
    {
      id: 'stage-06-review',
      label: 'After-Action Review',
      description:
        'Review what worked, what did not, where clarity and cadence improved, and what to change next time.',
      sourceFile: '06-after-action-review.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote:
        'Product gap identified: rehearsal stage needs structured multi-question workspace. Biggest near-term build need.',
      guidance: {
        what: 'VALOUR reviews what worked, what to change, and where your clarity and cadence improved.',
        provides: 'All outputs from earlier stages.',
        generates: 'A structured after-action review with key learnings and next actions.',
        next: 'Review your learnings, then generate your Pattern Summary in Stage 07.',
      },
    },
    {
      id: 'stage-07-pattern',
      label: 'Pattern Summary',
      description:
        'Summarise starting challenge, improvement, primary pattern, and next development focus.',
      sourceFile: '07-pattern-summary.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote:
        'Primary pattern: technical confidence without decision framing. Next focus: lead every board answer with the decision frame first.',
      guidance: {
        what: 'VALOUR identifies your primary leadership communication pattern and generates a personal development focus.',
        provides: 'Your full workflow history from this pilot run.',
        generates: 'A personalised Pattern Report — primary pattern, strengths, risks, and next focus.',
        next: 'Review your Pattern Report, then record your outcome in Stage 08.',
      },
    },
    {
      id: 'stage-08-outcome',
      label: 'Outcome Record',
      description:
        'Capture final confidence, usefulness scores, recommendation signal, and product decision.',
      sourceFile: '08-outcome-record.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote:
        'All scores 8+. Would use again and would recommend. Decision: continue. Move to Pilot Console v0.1 build.',
      guidance: {
        what: 'VALOUR captures your final confidence score, usefulness assessment, and product recommendation signal.',
        provides: 'Your self-assessed outcome scores after completing the workflow.',
        generates: 'An outcome record summarising your VALOUR pilot run.',
        next: 'Review your completed report and export or share the results.',
      },
    },
  ],
  evidence: {
    startingConfidence: 5,
    endingConfidence: 8,
    clarityImprovement:
      "Answer shifted from 'the design is technically sound' to 'the recommendation is conditional approval' — framing moved from defence to decision.",
    mainPattern: 'Technical confidence without decision framing.',
    mainProductLearning:
      'The first app should focus on guided workflow, structured question generation, language refinement, and pattern summary generation.',
    testimonialCandidate: true,
  },
  productDecision: {
    decision: 'continue',
    rationale:
      'The VALOUR loop proved useful in a single simulated run. Confidence improved from 5 to 8. All usefulness scores at 8/10 or above. The workflow converted a technical design conversation into a board-level decision conversation. The pilot is repeatable with a cleaner rehearsal workspace.',
    nextStep:
      'Build the VALOUR Pilot Console v0.1: guided intake, scenario selection, preparation brief, structured rehearsal, language refinement, review, and pattern summary.',
  },
  pattern: {
    scenarioUsed: 'Architecture review board for a cloud integration design.',
    startingChallenge:
      'The user understood the design but risked losing the board by over-explaining and not making the decision frame explicit.',
    mainImprovement:
      'The user moved from defending the design to framing the board decision as conditional approval with clear trade-offs and next actions.',
    primaryPattern: 'Technical confidence without enough decision framing.',
    primaryStrength: 'Strong understanding of technical risk, controls, and delivery constraints.',
    primaryRisk:
      'The user may answer from implementation detail before establishing the leadership frame.',
    nextFocus:
      'Start every board-level answer with the decision frame first, then explain the supporting detail only as needed.',
    usefulLanguage: [
      'The recommendation is conditional approval, not unconditional approval.',
      'The trade-off is speed with controlled governance, not speed without governance.',
    ],
    usefulnessScore: 8,
  },
  operatorNotes: [
    'This is a simulated pilot run. SIM-001 is not a real user.',
    'Evidence scores are operator estimates based on simulated workflow execution.',
    'The rehearsal stage needs a multi-question structured workspace before real-user pilots.',
    'Language refinement is the highest-value demonstrable output from this run.',
    'Do not share this run record externally without redacting operator simulation notes.',
  ],
};
