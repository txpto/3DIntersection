// Static schematic stand-in for the Three.js main viewport.
// Renders a gridded floor, axes helper, sphere and cube at rough
// positions, and an emissive "intersection" lens where they overlap.
function MainViewport() {
  return (
    <section style={{
      position: 'relative',
      borderRight: '1px solid #1b2240',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 60% 45%, #080e24 0%, #03040d 70%)'
    }}>
      <svg viewBox="0 0 800 760" preserveAspectRatio="xMidYMid slice"
           style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <defs>
          <radialGradient id="sph" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#b8ecff" />
            <stop offset="55%" stopColor="#2ac0ff" />
            <stop offset="100%" stopColor="#0b3348" />
          </radialGradient>
          <linearGradient id="cubeFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9b4ff"/>
            <stop offset="100%" stopColor="#c060d9"/>
          </linearGradient>
          <linearGradient id="cubeTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd0ff"/>
            <stop offset="100%" stopColor="#f08cff"/>
          </linearGradient>
          <linearGradient id="cubeSide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a84cc0"/>
            <stop offset="100%" stopColor="#d978ef"/>
          </linearGradient>
          <clipPath id="sphClip">
            <circle cx="360" cy="430" r="150"/>
          </clipPath>
          <pattern id="gridPattern" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)">
            <path d="M0 0 L48 0 M0 24 L48 24 M0 0 L0 24 M48 0 L48 24" stroke="#1f2d6a" strokeWidth="0.6" fill="none"/>
          </pattern>
        </defs>

        {/* Ground grid in perspective */}
        <g transform="translate(0 540)">
          <path d="M 80 180 L 360 40 L 720 180 L 440 320 Z" fill="#05081a" stroke="#1b2240" strokeWidth="1"/>
          <g opacity="0.55" clipPath="url(#gridClip)">
            <defs><clipPath id="gridClip"><path d="M 80 180 L 360 40 L 720 180 L 440 320 Z"/></clipPath></defs>
            {[...Array(10)].map((_, i) => (
              <line key={`h${i}`} x1={80 + i*28} y1={180 - i*14} x2={440 + i*28} y2={320 - i*14} stroke="#1f2d6a" strokeWidth="0.6"/>
            ))}
            {[...Array(10)].map((_, i) => (
              <line key={`v${i}`} x1={80 + i*36} y1={180 - i*14} x2={80 + i*36 + 360} y2={180 - i*14 + 140} stroke="#101731" strokeWidth="0.6"/>
            ))}
          </g>
        </g>

        {/* Axes helper at origin */}
        <g transform="translate(400 580)" strokeWidth="2.5" strokeLinecap="round">
          <line x1="0" y1="0" x2="90" y2="-30" stroke="#ff5a5a"/>
          <line x1="0" y1="0" x2="0"  y2="-110" stroke="#6dff6d"/>
          <line x1="0" y1="0" x2="-70" y2="-22" stroke="#5aa0ff"/>
        </g>

        {/* Cube (magenta, OBB with slight rotation) */}
        <g transform="translate(470 360) rotate(-8)">
          {/* back/top/side faces of isometric cube */}
          <polygon points="0,30 110,0 220,30 110,60" fill="url(#cubeTop)" stroke="#f08cff" strokeWidth="1"/>
          <polygon points="0,30 0,180 110,210 110,60" fill="url(#cubeFace)" stroke="#c060d9" strokeWidth="1"/>
          <polygon points="110,60 220,30 220,180 110,210" fill="url(#cubeSide)" stroke="#a84cc0" strokeWidth="1"/>
        </g>

        {/* Sphere (cyan) */}
        <circle cx="360" cy="430" r="150" fill="url(#sph)" stroke="#2ac0ff" strokeWidth="1" opacity="0.95"/>
        <ellipse cx="320" cy="380" rx="60" ry="28" fill="#ffffff" opacity="0.25"/>

        {/* Intersection region: mint overlay clipped to sphere inside cube bounds */}
        <g clipPath="url(#sphClip)">
          <rect x="470" y="360" width="220" height="210" transform="rotate(-8 470 360)" fill="#7dff7f" opacity="0.45"/>
          {/* sampled dots */}
          {[...Array(40)].map((_, i) => {
            const x = 470 + (i % 8) * 6 + Math.sin(i) * 3;
            const y = 370 + Math.floor(i / 8) * 10;
            return <rect key={i} x={x} y={y} width="2.5" height="2.5" fill="#7dff7f"/>;
          })}
        </g>
      </svg>

      <HUD />
    </section>
  );
}

Object.assign(window, { MainViewport });
