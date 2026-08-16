function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-display text-3xl font-medium text-ink">CloudBox scaffold is running</h1>
      <p className="font-sans text-ink-muted text-sm">
        If this text uses Space Grotesk above and IBM Plex Sans here, Tailwind and the design
        tokens are wired up correctly.
      </p>
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-card bg-accent" title="accent" />
        <div className="w-16 h-16 rounded-card bg-accent-soft border border-border" title="accent-soft" />
        <div className="w-16 h-16 rounded-card bg-warn-bg border border-border" title="warn-bg" />
        <div className="w-16 h-16 rounded-card bg-success" title="success" />
        <div className="w-16 h-16 rounded-card bg-danger" title="danger" />
      </div>
      <p className="font-mono text-xs text-ink-muted">1,204 KB · Aug 16, 2026</p>
    </div>
  );
}

export default App;
