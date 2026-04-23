// One of three stacked projection panels (XY / XZ / YZ).
// Renders: bg #050714, 1px #1f2c61 axes at origin, mint sample dots
// at 3×3 px, a LabelChip in the top-left corner.
function ProjectionPanel({ label, dotCluster = 'cluster-a', last = false }) {
  // Pre-computed sample clusters (mimicking intersection point projections)
  const clusters = {
    'cluster-a': [
      [0.58, 0.52], [0.60, 0.50], [0.62, 0.48], [0.64, 0.50], [0.58, 0.48],
      [0.56, 0.52], [0.60, 0.54], [0.62, 0.54], [0.64, 0.52], [0.66, 0.50],
      [0.58, 0.56], [0.60, 0.56], [0.62, 0.58], [0.54, 0.52], [0.56, 0.48],
      [0.64, 0.56], [0.66, 0.54], [0.60, 0.46], [0.62, 0.46], [0.58, 0.58]
    ],
    'cluster-b': [
      [0.60, 0.52], [0.62, 0.52], [0.64, 0.54], [0.66, 0.52], [0.60, 0.54],
      [0.58, 0.54], [0.56, 0.54], [0.58, 0.52], [0.62, 0.56], [0.60, 0.56],
      [0.64, 0.50], [0.62, 0.50], [0.64, 0.56], [0.60, 0.50], [0.58, 0.56]
    ],
    'cluster-c': [
      [0.52, 0.58], [0.54, 0.56], [0.56, 0.58], [0.58, 0.60], [0.54, 0.60],
      [0.52, 0.60], [0.56, 0.60], [0.58, 0.58], [0.54, 0.58], [0.56, 0.56]
    ]
  }[dotCluster];

  return (
    <div style={{
      borderBottom: last ? 'none' : '1px solid #1b2240',
      position: 'relative',
      background: '#050714'
    }}>
      <svg viewBox="0 0 400 220" preserveAspectRatio="none"
           style={{ width:'100%', height:'100%', display:'block' }}>
        {/* Origin axes */}
        <line x1="0"   y1="110" x2="400" y2="110" stroke="#1f2c61" strokeWidth="1"/>
        <line x1="200" y1="0"   x2="200" y2="220" stroke="#1f2c61" strokeWidth="1"/>
        {/* Sampled points */}
        <g fill="#70ff73">
          {clusters.map(([u, v], i) => (
            <rect key={i} x={u*400 - 1.5} y={(1-v)*220 - 1.5} width="3" height="3"/>
          ))}
        </g>
      </svg>
      <LabelChip>{label}</LabelChip>
    </div>
  );
}

Object.assign(window, { ProjectionPanel });
