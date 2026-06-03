export type PilotStatus = 'planned' | 'in-progress' | 'complete' | 'archived';
export type StageStatus = 'not-started' | 'draft' | 'complete' | 'to-confirm';
export type ProductDecisionValue = 'continue' | 'repeat' | 'revise' | 'pause' | 'archive';
export type GenerationSource = 'ai' | 'local' | 'manual';

export type PilotStage = {
  id: string;
  label: string;
  description: string;
  sourceFile: string;
  status: StageStatus;
  evidenceCaptured: boolean;
  operatorNote: string;
};

export type EvidenceSummary = {
  startingConfidence?: number;
  endingConfidence?: number;
  clarityImprovement: string;
  mainPattern: string;
  mainProductLearning: string;
  testimonialCandidate: boolean;
};

export type ProductDecision = {
  decision: ProductDecisionValue;
  rationale: string;
  nextStep: string;
};

export type PatternSummary = {
  scenarioUsed: string;
  startingChallenge: string;
  mainImprovement: string;
  primaryPattern: string;
  primaryStrength: string;
  primaryRisk: string;
  nextFocus: string;
  usefulLanguage: string[];
  usefulnessScore: number;
};

export type PilotRun = {
  id: string;
  title: string;
  status: PilotStatus;
  scenario: string;
  productQuestion: string;
  runObjective: string;
  sourcePath: string;
  stages: PilotStage[];
  evidence: EvidenceSummary;
  productDecision: ProductDecision;
  pattern: PatternSummary;
  operatorNotes: string[];
};

// ── Agentic state (persisted in localStorage) ─────────────────────────────────

export type StageOutput = {
  content: string;
  generatedAt: string;
  source: GenerationSource;
  model?: string;
};

export type PilotStateEntry = {
  stageId: string;
  status: StageStatus;
  output?: StageOutput;
  userInput?: string;
  savedAt?: string;
};

export type PilotState = {
  pilotId: string;
  entries: Record<string, PilotStateEntry>;
  intakeData?: {
    role?: string;
    organisation?: string;
    situation?: string;
    outcome?: string;
    confidenceBefore?: number;
  };
  startedAt: string;
  updatedAt: string;
};

// ── Agent types ────────────────────────────────────────────────────────────────

export type AgentContext = {
  pilotId: string;
  scenarioTitle: string;
  scenarioDescription: string;
  role?: string;
  organisation?: string;
  situation?: string;
  outcome?: string;
  previousOutputs: Record<string, string>;
  userInput?: string;
};
