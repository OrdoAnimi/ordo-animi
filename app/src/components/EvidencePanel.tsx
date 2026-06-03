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

      {evidence.mainPattern && (
        <div className="evidence-pattern">
          <span className="evidence-pattern-label">Primary pattern</span>
          <span className="evidence-pattern-value">{evidence.mainPattern}</span>
        </div>
      )}

      {evidence.mainProductLearning && (
        <div className="evidence-learning">
          <span className="evidence-pattern-label">Product learning</span>
          <span className="evidence-pattern-value">{evidence.mainProductLearning}</span>
        </div>
      )}

      {evidence.testimonialCandidate && (
        <div className="badge badge-evidence" style={{ marginTop: '10px', display: 'inline-block' }}>
          Testimonial candidate
        </div>
      )}
    </div>
  );
}
