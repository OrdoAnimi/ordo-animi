import { useEffect, useMemo, useState } from 'react';
import { SCENARIOS, type Scenario } from '../data/scenarios';
import '../styles/journey-flow.css';

const DIFFICULTY_LABEL = {
  foundational: 'Foundational',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const PILOT_BY_SCENARIO: Record<string, string> = {
  'VALOUR-S01': 'PILOT-001',
  'VALOUR-S02': 'PILOT-002',
  'VALOUR-S03': 'PILOT-S03',
  'VALOUR-S04': 'PILOT-S04',
  'VALOUR-S05': 'PILOT-S05',
  'VALOUR-S06': 'PILOT-S06',
  'VALOUR-S07': 'PILOT-S07',
  'VALOUR-S08': 'PILOT-S08',
  'VALOUR-S09': 'PILOT-S09',
  'VALOUR-S10': 'PILOT-S10',
};

type Props = { onBack: () => void; onSelectScenario: (id: string) => void; initialScenarioId?: string };
type View = 'library' | 'brief' | 'overview';

export function ScenariosPage({ onBack, initialScenarioId }: Props) {
  const [selected, setSelected] = useState<Scenario | null>(() =>
    initialScenarioId ? (SCENARIOS.find(s => s.id === initialScenarioId) ?? null) : null
  );
  const [view, setView] = useState<View>(initialScenarioId ? 'brief' : 'library');

  useEffect(() => {
    if (initialScenarioId) {
      const scenario = SCENARIOS.find(s => s.id === initialScenarioId);
      if (scenario) { setSelected(scenario); setView('brief'); }
    }
  }, [initialScenarioId]);

  const hasProgress = useMemo(() => {
    if (!selected) return false;
    const pilotId = PILOT_BY_SCENARIO[selected.id];
    try {
      const saved = localStorage.getItem(`valour:state:${pilotId}`);
      if (!saved) return false;
      const parsed = JSON.parse(saved) as { entries?: Record<string, { userInput?: string; output?: unknown }> };
      return Object.values(parsed.entries ?? {}).some(entry => !!entry.userInput || !!entry.output);
    } catch {
      return false;
    }
  }, [selected]);

  function chooseScenario(scenario: Scenario) {
    setSelected(scenario);
    setView('brief');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openSession(newSession: boolean) {
    if (!selected) return;
    const pilotId = PILOT_BY_SCENARIO[selected.id];
    localStorage.setItem('valour:last-scenario', selected.id);
    window.location.hash = `#console?pilot=${encodeURIComponent(pilotId)}&scenario=${encodeURIComponent(selected.id)}${newSession ? '&new=1' : ''}`;
  }

  if (selected && view === 'brief') {
    return (
      <div className="journey-page">
        <nav className="journey-nav">
          <button className="journey-nav-back" onClick={() => setView('library')}>← Scenario library</button>
          <button className="journey-brand" onClick={onBack}>VALOUR™<small>by Ordo Animi</small></button>
          <span className="journey-nav-location">Scenario brief</span>
        </nav>

        <main className="journey-shell scenario-brief">
          <section className="scenario-brief-hero">
            <div className="journey-eyebrow">Before you begin</div>
            <h1>{selected.title}</h1>
            <p className="scenario-brief-lead">{selected.situation}</p>
            <div className="scenario-brief-meta">
              <span>{selected.yourRole ?? 'Participant'}</span>
              <span>{selected.counterpart ?? 'Stakeholder'}</span>
              <span>{selected.duration ?? '20–30 min'}</span>
              <span>{DIFFICULTY_LABEL[selected.difficulty]}</span>
            </div>
          </section>

          <section className="scenario-brief-grid">
            <article className="journey-card"><div className="journey-card-label">Your role</div><h2>{selected.yourRole ?? 'Participant'}</h2><p>Create clarity, maintain trust, and move the conversation toward a decision.</p></article>
            <article className="journey-card"><div className="journey-card-label">The tension</div><h2>{selected.tension ?? 'A consequential decision under pressure'}</h2><p>{selected.userRisk}</p></article>
            <article className="journey-card"><div className="journey-card-label">Your objective</div><h2>Move the room forward</h2><p>{selected.desiredOutcome}</p></article>
          </section>

          <section className="scenario-brief-process">
            <div><div className="journey-eyebrow">What happens next</div><h2>Prepare before the pressure begins.</h2></div>
            <div className="scenario-brief-steps">
              <div><strong>01</strong><span>Frame your context and intended outcome.</span></div>
              <div><strong>02</strong><span>Generate a concise preparation brief.</span></div>
              <div><strong>03</strong><span>Enter the live AI stakeholder session.</span></div>
              <div><strong>04</strong><span>Debrief the critical moment and refine your next move.</span></div>
            </div>
          </section>

          <section className="journey-action-bar">
            <button className="journey-secondary" onClick={() => setView('library')}>Choose another scenario</button>
            <div className="journey-action-copy"><strong>Review complete</strong><span>Next, confirm how you want to enter the session.</span></div>
            <button className="journey-primary" onClick={() => setView('overview')}>Continue →</button>
          </section>
        </main>
      </div>
    );
  }

  if (selected && view === 'overview') {
    return (
      <div className="journey-page">
        <nav className="journey-nav">
          <button className="journey-nav-back" onClick={() => setView('brief')}>← Scenario brief</button>
          <button className="journey-brand" onClick={onBack}>VALOUR™<small>by Ordo Animi</small></button>
          <span className="journey-nav-location">Session overview</span>
        </nav>

        <main className="journey-shell session-overview">
          <section className="session-overview-header">
            <div><div className="journey-eyebrow">Your practice session</div><h1>{selected.title}</h1><p>{selected.situation}</p></div>
            <div className="session-overview-status"><span>{hasProgress ? 'Session in progress' : 'New session'}</span><strong>{hasProgress ? 'Saved work available' : 'Ready to prepare'}</strong></div>
          </section>

          <section className="session-phase-grid">
            <article><span>01</span><h2>Prepare</h2><p>Set the context, clarify the decision, and generate your brief.</p></article>
            <article><span>02</span><h2>Engage</h2><p>Respond to a realistic AI stakeholder challenge.</p></article>
            <article><span>03</span><h2>Debrief</h2><p>Review the critical moment and refine the response.</p></article>
          </section>

          <section className="session-overview-note"><div><strong>CUSTOS is available throughout</strong><p>Your embedded guide helps clarify context, challenge weak reasoning, and suggest the next best action.</p></div><span>Private · Auto-saved · Resume anytime</span></section>

          <section className="journey-action-bar">
            <button className="journey-secondary" onClick={() => setView('brief')}>Back to brief</button>
            <div className="journey-action-copy"><strong>{hasProgress ? 'Continue your saved work' : 'Begin with preparation'}</strong><span>You will not enter the live session until preparation is complete.</span></div>
            <div className="journey-action-pair">
              {hasProgress && <button className="journey-secondary" onClick={() => openSession(false)}>Resume session</button>}
              <button className="journey-primary" onClick={() => openSession(true)}>{hasProgress ? 'Start a new session' : 'Start preparation'} →</button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="scenarios-page">
      <nav className="pattern-nav"><button className="btn btn-ghost pattern-back" onClick={onBack}>← Home</button><span className="landing-logo">VALOUR™</span><span className="pattern-nav-title">Scenario library</span></nav>
      <div className="scenarios-hero"><div className="landing-eyebrow">10 scenarios · Leadership preparation</div><h1 className="pattern-heading">Choose your leadership moment.</h1><p className="scenarios-sub">Review the situation before starting. No session begins until you confirm the scenario and preparation path.</p></div>
      <div className="scenarios-grid-2col">
        {SCENARIOS.map((scenario) => (
          <div key={scenario.id} className="scenario-card-v2">
            <div className="scenario-card-v2-header"><h3 className="scenario-card-v2-title">{scenario.title}</h3><span className="badge badge-difficulty-neutral">{DIFFICULTY_LABEL[scenario.difficulty]}</span></div>
            {scenario.tension && <p className="scenario-card-v2-tension">{scenario.tension}</p>}
            <div className="scenario-card-v2-meta">{scenario.yourRole && <span className="scenario-meta-chip">You: {scenario.yourRole}</span>}{scenario.counterpart && <span className="scenario-meta-chip">With: {scenario.counterpart}</span>}{scenario.duration && <span className="scenario-meta-chip">{scenario.duration}</span>}</div>
            <button className="btn btn-primary scenario-card-v2-cta" onClick={() => chooseScenario(scenario)}>Review scenario →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
