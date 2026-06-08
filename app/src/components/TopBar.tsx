import type { AppMode, PilotRun } from '../data/types';

type Props = { pilot: PilotRun; mode: AppMode; onViewPattern: () => void; onViewReadiness: () => void; onViewComparison: () => void };

function participantTitle(title: string) {
  return title
    .replace(/^Pilot\s+\d+:\s*/i, 'Scenario: ')
    .replace('Executive Briefing', 'Executive Design Challenge');
}

export function TopBar({ pilot, mode, onViewPattern, onViewReadiness, onViewComparison }: Props) {
  const pillClass =
    pilot.status === 'complete'    ? 'pill-complete' :
    pilot.status === 'in-progress' ? 'pill-azure'    : 'pill-paused';
  const isParticipant = mode === 'participant';
  const completed = pilot.stages.filter(stage => stage.status === 'complete' || stage.evidenceCaptured).length;

  return (
    <header className="topbar">
      <a
        className="topbar-back"
        href="#"
        onClick={e => { e.preventDefault(); window.location.hash = ''; }}
        title="Back to landing"
      >
        ←
      </a>
      <span className="topbar-logo">VALOUR™</span>
      <div className="topbar-divider" />
      <span className="topbar-title">{isParticipant ? participantTitle(pilot.title) : pilot.title.replace(': ', ' · ')}</span>
      {isParticipant && (
        <div className="topbar-participant-status" aria-label="Practice session progress">
          <span>Saved</span>
          <span>{completed}/{pilot.stages.length} steps</span>
        </div>
      )}
      {!isParticipant && <div className="topbar-meta">
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
        <button className="btn btn-ghost topbar-pattern-btn" onClick={onViewComparison}>
          Compare →
        </button>
        <button className="btn btn-ghost topbar-pattern-btn" onClick={onViewReadiness}>
          Readiness
        </button>
        <button className="btn btn-ghost topbar-pattern-btn" onClick={onViewPattern}>
          Pattern →
        </button>
        <span className={`pill ${pillClass}`}>{pilot.status}</span>
      </div>}
    </header>
  );
}
