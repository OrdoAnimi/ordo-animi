import type { AgentContext, AgentLogEntry, PilotRun, PilotState, StageOutput } from '../data/types';
import { callAgent } from './aiService';

export type DependencyCheck = { ok: boolean; message?: string };

export function checkDependency(stageId: string, state: PilotState): DependencyCheck {
  const e = (id: string) => state.entries[id];

  switch (stageId) {
    case 'stage-01-intake':
      return { ok: true };

    case 'stage-02-scenario':
      return e('stage-01-intake')?.userInput
        ? { ok: true }
        : { ok: false, message: 'Save your context first.' };

    case 'stage-03-prep':
      return e('stage-02-scenario')?.output
        ? { ok: true }
        : { ok: false, message: 'Confirm your scenario first.' };

    case 'stage-04-rehearsal':
      return e('stage-03-prep')?.output
        ? { ok: true }
        : { ok: false, message: 'Generate your Preparation Brief first.' };

    case 'stage-05-language':
      return state.rehearsal?.response?.status === 'submitted'
        ? { ok: true }
        : { ok: false, message: 'Submit one rehearsal response before refining your language.' };

    case 'stage-06-review':
      return state.rehearsal?.status === 'complete' && !!state.rehearsal.preferredResponse?.trim()
        ? { ok: true }
        : { ok: false, message: 'Save your preferred refined response before reflection.' };

    case 'stage-07-pattern':
      return e('stage-06-review')?.output
        ? { ok: true }
        : { ok: false, message: 'Complete your reflection first.' };

    case 'stage-08-outcome':
      return e('stage-07-pattern')?.output
        ? { ok: true }
        : { ok: false, message: 'Generate your Leadership Pattern Report first.' };

    default:
      return { ok: true };
  }
}

function buildContext(pilot: PilotRun, state: PilotState, extra?: Partial<AgentContext>): AgentContext {
  let intakeData = state.intakeData ?? {};
  const intakeRaw = state.entries['stage-01-intake']?.userInput;
  if (intakeRaw && !state.intakeData) {
    try { intakeData = JSON.parse(intakeRaw); } catch { /* ignore */ }
  }

  const previousOutputs: Record<string, string> = {};
  for (const [id, entry] of Object.entries(state.entries)) {
    if (entry.output?.content) previousOutputs[id] = entry.output.content;
    if (entry.userInput) previousOutputs[`${id}:userInput`] = entry.userInput;
  }
  if (state.rehearsal?.response?.responseText) {
    previousOutputs['stage-04-rehearsal:userInput'] = state.rehearsal.response.responseText;
  }
  if (state.rehearsal?.preferredResponse) {
    previousOutputs['stage-05-language:preferredResponse'] = state.rehearsal.preferredResponse;
  }

  const scenarioTitle = pilot.title.includes(':')
    ? pilot.title.split(':')[1].trim()
    : pilot.title;

  return {
    pilotId: pilot.id,
    scenarioTitle,
    scenarioDescription: pilot.scenario,
    role: intakeData.role,
    organisation: intakeData.organisation,
    situation: intakeData.situation,
    outcome: intakeData.outcome,
    confidenceBefore: intakeData.confidenceBefore,
    previousOutputs,
    ...extra,
  };
}

function makeLogEntry(stageId: string, agentName: string, output: StageOutput & { logProvider?: string }): AgentLogEntry {
  return {
    stageId,
    agentName,
    source: output.source,
    provider: output.logProvider ?? output.provider ?? output.source,
    model: output.model,
    generatedAt: output.generatedAt,
    durationMs: output.durationMs,
  };
}

export async function scenarioSelectorAgent(pilot: PilotRun, state: PilotState) {
  const result = await callAgent('scenarioSelector', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-02-scenario', 'scenarioSelectorAgent', result) };
}

export async function preparationAgent(pilot: PilotRun, state: PilotState) {
  const result = await callAgent('preparation', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-03-prep', 'preparationAgent', result) };
}

export async function rehearsalAgent(pilot: PilotRun, state: PilotState) {
  const result = await callAgent('rehearsal', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-04-rehearsal', 'rehearsalAgent', result) };
}

export async function languageRefinementAgent(pilot: PilotRun, state: PilotState) {
  const answer = state.rehearsal?.response?.responseText ?? '';
  const result = await callAgent('languageRefinement', buildContext(pilot, state, { userInput: answer }));
  return { output: result, logEntry: makeLogEntry('stage-05-language', 'languageRefinementAgent', result) };
}

export async function afterActionReviewAgent(pilot: PilotRun, state: PilotState) {
  const result = await callAgent('afterActionReview', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-06-review', 'afterActionReviewAgent', result) };
}

export async function patternReportAgent(pilot: PilotRun, state: PilotState) {
  const result = await callAgent('patternReport', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-07-pattern', 'patternReportAgent', result) };
}

export async function vallumHandoverAgent(pilot: PilotRun, state: PilotState) {
  const result = await callAgent('vallumHandover', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-08-outcome', 'vallumHandoverAgent', result) };
}

export type AgentFn = (
  pilot: PilotRun,
  state: PilotState,
  userInput?: string,
) => Promise<{ output: StageOutput; logEntry: AgentLogEntry }>;

export const STAGE_AGENTS: Record<string, AgentFn> = {
  'stage-02-scenario': (p, s) => scenarioSelectorAgent(p, s),
  'stage-03-prep': (p, s) => preparationAgent(p, s),
  'stage-04-rehearsal': (p, s) => rehearsalAgent(p, s),
  'stage-05-language': (p, s) => languageRefinementAgent(p, s),
  'stage-06-review': (p, s) => afterActionReviewAgent(p, s),
  'stage-07-pattern': (p, s) => patternReportAgent(p, s),
  'stage-08-outcome': (p, s) => vallumHandoverAgent(p, s),
};
