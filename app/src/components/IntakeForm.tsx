import { useState } from 'react';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
const CONTACT_EMAIL = 'informatio@ordoanimi.com';

type Status = 'editing' | 'sending' | 'sent' | 'mailto' | 'error';

type FormData = {
  name: string;
  role: string;
  organisation: string;
  situation: string;
  outcome: string;
  pattern: string;
  confidence: string;
};

const PATTERNS = [
  'I over-explain',
  'I go too technical',
  'I become defensive',
  'I avoid difficult conversations',
  'I struggle to brief executives',
  'I lose the room',
  'I struggle to close decisions',
  'I struggle to challenge poor solutions',
];

type Props = { onBack: () => void };

function getPrefilledScenario(): string {
  const hash = window.location.hash;
  const match = hash.match(/[?&]scenario=([^&]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function IntakeForm({ onBack }: Props) {
  const preScenario = getPrefilledScenario();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>('editing');
  const [form, setForm] = useState<FormData>({
    name: '',
    role: '',
    organisation: '',
    situation: preScenario ? `I am preparing for: ${preScenario}.` : '',
    outcome: '',
    pattern: '',
    confidence: '',
  });

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function intakeBody(): string {
    return [
      `Name: ${form.name}`,
      `Role: ${form.role}`,
      `Organisation: ${form.organisation || '-'}`,
      `Situation: ${form.situation}`,
      `Desired outcome: ${form.outcome || '-'}`,
      `Pattern: ${form.pattern}`,
      `Starting confidence: ${form.confidence}/10`,
    ].join('\n');
  }

  function subjectLine(): string {
    return `VALOUR™ pilot intake — ${form.name} (${form.role})`;
  }

  function mailtoHref(): string {
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjectLine())}&body=${encodeURIComponent(intakeBody())}`;
  }

  async function submit() {
    // No form endpoint configured: hand the intake to the user's mail client.
    if (!FORMSPREE_ID) {
      window.location.href = mailtoHref();
      setStatus('mailto');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          _subject: subjectLine(),
        }),
        signal: AbortSignal.timeout(15_000),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  function canNext(): boolean {
    if (step === 0) return !!(form.name.trim() && form.role.trim());
    if (step === 1) return !!form.situation.trim();
    if (step === 2) return !!form.pattern;
    if (step === 3) return !!form.confidence;
    return true;
  }

  if (status === 'sent' || status === 'mailto') {
    const sent = status === 'sent';
    return (
      <div className="intake-page">
        <nav className="pattern-nav">
          <span className="landing-logo">VALOUR&trade;</span>
        </nav>
        <div className="intake-submitted">
          <div className="landing-eyebrow">{sent ? 'Intake received' : 'One more step'}</div>
          <h1 className="pattern-heading">{sent ? "You're on the list." : 'Send your intake to finish.'}</h1>
          <p className="intake-submitted-body">
            {sent
              ? 'Your intake has been recorded. The VALOUR™ pilot operator will be in touch to confirm your scenario and schedule the first session.'
              : 'Your email app should have opened with your intake filled in. Press send to join the pilot — nothing is recorded until that email arrives.'}
          </p>
          {!sent && (
            <p className="intake-submitted-body" style={{ marginTop: '8px' }}>
              Email app didn't open? <a href={mailtoHref()}>Open it again</a>, or email your
              details to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          )}
          {sent && (
            <p className="intake-submitted-body" style={{ marginTop: '8px' }}>
              Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          )}
          <button className="btn btn-primary landing-btn-lg" style={{ marginTop: '32px' }} onClick={onBack}>
            ← Back to landing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="intake-page">
      <nav className="pattern-nav">
        <button className="btn btn-ghost pattern-back" onClick={onBack}>← Back</button>
        <span className="landing-logo">VALOUR&trade;</span>
        <span className="pattern-nav-title">Pilot intake · Step {step + 1} of 4</span>
      </nav>

      {preScenario && (
        <div className="intake-scenario-banner">
          <span className="intake-scenario-label">Selected scenario</span>
          <span className="intake-scenario-name">{preScenario}</span>
        </div>
      )}

      <div className="intake-progress">
        {[0,1,2,3].map(i => (
          <div key={i} className={`intake-progress-step${i <= step ? ' active' : ''}`} />
        ))}
      </div>

      <div className="intake-body">

        {step === 0 && (
          <div className="intake-step">
            <div className="landing-eyebrow">About you</div>
            <h2 className="intake-step-title">Who are you?</h2>
            <div className="intake-field">
              <label className="intake-label">Full name</label>
              <input
                className="intake-input"
                placeholder="Your name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                autoFocus
              />
            </div>
            <div className="intake-field">
              <label className="intake-label">Role</label>
              <input
                className="intake-input"
                placeholder="e.g. Senior Technology Leader"
                value={form.role}
                onChange={e => set('role', e.target.value)}
              />
            </div>
            <div className="intake-field">
              <label className="intake-label">Organisation or context <span className="intake-optional">(optional)</span></label>
              <input
                className="intake-input"
                placeholder="e.g. Enterprise transformation program"
                value={form.organisation}
                onChange={e => set('organisation', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="intake-step">
            <div className="landing-eyebrow">Your situation</div>
            <h2 className="intake-step-title">What leadership moment are you preparing for?</h2>
            <div className="intake-field">
              <label className="intake-label">Describe the situation</label>
              <textarea
                className="intake-textarea"
                placeholder="e.g. I need to present a cloud integration proposal to a board review next week. The audience includes security, delivery, and the business sponsor."
                value={form.situation}
                onChange={e => set('situation', e.target.value)}
                rows={5}
                autoFocus
              />
            </div>
            <div className="intake-field">
              <label className="intake-label">What outcome do you want? <span className="intake-optional">(optional)</span></label>
              <input
                className="intake-input"
                placeholder="e.g. Board endorses the design and delivery can proceed"
                value={form.outcome}
                onChange={e => set('outcome', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="intake-step">
            <div className="landing-eyebrow">Your pattern</div>
            <h2 className="intake-step-title">Which communication pattern do you most recognise in yourself?</h2>
            <div className="intake-chips">
              {PATTERNS.map(p => (
                <button
                  key={p}
                  className={`intake-chip${form.pattern === p ? ' selected' : ''}`}
                  onClick={() => set('pattern', p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="intake-step">
            <div className="landing-eyebrow">Confidence baseline</div>
            <h2 className="intake-step-title">How confident are you about this situation right now?</h2>
            <div className="intake-confidence-row">
              {['1','2','3','4','5','6','7','8','9','10'].map(n => (
                <button
                  key={n}
                  className={`intake-confidence-btn${form.confidence === n ? ' selected' : ''}`}
                  onClick={() => set('confidence', n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="intake-confidence-labels">
              <span>Not confident</span>
              <span>Very confident</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <p className="intake-submitted-body" role="alert" style={{ marginTop: '16px' }}>
            Your intake could not be sent. Nothing was recorded. Try again, or{' '}
            <a href={mailtoHref()}>send it by email</a> to {CONTACT_EMAIL}.
          </p>
        )}

        <div className="intake-actions">
          {step > 0 && (
            <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          {step < 3 ? (
            <button
              className="btn btn-primary"
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}
            >
              Continue →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              disabled={!canNext() || status === 'sending'}
              onClick={submit}
            >
              {status === 'sending' ? 'Sending…' : FORMSPREE_ID ? 'Submit intake' : 'Email my intake'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
