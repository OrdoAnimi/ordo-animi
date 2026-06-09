import { useEffect, useRef, useState } from 'react';
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
const PARTICIPANT_STEPS = [
  { label: 'Prepare', indices: [0, 1, 2] },
  { label: 'Engage',   indices: [3] },
  { label: 'Debrief', indices: [4, 5, 6, 7] },
];
const FULL_LABELS = ['Context', 'Scenario', 'Prepare', 'Engage', 'Refine', 'Reflect', 'Report'];

function nextStatus(status: StageStatus) {
  return STATUS_CYCLE[(STATUS_CYCLE.indexOf(status) + 1) % STATUS_CYCLE.length];
}

function stageKind(stage: PilotStage) {
  const text = `${stage.id} ${stage.label}`.toLowerCase();
  return {
    intake: text.includes('intake') || text.includes('context'),
    rehearsal: text.includes('rehearsal') || text.includes('rehearse') || text.includes('s04'),
    language: text.includes('language') || text.includes('refine') || text.includes('s05'),
  };
}

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
  pilotId?: string;
  scenarioLabel?: string;
  onGenerate: () => Promise<void>;
  onSaveOutput: (output: StageOutput) => void;
  onSaveUserInput: (input: string) => void;
  onSaveRehearsal: (rehearsal: RehearsalState) => void;
  onCycleStatus: (status: StageStatus) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function StageWorkspace({
  stage,
  entry,
  index,
  total,
  hasAgent,
  dependency,
  completedStageIds,
  rehearsalAnswer,
  rehearsal,
  mode,
  canContinue = true,
  intakeEntry,
  pilotId,
  scenarioLabel,
  onGenerate,
  onSaveOutput,
  onSaveUserInput,
  onSaveRehearsal,
  onCycleStatus,
  onPrev,
  onNext,
}: Props) {
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);
  const kind = stageKind(stage);
  const output = entry.output;
  const status = entry.status;
  const isDeveloper = mode === 'developer';
  const isFacilitator = mode === 'facilitator';
  const canGenerate = hasAgent && dependency.ok && !kind.intake && !isFacilitator;
  const rehearsalSubmitted = rehearsal?.response?.status === 'submitted' || rehearsal?.status === 'complete';
  const participantBlocked = mode === 'participant' && (!canContinue || (kind.rehearsal && !rehearsalSubmitted));
  const phase = PARTICIPANT_STEPS.find(step => step.indices.includes(index))?.label ?? stage.label;
  const nextLabel = kind.rehearsal ? 'Continue to debrief' : index === 2 ? 'Enter rehearsal' : index >= 4 ? 'Continue debrief' : 'Continue preparation';

  const isLastStage = index === total - 1;
  const isParticipantComplete = mode === 'participant' && isLastStage && !!entry.output;

  useEffect(() => setEditing(false), [stage.id]);

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

  return (
    <div className="workspace">
      {mode === 'participant' ? (
        <div className="ws-stepper ws-stepper-simple">
          {PARTICIPANT_STEPS.map((step, stepIndex) => {
            const active = step.indices.includes(index);
            const done = step.indices.every(item => item < index);
            return (
              <div key={step.label} className={`ws-stepper-item${done ? ' done' : active ? ' active' : ''}`}>
                {stepIndex > 0 && <div className="ws-stepper-connector" />}
                <div className="ws-stepper-step"><div className="ws-stepper-dot" /><div className="ws-stepper-label">{step.label}</div></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ws-stepper">
          {stage.id && Array.from({ length: Math.min(total, FULL_LABELS.length) }).map((_, stepIndex) => {
            const done = stepIndex < index;
            const active = stepIndex === index;
            return (
              <div key={FULL_LABELS[stepIndex]} className={`ws-stepper-item${done ? ' done' : active ? ' active' : ''}`}>
                {stepIndex > 0 && <div className="ws-stepper-connector" />}
                <div className="ws-stepper-step"><div className="ws-stepper-dot" /><div className="ws-stepper-label">{FULL_LABELS[stepIndex]}</div></div>
              </div>
            );
          })}
        </div>
      )}

      <div className="ws-header">
        <div className="ws-eyebrow">{mode === 'participant' ? phase : `Stage ${String(index + 1).padStart(2, '0')} of ${String(total).padStart(2, '0')}`}</div>
        {isDeveloper ? (
          <button className={`badge badge-status badge-status-${status}`} onClick={() => onCycleStatus(nextStatus(status))}>{STATUS_LABELS[status]}</button>
        ) : (
          <span className={`badge badge-status badge-status-${status}`}>{STATUS_LABELS[status]}</span>
        )}
      </div>

      <div className="ws-title">{FULL_LABELS[index] ?? stage.label}</div>
      <div className="ws-desc">{stage.description}</div>

      {stage.guidance && (
        <details className="ws-guidance">
          <summary className="ws-guidance-summary">What happens here</summary>
          <div className="ws-guidance-grid">
            <div className="ws-guidance-item"><span className="ws-guidance-label">Purpose</span><div className="ws-guidance-value">{stage.guidance.what}</div></div>
            <div className="ws-guidance-item"><span className="ws-guidance-label">You provide</span><div className="ws-guidance-value">{stage.guidance.provides}</div></div>
            <div className="ws-guidance-item"><span className="ws-guidance-label">VALOUR prepares</span><div className="ws-guidance-value">{stage.guidance.generates}</div></div>
            <div className="ws-guidance-item"><span className="ws-guidance-label">Next movement</span><div className="ws-guidance-value">{stage.guidance.next}</div></div>
          </div>
        </details>
      )}

      {!dependency.ok && hasAgent && <div className="ws-dependency-warn"><span className="ws-dependency-icon">⚠</span>{dependency.message}</div>}
      {kind.intake && !isFacilitator && <IntakeCapture entry={entry} onSaveUserInput={onSaveUserInput} />}
      {kind.rehearsal && <RehearsalFlow output={output} rehearsal={rehearsal} readOnly={isFacilitator} intakeEntry={intakeEntry} pilotScenario={stage.description} onSave={onSaveRehearsal} />}

      {kind.language && (
        <div className="ws-input-preview">
          <div className="ws-input-preview-label">{rehearsalAnswer ? 'Your submitted rehearsal response' : 'No rehearsal response yet'}</div>
          {rehearsalAnswer ? <div className="ws-input-preview-value">“{rehearsalAnswer}”</div> : <div className="ws-input-preview-missing">Return to Rehearse and submit one response before refining your language.</div>}
        </div>
      )}

      {output && !editing && (
        <div className="ws-output">
          <div className="ws-output-header">
            <div className="ws-output-meta">
              <span className={`ws-output-source source-icon-${output.source}`}>{SOURCE_LABELS[output.source]}</span>
              {isDeveloper && output.provider && <span className="ws-output-provider">{PROVIDER_LABELS[output.provider] ?? output.provider}</span>}
              {isDeveloper && output.durationMs && <span className="ws-output-duration">{(output.durationMs / 1000).toFixed(1)}s</span>}
            </div>
            {!isFacilitator && <div className="ws-output-actions"><button className="btn btn-ghost ws-action-btn" onClick={startEdit}>Edit</button>{canGenerate && <button className="btn btn-ghost ws-action-btn" onClick={handleGenerate} disabled={generating}>{generating ? '…' : 'Regenerate'}</button>}</div>}
          </div>
          <div className="ws-output-content markdown-content" dangerouslySetInnerHTML={{ __html: simpleMarkdown(output.content) }} />
        </div>
      )}

      {editing && (
        <div className="ws-edit">
          <textarea ref={textRef} className="ws-textarea ws-textarea-edit" value={editContent} onChange={event => setEditContent(event.target.value)} rows={22} />
          <div className="ws-edit-actions"><button className="btn btn-primary" onClick={saveEdit}>Save preferred response</button><button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button></div>
        </div>
      )}

      {canGenerate && !output && !generating && <button className="btn btn-generate" onClick={handleGenerate}><span className="btn-generate-icon">✦</span>{kind.rehearsal ? 'Prepare rehearsal questions' : 'Generate with VALOUR™'}</button>}
      {generating && <div className="ws-generating"><div className="ws-generating-spinner" /><span>VALOUR™ is preparing your next step…</span></div>}

      {isParticipantComplete ? (
        <div className="ws-completion">
          <div className="ws-completion-badge">Session complete</div>
          <h2 className="ws-completion-title">You have completed this session.</h2>
          {scenarioLabel && <p className="ws-completion-scenario"><strong>Scenario:</strong> {scenarioLabel}</p>}
          {completedStageIds.length > 0 && (
            <div className="ws-completion-phases">
              <span className="ws-completion-phases-label">Phases completed</span>
              <span className="ws-completion-phases-value">{completedStageIds.length} of {total}</span>
            </div>
          )}
          {rehearsal?.preferredResponse && (
            <div className="ws-completion-response">
              <div className="ws-completion-response-label">Your preferred response</div>
              <blockquote className="ws-completion-quote">"{rehearsal.preferredResponse}"</blockquote>
            </div>
          )}
          <div className="ws-completion-actions">
            {pilotId && <button className="btn btn-primary" onClick={() => { window.location.hash = `#pattern?pilot=${pilotId}`; }}>View summary →</button>}
            <button className="btn btn-ghost" onClick={() => { window.location.hash = '#scenarios'; }}>Start another scenario</button>
            <button className="btn btn-ghost" onClick={() => { window.location.hash = ''; }}>Return home</button>
          </div>
        </div>
      ) : (
        <div className="ws-nav">
          <button className="btn btn-ghost" onClick={onPrev} disabled={index === 0}>← Previous</button>
          {isDeveloper && <div className="ws-source-badge"><span className="badge badge-source">{stage.sourceFile}</span>{completedStageIds.includes(stage.id) && <span className="ws-saved-dot" title="Output saved" />}</div>}
          <button className="btn btn-primary" onClick={onNext} disabled={index === total - 1 || participantBlocked}>{nextLabel} →</button>
          {participantBlocked && mode === 'participant' && index < total - 1 && <span className="ws-nav-block-hint">{kind.rehearsal ? 'Submit a rehearsal response before continuing' : 'Complete the required preparation step first'}</span>}
        </div>
      )}
    </div>
  );
}

const SITUATION_MIN = 20;

function validateIntake(v: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!v.role?.trim()) errors.role = 'Role is required.';
  if (!v.situation?.trim()) errors.situation = 'Situation is required.';
  else if (v.situation.trim().length < SITUATION_MIN) errors.situation = `Describe in at least ${SITUATION_MIN} characters.`;
  if (!v.outcome?.trim()) errors.outcome = 'Desired outcome is required.';
  const conf = Number(v.confidence);
  if (!v.confidence?.trim()) errors.confidence = 'Confidence is required.';
  else if (!Number.isInteger(conf) || conf < 1 || conf > 10) errors.confidence = 'Enter a whole number from 1 to 10.';
  return errors;
}

function parseIntake(raw: string): Record<string, string> {
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    if (parsed && typeof parsed === 'object' && (parsed.role || parsed.situation)) return parsed;
  } catch { /* ignore */ }
  return { role: '', organisation: '', situation: '', outcome: '', confidence: '' };
}

function IntakeCapture({ entry, onSaveUserInput }: { entry: PilotStateEntry; onSaveUserInput: (value: string) => void }) {
  const [values, setValues] = useState<Record<string, string>>(() => parseIntake(entry.userInput ?? ''));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const errors = validateIntake(values);
  const isValid = Object.keys(errors).length === 0;

  function update(key: string, value: string) {
    setValues(previous => ({ ...previous, [key]: value }));
    setTouched(previous => ({ ...previous, [key]: true }));
    setSaved(false);
  }

  function blur(key: string) {
    setTouched(previous => ({ ...previous, [key]: true }));
  }

  function save() {
    setTouched({ role: true, situation: true, outcome: true, confidence: true });
    if (!isValid) return;
    onSaveUserInput(JSON.stringify(values));
    setSaved(true);
  }

  function fieldError(key: string) {
    return touched[key] && errors[key]
      ? <span className="intake-field-error">{errors[key]}</span>
      : null;
  }

  return (
    <div className="ws-intake">
      <div className="intake-field">
        <label className="intake-label">Your role <span className="intake-required">*</span></label>
        <input className={`intake-input${touched.role && errors.role ? ' intake-input-error' : ''}`} placeholder="e.g. Senior Solution Architect" value={values.role ?? ''} onChange={e => update('role', e.target.value)} onBlur={() => blur('role')} />
        {fieldError('role')}
      </div>
      <div className="intake-field">
        <label className="intake-label">Organisation or program <span className="intake-optional">(optional)</span></label>
        <input className="intake-input" placeholder="e.g. Enterprise cloud transformation" value={values.organisation ?? ''} onChange={e => update('organisation', e.target.value)} />
      </div>
      <div className="intake-field">
        <label className="intake-label">Describe the leadership situation <span className="intake-required">*</span></label>
        <textarea className={`intake-input ws-textarea${touched.situation && errors.situation ? ' intake-input-error' : ''}`} rows={4} placeholder="e.g. Presenting a design to the architecture review board…" value={values.situation ?? ''} onChange={e => update('situation', e.target.value)} onBlur={() => blur('situation')} />
        {fieldError('situation')}
      </div>
      <div className="intake-field">
        <label className="intake-label">What decision or outcome do you need? <span className="intake-required">*</span></label>
        <input className={`intake-input${touched.outcome && errors.outcome ? ' intake-input-error' : ''}`} placeholder="e.g. Board endorses the design with documented conditions" value={values.outcome ?? ''} onChange={e => update('outcome', e.target.value)} onBlur={() => blur('outcome')} />
        {fieldError('outcome')}
      </div>
      <div className="intake-field">
        <label className="intake-label">Current confidence (1–10) <span className="intake-required">*</span></label>
        <input className={`intake-input intake-input-narrow${touched.confidence && errors.confidence ? ' intake-input-error' : ''}`} type="number" min={1} max={10} placeholder="5" value={values.confidence ?? ''} onChange={e => update('confidence', e.target.value)} onBlur={() => blur('confidence')} />
        {fieldError('confidence')}
      </div>
      <div className="ws-intake-actions">
        <button className="btn btn-primary" onClick={save} disabled={!isValid && Object.keys(touched).length > 0}>
          {saved ? 'Context saved ✓' : 'Save context'}
        </button>
        {saved && <span className="intake-saved-confirm">Saved — you can now generate your scenario.</span>}
      </div>
    </div>
  );
}

function parseQuestions(content: string): RehearsalQuestion[] {
  const questions: RehearsalQuestion[] = [];
  content.split('\n').forEach(lineValue => {
    const line = lineValue.trim();
    const quoted = line.match(/^>\s*["“](.+?)["”]?$/);
    const numbered = line.match(/^(?:\d+\.|[-*]|Q\d+:)\s+(.{10,})$/i);
    const text = quoted?.[1] ?? (numbered?.[1]?.includes('?') ? numbered[1].replace(/\*\*/g, '') : '');
    if (text) questions.push({ id: `question-${questions.length + 1}`, topic: `Question ${questions.length + 1}`, text });
  });
  return questions.slice(0, 4);
}

type IntakeValues = { role?: string; organisation?: string; situation?: string; outcome?: string; confidence?: string };

function RehearsalFlow({ output, rehearsal, readOnly, intakeEntry, pilotScenario, onSave }: { output?: StageOutput; rehearsal?: RehearsalState; readOnly: boolean; intakeEntry?: PilotStateEntry; pilotScenario?: string; onSave: (value: RehearsalState) => void }) {
  const parsedQuestions = output ? parseQuestions(output.content) : [];
  const questions = rehearsal?.questions?.length ? rehearsal.questions : parsedQuestions;
  const [selectedQuestionId, setSelectedQuestionId] = useState(rehearsal?.selectedQuestionId ?? questions[0]?.id ?? '');
  const [responseText, setResponseText] = useState(rehearsal?.response?.responseText ?? '');
  const [preferredResponse, setPreferredResponse] = useState(rehearsal?.preferredResponse ?? '');

  useEffect(() => {
    if (!selectedQuestionId && questions[0]?.id) setSelectedQuestionId(questions[0].id);
  }, [questions, selectedQuestionId]);

  const selectedQuestion = questions.find(question => question.id === selectedQuestionId);
  const submitted = rehearsal?.response?.status === 'submitted';
  const complete = rehearsal?.status === 'complete';
  const intakeValues: IntakeValues = (() => {
    try {
      return JSON.parse(intakeEntry?.userInput ?? '{}') as IntakeValues;
    } catch {
      return {};
    }
  })();
  const hasIntake = !!(intakeValues.role || intakeValues.situation);

  function saveResponse(status: 'draft' | 'submitted') {
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
        ...(status === 'submitted' ? { submittedAt: new Date().toISOString() } : {}),
        status,
      },
      status: status === 'submitted' ? 'response-submitted' : 'response-draft',
    });
  }

  function completeRehearsal() {
    if (!submitted || !preferredResponse.trim()) return;
    onSave({ ...(rehearsal ?? { questions, status: 'not-started' }), questions, selectedQuestionId, preferredResponse: preferredResponse.trim(), status: 'complete' });
  }

  return (
    <div className={`rehearsal-stage${hasIntake ? ' rehearsal-stage-3col' : ''}`}>
      {hasIntake && (
        <aside className="rehearsal-context-panel">
          <div className="rcp-section-label">Your situation</div>
          {intakeValues.role && <div className="rcp-item"><span className="rcp-item-label">Role</span><span className="rcp-item-value">{intakeValues.role}</span></div>}
          {intakeValues.organisation && <div className="rcp-item"><span className="rcp-item-label">Organisation</span><span className="rcp-item-value">{intakeValues.organisation}</span></div>}
          {intakeValues.situation && <div className="rcp-item"><span className="rcp-item-label">Situation</span><span className="rcp-item-value">{intakeValues.situation}</span></div>}
          {pilotScenario && <div className="rcp-item"><span className="rcp-item-label">Format</span><span className="rcp-item-value">{pilotScenario.replace('.', '')}</span></div>}
        </aside>
      )}

      <div className="rehearsal-centre">
        <div className="rehearsal-centre-label">Practise one real response</div>
        {!output && <p className="ws-rehearsal-hint-text">Generate rehearsal questions first, then answer the challenge most likely to test your recommendation.</p>}
        {questions.length > 0 && (
          <>
            <div className="rehearsal-question-block">
              <label className="ws-guidance-label" htmlFor="rehearsal-question">Select your challenge</label>
              <select id="rehearsal-question" className="ws-select" value={selectedQuestionId} disabled={readOnly || complete} onChange={event => setSelectedQuestionId(event.target.value)}>{questions.map(question => <option key={question.id} value={question.id}>{question.text}</option>)}</select>
              {selectedQuestion && <div className="rehearsal-challenge">{selectedQuestion.text}</div>}
            </div>
            <label className="ws-guidance-label" htmlFor="rehearsal-response">Your response</label>
            <textarea id="rehearsal-response" className="ws-textarea rehearsal-response-textarea" value={responseText} readOnly={readOnly || complete} onChange={event => setResponseText(event.target.value)} placeholder="Answer as you would in the real conversation…" rows={8} />
            {!readOnly && !submitted && <div className="ws-user-input-actions"><button className="btn btn-ghost" onClick={() => saveResponse('draft')} disabled={!responseText.trim()}>Save draft</button><button className="btn btn-primary" onClick={() => saveResponse('submitted')} disabled={!responseText.trim()}>Submit response →</button></div>}
            {submitted && !complete && <div className="ws-refinement-card"><div className="ws-input-preview-label">Preferred refined response</div><p className="ws-rehearsal-hint-text">Continue to Debrief to generate language options, then return here to save the version you will use.</p><textarea className="ws-textarea" value={preferredResponse} readOnly={readOnly} onChange={event => setPreferredResponse(event.target.value)} placeholder="Save the response you will use…" rows={5} />{!readOnly && <button className="btn btn-primary" onClick={completeRehearsal} disabled={!preferredResponse.trim()}>Save preferred response</button>}</div>}
            {complete && <div className="ws-answer-preview"><div className="ws-input-preview-label">Rehearsal complete</div><div className="ws-answer-text">“{rehearsal?.preferredResponse}”</div></div>}
          </>
        )}
      </div>

      {hasIntake && (
        <aside className="rehearsal-objective-panel">
          <div className="rcp-section-label">Your objective</div>
          {intakeValues.outcome && <div className="rcp-item"><span className="rcp-item-label">Desired outcome</span><span className="rcp-item-value">{intakeValues.outcome}</span></div>}
          <div className="rcp-item"><span className="rcp-item-label">Progress</span><span className="rcp-item-value">{complete ? 'Rehearsal complete' : submitted ? 'Response submitted — debrief next' : responseText.trim() ? 'Draft in progress' : 'Awaiting your response'}</span></div>
        </aside>
      )}
    </div>
  );
}

export function simpleMarkdown(markdown: string) {
  const escaped = markdown.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped
    .split('\n')
    .map(line => {
      const value = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
      if (/^### /.test(value)) return `<h3>${value.replace(/^###\s+/, '')}</h3>`;
      if (/^## /.test(value)) return `<h2>${value.replace(/^##\s+/, '')}</h2>`;
      if (/^# /.test(value)) return `<h1>${value.replace(/^#\s+/, '')}</h1>`;
      if (/^&gt; /.test(value)) return `<blockquote><p>${value.replace(/^&gt; /, '')}</p></blockquote>`;
      if (/^[-*] /.test(value)) return `<ul><li>${value.replace(/^[-*] /, '')}</li></ul>`;
      return value.trim() ? `<p>${value}</p>` : '';
    })
    .join('\n');
}
