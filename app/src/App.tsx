import { useState, useEffect } from 'react';
import { ALL_PILOTS, getPilotById } from './data/pilots';
import { usePilotState } from './hooks/usePilotState';
import { STAGE_AGENTS } from './services/agents';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { StageWorkspace } from './components/StageWorkspace';
import { EvidencePanel } from './components/EvidencePanel';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';
import { ExportPanel } from './components/ExportPanel';
import { LandingPage } from './components/LandingPage';
import { PatternPage } from './components/PatternPage';
import { IntakeForm } from './components/IntakeForm';
import { ScenariosPage } from './components/ScenariosPage';
import { ReadinessPage } from './components/ReadinessPage';
import type { StageStatus } from './data/types';

type Page = 'landing' | 'console' | 'pattern' | 'intake' | 'scenarios' | 'readiness';

function getPage(): Page {
  const h = window.location.hash;
  if (h.startsWith('#console'))   return 'console';
  if (h.startsWith('#pattern'))   return 'pattern';
  if (h === '#intake')            return 'intake';
  if (h.startsWith('#intake'))    return 'intake';
  if (h === '#scenarios')         return 'scenarios';
  if (h === '#readiness')         return 'readiness';
  return 'landing';
}

function getParam(key: string): string | null {
  return new URLSearchParams(window.location.hash.split('?')[1] ?? '').get(key);
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
    const pid = getParam('pilot') ?? 'PILOT-001';
    const pilot = getPilotById(pid);
    return <PatternPage pattern={pilot.pattern} pilotTitle={pilot.title.replace(': ', ' · ')} onBack={nav('#console')} />;
  }
  if (page === 'scenarios') return (
    <ScenariosPage
      onBack={nav('')}
      onSelectScenario={title => { window.location.hash = `#intake?scenario=${encodeURIComponent(title)}`; }}
    />
  );

  const activePilotId = getParam('pilot') ?? 'PILOT-001';
  return <Console pilotId={activePilotId} onViewPattern={() => { window.location.hash = `#pattern?pilot=${activePilotId}`; }} />;
}

// ── Console ─────────────────────────────────────────────────────────────────────

function Console({ pilotId, onViewPattern }: { pilotId: string; onViewPattern: () => void }) {
  const pilot = getPilotById(pilotId);
  const { state, setOutput, setStatus, setUserInput, resetPilot } = usePilotState(pilot.id, pilot.stages);

  const stageIds = pilot.stages.map(s => s.id);
  const firstPending = stageIds.findIndex(id => !state.entries[id]?.output && state.entries[id]?.status !== 'complete');
  const [activeIndex, setActiveIndex] = useState(Math.max(0, firstPending === -1 ? stageIds.length - 1 : firstPending));

  const activeStage = pilot.stages[activeIndex];
  const activeEntry = state.entries[activeStage.id] ?? { stageId: activeStage.id, status: 'not-started' as StageStatus };

  // Derive stages with live status for sidebar
  const liveStages = pilot.stages.map(s => ({
    ...s,
    status: state.entries[s.id]?.status ?? s.status,
    evidenceCaptured: !!state.entries[s.id]?.output,
  }));

  async function handleGenerate() {
    const agentFn = STAGE_AGENTS[activeStage.id];
    if (!agentFn) return;
    const userInput = activeEntry.userInput ?? '';
    const output = await agentFn(pilot, state, userInput);
    setOutput(activeStage.id, output);
    // Auto-advance status to draft when output is generated
    if (activeEntry.status === 'not-started') setStatus(activeStage.id, 'draft');
  }

  function handleSaveOutput(output: import('./data/types').StageOutput) {
    setOutput(activeStage.id, output);
  }

  function handleCycleStatus(status: StageStatus) {
    setStatus(activeStage.id, status);
  }

  function switchPilot(id: string) {
    window.location.hash = `#console?pilot=${id}`;
  }

  return (
    <div className="shell">
      <TopBar
        pilot={{ ...pilot, stages: liveStages }}
        onViewPattern={onViewPattern}
        onViewReadiness={() => { window.location.hash = '#readiness'; }}
      />
      <div className="body">
        <Sidebar
          stages={liveStages}
          pilotId={pilot.id}
          scenario={pilot.scenario}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          allPilots={ALL_PILOTS.map(p => ({ id: p.id, title: p.title.replace('Pilot ', 'P').split(':')[0].trim(), status: p.status }))}
          onSwitchPilot={switchPilot}
        />
        <main className="main">
          <StageWorkspace
            stage={activeStage}
            entry={activeEntry}
            index={activeIndex}
            total={pilot.stages.length}
            hasAgent={activeStage.id in STAGE_AGENTS}
            onGenerate={handleGenerate}
            onSaveOutput={handleSaveOutput}
            onSaveUserInput={(input) => setUserInput(activeStage.id, input)}
            onCycleStatus={handleCycleStatus}
            onPrev={() => setActiveIndex(i => Math.max(0, i - 1))}
            onNext={() => setActiveIndex(i => Math.min(pilot.stages.length - 1, i + 1))}
          />
          <div className="bottom-row">
            <EvidencePanel evidence={pilot.evidence} />
            <ProductDecisionPanel decision={pilot.productDecision} />
          </div>
          <ExportPanel pilot={pilot} state={state} onReset={resetPilot} />
        </main>
      </div>
    </div>
  );
}
