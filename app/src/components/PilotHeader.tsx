import type { PilotRun } from '../data/types';

export function PilotHeader({ pilot }: { pilot: PilotRun }) {
  return (
    <section className="pilot-header panel">
      <div>
        <p className="eyebrow">{pilot.sourcePath}</p>
        <h2>{pilot.title}</h2>
        <p>{pilot.scenario}</p>
      </div>

      <div className="status-pill">{pilot.status}</div>

      <div className="question-card">
        <span>Product question</span>
        <strong>{pilot.productQuestion}</strong>
      </div>

      <div className="objective-card">
        <span>Run objective</span>
        <p>{pilot.runObjective}</p>
      </div>
    </section>
  );
}
