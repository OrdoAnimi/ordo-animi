import { useState, useEffect } from 'react';
import { pilot001 } from './data/pilot-001';
import { useStages } from './hooks/useStages';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { StageDetail } from './components/StageDetail';
import { EvidencePanel } from './components/EvidencePanel';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';
import { LandingPage } from './components/LandingPage';

function getPage(): 'landing' | 'console' {
  return window.location.hash === '#console' ? 'console' : 'landing';
}

export function App() {
  const [page, setPage] = useState<'landing' | 'console'>(getPage);

  useEffect(() => {
    const onHash = () => setPage(getPage());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (page === 'landing') {
    return <LandingPage onEnterConsole={() => { window.location.hash = '#console'; }} />;
  }

  return <Console />;
}

function Console() {
  const { stages, cycleStatus } = useStages(pilot001.id, pilot001.stages);

  const firstIncomplete = stages.findIndex(s => s.status !== 'complete');
  const [activeIndex, setActiveIndex] = useState(
    firstIncomplete === -1 ? stages.length - 1 : firstIncomplete
  );

  return (
    <div className="shell">
      <TopBar pilot={{ ...pilot001, stages }} />
      <div className="body">
        <Sidebar
          stages={stages}
          pilotId={pilot001.id}
          scenario={pilot001.scenario}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
        <main className="main">
          <StageDetail
            stage={stages[activeIndex]}
            index={activeIndex}
            total={stages.length}
            onPrev={() => setActiveIndex(i => Math.max(0, i - 1))}
            onNext={() => setActiveIndex(i => Math.min(stages.length - 1, i + 1))}
            onCycleStatus={() => cycleStatus(activeIndex)}
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
