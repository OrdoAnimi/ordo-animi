export type PilotStatus = 'planned' | 'in-progress' | 'complete' | 'archived';
export type StageStatus = 'not-started' | 'draft' | 'complete' | 'to-confirm';
export type ProductDecisionValue = 'continue' | 'repeat' | 'revise' | 'pause' | 'archive';
export type GenerationSource = 'ai' | 'local' | 'manual';
export type AppMode = 'participant' | 'facilitator' | 'developer';

export type StageGuidance = {
  what: string;
  provides: string;
  generates: string;
  next: string;
};

export type PilotStage = {
  id: string;
  label: string;
  description: string;
  sourceFile: string;
  status: StageStatus;
  evidenceCaptured: boolean;
  operatorNote: string;
  guidance?: StageGuidance;
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

export type GenerationProvenance = {
  source: 'ai' | 'local-template' | 'manual';
  provider?: 'anthropic' | 'openai';
  model?: string;
  promptVersion: string;
  generatedAt: string;
  durationMs?: number;
  fallbackReason?: string;
};

export type RehearsalQuestion = {
  id: string;
  topic: string;
  text: string;
  whyItMatters?: string;
};

export type RehearsalResponse = {
  questionId: string;
  responseText: string;
  inputMethod: 'typed' | 'voice-transcript';
  startedAt: string;
  submittedAt?: string;
  durationSeconds?: number;
  status: 'draft' | 'submitted';
};

export type RehearsalCritique = {
  strength: string;
  primaryRisk: string;
  nextChange: string;
  clarity?: string;
  decisionOrientation?: string;
  stakeholderAwareness?: string;
};

export type RehearsalState = {
  questions: RehearsalQuestion[];
  selectedQuestionId?: string;
  response?: RehearsalResponse;
  critique?: RehearsalCritique;
  refinements?: {
    concise?: string;
    executive?: string;
    empathetic?: string;
  };
  preferredResponse?: string;
  status: 'not-started' | 'question-selected' | 'response-draft' | 'response-submitted' | 'feedback-ready' | 'complete';
};

// ── Agentic state (persisted in localStorage) ─────────────────────────────────

export type StageOutput = {
  content: string;
  generatedAt: string;
  source: GenerationSource;
  model?: string;
  provider?: string;
  durationMs?: number;
};

export type PilotStateEntry = {
  stageId: string;
  status: StageStatus;
  output?: StageOutput;
  userInput?: string;
  savedAt?: string;
};

export type AgentLogEntry = {
  stageId: string;
  agentName: string;
  source: GenerationSource;
  provider: string;
  model?: string;
  generatedAt: string;
  durationMs?: number;
};

export type IntakeData = {
  role?: string;
  organisation?: string;
  situation?: string;
  outcome?: string;
  confidenceBefore?: number;
};

export type PilotState = {
  schemaVersion: number;
  pilotId: string;
  entries: Record<string, PilotStateEntry>;
  intakeData?: IntakeData;
  rehearsal?: RehearsalState;
  runLog: AgentLogEntry[];
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
  confidenceBefore?: number;
  previousOutputs: Record<string, string>;
  userInput?: string;
};
