import type { AgentContext, PilotRun, PilotState, StageOutput } from '../data/types';
import { callAgent } from './aiService';

function buildContext(pilot: PilotRun, state: PilotState, extra?: Partial<AgentContext>): AgentContext {
  const previousOutputs: Record<string, string> = {};
  for (const [id, entry] of Object.entries(state.entries)) {
    if (entry.output?.content) previousOutputs[id] = entry.output.content;
    if (entry.userInput) previousOutputs[`${id}:userInput`] = entry.userInput;
  }

  return {
    pilotId: pilot.id,
    scenarioTitle: pilot.stages[1]?.label || pilot.title,
    scenarioDescription: pilot.scenario,
    role: state.intakeData?.role,
    organisation: state.intakeData?.organisation,
    situation: state.intakeData?.situation,
    outcome: state.intakeData?.outcome,
    previousOutputs,
    ...extra,
  };
}

export async function scenarioSelectorAgent(pilot: PilotRun, state: PilotState): Promise<StageOutput> {
  return callAgent('scenarioSelector', buildContext(pilot, state));
}

export async function preparationAgent(pilot: PilotRun, state: PilotState): Promise<StageOutput> {
  return callAgent('preparation', buildContext(pilot, state));
}

export async function rehearsalAgent(pilot: PilotRun, state: PilotState): Promise<StageOutput> {
  return callAgent('rehearsal', buildContext(pilot, state));
}

export async function languageRefinementAgent(
  pilot: PilotRun,
  state: PilotState,
  userInput: string,
): Promise<StageOutput> {
  return callAgent('languageRefinement', buildContext(pilot, state, { userInput }));
}

export async function afterActionReviewAgent(pilot: PilotRun, state: PilotState): Promise<StageOutput> {
  return callAgent('afterActionReview', buildContext(pilot, state));
}

export async function patternReportAgent(pilot: PilotRun, state: PilotState): Promise<StageOutput> {
  return callAgent('patternReport', buildContext(pilot, state));
}

export async function vallumHandoverAgent(pilot: PilotRun, state: PilotState): Promise<StageOutput> {
  return callAgent('vallumHandover', buildContext(pilot, state));
}

export type AgentFn = (pilot: PilotRun, state: PilotState, userInput?: string) => Promise<StageOutput>;

export const STAGE_AGENTS: Record<string, AgentFn> = {
  'stage-02-scenario': (p, s) => scenarioSelectorAgent(p, s),
  'stage-03-prep':     (p, s) => preparationAgent(p, s),
  'stage-04-rehearsal':(p, s) => rehearsalAgent(p, s),
  'stage-05-language': (p, s, u) => languageRefinementAgent(p, s, u ?? ''),
  'stage-06-review':   (p, s) => afterActionReviewAgent(p, s),
  'stage-07-pattern':  (p, s) => patternReportAgent(p, s),
  'stage-08-outcome':  (p, s) => vallumHandoverAgent(p, s),
};
