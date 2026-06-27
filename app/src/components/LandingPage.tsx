type Props = { onEnterConsole: () => void };

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

export function LandingPage({ onEnterConsole }: Props) {
  return (
    <div className="landing">

      <nav className="landing-nav">
        <span className="landing-logo">Valour&trade;</span>
        <button className="btn btn-primary landing-cta-nav" onClick={onEnterConsole}>
          Enter console →
        </button>
      </nav>

      <section className="landing-hero">
        <div className="landing-eyebrow">Architecture Leadership · AI Rehearsal</div>
        <h1 className="landing-headline">
          Prepare for the architecture conversations that decide trust.
        </h1>
        <p className="landing-subheadline">
          Valour&trade; is an AI-assisted leadership rehearsal system for architects and technical leaders.
          Prepare for review boards, executive briefings, workshops, stakeholder conflict,
          and trade-off conversations — before the real meeting happens.
        </p>
        <div className="landing-hero-actions">
          <button className="btn btn-primary landing-btn-lg" onClick={onEnterConsole}>
            Enter pilot console
          </button>
          <a className="btn btn-ghost landing-btn-lg" href="mailto:info@ordoanimi.com">
            Request a walkthrough
          </a>
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
        <div className="landing-eyebrow">The Valour&trade; loop</div>
        {['Prepare', 'Rehearse', 'Perform', 'Review', 'Improve'].map((step, i) => (
          <div key={step} className="loop-step">
            <span className="loop-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="loop-label">{step}</span>
          </div>
        ))}
      </section>

      <section className="landing-section">
        <div className="landing-eyebrow">Scenario library</div>
        <h2 className="landing-section-heading">Built for real architecture leadership moments.</h2>
        <div className="scenario-grid">
          {SCENARIOS.map(s => (
            <div key={s} className="scenario-chip">{s}</div>
          ))}
        </div>
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
        <h2 className="landing-section-heading">Private pilot now forming.</h2>
        <p className="landing-section-body">
          Bring one real upcoming leadership situation. Valour&trade; helps you prepare it, rehearse it,
          refine the language, and review the result.
        </p>
        <button className="btn btn-primary landing-btn-lg" onClick={onEnterConsole}>
          Enter pilot console →
        </button>
      </section>

      <footer className="landing-footer">
        <span className="landing-logo">Valour&trade;</span>
        <span className="landing-footer-copy">
          © 2026 The OrdoAnimi Group · Proprietary and confidential ·{' '}
          <a href="mailto:info@ordoanimi.com">info@ordoanimi.com</a>
        </span>
      </footer>

    </div>
  );
}
