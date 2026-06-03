import type { ProductDecision } from '../data/types';

export function ProductDecisionPanel({ decision }: { decision: ProductDecision }) {
  return (
    <div className="info-card">
      <div className="info-card-label">Product decision</div>
      <div className="decision-value">{decision.decision}</div>
      <div className="decision-desc">{decision.nextStep}</div>
    </div>
  );
}
