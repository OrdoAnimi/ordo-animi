import { useState, useRef } from 'react';
import type { PilotStage, PilotStateEntry, StageOutput, StageStatus, GenerationSource } from '../data/types';

const STATUS_LABELS: Record<StageStatus, string> = {
  'complete':    'Complete',
  'draft':       'Draft',
  'to-confirm':  'To confirm',
  'not-started': 'Not started',
};

const STATUS_CYCLE: StageStatus[] = ['not-started', 'draft', 'complete', 'to-confirm'];

function nextStatus(s: StageStatus): StageStatus {
  return STATUS_CYCLE[(STATUS_CYCLE.indexOf(s) + 1) % STATUS_CYCLE.length];
}

const SOURCE_LABELS: Record<GenerationSource, string> = {
  ai:     'AI generated',
  local:  'VALOUR™ template',
  manual: 'Manual entry',
};

type Props = {
  stage: PilotStage;
  entry: PilotStateEntry;
  index: number;
  total: number;
  hasAgent: boolean;
  onGenerate: () => Promise<void>;
  onSaveOutput: (output: StageOutput) => void;
  onSaveUserInput: (input: string) => void;
  onCycleStatus: (status: StageStatus) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function StageWorkspace({
  stage, entry, index, total, hasAgent,
  onGenerate, onSaveOutput, onSaveUserInput, onCycleStatus,
  onPrev, onNext,
}: Props) {
  const num = String(index + 1).padStart(2, '0');
  const tot = String(total).padStart(2, '0');

  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showUserInput, setShowUserInput] = useState(false);
  const [userInputDraft, setUserInputDraft] = useState(entry.userInput ?? '');
  const textRef = useRef<HTMLTextAreaElement>(null);

  const output = entry.output;
  const status = entry.status;

  async function handleGenerate() {
    setGenerating(true);
    try {
      await onGenerate();
    } finally {
      setGenerating(false);
    }
  }

  function startEdit() {
    setEditContent(output?.content ?? '');
    setEditing(true);
    setTimeout(() => textRef.current?.focus(), 50);
  }

  function saveEdit() {
    if (editContent.trim()) {
      onSaveOutput({ content: editContent, source: 'manual', generatedAt: new Date().toISOString() });
    }
    setEditing(false);
  }

  function saveUserInput() {
    onSaveUserInput(userInputDraft);
    setShowUserInput(false);
  }

  const isRehearsal = stage.id === 'stage-04-rehearsal';
  const isLanguage  = stage.id === 'stage-05-language';

  return (
    <div className="workspace">

      {/* Header */}
      <div className="ws-header">
        <div className="ws-eyebrow">Stage {num} of {tot} · {stage.label}</div>
        <button
          className={`badge badge-status badge-status-${status}`}
          onClick={() => onCycleStatus(nextStatus(status))}
          title="Click to cycle status"
        >
          {STATUS_LABELS[status]}
        </button>
      </div>

      <div className="ws-title">{stage.label}</div>
      <div className="ws-desc">{stage.description}</div>

      {/* Intake stage — no generation, just context capture */}
      {stage.id === 'stage-01-intake' && (
        <IntakeCapture entry={entry} onSaveUserInput={onSaveUserInput} />
      )}

      {/* Rehearsal — show questions then capture user answer */}
      {isRehearsal && output && !showUserInput && (
        <div className="ws-rehearsal-hint">
          <p className="ws-hint-text">Read the questions above. When you have your answer, record it below:</p>
          <button className="btn btn-primary ws-answer-btn" onClick={() => { setShowUserInput(true); setUserInputDraft(entry.userInput ?? ''); }}>
            Record my answer →
          </button>
        </div>
      )}

      {/* Language refinement — show user input summary */}
      {isLanguage && entry.userInput && (
        <div className="ws-input-preview">
          <div className="ws-input-preview-label">Your answer (from Rehearsal)</div>
          <div className="ws-input-preview-value">"{entry.userInput}"</div>
          <button className="btn btn-ghost ws-edit-input" onClick={() => { setShowUserInput(true); setUserInputDraft(entry.userInput ?? ''); }}>Edit answer</button>
        </div>
      )}

      {/* User input capture panel */}
      {showUserInput && (
        <div className="ws-user-input">
          <div className="ws-user-input-label">
            {isRehearsal ? 'Your rehearsal answer' : 'Edit your answer'}
          </div>
          <textarea
            className="ws-textarea"
            value={userInputDraft}
            onChange={e => setUserInputDraft(e.target.value)}
            placeholder="Type your answer here..."
            rows={5}
            autoFocus
          />
          <div className="ws-user-input-actions">
            <button className="btn btn-primary" onClick={saveUserInput} disabled={!userInputDraft.trim()}>
              Save answer
            </button>
            <button className="btn btn-ghost" onClick={() => setShowUserInput(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Generated output */}
      {output && !editing && (
        <div className="ws-output">
          <div className="ws-output-header">
            <span className="ws-output-source">{SOURCE_LABELS[output.source]}</span>
            <div className="ws-output-actions">
              <button className="btn btn-ghost ws-action-btn" onClick={startEdit}>Edit</button>
              {hasAgent && (
                <button className="btn btn-ghost ws-action-btn" onClick={handleGenerate} disabled={generating}>
                  {generating ? 'Regenerating…' : 'Regenerate'}
                </button>
              )}
            </div>
          </div>
          <div className="ws-output-content markdown-content"
               dangerouslySetInnerHTML={{ __html: simpleMarkdown(output.content) }} />
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="ws-edit">
          <textarea
            ref={textRef}
            className="ws-textarea ws-textarea-edit"
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={20}
          />
          <div className="ws-edit-actions">
            <button className="btn btn-primary" onClick={saveEdit}>Save changes</button>
            <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Generate button — show when no output yet or if editable */}
      {hasAgent && !output && !generating && stage.id !== 'stage-01-intake' && (
        <button className="btn btn-generate" onClick={handleGenerate}>
          <span className="btn-generate-icon">✦</span>
          Generate with VALOUR™
        </button>
      )}

      {generating && (
        <div className="ws-generating">
          <div className="ws-generating-spinner" />
          <span>VALOUR™ is generating…</span>
        </div>
      )}

      {/* Nav */}
      <div className="ws-nav">
        <button className="btn btn-ghost" onClick={onPrev} disabled={index === 0}>← Prev</button>
        <div className="ws-source-badge">
          <span className="badge badge-source">{stage.sourceFile}</span>
          {output && <span className="ws-saved-dot" title="Output saved" />}
        </div>
        <button className="btn btn-primary" onClick={onNext} disabled={index === total - 1}>Next →</button>
      </div>

    </div>
  );
}

// ── Intake capture sub-component ───────────────────────────────────────────────

function IntakeCapture({ entry, onSaveUserInput }: { entry: PilotStateEntry; onSaveUserInput: (v: string) => void }) {
  const existing = entry.userInput ?? '';
  const [values, setValues] = useState(() => {
    try { return JSON.parse(existing) as Record<string, string>; } catch { return { role: '', organisation: '', situation: '', outcome: '', confidence: '' }; }
  });
  const [saved, setSaved] = useState(!!existing);

  function save() {
    onSaveUserInput(JSON.stringify(values));
    setSaved(true);
  }

  function field(key: string, label: string, rows?: number) {
    return (
      <div className="intake-field" key={key}>
        <label className="intake-label">{label}</label>
        {rows
          ? <textarea className="intake-input ws-textarea" rows={rows} value={values[key] ?? ''} onChange={e => { setValues(v => ({ ...v, [key]: e.target.value })); setSaved(false); }} />
          : <input className="intake-input" value={values[key] ?? ''} onChange={e => { setValues(v => ({ ...v, [key]: e.target.value })); setSaved(false); }} />
        }
      </div>
    );
  }

  return (
    <div className="ws-intake">
      {field('role', 'Your role')}
      {field('organisation', 'Organisation or program context')}
      {field('situation', 'Describe the situation you are preparing for', 4)}
      {field('outcome', 'Desired outcome')}
      {field('confidence', 'Confidence before VALOUR™ (1-10)')}
      <div className="ws-intake-actions">
        <button className="btn btn-primary" onClick={save}>Save context</button>
        {saved && <span className="ws-saved-label">Saved ✓</span>}
      </div>
      <p className="ws-intake-hint">This context is used by all subsequent VALOUR™ generation steps.</p>
    </div>
  );
}

// ── Minimal markdown renderer (no dependency) ──────────────────────────────────

function simpleMarkdown(md: string): string {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // blockquote
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    // horizontal rule
    .replace(/^---$/gm, '<hr />')
    // unordered list items
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // wrap consecutive <li> in <ul>
    .replace(/(<li>[\s\S]*?<\/li>)(?!\n?<li>)/g, '<ul>$1</ul>')
    // double newlines → paragraphs
    .split(/\n{2,}/).map(block => {
      if (/^<(h[1-4]|ul|blockquote|hr)/.test(block.trim())) return block;
      const inner = block.replace(/\n/g, '<br />');
      return inner ? `<p>${inner}</p>` : '';
    }).join('\n');
}
