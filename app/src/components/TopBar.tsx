import type { PilotRun } from '../data/types';

export function TopBar({ pilot }: { pilot: PilotRun }) {
  const pillClass =
    pilot.status === 'complete'    ? 'pill-complete' :
    pilot.status === 'in-progress' ? 'pill-azure'    : 'pill-paused';

  return (
    <header className="topbar">
      <span className="topbar-logo">Valour™</span>
      <div className="topbar-divider" />
      <span className="topbar-title">{pilot.title.replace(': ', ' · ')}</span>
      <div className="topbar-meta">
        {pilot.evidence.startingConfidence != null && (
          <div className="topbar-metric">
            <span className="topbar-metric-label">Confidence</span>
            <span className="topbar-metric-value azure">
              {pilot.evidence.startingConfidence} → {pilot.evidence.endingConfidence}
            </span>
          </div>
        )}
        <div className="topbar-metric">
          <span className="topbar-metric-label">Decision</span>
          <span className={`topbar-metric-value ${pilot.productDecision.decision === 'continue' ? 'green' : ''}`}>
            {pilot.productDecision.decision}
          </span>
        </div>
        <span className={`pill ${pillClass}`}>{pilot.status}</span>
      </div>
    </header>
  );
}
