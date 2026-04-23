# Intersección 3D — Design System

A design system distilled from **Intersección 3D**, a web application that
visualises the boolean intersection between a **sphere** and a **cube** in real
time, rendered with Three.js and complemented by three 2D orthographic
projections (XY / XZ / YZ).

The visual language is **technical, dark, and measurement-driven** — closer to
scientific instrumentation (CAD, CFD inspectors, particle-physics viewers) than
to consumer SaaS. It is a tool for looking *at data*, not at marketing.

## Product context

The app is an engineering prototype currently in **Fase 1** of a 5-phase plan
toward a robust CSG / geometry backend (target: Manifold WASM running in a
worker). Today it delivers:

- **1 + 3 layout** — one main 3D viewport + three stacked 2D projection
  panels on the right.
- **Sphere moved by mouse** (drag on a horizontal plane).
- **Cube translated by keyboard** (`WASD` on the XZ plane, `Q/E` on Y) and
  **rotated by keyboard** (`I J K L U O` — pitch / yaw / roll).
- **Geometry runs in a Web Worker** (`src/intersection-worker.js`) behind a
  decoupled `SamplingWorkerBackend` interface, so the main thread stays
  responsive. The HUD shows the active `Backend:` label alongside metrics.
- **HUD** with live intersection flag, approximate volume, and per-axis
  extents (Δx, Δy, Δz).
- **Sampled point-cloud** rendering of the intersection region, projected
  onto each orthographic panel.
- **Dirty-flag recomputation** so geometry only updates when transforms
  actually change.

The UI is in **Spanish** and uses technical / mathematical notation
(`Δx`, `Δy`, `Δz`, `Intersección`, `Proyección XY`).

## Sources used to build this system

- **Codebase** (read-only, mounted via Import): `3DIntersection/`
  - `index.html` — layout skeleton, HUD, panel canvases, embedded CSS.
  - `main.js` — Three.js scene, materials, colours, interaction, metrics.
  - `README.md` — product description, run instructions.
  - `docs/PLAN_FASES_ARQUITECTURA.md` — 5-phase roadmap.
- **GitHub repo:** `txpto/3DIntersection` (same content, not imported —
  the local mount is the source of truth).

Reference copies of the source live under `source_ref/` in this project.

## What's in this folder

| Path                         | What it is                                        |
| ---------------------------- | ------------------------------------------------- |
| `README.md`                  | This file — context, fundamentals, index          |
| `colors_and_type.css`        | All design tokens (color, type, spacing, radius)  |
| `SKILL.md`                   | Agent Skill entry-point (Claude Code compatible)  |
| `assets/`                    | Favicon + any extracted visual assets             |
| `source_ref/`                | Read-only copies of the original codebase files   |
| `preview/`                   | Design-system preview cards (colors, type, …)    |
| `ui_kits/app/`               | High-fidelity recreation of the app UI            |

## Content fundamentals

### Language & tone

- **Language:** Spanish. All user-visible copy is written in Spanish.
  (`Intersección`, `Volumen aprox.`, `Arrastra la esfera`, `Mueve el cubo`.)
- **Register:** technical and direct — imperatives are used to describe
  controls (*"Arrastra…", "Mueve…"*). No marketing voice, no second-person
  familiarity cues beyond the imperative.
- **Casing:** Sentence case everywhere. No Title Case, no ALL CAPS.
  Unit labels and axis names are lowercase (`volumen aprox.`, `extents`).
- **Abbreviations:** Preferred for density — `aprox.`, `Δx`, `Δy`, `Δz`.
  Mathematical symbols beat words (Δ over "delta", · over "and").
- **Numbers:** Extents are fixed to **3 decimals**
  (`Δx=${size.x.toFixed(3)}`); volumes to **4 decimals**
  (`volumeApprox.toFixed(4)`); area also 4 decimals. Separator between
  axes: ` · ` (middle dot): `Δx=1.234 · Δy=0.567 · Δz=0.890`.
- **Code voice:** Inline `<code>` is used for anything the user physically
  interacts with — object names (`esfera`, `cubo`) and keys
  (`W A S D`, `Q/E`).
- **Emoji:** **Never.** Not in source, not in this system.
- **Exclamation marks:** None. The tone is declarative.

### Example copy (lifted verbatim)

> Arrastra la **esfera** con el ratón.
> Mueve el **cubo** con `W A S D` (plano XZ) y `Q/E` (Y).

> Intersección: **sí**
> Backend: **worker**
> Volumen aprox.: **0.4823**
> Δx=0.930 · Δy=0.860 · Δz=1.210

> Proyección XY (Z integrado)

### Writing a new string

1. Start with a verb in the imperative, or with a noun label.
2. Keep it under ~12 words. Wrap interactable nouns and keys in `<code>`.
3. Numbers → 3 decimals. Separator → ` · `. Units are implied, not written.
4. If in doubt, prefer the Greek letter or symbol over the English word.

## Visual foundations

### Colour

- **Palette family:** *Deep-space navy*. Three near-black blues stacked
  (`#02030a` → `#03040d` → `#050714`) create a layered void with the body
  darkest and the 2D projection canvases slightly lighter.
- **Foreground:** lavender-tinted whites (`#d5dcff`, `#c6d2ff`, `#9fb0ff`).
  Text is never pure white — it always carries a cool blue cast to sit
  cleanly on the navy.
- **Data channel colours** (and their meaning):
  - **Cyan `#2ac0ff`** → the *sphere* primitive.
  - **Magenta `#f08cff`** → the *cube* primitive.
  - **Mint `#7dff7f`** → the *intersection* (success, hit, overlap). Also
    used for the positive-metric text.
- **Supporting:** navy grid lines (`#1f2d6a` over `#101731`) and a muted
  lavender (`#8290d2`) for ambient light and secondary UI.
- **No gradients.** Colour shifts in the UI are always flat-on-flat.
  Glow/emission happens only where a 3D light falls on a material.

### Typography

- **Family:** `Inter` with system fallbacks (`system-ui, -apple-system,
  Segoe UI, Roboto, sans-serif`). Inter is not bundled — it's pulled from
  the OS when present and falls through to the platform sans otherwise.
- **Monospace** (for inline `<code>`): the platform default. We use
  `JetBrains Mono` in the token layer as the preferred bundled mono when
  available.
- **Scale:** tight — 12 / 14 / 16 / 20 / 28. The product itself only ever
  uses 12px: HUD and axis labels live at information-dense sizes.
- **Weight contrast:** values are in `<strong>` (700); everything else
  sits at 400. There is almost no 500/600 in the source.
- **Letter-spacing:** `0.02em` on small labels for legibility at 12px.
  Uppercase headings (added by this system) use `0.08em`.

### Spacing & rhythm

- Tight, technical — the base rhythm is **3 / 6 / 8 / 10 px**. Larger
  containers step up 16 / 24, but the source app barely needs them.
- HUD internal padding: `10px`. Chip label padding: `3px 6px`.
- Metrics block is separated from the HUD header by an `8px` gap + a
  1px top border (`#25315f`) — not by additional whitespace.

### Backgrounds & texture

- **Flat navy fills.** No images, no photographs, no full-bleed hero.
- **No repeating patterns** on DOM surfaces.
- The 3D viewport *does* carry texture — a `GridHelper(20, 20)` at 50%
  opacity (`#1f2d6a` / `#101731`) — but this is a scene element, not a
  page decoration.
- **AxesHelper(3.5)** is visible at origin. Its RGB convention (X=red,
  Y=green, Z=blue) is read as a scene aid, not a brand colour.

### Borders

- Borders are the primary structural device: `1px solid` in one of the
  `--border-*` navy tokens. Panels are separated by border lines, not
  shadows.
- `:last-child { border-bottom: none; }` is used to avoid terminal rules.
- Border colours step up with elevation: `#1b2240` (divider) → `#1f2b58`
  (framed panel) → `#263260` (chip).

### Shadows, glow, elevation

- **No box-shadows on DOM elements** in source. Elevation is encoded by
  **translucency + border**, not by drop shadows.
- The HUD is a glass surface: `rgba(0,0,0,0.45)` + `1px` border.
- **Glow is reserved for emission** in the 3D scene (point material on
  intersection samples). This system exposes it via optional
  `--glow-hit`, `--glow-sphere`, `--glow-cube` tokens for UI moments
  that need to echo the data-channel colour.

### Transparency & blur

- **Translucency is a structural choice** — the HUD and axis chips both
  use `rgba(...)` backgrounds so the 3D scene shows through. This
  reinforces the sense that the UI floats over a live viewport.
- The source does not use `backdrop-filter`. This system adds a gentle
  `blur(2px)` on `.ds-hud` as an opt-in; omit it when rendering over
  static panels.

### Animation

- **The app does not animate the UI.** The only motion is the
  `requestAnimationFrame` render loop advancing the 3D scene and the
  `OrbitControls` damping (`enableDamping = true`).
- There are no CSS transitions, fades, or eases on DOM elements.
- **Hover states:** the source defines none. This system adds a
  conservative `opacity: 0.85` hover convention for interactive chrome.
- **Press states:** a subtle border-colour step toward `--border-3`.
  No scale transforms, no colour inversion.

### Corner radii

- Chip: `5px` · Panel / HUD: `8px` · Card (system-added): `12px`.
- Nothing in the source is a perfect circle except the sphere itself.
  Avoid `border-radius: 9999px` capsules — they do not appear in source.

### Cards

- Source has no "cards" in the web-app sense. For composed UIs, treat a
  card as: flat `--bg-panel` fill, `1px solid --border-2`,
  `8px`–`12px` radius, no shadow. Internal structure uses the same
  border scale for sub-dividers.

### Layout rules

- **1 + 3 grid** is the signature layout: `grid-template-columns: 2fr 1fr`
  with the right column split `repeat(3, 1fr)` rows.
- **Fixed / overlay elements** (HUD, labels) are absolutely positioned
  inside their host panel with 8–10px insets.
- The HUD sits bottom-left; panel labels sit top-left. This corner
  assignment is consistent across all three projection panels.

### Imagery

- There is none, beyond the `favicon.ico`. The data *is* the imagery.
- If product imagery is ever added, it should be cool-toned,
  high-contrast, low-saturation — rendered screenshots or numeric
  outputs, never marketing photography.

## Iconography

- **Source ships no icon system.** No icon font, no SVG sprite, no image
  icons beyond the `favicon.ico`. The only glyphs in the UI are
  **axis letters** (`X`, `Y`, `Z`), the **Greek Δ**, and the
  **middle-dot separator `·`** — all Unicode, typeset in the body font.
- **Emoji:** never used.
- **Keyboard indicators:** the app uses inline `<code>` around the key
  letter (`W`, `A`, `S`, `D`, `Q`, `E`) rather than an iconographic
  key-cap glyph. This is the recommended pattern.

### Recommendation for extending the system

When an icon is unavoidable (e.g. a toolbar button for *reset scene*,
*toggle axis helper*, *export metrics*), use **Lucide** icons via CDN at
`stroke-width: 1.5`, sized `16px`. Lucide's thin-stroke geometric style
matches the instrumentation aesthetic; no flagged substitution is
needed because source has no competing system.

```html
<!-- in <head> -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

Use sparingly — text and Unicode symbols are preferred where they can
carry the meaning.

## Font substitution notice

⚠️ **Inter is not bundled in the source.** The app declares
`font-family: Inter, system-ui, …` and relies on the OS to provide Inter
if installed, otherwise falls through to the platform sans. This system
does the same — no `.woff2` files are included. If you want
guaranteed-consistent rendering in a deliverable, pull Inter from Google
Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

If you have a licensed / bundled copy of Inter you'd like embedded,
drop the `.woff2` files in `fonts/` and I'll wire them up.

## Index of preview cards

All cards live in `preview/` and are registered for the Design System
tab. Groups: **Colors**, **Type**, **Spacing**, **Components**, **Brand**.

## UI kits

- **`ui_kits/app/`** — recreation of the Intersección 3D application
  interface: the 1+3 layout, HUD, axis-label chips, metrics block, and a
  schematic (non-WebGL) stand-in for the 3D viewport so the chrome can
  be previewed without shipping the full Three.js runtime.
