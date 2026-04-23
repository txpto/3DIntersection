# Demo: Intersección 3D (esfera + cubo)

Aplicación web simple con un entorno oscuro tipo “universo” donde:

- Puedes arrastrar una **esfera** con el mouse.
- Puedes mover un **cubo** con teclado (`WASD` + `Q/E`).
- Se calcula una aproximación de la zona de intersección esfera-cubo y se dibuja en:
  - Vista `XY`
  - Vista `XZ`
  - Vista `YZ`

## Ejecutar

Esta demo es estática (HTML + JS). Necesitas levantar un servidor local y abrir la URL en el navegador.

### Opción A (Python 3)

```bash
python3 -m http.server 8000
```

En Windows normalmente es:

```bat
py -3 -m http.server 8000
```

Si tu `python` apunta a Python 2.7 (como en tu caso), `python -m http.server` no funcionará.

### Opción B (Node.js, recomendado en Windows si no tienes Python 3)

```bash
npx serve -l 8000 .
```

### Abrir en navegador

- `http://localhost:8000`

## Nota para tu error en Windows

Si ves esto:

- `'python3' is not recognized...`
- `C:\Python27\python.exe: No module named http`

significa que no tienes Python 3 en PATH y que `python` está resolviendo a Python 2.7.

Soluciones rápidas:

1. Probar `py -3 -m http.server 8000`.
2. O usar `npx serve -l 8000 .`.
3. O instalar Python 3 y marcar “Add Python to PATH”.
