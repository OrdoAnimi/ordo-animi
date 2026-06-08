export type Scenario = {
  id: string;
  title: string;
  situation: string;
  userRisk: string;
  desiredOutcome: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'VALOUR-S01',
    title: 'Architecture Review Board',
    situation: 'Present a design decision, risk, or recommendation to a review forum and secure endorsement.',
    userRisk: 'Over-explaining the technical design, losing executive altitude, failing to close the decision.',
    desiredOutcome: 'The board understands the recommendation, trade-offs, decision required, and next steps.',
    difficulty: 'advanced',
  },
  {
    id: 'VALOUR-S02',
    title: 'Executive Design Challenge',
    situation: 'Explain a complex technology decision to senior stakeholders in under five minutes.',
    userRisk: 'Too much technical detail, missing the business impact, failing to name the decision.',
    desiredOutcome: 'The executive understands the recommendation, risk, and decision required.',
    difficulty: 'advanced',
  },
  {
    id: 'VALOUR-S03',
    title: 'Discovery Workshop',
    situation: 'Guide a mixed stakeholder group through ambiguity to extract goals, constraints, and decisions.',
    userRisk: 'Talking too much, jumping to solutions, losing control of the room.',
    desiredOutcome: 'Clear inputs, decisions, constraints, and follow-up actions captured.',
    difficulty: 'intermediate',
  },
  {
    id: 'VALOUR-S04',
    title: 'Challenging a Poor Solution',
    situation: 'Raise a concern about a weak or risky design without becoming dismissive or obstructive.',
    userRisk: 'Sounding arrogant, damaging trust, failing to offer a constructive path forward.',
    desiredOutcome: 'The concern is understood and the group moves toward a better option.',
    difficulty: 'advanced',
  },
  {
    id: 'VALOUR-S05',
    title: 'Security or Risk Pushback',
    situation: 'Handle a direct challenge from security, risk, or compliance stakeholders.',
    userRisk: 'Becoming defensive, dismissive of the concern, or too technical in response.',
    desiredOutcome: 'Risk concern acknowledged, mitigation agreed, practical path forward confirmed.',
    difficulty: 'intermediate',
  },
  {
    id: 'VALOUR-S06',
    title: 'Stakeholder Conflict Meeting',
    situation: 'Navigate tension with a project manager or delivery lead who is pushing back on architecture concerns.',
    userRisk: 'Sounding like a blocker, escalating unnecessarily, abandoning the architecture position.',
    desiredOutcome: 'Agreement on the issue, impact, minimum architecture position, and next action.',
    difficulty: 'intermediate',
  },
  {
    id: 'VALOUR-S07',
    title: 'Architecture Trade-Off Explanation',
    situation: 'Explain two or three options with their trade-offs and make a clear recommendation.',
    userRisk: 'Presenting too many options, failing to recommend, overwhelming the audience.',
    desiredOutcome: 'Stakeholders understand the options, trade-off, recommendation, and decision criteria.',
    difficulty: 'foundational',
  },
  {
    id: 'VALOUR-S08',
    title: 'Strategy to Architecture Translation',
    situation: 'Convert a business strategy into architecture options and executable next steps.',
    userRisk: 'Staying too abstract or jumping too quickly into technology.',
    desiredOutcome: 'Strategy translated into capabilities, constraints, options, and sequence.',
    difficulty: 'intermediate',
  },
  {
    id: 'VALOUR-S09',
    title: 'First Meeting with a New Team',
    situation: 'Enter a new team, program, or client engagement and establish credibility and trust.',
    userRisk: 'Over-positioning, talking too much, appearing detached or superior.',
    desiredOutcome: 'Credibility established, role clarified, team trust started.',
    difficulty: 'foundational',
  },
  {
    id: 'VALOUR-S10',
    title: 'End-of-Day Handover',
    situation: 'Close the professional day, capture open loops, and transition into personal recovery mode.',
    userRisk: 'Carrying unfinished work mentally, not recovering, over-working.',
    desiredOutcome: 'Work closed enough for today. Personal plan active.',
    difficulty: 'foundational',
  },
];
