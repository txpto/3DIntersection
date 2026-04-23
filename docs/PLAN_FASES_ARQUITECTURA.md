# Plan profesional por fases — App 3D de intersección esfera-cubo

## Objetivo
Definir e implementar una arquitectura web robusta con separación clara entre render, interacción y cálculo geométrico autoritativo de la intersección.

## Fase 0 — Alineación técnica (completada)
- Decisión de stack objetivo: **Three.js (web-first)** + backend geométrico desacoplado.
- Estrategia: separar **detección rápida** y **geometría autoritativa**.
- Política de compatibilidad: WebGL como base; WebGPU como mejora progresiva.

## Fase 1 — Base visual e interacción estable (en progreso)
### Entregables
- Layout 1+3 (vista principal + proyecciones XY/XZ/YZ).
- Escena oscura operativa, controles de ratón para esfera y teclado para cubo.
- Métricas mínimas visibles en HUD.
- Cálculo bajo demanda con `dirty flag` para evitar recomputación innecesaria.

### Criterios de aceptación
- Interacción fluida sin congelar la UI.
- Proyecciones actualizadas solo al cambiar transformaciones.
- Indicador de intersección y extents básicos visibles.

## Fase 2 — MVP geométrico de referencia
### Entregables
- Backend geométrico MVP (CSG aproximado/rápido).
- Métricas operativas: volumen aproximado, extents por eje.
- Casos funcionales cubiertos: no solape, parcial, tangencia aproximada.

### Criterios de aceptación
- Render principal >30 FPS en escritorio estándar.
- Resultado visual consistente entre panel principal y paneles ortográficos.

## Fase 3 — Endurecimiento con backend robusto (prioridad alta)
### Entregables
- Contrato `BooleanBackend` desacoplado del frontend.
- Worker dedicado para cálculo geométrico.
- Integración de backend robusto (objetivo: Manifold WASM).

### Criterios de aceptación
- UI reactiva durante operaciones geométricas.
- Resultados estables en casos coplanares/casi tangenciales.
- Cancelación o descarte de resultados obsoletos.

## Fase 4 — Calidad métrica y validación
### Entregables
- Área/volumen sobre malla cerrada autoritativa.
- Suite de pruebas de regresión geométrica.
- Perfilado de memoria/GC y latencia de interacción.

### Criterios de aceptación
- Métricas consistentes entre ejecuciones.
- Sin fugas evidentes en regeneración repetida de intersección.

## Fase 5 — Optimización avanzada y roadmap opcional
### Entregables
- Ruta SDF/voxel/WebGPU opcional para previsualización ultra-rápida.
- Herramientas de slicing/inspección adicional por eje.
- Ajustes de UX finales para entrega productiva.

### Criterios de aceptación
- Mejora perceptible de latencia o claridad visual frente a Fase 4.
- Sin regresión de robustez en el backend autoritativo.

## Estado de ejecución (actual)
- **Fase 1 ejecutada** (UI/HUD e interacción base).
- **Fase 2 en ejecución** (métricas operativas en runtime).
- **Fase 3 iniciada** con backend desacoplado y cálculo en worker.
