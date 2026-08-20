# Avance de curaduría del corpus

Estado: en curso · última sesión 20 de agosto de 2026 (Sonnet 5)

Este documento registra el avance real de la Fase 1 del plan rector
([06-plan-producto-premium.md](../06-plan-producto-premium.md)): curar 100
referencias, reducirlas a 20–30 composiciones maestras. Se actualiza cada vez
que se revisa una fuente nueva — no se marca "hecho" hasta que el trabajo
esté hecho.

## Qué hay hasta ahora

**5 de las fuentes prioridad A** de
[05-corpus-visual-business.md](../05-corpus-visual-business.md) revisadas:
los cinco ejemplos de `SlideSpeak/slide-design-skill` listados explícitamente
en ese documento. **Faltan** los seis sistemas de `beautiful-html-templates`
(Signal, Monochrome, Neo-Grid Bold, Blue Professional, Editorial Forest,
Emerald Editorial) — es la siguiente fuente a trabajar.

| Fuente | Slides reales | Aceptadas | Aceptadas parcial (solo composición) | Rechazadas |
|---|---:|---:|---:|---:|
| [consulting-northwind](consulting-northwind.md) | 8 | 8 | 0 | 0 |
| [cost-to-serve-teardown](cost-to-serve-teardown.md) | 11 | 11 | 0 | 0 |
| [trade-ledger-report](trade-ledger-report.md) | 9 | 9 | 0 | 0 |
| [balance-sheet-explainer](balance-sheet-explainer.md) | 10 | 3 | 6 | 1 |
| [ai-trust-layer-pitch](ai-trust-layer-pitch.md) | 10 | 0 | 2 | 8 |
| **Total** | **48** | **31** | **8** | **9** |

**48 de 100 referencias objetivo** — casi la mitad, en una sola fuente
prioridad A. Cada entrada tiene captura real (`slice.sh` renderiza cada
`<section>` del HTML original en Chrome headless a 1920×1080 y la reduce a
960×540), metadata según el esquema de `docs/05` y el archivo HTML fuente
completo, descargado y versionado en el historial de esta sesión — no son
referencias inventadas ni descritas de memoria.

Los 5 contact sheets están en [contact-sheets/](contact-sheets/), uno por
fuente, en el mismo formato homogéneo 16:9 por slide que pide la Fase 0.

## Por qué esto no se convierte en las 100 de un tirón

`docs/05-corpus-visual-business.md` fija una disciplina explícita: **"Solo
las mejores 20–30 composiciones se traducirán inicialmente a cajas Sherpa"** —
no hace falta llegar a 100 curadas para empezar a traducir, hace falta
suficiente cobertura de intención. Con 39 referencias reales (31 + 8
parciales) ya hay señal fuerte en varias categorías del corpus piloto:

| Grupo del corpus piloto (objetivo) | Cubiertas hasta ahora |
|---|---:|
| Narrativa ejecutiva y pitch (20) | 6 |
| KPIs, resultados y hallazgos (20) | 9 — el grupo mejor cubierto, ver abajo |
| Gráficas (15) | 4 (waterfall, breakdown, drivers/divergente, trend) |
| Tablas y matrices (10) | 4 |
| Producto, screenshots y mockups (20) | 0 — ninguna fuente revisada hasta ahora tiene este contenido |
| Procesos, timelines y roadmaps (15) | 5 |

**Hueco explícito:** cero referencias de producto/screenshot/mockup todavía.
Las fuentes B (`MockyMax`) y algunas de las fuentes A restantes
(`beautiful-html-templates`, sobre todo "Blue Professional" que
`docs/05` marca como SaaS B2B) son las que probablemente lo resuelven — es la
prioridad de la próxima sesión de curaduría, no narrativa ejecutiva otra vez.

## El hallazgo más fuerte: kpi-hero está sobre-validado

**Nueve referencias independientes, de cuatro fuentes distintas**, convergen
en la misma composición: una cifra dominante (180–240px) a la izquierda o
arriba, con una etiqueta muted debajo, y — cuando hay evidencia de apoyo — un
bloque de texto con un filete/borde de acento a un lado, nunca un fondo de
color. Es el patrón visual más repetido de todo el corpus revisado hasta
ahora, en registros tan distintos como consulting editorial, prensa
financiera, y hasta (parcialmente) pitch decks SaaS.

Esto confirma con evidencia externa real, no con criterio propio, que el
`kpi-hero` construido en la Fase A (`stats` con un solo item pintando a
`statHero`, 240px, en `src/core/componentes.js`) apuntaba al lugar correcto.
Ninguna de las nueve referencias sugiere un cambio a esa implementación.

## Dos composiciones nuevas con señal fuerte (2+ fuentes independientes)

Candidatas a entrar al catálogo de `docs/05-corpus-visual-business.md` en la
Fase 3 (no ahora — el plan rector prohíbe ampliar el catálogo antes de que
los decks patrón revelen el hueco, y curar el corpus no es lo mismo que
construir composiciones):

1. **`framework-2x2`** — matriz de 2 ejes con 4 cuadrantes de texto corto.
   Aparece en `consulting-northwind-06` y `cost-to-serve-teardown-07`, dos
   fuentes independientes con el mismo tratamiento (rejilla fina, sin fondo
   de color por cuadrante).
2. **`agenda-index`** — lista numerada de 3-5 preguntas que el deck va a
   responder, usada como segunda slide. Solo una fuente hasta ahora
   (`cost-to-serve-teardown-02`); necesita una segunda fuente antes de
   considerarse señal fuerte.

Una tercera, `masthead-cover` (portada de boletín/reporte periódico,
`trade-ledger-report-01`), es interesante para el registro "reporte
trimestral" pero de una sola fuente — anotada, no promovida.

## Capacidad confirmada como necesaria: gráfica de cascada (waterfall)

`cost-to-serve-teardown-05` es un waterfall real, con etiqueta directa por
barra y sin eje secundario — exactamente la regla de
`design.md` § Visualización de datos. La Fase 4 del plan rector deja
pendiente "decidir si son imagen o formas nativas" para las gráficas; esta
referencia es el caso concreto contra el que probar esa decisión cuando
llegue el momento — no se implementa en esta sesión.

## Próximo paso

1. Repetir este mismo proceso (`slice.sh` + revisión por contact sheet) sobre
   los seis sistemas de `beautiful-html-templates` — es la fuente que más
   falta y la que `docs/05` marca como prioridad A junto con SlideSpeak.
   Prioridad dentro de eso: **"Blue Professional"**, por ser la única
   etiquetada explícitamente como SaaS B2B — es donde más probablemente
   aparezcan las referencias de producto/screenshot que hoy están en cero.
2. Con eso, repetir la tabla de cobertura por grupo de arriba y decidir si ya
   hay señal suficiente para cerrar la Fase 1 con menos de 100 referencias
   curadas, en vez de perseguir el número exacto.
3. Solo después: seleccionar las 20–30 composiciones maestras y pasar a la
   Fase 2 (macrotema Sherpa Business).

## Herramienta reutilizable

`slice.sh` y `montage.py` (en el directorio de scratch de la sesión, no en
este repo — son herramientas de curaduría, no parte del producto) aíslan
cada `<section class="slide">` de un HTML de referencia con Chrome headless
y arman el contact sheet. Cualquier fuente nueva que sea un HTML
autocontenido con slides como `<section>` se procesa igual, en minutos.
