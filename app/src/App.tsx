import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { pilot001 } from './data/pilot-001';
import { useStages } from './hooks/useStages';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { StageDetail } from './components/StageDetail';
import { EvidencePanel } from './components/EvidencePanel';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';
import { LandingPage } from './components/LandingPage';
import { PatternPage } from './components/PatternPage';
import { IntakeForm } from './components/IntakeForm';

type Page = 'landing' | 'console' | 'pattern' | 'intake';

function getPage(): Page {
  const hash = window.location.hash;
  if (hash === '#console') return 'console';
  if (hash === '#pattern') return 'pattern';
  if (hash === '#intake')  return 'intake';
  return 'landing';
}

export function App() {
  const [page, setPage] = useState<Page>(getPage);

  useEffect(() => {
    const onHash = () => setPage(getPage());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const nav = (hash: string) => () => { window.location.hash = hash; };

  if (page === 'landing')  return (
    <>
      <LandingPage onEnterConsole={nav('#console')} onJoinPilot={nav('#intake')} />
      <Analytics />
    </>
  );
  if (page === 'pattern')  return (
    <>
      <PatternPage pattern={pilot001.pattern} pilotTitle={pilot001.title.replace(': ', ' · ')} onBack={nav('#console')} />
      <Analytics />
    </>
  );
  if (page === 'intake')   return (
    <>
      <IntakeForm onBack={nav('')} />
      <Analytics />
    </>
  );
  return (
    <>
      <Console onViewPattern={nav('#pattern')} />
      <Analytics />
    </>
  );
}

function Console({ onViewPattern }: { onViewPattern: () => void }) {
  const { stages, cycleStatus } = useStages(pilot001.id, pilot001.stages);
  const firstIncomplete = stages.findIndex(s => s.status !== 'complete');
  const [activeIndex, setActiveIndex] = useState(
    firstIncomplete === -1 ? stages.length - 1 : firstIncomplete
  );

  return (
    <div className="shell">
      <TopBar pilot={{ ...pilot001, stages }} onViewPattern={onViewPattern} />
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
