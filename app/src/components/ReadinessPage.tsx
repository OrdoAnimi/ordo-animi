type CheckItem = { label: string; done: boolean; note?: string };
type CheckGroup = { title: string; items: CheckItem[] };

const CHECKLIST: CheckGroup[] = [
  {
    title: 'Product readiness',
    items: [
      { label: 'Product charter', done: true },
      { label: 'Founder story', done: true },
      { label: 'System architecture', done: true },
      { label: 'Market positioning', done: true },
      { label: 'MVP plan', done: true },
      { label: 'Scenario library', done: true },
      { label: 'Prompt pack', done: true },
      { label: 'Pilot templates', done: true },
      { label: 'Pilot pack', done: true },
    ],
  },
  {
    title: 'Message readiness',
    items: [
      { label: 'One-line definition', done: true },
      { label: 'Short explanation', done: true },
      { label: 'Landing page', done: true, note: 'ordoanimi.com' },
      { label: 'Outreach copy', done: true },
      { label: 'Discovery call script', done: true },
      { label: 'Funding one-pager', done: true },
    ],
  },
  {
    title: 'Pilot readiness',
    items: [
      { label: 'Pilot intake form', done: true, note: 'Live on site' },
      { label: 'Scenario selection', done: true, note: '10 scenarios defined' },
      { label: 'Rehearsal process', done: true },
      { label: 'After-action review process', done: true },
      { label: 'Pattern snapshot template', done: true },
      { label: 'Completion report template', done: true },
      { label: 'Validation tracker', done: false, note: 'Pending — create tracker doc' },
    ],
  },
  {
    title: 'Evidence readiness',
    items: [
      { label: 'Feedback capture method', done: true },
      { label: 'Testimonial capture method', done: false, note: 'Pending — add to intake form' },
      { label: 'Validation criteria', done: true },
      { label: 'Decision gate defined', done: true },
      { label: 'Risk and IP notes', done: true },
    ],
  },
  {
    title: 'First contact readiness',
    items: [
      { label: 'Target contact list', done: false, note: 'Pending — build outreach list' },
      { label: 'Short outreach note', done: true },
      { label: 'Pilot pack link', done: true, note: 'ordoanimi.com' },
      { label: 'Discovery call script', done: true },
      { label: 'Follow-up template', done: true },
      { label: 'Validation tracker row per contact', done: false, note: 'Pending' },
    ],
  },
];

type Props = { onBack: () => void };

export function ReadinessPage({ onBack }: Props) {
  const allItems = CHECKLIST.flatMap(g => g.items);
  const doneCount = allItems.filter(i => i.done).length;
  const pct = Math.round((doneCount / allItems.length) * 100);

  return (
    <div className="readiness-page">

      <nav className="pattern-nav">
        <button className="btn btn-ghost pattern-back" onClick={onBack}>← Back</button>
        <span className="landing-logo">VALOUR&trade;</span>
        <span className="pattern-nav-title">Pilot readiness</span>
      </nav>

      <div className="readiness-hero">
        <div className="landing-eyebrow">Operator view</div>
        <h1 className="pattern-heading">Pilot Readiness</h1>
        <div className="readiness-progress-bar">
          <div className="readiness-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="readiness-pct">
          <span className="readiness-pct-num">{pct}%</span>
          <span className="readiness-pct-label">ready · {doneCount} of {allItems.length} items complete</span>
        </div>
      </div>

      <div className="readiness-groups">
        {CHECKLIST.map(group => {
          const groupDone = group.items.filter(i => i.done).length;
          const groupComplete = groupDone === group.items.length;
          return (
            <div key={group.title} className={`readiness-group${groupComplete ? ' group-complete' : ''}`}>
              <div className="readiness-group-header">
                <h3 className="readiness-group-title">{group.title}</h3>
                <span className="readiness-group-count">{groupDone}/{group.items.length}</span>
              </div>
              <div className="readiness-items">
                {group.items.map(item => (
                  <div key={item.label} className={`readiness-item${item.done ? ' done' : ' pending'}`}>
                    <span className="readiness-tick">{item.done ? '✓' : '○'}</span>
                    <span className="readiness-item-label">{item.label}</span>
                    {item.note && <span className="readiness-item-note">{item.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="readiness-blockers">
        <div className="landing-eyebrow">Do not proceed if</div>
        {[
          'Product being explained as full Ordo Animi instead of VALOUR\u2122',
          'Offer sounds like generic leadership training',
          'User is unclear what they need to bring',
          'No real upcoming scenario to test',
          'Feedback will not be captured',
        ].map(b => (
          <div key={b} className="blocker-item">
            <span className="blocker-icon">✗</span>
            <span>{b}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
