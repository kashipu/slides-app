# Referencia: balance-sheet-explainer

```yaml
source:
  repository: SlideSpeak/slide-design-skill
  license: MIT
  path: examples/balance-sheet-explainer.html
  fetched: 2026-08-20
register_general: editorial explicativo, tono "sketch notebook" — papel crema
  con textura de líneas, resaltador amarillo, cajas de nota tipo sticky-note,
  bordes punteados. No es un registro de banca — es un formato pedagógico.
```

**Veredicto general: se acepta la composición, se rechaza la superficie.**
Ningún elemento decorativo de esta fuente (resaltador, textura de papel,
sticky-notes, anillo circular) es Sherpa ni lo será — son exactamente el tipo
de "moda decorativa" que `docs/05-corpus-visual-business.md` pide dejar fuera.
Pero la **estructura** de varias slides es genuinely útil y se traduce bien:
lo que se conserva es composición y jerarquía, no color ni textura — que es
literalmente el principio rector del corpus ("no conserva colores, fuentes,
logos ni marcas externas").

| # | `data-slide-type` | Intent Sherpa | Verdicto | Nota |
|---|---|---|---|---|
| 01 | cover | `cover-editorial` | Composición sí, superficie no | Título con resaltador → rechazar; estructura título+subtítulo+regla → aceptar |
| 02 | big-idea | `afirmacion` | **Aceptar** | Ver ficha abajo — valida el layout nuevo de la Fase A |
| 03 | anatomy | (diagrama de partes) | Aceptar con reserva | Cajas apiladas con número — útil pero requiere un componente de diagrama que no existe; no es prioridad de Fase A/Fase 4 |
| 04 | walk-through | `process-flow` | Aceptar composición | Columnas con borde punteado — tratamiento alternativo a la regla superior, más "boxed"; conservar la idea (columnas iguales, numeradas), no el punteado |
| 05 | key-figure | `kpi-hero` | Composición sí, superficie no | Cifra enorme dentro de un anillo circular — rechazar el anillo (decoración), aceptar cifra+etiqueta como 7ª validación de kpi-hero |
| 06 | data-read | `trend`/`breakdown` | Composición sí, superficie no | Barras + callout de resaltador apuntando a una barra — aceptar barras+anotación, rechazar el sticky-note amarillo |
| 07 | checklist | `bullets` (variante) | Aceptar, ya cubierto | Lista con check en vez de viñeta — Sherpa ya soporta icono por bullet, no requiere trabajo nuevo |
| 08 | look-closer | `dos-columnas` | **Aceptar** | Comparación "esto vs. aquello" en dos cajas simétricas con un separador "vs" — encaja limpio en `dos-columnas` tal cual existe |
| 09 | gotchas | `business-table` (matriz) | Aceptar composición | Tabla "la trampa / la corrección" de 2 columnas — encaja en tabla o matriz comparativa |
| 10 | recap | `steps`/`timeline` | Aceptar composición | 3 hitos conectados por línea punteada horizontal — aceptar la secuencia, la línea punteada es decoración prescindible |

## 02 · big-idea → valida el layout `afirmacion` de la Fase A

```yaml
id: balance-sheet-explainer-02
intent: afirmacion
register: editorial explicativo (composición trasladable; superficie no)
content: { title_chars: 26, body_words: 24 }
media: { kind: none }
composition:
  focal_point: una sola frase declarativa, grande, centrada verticalmente
  hierarchy: eyebrow → frase → apoyo de una línea → callout secundario
  asymmetry: low
  density: low
  surface: light
  distinctive_device: nada compite con la frase — el mismo principio de
    espacio negativo del layout `afirmacion`
fit: { sherpa: alto (la composición, no el resaltador), business: alto }
use_when: [una conclusión que no necesita evidencia visual, solo convicción]
avoid_when: [la conclusión requiere una cifra — usar kpi-hero en su lugar]
```

**Validación directa:** el layout `afirmacion` construido en la Fase A
(`src/core/layouts.js`, `displayXL` a 160px + espacio negativo) es
exactamente esta composición, sin el resaltador amarillo ni el papel crema.
Segunda fuente independiente de esta sesión que valida tipografía dominante
con espacio negativo como patrón real, no una preferencia estética propia.
