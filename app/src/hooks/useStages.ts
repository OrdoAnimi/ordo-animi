import { useState, useEffect } from 'react';
import type { PilotStage, StageStatus } from '../data/types';

const STATUS_CYCLE: StageStatus[] = ['not-started', 'draft', 'complete', 'to-confirm'];

function nextStatus(current: StageStatus): StageStatus {
  const i = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length];
}

export function useStages(pilotId: string, initial: PilotStage[]) {
  const key = `valour:stages:${pilotId}`;

  const [stages, setStages] = useState<PilotStage[]>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const overrides: Record<string, { status: StageStatus }> = JSON.parse(saved);
        return initial.map(s => ({ ...s, ...(overrides[s.id] ?? {}) }));
      }
    } catch {
      // ignore corrupt storage
    }
    return initial;
  });

  useEffect(() => {
    const overrides: Record<string, { status: StageStatus }> = {};
    stages.forEach(s => { overrides[s.id] = { status: s.status }; });
    localStorage.setItem(key, JSON.stringify(overrides));
  }, [key, stages]);

  function cycleStatus(index: number) {
    setStages(prev =>
      prev.map((s, i) => i === index ? { ...s, status: nextStatus(s.status) } : s)
    );
  }

  return { stages, cycleStatus };
}
