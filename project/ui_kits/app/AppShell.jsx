// Top-level app shell: 1 + 3 grid matching the source's #app layout.
function AppShell() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      height: '100vh',
      background: '#02030a',
      color: '#d5dcff',
      fontFamily: 'var(--font-sans)'
    }}>
      <MainViewport />
      <section style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)' }}>
        <ProjectionPanel label="Proyección XY (Z integrado)" dotCluster="cluster-a" />
        <ProjectionPanel label="Proyección XZ (Y integrado)" dotCluster="cluster-b" />
        <ProjectionPanel label="Proyección YZ (X integrado)" dotCluster="cluster-c" last />
      </section>
    </div>
  );
}

Object.assign(window, { AppShell });
