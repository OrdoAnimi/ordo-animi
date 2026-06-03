import type { PilotStage } from '../data/types';

type StageDetailProps = {
  stage: PilotStage;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export function StageDetail({ stage, index, total, onPrev, onNext }: StageDetailProps) {
  const num = String(index + 1).padStart(2, '0');
  const tot = String(total).padStart(2, '0');

  return (
    <div className="stage-card">
      <div className="stage-card-eyebrow">Stage {num} of {tot} · {stage.label}</div>
      <div className="stage-card-title">{stage.label}</div>
      <div className="stage-card-desc">{stage.description}</div>

      <div className="stage-badges">
        <span className={`badge ${stage.evidenceCaptured ? 'badge-evidence' : 'badge-missing'}`}>
          {stage.evidenceCaptured ? 'Evidence captured' : 'Evidence missing'}
        </span>
        <span className="badge badge-source">{stage.sourceFile}</span>
      </div>

      {stage.operatorNote && (
        <div className="stage-note">{stage.operatorNote}</div>
      )}

      <div className="stage-actions">
        <button className="btn btn-ghost" onClick={onPrev} disabled={index === 0}>
          ← Prev
        </button>
        <button className="btn btn-primary" onClick={onNext} disabled={index === total - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
