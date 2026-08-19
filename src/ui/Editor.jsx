import { useRef, useState } from 'react';
import { IconPicker } from './IconPicker.jsx';
import { ListaSlides } from './ListaSlides.jsx';
import {
  agregarSlide, bloques, envolver, frontmatterTexto, inicioSlide, insertar,
  leerFrontmatter, leerOpcion, ponerFrontmatter, ponerFrontmatterTexto,
  ponerOpcion, reemplazarBloque, ESQUELETOS,
} from './md.js';

// Colores de acento: tokens de Sherpa, no un selector RGB libre.
// El sistema de diseño manda sobre el deck.
const COLORES = [
  ['', 'Azul (por defecto)'],
  ['brand-yellow', 'Amarillo de marca'],
  ['success-800', 'Verde'],
  ['error-800', 'Rojo'],
  ['mustard-800', 'Mostaza'],
  ['peach-800', 'Durazno'],
  ['mauve-800', 'Malva'],
  ['bluey-800', 'Azul verdoso'],
  ['carbon-800', 'Gris'],
];

export function Editor({
  md, ir, onChange, avisos, error, actual, onIr,
  onPlantilla, onHTML, onPresentar, onPDF, onMover, onDuplicar, onBorrar,
}) {
  const [exportando, setExportando] = useState(false);
  const [picker, setPicker] = useState(false);
  const [subiendo, setSubiendo] = useState(null);
  const [ajustes, setAjustes] = useState(false);
  const foco = useRef(null);          // textarea enfocado
  const archivo = useRef(null);

  const textos = bloques(md);
  // La barra actúa sobre el slide seleccionado; ya no hay que adivinar dónde
  // está el cursor en un blob de texto: cada slide edita su propio bloque.
  const bloque = textos[actual] ?? '';

  const escribirBloque = (i, texto) => onChange(reemplazarBloque(md, i, texto));

  /** aplica un cambio al bloque activo y recoloca el cursor dentro de su textarea */
  const enBloque = ({ md: nuevo, sel }) => {
    escribirBloque(actual, nuevo);
    requestAnimationFrame(() => {
      const el = foco.current;
      if (!el) return;
      el.focus();
      const [a, b] = Array.isArray(sel) ? sel : [sel, sel];
      el.setSelectionRange(a, b);
    });
  };

  const subir = async e => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setSubiendo('Subiendo…');
    try {
      const r = await fetch(`/__subir?nombre=${encodeURIComponent(f.name)}`, { method: 'POST', body: f });
      if (!r.ok) throw new Error(await r.text());
      const { ruta } = await r.json();
      // el esqueleto de `image` trae el placeholder; se cambia por lo recién subido
      const { md: nuevo } = agregarSlide(md, inicioSlide(md, actual), 'image');
      onChange(nuevo.replace('decks/img/placeholder.svg', ruta));
      setSubiendo(null);
    } catch (err) {
      setSubiendo(`No se pudo subir: ${err.message}`);
      setTimeout(() => setSubiendo(null), 5000);
    }
  };

  const exportar = async () => {
    setExportando(true);
    try { await onHTML(); } finally { setExportando(false); }
  };

  return (
    <aside>
      <header>
        <img src="/base/assets/logo.svg" alt="Banco de Bogotá" />
        <button onClick={onPlantilla}>Plantilla</button>
        <button onClick={exportar} disabled={exportando}>{exportando ? 'Embebiendo…' : 'HTML'}</button>
        <button onClick={onPresentar}>Presentar</button>
        <button className="primary" onClick={onPDF}>PDF</button>
      </header>

      <div className="barra">
        <select value="" onChange={e => e.target.value &&
          onChange(agregarSlide(md, inicioSlide(md, actual), e.target.value).md)}>
          <option value="">+ Slide…</option>
          {Object.keys(ESQUELETOS).map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <button title="Negrita" onClick={() => {
          const el = foco.current;
          if (el) enBloque(envolver(bloque, el.selectionStart, el.selectionEnd));
        }}><b>B</b></button>

        <button title="Insertar icono" onClick={() => setPicker(true)}>Icono</button>

        <button title="Subir imagen" onClick={() => archivo.current.click()}>Imagen</button>
        <input ref={archivo} type="file" accept="image/*" hidden onChange={subir} />

        <select title="Color de acento del slide"
          value={leerOpcion(bloque, 0, 'color')}
          onChange={e => enBloque(ponerOpcion(bloque, 0, 'color', e.target.value))}>
          {COLORES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
        </select>

        <select title="Fuente del cuerpo"
          value={leerFrontmatter(md, 'fuente') || 'roboto'}
          onChange={e => onChange(ponerFrontmatter(md, 'fuente', e.target.value))}>
          <option value="roboto">Cuerpo: Roboto</option>
          <option value="kiffo">Cuerpo: Kiffo</option>
        </select>

        <button className={ajustes ? 'primary' : ''} onClick={() => setAjustes(v => !v)}>Deck…</button>
      </div>

      {ajustes && (
        <div className="ajustes">
          <label>Ajustes del deck</label>
          <textarea spellCheck={false} value={frontmatterTexto(md)}
            onChange={e => onChange(ponerFrontmatterTexto(md, e.target.value))} />
        </div>
      )}

      <div className="lista">
        <ListaSlides
          ir={ir} textos={textos} actual={actual}
          onTexto={escribirBloque}
          onFoco={(i, el) => { foco.current = el; onIr(i); }}
          onIr={onIr} onMover={onMover} onDuplicar={onDuplicar} onBorrar={onBorrar}
        />
      </div>

      {subiendo && <div id="avisos"><b>Imagen</b><div>{subiendo}</div></div>}

      {error
        ? <div id="avisos" className="grave"><b>Error de render</b><div>{error}</div></div>
        : avisos.length > 0 && (
          <div id="avisos">
            <b>{avisos.length} aviso{avisos.length > 1 ? 's' : ''} de estilo</b>
            {avisos.map((a, i) => <div key={i}>· {a}</div>)}
          </div>
        )}

      {picker && (
        <IconPicker
          onCerrar={() => setPicker(false)}
          onElegir={ref => {
            setPicker(false);
            enBloque(insertar(bloque, foco.current?.selectionStart ?? bloque.length, `[${ref}] `));
          }}
        />
      )}
    </aside>
  );
}
