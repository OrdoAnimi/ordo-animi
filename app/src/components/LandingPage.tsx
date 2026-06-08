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

      <style>{`
        .landing-reset {
          width: min(1800px, 96vw);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 48px;
          color: #0f172a;
        }

        .landing-nav-reset,
        .landing-hero-reset,
        .landing-section-reset,
        .landing-footer-reset {
          background: #ffffff;
          border: 1px solid #dbe4ee;
          border-radius: 28px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        }

        .landing-nav-reset {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          position: sticky;
          top: 12px;
          z-index: 10;
        }

        .landing-nav-tag,
        .landing-footer-tag {
          margin-top: 8px;
          font-size: 15px;
          color: #475569;
        }

        .landing-nav-links-reset {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .landing-cta-nav-reset,
        .landing-btn-xl {
          min-height: 56px;
          padding: 0 28px;
          border-radius: 16px;
          font-size: 17px;
          font-weight: 700;
        }

        .landing-btn-secondary {
          border: 1px solid #cbd5e1;
          background: #fff;
          color: #0f172a;
        }

        .landing-hero-reset {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(360px, 0.9fr);
          gap: 32px;
          align-items: stretch;
        }

        .landing-main-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .landing-eyebrow-reset {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #e8630a;
        }

        .landing-headline-reset {
          font-size: clamp(42px, 5vw, 72px);
          line-height: 1.02;
          font-weight: 800;
          max-width: 12ch;
        }

        .landing-subheadline-reset {
          font-size: 20px;
          line-height: 1.7;
          color: #334155;
          max-width: 42ch;
        }

        .landing-hero-actions-reset {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .landing-flow-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .landing-flow-card,
        .landing-custos-action,
        .landing-result-card {
          border: 1px solid #dbe4ee;
          background: #f8fafc;
          border-radius: 18px;
          padding: 18px;
        }

        .landing-flow-title,
        .landing-result-title,
        .landing-custos-title,
        .landing-scenario-card-title {
          font-size: 20px;
          font-weight: 700;
        }

        .landing-custos-panel {
          background: linear-gradient(180deg, #0f172a 0%, #172554 100%);
          color: white;
          border-radius: 24px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .landing-custos-body,
        .landing-result-body,
        .landing-scenario-card-description {
          font-size: 17px;
          line-height: 1.7;
        }

        .landing-custos-subtitle {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #cbd5e1;
          margin-top: 8px;
        }

        .landing-custos-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .landing-custos-action {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
          font-size: 16px;
          line-height: 1.6;
        }

        .landing-section-heading-reset {
          font-size: 38px;
          font-weight: 800;
          margin-bottom: 28px;
        }

        .landing-scenario-grid-reset,
        .landing-results-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .landing-scenario-card {
          border: 1px solid #dbe4ee;
          background: white;
          border-radius: 22px;
          padding: 24px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 18px;
          cursor: pointer;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .landing-scenario-card:hover {
          transform: translateY(-2px);
          border-color: #e8630a;
          box-shadow: 0 10px 30px rgba(232, 99, 10, 0.12);
        }

        .landing-scenario-card-action {
          font-size: 16px;
          font-weight: 700;
          color: #e8630a;
        }

        .landing-section-actions {
          margin-top: 24px;
        }

        .landing-footer-reset {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .landing-footer-copy-reset {
          font-size: 16px;
          color: #475569;
          max-width: 48ch;
          line-height: 1.6;
        }

        @media (max-width: 1200px) {
          .landing-hero-reset,
          .landing-scenario-grid-reset,
          .landing-results-grid {
            grid-template-columns: 1fr;
          }

          .landing-flow-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .landing-nav-reset,
          .landing-footer-reset,
          .landing-nav-links-reset {
            flex-direction: column;
            align-items: flex-start;
          }

          .landing-headline-reset {
            font-size: 42px;
          }

          .landing-subheadline-reset {
            font-size: 18px;
          }

          .landing-flow-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
