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
import { CustosPanel } from './components/CustosPanel';
import { PatternPage } from './components/PatternPage';
import { ScenariosPage } from './components/ScenariosPage';
import { ReadinessPage } from './components/ReadinessPage';
import { ComparisonPage } from './components/ComparisonPage';
import type { AppMode, RehearsalState, StageOutput, StageStatus, PilotState } from './data/types';

type Page = 'landing' | 'console' | 'pattern' | 'scenarios' | 'readiness' | 'comparison';

function getPage(): Page {
  const h = window.location.hash;
  if (h.startsWith('#console')) return 'console';
  if (h.startsWith('#pattern')) return 'pattern';
  if (h === '#scenarios') return 'scenarios';
  if (h === '#readiness') return 'readiness';
  if (h === '#comparison') return 'comparison';
  return 'landing';
}

function getParam(key: string): string | null {
  return new URLSearchParams(window.location.hash.split('?')[1] ?? '').get(key);
}

function getMode(): AppMode {
  const mode = getParam('mode');
  return mode === 'developer' || mode === 'facilitator' ? mode : 'participant';
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
      <>
        <LandingPage
          onEnterConsole={nav('#console')}
          onJoinPilot={nav('#console')}
          onViewScenarios={nav('#scenarios')}
        />
        <CustosPanel page="landing" />
      </>
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

  if (page === 'readiness') return <ReadinessPage onBack={nav('#console')} />;
  if (page === 'comparison') return <ComparisonPage onBack={nav('#console')} />;

  const activePilotId = getParam('pilot') ?? 'PILOT-001';
  return (
    <Console
      pilotId={activePilotId}
      mode={getMode()}
      onViewPattern={() => { window.location.hash = `#pattern?pilot=${activePilotId}`; }}
    />
  );
}

function Console({ pilotId, mode, onViewPattern }: { pilotId: string; mode: AppMode; onViewPattern: () => void }) {
  const pilot = getPilotById(pilotId);
  const { state, setOutput, setStatus, setUserInput, setRehearsal, appendLog, resetPilot } = usePilotState(pilot.id, pilot.stages);

  const stageIds = pilot.stages.map(s => s.id);
  const firstPending = stageIds.findIndex(id => {
    if (id === 'stage-04-rehearsal') return state.rehearsal?.status !== 'complete';
    return !state.entries[id]?.output && state.entries[id]?.status !== 'complete';
  });
  const [activeIndex, setActiveIndex] = useState(Math.max(0, firstPending === -1 ? stageIds.length - 1 : firstPending));

  useEffect(() => {
    const nextPending = stageIds.findIndex(id => {
      if (id === 'stage-04-rehearsal') return state.rehearsal?.status !== 'complete';
      return !state.entries[id]?.output && state.entries[id]?.status !== 'complete';
    });
    setActiveIndex(Math.max(0, nextPending === -1 ? stageIds.length - 1 : nextPending));
  }, [pilot.id]);

  const activeStage = pilot.stages[activeIndex] ?? pilot.stages[0];
  const activeEntry = state.entries[activeStage.id] ?? { stageId: activeStage.id, status: 'not-started' as StageStatus };
  const isDeveloper = mode === 'developer';
  const isFacilitator = mode === 'facilitator';

  const liveStages = pilot.stages.map(s => ({
    ...s,
    status: s.id === 'stage-04-rehearsal' && state.rehearsal?.status === 'complete'
      ? 'complete' as StageStatus
      : state.entries[s.id]?.status ?? s.status,
    evidenceCaptured: s.id === 'stage-04-rehearsal'
      ? state.rehearsal?.response?.status === 'submitted'
      : !!state.entries[s.id]?.output,
  }));

  const dependency = checkDependency(activeStage.id, state);
  const completedStageIds = liveStages.filter(s => s.status === 'complete' || s.evidenceCaptured).map(s => s.id);
  const rehearsalAnswer = state.rehearsal?.response?.responseText;

  async function handleGenerate() {
    const agentFn = STAGE_AGENTS[activeStage.id];
    if (!agentFn || !dependency.ok) return;
    const { output, logEntry } = await agentFn(pilot, state, activeEntry.userInput ?? '');
    setOutput(activeStage.id, output);
    appendLog(logEntry);
    if (activeEntry.status === 'not-started') setStatus(activeStage.id, 'draft');
  }

  function handleSaveOutput(output: StageOutput) {
    setOutput(activeStage.id, output);
    if (activeStage.id === 'stage-05-language' && state.rehearsal?.response?.status === 'submitted') {
      setRehearsal({
        ...state.rehearsal,
        preferredResponse: output.content,
        status: 'complete',
      });
      setStatus('stage-04-rehearsal', 'complete');
    }
  }

  function switchPilot(id: string) {
    window.location.hash = `#console?pilot=${id}&mode=${mode}`;
  }

  function saveRehearsal(rehearsal: RehearsalState) {
    setRehearsal(rehearsal);
    if (rehearsal.status === 'complete') setStatus('stage-04-rehearsal', 'complete');
    else if (rehearsal.response?.status === 'submitted') setStatus('stage-04-rehearsal', 'draft');
  }

  return (
    <>
      <div className={`shell mode-${mode}`}>
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
            allPilots={(isDeveloper || isFacilitator) ? ALL_PILOTS.map(p => ({ id: p.id, title: p.title.replace('Pilot ', 'P').split(':')[0].trim(), status: p.status })) : []}
            onSwitchPilot={switchPilot}
          />
          <main className="main">
            {isDeveloper && (
              <div className="console-provider-row">
                <ProviderBadge />
              </div>
            )}
            {isFacilitator && (
              <div className="mode-banner">
                <strong>Facilitator view</strong>
                <span>Review progress and evidence without changing participant content.</span>
              </div>
            )}
            <StageWorkspace
              stage={activeStage}
              entry={activeEntry}
              index={activeIndex}
              total={pilot.stages.length}
              hasAgent={activeStage.id in STAGE_AGENTS}
              dependency={dependency}
              completedStageIds={completedStageIds}
              rehearsalAnswer={rehearsalAnswer}
              rehearsal={state.rehearsal}
              mode={mode}
              onGenerate={handleGenerate}
              onSaveOutput={handleSaveOutput}
              onSaveUserInput={(input) => setUserInput(activeStage.id, input)}
              onSaveRehearsal={saveRehearsal}
              onCycleStatus={(status) => setStatus(activeStage.id, status)}
              onPrev={() => setActiveIndex(i => Math.max(0, i - 1))}
              onNext={() => setActiveIndex(i => Math.min(pilot.stages.length - 1, i + 1))}
            />
            {(isDeveloper || isFacilitator) && (
              <div className="bottom-row">
                <EvidencePanel evidence={pilot.evidence} />
                <ProductDecisionPanel decision={pilot.productDecision} />
              </div>
            )}
            {isDeveloper && <AgentLogPanel log={state.runLog ?? []} />}
            {isDeveloper && <ExportPanel pilot={pilot} state={state} onReset={resetPilot} />}
          </main>
        </div>
      </div>
      {mode === 'participant' && (
        <CustosPanel
          page="console"
          activeStage={activeStage}
          activeEntry={activeEntry}
          onApplyOutput={(content) =>
            setOutput(activeStage.id, {
              content,
              source: 'manual',
              generatedAt: new Date().toISOString(),
            })
          }
        />
      )}
    </>
  );
}
