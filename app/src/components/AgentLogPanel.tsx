import { useState } from 'react';
import type { AgentLogEntry } from '../data/types';

const SOURCE_ICON: Record<string, string> = { ai: '✦', local: '○', manual: '✎' };
const STAGE_SHORT: Record<string, string> = {
  'stage-01-intake':    'Intake',
  'stage-02-scenario':  'Scenario',
  'stage-03-prep':      'Preparation',
  'stage-04-rehearsal': 'Rehearsal',
  'stage-05-language':  'Language',
  'stage-06-review':    'Review',
  'stage-07-pattern':   'Pattern',
  'stage-08-outcome':   'Outcome',
};

export function AgentLogPanel({ log }: { log: AgentLogEntry[] }) {
  const [open, setOpen] = useState(false);

  if (log.length === 0) return null;

  return (
    <div className="agent-log-panel">
      <button className="agent-log-toggle" onClick={() => setOpen(o => !o)}>
        <span>Agent run log</span>
        <span className="agent-log-count">{log.length} {log.length === 1 ? 'entry' : 'entries'}</span>
        <span className="agent-log-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="agent-log-entries">
          {[...log].reverse().map((entry, i) => (
            <div key={i} className="agent-log-entry">
              <span className={`agent-log-icon source-${entry.source}`}>{SOURCE_ICON[entry.source] ?? '?'}</span>
              <span className="agent-log-stage">{STAGE_SHORT[entry.stageId] ?? entry.stageId}</span>
              <span className="agent-log-agent">{entry.agentName}</span>
              <span className="agent-log-provider">{entry.provider}{entry.model ? ` · ${entry.model.split('-').slice(-1)[0]}` : ''}</span>
              {entry.durationMs && <span className="agent-log-duration">{(entry.durationMs / 1000).toFixed(1)}s</span>}
              <span className="agent-log-time">{new Date(entry.generatedAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
