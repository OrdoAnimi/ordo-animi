import type { PilotRun } from './types';

export const pilot002: PilotRun = {
  id: 'PILOT-002',
  title: 'Pilot 002: Executive Briefing',
  status: 'complete',
  scenario: 'Briefing CFO and CIO on a cloud migration decision — lift-and-shift versus re-platform.',
  productQuestion:
    'Does VALOUR\u2122 help a solution architect translate a technical migration decision into executive language?',
  runObjective:
    'Prove the VALOUR loop is repeatable with an executive briefing scenario — different audience, different pattern, same confidence improvement signal.',
  sourcePath: 'pilot/runs/pilot-002-executive-briefing',
  stages: [
    {
      id: 'p2-s01',
      label: 'Context',
      description: 'Capture user role, context, and leadership situation. VALOUR\u2122 uses this to personalise every stage.',
      sourceFile: '01-intake.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'User: Senior Solution Architect, cloud transformation programme. Key risk: using architecture language with a financial audience. Baseline confidence: 4/10.',
      guidance: {
        what: 'VALOUR maps your situation and role to personalise every stage of the workflow.',
        provides: 'Your role, the leadership situation, desired outcome, and starting confidence.',
        generates: 'Nothing — your context drives all downstream AI generation.',
        next: 'Save your context, then move to Stage 02 to identify the best-fit scenario.',
      },
    },
    {
      id: 'p2-s02',
      label: 'Scenario Selection',
      description: 'Map the user situation to the best-fit VALOUR scenario and variant.',
      sourceFile: '02-scenario.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'VALOUR-S04 Executive Briefing selected. Variant: cloud migration investment decision for CFO and CIO. Fit score: 9/10.',
      guidance: {
        what: 'VALOUR maps your situation to the best-fit leadership scenario and variant.',
        provides: 'Your saved context from Stage 01.',
        generates: 'A scenario match with variant, fit score, and scenario-specific framing.',
        next: 'Review the scenario selection, then generate your Preparation Brief in Stage 03.',
      },
    },
    {
      id: 'p2-s03',
      label: 'Preparation Brief',
      description: 'Build a short preparation brief with audience, decision, key message, likely questions, and closing statement.',
      sourceFile: '03-preparation.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Executive-mode brief generated. Primary framing: investment decision with managed risk, not a technical migration. CFO lens: cost, risk, return. CIO lens: capability, speed, control.',
      guidance: {
        what: 'VALOUR builds a concise brief covering audience, decision frame, key message, likely questions, and closing statement.',
        provides: 'Your context and scenario from earlier stages.',
        generates: 'A structured preparation brief ready to use as a rehearsal reference.',
        next: 'Read the brief, then record your rehearsal answer in Stage 04.',
      },
    },
    {
      id: 'p2-s04',
      label: 'Rehearsal',
      description: 'Practise one executive question. Record first answer, improved answer, and learning point.',
      sourceFile: '04-rehearsal.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Key learning: first answer defaulted to architecture-layer language (dependency chains, re-platform complexity). Improved answer led with financial risk framing and business consequence before technical detail.',
      guidance: {
        what: 'VALOUR generates practice executive questions based on your scenario. You record your first answer to one question.',
        provides: 'Your rehearsal answer to a selected question.',
        generates: 'Executive-level rehearsal questions tailored to your scenario.',
        next: 'Save your rehearsal answer, then move to Stage 05 to refine your language.',
      },
    },
    {
      id: 'p2-s05',
      label: 'Language Refinement',
      description: 'Refine a rough answer into short, executive, empathetic, and decision-oriented versions.',
      sourceFile: '05-language.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Decision version was most useful — led with recommendation, consequence, and risk mitigation. Executive version was second. Both stripped architecture language in favour of financial and outcome language.',
      guidance: {
        what: 'VALOUR takes your rehearsal answer and produces four refined versions: short, executive, empathetic, and decision-oriented.',
        provides: 'Your saved rehearsal answer from Stage 04.',
        generates: 'Four language variants to use in your actual conversation.',
        next: 'Choose the best variant or combine elements, then generate your After-Action Review in Stage 06.',
      },
    },
    {
      id: 'p2-s06',
      label: 'After-Action Review',
      description: 'Review what worked, what did not, where clarity and language improved, and what to change next time.',
      sourceFile: '06-review.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Key improvement: executive-facing preparation brief needs a dedicated financial framing mode that translates technical positions into risk, cost, and business consequence language before rehearsal begins.',
      guidance: {
        what: 'VALOUR reviews what worked, what to change, and where your clarity and language improved.',
        provides: 'All outputs from earlier stages.',
        generates: 'A structured after-action review with key learnings and next actions.',
        next: 'Review your learnings, then generate your Pattern Summary in Stage 07.',
      },
    },
    {
      id: 'p2-s07',
      label: 'Pattern Summary',
      description: 'Summarise starting challenge, improvement, primary pattern, and next development focus.',
      sourceFile: '07-pattern.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Primary pattern: executive translation gap. Next focus: enter every executive briefing by establishing financial and business consequence framing before explaining the architecture.',
      guidance: {
        what: 'VALOUR identifies your primary leadership communication pattern and generates a personal development focus.',
        provides: 'Your full workflow history from this pilot run.',
        generates: 'A personalised Pattern Report — primary pattern, strengths, risks, and next focus.',
        next: 'Review your Pattern Report, then record your outcome in Stage 08.',
      },
    },
    {
      id: 'p2-s08',
      label: 'Outcome Record',
      description: 'Capture final confidence, usefulness scores, recommendation signal, and product decision.',
      sourceFile: '08-outcome.md',
      status: 'complete',
      evidenceCaptured: true,
      operatorNote: 'Confidence: 4 to 7. All usefulness scores 7 or above. Decision: continue. Key product gap: Preparation Brief needs an executive financial framing mode. Move to Release 0.3 evidence comparison.',
      guidance: {
        what: 'VALOUR captures your final confidence score, usefulness assessment, and product recommendation signal.',
        provides: 'Your self-assessed outcome scores after completing the workflow.',
        generates: 'An outcome record summarising your VALOUR pilot run.',
        next: 'Review your completed report and export or share the results.',
      },
    },
  ],
  evidence: {
    startingConfidence: 4,
    endingConfidence: 7,
    clarityImprovement:
      "Answer shifted from 'the re-platform approach has a 14-month dependency chain' to 'the recommendation is to proceed with the managed migration — we have the controls to contain the risk and the business case supports the investment.' Framing moved from architecture description to executive decision language.",
    mainPattern: 'Executive translation gap.',
    mainProductLearning:
      'The Preparation Brief stage needs a dedicated executive financial framing mode. For executive-facing scenarios, translating the technical position into business consequence and financial risk language before rehearsal begins is the highest-value step.',
    testimonialCandidate: true,
  },
  productDecision: {
    decision: 'continue',
    rationale:
      'The VALOUR loop proved useful for a second, distinct scenario type. Confidence improved from 4 to 7 in an executive briefing context — a harder scenario than Pilot 001 with the same confidence improvement delta (+3). The pattern identified (executive translation gap) is meaningfully different from Pilot 001 (technical confidence without decision framing), confirming that VALOUR adapts to the scenario. The pilot is repeatable.',
    nextStep:
      'Build the Release 0.3 evidence comparison view and artefact limb integration baseline. Then recruit a real pilot user for an executive briefing scenario.',
  },
  pattern: {
    scenarioUsed: 'Briefing CFO and CIO on a cloud migration decision — lift-and-shift versus re-platform.',
    startingChallenge:
      'The user had a thorough understanding of the migration complexity but defaulted to architecture-layer language when facing a financial and business audience.',
    mainImprovement:
      'The user moved from describing the migration architecture to framing the decision as a managed investment with quantified risk and a clear recommendation.',
    primaryPattern: 'Executive translation gap.',
    primaryStrength: 'Deep understanding of migration complexity, dependency chains, technical risk, and delivery controls.',
    primaryRisk:
      'The user may default to architecture terms (re-platform, lift-and-shift, dependency map) in an executive conversation that requires financial and business consequence language.',
    nextFocus:
      'Enter every executive briefing by establishing the financial and business consequence frame first, then offer technical context only when the audience asks for it.',
    usefulLanguage: [
      'The recommendation is to proceed with the managed migration — we have the controls to contain the risk and the business case supports the investment.',
      'The risk is not the technical complexity. The risk is the delivery timeline if we do not make a decision in this quarter.',
      'This is an investment decision, not an architecture decision. The architecture is ready. The question is whether the business appetite for managed risk is aligned.',
    ],
    usefulnessScore: 8,
  },
  operatorNotes: [
    'This is a simulated pilot run. SIM-002 is not a real user.',
    'Evidence scores are operator estimates based on simulated workflow execution.',
    'The Preparation Brief stage needs a dedicated executive financial framing mode before real-user pilots in executive briefing scenarios.',
    'Language Refinement — Decision version — is the highest-value demonstrable output from this run.',
    'Do not share this run record externally without redacting operator simulation notes.',
    'Compare with PILOT-001 to validate repeatability signal. See pilot/evidence-comparison/release-0.3-evidence-comparison.md.',
  ],
};
