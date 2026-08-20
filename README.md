# slides-app

Generador de presentaciones **Banco de Bogotá** sobre el sistema de diseño Sherpa. Escribes Markdown, salen slides on-brand a PDF, HTML, Figma y PPTX.

```bash
npm install
npm start     # http://localhost:5173  ← el creador
npm test      # valida parser, lint de estilo y geometría

npm run figma -- decks/plantilla.md   # → una página en Figma
```

A la izquierda, la tira de miniaturas: arrastra para reordenar, o usa ↑ ↓ ⧉ ✕ para subir, bajar, duplicar y borrar. Al lado, el **formulario de la diapositiva seleccionada**.

El layout decide **dónde** va el contenido; tú metes **componentes** dentro — párrafo, puntos, cifras, cita, tarjetas, imagen — y los añades, quitas y reordenas. Nada de escribir Markdown a mano, aunque el botón **Markdown** te lo abre si lo prefieres.

Los iconos se eligen del picker de los **532 de sherpa-assets**, con búsqueda y filtro por categoría, y se ven como iconos en el formulario. Las imágenes se suben a `decks/img/`.

El `.md` se sigue generando desde ahí y sigue siendo la fuente de verdad: `node test.js` verifica que editar por campos produzca exactamente el mismo resultado.

**Presentar** entra a pantalla completa (flechas para navegar, Esc para salir), **PDF** imprime a escala exacta y **HTML** descarga un archivo autocontenido.

La plantilla de arranque es [decks/plantilla.md](decks/plantilla.md) — ejercita los 10 layouts disponibles.

## `base/` no está en el repo

El sistema de diseño Sherpa (`base/`) queda fuera a propósito: contiene la
tipografía **Kiffo BdB**, que es propietaria del banco, y el material interno del
que salen los tokens. Hay que copiarlo a la raíz del proyecto por separado.

Sin `base/` el proyecto **no arranca**. Lo que depende de él:

| Qué | Para qué |
|---|---|
| `base/colors_and_type.css` | Variables CSS de la interfaz y las `@font-face` de Kiffo |
| `base/fonts/KiffoBDB-*.otf` | Fuentes que embebe el export a HTML |
| `base/assets/*.svg` | Logo e isotipo de los slides |

Los 189 tokens sí están versionados en `src/core/tokens.js`, que es un artefacto
generado desde ese CSS con `npm run tokens`.

> **Pendiente:** todo lo anterior existe también en
> [diseno-exp/sherpa-assets](https://github.com/diseno-exp/sherpa-assets), que es
> público y ya se sincroniza a `assets/`. Apuntar ahí las fuentes y los logos, y
> generar el CSS desde `tokens.js`, dejaría el repo funcionando con solo
> `npm run sync-assets`.

## Documentación

- [design.md](design.md) — **el sistema de diseño**: color, tipografía, retícula, layouts, componentes, datos, logo y legales. Fuente de verdad visual del proyecto.

- [docs/README.md](docs/README.md) — arquitectura, decisiones y stack
- [docs/01-formato-deck.md](docs/01-formato-deck.md) — sintaxis del deck y catálogo de layouts
- [docs/02-design-system-slides.md](docs/02-design-system-slides.md) — canvas, retícula, tipografía y assets
- [docs/03-exportadores.md](docs/03-exportadores.md) — PDF, HTML, Figma y PPTX
- [docs/04-roadmap.md](docs/04-roadmap.md) — fases y lo que se deja fuera

El sistema de diseño vive en [base/](base/) y no se toca desde aquí: `npm run tokens` lo convierte en `src/tokens.js`.
