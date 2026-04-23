# Demo: Intersección 3D (esfera + cubo)

Aplicación web 3D con ejecución por fases activa y arquitectura desacoplada para evolucionar hacia un backend geométrico robusto.

## Progreso por fases
- **Fase 1 (completada):** UI 1+3 + interacción completa (ratón/teclado).
- **Fase 2 (en ejecución):** métricas aproximadas en runtime (volumen/área/extents).
- **Fase 3 (en ejecución):** backend de intersección en Web Worker + deduplicación de resultados.
- **Fase 4 (en ejecución):** validación automática del core geométrico (tests + drift).
- **Fase 5 (iniciada):** tuning runtime (selector backend, samples, telemetría de cómputo).

Plan formal: [`docs/PLAN_FASES_ARQUITECTURA.md`](docs/PLAN_FASES_ARQUITECTURA.md)

## Controles
- Esfera: arrastre con ratón.
- Cubo traslación: `W A S D` + `Q/E`.
- Cubo rotación: `I J K L U O`.
- Panel runtime: cambiar backend (`worker`/`inline`) y `samples per axis`, luego pulsar **Aplicar**.

## Arquitectura implementada
- `main.js`: render/input, control de fases, configuración runtime y telemetría.
- `src/boolean-backend.js`: factoría de backend (`worker` o `inline fallback`).
- `src/intersection-core.js`: núcleo geométrico común.
- `src/intersection-worker.js`: ejecución asíncrona del cálculo.
- `tests/intersection-core.test.mjs`: regresión geométrica base.
- `scripts/phase4-validation.mjs`: validación de estabilidad por resolución.

## Ejecutar
```bash
python3 -m http.server 8000
```

o

```bash
npx serve -l 8000 .
```

Abrir: `http://localhost:8000`

## Validación (Fase 4)
```bash
npm test
npm run validate:sampling
```
