# Demo: Intersección 3D (esfera + cubo)

Aplicación web 3D con ejecución por fases activa y arquitectura desacoplada para evolucionar hacia un backend geométrico robusto.

## Progreso por fases
- **Fase 1 (completada):** UI 1+3 + interacción completa (ratón/teclado).
- **Fase 2 (en ejecución):** métricas aproximadas en runtime (volumen/área/extents).
- **Fase 3 (en ejecución):** backend de intersección en Web Worker + deduplicación de resultados.
- **Fase 4 (iniciada):** núcleo geométrico compartido para preparar validación.
- **Fase 5 (pendiente):** migración a backend CSG robusto (WASM).

Plan formal: [`docs/PLAN_FASES_ARQUITECTURA.md`](docs/PLAN_FASES_ARQUITECTURA.md)

## Controles
- Esfera: arrastre con ratón.
- Cubo traslación: `W A S D` + `Q/E`.
- Cubo rotación: `I J K L U O`.

## Arquitectura implementada
- `main.js`: render/input y orquestación.
- `src/boolean-backend.js`: factoría de backend (`worker` o `inline fallback`).
- `src/intersection-core.js`: núcleo geométrico común.
- `src/intersection-worker.js`: ejecución asíncrona del cálculo.

## Ejecutar
```bash
python3 -m http.server 8000
```

o

```bash
python3 -m http.server 8000
```

Abrir: `http://localhost:8000`
