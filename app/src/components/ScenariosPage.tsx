import { SCENARIOS } from '../data/scenarios';

const DIFFICULTY_LABEL = {
  foundational: 'Foundational',
  intermediate:  'Intermediate',
  advanced:      'Advanced',
};

type Props = { onBack: () => void; onSelectScenario: (title: string) => void };

export function ScenariosPage({ onBack, onSelectScenario }: Props) {
  return (
    <div className="scenarios-page">

      <nav className="pattern-nav">
        <button className="btn btn-ghost pattern-back" onClick={onBack}>← Back</button>
        <span className="landing-logo">VALOUR™</span>
        <span className="pattern-nav-title">Scenario library</span>
      </nav>

      <div className="scenarios-hero">
        <div className="landing-eyebrow">10 scenarios · Architecture leadership</div>
        <h1 className="pattern-heading">Choose your leadership moment.</h1>
        <p className="scenarios-sub">
          Each scenario prepares you for a real architecture leadership situation.
          Bring one upcoming moment and work through the VALOUR™ loop.
        </p>
      </div>

      <div className="scenarios-list">
        {SCENARIOS.map((s, i) => (
          <div key={s.id} className="scenario-card">
            <div className="scenario-card-left">
              <span className="scenario-card-num">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="scenario-card-body">
              <div className="scenario-card-header">
                <h3 className="scenario-card-title">{s.title}</h3>
                <span className={`badge badge-difficulty badge-difficulty-${s.difficulty}`}>
                  {DIFFICULTY_LABEL[s.difficulty]}
                </span>
              </div>
              <p className="scenario-card-situation">{s.situation}</p>
              <div className="scenario-card-meta">
                <div className="scenario-meta-row">
                  <span className="scenario-meta-label">User risk</span>
                  <span className="scenario-meta-value">{s.userRisk}</span>
                </div>
                <div className="scenario-meta-row">
                  <span className="scenario-meta-label">Desired outcome</span>
                  <span className="scenario-meta-value scenario-outcome">{s.desiredOutcome}</span>
                </div>
              </div>
              <button
                className="btn btn-ghost scenario-cta"
                onClick={() => onSelectScenario(s.title)}
              >
                Prepare for this →
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
