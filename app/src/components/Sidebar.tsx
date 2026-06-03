import type { PilotStage, PilotStatus } from '../data/types';

type PilotSummary = { id: string; title: string; status: PilotStatus };

type SidebarProps = {
  stages: PilotStage[];
  pilotId: string;
  scenario: string;
  activeIndex: number;
  onSelect: (index: number) => void;
  allPilots: PilotSummary[];
  onSwitchPilot: (id: string) => void;
};

const STATUS_DOT: Record<PilotStatus, string> = {
  complete:    'done',
  'in-progress': 'active',
  planned:     'pending',
  archived:    'pending',
};

export function Sidebar({ stages, pilotId, scenario, activeIndex, onSelect, allPilots, onSwitchPilot }: SidebarProps) {
  return (
    <aside className="sidebar">

      {allPilots.length > 1 && (
        <div className="sidebar-pilot-switcher">
          <div className="sidebar-pilot-label">Pilots</div>
          {allPilots.map(p => (
            <div
              key={p.id}
              className={`sidebar-pilot-item${p.id === pilotId ? ' active' : ''}`}
              onClick={() => onSwitchPilot(p.id)}
            >
              <div className={`stage-dot ${STATUS_DOT[p.status]}`} style={{ width: '6px', height: '6px' }} />
              <span className="sidebar-pilot-item-label">{p.title}</span>
            </div>
          ))}
        </div>
      )}

      <div className="sidebar-pilot">
        <div className="sidebar-pilot-label">Active pilot</div>
        <div className="sidebar-pilot-name">{pilotId}</div>
        <div className="sidebar-pilot-sub">{scenario.replace('.', '')}</div>
      </div>

      <div className="sidebar-section-label">Workflow</div>

      {stages.map((stage, i) => {
        const isActive = i === activeIndex;
        const isDone = stage.status === 'complete' && !isActive;
        const dotClass = isDone ? 'done' : isActive ? 'active' : 'pending';

        return (
          <div
            key={stage.id}
            className={`stage-item${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}
            onClick={() => onSelect(i)}
          >
            <div className={`stage-dot ${dotClass}`} />
            <span className="stage-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="stage-name">{stage.label}</span>
          </div>
        );
      })}
    </aside>
  );
}
