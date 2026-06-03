import { pilot001 } from './data/pilot-001';
import { PilotHeader } from './components/PilotHeader';
import { PilotStageTimeline } from './components/PilotStageTimeline';
import { EvidencePanel } from './components/EvidencePanel';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';
import { ArtifactViewer } from './components/ArtifactViewer';
import { OperatorNotes } from './components/OperatorNotes';

export function App() {
  return (
    <main className="console-shell">
      <PilotHeader pilot={pilot001} />
      <PilotStageTimeline stages={pilot001.stages} />
      <EvidencePanel evidence={pilot001.evidence} />
      <ProductDecisionPanel decision={pilot001.productDecision} />
      <ArtifactViewer
        title="Pattern Summary"
        sourceFile="07-pattern-summary.md"
        summary={`Primary pattern: ${pilot001.evidence.mainPattern} Next focus: ${pilot001.productDecision.nextStep}`}
      />
      <OperatorNotes notes={pilot001.operatorNotes} />
    </main>
  );
}
