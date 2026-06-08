type Props = { onEnterConsole: () => void; onJoinPilot: () => void; onViewScenarios: () => void };

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

const COPILOT_ACTIONS = [
  'Identify missing context before the meeting',
  'Challenge weak or unclear recommendations',
  'Generate realistic executive questions',
  'Refine responses into concise leadership language',
];

export function LandingPage({ onEnterConsole, onViewScenarios }: Props) {
  return (
    <div className="landing landing-reset">

      <nav className="landing-nav landing-nav-reset">
        <div>
          <div className="landing-logo">VALOUR™</div>
          <div className="landing-nav-tag">Architecture leadership co-pilot</div>
        </div>

        <div className="landing-nav-links landing-nav-links-reset">
          <button className="landing-nav-link" onClick={onViewScenarios}>Scenarios</button>
          <button className="landing-nav-link" onClick={onEnterConsole}>Resume session</button>
          <button className="btn btn-primary landing-cta-nav landing-cta-nav-reset" onClick={onEnterConsole}>
            Start practice session
          </button>
        </div>
      </nav>

      <section className="landing-hero landing-hero-reset">

        <div className="landing-main-column">
          <div className="landing-eyebrow landing-eyebrow-reset">
            Guided rehearsal for architects and technical leaders
          </div>

          <h1 className="landing-headline landing-headline-reset">
            Practise the architecture conversations that matter before they happen.
          </h1>

          <p className="landing-subheadline landing-subheadline-reset">
            VALOUR™ helps you prepare for review boards, executive briefings, difficult stakeholder conversations,
            and architecture trade-off discussions. Bring a real situation, rehearse the difficult questions,
            and leave with language you can use.
          </p>

          <div className="landing-hero-actions landing-hero-actions-reset">
            <button className="btn btn-primary landing-btn-xl" onClick={onEnterConsole}>
              Start a practice session
            </button>

            <button className="btn btn-ghost landing-btn-xl landing-btn-secondary" onClick={onViewScenarios}>
              Explore scenarios
            </button>
          </div>

          <div className="landing-flow-row">
            {['Prepare', 'Rehearse', 'Refine', 'Perform'].map(step => (
              <div key={step} className="landing-flow-card">
                <div className="landing-flow-title">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="landing-custos-panel">
          <div className="landing-custos-title">CUSTOS Guide</div>
          <p className="landing-custos-body">
            CUSTOS is your active AI guide inside VALOUR. It helps identify missing information,
            challenges weak recommendations, and prepares you for likely executive questions.
          </p>

          <div className="landing-custos-subtitle">What CUSTOS can help with</div>

          <div className="landing-custos-actions">
            {COPILOT_ACTIONS.map(action => (
              <div key={action} className="landing-custos-action">
                {action}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="landing-section landing-section-reset">
        <div className="landing-section-heading landing-section-heading-reset">
          Start with one real leadership situation.
        </div>

        <div className="landing-scenario-grid-reset">
          {FEATURED_SCENARIOS.map(scenario => (
            <button
              key={scenario.title}
              className="landing-scenario-card"
              onClick={onEnterConsole}
            >
              <div className="landing-scenario-card-title">{scenario.title}</div>
              <div className="landing-scenario-card-description">{scenario.description}</div>
              <div className="landing-scenario-card-action">Practise this scenario →</div>
            </button>
          ))}
        </div>

        <div className="landing-section-actions">
          <button className="btn btn-ghost landing-btn-secondary" onClick={onViewScenarios}>
            View all scenarios
          </button>
        </div>
      </section>

      <section className="landing-section landing-section-reset landing-results-section">
        <div className="landing-section-heading landing-section-heading-reset">
          What you leave with
        </div>

        <div className="landing-results-grid">
          <div className="landing-result-card">
            <div className="landing-result-title">Prepared responses</div>
            <div className="landing-result-body">
              Refined executive and stakeholder-ready language for the conversation you are preparing for.
            </div>
          </div>

          <div className="landing-result-card">
            <div className="landing-result-title">Real rehearsal</div>
            <div className="landing-result-body">
              Practice against difficult questions before the meeting happens.
            </div>
          </div>

          <div className="landing-result-card">
            <div className="landing-result-title">Leadership insight</div>
            <div className="landing-result-body">
              Clear patterns showing how you communicate under pressure and where to improve.
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer landing-footer-reset">
        <div>
          <span className="landing-logo">VALOUR™</span>
          <div className="landing-footer-tag">
            Architecture leadership co-pilot
          </div>
        </div>

        <div className="landing-footer-copy landing-footer-copy-reset">
          Designed for Enterprise Architects, Solution Architects, architecture practice leaders, and technical advisors.
        </div>
      </footer>

    </div>
  );
}
