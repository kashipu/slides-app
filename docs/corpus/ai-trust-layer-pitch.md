# Referencia: ai-trust-layer-pitch — mayormente RECHAZADA

```yaml
source:
  repository: SlideSpeak/slide-design-skill
  license: MIT
  path: examples/ai-trust-layer-pitch.html
  fetched: 2026-08-20
register_general: pitch deck SaaS genérico — fondo con gradiente morado/azul y
  blobs difuminados, tarjetas translúcidas tipo glassmorphism, iconos en
  círculo, texto blanco sobre degradado.
```

**Veredicto general: rechazar 8 de 10 slides.** Esta fuente es el ejemplo más
claro del corpus de lo que `docs/05-corpus-visual-business.md` pide excluir
explícitamente: *"gradientes, blobs, glassmorphism o pills decorativos"* y
*"tres o cuatro tarjetas idénticas"*. Se documenta completa — con motivo por
slide — porque el registro de rechazos es tan parte del entregable de esta
fase como las referencias aceptadas ("registro explícito de referencias
rechazadas y motivo").

| # | `data-slide-type` | Verdicto | Motivo del rechazo |
|---|---|---|---|
| 01 | cover | **Rechazar** | Gradiente de fondo con blobs — Sherpa no usa gradientes de fondo (`design.md`, "Don't") |
| 02 | thesis | **Rechazar** | Mismo fondo degradado; la composición (frase + apoyo) es válida pero ya está mejor representada por `balance-sheet-explainer-02` sin la superficie |
| 03 | problem | **Rechazar** | Dos tarjetas translúcidas idénticas con blur — glassmorphism explícito |
| 04 | solution | **Rechazar** | Cuatro tarjetas numeradas con fondo translúcido — "icono + título + párrafo repetido", el anti-patrón nombrado literalmente en el plan rector |
| 05 | product | **Rechazar** | Grid de 4 tarjetas de producto con fondo translúcido — mismo anti-patrón |
| 06 | traction | **Aceptar (parcial)** | Cifra "9.4x" dominante — 8ª validación de `kpi-hero` — pero el fondo con gradiente y el bar chart con glow se rechazan; solo se conserva la composición cifra+gráfica-de-apoyo |
| 07 | market | **Rechazar** | Composición de círculos concéntricos con cifras (TAM/SAM/SOM) — exactamente el anti-patrón que `docs/05` nombra: *"Gráfica, no tres círculos por defecto"* para `market-opportunity` |
| 08 | roadmap | **Rechazar** | 4 tarjetas translúcidas por trimestre — mismo anti-patrón de tarjeta repetida |
| 09 | team | **Rechazar** | 3 tarjetas de persona con fondo translúcido — tarjeta repetida |
| 10 | ask | **Aceptar (parcial)** | Cifra "$6M" dominante con frase de ask — 9ª validación de `kpi-hero`; se rechaza el fondo degradado |

## 06 y 10 · lo único que se conserva

```yaml
id: ai-trust-layer-pitch-06-10
intent: kpi-hero / decision-ask
register: rechazado como superficie; válido solo como composición
composition:
  focal_point: cifra dominante (9.4x, $6M) en color de acento, sin serif —
    aquí en sans-serif geométrico, que también es una variante Sherpa válida
    (Kiffo BDB SemiBold ya cumple ese rol)
  distinctive_device: nada — es la composición más simple del corpus (cifra +
    una línea de contexto), y aun así es la única parte de esta fuente que se
    salva
fit: { sherpa: alto (solo la composición), business: bajo (la superficie descarta la fuente) }
```

**Lectura del rechazo:** de 10 slides, las únicas 2 que sobreviven son
precisamente las que **no dependen de tarjetas ni de decoración** — son una
cifra grande y nada más. Es la prueba más directa de todo este corpus de que
la Fase A tomó la decisión correcta al eliminar los fondos de `tarjetas` y
`stats`: en esta fuente, el patrón de tarjeta con fondo es exactamente lo que
convierte 8 de 10 slides en material rechazable.
