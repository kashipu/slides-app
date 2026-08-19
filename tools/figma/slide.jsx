// Renderiza UNA diapositiva a 1920×1080 exactos, para capturarla y compararla
// contra lo que salió en Figma. Vive en un módulo aparte porque Vite no
// transforma JSX dentro de un <script> inline del HTML.
import { createRoot } from 'react-dom/client';
import { parse } from '/src/core/parse.js';
import { Slide } from '/src/ui/Deck.jsx';

const q = new URLSearchParams(location.search);
const md = await (await fetch(q.get('deck') || '/decks/plantilla.md')).text();
const ir = parse(md);
const i = Math.min(Number(q.get('n') || 0), ir.slides.length - 1);
createRoot(document.getElementById('s')).render(<Slide slide={ir.slides[i]} ir={ir} />);
