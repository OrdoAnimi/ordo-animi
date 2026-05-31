import type { PilotStage } from '../data/types';

export function PilotStageCard({
  stage,
  index,
}: {
  stage: PilotStage;
  index: number;
}) {
  return (
    <article className="stage-card">
      <div className="stage-index">{String(index).padStart(2, '0')}</div>

      <div className="stage-body">
        <div className="stage-title-row">
          <h3>{stage.label}</h3>
          <span className={`stage-status stage-status-${stage.status}`}>
            {stage.status}
          </span>
        </div>

        <p>{stage.description}</p>

        <div className="stage-meta">
          <span>
            {stage.evidenceCaptured ? 'Evidence captured' : 'Evidence missing'}
          </span>

          <code>{stage.sourceFile}</code>
        </div>

        <p className="operator-note">{stage.operatorNote}</p>
      </div>
    </article>
  );
}
