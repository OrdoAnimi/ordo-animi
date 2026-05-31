export function OperatorNotes({ notes }: { notes: string[] }) {
  return (
    <section className="panel notes-panel">
      <p className="eyebrow">Operator notes</p>
      <h2>Guardrails</h2>

      <div className="note-stack">
        {notes.map((note) => (
          <p className="note-line" key={note}>{note}</p>
        ))}
      </div>
    </section>
  );
}
