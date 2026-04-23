// Inline-code chip for interactables: esfera, cubo, etc.
function InlineCode({ children }) {
  return (
    <code style={{
      fontFamily: 'var(--font-mono)',
      color: '#c6d2ff',
      background: '#0b0f22',
      padding: '1px 6px',
      borderRadius: 4,
      border: '1px solid #1f2b58',
      fontSize: '0.92em'
    }}>{children}</code>
  );
}

// Keycap: slightly heavier bottom border to imply a physical key
function Kbd({ children }) {
  return (
    <kbd style={{
      display: 'inline-block',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: '#c6d2ff',
      background: '#0b0f22',
      padding: '2px 6px',
      borderRadius: 5,
      border: '1px solid #1f2b58',
      borderBottomWidth: 2,
      lineHeight: 1.2,
      marginRight: 2
    }}>{children}</kbd>
  );
}

// Top-left panel chip used for axis / projection labels
function LabelChip({ children, placement = 'top-left' }) {
  const pos = {
    'top-left': { top: 8, left: 8 },
    'top-right': { top: 8, right: 8 },
    'bottom-left': { bottom: 8, left: 8 }
  }[placement];
  return (
    <span style={{
      position: 'absolute',
      ...pos,
      fontSize: 12,
      letterSpacing: '0.02em',
      color: '#9fb0ff',
      background: 'rgba(2, 4, 10, 0.7)',
      padding: '3px 6px',
      border: '1px solid #263260',
      borderRadius: 5,
      fontFamily: 'var(--font-sans)'
    }}>{children}</span>
  );
}

Object.assign(window, { InlineCode, Kbd, LabelChip });
