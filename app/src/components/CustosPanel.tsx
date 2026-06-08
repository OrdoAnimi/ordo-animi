import { useEffect, useState } from 'react';
import type { PilotStage, PilotStateEntry } from '../data/types';

type CustosPanelProps = {
  page: 'landing' | 'console';
  activeStage?: PilotStage;
  activeEntry?: PilotStateEntry;
  onApplyOutput?: (content: string) => void;
};

type ActiveView = 'guide' | 'quick-result';

const STAGE_TIPS: Record<string, string> = {
  'stage-01-intake': 'Describe the room, the audience, the decision you need, and what success looks like.',
  'stage-02-scenario': 'Check that the selected scenario matches the pressure you expect in the real conversation.',
  'stage-03-prep': 'Make sure the recommendation and requested decision can each be stated in one sentence.',
  'stage-04-rehearsal': 'Answer as if the clock is running. Focus on the decision, the risk, and the next action.',
  'stage-05-language': 'Remove technical detail that does not help the audience decide.',
  'stage-06-review': 'Name what felt weak, unclear, or difficult rather than recording only what went well.',
  'stage-07-pattern': 'Use the pattern report before the next real conversation as a two-minute preparation check.',
};

const DEFAULT_TIP = 'Work through the current step. VALOUR saves your progress as you go.';

export function CustosPanel({ page, activeStage, activeEntry, onApplyOutput }: CustosPanelProps) {
  const [isOpen, setIsOpen] = useState(page === 'console');
  const [activeView, setActiveView] = useState<ActiveView>('guide');
  const [quickActionLabel, setQuickActionLabel] = useState('');
  const [quickActionResult, setQuickActionResult] = useState('');
  const [quickActionLoading, setQuickActionLoading] = useState(false);

  useEffect(() => {
    setActiveView('guide');
    if (page === 'console') setIsOpen(true);
  }, [activeStage?.id, page]);

  const guidance = activeStage?.guidance;
  const hasOutput = !!activeEntry?.output?.content;

  function showResult(label: string, text: string) {
    setQuickActionLabel(label);
    setQuickActionResult(text);
    setQuickActionLoading(false);
    setActiveView('quick-result');
    setIsOpen(true);
  }

  function handleWhatNext() {
    showResult('Recommended next', guidance?.next ?? DEFAULT_TIP);
  }

  function handleExplain() {
    showResult('Why this step matters', guidance?.what ?? DEFAULT_TIP);
  }

  function handleHelpAnswer() {
    showResult('CUSTOS guidance', activeStage ? STAGE_TIPS[activeStage.id] ?? DEFAULT_TIP : DEFAULT_TIP);
  }

  async function handleAiAction(type: 'executive' | 'shorter') {
    if (!activeEntry?.output?.content) return;
    const label = type === 'executive' ? 'Executive version' : 'Shorter version';
    const content = activeEntry.output.content;
    const userInput = type === 'executive'
      ? `Rewrite the following in a shorter, executive tone. Lead with the decision or outcome. Remove unnecessary technical detail. Maximum 200 words.\n\n${content}`
      : `Shorten the following to roughly half its length while preserving all key points. Return only the shortened text.\n\n${content}`;

    setQuickActionLabel(label);
    setQuickActionResult('');
    setQuickActionLoading(true);
    setActiveView('quick-result');
    setIsOpen(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: type === 'executive' ? 'custos-executive' : 'custos-shorter',
          context: {
            pilotId: 'custos',
            scenarioTitle: activeStage?.label ?? '',
            scenarioDescription: activeStage?.description ?? '',
            previousOutputs: {},
            userInput,
          },
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (res.ok) {
        const data = await res.json() as { content?: string; source?: string };
        if (data.content && data.source !== 'local') {
          setQuickActionResult(data.content);
          setQuickActionLoading(false);
          return;
        }
      }
    } catch { /* use controlled fallback */ }

    setQuickActionResult('Live AI refinement is unavailable in this environment. Continue with the structured VALOUR guidance or edit the response manually.');
    setQuickActionLoading(false);
  }

  function handleApply() {
    if (quickActionResult && onApplyOutput) {
      onApplyOutput(quickActionResult);
      setActiveView('guide');
    }
  }

  const guideBody = page === 'landing' ? (
    <div className="custos-body">
      <p className="custos-lead">CUSTOS guides the work inside VALOUR.</p>
      <p>I will help you clarify the decision, identify missing context, challenge the recommendation, and improve the response.</p>
    </div>
  ) : (
    <div className="custos-body">
      <div className="custos-context-label">Current step</div>
      <h3 className="custos-stage-title">{activeStage?.label ?? 'Practice session'}</h3>
      <div className="custos-observation">
        <span>What I notice</span>
        <p>{activeStage ? STAGE_TIPS[activeStage.id] ?? DEFAULT_TIP : DEFAULT_TIP}</p>
      </div>
      {guidance && (
        <div className="custos-observation">
          <span>What happens next</span>
          <p>{guidance.next}</p>
        </div>
      )}
    </div>
  );

  return (
    <aside className={`custos-shell${isOpen ? ' is-open' : ''}`} aria-label="CUSTOS active guide">
      <button className="custos-mobile-trigger" onClick={() => setIsOpen(v => !v)}>
        <span>CUSTOS Guide</span>
        <span>{isOpen ? 'Close' : 'Open'}</span>
      </button>

      <div className="custos-panel custos-panel-landscape">
        <div className="custos-header">
          <div>
            <div className="custos-header-label">CUSTOS</div>
            <div className="custos-header-subtitle">Active architecture co-pilot</div>
          </div>
          {activeView === 'quick-result' && !quickActionLoading && (
            <button className="custos-back-btn" onClick={() => setActiveView('guide')}>← Guide</button>
          )}
        </div>

        {activeView === 'quick-result' ? (
          <div className="custos-body">
            <div className="custos-preview">
              <span className="custos-section-label">{quickActionLabel}</span>
              {quickActionLoading ? (
                <div className="custos-preview-loading"><div className="ws-generating-spinner" /><span>Preparing guidance…</span></div>
              ) : (
                <>
                  <div className="custos-preview-content">{quickActionResult}</div>
                  <div className="custos-preview-actions">
                    {onApplyOutput && !quickActionResult.startsWith('Live AI') && (
                      <button className="valour-btn valour-btn-primary" onClick={handleApply}>Use this suggestion</button>
                    )}
                    <button className="valour-btn valour-btn-outline" onClick={() => setActiveView('guide')}>Return to guide</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : guideBody}

        {page === 'console' && activeView === 'guide' && (
          <div className="custos-quick-actions">
            <button className="custos-qa-btn" onClick={handleWhatNext}>What should I do next?</button>
            <button className="custos-qa-btn" onClick={handleExplain}>Why does this step matter?</button>
            <button className="custos-qa-btn" onClick={handleHelpAnswer}>Help me structure my response</button>
            {hasOutput && (
              <>
                <button className="custos-qa-btn custos-qa-btn-ai" onClick={() => handleAiAction('executive')}>Make this more executive</button>
                <button className="custos-qa-btn custos-qa-btn-ai" onClick={() => handleAiAction('shorter')}>Make this shorter</button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
