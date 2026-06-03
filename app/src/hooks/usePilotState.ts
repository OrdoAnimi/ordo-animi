import { useState, useEffect, useCallback } from 'react';
import type { PilotStage, PilotState, PilotStateEntry, StageOutput, StageStatus } from '../data/types';

function makeDefault(pilotId: string, stages: PilotStage[]): PilotState {
  const entries: Record<string, PilotStateEntry> = {};
  stages.forEach(s => {
    entries[s.id] = { stageId: s.id, status: s.status };
  });
  return {
    pilotId,
    entries,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function usePilotState(pilotId: string, initialStages: PilotStage[]) {
  const key = `valour:state:${pilotId}`;

  const [state, setState] = useState<PilotState>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: PilotState = JSON.parse(saved);
        if (parsed.pilotId === pilotId) return parsed;
      }
    } catch { /* ignore */ }
    return makeDefault(pilotId, initialStages);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch { /* quota */ }
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

  const setIntakeData = useCallback((data: PilotState['intakeData']) => {
    setState(prev => ({ ...prev, intakeData: data, updatedAt: new Date().toISOString() }));
  }, []);

  const resetPilot = useCallback(() => {
    const fresh = makeDefault(pilotId, initialStages);
    setState(fresh);
  }, [pilotId, initialStages]);

  return { state, setOutput, setStatus, setUserInput, setIntakeData, resetPilot };
}
