import { useState, useEffect } from 'react';
import { ALL_PILOTS, getPilotById } from './data/pilots';
import { useStages } from './hooks/useStages';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { StageDetail } from './components/StageDetail';
import { EvidencePanel } from './components/EvidencePanel';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';
import { LandingPage } from './components/LandingPage';
import { PatternPage } from './components/PatternPage';
import { IntakeForm } from './components/IntakeForm';
import { ScenariosPage } from './components/ScenariosPage';
import { ReadinessPage } from './components/ReadinessPage';

type Page = 'landing' | 'console' | 'pattern' | 'intake' | 'scenarios' | 'readiness';

function getPage(): Page {
  const hash = window.location.hash;
  if (hash === '#console')   return 'console';
  if (hash === '#pattern')   return 'pattern';
  if (hash === '#intake')    return 'intake';
  if (hash === '#scenarios') return 'scenarios';
  if (hash === '#readiness') return 'readiness';
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

  if (page === 'landing')   return <LandingPage onEnterConsole={nav('#console')} onJoinPilot={nav('#intake')} onViewScenarios={nav('#scenarios')} />;
  if (page === 'intake')    return <IntakeForm onBack={nav('')} />;
  if (page === 'readiness') return <ReadinessPage onBack={nav('#console')} />;
  if (page === 'pattern') {
    const pid = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('pilot') ?? 'PILOT-001';
    const pilot = getPilotById(pid);
    return <PatternPage pattern={pilot.pattern} pilotTitle={pilot.title.replace(': ', ' · ')} onBack={nav('#console')} />;
  }
  if (page === 'scenarios') return (
    <ScenariosPage
      onBack={nav('')}
      onSelectScenario={title => { window.location.hash = `#intake?scenario=${encodeURIComponent(title)}`; }}
    />
  );
  const activePilotId = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('pilot') ?? 'PILOT-001';
  return <Console pilotId={activePilotId} onViewPattern={() => { window.location.hash = `#pattern?pilot=${activePilotId}`; }} />;
}

function Console({ pilotId, onViewPattern }: { pilotId: string; onViewPattern: () => void }) {
  const pilot = getPilotById(pilotId);
  const { stages, cycleStatus } = useStages(pilot.id, pilot.stages);
  const firstIncomplete = stages.findIndex(s => s.status !== 'complete');
  const [activeIndex, setActiveIndex] = useState(
    firstIncomplete === -1 ? stages.length - 1 : firstIncomplete
  );

  function switchPilot(id: string) {
    window.location.hash = `#console?pilot=${id}`;
  }

  return (
    <div className="shell">
      <TopBar pilot={{ ...pilot, stages }} onViewPattern={onViewPattern} onViewReadiness={() => { window.location.hash = '#readiness'; }} />
      <div className="body">
        <Sidebar
          stages={stages}
          pilotId={pilot.id}
          scenario={pilot.scenario}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          allPilots={ALL_PILOTS.map(p => ({ id: p.id, title: p.title.replace('Pilot ', 'P').split(':')[0].trim(), status: p.status }))}
          onSwitchPilot={switchPilot}
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
            <EvidencePanel evidence={pilot.evidence} />
            <ProductDecisionPanel decision={pilot.productDecision} />
          </div>
        </main>
      </div>
    </div>
  );
}
