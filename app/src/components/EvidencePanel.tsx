import type { EvidenceSummary } from '../data/types';

export function EvidencePanel({
  evidence,
}: {
  evidence: EvidenceSummary;
}) {
  return (
    <section className="panel evidence-panel">
      <p className="eyebrow">Evidence</p>
      <h2>Run learning</h2>

      <dl className="evidence-list">
        <div>
          <dt>Confidence shift</dt>
          <dd>
            {evidence.startingConfidence ?? 'n/a'} {' -> '}
            {evidence.endingConfidence ?? 'n/a'}
          </dd>
        </div>

        <div>
          <dt>Clarity improvement</dt>
          <dd>{evidence.clarityImprovement}</dd>
        </div>

        <div>
          <dt>Main pattern</dt>
          <dd>{evidence.mainPattern}</dd>
        </div>

        <div>
          <dt>Product learning</dt>
          <dd>{evidence.mainProductLearning}</dd>
        </div>
      </dl>
    </section>
  );
}
