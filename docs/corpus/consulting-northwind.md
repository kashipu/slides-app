# Referencia: consulting-northwind

```yaml
source:
  repository: SlideSpeak/slide-design-skill
  license: MIT
  path: examples/consulting-northwind.html
  fetched: 2026-08-20
register_general: ejecutivo editorial (consulting) — cream #F7F5F2, tinta oscura,
  acento rojo #C8102E, regla fina en vez de caja, serif + monospace de datos.
```

8 secciones (`data-slide-type` real del HTML). Las 8 se aceptan: ninguna depende
de tarjetas idénticas, iconos repetidos, gradientes ni fondos de dashboard.

## 01 · cover → `cover-editorial`

```yaml
id: consulting-northwind-01
intent: cover-editorial
register: ejecutivo editorial
content: { title_chars: 52, body_words: 12 }
media: { kind: none }
composition:
  focal_point: título
  hierarchy: kicker-título-subtítulo
  asymmetry: low
  density: low
  surface: light
  distinctive_device: regla fina horizontal sobre el kicker, sin logo dominante
fit: { sherpa: alto, business: alto }
use_when: [portada de pitch o reporte donde la marca no necesita ocupar espacio]
avoid_when: [se requiere logo grande en portada]
```

## 02 · executive-summary → `executive-summary`

```yaml
id: consulting-northwind-02
intent: executive-summary
register: ejecutivo editorial
content: { title_chars: 88, body_words: 95, metrics: 0 }
media: { kind: none }
composition:
  focal_point: título-conclusión (no "Resumen ejecutivo" genérico)
  hierarchy: titular-conclusivo → 5 hallazgos numerados
  asymmetry: low
  density: medium
  surface: light
  distinctive_device: numeración roja de 2 dígitos + regla horizontal entre cada
    hallazgo — nunca tarjetas ni iconos
fit: { sherpa: alto, business: alto }
use_when: [3 a 5 conclusiones con evidencia, todas del mismo peso narrativo]
avoid_when: [los hallazgos requieren imagen o gráfica propia — usar finding-evidence]
```

Coincide exactamente con la definición de `executive-summary` en
[05-corpus-visual-business.md](../05-corpus-visual-business.md) — validación
directa de la composición ya prevista, no un hallazgo nuevo.

## 03 · section-divider → valida el layout `section` de la Fase A

```yaml
id: consulting-northwind-03
intent: section-divider
register: ejecutivo editorial
content: { title_chars: 40 }
media: { kind: none }
composition:
  focal_point: número gigante ("01") en rojo, alineado a la izquierda
  hierarchy: número → título → descriptor muted
  asymmetry: low
  density: low
  surface: light (esta fuente lo hace también en oscuro; aquí en claro)
  distinctive_device: número protagonista, no ilustración
fit: { sherpa: alto, business: alto }
use_when: [divisor de sección en decks de más de 10 slides]
avoid_when: [—]
```

**Nota directa:** esta composición — número gigante + título — es exactamente
lo que el layout `section` rediseñado en la Fase A ya implementa
(`TYPE.numero`, 200px, en `src/core/layouts.js`). Esta referencia confirma que
la dirección tomada en la Fase A está alineada con composición real de mercado,
no es una invención.

## 04 · data-callout → `kpi-hero`

```yaml
id: consulting-northwind-04
intent: kpi-hero
register: data-led
content: { title_chars: 0, body_words: 45, metrics: 1 }
media: { kind: none }
composition:
  focal_point: cifra "−9pp" en ~180-200px, con signo incluido
  hierarchy: eyebrow pequeño → cifra enorme + etiqueta muted debajo → 3 párrafos
    de evidencia a la derecha con filete izquierdo de 3px
  asymmetry: alta (columna angosta de cifra vs. columna ancha de texto)
  density: low
  surface: light
  distinctive_device: filete vertical de acento a la izquierda del bloque de
    texto de apoyo — ninguna caja, ningún fondo
fit: { sherpa: alto, business: alto }
use_when: [una sola cifra sostiene la conclusión de la slide]
avoid_when: [hay más de una cifra igual de importante — usar kpi-strip]
```

**Validación directa de la Fase A:** el `stats` con un solo item (kpi-hero) y
el filete de acento de `cita` en `src/core/componentes.js` reproducen esta
composición casi exactamente. Cuatro fuentes distintas de este corpus llegan
al mismo patrón — ver `trade-ledger-report-04` y `cost-to-serve-teardown-04`.

## 05 · content-3col → valida `tarjetas` sin fondo

```yaml
id: consulting-northwind-05
intent: feature-matrix
register: ejecutivo editorial
content: { title_chars: 45, body_words: 60 }
media: { kind: none }
composition:
  focal_point: título-conclusión arriba de las tres columnas
  hierarchy: eyebrow rojo por columna → regla superior de 1px → cuerpo
  asymmetry: low
  density: medium
  surface: light
  distinctive_device: regla superior fina en vez de fondo o borde completo —
    exactamente el tratamiento que reemplazó el fondo con radio en tarjetas
fit: { sherpa: alto, business: alto }
use_when: [3 ideas paralelas sin necesidad de icono]
avoid_when: [cada columna necesita una imagen propia]
```

**Validación directa:** confirma que `tarjetas` sin `rect` de fondo (Fase A,
tarea 2) es el tratamiento correcto — este es el patrón real que se estaba
persiguiendo, no una invención estética propia.

## 06 · framework-2x2 → composición nueva, candidata a taxonomía

```yaml
id: consulting-northwind-06
intent: framework-2x2   # NO existe hoy en docs/05-corpus-visual-business.md
register: ejecutivo editorial
content: { title_chars: 40, body_words: 70 }
media: { kind: diagram }
composition:
  focal_point: matriz 2×2 con ejes rotulados (vertical/horizontal en monospace)
  hierarchy: título-conclusión → matriz con 4 cuadrantes de texto corto
  asymmetry: low
  density: medium
  surface: light
  distinctive_device: líneas de rejilla finas dividiendo los 4 cuadrantes, sin
    fondo de color por cuadrante
fit: { sherpa: medio, business: alto }
use_when: [comparar dos ejes de decisión — posicionamiento, priorización]
avoid_when: [hay más de 4 elementos a posicionar — se vuelve ilegible]
```

**Candidata nueva:** este patrón aparece también en
`cost-to-serve-teardown-07` (matriz impacto/esfuerzo) — dos fuentes
independientes lo usan, señal fuerte de que merece entrar a la taxonomía de
`docs/05-corpus-visual-business.md` como `framework-2x2` o similar. No está
cubierto por ninguna de las 34 composiciones actuales del documento.

## 07 · process-flow → `steps` / `process-flow`

```yaml
id: consulting-northwind-07
intent: process-flow
register: ejecutivo editorial
content: { title_chars: 42, metrics: 0 }
media: { kind: none }
composition:
  focal_point: 5 columnas iguales, numeradas
  hierarchy: paso numerado → título en negrita → descripción muted
  asymmetry: low
  density: medium
  surface: light
  distinctive_device: regla superior de color por columna — mismo tratamiento
    que content-3col y que "tarjetas" de la Fase A
fit: { sherpa: alto, business: alto }
use_when: [3 a 6 pasos secuenciales del mismo peso]
avoid_when: [los pasos tienen duración/fecha explícita — usar timeline]
```

## 08 · closing → variante clara de cierre

```yaml
id: consulting-northwind-08
intent: decision-ask
register: ejecutivo editorial
content: { title_chars: 55 }
media: { kind: none }
composition:
  focal_point: frase de decisión, centrada
  hierarchy: eyebrow → titular de decisión → regla fina de cierre
  asymmetry: low
  density: low
  surface: light (nota: el `cierre` de Sherpa hoy es oscuro — esta es una
    variante clara que Sherpa todavía no tiene)
fit: { sherpa: medio, business: alto }
use_when: [cierre de un deck de registro ejecutivo/consulting, sin necesidad
    de la superficie oscura institucional]
avoid_when: [se quiere el remate de marca fuerte del `cierre` oscuro actual]
```

**Hueco detectado:** Sherpa solo tiene un `cierre` oscuro. Esta referencia
sugiere que un cierre claro y sobrio (frase de decisión + regla, sin logo
grande) es un registro real de mercado — candidato a variante de `cierre`
cuando se construyan las 16 composiciones (Fase 3 del plan rector), no una
prioridad de la Fase A.
