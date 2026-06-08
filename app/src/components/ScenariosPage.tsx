import { SCENARIOS } from '../data/scenarios';

const DIFFICULTY_LABEL = {
  foundational: 'Foundational',
  intermediate:  'Intermediate',
  advanced:      'Advanced',
};

type Props = { onBack: () => void; onSelectScenario: (title: string) => void };

export function ScenariosPage({ onBack, onSelectScenario }: Props) {
  const [featured, ...supporting] = SCENARIOS;

  function ScenarioCard({ scenario, index, featured = false }: { scenario: typeof SCENARIOS[number]; index: number; featured?: boolean }) {
    return (
      <button
        key={scenario.id}
        className={`scenario-card scenario-card-button${featured ? ' scenario-card-featured' : ''}`}
        onClick={() => onSelectScenario(scenario.title)}
        aria-label={`Practise this scenario: ${scenario.title}`}
      >
        <div className="scenario-card-left">
          <span className="scenario-card-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="scenario-card-kind">Practice scenario</span>
        </div>
        <div className="scenario-card-body">
          <div className="scenario-card-header">
            <h3 className="scenario-card-title">{scenario.title}</h3>
            <span className={`badge badge-difficulty badge-difficulty-${scenario.difficulty}`}>
              {DIFFICULTY_LABEL[scenario.difficulty]}
            </span>
          </div>
          <p className="scenario-card-situation">{scenario.situation}</p>
          <div className="scenario-card-meta">
            <div className="scenario-meta-row">
              <span className="scenario-meta-label">Relevant for</span>
              <span className="scenario-meta-value">{scenario.userRisk}</span>
            </div>
            <div className="scenario-meta-row">
              <span className="scenario-meta-label">Practice outcome</span>
              <span className="scenario-meta-value scenario-outcome">{scenario.desiredOutcome}</span>
            </div>
          </div>
          <span className="scenario-cta">Practise this scenario -&gt;</span>
        </div>
      </button>
    );
  }

  return (
    <div className="scenarios-page valour-scenarios-page">

      <nav className="pattern-nav">
        <button className="btn btn-ghost pattern-back" onClick={onBack}>← Back</button>
        <span className="landing-logo">VALOUR™</span>
        <span className="pattern-nav-title">Practice scenarios</span>
      </nav>

      <div className="scenarios-hero">
        <div className="landing-eyebrow">Architecture leadership practice</div>
        <h1 className="pattern-heading">Choose your leadership moment.</h1>
        <p className="scenarios-sub">
          Start with one practice scenario, prepare the position, rehearse the difficult response,
          and leave with language you can use.
        </p>
      </div>

      <section className="scenario-featured-section" aria-labelledby="recommended-scenario">
        <div className="scenario-section-heading">
          <div className="landing-eyebrow">Recommended start</div>
          <h2 id="recommended-scenario">Architecture Review Board</h2>
        </div>
        <ScenarioCard scenario={featured} index={0} featured />
      </section>

      <section className="scenario-supporting-section" aria-labelledby="supporting-scenarios">
        <div className="scenario-section-heading">
          <div className="landing-eyebrow">More practice situations</div>
          <h2 id="supporting-scenarios">Select the pressure you need to rehearse.</h2>
        </div>
      <div className="scenarios-list">
        {supporting.slice(0, 5).map((s, i) => <ScenarioCard key={s.id} scenario={s} index={i + 1} />)}
      </div>
      </section>

    </div>
  );
}
