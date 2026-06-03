import { useState, useEffect } from 'react';
import { ALL_PILOTS, getPilotById } from './data/pilots';
import { usePilotState } from './hooks/usePilotState';
import { STAGE_AGENTS, checkDependency } from './services/agents';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { StageWorkspace } from './components/StageWorkspace';
import { EvidencePanel } from './components/EvidencePanel';
import { ProductDecisionPanel } from './components/ProductDecisionPanel';
import { ExportPanel } from './components/ExportPanel';
import { AgentLogPanel } from './components/AgentLogPanel';
import { ProviderBadge } from './components/ProviderBadge';
import { LandingPage } from './components/LandingPage';
import { PatternPage } from './components/PatternPage';
import { ScenariosPage } from './components/ScenariosPage';
import { ReadinessPage } from './components/ReadinessPage';
import { ComparisonPage } from './components/ComparisonPage';
import type { StageOutput, StageStatus, PilotState } from './data/types';

type Page = 'landing' | 'console' | 'pattern' | 'scenarios' | 'readiness' | 'comparison';

function getPage(): Page {
  const h = window.location.hash;
  if (h.startsWith('#console'))    return 'console';
  if (h.startsWith('#pattern'))    return 'pattern';
  if (h === '#scenarios')          return 'scenarios';
  if (h === '#readiness')          return 'readiness';
  if (h === '#comparison')         return 'comparison';
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

  if (page === 'landing') {
    return (
      <LandingPage
        onEnterConsole={nav('#console')}
        onJoinPilot={nav('#console')}
        onViewScenarios={nav('#scenarios')}
      />
    );
  }

  if (page === 'pattern') {
    const pid = getParam('pilot') ?? 'PILOT-001';
    const pilot = getPilotById(pid);
    let liveContent: string | undefined;
    let liveState: PilotState | undefined;
    try {
      const saved = localStorage.getItem(`valour:state:${pid}`);
      if (saved) {
        const parsed = JSON.parse(saved) as PilotState;
        liveContent = parsed?.entries?.['stage-07-pattern']?.output?.content;
        liveState = parsed;
      }
    } catch { /* ignore */ }
    return (
      <PatternPage
        pilot={pilot}
        liveContent={liveContent}
        liveState={liveState}
        onBack={nav('#console')}
        onReset={() => {
          localStorage.removeItem(`valour:state:${pid}`);
          window.location.hash = `#console?pilot=${pid}`;
        }}
        onStartNew={() => { window.location.hash = '#console'; }}
      />
    );
  }

  if (page === 'scenarios') {
    return (
      <ScenariosPage
        onBack={nav('')}
        onSelectScenario={title => { window.location.hash = `#console?scenario=${encodeURIComponent(title)}`; }}
      />
    );
  }

  if (page === 'readiness')   return <ReadinessPage onBack={nav('#console')} />;

  if (page === 'comparison')  return <ComparisonPage onBack={nav('#console')} />;

  const activePilotId = getParam('pilot') ?? 'PILOT-001';
  return (
    <Console
      pilotId={activePilotId}
      onViewPattern={() => { window.location.hash = `#pattern?pilot=${activePilotId}`; }}
    />
  );
}

// ── Console ─────────────────────────────────────────────────────────────────────

function Console({ pilotId, onViewPattern }: { pilotId: string; onViewPattern: () => void }) {
  const pilot = getPilotById(pilotId);
  const { state, setOutput, setStatus, setUserInput, appendLog, resetPilot } = usePilotState(pilot.id, pilot.stages);

  const stageIds = pilot.stages.map(s => s.id);
  const firstPending = stageIds.findIndex(id => !state.entries[id]?.output && state.entries[id]?.status !== 'complete');
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, firstPending === -1 ? stageIds.length - 1 : firstPending)
  );

  const activeStage = pilot.stages[activeIndex];
  const activeEntry = state.entries[activeStage.id] ?? { stageId: activeStage.id, status: 'not-started' as StageStatus };

  const liveStages = pilot.stages.map(s => ({
    ...s,
    status: state.entries[s.id]?.status ?? s.status,
    evidenceCaptured: !!state.entries[s.id]?.output,
  }));

  const dependency = checkDependency(activeStage.id, state);

  const completedStageIds = Object.keys(state.entries).filter(id => !!state.entries[id]?.output);

  const rehearsalAnswer = (() => {
    const raw = state.entries['stage-04-rehearsal']?.userInput;
    if (!raw?.trim()) return undefined;
    try {
      const parsed = JSON.parse(raw) as { answer?: string };
      if (parsed.answer?.trim()) return parsed.answer;
    } catch { /* ignore */ }
    return raw || undefined;
  })();

  async function handleGenerate() {
    const agentFn = STAGE_AGENTS[activeStage.id];
    if (!agentFn || !dependency.ok) return;
    const userInput = activeEntry.userInput ?? '';
    const { output, logEntry } = await agentFn(pilot, state, userInput);
    setOutput(activeStage.id, output);
    appendLog(logEntry);
    if (activeEntry.status === 'not-started') setStatus(activeStage.id, 'draft');
  }

  function handleSaveOutput(output: StageOutput) {
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
        onViewComparison={() => { window.location.hash = '#comparison'; }}
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
          <div className="console-provider-row">
            <ProviderBadge />
          </div>
          <StageWorkspace
            stage={activeStage}
            entry={activeEntry}
            index={activeIndex}
            total={pilot.stages.length}
            hasAgent={activeStage.id in STAGE_AGENTS}
            dependency={dependency}
            completedStageIds={completedStageIds}
            rehearsalAnswer={rehearsalAnswer}
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
          <AgentLogPanel log={state.runLog ?? []} />
          <ExportPanel pilot={pilot} state={state} onReset={resetPilot} />
        </main>
      </div>
    </div>
  );
}
