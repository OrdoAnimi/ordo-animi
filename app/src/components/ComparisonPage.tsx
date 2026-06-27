import { pilot001 } from '../data/pilot-001';
import { pilot002 } from '../data/pilot-002';

type LimbEntry = {
  id: string;
  label: string;
  url: string | null;
  discipline: string;
  maturity: string;
  maturityLabel: string;
  artefacts: string[];
  evidenceSignals: string[];
  description: string;
};

const LIMBS: LimbEntry[] = [
  {
    id: 'ea-artefact-generator',
    label: 'EA Artefact Generator',
    url: 'https://ea.velocityarchitecture.com.au/',
    discipline: 'Enterprise Architecture',
    maturity: 'usable',
    maturityLabel: 'Usable',
    artefacts: ['Architecture Decision Record', 'Governance Brief', 'Trade-off Analysis', 'Executive Summary'],
    evidenceSignals: ['architecture-decision-framing'],
    description: 'Generates EA artefacts for governance, decision records, and stakeholder review.',
  },
  {
    id: 'sa-artefact-generator',
    label: 'SA Artefact Generator',
    url: null,
    discipline: 'Solution Architecture',
    maturity: 'minimal',
    maturityLabel: 'Minimal',
    artefacts: ['Solution Overview', 'Architecture Decision Record', 'Trade-off Matrix', 'Interface Register'],
    evidenceSignals: ['architecture-decision-framing'],
    description: 'Generates solution architecture artefacts at delivery and design altitude.',
  },
  {
    id: 'ba-artefact-generator',
    label: 'BA Artefact Generator',
    url: 'https://ba.velocityarchitecture.com.au/',
    discipline: 'Business Analysis & Architecture',
    maturity: 'mvp-alpha',
    maturityLabel: 'MVP Alpha',
    artefacts: ['Stakeholder Map', 'Business Requirements', 'Process Model', 'Traceability Matrix'],
    evidenceSignals: ['executive-translation', 'business-stakeholder-clarification'],
    description: 'Generates BA and business architecture artefacts. Has a Cloudflare Worker /api/generate endpoint — recommended first live integration candidate.',
  },
  {
    id: 'pm-artefact-generator',
    label: 'PM Artefact Generator',
    url: 'https://pm.velocityarchitecture.com.au/',
    discipline: 'Project & Programme Management',
    maturity: 'uat',
    maturityLabel: 'UAT',
    artefacts: ['RAID Log', 'Delivery Mobilisation Brief', 'Steering Committee Report', 'Milestone Plan'],
    evidenceSignals: ['delivery-risk-and-action'],
    description: 'Generates PM artefacts: RAID, project initiation, steering reporting, and delivery planning.',
  },
  {
    id: 'pmi-portal',
    label: 'PMI Portal',
    url: 'https://zencloudau.github.io/pmi-portal/',
    discipline: 'Programme Delivery & Client Transparency',
    maturity: 'prototype',
    maturityLabel: 'Prototype',
    artefacts: ['Executive Snapshot', 'Business Case Summary', 'Governance Model', 'Handover Pack'],
    evidenceSignals: ['executive-translation', 'programme-communication'],
    description: 'Governed delivery workspace: architecture framing, artefact catalogue, governance, RAID, milestones, executive snapshot, and client visibility.',
  },
];

const COMPARISON_ROWS = [
  {
    label: 'Scenario type',
    p1: 'Board-level architecture governance',
    p2: 'Executive stakeholder communication',
  },
  {
    label: 'User problem',
    p1: 'Technical confidence without decision framing',
    p2: 'Technical clarity without executive translation',
  },
  {
    label: 'Primary pattern',
    p1: 'Technical confidence without decision framing',
    p2: 'Executive translation gap',
  },
  {
    label: 'Confidence shift',
    p1: '5 → 8   (+3)',
    p2: '4 → 7   (+3)',
  },
  {
    label: 'Highest value stage',
    p1: 'Language Refinement',
    p2: 'Preparation Brief + Language Refinement',
  },
  {
    label: 'Product learning',
    p1: 'Rehearsal workspace needs multi-question structure for board scenarios',
    p2: 'Preparation Brief needs executive financial framing mode',
  },
  {
    label: 'Repeatability signal',
    p1: 'Established — first confirmed run',
    p2: 'Confirmed — distinct pattern, same delta',
  },
  {
    label: 'Decision',
    p1: 'Continue',
    p2: 'Continue',
  },
];

function maturityClass(m: string) {
  if (m === 'usable') return 'limb-badge-usable';
  if (m === 'uat')    return 'limb-badge-uat';
  if (m === 'mvp-alpha') return 'limb-badge-alpha';
  return 'limb-badge-minimal';
}

type Props = { onBack: () => void };

export function ComparisonPage({ onBack }: Props) {
  const p1 = pilot001;
  const p2 = pilot002;

  return (
    <div className="comparison-page">
      <nav className="comparison-nav no-print">
        <button className="btn btn-ghost comparison-back" onClick={onBack}>← Console</button>
        <span className="comparison-nav-eyebrow">VALOUR&trade;</span>
        <span className="comparison-nav-title">Evidence Comparison · Release 0.3</span>
      </nav>

      {/* Pilot cards */}
      <section className="comparison-section">
        <div className="comparison-eyebrow">Completed Pilots</div>
        <div className="comparison-pilot-grid">
          <PilotCard pilot={p1} num="001" />
          <PilotCard pilot={p2} num="002" />
        </div>
      </section>

      {/* Comparison table */}
      <section className="comparison-section">
        <div className="comparison-eyebrow">Evidence Comparison</div>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="comparison-th comparison-th-label"></th>
                <th className="comparison-th">Pilot 001 · Architecture Review Board</th>
                <th className="comparison-th">Pilot 002 · Executive Briefing</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map(row => (
                <tr key={row.label} className="comparison-tr">
                  <td className="comparison-td comparison-td-label">{row.label}</td>
                  <td className="comparison-td">{row.p1}</td>
                  <td className="comparison-td">{row.p2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Repeatability callout */}
      <section className="comparison-section">
        <div className="comparison-signal-card">
          <div className="comparison-signal-label">Repeatability Signal</div>
          <div className="comparison-signal-body">
            Two pilots. Two distinct scenarios. Two distinct primary patterns. Consistent confidence improvement of +3 across both runs.
            The VALOUR loop is repeatable and adaptive — it surfaces different leadership patterns for different scenario types while
            delivering consistent preparation value.
          </div>
        </div>
      </section>

      {/* Artefact limb recommendations */}
      <section className="comparison-section">
        <div className="comparison-eyebrow">Recommended Artefact Limbs</div>
        <p className="comparison-limb-intro">
          Based on evidence from Pilot 001 and Pilot 002, these specialist repositories are the recommended downstream artefact generation targets.
          The integration contract is defined in <code>docs/15-limb-integration-architecture.md</code>.
          No live API calls are wired in Release 0.3.
        </p>
        <div className="comparison-limb-grid">
          {LIMBS.map(limb => (
            <LimbCard key={limb.id} limb={limb} />
          ))}
        </div>
      </section>

      {/* Integration contract note */}
      <section className="comparison-section">
        <div className="comparison-contract-card">
          <div className="comparison-contract-label">Release 0.3 Integration Status</div>
          <div className="comparison-contract-body">
            <p>
              The integration contract between Ordo Animi and the artefact limb repositories is <strong>documented but not yet wired</strong>.
              Release 0.3 establishes the brain/limb conceptual model, the evidence-to-limb routing map, and the minimum metadata required for an artefact request.
            </p>
            <p>
              The <strong>recommended first live integration candidate</strong> for Release 0.4 is the BA Artefact Generator —
              it is the only limb with an existing <code>/api/generate</code> Cloudflare Worker endpoint.
            </p>
          </div>
          <div className="comparison-contract-files">
            <span className="comparison-file-tag">docs/15-limb-integration-architecture.md</span>
            <span className="comparison-file-tag">pilot/evidence-comparison/artefact-limb-map.json</span>
            <span className="comparison-file-tag">pilot/evidence-comparison/release-0.3-evidence-comparison.md</span>
          </div>
        </div>
      </section>

      <footer className="comparison-footer">
        © 2026 ZenCloud Global Consultants. Proprietary and confidential.
      </footer>
    </div>
  );
}

function PilotCard({ pilot, num }: { pilot: typeof pilot001; num: string }) {
  const delta =
    pilot.evidence.startingConfidence != null && pilot.evidence.endingConfidence != null
      ? pilot.evidence.endingConfidence - pilot.evidence.startingConfidence
      : null;

  return (
    <div className="comparison-pilot-card">
      <div className="comparison-pilot-num">PILOT {num}</div>
      <div className="comparison-pilot-title">{pilot.title.split(': ')[1] ?? pilot.title}</div>
      <div className="comparison-pilot-scenario">{pilot.scenario}</div>
      {delta !== null && (
        <div className="comparison-pilot-confidence">
          <span className="comparison-confidence-before">{pilot.evidence.startingConfidence}</span>
          <span className="comparison-confidence-arrow">→</span>
          <span className="comparison-confidence-after">{pilot.evidence.endingConfidence}</span>
          <span className="comparison-confidence-delta">+{delta}</span>
        </div>
      )}
      <div className="comparison-pilot-pattern">
        <span className="comparison-pilot-pattern-label">Pattern</span>
        <span className="comparison-pilot-pattern-value">{pilot.evidence.mainPattern}</span>
      </div>
      <div className={`comparison-pilot-status pill ${pilot.status === 'complete' ? 'pill-complete' : 'pill-paused'}`}>
        {pilot.status}
      </div>
    </div>
  );
}

function LimbCard({ limb }: { limb: LimbEntry }) {
  return (
    <div className="comparison-limb-card">
      <div className="comparison-limb-header">
        <div className="comparison-limb-label">{limb.label}</div>
        <span className={`comparison-limb-badge ${maturityClass(limb.maturity)}`}>{limb.maturityLabel}</span>
      </div>
      <div className="comparison-limb-discipline">{limb.discipline}</div>
      <div className="comparison-limb-desc">{limb.description}</div>
      <div className="comparison-limb-artefacts">
        {limb.artefacts.map(a => (
          <span key={a} className="comparison-artefact-tag">{a}</span>
        ))}
      </div>
      {limb.url && (
        <a
          className="comparison-limb-link"
          href={limb.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open limb →
        </a>
      )}
    </div>
  );
}
