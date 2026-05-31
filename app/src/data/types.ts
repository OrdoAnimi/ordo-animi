export type PilotStatus = 'planned' | 'in-progress' | 'complete' | 'archived';

export type StageStatus = 'not-started' | 'draft' | 'complete' | 'to-confirm';

export type ProductDecisionValue = 'continue' | 'repeat' | 'revise' | 'pause' | 'archive';

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
  operatorNotes: string[];
};
