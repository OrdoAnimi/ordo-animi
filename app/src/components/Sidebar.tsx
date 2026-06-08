import type { AppMode, PilotStage, PilotStatus } from '../data/types';

type PilotSummary = { id: string; title: string; status: PilotStatus };

type SidebarProps = {
  stages: PilotStage[];
  pilotId: string;
  scenario: string;
  activeIndex: number;
  onSelect: (index: number) => void;
  mode: AppMode;
  allPilots: PilotSummary[];
  onSwitchPilot: (id: string) => void;
};

const STATUS_DOT: Record<PilotStatus, string> = {
  complete:    'done',
  'in-progress': 'active',
  planned:     'pending',
  archived:    'pending',
};

export function Sidebar({ stages, pilotId, scenario, activeIndex, onSelect, mode, allPilots, onSwitchPilot }: SidebarProps) {
  if (mode === 'participant') {
    const groups = [
      { label: 'Prepare',  indices: [0, 1, 2], targetIndex: 0 },
      { label: 'Rehearse', indices: [3],        targetIndex: 3 },
      { label: 'Debrief',  indices: [4, 5, 6, 7], targetIndex: 4 },
    ];
    return (
      <aside className="sidebar">
        <div className="sidebar-pilot">
          <div className="sidebar-pilot-label">Your session</div>
          <div className="sidebar-pilot-name">{scenario.replace('.', '')}</div>
        </div>
        <div className="sidebar-section-label">Workflow</div>
        {groups.map((g, gi) => {
          const isActive = g.indices.includes(activeIndex);
          const isDone = g.indices.every(i => i < activeIndex) && !isActive;
          const dotClass = isDone ? 'done' : isActive ? 'active' : 'pending';
          return (
            <div
              key={gi}
              className={`stage-item${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}
              onClick={() => onSelect(Math.min(g.targetIndex, stages.length - 1))}
            >
              <div className={`stage-dot ${dotClass}`} />
              <span className="stage-num">{String(gi + 1).padStart(2, '0')}</span>
              <span className="stage-name">{g.label}</span>
            </div>
          );
        })}
      </aside>
    );
  }

  return (
    <aside className="sidebar">

      {allPilots.length > 1 && (
        <div className="sidebar-pilot-switcher">
          <div className="sidebar-pilot-label">Sessions</div>
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
        <div className="sidebar-pilot-label">Your session</div>
        <div className="sidebar-pilot-name">{scenario.replace('.', '')}</div>
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
