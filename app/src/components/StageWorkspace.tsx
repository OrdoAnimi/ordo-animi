import { useState, useRef, useEffect } from 'react';
import type { PilotStage, PilotStateEntry, StageOutput, StageStatus, GenerationSource } from '../data/types';
import type { DependencyCheck } from '../services/agents';

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
  ai:     'AI',
  local:  'Local template',
  manual: 'Manual edit',
};

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: 'Anthropic · Claude',
  openai:    'OpenAI · GPT',
  local:     'Local fallback',
};

const STEPPER_STAGE_IDS = [
  'stage-01-intake', 'stage-02-scenario', 'stage-03-prep',
  'stage-04-rehearsal', 'stage-05-language', 'stage-06-review', 'stage-07-pattern',
];
const STEPPER_LABELS = ['Context', 'Scenario', 'Prepare', 'Rehearse', 'Refine', 'Review', 'Report'];

type Props = {
  stage: PilotStage;
  entry: PilotStateEntry;
  index: number;
  total: number;
  hasAgent: boolean;
  dependency: DependencyCheck;
  completedStageIds: string[];
  rehearsalAnswer?: string;
  onGenerate: () => Promise<void>;
  onSaveOutput: (output: StageOutput) => void;
  onSaveUserInput: (input: string) => void;
  onCycleStatus: (status: StageStatus) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function StageWorkspace({
  stage, entry, index, total, hasAgent, dependency,
  completedStageIds, rehearsalAnswer,
  onGenerate, onSaveOutput, onSaveUserInput, onCycleStatus,
  onPrev, onNext,
}: Props) {
  const num = String(index + 1).padStart(2, '0');
  const tot = String(total).padStart(2, '0');

  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Sync local draft when entry changes (e.g. pilot switch)
  useEffect(() => {
    setEditing(false);
  }, [stage.id]);

  const output = entry.output;
  const status = entry.status;

  async function handleGenerate() {
    setGenerating(true);
    try { await onGenerate(); } finally { setGenerating(false); }
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

  const isIntake    = stage.id === 'stage-01-intake';
  const isRehearsal = stage.id === 'stage-04-rehearsal';
  const isLanguage  = stage.id === 'stage-05-language';

  const canGenerate = hasAgent && dependency.ok && !isIntake;

  return (
    <div className="workspace">

      {/* Stepper */}
      <div className="ws-stepper">
        {STEPPER_STAGE_IDS.map((id, i) => {
          const isDone = completedStageIds.includes(id) && id !== stage.id;
          const isActive = id === stage.id;
          const cls = isDone ? ' done' : isActive ? ' active' : '';
          return (
            <div key={id} className={`ws-stepper-item${cls}`}>
              {i > 0 && <div className="ws-stepper-connector" />}
              <div className="ws-stepper-step">
                <div className="ws-stepper-dot" />
                <div className="ws-stepper-label">{STEPPER_LABELS[i]}</div>
              </div>
            </div>
          );
        })}
      </div>

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

      {/* Stage guidance */}
      {stage.guidance && (
        <details className="ws-guidance">
          <summary className="ws-guidance-summary">About this stage</summary>
          <div className="ws-guidance-grid">
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">What this stage does</span>
              <div className="ws-guidance-value">{stage.guidance.what}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">You provide</span>
              <div className="ws-guidance-value">{stage.guidance.provides}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">VALOUR generates</span>
              <div className="ws-guidance-value">{stage.guidance.generates}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">Recommended next</span>
              <div className="ws-guidance-value">{stage.guidance.next}</div>
            </div>
          </div>
        </details>
      )}

      {/* Dependency warning */}
      {!dependency.ok && hasAgent && (
        <div className="ws-dependency-warn">
          <span className="ws-dependency-icon">⚠</span>
          {dependency.message}
        </div>
      )}

      {/* Intake */}
      {isIntake && (
        <IntakeCapture entry={entry} onSaveUserInput={onSaveUserInput} />
      )}

      {/* Rehearsal answer panel — always visible in stage 04 */}
      {isRehearsal && (
        <RehearsalAnswerPanel
          key={entry.userInput ?? 'none'}
          output={output}
          savedUserInput={entry.userInput}
          onSave={onSaveUserInput}
        />
      )}

      {/* Language refinement — preview rehearsal answer */}
      {isLanguage && (
        <div className="ws-input-preview">
          <div className="ws-input-preview-label">
            {rehearsalAnswer ? 'Your rehearsal answer' : 'No rehearsal answer yet'}
          </div>
          {rehearsalAnswer
            ? <div className="ws-input-preview-value">"{rehearsalAnswer}"</div>
            : <div className="ws-input-preview-missing">Record your answer in Stage 04 (Rehearse) first, then return here to generate refined versions.</div>
          }
          {rehearsalAnswer && (
            <p style={{ color: 'var(--text-faint)', fontSize: '11px', marginTop: '4px' }}>
              To edit your answer, return to Stage 04.
            </p>
          )}
        </div>
      )}


      {/* Generated output */}
      {output && !editing && (
        <div className="ws-output">
          <div className="ws-output-header">
            <div className="ws-output-meta">
              <span className={`ws-output-source source-icon-${output.source}`}>
                {SOURCE_LABELS[output.source]}
              </span>
              {output.provider && output.provider !== 'local' && (
                <span className="ws-output-provider">
                  {PROVIDER_LABELS[output.provider] ?? output.provider}
                </span>
              )}
              {output.durationMs && (
                <span className="ws-output-duration">{(output.durationMs / 1000).toFixed(1)}s</span>
              )}
            </div>
            <div className="ws-output-actions">
              <button className="btn btn-ghost ws-action-btn" onClick={startEdit}>Edit</button>
              {canGenerate && (
                <button className="btn btn-ghost ws-action-btn" onClick={handleGenerate} disabled={generating}>
                  {generating ? '…' : 'Regenerate'}
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
            rows={22}
          />
          <div className="ws-edit-actions">
            <button className="btn btn-primary" onClick={saveEdit}>Save changes</button>
            <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Generate button */}
      {canGenerate && !output && !generating && (
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

// ── Intake capture ─────────────────────────────────────────────────────────────

function IntakeCapture({ entry, onSaveUserInput }: {
  entry: PilotStateEntry;
  onSaveUserInput: (v: string) => void;
}) {
  const existing = entry.userInput ?? '';
  const [values, setValues] = useState<Record<string, string>>(() => {
    try { return JSON.parse(existing) as Record<string, string>; }
    catch { return { role: '', organisation: '', situation: '', outcome: '', confidence: '' }; }
  });
  const [saved, setSaved] = useState(!!existing);

  function save() {
    onSaveUserInput(JSON.stringify(values));
    setSaved(true);
  }

  function field(key: string, label: string, placeholder: string, rows?: number) {
    const onChange = (v: string) => { setValues(prev => ({ ...prev, [key]: v })); setSaved(false); };
    return (
      <div className="intake-field" key={key}>
        <label className="intake-label">{label}</label>
        {rows
          ? <textarea className="intake-input ws-textarea" rows={rows} placeholder={placeholder}
              value={values[key] ?? ''} onChange={e => onChange(e.target.value)} />
          : <input className="intake-input" placeholder={placeholder}
              value={values[key] ?? ''} onChange={e => onChange(e.target.value)} />
        }
      </div>
    );
  }

  return (
    <div className="ws-intake">
      {field('role', 'Your role', 'e.g. Senior Solution Architect')}
      {field('organisation', 'Organisation or program', 'e.g. Enterprise cloud transformation')}
      {field('situation', 'Describe the situation you are preparing for', 'e.g. Presenting a cloud integration design to the architecture review board…', 4)}
      {field('outcome', 'Desired outcome', 'e.g. Board endorses the design with documented conditions')}
      {field('confidence', 'Confidence before VALOUR™ (1–10)', '5')}
      <div className="ws-intake-actions">
        <button className="btn btn-primary" onClick={save}>
          {saved ? 'Saved ✓' : 'Save context'}
        </button>
        {!saved && values.role && <span className="ws-intake-hint">Save to enable generation in later stages.</span>}
      </div>
    </div>
  );
}

// ── Markdown renderer (no external dep) ───────────────────────────────────────

export function simpleMarkdown(md: string): string {
  const escaped = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = escaped.split('\n');
  const out: string[] = [];
  let inList = false;
  let inBlockquote = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Apply inline formatting
    line = line
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings
    if (/^#{1,4} /.test(line)) {
      if (inList) { out.push('</ul>'); inList = false; }
      if (inBlockquote) { out.push('</blockquote>'); inBlockquote = false; }
      const level = (line.match(/^#+/) ?? [''])[0].length;
      const text = line.replace(/^#+\s+/, '');
      out.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    // HR
    if (/^---+$/.test(line.trim())) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<hr />');
      continue;
    }

    // Blockquote
    if (/^&gt; /.test(line)) {
      if (inList) { out.push('</ul>'); inList = false; }
      if (!inBlockquote) { out.push('<blockquote>'); inBlockquote = true; }
      out.push(`<p>${line.replace(/^&gt; /, '')}</p>`);
      continue;
    }
    if (inBlockquote) { out.push('</blockquote>'); inBlockquote = false; }

    // List items
    if (/^[-*] /.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${line.replace(/^[-*] /, '')}</li>`);
      continue;
    }
    if (inList) { out.push('</ul>'); inList = false; }

    // Paragraph
    if (line.trim() === '') {
      out.push('');
    } else {
      out.push(`<p>${line}</p>`);
    }
  }

  if (inList) out.push('</ul>');
  if (inBlockquote) out.push('</blockquote>');

  return out.join('\n');
}

// ── Rehearsal helpers ─────────────────────────────────────────────────────────

function parseQuestions(content: string): string[] {
  const questions: string[] = [];
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (/^(\d+\.|[-*]|\*\*Q\d+\*\*:?|Q\d+:|\*\*Question \d+:\*\*)\s+.{10,}/.test(t)) {
      const text = t
        .replace(/^(\d+\.|[-*]|\*\*Q\d+\*\*:?\s*|Q\d+:\s*|\*\*Question \d+:\*\*\s*)/, '')
        .replace(/\*\*/g, '')
        .trim();
      if (text.length > 10) questions.push(text);
    }
  }
  return questions;
}

function parseRehearsalUserInput(raw: string | undefined): { question: string; answer: string } | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as { question?: string; answer?: string };
    if (parsed.answer) return { question: parsed.question ?? '', answer: parsed.answer };
  } catch { /* ignore */ }
  return { question: '', answer: raw };
}

// ── RehearsalAnswerPanel ───────────────────────────────────────────────────────

function RehearsalAnswerPanel({ output, savedUserInput, onSave }: {
  output: StageOutput | undefined;
  savedUserInput: string | undefined;
  onSave: (value: string) => void;
}) {
  const saved = parseRehearsalUserInput(savedUserInput);
  const questions = output ? parseQuestions(output.content) : [];

  const [editing, setEditing] = useState(!saved?.answer);
  const [selectedQuestion, setSelectedQuestion] = useState(saved?.question ?? '');
  const [answer, setAnswer] = useState(saved?.answer ?? '');
  const [justSaved, setJustSaved] = useState(!!saved?.answer);

  function handleSave() {
    if (!answer.trim()) return;
    onSave(JSON.stringify({ question: selectedQuestion, answer: answer.trim() }));
    setJustSaved(true);
    setEditing(false);
  }

  return (
    <div className="ws-rehearsal-panel">
      <div className="ws-rehearsal-panel-label">Record your answer</div>

      {!output && (
        <p className="ws-rehearsal-hint-text">
          Generate rehearsal questions above, then record your answer here.
        </p>
      )}

      {output && justSaved && !editing && (
        <div className="ws-answer-preview">
          {selectedQuestion && (
            <div className="ws-answer-question">Q: {selectedQuestion}</div>
          )}
          <div className="ws-answer-text">"{answer}"</div>
          <button className="link-btn" onClick={() => setEditing(true)}>Edit answer</button>
        </div>
      )}

      {output && (editing || !justSaved) && (
        <>
          {questions.length > 0 && (
            <div className="ws-question-selector">
              <span className="ws-guidance-label">Select a question to practise</span>
              <select
                className="ws-select"
                value={selectedQuestion}
                onChange={e => setSelectedQuestion(e.target.value)}
              >
                <option value="">— Choose a question —</option>
                {questions.map((q, i) => (
                  <option key={q || i} value={q}>
                    {q.length > 90 ? q.slice(0, 90) + '…' : q}
                  </option>
                ))}
              </select>
            </div>
          )}
          <textarea
            className="ws-textarea"
            value={answer}
            onChange={e => { setAnswer(e.target.value); setJustSaved(false); }}
            placeholder="Type your answer here…"
            rows={6}
            autoFocus
          />
          <div className="ws-user-input-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={!answer.trim()}>
              Save answer
            </button>
            {justSaved && (
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
