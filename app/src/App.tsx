import { useState } from 'react';
import { ArtifactViewer } from './components/ArtifactViewer';
import { EvidencePanel } from './components/EvidencePanel';
import { OperatorNotes } from './components/OperatorNotes';
import { PilotHeader } from './components/PilotHeader';
import { PilotStageTimeline } from './components/PilotStageTimeline';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';
import { pilotRuns } from './data/pilotRuns';

export function App() {
  const [selectedPilotId, setSelectedPilotId] = useState(pilotRuns[1].id);
  const selectedPilot =
    pilotRuns.find((pilot) => pilot.id === selectedPilotId) ?? pilotRuns[0];
  const featuredStage = selectedPilot.stages[2];

  return (
    <main className="console-shell">
      <section className="hero-panel">
        <p className="eyebrow">VALOUR Pilot Console v0.2</p>
        <h1>Private operator workspace</h1>

        <p className="hero-copy">
          Repeatable pilot engine mapped to pilot/runs/. Review completed pilot runs, compare evidence, and decide the next operator-led VALOUR test.
        </p>
      </section>

      <section className="pilot-selector panel">
        <div className="section-heading">
          <p className="eyebrow">Pilot runs</p>
          <h2>Release 0.2 reference set</h2>
        </div>

        <div className="pilot-card-grid">
          {pilotRuns.map((pilot) => (
            <button
              className={`pilot-card ${pilot.id === selectedPilot.id ? 'pilot-card-active' : ''}`}
              key={pilot.id}
              onClick={() => setSelectedPilotId(pilot.id)}
              type="button"
            >
              <span>{pilot.status}</span>
              <strong>{pilot.title}</strong>
              <small>{pilot.sourcePath}</small>
              <em>{pilot.productDecision.decision}</em>
            </button>
          ))}
        </div>
      </section>

      <PilotHeader pilot={selectedPilot} />

      <section className="console-grid">
        <div className="main-stack">
          <PilotStageTimeline stages={selectedPilot.stages} />

          <ArtifactViewer
            title={featuredStage.label}
            sourceFile={featuredStage.sourceFile}
            summary={featuredStage.operatorNote}
          />
        </div>

        <aside className="side-stack">
          <EvidencePanel evidence={selectedPilot.evidence} />
          <ProductDecisionPanel decision={selectedPilot.productDecision} />
          <OperatorNotes notes={selectedPilot.operatorNotes} />
        </aside>
      </section>
    </main>
  );
}
