# Índice y mapa de documentación

Este es el punto de entrada para entender, ejecutar y mantener `slides-app`.
Su función es indicar qué documento responde cada pregunta, cómo se relacionan
entre sí y en qué orden deben usarse.

No duplica especificaciones. Cada regla debe vivir en un solo documento y los
demás deben enlazarla.

## Punto de partida

Para entender el proyecto en orden:

1. [06-plan-producto-premium.md](06-plan-producto-premium.md) — visión completa,
   estándar premium, pipeline de IA, fases y puertas de calidad.
2. [05-corpus-visual-business.md](05-corpus-visual-business.md) — referencias,
   taxonomía y método de curaduría visual.
3. [../design.md](../design.md) — sistema de diseño Sherpa que limita todas las
   decisiones visuales.
4. [README.md](README.md) — arquitectura actual, decisiones técnicas y forma de
   ejecutar la aplicación.
5. [04-roadmap.md](04-roadmap.md) — estado real de implementación y trabajo
   pendiente.

## Mapa de autoridad

| Pregunta | Fuente de verdad |
|---|---|
| ¿Cuál es la visión del producto y cuándo estará terminado? | [06-plan-producto-premium.md](06-plan-producto-premium.md) |
| ¿Qué significa visualmente «premium»? | [06-plan-producto-premium.md](06-plan-producto-premium.md), sección «Definición comprobable» |
| ¿Qué referencias aceptamos y cómo las clasificamos? | [05-corpus-visual-business.md](05-corpus-visual-business.md) |
| ¿Cuáles son los tokens, tipografías, colores y reglas Sherpa? | [../design.md](../design.md) |
| ¿Cómo se adapta Sherpa al canvas de una presentación? | [02-design-system-slides.md](02-design-system-slides.md) |
| ¿Cómo se representa y escribe un deck? | [01-formato-deck.md](01-formato-deck.md) |
| ¿Cómo funciona hoy la aplicación? | [README.md](README.md) y el código |
| ¿Qué está construido y qué sigue técnicamente? | [04-roadmap.md](04-roadmap.md) |
| ¿Cómo se exporta a HTML, PDF, Figma y PPTX? | [03-exportadores.md](03-exportadores.md) |
| ¿Cómo debe elegir composiciones la IA? | [06-plan-producto-premium.md](06-plan-producto-premium.md), sección «Contrato para la IA» |
| ¿Cómo se aprueba o rechaza una slide? | [06-plan-producto-premium.md](06-plan-producto-premium.md), secciones «Score visual» y «Pipeline» |

El código y sus pruebas son la fuente de verdad del comportamiento actualmente
implementado. Los documentos describen intención, reglas y estado; si difieren
del runtime, se corrige el documento de estado o se abre trabajo para alinear el
código.

## Documentos actuales

| Documento | Rol | Cambia cuando |
|---|---|---|
| [../design.md](../design.md) | Contrato completo del sistema de diseño | Cambian tokens, marca, accesibilidad, layouts o componentes oficiales |
| [README.md](README.md) | Arquitectura y operación del repositorio | Cambia el pipeline técnico, stack, comandos o estructura de archivos |
| [01-formato-deck.md](01-formato-deck.md) | Formato de autoría y Deck IR | Cambian campos, sintaxis, layouts, componentes o lint |
| [02-design-system-slides.md](02-design-system-slides.md) | Aplicación de Sherpa a presentaciones | Cambian canvas, grid, tipografía, assets o comportamiento entre destinos |
| [03-exportadores.md](03-exportadores.md) | Contratos de exportación | Cambia HTML, PDF, Figma, PPTX o su paridad visual |
| [04-roadmap.md](04-roadmap.md) | Estado de implementación | Se inicia, completa, descarta o bloquea trabajo técnico |
| [05-corpus-visual-business.md](05-corpus-visual-business.md) | Investigación y corpus visual | Entran o salen fuentes, referencias, categorías o criterios de admisión |
| [corpus/00-avance.md](corpus/00-avance.md) | Estado real de la curaduría — qué se revisó, aceptó y rechazó | Se revisa una fuente nueva |
| [06-plan-producto-premium.md](06-plan-producto-premium.md) | Plan rector de producto y calidad | Cambian alcance, fases, métricas, puertas o arquitectura visual objetivo |
| Este documento | Orquestación | Se crea, divide, renombra o cambia de responsabilidad un documento |

## Dependencias

```text
06 Plan rector
├── 05 Corpus visual
│   └── referencias aprobadas
│       └── composiciones Sherpa
├── design.md + 02 Design system de slides
│   └── macrotema y registros editoriales
├── 01 Formato del deck
│   └── contrato estructurado para la IA
├── 03 Exportadores
│   └── paridad HTML / PDF / Figma / PPTX
└── 04 Roadmap
    └── implementación, validación y entrega
```

El corpus inspira la composición, pero no puede cambiar la marca. El design
system limita la representación, pero no decide la narrativa. La IA selecciona
opciones, pero no crea geometría libre. Los exportadores dibujan el IR; no
reinterpretan el diseño.

## Ruta de ejecución

| Orden | Resultado | Documentos que gobiernan |
|---:|---|---|
| 1 | Barra visual, score y anti-patrones | [06](06-plan-producto-premium.md) |
| 2 | 100 referencias y shortlist de 20–30 | [05](05-corpus-visual-business.md) |
| 3 | Macrotema Sherpa y tres registros | [../design.md](../design.md), [02](02-design-system-slides.md), [06](06-plan-producto-premium.md) |
| 4 | Ocho familias y 16 composiciones aprobadas | [05](05-corpus-visual-business.md), [06](06-plan-producto-premium.md) |
| 5 | Imágenes, mockups, tablas y gráficas necesarias | [02](02-design-system-slides.md), [04](04-roadmap.md), [06](06-plan-producto-premium.md) |
| 6 | Tres decks patrón | [06](06-plan-producto-premium.md) |
| 7 | Planificador y selector de IA | [01](01-formato-deck.md), [06](06-plan-producto-premium.md) |
| 8 | Crítica visual y recomposición | [06](06-plan-producto-premium.md) |
| 9 | Integración y exportación completa | [README](README.md), [03](03-exportadores.md), [04](04-roadmap.md) |
| 10 | Piloto de 20 decks y ampliación medida | [05](05-corpus-visual-business.md), [06](06-plan-producto-premium.md) |

## Próximos documentos especializados

Se crearán cuando empiece el trabajo correspondiente; no se crean archivos
vacíos como placeholders.

| Documento previsto | Contenido | Se crea cuando |
|---|---|---|
| `07-constitucion-visual.md` | Reglas de dirección de arte, score detallado, ejemplos y anti-patrones | Comience la selección manual del corpus |
| `08-catalogo-composiciones.md` | Fichas de las familias, variantes, límites, `use_when` y `avoid_when` | Se diseñen las primeras composiciones Sherpa |
| `09-contrato-ia.md` | Esquema de entrada/salida, selección, fallback y ejemplos | Las primeras 16 composiciones estén aprobadas |
| `10-qa-visual.md` | Checks deterministas, crítico visual, contact sheets y umbrales | Existan los primeros decks patrón renderizados |
| `11-decks-patron.md` | Briefs, cobertura, fuentes, resultados y decisiones de los tres benchmarks | Se inicie el primer deck patrón |

Cuando uno de estos documentos exista, se enlaza aquí y se elimina su estado de
«previsto».

## Regla para evitar contradicciones

Al tomar una decisión:

1. Actualizar el documento dueño del tema.
2. Actualizar [04-roadmap.md](04-roadmap.md) si cambia el estado técnico.
3. Actualizar este índice solo si cambia la responsabilidad, dependencia o
   existencia de un documento.
4. Enlazar la regla original desde otros documentos en vez de copiarla.

Ejemplos:

- Un nuevo token se documenta en `design.md`, no en el plan premium.
- Una nueva composición se documenta en el catálogo, no en exportadores.
- Un cambio del esquema de IA se documenta en el contrato de IA y se refleja en
  `01-formato-deck.md` solo si altera el formato persistido.
- Completar PPTX se marca en `04-roadmap.md`; sus detalles técnicos permanecen en
  `03-exportadores.md`.

## Siguiente acción

**Hecho:** la Fase A ([06](06-plan-producto-premium.md)) está implementada en
código — pendiente solo la revisión visual humana. **En curso:** la
curaduría del corpus ([corpus/00-avance.md](corpus/00-avance.md)) — 48 de 100
referencias objetivo, con captura real y metadata, de la primera fuente
prioridad A (`SlideSpeak/slide-design-skill`). Falta la segunda fuente
prioridad A (`beautiful-html-templates`, 6 sistemas) y, sobre todo, cerrar el
hueco de referencias de producto/screenshot/mockup — ninguna fuente revisada
hasta ahora las cubre.

**Nota de secuencia:** el plan rector pone la barra visual formal
(`07-constitucion-visual.md`, Fase 0) antes de curar el corpus (Fase 1). Esta
sesión curó el corpus primero porque así lo pidió quien opera el proyecto; la
curaduría usó el criterio de admisión que ya existía en
[05-corpus-visual-business.md](05-corpus-visual-business.md), no uno nuevo.
`07-constitucion-visual.md` sigue sin crearse — formalizarlo con lo aprendido
en esta curaduría es trabajo pendiente, no bloqueante.
