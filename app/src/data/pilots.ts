import { pilot001 } from './pilot-001';
import { pilot002 } from './pilot-002';
import type { PilotRun } from './types';

export const ALL_PILOTS: PilotRun[] = [pilot001, pilot002];

export function getPilotById(id: string): PilotRun {
  return ALL_PILOTS.find(p => p.id === id) ?? pilot001;
}
