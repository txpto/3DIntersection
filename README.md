# Demo: Intersección 3D (esfera + cubo)

Aplicación web simple con un entorno oscuro tipo “universo” donde:

- Puedes arrastrar una **esfera** con el mouse.
- Puedes mover un **cubo** con teclado (`WASD` + `Q/E`).
- Se calcula una aproximación de la zona de intersección esfera-cubo y se dibuja en:
  - Vista `XY`
  - Vista `XZ`
  - Vista `YZ`

## Ejecutar

Como usa módulos ES desde CDN, puedes servir la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`.
