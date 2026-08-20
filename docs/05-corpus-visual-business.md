# Corpus visual business para Sherpa Slides

Estado: curaduría en curso · última actualización 20 de agosto de 2026

**La curaduría real ya empezó.** El avance, las referencias con captura y
metadata, y los contact sheets viven en [corpus/](corpus/) —
[corpus/00-avance.md](corpus/00-avance.md) es el documento vivo que se
actualiza en cada sesión de curaduría; este documento sigue siendo la
taxonomía y las reglas de admisión que gobiernan ese trabajo, no cambia con
cada referencia nueva.

## Objetivo

Construir un corpus pequeño y curado para que una IA elija composiciones
ejecutivas atractivas sin salir del único sistema de diseño Sherpa.

El corpus conserva de las referencias la composición, jerarquía, densidad,
tratamiento de imágenes y ritmo. No conserva colores, fuentes, logos ni marcas
externas: toda referencia aceptada se reinterpreta con Kiffo BDB, Roboto, la
retícula y los tokens de Sherpa.

El foco es:

- pitch decks e investor updates;
- entregas de resultados, hallazgos y recomendaciones;
- datos, tablas y visualizaciones;
- presentaciones de producto y funcionalidades;
- screenshots, fotografías y mockups de dispositivos;
- procesos, paso a paso, cronogramas y roadmaps;
- decisiones, riesgos, dependencias y próximos pasos.

## Principios estéticos

1. Sobrio no significa genérico: la composición debe seguir teniendo una
   silueta reconocible al verla como miniatura.
2. Cada slide tiene un foco dominante; no una colección de módulos con el mismo
   peso.
3. Las imágenes y los screenshots tienen una región diseñada desde el inicio;
   no se agregan como decoración al final.
4. El color se reserva para marca, énfasis y significado en datos.
5. La variedad viene de escala, asimetría, ritmo, recorte y contraste de
   superficies, no de usar muchos colores.
6. Un deck alterna impacto, explicación, evidencia y pausa visual.

## Tres registros Sherpa

| Registro | Uso principal | Carácter |
|---|---|---|
| Ejecutivo editorial | Junta, estrategia, resultados, decisiones | Autoridad tranquila, espacio negativo, reglas finas |
| Product-led | Producto, funcionalidades, demos, lanzamientos | Screenshot o mockup dominante, anotaciones mínimas |
| Data-led | KPIs, análisis, comparaciones, evidencia | Titular que declara el hallazgo, gráfica como prueba |

Los tres usan la misma marca; son registros de composición, no temas.

## Taxonomía inicial de composiciones

### Narrativa ejecutiva y pitch

| ID | Composición | Contenido esperado | Medio visual |
|---|---|---|---|
| `cover-editorial` | Portada ejecutiva | Título, subtítulo, fecha | Fotografía o superficie tipográfica |
| `executive-summary` | Resumen ejecutivo | 3 hallazgos o decisiones | Opcional, no iconos decorativos |
| `problem-evidence` | Problema + evidencia | Declaración, dato, explicación | Cifra o imagen contextual |
| `solution-overview` | Solución | Propuesta de valor y 2–3 capacidades | Screenshot o diagrama simple |
| `market-opportunity` | Oportunidad | TAM/SAM/SOM o segmentos | Gráfica, no tres círculos por defecto |
| `business-model` | Modelo de negocio | Flujo de valor, ingresos, actores | Diagrama o tabla compacta |
| `traction` | Tracción | KPI principal y tendencia | Gráfica + cifra dominante |
| `decision-ask` | Decisión o solicitud | Qué se necesita, por qué, cuándo | Sin decoración; máxima claridad |

### Resultados, datos y hallazgos

| ID | Composición | Contenido esperado | Medio visual |
|---|---|---|---|
| `kpi-hero` | KPI dominante | Una cifra, contexto y variación | Sparkline opcional |
| `kpi-strip` | Resumen de indicadores | 3–5 métricas comparables | Sin tarjetas elevadas |
| `trend` | Evolución | Serie temporal y anotación | Línea, área o slope chart |
| `breakdown` | Desglose | Categorías o segmentos | Barras, dot plot o tabla |
| `target-vs-actual` | Objetivo vs. resultado | Meta, real y desviación | Bullet chart o barras |
| `drivers` | Factores explicativos | Contribuciones positivas/negativas | Waterfall o barras divergentes |
| `finding-evidence` | Hallazgo + prueba | Titular conclusivo, fuente, evidencia | Gráfica o tabla protagonista |
| `recommendation` | Recomendación | Acción, impacto, esfuerzo | Matriz o lista priorizada |
| `risk-register` | Riesgos | Riesgo, impacto, probabilidad, mitigación | Tabla o matriz sobria |

### Producto, imágenes y mockups

| ID | Composición | Contenido esperado | Región visual mínima |
|---|---|---|---|
| `product-hero-desktop` | Producto principal | Beneficio y screenshot | 55–70% del lienzo |
| `product-hero-mobile` | App móvil | Beneficio y 1–2 teléfonos | 45–60% del lienzo |
| `feature-detail` | Funcionalidad | Qué hace, para quién, resultado | 50–65% para screenshot |
| `annotated-screen` | Pantalla explicada | 2–4 callouts numerados | 60–75% para screenshot |
| `before-after-product` | Antes/después | Cambio y efecto | Dos capturas grandes comparables |
| `workflow-screens` | Flujo de usuario | 3–5 estados secuenciales | Galería horizontal legible |
| `product-context` | Producto en uso | Mensaje y contexto humano | Fotografía o mockup ambiental |
| `feature-matrix` | Capacidades | Funciones por segmento/plan | Tabla; screenshot opcional |

Reglas para medios:

- Una captura debe poder leerse a distancia; si no, se recorta al área relevante.
- Los callouts no tapan controles importantes y se limitan a cuatro.
- Un mockup debe demostrar contexto o escala; no se usa solo para adornar.
- Se prefieren screenshots reales. Los placeholders existen solo durante la
  edición.
- Se soportan recortes `cover`, `contain`, editorial vertical, 16:9 y pantalla
  completa.
- Deben existir variantes sin marco, navegador, teléfono, tablet, laptop y
  escena ambiental.

### Procesos, cronogramas y roadmaps

| ID | Composición | Contenido esperado | Forma |
|---|---|---|---|
| `steps` | Paso a paso | 3–6 pasos | Secuencia horizontal o vertical |
| `process-flow` | Proceso | Etapas, entradas y salidas | Flujo con dirección inequívoca |
| `timeline` | Cronología | Fechas e hitos | Línea temporal anotada |
| `roadmap-quarters` | Roadmap | Iniciativas por trimestre | Bandas o carriles |
| `now-next-later` | Priorización | Ahora, siguiente, después | Tres horizontes, no tres tarjetas genéricas |
| `workstreams` | Frentes paralelos | Actividades y responsables | Swimlanes |
| `milestones` | Hitos | Entregable, fecha y estado | Timeline o tabla compacta |
| `dependencies` | Dependencias | Iniciativas y bloqueos | Grafo simple o matriz |
| `status-plan` | Estado del plan | Frente, avance, riesgo, próximo hito | Tabla ejecutiva |

### Tablas

Las tablas son composiciones de primera clase, no texto metido en una cuadrícula.

| Tipo | Uso | Regla visual |
|---|---|---|
| Tabla ejecutiva | Estado, responsable, fecha, decisión | 4–6 columnas; jerarquía por alineación y peso |
| Matriz comparativa | Alternativas o competidores | Resaltar una conclusión, no colorear cada celda |
| Tabla financiera | Periodos, real, meta, variación | Números alineados por decimal; unidades visibles |
| Heatmap | Intensidad o desempeño | Escala secuencial accesible y leyenda |
| Tabla de roadmap | Iniciativas por periodo | Pocas filas; hitos y estado distinguibles sin depender solo del color |
| Tabla de riesgos | Impacto, probabilidad, mitigación | Texto corto y prioridad explícita |

### Gráficas

La selección parte de la pregunta, siguiendo el
[Financial Times Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md).

| Pregunta | Familias preferidas |
|---|---|
| Cambio en el tiempo | Línea, área, slope chart, small multiples |
| Comparación | Barras, dot plot, lollipop |
| Ranking | Barras ordenadas, bump chart |
| Distribución | Histograma, box plot, strip plot |
| Relación | Scatter plot, bubble plot con cautela |
| Parte de un total | Barras apiladas; donut solo para 2–4 partes simples |
| Contribución | Waterfall, barras divergentes |
| Flujo | Sankey o alluvial solo cuando el flujo sea el mensaje |

Reglas:

- El título de la slide declara el hallazgo, no el nombre de la gráfica.
- Una serie se destaca y las demás retroceden visualmente.
- Ejes, unidades, periodo, fuente y anotaciones son obligatorios cuando aplican.
- No se usan gráficas 3D, gauges decorativos ni arcoíris de categorías.
- La implementación abierta del vocabulario está en
  [ft-interactive/visual-vocabulary-templates](https://github.com/ft-interactive/visual-vocabulary-templates)
  bajo licencia MIT.

### Candidatos detectados en curaduría, todavía no promovidos

No se agregan al catálogo formal — el gobierno del catálogo
(`06-plan-producto-premium.md`, sección "Gobierno del catálogo") exige que una
composición aparezca como necesidad en un deck real antes de entrar, y curar
el corpus no es lo mismo que construir un deck patrón. Quedan aquí como
candidatos con evidencia real detrás, para revisar en la Fase 3:

- **`framework-2x2`** — matriz de dos ejes con 4 cuadrantes. Dos fuentes
  independientes del corpus la usan con el mismo tratamiento (rejilla fina,
  sin fondo de color). Ver `corpus/consulting-northwind.md` y
  `corpus/cost-to-serve-teardown.md`.
- **`agenda-index`** — lista numerada de 3–5 preguntas que el deck responde,
  como segunda slide. Una sola fuente hasta ahora
  (`corpus/cost-to-serve-teardown.md`); necesita una segunda antes de
  considerarse señal fuerte.

## Fuentes abiertas priorizadas

### A. Referencias visuales principales

| Fuente | Licencia observada | Qué recopilar | Prioridad |
|---|---|---|---|
| [beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates) | MIT | Composición, ritmo, metadata y documentación visual | A |
| [SlideSpeak/slide-design-skill](https://github.com/SlideSpeak/slide-design-skill) | MIT | Pitch, consultoría, reportes, tablas, gráficas e imágenes | A |
| [noskillish/slides](https://github.com/noskillish/slides) | MIT | Gramática de 31 componentes y narrativa de pitch | B |
| [Kuneosu/make-slide](https://github.com/Kuneosu/make-slide) | MIT | Tipos de slide y cobertura funcional | B |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | Revisar por recurso | Pitch, product launch, weekly report y layouts | B |
| [alfonsograziano/pptx-gen](https://github.com/alfonsograziano/pptx-gen) | Revisar repositorio y assets | Modelo de template + screenshot + metadata + campos | B |

Dentro de `beautiful-html-templates`, la primera selección es:

| Sistema | Aporta | Decisión |
|---|---|---|
| Signal | Investor/board deck, datos, chart, timeline, proceso e imagen | Fuente principal |
| Monochrome | Reportes densos, hallazgos, timeline, charts e imagen | Fuente principal |
| Neo-Grid Bold | Features, matrices, tablas, procesos, charts y roadmap | Extraer composición; suavizar expresividad |
| Blue Professional | SaaS B2B, resultados, timeline y roadmap | Extraer gramática; evitar acabado genérico |
| Editorial Forest | Imagen editorial, chart y framework | Útil para resultados con dimensión humana |
| Emerald Editorial | Estrategia, resultados, chart y proceso | Útil para ritmo ejecutivo |

Ejemplos business verificables de SlideSpeak — **los cinco ya curados**, ver
[corpus/00-avance.md](corpus/00-avance.md):

- [AI trust layer pitch](https://github.com/SlideSpeak/slide-design-skill/blob/main/examples/ai-trust-layer-pitch.html) — [corpus/ai-trust-layer-pitch.md](corpus/ai-trust-layer-pitch.md), mayormente rechazada (glassmorphism, tarjetas idénticas)
- [Balance sheet explainer](https://github.com/SlideSpeak/slide-design-skill/blob/main/examples/balance-sheet-explainer.html) — [corpus/balance-sheet-explainer.md](corpus/balance-sheet-explainer.md), composición sí, superficie no
- [Consulting Northwind](https://github.com/SlideSpeak/slide-design-skill/blob/main/examples/consulting-northwind.html) — [corpus/consulting-northwind.md](corpus/consulting-northwind.md), aceptada completa
- [Cost-to-serve teardown](https://github.com/SlideSpeak/slide-design-skill/blob/main/examples/cost-to-serve-teardown.html) — [corpus/cost-to-serve-teardown.md](corpus/cost-to-serve-teardown.md), aceptada completa
- [Trade ledger report](https://github.com/SlideSpeak/slide-design-skill/blob/main/examples/trade-ledger-report.html) — [corpus/trade-ledger-report.md](corpus/trade-ledger-report.md), aceptada completa

### B. Mockups y escenas de producto

| Fuente | Licencia observada | Qué recopilar | Nota |
|---|---|---|---|
| [MockyMax](https://github.com/eigdoyr/mockymax) | MIT para el código | Taxonomía de escenas, máscaras, perspectiva y composición | Verificar licencia de cada fotografía |

MockyMax separa el render de la definición de escena mediante `render-core` y
`scene-format`. Es una referencia útil para generar un PNG/WebP de mockup antes
de insertarlo en la slide, sin acoplar el compositor de presentaciones al motor
de perspectiva.

## Metadatos mínimos por referencia

```yaml
id: signal-slide-14
source:
  repository: zarazhangrui/beautiful-html-templates
  license: MIT
  path: templates/signal/template.html
  slide: 14
intent: finding-evidence
register: data-led
content:
  title_chars: 54
  body_words: 32
  metrics: 1
  series: 4
  table_rows: 0
media:
  kind: chart
  required: true
  canvas_share: 0.58
composition:
  focal_point: chart
  hierarchy: headline-chart-note
  asymmetry: medium
  density: medium
  surface: dark
  distinctive_device: hairline-grid
fit:
  sherpa: high
  business: high
  product: low
use_when:
  - una tendencia sostiene una conclusión ejecutiva
avoid_when:
  - hay más de seis series
```

La IA seleccionará por intención y forma del contenido, no por similitud de
color.

## Criterio de admisión: atractivo y no genérico

Una referencia entra si cumple al menos seis de estos criterios:

- tiene un foco dominante claro;
- su silueta se reconoce como miniatura;
- sigue siendo interesante sin sus colores originales;
- usa espacio negativo de manera intencional;
- la imagen, tabla o gráfica tiene una región protagonista;
- la jerarquía permite entender el mensaje en tres segundos;
- documenta capacidad y límites de contenido;
- pertenece visualmente a una secuencia de deck;
- puede traducirse a Sherpa sin copiar su marca;
- aporta una composición que no existe aún en el proyecto.

Se rechaza si depende principalmente de:

- tres o cuatro tarjetas idénticas;
- icono + título + párrafo repetido;
- bento grid sin razón narrativa;
- gradientes, blobs, glassmorphism o pills decorativos;
- screenshots pequeños o ilegibles;
- mockups usados solo como adorno;
- exceso de colores de acento;
- dashboards completos encogidos dentro de una slide;
- el mismo encabezado y la misma retícula durante todo el deck.

## Corpus piloto

| Grupo | Cantidad objetivo |
|---|---:|
| Narrativa ejecutiva y pitch | 20 |
| KPIs, resultados y hallazgos | 20 |
| Gráficas | 15 |
| Tablas y matrices | 10 |
| Producto, screenshots y mockups | 20 |
| Procesos, timelines y roadmaps | 15 |
| **Total** | **100** |

Cada referencia debe conservar captura, enlace y metadata. Solo las mejores
20–30 composiciones se traducirán inicialmente a cajas Sherpa.

## Orden de trabajo

1. Renderizar las fuentes A en miniaturas homogéneas 16:9.
2. Construir contact sheets por categoría, no por repositorio.
3. Seleccionar manualmente las 100 referencias con el criterio anterior.
4. Anotar automáticamente los metadatos y corregirlos en revisión humana.
5. Detectar duplicados compositivos aunque cambien colores o tipografías.
6. Traducir las 20–30 composiciones de mayor cobertura a Sherpa.
7. Probar la selección de la IA con contenido business real.
8. Ampliar el corpus solo donde aparezcan huecos medidos.

## Fuera de alcance por ahora

- Importar repositorios completos al runtime.
- Mantener sus temas, fuentes o paletas.
- Entrenar o afinar un modelo.
- Crear un crawler general de GitHub.
- Añadir animaciones que no sobrevivan a PDF, Figma o PPTX.

El primer entregable visual debe ser una contact sheet curada. Antes de escribir
nuevos layouts, esa lámina permitirá comprobar si las referencias seleccionadas
son realmente premium, business y suficientemente distintas entre sí.
