import type { PilotStage } from '../data/types';

type SidebarProps = {
  stages: PilotStage[];
  pilotId: string;
  scenario: string;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function Sidebar({ stages, pilotId, scenario, activeIndex, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
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
