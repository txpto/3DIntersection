# Demo: Intersección 3D (esfera + cubo)

Aplicación web 3D con layout 1+3 (vista principal y proyecciones XY/XZ/YZ) para iterar hacia una arquitectura profesional de intersección esfera-cubo.

## Estado actual

- Base visual oscura y controles activos:
  - Esfera con ratón (drag sobre plano).
  - Cubo con teclado (`WASD` + `Q/E`).
- Proyecciones 2D de la intersección (muestra por puntos) en paneles XY/XZ/YZ.
- Detección rápida de intersección esfera-caja para evitar cómputo innecesario.
- Recomputación con `dirty flag`.
- HUD con estado de intersección, volumen aproximado y extents (`Δx`, `Δy`, `Δz`).

## Plan por fases

El plan de investigación/distribución profesional quedó documentado en:

- [`docs/PLAN_FASES_ARQUITECTURA.md`](docs/PLAN_FASES_ARQUITECTURA.md)

Fase actual: **Fase 1 (en progreso)**.

## Ejecutar

Esta demo es estática (HTML + JS). Levanta un servidor local y abre la URL en el navegador.

### Opción A (Python 3)

```bash
python3 -m http.server 8000
```

En Windows normalmente es:

```bat
py -3 -m http.server 8000
```

### Opción B (Node.js)

```bash
npx serve -l 8000 .
```

### Opción C (Python 2.7 legado)

```bash
python -m SimpleHTTPServer 8000
```

> Nota: esta opción es legado; se recomienda Python 3 o Node.js.

### Abrir en navegador

- `http://localhost:8000`
