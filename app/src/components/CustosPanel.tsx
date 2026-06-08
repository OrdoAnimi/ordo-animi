import { useState, useEffect } from 'react';
import type { PilotStage, PilotStateEntry } from '../data/types';

type CustosPanelProps = {
  page: 'landing' | 'console';
  activeStage?: PilotStage;
  activeEntry?: PilotStateEntry;
  onApplyOutput?: (content: string) => void;
};

type ActiveView = 'guide' | 'quick-result';

const STAGE_TIPS: Record<string, string> = {
  'stage-01-intake':
    'Be specific about the situation. Include the room: who is in it, what decision they need to make, and what success looks like for you.',
  'stage-02-scenario':
    'Review the scenario variant and fit score. If the variant feels off, note what is different — this will improve your preparation brief.',
  'stage-03-prep':
    'Read the brief as if you were walking into the room. Does the key message land in one sentence? If not, simplify it.',
  'stage-04-rehearsal':
    'Answer as if the clock is running. Aim for 90 seconds. Do not edit — record your first instinct, then move to Stage 05 to refine.',
  'stage-05-language':
    'Look for answers that start with technical context rather than the decision. Those are the ones to reframe.',
  'stage-06-review':
    'Be honest about what felt uncomfortable. The after-action review is more useful when it names a real pattern, not just what went well.',
  'stage-07-pattern':
    'Your pattern report is a coaching artefact. Read it before your next real conversation — even a 2-minute review helps.',
};

const DEFAULT_TIP =
  'Work through this stage at your own pace. Valour saves your progress automatically.';

export function CustosPanel({ page, activeStage, activeEntry, onApplyOutput }: CustosPanelProps) {
  const [isOpen, setIsOpen]                         = useState(false);
  const [activeView, setActiveView]                 = useState<ActiveView>('guide');
  const [quickActionLabel, setQuickActionLabel]     = useState('');
  const [quickActionResult, setQuickActionResult]   = useState('');
  const [quickActionLoading, setQuickActionLoading] = useState(false);

  // Auto-open when user first enters the console
  useEffect(() => {
    if (page === 'console') {
      const key = 'custos:console-opened';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        setIsOpen(true);
      }
    }
  }, [page]);

  // Reset to guide when stage changes so stale quick-result is never shown
  useEffect(() => {
    setActiveView('guide');
  }, [activeStage?.id]);

  const hasOutput = !!activeEntry?.output?.content;
  const guidance  = activeStage?.guidance;

  // ── Trigger ──────────────────────────────────────────────────────────────────

  function toggleOpen() {
    setIsOpen(prev => {
      if (prev) {
        setActiveView('guide');
        return false;
      }
      return true;
    });
  }

  function close() {
    setIsOpen(false);
    setActiveView('guide');
  }

  // ── Static quick actions ──────────────────────────────────────────────────────

  function showResult(label: string, text: string) {
    setQuickActionLabel(label);
    setQuickActionResult(text);
    setQuickActionLoading(false);
    setActiveView('quick-result');
    if (!isOpen) setIsOpen(true);
  }

  function handleWhatNext() {
    showResult('Recommended next', guidance?.next ?? DEFAULT_TIP);
  }

  function handleExplain() {
    showResult('This stage', guidance?.what ?? DEFAULT_TIP);
  }

  function handleHelpAnswer() {
    const tip = activeStage ? (STAGE_TIPS[activeStage.id] ?? DEFAULT_TIP) : DEFAULT_TIP;
    showResult('Guidance', tip);
  }

  // ── AI quick actions ──────────────────────────────────────────────────────────

  async function handleAiAction(type: 'executive' | 'shorter') {
    if (!activeEntry?.output?.content) return;

    const label   = type === 'executive' ? 'More executive' : 'Shorter';
    const content = activeEntry.output.content;
    const userInput = type === 'executive'
      ? `Rewrite the following in a shorter, more executive tone suitable for a CxO audience. Lead with the decision or outcome. Remove technical detail. Maximum 200 words.\n\n${content}`
      : `Shorten the following to roughly 50% of its current length while preserving all key points. Do not add new content. Return only the shortened text.\n\n${content}`;

    setQuickActionLabel(label);
    setQuickActionResult('');
    setQuickActionLoading(true);
    setActiveView('quick-result');
    if (!isOpen) setIsOpen(true);

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
    } catch { /* fall through to local message */ }

    setQuickActionResult(
      'An AI provider is not configured. Set an Anthropic API key to use this quick action.'
    );
    setQuickActionLoading(false);
  }

  function handleApply() {
    if (quickActionResult && onApplyOutput) {
      onApplyOutput(quickActionResult);
      setActiveView('guide');
    }
  }

  function handleDismiss() {
    setActiveView('guide');
    setQuickActionResult('');
  }

  // ── Renderers ─────────────────────────────────────────────────────────────────

  function renderLandingBody() {
    return (
      <div className="custos-body">
        <p className="custos-landing-para">
          Valour is an AI-guided rehearsal system for architecture leaders.
          It helps you prepare for the conversations that determine whether others
          trust your recommendations — review boards, executive briefings,
          stakeholder workshops, and delivery conflicts.
        </p>
        <p className="custos-landing-para">
          It is built for enterprise architects, solution architects, and technical
          leaders who need to communicate clearly at the leadership level, not just
          produce good work.
        </p>
        <p className="custos-landing-para">
          Start by describing your situation in Stage 01 — your role and the real
          conversation you are preparing for. Valour selects a scenario, builds a
          preparation brief, generates rehearsal questions, and refines your language.
          You leave with a pattern report you keep.
        </p>
      </div>
    );
  }

  function renderGuideBody() {
    if (!guidance) {
      return (
        <div className="custos-body">
          <p className="custos-landing-para">{DEFAULT_TIP}</p>
        </div>
      );
    }
    return (
      <div className="custos-body">
        <div className="custos-section">
          <span className="custos-section-label">This stage</span>
          <p className="custos-section-value">{guidance.what}</p>
        </div>
        <div className="custos-section">
          <span className="custos-section-label">You provide</span>
          <p className="custos-section-value">{guidance.provides}</p>
        </div>
        <div className="custos-section">
          <span className="custos-section-label">Valour generates</span>
          <p className="custos-section-value">{guidance.generates}</p>
        </div>
        <div className="custos-section">
          <span className="custos-section-label">Recommended next</span>
          <p className="custos-section-value">{guidance.next}</p>
        </div>
      </div>
    );
  }

  function renderQuickResult() {
    const isProviderError = quickActionResult.startsWith('An AI provider');
    return (
      <div className="custos-body">
        <div className="custos-preview">
          <span className="custos-section-label">{quickActionLabel}</span>
          {quickActionLoading ? (
            <div className="custos-preview-loading">
              <div className="ws-generating-spinner" />
              <span>Generating…</span>
            </div>
          ) : (
            <>
              <div className="custos-preview-content">{quickActionResult}</div>
              {!isProviderError && onApplyOutput && (
                <div className="custos-preview-actions">
                  <button className="btn btn-primary custos-apply-btn" onClick={handleApply}>
                    Apply to stage
                  </button>
                  <button className="btn btn-ghost custos-apply-btn" onClick={handleDismiss}>
                    Dismiss
                  </button>
                </div>
              )}
              {isProviderError && (
                <button className="btn btn-ghost custos-apply-btn" onClick={handleDismiss}>
                  Dismiss
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  function renderQuickActions() {
    if (page !== 'console') return null;
    return (
      <div className="custos-quick-actions">
        <button className="custos-qa-btn" onClick={handleWhatNext}>
          What should I do next?
        </button>
        <button className="custos-qa-btn" onClick={handleExplain}>
          Explain this stage
        </button>
        <button className="custos-qa-btn" onClick={handleHelpAnswer}>
          Help me answer this
        </button>
        {hasOutput && (
          <>
            <button className="custos-qa-btn custos-qa-btn-ai" onClick={() => handleAiAction('executive')}>
              Make this more executive
            </button>
            <button className="custos-qa-btn custos-qa-btn-ai" onClick={() => handleAiAction('shorter')}>
              Make this shorter
            </button>
          </>
        )}
      </div>
    );
  }

  const bodyContent =
    activeView === 'quick-result'
      ? renderQuickResult()
      : page === 'landing'
        ? renderLandingBody()
        : renderGuideBody();

  return (
    <>
      <button
        className={`custos-trigger${isOpen ? ' custos-trigger-open' : ''}`}
        onClick={toggleOpen}
        aria-label="Open Custos guide"
      >
        <span className="custos-trigger-icon">◈</span>
        <span>Custos</span>
      </button>

      {isOpen && (
        <div className="custos-panel" role="complementary" aria-label="Custos guide panel">
          <div className="custos-header">
            <span className="custos-header-label">Custos</span>
            {activeView === 'quick-result' && !quickActionLoading && (
              <button className="custos-back-btn" onClick={() => setActiveView('guide')}>
                ← Guide
              </button>
            )}
            <button className="custos-close-btn" onClick={close} aria-label="Close Custos">
              ×
            </button>
          </div>

          {bodyContent}

          {activeView === 'guide' && renderQuickActions()}
        </div>
      )}
    </>
  );
}
