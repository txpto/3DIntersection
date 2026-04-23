# Demo: Intersección 3D (esfera + cubo)

Aplicación web 3D con layout 1+3 (vista principal y proyecciones XY/XZ/YZ), ejecutando ya la hoja de ruta por fases hacia una arquitectura profesional desacoplada.

## Estado actual (ejecución activa de fases)

- **Fase 1 ejecutada**: base visual oscura, interacción estable con ratón/teclado y HUD de estado.
- **Fase 2 en ejecución**: métricas operativas (`volumen aprox.`, `Δx`, `Δy`, `Δz`) y proyecciones sincronizadas.
- **Fase 3 iniciada**: backend geométrico desacoplado y cálculo en `Web Worker` para no bloquear UI.

### Controles
- Esfera: arrastre con ratón.
- Cubo (traslación): `W A S D` + `Q/E`.
- Cubo (rotación): `I J K L U O`.

## Arquitectura implementada en esta iteración

- `main.js`: render, input y orquestación de estado.
- `src/boolean-backend.js`: interfaz runtime del backend de intersección en worker.
- `src/intersection-worker.js`: cómputo geométrico desacoplado (gating esfera-OBB + muestreo + métricas).

## Plan por fases

- [`docs/PLAN_FASES_ARQUITECTURA.md`](docs/PLAN_FASES_ARQUITECTURA.md)

## Ejecutar

### Opción A (Python 3)

```bash
python3 -m http.server 8000
```

### Opción B (Node.js)

```bash
npx serve -l 8000 .
```

Abrir en navegador:

- `http://localhost:8000`
