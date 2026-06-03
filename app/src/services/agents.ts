import type { AgentContext, AgentLogEntry, PilotRun, PilotState, StageOutput } from '../data/types';
import { callAgent } from './aiService';

// ── Stage dependency rules ─────────────────────────────────────────────────────

export type DependencyCheck = { ok: boolean; message?: string };

export function checkDependency(stageId: string, state: PilotState): DependencyCheck {
  const e = (id: string) => state.entries[id];

  switch (stageId) {
    case 'stage-01-intake':
      return { ok: true };

    case 'stage-02-scenario':
      return e('stage-01-intake')?.userInput
        ? { ok: true }
        : { ok: false, message: 'Save your context in Stage 01 (Context) first.' };

    case 'stage-03-prep':
      return e('stage-02-scenario')?.output || e('stage-01-intake')?.userInput
        ? { ok: true }
        : { ok: false, message: 'Generate Stage 02 (Scenario Selection) first.' };

    case 'stage-04-rehearsal':
      return e('stage-03-prep')?.output
        ? { ok: true }
        : { ok: false, message: 'Generate your Preparation Brief (Stage 03) first.' };

    case 'stage-05-language': {
      const rehearsalEntry = e('stage-04-rehearsal');
      if (!rehearsalEntry) {
        return { ok: false, message: 'Record your rehearsal answer first. VALOUR needs your answer before it can refine your language.' };
      }
      const raw = rehearsalEntry.userInput ?? '';
      try {
        const parsed = JSON.parse(raw) as { answer?: string };
        if (typeof parsed === 'object' && parsed !== null && parsed.answer?.trim()) return { ok: true };
      } catch { /* ignore — check raw below */ }
      if (raw.trim()) return { ok: true };
      return { ok: false, message: 'Record your rehearsal answer first. VALOUR needs your answer before it can refine your language.' };
    }

    case 'stage-06-review':
      return e('stage-05-language')?.output || e('stage-04-rehearsal')?.output
        ? { ok: true }
        : { ok: false, message: 'Complete at least Rehearsal (Stage 04) before your After-Action Review.' };

    case 'stage-07-pattern':
      return e('stage-06-review')?.output
        ? { ok: true }
        : { ok: false, message: 'Generate your After-Action Review (Stage 06) first.' };

    case 'stage-08-outcome':
      return e('stage-07-pattern')?.output
        ? { ok: true }
        : { ok: false, message: 'Generate your Pattern Summary (Stage 07) first.' };

    default:
      return { ok: true };
  }
}

// ── Context builder ────────────────────────────────────────────────────────────

function buildContext(pilot: PilotRun, state: PilotState, extra?: Partial<AgentContext>): AgentContext {
  // Parse intake data from Stage 01 userInput (stored as JSON)
  let intakeData = state.intakeData ?? {};
  const intakeRaw = state.entries['stage-01-intake']?.userInput;
  if (intakeRaw && !state.intakeData) {
    try { intakeData = JSON.parse(intakeRaw); } catch { /* ignore */ }
  }

  // Build previousOutputs map (stageId → content + userInputs)
  const previousOutputs: Record<string, string> = {};
  for (const [id, entry] of Object.entries(state.entries)) {
    if (entry.output?.content) {
      previousOutputs[id] = entry.output.content;
    }
    if (entry.userInput) {
      previousOutputs[`${id}:userInput`] = entry.userInput;
    }
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

// ── Agent log builder ──────────────────────────────────────────────────────────

function makeLogEntry(stageId: string, agentName: string, output: StageOutput & { logProvider?: string }): AgentLogEntry {
  return {
    stageId,
    agentName,
    source: output.source,
    provider: (output as { logProvider?: string }).logProvider ?? output.provider ?? output.source,
    model: output.model,
    generatedAt: output.generatedAt,
    durationMs: output.durationMs,
  };
}

// ── Agent functions ────────────────────────────────────────────────────────────

export async function scenarioSelectorAgent(pilot: PilotRun, state: PilotState): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const result = await callAgent('scenarioSelector', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-02-scenario', 'scenarioSelectorAgent', result) };
}

export async function preparationAgent(pilot: PilotRun, state: PilotState): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const result = await callAgent('preparation', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-03-prep', 'preparationAgent', result) };
}

export async function rehearsalAgent(pilot: PilotRun, state: PilotState): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const result = await callAgent('rehearsal', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-04-rehearsal', 'rehearsalAgent', result) };
}

export async function languageRefinementAgent(pilot: PilotRun, state: PilotState): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const raw = state.entries['stage-04-rehearsal']?.userInput ?? '';
  let answer = raw;
  try {
    const parsed = JSON.parse(raw) as { answer?: string };
    if (parsed.answer?.trim()) answer = parsed.answer;
  } catch { /* use raw text */ }
  const result = await callAgent('languageRefinement', buildContext(pilot, state, { userInput: answer }));
  return { output: result, logEntry: makeLogEntry('stage-05-language', 'languageRefinementAgent', result) };
}

export async function afterActionReviewAgent(pilot: PilotRun, state: PilotState): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const result = await callAgent('afterActionReview', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-06-review', 'afterActionReviewAgent', result) };
}

export async function patternReportAgent(pilot: PilotRun, state: PilotState): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const result = await callAgent('patternReport', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-07-pattern', 'patternReportAgent', result) };
}

export async function vallumHandoverAgent(pilot: PilotRun, state: PilotState): Promise<{ output: StageOutput; logEntry: AgentLogEntry }> {
  const result = await callAgent('vallumHandover', buildContext(pilot, state));
  return { output: result, logEntry: makeLogEntry('stage-08-outcome', 'vallumHandoverAgent', result) };
}

// ── Dispatch map ───────────────────────────────────────────────────────────────

export type AgentFn = (
  pilot: PilotRun,
  state: PilotState,
  userInput?: string,
) => Promise<{ output: StageOutput; logEntry: AgentLogEntry }>;

export const STAGE_AGENTS: Record<string, AgentFn> = {
  'stage-02-scenario': (p, s)    => scenarioSelectorAgent(p, s),
  'stage-03-prep':     (p, s)    => preparationAgent(p, s),
  'stage-04-rehearsal':(p, s)    => rehearsalAgent(p, s),
  'stage-05-language': (p, s) => languageRefinementAgent(p, s),
  'stage-06-review':   (p, s)    => afterActionReviewAgent(p, s),
  'stage-07-pattern':  (p, s)    => patternReportAgent(p, s),
  'stage-08-outcome':  (p, s)    => vallumHandoverAgent(p, s),
};
