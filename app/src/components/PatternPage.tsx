import type { PatternSummary } from '../data/types';
import { simpleMarkdown } from './StageWorkspace';

type Props = {
  pattern: PatternSummary;
  pilotTitle: string;
  liveContent?: string;  // AI-generated pattern from stage-07 output
  onBack: () => void;
};

export function PatternPage({ pattern, pilotTitle, liveContent, onBack }: Props) {
  const hasLive = !!liveContent;

  return (
    <div className="pattern-page">

      <nav className="pattern-nav no-print">
        <button className="btn btn-ghost pattern-back" onClick={onBack}>← Console</button>
        <span className="landing-logo">VALOUR™</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasLive && (
            <span className="pattern-live-badge">✦ AI generated</span>
          )}
          <span className="pattern-nav-title">Pattern Report</span>
          <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => window.print()}>
            Print / PDF
          </button>
        </div>
      </nav>

      <div className="pattern-hero">
        <div className="landing-eyebrow">{pilotTitle}</div>
        <h1 className="pattern-heading">Leadership Pattern Report</h1>
        {!hasLive && (
          <p style={{ color: 'var(--text-dim)', fontSize: '13px', marginTop: '8px' }}>
            Generate Stage 07 (Pattern Summary) in the console to produce a personalised AI report.
          </p>
        )}
      </div>

      {/* Live AI-generated content */}
      {hasLive && (
        <div className="pattern-live-content markdown-content"
             dangerouslySetInnerHTML={{ __html: simpleMarkdown(liveContent!) }} />
      )}

      {/* Static seed data (always shown as fallback or supplement) */}
      {!hasLive && (
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
      )}

    </div>
  );
}
