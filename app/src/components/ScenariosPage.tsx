import { SCENARIOS } from '../data/scenarios';

const DIFFICULTY_LABEL = {
  foundational: 'Foundational',
  intermediate:  'Intermediate',
  advanced:      'Advanced',
};

type Props = { onBack: () => void; onSelectScenario: (id: string) => void };

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

      <div className="scenarios-grid-2col">
        {SCENARIOS.map((s) => (
          <div key={s.id} className="scenario-card-v2">
            <div className="scenario-card-v2-header">
              <h3 className="scenario-card-v2-title">{s.title}</h3>
              <span className="badge badge-difficulty-neutral">{DIFFICULTY_LABEL[s.difficulty]}</span>
            </div>
            {s.tension && (
              <p className="scenario-card-v2-tension">{s.tension}</p>
            )}
            <div className="scenario-card-v2-meta">
              {s.yourRole && <span className="scenario-meta-chip">You: {s.yourRole}</span>}
              {s.counterpart && <span className="scenario-meta-chip">vs {s.counterpart}</span>}
              {s.duration && <span className="scenario-meta-chip">{s.duration}</span>}
            </div>
            <button
              className="btn btn-primary scenario-card-v2-cta"
              onClick={() => onSelectScenario(s.id)}
            >
              Start this scenario →
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
