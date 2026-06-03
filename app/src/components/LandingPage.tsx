type Props = { onEnterConsole: () => void; onJoinPilot: () => void; onViewScenarios: () => void };

const SCENARIOS = [
  'Architecture review board',
  'Executive briefing',
  'Discovery workshop',
  'Challenging a poor solution',
  'Security or risk pushback',
  'Delivery conflict',
  'Architecture trade-off explanation',
  'Strategy-to-architecture translation',
  'First meeting with a new team',
  'End-of-day handover',
];

export function LandingPage({ onEnterConsole, onViewScenarios }: Props) {
  return (
    <div className="landing">

      <nav className="landing-nav">
        <span className="landing-logo">VALOUR™</span>
        <div className="landing-nav-links">
          <button className="landing-nav-link" onClick={onViewScenarios}>Scenarios</button>
          <button className="landing-nav-link" onClick={onEnterConsole}>Console</button>
          <button className="btn btn-primary landing-cta-nav" onClick={onEnterConsole}>
            Enter VALOUR™ →
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-eyebrow">Architecture Leadership · AI Rehearsal</div>
        <h1 className="landing-headline">
          Prepare for the architecture conversations that decide trust.
        </h1>
        <p className="landing-subheadline">
          VALOUR™ is an AI-assisted leadership rehearsal system for architects and technical leaders.
          Prepare for review boards, executive briefings, workshops, stakeholder conflict,
          and trade-off conversations — before the real meeting happens.
        </p>
        <div className="landing-hero-actions">
          <button className="btn btn-primary landing-btn-lg" onClick={onEnterConsole}>
            Enter VALOUR™ →
          </button>
          <button className="btn btn-ghost landing-btn-lg" onClick={onViewScenarios}>
            View scenarios
          </button>
        </div>
      </section>

      <section className="landing-section">
        <h2 className="landing-section-heading">
          Architecture leadership fails in conversation before it fails in documentation.
        </h2>
        <p className="landing-section-body">
          Architects are trained to produce frameworks, diagrams, decisions, and artefacts.
          But the hardest moments are often human. Brief executives without drowning them in detail.
          Challenge poor decisions without becoming the blocker. Explain risk without sounding negative.
          Translate complexity into decisions others can act on. That leadership layer is rarely trained directly.
        </p>
      </section>

      <section className="landing-loop">
        <div className="landing-eyebrow">The VALOUR™ loop</div>
        {['Prepare', 'Rehearse', 'Perform', 'Review', 'Improve'].map((step, i) => (
          <div key={step} className="loop-step">
            <span className="loop-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="loop-label">{step}</span>
          </div>
        ))}
      </section>

      <section className="landing-section">
        <div className="landing-eyebrow">What you get</div>
        <h2 className="landing-section-heading">Leave with something concrete.</h2>
        <div className="outcomes-grid">
          <div className="outcome-card">
            <div className="outcome-num">5 → 8</div>
            <div className="outcome-title">Confidence shift</div>
            <p className="outcome-desc">A measurable confidence improvement from intake to completion, validated against your real situation.</p>
          </div>
          <div className="outcome-card">
            <div className="outcome-num" style={{ fontSize: '24px' }}>Better language</div>
            <div className="outcome-title">Refined answers</div>
            <p className="outcome-desc">Short, executive, empathetic, and decision-oriented versions of your key messages — ready to use.</p>
          </div>
          <div className="outcome-card">
            <div className="outcome-num" style={{ fontSize: '20px' }}>One pattern</div>
            <div className="outcome-title">Leadership insight</div>
            <p className="outcome-desc">Your primary leadership communication pattern identified and named — with one clear next focus area.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-eyebrow">Scenario library</div>
        <h2 className="landing-section-heading">Built for real architecture leadership moments.</h2>
        <div className="scenario-grid">
          {SCENARIOS.map(s => (
            <div key={s} className="scenario-chip">{s}</div>
          ))}
        </div>
        <button className="btn btn-ghost" style={{ marginTop: '16px' }} onClick={onViewScenarios}>
          View all scenarios →
        </button>
      </section>

      <section className="landing-section landing-audience">
        <div className="landing-eyebrow">Who it is for</div>
        <p className="landing-section-body">
          Enterprise architects, solution architects, cloud architects, security architects,
          domain architects, principal consultants, architecture practice leads, and technical
          leaders moving into advisory or leadership roles.
        </p>
      </section>

      <section className="landing-section landing-cta-section">
        <h2 className="landing-section-heading">Start with one real leadership situation.</h2>
        <p className="landing-section-body">
          Bring one upcoming conversation — a review board, an executive briefing, a difficult stakeholder meeting.
          VALOUR™ helps you prepare it, rehearse it, refine the language, and review the result.
        </p>
        <div className="landing-hero-actions">
          <button className="btn btn-primary landing-btn-lg" onClick={onEnterConsole}>
            Enter VALOUR™ →
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <span className="landing-logo">VALOUR™</span>
        <span className="landing-footer-copy">
          © 2026 ZenCloud Global Consultants · Proprietary and confidential ·{' '}
          <a href="mailto:info@zencloud.com.au">info@zencloud.com.au</a>
        </span>
      </footer>

    </div>
  );
}
