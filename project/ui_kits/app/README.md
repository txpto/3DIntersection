# Intersección 3D — App UI Kit

Pixel-level recreation of the Intersección 3D application chrome. The
real app renders through Three.js (WebGL); this kit uses a **static SVG
schematic** of the 3D viewport so the chrome (HUD, axis labels,
projection panels, metrics) can be previewed and iterated without
shipping the full Three.js runtime.

## Files

- `index.html` — composed page, the app at rest (intersection active).
- `AppShell.jsx` — 1 + 3 grid container.
- `MainViewport.jsx` — schematic sphere + cube + axes.
- `HUD.jsx` — glass controls panel + metrics block.
- `ProjectionPanel.jsx` — one of the three 2D projection canvases.
- `LabelChip.jsx` — reusable top-left panel chip.
- `Kbd.jsx` / `InlineCode.jsx` — inline typography primitives.

Design width: 1280 × 800.
