import { useState, useRef, useEffect } from 'react';
import type {
  AppMode,
  GenerationSource,
  PilotStage,
  PilotStateEntry,
  RehearsalQuestion,
  RehearsalState,
  StageOutput,
  StageStatus,
} from '../data/types';
import type { DependencyCheck } from '../services/agents';

const STATUS_LABELS: Record<StageStatus, string> = {
  complete: 'Complete',
  draft: 'Draft',
  'to-confirm': 'To confirm',
  'not-started': 'Not started',
};

const STATUS_CYCLE: StageStatus[] = ['not-started', 'draft', 'complete', 'to-confirm'];
function nextStatus(s: StageStatus): StageStatus {
  return STATUS_CYCLE[(STATUS_CYCLE.indexOf(s) + 1) % STATUS_CYCLE.length];
}

const SOURCE_LABELS: Record<GenerationSource, string> = {
  ai: 'Generated with VALOUR AI',
  local: 'Structured VALOUR guidance',
  manual: 'Your edited version',
};

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: 'Anthropic · Claude',
  openai: 'OpenAI · GPT',
  local: 'Local fallback',
};

const STEPPER_STAGE_IDS = [
  'stage-01-intake', 'stage-02-scenario', 'stage-03-prep',
  'stage-04-rehearsal', 'stage-05-language', 'stage-06-review', 'stage-07-pattern',
];
const STEPPER_LABELS = ['Context', 'Scenario', 'Prepare', 'Rehearse', 'Refine', 'Reflect', 'Report'];

const PARTICIPANT_STEPS = [
  { label: 'Prepare',  indices: [0, 1, 2] },
  { label: 'Rehearse', indices: [3] },
  { label: 'Debrief',  indices: [4, 5, 6, 7] },
];

type Props = {
  stage: PilotStage;
  entry: PilotStateEntry;
  index: number;
  total: number;
  hasAgent: boolean;
  dependency: DependencyCheck;
  completedStageIds: string[];
  rehearsalAnswer?: string;
  rehearsal?: RehearsalState;
  mode: AppMode;
  canContinue?: boolean;
  intakeEntry?: PilotStateEntry;
  onGenerate: () => Promise<void>;
  onSaveOutput: (output: StageOutput) => void;
  onSaveUserInput: (input: string) => void;
  onSaveRehearsal: (rehearsal: RehearsalState) => void;
  onCycleStatus: (status: StageStatus) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function StageWorkspace({
  stage, entry, index, total, hasAgent, dependency,
  completedStageIds, rehearsalAnswer, rehearsal, mode,
  canContinue = true, intakeEntry,
  onGenerate, onSaveOutput, onSaveUserInput, onSaveRehearsal, onCycleStatus,
  onPrev, onNext,
}: Props) {
  const num = String(index + 1).padStart(2, '0');
  const tot = String(total).padStart(2, '0');
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditing(false);
  }, [stage.id]);

  const output = entry.output;
  const status = entry.status;
  const isDeveloper = mode === 'developer';
  const isFacilitator = mode === 'facilitator';
  const isIntake = stage.id === 'stage-01-intake';
  const isRehearsal = stage.id === 'stage-04-rehearsal';
  const isLanguage = stage.id === 'stage-05-language';
  const canGenerate = hasAgent && dependency.ok && !isIntake && !isFacilitator;

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

  return (
    <div className="workspace">
      {mode === 'participant' ? (
        <div className="ws-stepper ws-stepper-simple">
          {PARTICIPANT_STEPS.map((step, si) => {
            const isActive = step.indices.includes(index);
            const isDone   = step.indices.every(i => i < index);
            const cls      = isDone ? ' done' : isActive ? ' active' : '';
            return (
              <div key={step.label} className={`ws-stepper-item${cls}`}>
                {si > 0 && <div className="ws-stepper-connector" />}
                <div className="ws-stepper-step">
                  <div className="ws-stepper-dot" />
                  <div className="ws-stepper-label">{step.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
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
      )}

      <div className="ws-header">
        <div className="ws-eyebrow">
          {mode === 'participant'
            ? `${PARTICIPANT_STEPS.find(s => s.indices.includes(index))?.label ?? stage.label}`
            : `Stage ${num} of ${tot} · ${STEPPER_LABELS[index] ?? stage.label}`
          }
        </div>
        {isDeveloper ? (
          <button
            className={`badge badge-status badge-status-${status}`}
            onClick={() => onCycleStatus(nextStatus(status))}
            title="Developer control: cycle status"
          >
            {STATUS_LABELS[status]}
          </button>
        ) : (
          <span className={`badge badge-status badge-status-${status}`}>{STATUS_LABELS[status]}</span>
        )}
      </div>

      <div className="ws-title">{STEPPER_LABELS[index] ?? stage.label}</div>
      <div className="ws-desc">{stage.description}</div>

      {stage.guidance && (
        <details className="ws-guidance">
          <summary className="ws-guidance-summary">What happens here</summary>
          <div className="ws-guidance-grid">
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">Purpose</span>
              <div className="ws-guidance-value">{stage.guidance.what}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">You provide</span>
              <div className="ws-guidance-value">{stage.guidance.provides}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">VALOUR prepares</span>
              <div className="ws-guidance-value">{stage.guidance.generates}</div>
            </div>
            <div className="ws-guidance-item">
              <span className="ws-guidance-label">Next movement</span>
              <div className="ws-guidance-value">{stage.guidance.next}</div>
            </div>
          </div>
        </details>
      )}

      {!dependency.ok && hasAgent && (
        <div className="ws-dependency-warn">
          <span className="ws-dependency-icon">⚠</span>
          {dependency.message}
        </div>
      )}

      {isIntake && !isFacilitator && (
        <IntakeCapture entry={entry} onSaveUserInput={onSaveUserInput} />
      )}

      {isRehearsal && (
        <RehearsalFlow
          output={output}
          rehearsal={rehearsal}
          readOnly={isFacilitator}
          intakeEntry={intakeEntry}
          pilotScenario={stage.description}
          onSave={onSaveRehearsal}
        />
      )}

      {isLanguage && (
        <div className="ws-input-preview">
          <div className="ws-input-preview-label">
            {rehearsalAnswer ? 'Your submitted rehearsal response' : 'No rehearsal response yet'}
          </div>
          {rehearsalAnswer
            ? <div className="ws-input-preview-value">"{rehearsalAnswer}"</div>
            : <div className="ws-input-preview-missing">Return to Rehearse and submit one response before refining your language.</div>
          }
        </div>
      )}

      {output && !editing && (
        <div className="ws-output">
          <div className="ws-output-header">
            <div className="ws-output-meta">
              <span className={`ws-output-source source-icon-${output.source}`}>
                {SOURCE_LABELS[output.source]}
              </span>
              {isDeveloper && output.provider && (
                <span className="ws-output-provider">
                  {PROVIDER_LABELS[output.provider] ?? output.provider}
                </span>
              )}
              {isDeveloper && output.durationMs && (
                <span className="ws-output-duration">{(output.durationMs / 1000).toFixed(1)}s</span>
              )}
            </div>
            {!isFacilitator && (
              <div className="ws-output-actions">
                <button className="btn btn-ghost ws-action-btn" onClick={startEdit}>Edit</button>
                {canGenerate && (
                  <button className="btn btn-ghost ws-action-btn" onClick={handleGenerate} disabled={generating}>
                    {generating ? '…' : 'Regenerate'}
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="ws-output-content markdown-content"
               dangerouslySetInnerHTML={{ __html: simpleMarkdown(output.content) }} />
        </div>
      )}

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
            <button className="btn btn-primary" onClick={saveEdit}>Save preferred response</button>
            <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {canGenerate && !output && !generating && (
        <button className="btn btn-generate" onClick={handleGenerate}>
          <span className="btn-generate-icon">✦</span>
          {isRehearsal ? 'Prepare rehearsal questions' : 'Generate with VALOUR™'}
        </button>
      )}

      {generating && (
        <div className="ws-generating">
          <div className="ws-generating-spinner" />
          <span>VALOUR™ is preparing your next step…</span>
        </div>
      )}

      <div className="ws-nav">
        <button className="btn btn-ghost" onClick={onPrev} disabled={index === 0}>← Previous</button>
        {isDeveloper && (
          <div className="ws-source-badge">
            <span className="badge badge-source">{stage.sourceFile}</span>
            {output && <span className="ws-saved-dot" title="Output saved" />}
          </div>
        )}
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={index === total - 1 || (!canContinue && mode === 'participant')}
        >
          Continue →
        </button>
        {!canContinue && mode === 'participant' && index < total - 1 && (
          <span className="ws-nav-block-hint">Generate your preparation brief first</span>
        )}
      </div>
    </div>
  );
}

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
      {field('situation', 'Describe the leadership situation', 'e.g. Presenting a cloud integration design to the architecture review board…', 4)}
      {field('outcome', 'What decision or outcome do you need?', 'e.g. Board endorses the design with documented conditions')}
      {field('confidence', 'Current confidence (1–10)', '5')}
      <div className="ws-intake-actions">
        <button className="btn btn-primary" onClick={save}>
          {saved ? 'Context saved ✓' : 'Save context'}
        </button>
      </div>
    </div>
  );
}

function parseQuestions(content: string): RehearsalQuestion[] {
  const questions: RehearsalQuestion[] = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    const quoted = line.match(/^>\s*[""](.+?)[""]?$/);
    if (quoted?.[1]) {
      questions.push({ id: `question-${questions.length + 1}`, topic: `Question ${questions.length + 1}`, text: quoted[1] });
      continue;
    }
    const numbered = line.match(/^(?:\d+\.|[-*]|Q\d+:)\s+(.{10,})$/i);
    if (numbered?.[1] && numbered[1].includes('?')) {
      questions.push({ id: `question-${questions.length + 1}`, topic: `Question ${questions.length + 1}`, text: numbered[1].replace(/\*\*/g, '') });
    }
  }
  return questions.slice(0, 4);
}

type IntakeValues = { role?: string; organisation?: string; situation?: string; outcome?: string; confidence?: string };

function RehearsalFlow({ output, rehearsal, readOnly, intakeEntry, pilotScenario, onSave }: {
  output?: StageOutput;
  rehearsal?: RehearsalState;
  readOnly: boolean;
  intakeEntry?: PilotStateEntry;
  pilotScenario?: string;
  onSave: (rehearsal: RehearsalState) => void;
}) {
  const parsedQuestions = output ? parseQuestions(output.content) : [];
  const questions = rehearsal?.questions?.length ? rehearsal.questions : parsedQuestions;
  const [selectedQuestionId, setSelectedQuestionId] = useState(rehearsal?.selectedQuestionId ?? questions[0]?.id ?? '');
  const [responseText, setResponseText] = useState(rehearsal?.response?.responseText ?? '');
  const [preferredResponse, setPreferredResponse] = useState(rehearsal?.preferredResponse ?? '');

  useEffect(() => {
    if (!selectedQuestionId && questions[0]?.id) setSelectedQuestionId(questions[0].id);
  }, [questions, selectedQuestionId]);

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
  const submitted = rehearsal?.response?.status === 'submitted';
  const complete = rehearsal?.status === 'complete';

  const intakeValues: IntakeValues = (() => {
    try { return JSON.parse(intakeEntry?.userInput ?? '{}') as IntakeValues; }
    catch { return {}; }
  })();
  const hasIntake = !!(intakeValues.role || intakeValues.situation);

  function saveDraft() {
    if (!selectedQuestionId || !responseText.trim()) return;
    onSave({
      ...(rehearsal ?? { questions, status: 'not-started' }),
      questions,
      selectedQuestionId,
      response: {
        questionId: selectedQuestionId,
        responseText: responseText.trim(),
        inputMethod: 'typed',
        startedAt: rehearsal?.response?.startedAt ?? new Date().toISOString(),
        status: 'draft',
      },
      status: 'response-draft',
    });
  }

  function submitResponse() {
    if (!selectedQuestionId || !responseText.trim()) return;
    onSave({
      ...(rehearsal ?? { questions, status: 'not-started' }),
      questions,
      selectedQuestionId,
      response: {
        questionId: selectedQuestionId,
        responseText: responseText.trim(),
        inputMethod: 'typed',
        startedAt: rehearsal?.response?.startedAt ?? new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      },
      status: 'response-submitted',
    });
  }

  function completeRehearsal() {
    if (!submitted || !preferredResponse.trim()) return;
    onSave({
      ...(rehearsal ?? { questions, status: 'not-started' }),
      questions,
      selectedQuestionId,
      preferredResponse: preferredResponse.trim(),
      status: 'complete',
    });
  }

  return (
    <div className={`rehearsal-stage${hasIntake ? ' rehearsal-stage-3col' : ''}`}>
      {hasIntake && (
        <aside className="rehearsal-context-panel">
          <div className="rcp-section-label">Your situation</div>
          {intakeValues.role && (
            <div className="rcp-item">
              <span className="rcp-item-label">Role</span>
              <span className="rcp-item-value">{intakeValues.role}</span>
            </div>
          )}
          {intakeValues.organisation && (
            <div className="rcp-item">
              <span className="rcp-item-label">Organisation</span>
              <span className="rcp-item-value">{intakeValues.organisation}</span>
            </div>
          )}
          {intakeValues.situation && (
            <div className="rcp-item">
              <span className="rcp-item-label">Situation</span>
              <span className="rcp-item-value">{intakeValues.situation}</span>
            </div>
          )}
          {pilotScenario && (
            <div className="rcp-item">
              <span className="rcp-item-label">Format</span>
              <span className="rcp-item-value">{pilotScenario.replace('.', '')}</span>
            </div>
          )}
        </aside>
      )}

      <div className="rehearsal-centre">
        <div className="rehearsal-centre-label">Practise one real response</div>
        {!output && (
          <p className="ws-rehearsal-hint-text">Generate rehearsal questions first, then select and answer the one most likely to challenge your recommendation.</p>
        )}
        {questions.length > 0 && (
          <>
            <div className="rehearsal-question-block">
              <label className="ws-guidance-label" htmlFor="rehearsal-question">Select your challenge</label>
              <select
                id="rehearsal-question"
                className="ws-select"
                value={selectedQuestionId}
                disabled={readOnly || complete}
                onChange={e => setSelectedQuestionId(e.target.value)}
              >
                {questions.map(q => <option key={q.id} value={q.id}>{q.text}</option>)}
              </select>
              {selectedQuestion && (
                <div className="rehearsal-challenge">{selectedQuestion.text}</div>
              )}
            </div>

            <label className="ws-guidance-label" htmlFor="rehearsal-response">Your response</label>
            <textarea
              id="rehearsal-response"
              className="ws-textarea rehearsal-response-textarea"
              value={responseText}
              readOnly={readOnly || complete}
              onChange={e => setResponseText(e.target.value)}
              placeholder="Answer as you would in the real conversation…"
              rows={8}
            />

            {!readOnly && !submitted && (
              <div className="ws-user-input-actions">
                <button className="btn btn-ghost" onClick={saveDraft} disabled={!responseText.trim()}>Save draft</button>
                <button className="btn btn-primary" onClick={submitResponse} disabled={!responseText.trim()}>Submit response →</button>
              </div>
            )}

            {submitted && !complete && (
              <div className="ws-refinement-card">
                <div className="ws-input-preview-label">Preferred refined response</div>
                <p className="ws-rehearsal-hint-text">Generate the Refine stage, then paste or edit the version you will use.</p>
                <textarea
                  className="ws-textarea"
                  value={preferredResponse}
                  readOnly={readOnly}
                  onChange={e => setPreferredResponse(e.target.value)}
                  placeholder="Save the response you will use…"
                  rows={5}
                />
                {!readOnly && (
                  <button className="btn btn-primary" onClick={completeRehearsal} disabled={!preferredResponse.trim()}>
                    Save preferred response
                  </button>
                )}
              </div>
            )}

            {complete && (
              <div className="ws-answer-preview">
                <div className="ws-input-preview-label">Rehearsal complete</div>
                <div className="ws-answer-text">"{rehearsal?.preferredResponse}"</div>
              </div>
            )}
          </>
        )}
      </div>

      {hasIntake && (
        <aside className="rehearsal-objective-panel">
          <div className="rcp-section-label">Your objective</div>
          {intakeValues.outcome && (
            <div className="rcp-item">
              <span className="rcp-item-label">Desired outcome</span>
              <span className="rcp-item-value">{intakeValues.outcome}</span>
            </div>
          )}
          <div className="rcp-item">
            <span className="rcp-item-label">Progress</span>
            <span className="rcp-item-value">
              {complete ? 'Rehearsal complete'
               : submitted ? 'Response submitted — refine next'
               : responseText.trim() ? 'Draft in progress'
               : 'Awaiting your response'}
            </span>
          </div>
          {intakeValues.confidence && (
            <div className="rcp-item">
              <span className="rcp-item-label">Starting confidence</span>
              <span className="rcp-item-value">{intakeValues.confidence} / 10</span>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

export function simpleMarkdown(md: string): string {
  const escaped = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = escaped.split('\n');
  const out: string[] = [];
  let inList = false;
  let inBlockquote = false;

  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    line = line
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    if (/^#{1,4} /.test(line)) {
      if (inList) { out.push('</ul>'); inList = false; }
      if (inBlockquote) { out.push('</blockquote>'); inBlockquote = false; }
      const level = (line.match(/^#+/) ?? [''])[0].length;
      const text = line.replace(/^#+\s+/, '');
      out.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<hr />');
      continue;
    }

    if (/^&gt; /.test(line)) {
      if (inList) { out.push('</ul>'); inList = false; }
      if (!inBlockquote) { out.push('<blockquote>'); inBlockquote = true; }
      out.push(`<p>${line.replace(/^&gt; /, '')}</p>`);
      continue;
    }
    if (inBlockquote) { out.push('</blockquote>'); inBlockquote = false; }

    if (/^[-*] /.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${line.replace(/^[-*] /, '')}</li>`);
      continue;
    }
    if (inList) { out.push('</ul>'); inList = false; }

    if (line.trim() === '') out.push('');
    else out.push(`<p>${line}</p>`);
  }

  if (inList) out.push('</ul>');
  if (inBlockquote) out.push('</blockquote>');
  return out.join('\n');
}
