import { useState, useEffect, useCallback } from 'react';
import type {
  AgentLogEntry,
  IntakeData,
  PilotStage,
  PilotState,
  PilotStateEntry,
  RehearsalState,
  StageOutput,
  StageStatus,
} from '../data/types';

const CURRENT_SCHEMA_VERSION = 2;

function emptyRehearsal(): RehearsalState {
  return { questions: [], status: 'not-started' };
}

function makeDefault(pilotId: string, stages: PilotStage[]): PilotState {
  const entries: Record<string, PilotStateEntry> = {};
  stages.forEach(s => {
    entries[s.id] = { stageId: s.id, status: 'not-started' };
  });
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    pilotId,
    entries,
    rehearsal: emptyRehearsal(),
    runLog: [],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function migrateState(parsed: PilotState, pilotId: string, stages: PilotStage[]): PilotState {
  const defaults = makeDefault(pilotId, stages);
  const entries = { ...defaults.entries, ...(parsed.entries ?? {}) };
  let rehearsal = parsed.rehearsal;

  if (!rehearsal) {
    const raw = entries['stage-04-rehearsal']?.userInput;
    if (raw?.trim()) {
      try {
        const legacy = JSON.parse(raw) as { question?: string; answer?: string };
        if (legacy.answer?.trim()) {
          const questionId = 'legacy-question';
          rehearsal = {
            questions: legacy.question ? [{ id: questionId, topic: 'Rehearsal question', text: legacy.question }] : [],
            selectedQuestionId: legacy.question ? questionId : undefined,
            response: {
              questionId,
              responseText: legacy.answer.trim(),
              inputMethod: 'typed',
              startedAt: parsed.startedAt ?? new Date().toISOString(),
              submittedAt: entries['stage-04-rehearsal']?.savedAt ?? parsed.updatedAt,
              status: 'submitted',
            },
            status: 'response-submitted',
          };
        }
      } catch {
        rehearsal = {
          questions: [],
          response: {
            questionId: 'legacy-question',
            responseText: raw.trim(),
            inputMethod: 'typed',
            startedAt: parsed.startedAt ?? new Date().toISOString(),
            submittedAt: parsed.updatedAt,
            status: 'submitted',
          },
          status: 'response-submitted',
        };
      }
    }
  }

  return {
    ...defaults,
    ...parsed,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    pilotId,
    entries,
    rehearsal: rehearsal ?? emptyRehearsal(),
    runLog: parsed.runLog ?? [],
  };
}

export function usePilotState(pilotId: string, initialStages: PilotStage[]) {
  const key = `valour:state:${pilotId}`;

  const load = useCallback(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as PilotState;
        if (parsed.pilotId === pilotId) return migrateState(parsed, pilotId, initialStages);
      }
    } catch {
      localStorage.removeItem(key);
    }
    return makeDefault(pilotId, initialStages);
  }, [key, pilotId, initialStages]);

  const [state, setState] = useState<PilotState>(load);

  useEffect(() => {
    setState(load());
  }, [load]);

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* quota */ }
  }, [key, state]);

  const setOutput = useCallback((stageId: string, output: StageOutput) => {
    setState(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      entries: {
        ...prev.entries,
        [stageId]: {
          ...prev.entries[stageId],
          stageId,
          output,
          savedAt: new Date().toISOString(),
        },
      },
    }));
  }, []);

  const setStatus = useCallback((stageId: string, status: StageStatus) => {
    setState(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      entries: {
        ...prev.entries,
        [stageId]: { ...prev.entries[stageId], stageId, status },
      },
    }));
  }, []);

  const setUserInput = useCallback((stageId: string, userInput: string) => {
    setState(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      entries: {
        ...prev.entries,
        [stageId]: { ...prev.entries[stageId], stageId, userInput },
      },
    }));
  }, []);

  const setRehearsal = useCallback((rehearsal: RehearsalState) => {
    setState(prev => ({ ...prev, rehearsal, updatedAt: new Date().toISOString() }));
  }, []);

  const setIntakeData = useCallback((data: IntakeData) => {
    setState(prev => ({ ...prev, intakeData: data, updatedAt: new Date().toISOString() }));
  }, []);

  const appendLog = useCallback((entry: AgentLogEntry) => {
    setState(prev => ({
      ...prev,
      runLog: [...(prev.runLog ?? []), entry],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const resetPilot = useCallback(() => {
    setState(makeDefault(pilotId, initialStages));
  }, [pilotId, initialStages]);

  return {
    state,
    setOutput,
    setStatus,
    setUserInput,
    setRehearsal,
    setIntakeData,
    appendLog,
    resetPilot,
  };
}
