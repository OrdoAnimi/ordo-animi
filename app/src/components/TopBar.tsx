import type { AppMode, PilotRun } from '../data/types';
import { SCENARIOS } from '../data/scenarios';

type Props = {
  pilot: PilotRun;
  mode: AppMode;
  custosOpen?: boolean;
  onOpenCustos?: () => void;
  onViewPattern: () => void;
  onViewReadiness: () => void;
  onViewComparison: () => void;
};

function participantTitle(title: string) {
  const scenarioId = localStorage.getItem('valour:last-scenario');
  const scenario = SCENARIOS.find(item => item.id === scenarioId);
  if (scenario) return scenario.title;
  return title.replace(/^Pilot\s+\d+:\s*/i, '').replace('Executive Briefing', 'Executive Design Challenge');
}

export function TopBar({ pilot, mode, custosOpen, onOpenCustos, onViewPattern, onViewReadiness, onViewComparison }: Props) {
  const isParticipant = mode === 'participant';
  const pillClass = pilot.status === 'complete' ? 'pill-complete' : pilot.status === 'in-progress' ? 'pill-azure' : 'pill-paused';
  const completed = pilot.stages.filter(stage => stage.status === 'complete' || stage.evidenceCaptured).length;

  return (
    <header className="topbar">
      <button className="topbar-back" onClick={() => { window.location.hash = ''; }} title="Save and return home" aria-label="Save and return home">←</button>
      <span className="topbar-logo">VALOUR™</span>
      <div className="topbar-divider" />
      <span className="topbar-title">{isParticipant ? participantTitle(pilot.title) : pilot.scenario}</span>

      {isParticipant && (
        <div className="topbar-participant-status" aria-label="Practice session navigation and progress">
          <span>Saved</span>
          <span>{completed}/{pilot.stages.length} steps</span>
          <button type="button" className="topbar-pattern-btn" onClick={() => { window.location.hash = '#scenarios'; }}>Scenarios</button>
          <button type="button" className="topbar-pattern-btn" onClick={() => { window.location.hash = ''; }}>Save and exit</button>
          <button type="button" className="topbar-custos-btn" onClick={onOpenCustos} aria-label="Open CUSTOS guide" aria-controls="custos-guide-panel" aria-expanded={!!custosOpen}>CUSTOS</button>
        </div>
      )}

      {!isParticipant && (
        <div className="topbar-meta">
          {pilot.evidence.startingConfidence != null && (
            <div className="topbar-metric">
              <span className="topbar-metric-label">Confidence</span>
              <span className="topbar-metric-value azure">{pilot.evidence.startingConfidence} → {pilot.evidence.endingConfidence}</span>
            </div>
          )}
          <div className="topbar-metric">
            <span className="topbar-metric-label">Decision</span>
            <span className={`topbar-metric-value ${pilot.productDecision.decision === 'continue' ? 'green' : ''}`}>{pilot.productDecision.decision}</span>
          </div>
          <button className="btn btn-ghost topbar-pattern-btn" onClick={onViewComparison}>Compare →</button>
          <button className="btn btn-ghost topbar-pattern-btn" onClick={onViewReadiness}>Readiness</button>
          <button className="btn btn-ghost topbar-pattern-btn" onClick={onViewPattern}>Pattern →</button>
          <span className={`pill ${pillClass}`}>{pilot.status}</span>
        </div>
      )}
    </header>
  );
}
