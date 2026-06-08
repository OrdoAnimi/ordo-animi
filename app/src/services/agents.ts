import type { AgentContext, AgentLogEntry, PilotRun, PilotState, StageOutput } from '../data/types';
import { callAgent } from './aiService';

export type DependencyCheck = { ok: boolean; message?: string };

const canonicalStage = (stageId: string) => ({
  'p2-s01': 'stage-01-intake',
  'p2-s02': 'stage-02-scenario',
  'p2-s03': 'stage-03-prep',
  'p2-s04': 'stage-04-rehearsal',
  'p2-s05': 'stage-05-language',
  'p2-s06': 'stage-06-review',
  'p2-s07': 'stage-07-pattern',
  'p2-s08': 'stage-08-outcome',
}[stageId] ?? stageId);

const entryFor = (state: PilotState, canonicalId: string) => {
  const aliases: Record<string, string[]> = {
    'stage-01-intake': ['stage-01-intake', 'p2-s01'],
    'stage-02-scenario': ['stage-02-scenario', 'p2-s02'],
    'stage-03-prep': ['stage-03-prep', 'p2-s03'],
    'stage-04-rehearsal': ['stage-04-rehearsal', 'p2-s04'],
    'stage-05-language': ['stage-05-language', 'p2-s05'],
    'stage-06-review': ['stage-06-review', 'p2-s06'],
    'stage-07-pattern': ['stage-07-pattern', 'p2-s07'],
    'stage-08-outcome': ['stage-08-outcome', 'p2-s08'],
  };
  return (aliases[canonicalId] ?? [canonicalId]).map(id => state.entries[id]).find(Boolean);
};

export function checkDependency(stageId: string, state: PilotState): DependencyCheck {
  const id = canonicalStage(stageId);
  switch (id) {
    case 'stage-01-intake': return { ok: true };
    case 'stage-02-scenario': return entryFor(state, 'stage-01-intake')?.userInput ? { ok: true } : { ok: false, message: 'Save your context first.' };
    case 'stage-03-prep': return entryFor(state, 'stage-02-scenario')?.output ? { ok: true } : { ok: false, message: 'Confirm your scenario first.' };
    case 'stage-04-rehearsal': return entryFor(state, 'stage-03-prep')?.output ? { ok: true } : { ok: false, message: 'Generate your Preparation Brief first.' };
    case 'stage-05-language': return state.rehearsal?.response?.status === 'submitted' ? { ok: true } : { ok: false, message: 'Submit one rehearsal response before refining your language.' };
    case 'stage-06-review': return state.rehearsal?.status === 'complete' && !!state.rehearsal.preferredResponse?.trim() ? { ok: true } : { ok: false, message: 'Save your preferred refined response before reflection.' };
    case 'stage-07-pattern': return entryFor(state, 'stage-06-review')?.output ? { ok: true } : { ok: false, message: 'Complete your reflection first.' };
    case 'stage-08-outcome': return entryFor(state, 'stage-07-pattern')?.output ? { ok: true } : { ok: false, message: 'Generate your Leadership Pattern Report first.' };
    default: return { ok: true };
  }
}

function buildContext(pilot: PilotRun, state: PilotState, extra?: Partial<AgentContext>): AgentContext {
  let intakeData = state.intakeData ?? {};
  const intakeRaw = entryFor(state, 'stage-01-intake')?.userInput;
  if (intakeRaw && !state.intakeData) {
    try { intakeData = JSON.parse(intakeRaw); } catch { /* ignore */ }
  }

  const previousOutputs: Record<string, string> = {};
  for (const [id, entry] of Object.entries(state.entries)) {
    if (entry.output?.content) previousOutputs[id] = entry.output.content;
    if (entry.userInput) previousOutputs[`${id}:userInput`] = entry.userInput;
  }
  if (state.rehearsal?.response?.responseText) previousOutputs['stage-04-rehearsal:userInput'] = state.rehearsal.response.responseText;
  if (state.rehearsal?.preferredResponse) previousOutputs['stage-05-language:preferredResponse'] = state.rehearsal.preferredResponse;

  const scenarioTitle = pilot.title.includes(':') ? pilot.title.split(':')[1].trim() : pilot.title;
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

async function run(agent: string, stageId: string, pilot: PilotRun, state: PilotState, extra?: Partial<AgentContext>) {
  const result = await callAgent(agent, buildContext(pilot, state, extra));
  return { output: result, logEntry: makeLogEntry(stageId, `${agent}Agent`, result) };
}

export type AgentFn = (pilot: PilotRun, state: PilotState, userInput?: string) => Promise<{ output: StageOutput; logEntry: AgentLogEntry }>;

const canonicalAgents: Record<string, AgentFn> = {
  'stage-02-scenario': (p, s) => run('scenarioSelector', 'stage-02-scenario', p, s),
  'stage-03-prep': (p, s) => run('preparation', 'stage-03-prep', p, s),
  'stage-04-rehearsal': (p, s) => run('rehearsal', 'stage-04-rehearsal', p, s),
  'stage-05-language': (p, s) => run('languageRefinement', 'stage-05-language', p, s, { userInput: s.rehearsal?.response?.responseText ?? '' }),
  'stage-06-review': (p, s) => run('afterActionReview', 'stage-06-review', p, s),
  'stage-07-pattern': (p, s) => run('patternReport', 'stage-07-pattern', p, s),
  'stage-08-outcome': (p, s) => run('vallumHandover', 'stage-08-outcome', p, s),
};

export const STAGE_AGENTS: Record<string, AgentFn> = {
  ...canonicalAgents,
  'p2-s02': canonicalAgents['stage-02-scenario'],
  'p2-s03': canonicalAgents['stage-03-prep'],
  'p2-s04': canonicalAgents['stage-04-rehearsal'],
  'p2-s05': canonicalAgents['stage-05-language'],
  'p2-s06': canonicalAgents['stage-06-review'],
  'p2-s07': canonicalAgents['stage-07-pattern'],
  'p2-s08': canonicalAgents['stage-08-outcome'],
};
