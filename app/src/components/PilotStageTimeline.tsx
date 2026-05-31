import type { PilotStage } from '../data/types';
import { PilotStageCard } from './PilotStageCard';

export function PilotStageTimeline({
  stages,
}: {
  stages: PilotStage[];
}) {
  return (
    <section className="panel timeline-panel">
      <div className="section-heading">
        <p className="eyebrow">Workflow</p>
        <h2>VALOUR pilot loop</h2>
      </div>

      <div className="timeline">
        {stages.map((stage, index) => (
          <PilotStageCard
            key={stage.id}
            stage={stage}
            index={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
