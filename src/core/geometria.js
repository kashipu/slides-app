// Canvas, retícula y escala tipográfica. Vive aparte de layouts.js porque tanto
// los layouts como los componentes lo necesitan, y si no habría un ciclo.

export const CANVAS = {
  w: 1920, h: 1080,
  mx: 112, my: 96,          // márgenes
  col: 112, gut: 32,        // 12 columnas: 112 + 12*112 + 11*32 + 112 = 1920
  content: 1696,
};

/** ancho de n columnas */
export const cols = n => n * CANVAS.col + (n - 1) * CANVAS.gut;

export const TYPE = {
  displayXL: { size: 160, font: 'display', weight: 500, lh: 1.05 },
  display: { size: 120, font: 'display', weight: 500, lh: 1.1 },
  h1:      { size: 88,  font: 'display', weight: 500, lh: 1.15 },
  h2:      { size: 64,  font: 'display', weight: 500, lh: 1.2 },
  h3:      { size: 40,  font: 'display', weight: 500, lh: 1.25 },
  statHero: { size: 240, font: 'display', weight: 600, lh: 1.0 },
  stat:    { size: 96,  font: 'display', weight: 600, lh: 1.1 },
  numero:  { size: 200, font: 'display', weight: 300, lh: 1.0 },
  quote:   { size: 64,  font: 'display', weight: 300, lh: 1.3 },
  bodyL:   { size: 32,  font: 'body',    weight: 400, lh: 1.5 },
  body:    { size: 28,  font: 'body',    weight: 400, lh: 1.5 },
  tag:     { size: 24,  font: 'body',    weight: 600, lh: 1.3, tracking: 1.6 },
  caption: { size: 20,  font: 'body',    weight: 400, lh: 1.5 },
  footer:  { size: 16,  font: 'body',    weight: 400, lh: 1.5 },
};

// ponytail: estimación de alto por ancho medio de carácter, no métricas reales.
// Alcanza con regiones holgadas + el lint de longitud. Si algo se desborda, el
// upgrade es medir con canvas measureText en la preview y cachear.
// Calibrado midiendo Kiffo BDB 120px y Roboto 32px renderizados a 1920 (0.41 y
// 0.48 reales); se deja margen al alza porque quedarse corto solapa cajas y
// pasarse solo reserva aire. Esta es la perilla: si un título se parte de más,
// bájalos. El Roboto de Figma es 2-6% más ancho y también entra en ese margen.
const AVG = { display: 0.45, body: 0.50 };
export const alto = (texto, { size, font, lh }, w) =>
  Math.max(1, Math.ceil((texto.length * size * AVG[font]) / w)) * size * lh;
