type ArtifactViewerProps = {
  title: string;
  sourceFile: string;
  summary: string;
};

export function ArtifactViewer({
  title,
  sourceFile,
  summary,
}: ArtifactViewerProps) {
  return (
    <section className="panel artifact-panel">
      <p className="eyebrow">Artefact viewer</p>

      <h2>{title}</h2>

      <div className="artifact-meta">
        <span>Source</span>
        <code>{sourceFile}</code>
      </div>

      <p>{summary}</p>
    </section>
  );
}
