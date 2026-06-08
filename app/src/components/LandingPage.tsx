type Props = { onEnterConsole: () => void; onViewScenarios: () => void };

const FEATURED_SCENARIOS = [
  {
    title: 'Architecture Review Board',
    description: 'Prepare for difficult technical, delivery, and risk questions before the review happens.',
  },
  {
    title: 'Executive Design Challenge',
    description: 'Explain trade-offs and secure executive confidence without drowning leaders in detail.',
  },
  {
    title: 'Stakeholder Conflict Meeting',
    description: 'Handle disagreement, delivery pressure, and competing priorities with clearer language.',
  },
];

export function LandingPage({ onEnterConsole, onViewScenarios }: Props) {
  return (
    <div className="valour-landscape">
      <header className="valour-landscape-nav">
        <div>
          <div className="valour-wordmark">VALOUR™</div>
          <div className="valour-tagline">Architecture Leadership Co-pilot</div>
        </div>
        <nav className="valour-nav-actions" aria-label="Primary navigation">
          <a className="valour-nav-link" href="#how-it-works">How it works</a>
          <button className="valour-nav-link" onClick={onViewScenarios}>Scenarios</button>
          <a className="valour-nav-link" href="#outputs">What you receive</a>
          <button className="valour-nav-link" onClick={onEnterConsole}>Resume</button>
          <button className="valour-btn valour-btn-primary" onClick={onEnterConsole}>Start practice</button>
        </nav>
      </header>

      <main>
        <section className="valour-slide valour-slide-light valour-hero-slide">
          <div className="valour-hero-copy">
            <div className="valour-kicker">Guided preparation for high-stakes architecture moments</div>
            <h1>Prepare the conversation before it decides trust.</h1>
            <p>
              VALOUR helps architects frame the decision, rehearse difficult questions,
              and refine the language they will use with executives, review boards, and stakeholders.
            </p>
            <div className="valour-hero-actions">
              <button className="valour-btn valour-btn-primary" onClick={onEnterConsole}>Start a practice session</button>
              <button className="valour-btn valour-btn-secondary" onClick={onViewScenarios}>Explore scenarios</button>
            </div>
            <div className="valour-hero-proof">
              <span>Prepare</span><span>Rehearse</span><span>Refine</span><span>Apply</span>
            </div>
          </div>

          <aside className="valour-insight-panel">
            <div className="valour-insight-label">CUSTOS active guide</div>
            <h2>I help you see what is missing before the meeting does.</h2>
            <div className="valour-insight-list">
              <div><strong>Frame the decision.</strong><span>Clarify what you need the audience to approve.</span></div>
              <div><strong>Challenge the recommendation.</strong><span>Surface weak assumptions and likely objections.</span></div>
              <div><strong>Refine the language.</strong><span>Turn technical depth into concise leadership communication.</span></div>
            </div>
            <button className="valour-btn valour-btn-outline" onClick={onEnterConsole}>See CUSTOS in practice</button>
          </aside>
        </section>

        <section id="how-it-works" className="valour-slide valour-slide-dark valour-statement-slide">
          <div className="valour-statement-copy">
            <div className="valour-kicker">Architecture leadership is conversational</div>
            <h2>The quality of the decision often depends on the quality of the conversation.</h2>
            <p>
              VALOUR gives you a structured place to prepare, test, and improve the response before the pressure is real.
            </p>
          </div>
        </section>

        <section className="valour-slide valour-slide-light valour-scenarios-slide">
          <div className="valour-section-heading">
            <div className="valour-kicker">Start with one real situation</div>
            <h2>Choose the conversation you need to handle well.</h2>
          </div>
          <div className="valour-featured-grid">
            {FEATURED_SCENARIOS.map((scenario, index) => (
              <button
                key={scenario.title}
                className={`valour-scenario-card${index === 0 ? ' featured' : ''}`}
                onClick={onEnterConsole}
              >
                <span className="valour-scenario-index">0{index + 1}</span>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
                <span className="valour-scenario-action">Practise this scenario →</span>
              </button>
            ))}
          </div>
          <button className="valour-text-link" onClick={onViewScenarios}>View all scenarios →</button>
        </section>

        <section id="outputs" className="valour-slide valour-slide-dark valour-output-slide">
          <div className="valour-section-heading">
            <div className="valour-kicker">Leave with something useful</div>
            <h2>Not a generic chat. A prepared response you can use.</h2>
          </div>
          <div className="valour-output-grid">
            <article><span>01</span><h3>Preparation brief</h3><p>Your recommendation, audience, decision, risks, and opening frame.</p></article>
            <article><span>02</span><h3>Rehearsed response</h3><p>Your answer to the difficult question most likely to challenge the recommendation.</p></article>
            <article><span>03</span><h3>Refined executive language</h3><p>A concise version built for the audience and decision in front of you.</p></article>
          </div>
        </section>

        <section className="valour-slide valour-slide-light valour-final-slide">
          <h2>Bring one real architecture situation.</h2>
          <p>CUSTOS will guide the preparation. VALOUR will help you rehearse the moment.</p>
          <button className="valour-btn valour-btn-primary" onClick={onEnterConsole}>Start practice</button>
        </section>
      </main>
    </div>
  );
}
