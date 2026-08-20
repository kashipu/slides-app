# Plan de producto: de generador funcional a sistema visual premium

Estado: plan rector · 19 de agosto de 2026

## Objetivo

Convertir `slides-app` en una aplicación capaz de transformar un brief,
contenido, datos e imágenes en una presentación business completa, editable y
exportable, con dirección de arte consistente y nivel visual suficientemente
alto para presentarla a clientes, comités o inversionistas sin rediseño manual.

La garantía no depende de pedirle a un modelo que «diseñe algo premium». Se
construye con una cadena de control:

```text
referencias aprobadas
        ↓
gramática visual Sherpa
        ↓
composiciones validadas
        ↓
selección restringida de la IA
        ↓
render determinista
        ↓
crítica visual de slide y deck
        ↓
aprobar o recomponer
```

El corpus y su taxonomía se desarrollan en
[05-corpus-visual-business.md](05-corpus-visual-business.md). La arquitectura y
los exportadores existentes se describen en [README.md](README.md) y
[04-roadmap.md](04-roadmap.md). Este documento coordina ambos trabajos de
principio a fin.

## Resultado esperado

El flujo terminado debe permitir:

1. Recibir el propósito, audiencia, contenido, datos y assets de un deck.
2. Construir una narrativa y asignar un trabajo concreto a cada slide.
3. Elegir una composición Sherpa compatible con el contenido real.
4. Renderizar imágenes, mockups, tablas y gráficas como elementos protagonistas.
5. Evaluar legibilidad, jerarquía, composición y ritmo visual.
6. Rehacer automáticamente las slides que no alcancen el estándar.
7. Permitir edición por contenido y elección de variante, sin soltar la geometría.
8. Exportar el mismo deck a HTML, PDF, Figma y PPTX editable.

## Estado actual y brecha

La base existente ya resuelve una parte importante del producto:

- Markdown como fuente de verdad;
- un IR de cajas compartido;
- retícula, tipografía, tokens y marca Sherpa;
- layouts por regiones y componentes medibles;
- editor y visor;
- salida HTML/PDF y trayectoria para Figma/PPTX.

La brecha visual está antes del renderer. El catálogo actual garantiza orden y
consistencia, pero no tiene suficiente conocimiento para decidir:

- cuál es el foco narrativo de una slide;
- qué composición expresa mejor ese foco;
- cuánto espacio necesita una imagen, tabla, gráfica o screenshot;
- cómo variar las siluetas sin abandonar la marca;
- cuándo una slide se ve genérica aunque no tenga errores técnicos;
- si la secuencia completa tiene ritmo y dirección de arte.

Por eso el siguiente salto no es agregar layouts genéricos. Es convertir el
design system en un sistema editorial que la IA pueda consultar y obedecer.

## Fase A — Intervención visual inmediata del runtime (prioridad 0)

Estado: **pendiente de ejecución** · prioridad fijada el 20 de agosto de 2026.

### Decisión de prioridades

Los exportadores salen de la ruta crítica. El exportador de Figma ya lleva la
composición con fidelidad y eso cubre la necesidad actual; PPTX se pospone y no
condiciona ninguna puerta de calidad de las fases siguientes. Hasta nuevo aviso,
la prueba de exportación de los decks se limita a **HTML, PDF y Figma**.

Lo que bloquea el producto hoy es otra cosa: el runtime solo sabe producir
slides genéricas. Esta fase interviene el código existente para subir el piso
visual **antes** de curar corpus o construir las 16 composiciones. No las
sustituye: les da un runtime capaz de expresarlas.

### Diagnóstico preciso (verificado en el código, no opinión)

1. **Una sola cabecera para todo.** Todos los layouts con regiones pintan el
   mismo encabezado `tag` 24 px + título `h2` 64 px (`cabecera()` en
   `src/core/layouts.js`). No hay silueta distinguible entre slides.
2. **Estética de dashboard en `tarjetas` y `tabla`.** Ambos componentes pintan
   rectángulos de fondo (`bgSubtle`) con radios por cada tarjeta y por cada
   celda (`src/core/componentes.js`). Es exactamente el anti-patrón que este
   plan rechaza: «exceso de cajas, pills, bordes… estética de dashboard».
3. **Cifras sin protagonismo.** `stats` pinta todo a 96 px teñido del acento,
   sin variante de cifra dominante. No existe el `kpi-hero` del catálogo.
4. **Cero asimetría.** Las regiones son 12 columnas o 6+6 simétricas. No hay
   composición 8+4 ni layout con medio lateral dominante.
5. **Ningún layout da al medio 45–75 % del lienzo con zona de texto prevista.**
   `imagen` a sangre existe, pero sin región de texto lateral; el componente
   `imagen` queda subordinado a la pila de texto.
6. **La escala tipográfica termina en 120 px** (`TYPE` en
   `src/core/geometria.js`). No existen el titular de afirmación ni la cifra
   protagonista; el resultado es texto casi al cien por cien y al mismo tamaño.

### Orden de trabajo para el agente ejecutor

Reglas globales, obligatorias durante toda la fase:

- Trabajar sobre la rama designada y correr `node test.js` tras cada tarea; la
  fase termina con el test verde y `decks/plantilla.md` con **0 avisos**.
- No introducir tipos de caja nuevos: solo `text`, `rect`, `svg`, `icon`,
  `image`. Son los que `src/ui/Deck.jsx`, `src/export/html.jsx` y
  `tools/figma/render-slides.js` saben dibujar; un kind nuevo obligaría a tocar
  los tres y no hace falta para nada de lo que sigue.
- Solo tokens de `src/core/tokens.js`; espaciados y radios dentro de las
  escalas de `design.md`; sin gradientes de fondo ni sombras nuevas.
- No romper la compatibilidad del formato: los `ALIAS` de `src/core/parse.js`
  y los decks existentes deben seguir abriendo sin avisos.
- Los filetes (reglas finas) se pintan como `rect` de 2–4 px de alto sin radio.

**Tarea 1 — Escala tipográfica editorial** (`src/core/geometria.js`)

Añadir a `TYPE` tres estilos; no tocar `AVG` (indexa por familia, no por
estilo):

- `displayXL: { size: 160, font: 'display', weight: 500, lh: 1.05 }` — titular
  de afirmación y portada.
- `statHero: { size: 240, font: 'display', weight: 600, lh: 1.0 }` — cifra
  protagonista.
- `numero: { size: 200, font: 'display', weight: 300, lh: 1.0 }` — número
  gigante de sección.

Subir `quote` de 56 a 64 px (sigue en peso 300). Documentar los tres estilos en
la tabla «Escala de diapositiva» de `design.md` — la escala derivada admite
pasos nuevos, la de producto no se toca.

**Tarea 2 — Matar el dashboard en los componentes** (`src/core/componentes.js`)

- `tarjetas` → columnas editoriales: eliminar los `rect` de fondo. Por item:
  filete superior de 3 px en `ctx.tinta` al ancho de la columna, icono 48 px si
  lo hay, título `h3`, texto `body` en `fgMuted`. De 2 a 4 items en **una sola
  fila** de columnas iguales con canal 32; sin fondos, el aire separa.
- `tabla` → tabla editorial: eliminar los `rect` por celda. Encabezado en
  `body` 28 px peso 500 y `fgDefault`, con **una** regla de 3 px en `ctx.tinta`
  bajo toda la fila. Filas separadas por filete de 1 px `#E6E6E6` (carbon-200,
  el token de borde). Padding vertical 20. Alineación: primera columna a la
  izquierda; toda celda cuyo texto plano empiece por dígito, `+`, `-` o `$` se
  alinea a la derecha. La jerarquía la dan alineación y peso, no fondos.
- `stats`: el valor pasa a `fgDefault` (negro), con filete superior de 2 px en
  `ctx.tinta` y etiqueta en `caption` `fgMuted`. **Con un solo item** el valor
  se pinta en `statHero` (240 px) y la etiqueta en `bodyL`: ese es el
  `kpi-hero` del catálogo, sin layout nuevo.
- `cita`: texto en `quote` (ya a 64 px por la tarea 1) con barra vertical de
  8 px en `ctx.tinta` a la izquierda y el texto sangrado 48 px; autor en estilo
  `tag` y `fgMuted`.

**Tarea 3 — Layouts con silueta** (`src/core/layouts.js`)

Cambio de soporte: permitir que un layout no-especial declare `fijas(s, ctx)`
(cajas pintadas antes de las regiones) y `cabeceraW` (ancho de la cabecera,
por defecto `cols(10)`). Son ~6 líneas en `componer()` y `cabecera()`.

Layouts nuevos:

- `afirmacion` (especial, fondo blanco): tag en (112, 96) `fgAccent`; título en
  `displayXL` en x=112, y=380, ancho `cols(11)`; apoyo opcional `bodyL`
  `fgMuted` en (112, 880), ancho `cols(7)`. El espacio negativo es el punto:
  nada más en el lienzo.
- `dos-tercios` (cabecera, fondo blanco): regiones
  `[{x: 112, y: 340, w: cols(8)}, {x: 112 + cols(8) + 32, y: 340, w: cols(4)}]`.
  La asimetría 8+4 es la variedad que hoy no existe.
- `media-lateral` (cabecera con `cabeceraW: cols(5)`, fondo blanco): `fijas`
  pinta `s.imagen` a sangre en `{x: 832, y: 0, w: 1088, h: 1080, fit: 'cover'}`
  — 57 % del lienzo, dentro del rango 45–75 % que exige este plan — y una
  región de texto en `{x: 112, y: 340, w: cols(5)}`.

Layouts rediseñados:

- `section`: el tag se pinta como número gigante en `numero` (200 px) y
  `brandYellow` en (112, 300); el título en `h1` blanco en (112, 560), ancho
  `cols(10)`.
- `cover`: filete `brandYellow` de 8 px y 160 de ancho en (112, 540); título
  `display` en y=580; subtítulo `bodyL` en y=860; fecha `caption` en y=950.
  Verificar que con título a dos líneas nada pase de y=1080 − 96.

> **Ejecutado el 20 de agosto de 2026 (Sonnet 5):** las tareas 1–3 quedaron
> implementadas. Una corrección respecto al borrador original de esta fase:
> la fecha del `cover` se movió de y=980 a y=950 — a y=980 su altura (≈30 px)
> pasaba el margen inferior (1080 − 96 = 984) con un título de fecha de dos
> líneas; con y=950 queda dentro incluso si el subtítulo ocupa dos líneas.
> `section` usa `numero` en (112, 300) y `h1` en (112, 560), ancho `cols(10)`
> en ambos — más simple que darle un ancho propio al número, y nunca se sale
> del lienzo por margen de sobra. `componer()` gana soporte para
> `def.cabeceraW` (ancho de columna de la cabecera) y `def.fijas(s, ctx)`
> (cajas que no dependen de la región de texto, como la imagen a sangre de
> `media-lateral`). `media-lateral` se agregó a `SIN_CHROME`: el isotipo y el
> folio de página se verían mal sobre una fotografía sin overlay de
> oscurecimiento, el mismo motivo por el que `imagen` ya estaba en ese
> conjunto.

**Tarea 4 — Cablear formulario, barra y plantilla**

- `src/ui/campos.js` → `CAMPOS_SLIDE`: `afirmacion` (tag, titulo, body),
  `dos-tercios` = alias de `contenido`, `media-lateral` = cabecera + campo
  `imagen`.
- `src/ui/md.js` → `ESQUELETOS`: un esqueleto por layout nuevo, con contenido
  de ejemplo real (no lorem).
- `decks/plantilla.md`: añadir slides que ejerciten `afirmacion`,
  `dos-tercios`, `media-lateral` y el `kpi-hero` (stats de un solo item),
  manteniendo 0 avisos. El test exige que la plantilla use **todos** los
  layouts y componentes: fallará hasta que esto esté hecho.
- `test.js`: actualizar los conteos de slides (aparece dos veces: parser y
  árbol de Figma) y cualquier aserción de composición afectada. No relajar la
  comprobación de que ninguna caja se sale del canvas.
- Documentación: actualizar las tablas de layouts en `design.md`,
  `docs/01-formato-deck.md` y `docs/02-design-system-slides.md`, y marcar esta
  fase en `docs/04-roadmap.md`.

### Puerta de salida de la Fase A

- `node test.js` verde; plantilla con 0 avisos; ninguna caja fuera del canvas.
- `tarjetas` y `tabla` no emiten ningún `rect` de relleno — solo filetes de
  hasta 4 px.
- Un `stats` de un item pinta su valor a 240 px.
- La plantilla, vista como tira de miniaturas en la aplicación, cumple: no hay
  dos slides adyacentes con la misma silueta; al menos una slide tiene un medio
  ocupando ≥45 % del lienzo; al menos una slide es tipografía dominante con
  espacio negativo (`afirmacion`).
- Revisión visual humana de las miniaturas contra los fallos críticos de este
  plan antes de dar la fase por cerrada.

## Principios no negociables

1. **Una slide, una idea dominante.** El título declara el punto y la
   composición lo demuestra.
2. **Un solo design system, varios registros.** Sherpa controla marca, color,
   tipografía, grid y accesibilidad; la dirección de arte cambia según el trabajo.
3. **La IA no posiciona cajas.** Elige familia, variante, densidad y tratamiento
   visual dentro de opciones aprobadas.
4. **Medios de primera clase.** Imágenes, screenshots, mockups, tablas y gráficas
   reciben espacio desde la composición; no se agregan como decoración.
5. **Variedad por composición, no por color.** Escala, asimetría, recorte,
   contraste, ritmo y superficie crean diversidad.
6. **Menos contenido antes que menos legibilidad.** Se acorta el texto o se
   cambia de composición antes de reducir tipografía.
7. **El deck también se diseña.** Una buena colección de slides puede formar un
   mal deck; se evalúan ritmo, contraste y secuencia.
8. **Lo genérico se rechaza.** Que una slide quepa y use tokens correctos no la
   convierte en una slide aprobada.

## Definición comprobable de «premium»

Una slide aprobada debe:

- comunicar su idea principal en tres segundos;
- conservar una silueta reconocible al verla como miniatura;
- tener un foco visual inequívoco;
- funcionar sin depender de una paleta llamativa;
- usar espacio negativo de forma intencional;
- mostrar imágenes, producto o evidencia con tamaño suficiente;
- mantener jerarquía y legibilidad a distancia;
- pertenecer visualmente al deck sin repetir mecánicamente su composición;
- poder exportarse sin perder la intención visual.

### Fallos críticos

Una slide se rechaza, aunque su puntuación total sea alta, si presenta alguno de
estos fallos:

- overflow, clipping, solapamiento o texto inesperadamente partido;
- screenshot, tabla o gráfica ilegible;
- título descriptivo que no comunica una conclusión cuando existe evidencia;
- imagen decorativa que no aporta contexto ni significado;
- cuadrícula de tarjetas repetidas sin una razón narrativa;
- icono + título + párrafo repetido como recurso dominante;
- exceso de cajas, pills, bordes, gradientes o estética de dashboard;
- contraste insuficiente o uso del color como única señal;
- contenido inventado, dato sin unidad o gráfica sin fuente cuando aplica;
- tres slides consecutivas con la misma silueta.

### Score visual

| Dimensión | Peso |
|---|---:|
| Composición y jerarquía | 25% |
| Claridad narrativa y takeaway | 20% |
| Tipografía y legibilidad | 15% |
| Calidad de imágenes, screenshots y mockups | 15% |
| Claridad de datos, tablas y gráficas | 15% |
| Ritmo y consistencia del deck | 10% |

Una slide pasa con al menos `85/100` y ningún fallo crítico. Un deck pasa con
promedio mínimo de `88/100`, sin slides rechazadas y con revisión satisfactoria
de su contact sheet.

Estos umbrales se calibran durante el piloto comparando la evaluación automática
con revisión humana. No se convierten en una falsa medida objetiva: sirven para
rechazar resultados débiles de manera consistente.

## Arquitectura visual objetivo

### Capa 1 — Fundaciones Sherpa

Permanecen fijas:

- tipografías y escala;
- colores semánticos;
- retícula y espaciado;
- logos y reglas de marca;
- contraste y accesibilidad;
- geometría compatible con todos los exportadores.

### Capa 2 — Registros editoriales

| Registro | Trabajo principal | Señales visuales |
|---|---|---|
| Ejecutivo editorial | Junta, estrategia, decisión, pitch | Autoridad tranquila, tipografía dominante, espacio negativo, evidencia selectiva |
| Product-led | Producto, funciones, demostración, lanzamiento | Screenshot o mockup dominante, detalle ampliado, anotaciones mínimas |
| Data-led | Resultados, KPIs, análisis, recomendaciones | Titular conclusivo, dato protagonista, gráfica o tabla como prueba |

No son temas distintos. Son tres formas de hablar con el mismo lenguaje Sherpa.

### Capa 3 — Familias semánticas

Una familia se define por su trabajo narrativo, no por su geometría. El primer
catálogo cubrirá:

- `executive-summary`;
- `kpi-hero`;
- `finding-evidence`;
- `product-hero`;
- `feature-detail`;
- `business-table`;
- `timeline`;
- `roadmap`.

Cada familia empieza con dos variantes realmente distintas. Solo se crea una
variante adicional cuando un deck real revele un hueco.

### Capa 4 — Tratamientos visuales

Las familias combinan tratamientos aprobados, no componentes decorativos
arbitrarios:

- imagen full-bleed con zona de texto prevista;
- recorte editorial vertical u horizontal;
- screenshot sin marco;
- navegador sobrio;
- desktop flotante;
- uno o dos teléfonos;
- detalle ampliado con dos a cuatro callouts;
- antes/después;
- secuencia de pantallas;
- producto en contexto;
- gráfica editorial anotada;
- tabla protagonista.

En una slide visual, el medio principal debe ocupar normalmente entre 45% y 75%
del lienzo. Las excepciones se documentan en la composición.

### Capa 5 — Dirección de arte del deck

El deck mantiene un registro dominante y controla:

- alternancia entre impacto, explicación, evidencia y pausa;
- variedad de siluetas adyacentes;
- frecuencia de superficies claras y oscuras;
- distribución de slides densas y respiradas;
- momentos de protagonismo para producto, datos e imágenes;
- apertura, transiciones y cierre orientado a una decisión o consecuencia.

## Contrato para la IA

La IA recibe contenido y devuelve decisiones semánticas. No produce CSS,
coordenadas ni HTML libre.

```yaml
macrotheme: sherpa-business
register: product-led
intent: feature-detail
variant: screenshot-right
density: low
surface: light

message:
  takeaway: Las transferencias se completan en tres pasos

visual:
  kind: screenshot
  treatment: browser-frameless
  source: transferencias.png
  focus: confirmation-panel

support:
  kind: callouts
  count: 3
```

Cada composición declara también:

- contenido requerido y opcional;
- límites de palabras, métricas, series, filas y columnas;
- proporción reservada para el medio;
- condiciones `use_when` y `avoid_when`;
- densidades aceptadas;
- variantes compatibles;
- fallos que obligan a elegir otra composición;
- ejemplo aprobado y contraejemplo.

## Pipeline de generación

### 1. Entender el trabajo de comunicación

Definir antes de diseñar:

- audiencia;
- propósito: informar, persuadir, vender, recomendar o habilitar una decisión;
- resultado esperado en la audiencia;
- conclusión central;
- evidencia necesaria;
- restricciones de marca, fuentes y assets.

La salida es una frase de control:

> Al terminar, [audiencia] debe [resultado] porque [conclusión central].

### 2. Construir la narrativa

Elegir un arco coherente con el trabajo, por ejemplo:

- contexto → tensión → evidencia → implicación → acción;
- pregunta → análisis → respuesta;
- problema → causas → opciones → recomendación;
- estado actual → cambio → estado futuro.

Cada slide recibe un único trabajo narrativo y un takeaway. Una agenda no
sustituye este paso.

### 3. Clasificar la intención de cada slide

La IA asigna `intent`, registro, densidad, tipo de evidencia y necesidad de
medio. Si una slide intenta cumplir dos trabajos incompatibles, se divide antes
de componerla.

### 4. Recuperar candidatos compatibles

El sistema filtra el catálogo por reglas duras:

- capacidad de texto y datos;
- tipo y proporción del medio;
- registro del deck;
- relación de aspecto del asset;
- densidad;
- posición dentro de la narrativa.

Al inicio basta metadata determinista. No se necesita RAG, entrenamiento ni
fine-tuning para seleccionar entre 16 composiciones.

### 5. Puntuar y elegir

De dos o tres candidatos compatibles se elige el que mejor resuelva:

- claridad del takeaway;
- protagonismo de la evidencia;
- ajuste del contenido sin compresión;
- diferencia respecto a slides vecinas;
- coherencia con el registro del deck.

### 6. Renderizar

El compositor convierte la especificación en el IR de cajas existente. Los
exportadores continúan dibujando el mismo resultado; no reinterpretan el diseño.

### 7. Criticar la slide

Se combinan dos controles:

- validaciones deterministas: overflow, tamaños mínimos, contraste, capacidad,
  fuentes, unidades y assets faltantes;
- evaluación visual: jerarquía, legibilidad, recorte, balance, genericidad y
  parecido con el ejemplo aprobado.

Una slide fallida cambia de variante o reduce contenido. El sistema realiza un
máximo de dos recomposiciones antes de pedir revisión; no entra en ciclos
indefinidos.

### 8. Criticar el deck

La revisión en contact sheet comprueba:

- repetición de siluetas;
- ritmo de densidad;
- balance de superficies;
- consistencia de imagen y mockups;
- continuidad narrativa;
- apertura y cierre;
- ausencia de una slide claramente inferior al resto.

## Fases de ejecución

Cada fase termina en algo que se puede revisar visualmente. No se avanza por
cantidad de código.

### Fase 0 — Fijar la barra visual

**Entregables**

- constitución visual y anti-patrones;
- score visual y fallos críticos;
- tres briefs business para los decks patrón;
- formato único para comparar referencias y resultados.

**Puerta de salida**

Dos revisores pueden mirar una slide y llegar a una decisión de aprobación
similar usando los mismos criterios.

### Fase 1 — Curar el corpus

**Entregables**

- 100 referencias clasificadas según el plan de corpus;
- contact sheets por intención, no por repositorio;
- metadata, fuente y licencia por referencia;
- selección de 20–30 composiciones maestras;
- registro explícito de referencias rechazadas y motivo.

**Puerta de salida**

Las seleccionadas se ven business, sobrias y distintas incluso al neutralizar
colores y marcas. Ninguna depende de tarjetas genéricas o decoración de moda.

### Fase 2 — Definir el macrotema Sherpa Business

**Entregables**

- reglas de los tres registros editoriales;
- escala de superficies, densidad, imágenes y datos;
- tratamientos aprobados de fotografía, screenshot y mockup;
- reglas de ritmo para decks completos;
- ejemplos y contraejemplos reinterpretados con Sherpa.

**Puerta de salida**

Una misma historia se puede mostrar en los tres registros y sigue siendo
inequívocamente Sherpa, sin que las tres versiones parezcan la misma plantilla.

### Fase 3 — Construir las primeras 16 composiciones

**Entregables**

- ocho familias semánticas;
- dos variantes por familia;
- contrato de contenido y selección por composición;
- preview aprobada y contraejemplo por variante;
- cobertura de imágenes, producto, tablas, gráficas, procesos y roadmaps.

**Puerta de salida**

Las 16 composiciones alcanzan `85/100` con contenido business real y ninguna
necesita ajustes manuales de geometría para verse terminada.

### Fase 4 — Completar capacidades visuales mínimas

Se implementa solo lo que las 16 composiciones necesitan:

- recorte `cover` y `contain` con foco configurable;
- screenshot sin marco y marco de navegador;
- mockup de teléfono o desktop;
- callouts numerados;
- tabla estructurada;
- cinco familias de gráficas de uso frecuente;
- anotaciones, fuentes, unidades y leyendas;
- ampliación de detalle para pantallas densas.

**Puerta de salida**

Ninguna composición usa placeholders grises, imágenes decorativas ni
dashboards encogidos. Los medios siguen siendo legibles en el export final.

### Fase 5 — Construir los decks patrón

**Entregables**

1. Pitch ejecutivo de 12–15 slides.
2. Reporte trimestral de resultados de 12–15 slides.
3. Lanzamiento y recorrido de producto de 12–15 slides.

En conjunto deben cubrir portada, resumen, KPI, hallazgo, gráfica, tabla,
producto, mockup, proceso, timeline, roadmap, recomendación y cierre.

**Puerta de salida**

Los tres decks superan el score, se ven coherentes como contact sheet y podrían
presentarse sin rediseño. Si no lo logran, se corrige el sistema antes de agregar
más familias.

### Fase 6 — Implementar el planificador y selector de IA

**Entregables**

- brief → trabajo de comunicación;
- contenido → narrativa y takeaways;
- slide → intención y necesidades visuales;
- filtrado y puntuación de composiciones;
- salida estructurada validable;
- explicación interna de por qué se eligió cada composición;
- fallback seguro cuando el contenido no cabe.

**Puerta de salida**

Con los briefs de los decks patrón, la IA elige una composición aprobada en al
menos 90% de los casos y nunca inventa geometría o campos no soportados.

### Fase 7 — Añadir crítica visual y recomposición

**Entregables**

- validación determinista por slide;
- captura automática de todas las slides;
- score visual por slide;
- contact sheet y evaluación de ritmo;
- recomposición limitada de resultados fallidos;
- reporte breve de fallos que requieren intervención.

**Puerta de salida**

El pipeline rechaza deliberadamente decks con los anti-patrones definidos y no
aprueba resultados por el simple hecho de estar on-brand o no tener overflow.

### Fase 8 — Integrar el flujo completo en la aplicación

**Entregables**

- entrada de brief, contenido, datos y assets;
- generación de outline antes del deck;
- preview progresiva;
- cambio de variante y tratamiento desde el editor;
- reemplazo y recorte de imágenes;
- edición de datos, tablas y takeaways;
- regeneración por slide sin alterar las aprobadas;
- persistencia en el formato fuente existente;
- exportación HTML, PDF, Figma y PPTX según el roadmap técnico.

La edición sigue siendo semántica: contenido, intención, variante y asset. No se
habilita arrastre libre de geometría.

**Puerta de salida**

Un usuario puede pasar de brief a deck exportado sin editar archivos a mano y
sin perder decisiones al reabrirlo.

### Fase 9 — Validar con trabajo real y ampliar

**Entregables**

- piloto de 20 decks business reales;
- puntuación humana y automática;
- registro de slides reemplazadas manualmente;
- matriz de huecos por intención;
- nuevas variantes solo para huecos repetidos;
- guía de gobierno del catálogo.

**Puerta de salida**

Al menos 80% de los decks del piloto se pueden presentar sin rediseño manual; el
20% restante produce huecos concretos que pueden resolverse con una composición
o capacidad identificable, no con «más creatividad».

## Decks patrón y pruebas obligatorias

| Deck | Trabajo | Cobertura crítica |
|---|---|---|
| Pitch ejecutivo | Persuadir y obtener una decisión | problema, evidencia, solución, mercado, tracción, solicitud |
| Resultados trimestrales | Explicar desempeño y recomendar acciones | KPIs, tendencia, drivers, tabla, riesgo, recomendación |
| Lanzamiento de producto | Demostrar valor y funcionamiento | producto hero, funcionalidades, pantallas, proceso, roadmap |

Cada deck se revisa de cuatro formas:

1. **Prueba de tres segundos:** se entiende el punto dominante.
2. **Prueba de miniatura:** la silueta funciona y el ritmo es visible.
3. **Prueba de sala:** texto, tablas y screenshots siguen siendo legibles.
4. **Prueba de exportación:** HTML, PDF y Figma conservan jerarquía. PPTX se
   incorpora a esta prueba solo cuando exista su exportador; no bloquea
   ninguna puerta (decisión de prioridades de la Fase A).

## Gobierno del catálogo

Una composición nueva entra únicamente si:

- resuelve un trabajo que las existentes no pueden cubrir;
- aparece como necesidad en un deck real;
- declara límites y reglas de selección;
- incluye ejemplo y contraejemplo;
- supera la puerta visual;
- funciona en los destinos soportados.

Una composición se elimina o fusiona si rara vez es elegida, se confunde con
otra o produce correcciones manuales frecuentes.

La calidad del sistema depende más de rechazar opciones mediocres que de acumular
variantes.

## Métricas de producto

| Métrica | Objetivo inicial |
|---|---:|
| Slides sin fallo crítico | 100% |
| Selección correcta de composición en benchmark | ≥ 90% |
| Slides aprobadas sin recomposición | ≥ 80% |
| Decks del piloto presentables sin rediseño | ≥ 80% |
| Promedio visual del deck | ≥ 88/100 |
| Slides consecutivas con la misma silueta | máximo 2 |
| Recomposiciones automáticas por slide | máximo 2 |

También se mide el porcentaje de slides que un humano reemplaza manualmente y
la razón. Esa señal decide dónde ampliar el sistema.

## Qué no se construye al inicio

- Un marketplace de temas.
- Decenas de layouts antes de validar los primeros 16.
- Posicionamiento libre generado por IA.
- Un crawler general de GitHub.
- Entrenamiento o fine-tuning.
- RAG si el catálogo pequeño se puede filtrar por metadata.
- Animaciones que no sobreviven a los exportadores.
- Mockups decorativos sin propósito narrativo.

## Secuencia crítica

```text
intervención visual del runtime (Fase A)
  → barra visual
  → corpus curado
  → macrotema y registros
  → 16 composiciones
  → capacidades visuales mínimas
  → 3 decks patrón
  → selector de IA
  → crítico visual
  → integración en la aplicación
  → piloto y ampliación
```

No se debe implementar el selector antes de tener composiciones aprobadas, ni
ampliar el catálogo antes de que los decks patrón revelen un hueco. Automatizar
un repertorio visual mediocre solo produciría resultados mediocres más rápido.

## Próximo entregable

El siguiente entregable es la **Fase A ejecutada**: el orden de trabajo de la
sección «Fase A — Intervención visual inmediata del runtime», con su puerta de
salida cumplida. Cualquier agente que retome este plan empieza por ahí.

Después de la Fase A, el entregable vuelve a ser visual, no técnico:

1. contact sheets de las fuentes prioritarias del corpus;
2. selección y puntuación de las primeras 100 referencias;
3. shortlist de 20–30 composiciones maestras;
4. especificación visual de las primeras ocho familias;
5. diseño manual de sus primeras 16 variantes Sherpa.

Solo después se traduce ese repertorio al IR de cajas y se conecta con la IA.
