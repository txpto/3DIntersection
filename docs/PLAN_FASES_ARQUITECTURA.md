# Plan profesional por fases — App 3D de intersección esfera-cubo

## Objetivo
Implementar una arquitectura web robusta para intersección 3D con separación estricta de responsabilidades: `input/render`, `orquestación`, y `backend geométrico`.

## Fase 0 — Definición técnica (completada)
- Stack web-first confirmado.
- Estrategia separada entre detección rápida y cálculo de geometría/métricas.

## Fase 1 — Base visual e interacción (completada)
- Layout 1+3 con vista principal + paneles XY/XZ/YZ.
- Escena oscura y controles de interacción estables.
- Controles de traslación y rotación del cubo + drag de esfera.

## Fase 2 — MVP geométrico operativo (en ejecución)
- Intersección por muestreo con métricas aproximadas.
- HUD de estado en tiempo real.

## Fase 3 — Endurecimiento arquitectónico (en ejecución)
- Backend desacoplado con contrato único.
- Ejecución en Web Worker con deduplicación por `requestId`.
- Fallback inline para entornos sin Worker.

## Fase 4 — Calidad métrica y validación (en ejecución)
- Shared core geométrico (`intersection-core`) reutilizado entre worker e inline.
- Tests automáticos (`node:test`) para regresión geométrica base.
- Script de validación de drift por resolución.

## Fase 5 — Optimización avanzada y backend robusto (iniciada)
- Selector runtime de backend (`worker`/`inline`) y resolución de muestreo.
- Telemetría de latencia de cómputo en HUD para tuning en vivo.
- Próximo paso: backend CSG robusto en WASM (Manifold) detrás del mismo contrato.

## Estado de ejecución actual
- F1: completada.
- F2: en ejecución.
- F3: en ejecución.
- F4: en ejecución.
- F5: iniciada.
