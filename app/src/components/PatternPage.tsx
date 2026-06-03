import type { PatternSummary } from '../data/types';

type Props = {
  pattern: PatternSummary;
  pilotTitle: string;
  onBack: () => void;
};

export function PatternPage({ pattern, pilotTitle, onBack }: Props) {
  return (
    <div className="pattern-page">

      <nav className="pattern-nav">
        <button className="btn btn-ghost pattern-back" onClick={onBack}>← Console</button>
        <span className="landing-logo">VALOUR™</span>
        <span className="pattern-nav-title">Pattern Report</span>
      </nav>

      <div className="pattern-hero">
        <div className="landing-eyebrow">{pilotTitle}</div>
        <h1 className="pattern-heading">Leadership Pattern Report</h1>
      </div>

      <div className="pattern-grid">

        <div className="pattern-card pattern-card-primary">
          <div className="pattern-card-label">Primary pattern</div>
          <div className="pattern-card-value">{pattern.primaryPattern}</div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-label">Usefulness score</div>
          <div className="pattern-score">{pattern.usefulnessScore}<span className="pattern-score-max">/10</span></div>
        </div>

        <div className="pattern-card pattern-card-wide">
          <div className="pattern-card-label">Starting challenge</div>
          <p className="pattern-card-body">{pattern.startingChallenge}</p>
        </div>

        <div className="pattern-card pattern-card-wide">
          <div className="pattern-card-label">Main improvement</div>
          <p className="pattern-card-body pattern-positive">{pattern.mainImprovement}</p>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-label">Primary strength</div>
          <p className="pattern-card-body">{pattern.primaryStrength}</p>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-label">Primary risk</div>
          <p className="pattern-card-body pattern-risk">{pattern.primaryRisk}</p>
        </div>

        <div className="pattern-card pattern-card-wide pattern-card-focus">
          <div className="pattern-card-label">Next focus</div>
          <p className="pattern-card-value">{pattern.nextFocus}</p>
        </div>

        <div className="pattern-card pattern-card-full">
          <div className="pattern-card-label">Useful language to retain</div>
          <div className="pattern-language-list">
            {pattern.usefulLanguage.map((line, i) => (
              <div key={i} className="pattern-language-item">
                <span className="pattern-language-quote">"</span>
                <span>{line}</span>
                <span className="pattern-language-quote">"</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
