type Props = {
  onEnterConsole: () => void;
  onStartNew: (scenarioId?: string) => void;
  onJoinPilot: () => void;
  onViewScenarios: () => void;
};

const FEATURED_SCENARIOS = [
  {
    title: 'Architecture Review Board',
    scenarioId: 'VALOUR-S01',
    description: 'Defend a design recommendation under scrutiny from delivery, risk, and executive stakeholders.',
    role: 'Chief Architect',
    duration: '12 min',
  },
  {
    title: 'Executive Briefing',
    scenarioId: 'VALOUR-S02',
    description: 'Explain a consequential technology decision with clarity, brevity, and commercial relevance.',
    role: 'Technology Leader',
    duration: '8 min',
  },
  {
    title: 'Delivery Conflict',
    scenarioId: 'VALOUR-S06',
    description: 'Navigate disagreement, delivery pressure, and competing priorities without losing alignment.',
    role: 'Architecture Lead',
    duration: '10 min',
  },
];

const PATHWAYS = [
  {
    number: '01',
    title: 'Prepare',
    body: 'Frame the situation, decision, and stakeholder tension before entering the room.',
  },
  {
    number: '02',
    title: 'Rehearse',
    body: 'Respond to realistic challenge from an AI stakeholder pursuing a clear objective.',
  },
  {
    number: '03',
    title: 'Debrief',
    body: 'Review the critical moments, refine the response, and leave with a stronger next move.',
  },
];

export function LandingPage({ onEnterConsole, onStartNew, onViewScenarios }: Props) {
  return (
    <div className="exec-site">
      <style>{`
        .exec-site {
          --paper: #f4f0e7;
          --paper-2: #ebe4d7;
          --ink: #151713;
          --graphite: #1b201c;
          --graphite-2: #242b25;
          --muted: #6d7068;
          --rule: rgba(21, 23, 19, 0.15);
          --gold: #b98a3b;
          --gold-soft: #d6b875;
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .exec-site * { box-sizing: border-box; }
        .exec-shell { width: min(1440px, calc(100% - 48px)); margin: 0 auto; }
        .exec-ecosystem {
          min-height: 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: #0f120f;
          color: rgba(255,255,255,.62);
          font-size: 11px;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .exec-ecosystem-links { display: flex; gap: 22px; }
        .exec-ecosystem a { color: inherit; text-decoration: none; }
        .exec-nav {
          min-height: 82px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          border-bottom: 1px solid var(--rule);
        }
        .exec-brand { font-family: 'Playfair Display', Georgia, serif; font-size: 27px; letter-spacing: .04em; }
        .exec-brand small { display: block; margin-top: 3px; font: 10px 'DM Sans', sans-serif; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); }
        .exec-nav-links { display: flex; gap: 30px; align-items: center; }
        .exec-nav button { border: 0; background: none; color: inherit; cursor: pointer; font: inherit; }
        .exec-nav-link { font-size: 13px; }
        .exec-nav-actions { justify-self: end; display: flex; gap: 12px; align-items: center; }
        .exec-btn {
          min-height: 46px;
          padding: 0 22px;
          border: 1px solid transparent;
          border-radius: 3px;
          font: 600 13px 'DM Sans', sans-serif;
          cursor: pointer;
          transition: transform .16s ease, background .16s ease, border-color .16s ease;
        }
        .exec-btn:hover { transform: translateY(-1px); }
        .exec-btn-primary { background: var(--gold); color: #11140f; }
        .exec-btn-dark { background: var(--graphite); color: white; }
        .exec-btn-ghost { background: transparent; color: inherit; border-color: currentColor; }
        .exec-hero {
          background: var(--graphite);
          color: #f7f2e8;
          min-height: 690px;
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(380px, .88fr);
          align-items: stretch;
        }
        .exec-hero-copy { padding: 108px 7vw 88px max(24px, calc((100vw - 1392px)/2)); display: flex; flex-direction: column; justify-content: center; }
        .exec-eyebrow { color: var(--gold-soft); text-transform: uppercase; letter-spacing: .18em; font-size: 11px; font-weight: 700; }
        .exec-hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(54px, 6vw, 92px); line-height: .98; font-weight: 700; margin: 24px 0 28px; max-width: 10ch; }
        .exec-hero h1 em { color: var(--gold-soft); font-style: italic; font-weight: 500; }
        .exec-hero-copy p { max-width: 590px; color: rgba(247,242,232,.72); font-size: 18px; line-height: 1.7; margin: 0 0 34px; }
        .exec-hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }
        .exec-hero-proof { margin-top: 50px; display: flex; gap: 32px; flex-wrap: wrap; color: rgba(247,242,232,.55); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; }
        .exec-room { position: relative; padding: 72px 7vw 72px 42px; background: linear-gradient(145deg, var(--graphite-2), #111511); display: flex; align-items: center; }
        .exec-room::before { content: ''; position: absolute; inset: 32px; border: 1px solid rgba(214,184,117,.22); }
        .exec-room-card { position: relative; z-index: 1; width: 100%; max-width: 560px; margin: auto; border: 1px solid rgba(255,255,255,.14); background: rgba(9,12,9,.72); padding: 32px; box-shadow: 0 30px 70px rgba(0,0,0,.28); }
        .exec-room-kicker { display: flex; justify-content: space-between; color: var(--gold-soft); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }
        .exec-room-title { margin: 24px 0 8px; font: 600 15px 'DM Sans', sans-serif; color: rgba(255,255,255,.62); }
        .exec-room-quote { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; line-height: 1.35; margin: 0 0 34px; }
        .exec-objective { border-top: 1px solid rgba(255,255,255,.14); padding-top: 22px; }
        .exec-objective-label { color: var(--gold-soft); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }
        .exec-objective p { margin: 8px 0 0; color: rgba(255,255,255,.7); line-height: 1.55; }
        .exec-intro { padding: 104px 0 84px; border-bottom: 1px solid var(--rule); }
        .exec-intro-grid { display: grid; grid-template-columns: .72fr 1.28fr; gap: 90px; align-items: start; }
        .exec-section-label { color: #8d6728; font-size: 11px; text-transform: uppercase; letter-spacing: .17em; font-weight: 700; }
        .exec-intro h2, .exec-section-head h2 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(42px, 4.4vw, 66px); line-height: 1.05; margin: 0; font-weight: 600; }
        .exec-intro-copy { padding-top: 8px; }
        .exec-intro-copy p { font-size: 20px; line-height: 1.7; color: #4e534c; margin: 0 0 28px; }
        .exec-pathways { padding: 92px 0; }
        .exec-section-head { display: flex; align-items: end; justify-content: space-between; gap: 48px; margin-bottom: 46px; }
        .exec-section-head p { max-width: 480px; color: var(--muted); line-height: 1.65; }
        .exec-path-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
        .exec-path-card { padding: 42px 34px 48px; border-right: 1px solid var(--rule); }
        .exec-path-card:last-child { border-right: 0; }
        .exec-path-number { color: #9b7434; font-size: 11px; letter-spacing: .12em; }
        .exec-path-card h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 34px; margin: 24px 0 16px; }
        .exec-path-card p { color: var(--muted); line-height: 1.65; margin: 0; }
        .exec-scenarios { background: #e9e1d3; padding: 96px 0 108px; }
        .exec-scenario-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .exec-scenario {
          text-align: left;
          background: transparent;
          border: 1px solid rgba(21,23,19,.18);
          border-radius: 0;
          padding: 30px;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          color: inherit;
          transition: background .16s ease, transform .16s ease;
        }
        .exec-scenario:hover { background: rgba(255,255,255,.45); transform: translateY(-2px); }
        .exec-scenario-meta { display: flex; justify-content: space-between; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #7f6540; }
        .exec-scenario h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 31px; line-height: 1.08; margin: 42px 0 18px; }
        .exec-scenario p { color: #5a5f57; line-height: 1.65; margin: 0; }
        .exec-scenario-action { margin-top: auto; padding-top: 30px; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
        .exec-scenario-footer { display: flex; justify-content: center; margin-top: 34px; }
        .exec-final { background: var(--graphite); color: white; padding: 92px 0; text-align: center; }
        .exec-final h2 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(42px, 5vw, 68px); max-width: 900px; margin: 0 auto 30px; line-height: 1.05; }
        .exec-final p { color: rgba(255,255,255,.62); max-width: 620px; margin: 0 auto 32px; font-size: 17px; line-height: 1.65; }
        .exec-footer { padding: 34px 0 42px; border-top: 1px solid var(--rule); display: flex; align-items: end; justify-content: space-between; gap: 24px; color: var(--muted); font-size: 12px; }
        @media (max-width: 980px) {
          .exec-nav { grid-template-columns: 1fr auto; }
          .exec-nav-links { display: none; }
          .exec-hero { grid-template-columns: 1fr; }
          .exec-room { min-height: 520px; padding: 54px 24px; }
          .exec-hero-copy { padding: 82px 24px 72px; }
          .exec-intro-grid { grid-template-columns: 1fr; gap: 36px; }
          .exec-path-grid, .exec-scenario-grid { grid-template-columns: 1fr; }
          .exec-path-card { border-right: 0; border-bottom: 1px solid var(--rule); }
          .exec-path-card:last-child { border-bottom: 0; }
          .exec-section-head { align-items: start; flex-direction: column; }
        }
        @media (max-width: 640px) {
          .exec-shell { width: min(100% - 28px, 1440px); }
          .exec-ecosystem { padding: 10px 14px; align-items: flex-start; gap: 10px; flex-direction: column; }
          .exec-ecosystem-links { gap: 12px; flex-wrap: wrap; }
          .exec-nav { min-height: 72px; }
          .exec-nav-actions .exec-btn-ghost { display: none; }
          .exec-btn { min-height: 44px; padding: 0 16px; }
          .exec-hero h1 { font-size: 50px; }
          .exec-hero-copy p { font-size: 16px; }
          .exec-room-card { padding: 24px; }
          .exec-room-quote { font-size: 24px; }
          .exec-intro, .exec-pathways, .exec-scenarios, .exec-final { padding-top: 68px; padding-bottom: 68px; }
          .exec-footer { align-items: flex-start; flex-direction: column; }
        }
      `}</style>

      <div className="exec-ecosystem">
        <span>ZenCloud ecosystem</span>
        <div className="exec-ecosystem-links">
          <a href="https://www.zencloud.com.au">ZenCloud™</a>
          <a href="https://studiosix.com.au">StudioSix™</a>
          <a href="https://velocityarchitectureframework.com">Velocity™</a>
        </div>
      </div>

      <div className="exec-shell">
        <nav className="exec-nav" aria-label="Primary navigation">
          <div className="exec-brand">VALOUR™<small>by Ordo Animi</small></div>
          <div className="exec-nav-links">
            <button className="exec-nav-link" onClick={onViewScenarios}>Scenarios</button>
            <button className="exec-nav-link" onClick={onEnterConsole}>Resume session</button>
          </div>
          <div className="exec-nav-actions">
            <button className="exec-btn exec-btn-ghost" onClick={onEnterConsole}>Resume</button>
            <button className="exec-btn exec-btn-dark" onClick={() => onStartNew()}>Start rehearsal</button>
          </div>
        </nav>
      </div>

      <section className="exec-hero">
        <div className="exec-hero-copy">
          <div className="exec-eyebrow">Agentic AI leadership rehearsal</div>
          <h1>Rehearse the room <em>before it decides.</em></h1>
          <p>
            VALOUR places architecture and technology leaders inside realistic, high-stakes conversations so they can test decisions, practise responses, and prepare a stronger next move.
          </p>
          <div className="exec-hero-actions">
            <button className="exec-btn exec-btn-primary" onClick={() => onStartNew()}>Start a practice session</button>
            <button className="exec-btn exec-btn-ghost" onClick={onViewScenarios}>Explore scenarios</button>
          </div>
          <div className="exec-hero-proof">
            <span>Private practice</span><span>Responsive AI stakeholders</span><span>Structured debrief</span>
          </div>
        </div>

        <div className="exec-room" aria-label="Product preview">
          <div className="exec-room-card">
            <div className="exec-room-kicker"><span>Live rehearsal</span><span>07:42 remaining</span></div>
            <div className="exec-room-title">Review Board Chair</div>
            <p className="exec-room-quote">“You are asking us to approve significant delivery risk without proving the commercial return. Why should we support this?”</p>
            <div className="exec-objective">
              <div className="exec-objective-label">Your objective</div>
              <p>Secure conditional endorsement while addressing cost, accountability, and delivery confidence.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="exec-intro">
        <div className="exec-shell exec-intro-grid">
          <div><div className="exec-section-label">The leadership reality</div></div>
          <div className="exec-intro-copy">
            <h2>Leadership is rarely difficult because information is absent.</h2>
            <p>It is difficult because time is limited, interests conflict, and the quality of the decision depends on how it is communicated.</p>
            <p>VALOUR creates a private place to practise what happens next—before the real conversation carries consequences.</p>
          </div>
        </div>
      </section>

      <section className="exec-pathways">
        <div className="exec-shell">
          <div className="exec-section-head">
            <div>
              <div className="exec-section-label">The rehearsal method</div>
              <h2>Prepare. Rehearse. Debrief.</h2>
            </div>
            <p>A focused experience that moves from context to live pressure, then converts the session into a stronger real-world response.</p>
          </div>
          <div className="exec-path-grid">
            {PATHWAYS.map(path => (
              <article className="exec-path-card" key={path.number}>
                <div className="exec-path-number">{path.number}</div>
                <h3>{path.title}</h3>
                <p>{path.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="exec-scenarios">
        <div className="exec-shell">
          <div className="exec-section-head">
            <div>
              <div className="exec-section-label">Executive case library</div>
              <h2>Start with one real leadership moment.</h2>
            </div>
            <p>Select a situation that resembles the pressure you are preparing to face. Each scenario begins a working VALOUR session.</p>
          </div>
          <div className="exec-scenario-grid">
            {FEATURED_SCENARIOS.map(scenario => (
              <button className="exec-scenario" key={scenario.scenarioId} onClick={() => onStartNew(scenario.scenarioId)}>
                <div className="exec-scenario-meta"><span>{scenario.role}</span><span>{scenario.duration}</span></div>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
                <div className="exec-scenario-action">Enter scenario →</div>
              </button>
            ))}
          </div>
          <div className="exec-scenario-footer">
            <button className="exec-btn exec-btn-ghost" onClick={onViewScenarios}>View all scenarios</button>
          </div>
        </div>
      </section>

      <section className="exec-final">
        <div className="exec-shell">
          <h2>The real conversation should not be your first attempt.</h2>
          <p>Enter a realistic leadership scenario, respond under pressure, and leave with a clearer approach to the decision ahead.</p>
          <button className="exec-btn exec-btn-primary" onClick={() => onStartNew()}>Start a practice session</button>
        </div>
      </section>

      <footer className="exec-shell exec-footer">
        <div className="exec-brand">VALOUR™<small>by Ordo Animi</small></div>
        <div>Architecture leadership rehearsal · ZenCloud Global Consultants</div>
      </footer>
    </div>
  );
}
