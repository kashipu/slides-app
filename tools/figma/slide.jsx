// Renderiza UNA diapositiva a 1920×1080 exactos, para capturarla y compararla
// contra lo que salió en Figma. Vive en un módulo aparte porque Vite no
// transforma JSX dentro de un <script> inline del HTML.
import { createRoot } from 'react-dom/client';
import { parse } from '/src/core/parse.js';
import { Slide } from '/src/ui/Deck.jsx';

const q = new URLSearchParams(location.search);
// La barra inicial es obligatoria: sin ella Vite resuelve la ruta relativa a
// /tools/figma/ y devuelve index.html por el fallback de SPA — el parser
// entonces renderiza el código fuente como si fuera el deck, sin fallar.
const deck = q.get('deck') || 'decks/plantilla.md';
const md = await (await fetch(deck.startsWith('/') ? deck : `/${deck}`)).text();
const ir = parse(md);
const i = Math.min(Number(q.get('n') || 0), ir.slides.length - 1);
createRoot(document.getElementById('s')).render(<Slide slide={ir.slides[i]} ir={ir} />);
