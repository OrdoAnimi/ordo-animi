import type { ProductDecision } from '../data/types';

export function ProductDecisionPanel({
  decision,
}: {
  decision: ProductDecision;
}) {
  return (
    <section className="panel decision-panel">
      <p className="eyebrow">Product decision</p>

      <h2>{decision.decision}</h2>

      <p>{decision.rationale}</p>

      <div className="next-step">
        <span>Next step</span>
        <strong>{decision.nextStep}</strong>
      </div>
    </section>
  );
}
