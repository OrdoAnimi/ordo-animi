export function App() {
  return (
    <main className="console-shell">
      <section className="hero-panel">
        <p className="eyebrow">VALOUR Pilot Console v0.1</p>
        <h1>Private operator workspace</h1>
        <p className="hero-copy">
          The local app runtime is active. This first render removes imported panels so the browser can confirm the base React path before the Pilot 001 cockpit is restored.
        </p>
      </section>

      <section className="panel pilot-header">
        <div>
          <p className="eyebrow">pilot/runs/pilot-001-architecture-review-board</p>
          <h2>Pilot 001: Architecture Review Board</h2>
          <p>
            Once this screen is visible, the workflow timeline, evidence panel, and artefact viewer can be reintroduced safely.
          </p>
        </div>

        <div className="status-pill">ready</div>
      </section>
    </main>
  );
}
