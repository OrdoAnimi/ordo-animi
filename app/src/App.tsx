import { ArtifactViewer } from './components/ArtifactViewer';
import { EvidencePanel } from './components/EvidencePanel';
import { OperatorNotes } from './components/OperatorNotes';
import { PilotHeader } from './components/PilotHeader';
import { PilotStageTimeline } from './components/PilotStageTimeline';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';
import { pilot001 } from './data/pilot001';

const featuredStage = pilot001.stages[2];

export function App() {
  return (
    <main className="console-shell">
      <section className="hero-panel">
        <p className="eyebrow">VALOUR Pilot Console v0.1</p>
        <h1>Private operator workspace</h1>

        <p className="hero-copy">
          A focused console for reviewing the completed Architecture Review Board pilot and preparing the next repeatable run.
        </p>
      </section>

      <PilotHeader pilot={pilot001} />

      <section className="console-grid">
        <div className="main-stack">
          <PilotStageTimeline stages={pilot001.stages} />

          <ArtifactViewer
            title={featuredStage.label}
            sourceFile={featuredStage.sourceFile}
            summary={featuredStage.operatorNote}
          />
        </div>

        <aside className="side-stack">
          <EvidencePanel evidence={pilot001.evidence} />
          <ProductDecisionPanel decision={pilot001.productDecision} />
          <OperatorNotes notes={pilot001.operatorNotes} />
        </aside>
      </section>
    </main>
  );
}
