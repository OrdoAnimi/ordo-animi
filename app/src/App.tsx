import { useState } from 'react';
import { pilot001 } from './data/pilot-001';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { StageDetail } from './components/StageDetail';
import { EvidencePanel } from './components/EvidencePanel';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';

function defaultActiveIndex(): number {
  const first = pilot001.stages.findIndex(s => s.status !== 'complete');
  return first === -1 ? pilot001.stages.length - 1 : first;
}

export function App() {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  return (
    <div className="shell">
      <TopBar pilot={pilot001} />
      <div className="body">
        <Sidebar
          stages={pilot001.stages}
          pilotId={pilot001.id}
          scenario={pilot001.scenario}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
        <main className="main">
          <StageDetail
            stage={pilot001.stages[activeIndex]}
            index={activeIndex}
            total={pilot001.stages.length}
            onPrev={() => setActiveIndex(i => Math.max(0, i - 1))}
            onNext={() => setActiveIndex(i => Math.min(pilot001.stages.length - 1, i + 1))}
          />
          <div className="bottom-row">
            <EvidencePanel evidence={pilot001.evidence} />
            <ProductDecisionPanel decision={pilot001.productDecision} />
          </div>
        </main>
      </div>
    </div>
  );
}
