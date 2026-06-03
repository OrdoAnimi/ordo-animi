import type { EvidenceSummary } from '../data/types';

export function EvidencePanel({ evidence }: { evidence: EvidenceSummary }) {
  return (
    <div className="info-card">
      <div className="info-card-label">Confidence shift</div>
      <div className="confidence-row">
        <span className="confidence-before">{evidence.startingConfidence ?? '—'}</span>
        <span className="confidence-arrow">→</span>
        <span className="confidence-after">{evidence.endingConfidence ?? '—'}</span>
      </div>
      <div className="confidence-label">{evidence.clarityImprovement}</div>
    </div>
  );
}
