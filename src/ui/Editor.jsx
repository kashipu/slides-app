import { useState } from 'react';
import { IconPicker } from './IconPicker.jsx';
import { ListaSlides } from './ListaSlides.jsx';
import { SlideForm } from './SlideForm.jsx';
import {
  agregarSlide, bloques, frontmatterTexto, inicioSlide, leerFrontmatter,
  ponerFrontmatter, ponerFrontmatterTexto, reemplazarBloque, ESQUELETOS,
} from './md.js';

export function Editor({
  md, ir, onChange, avisos, error, actual, onIr,
  onPlantilla, onHTML, onPresentar, onPDF, onMover, onDuplicar, onBorrar,
}) {
  const [exportando, setExportando] = useState(false);
  const [ajustes, setAjustes] = useState(false);
  const [verMarkdown, setVerMarkdown] = useState(false);
  // El picker devuelve la referencia a quien lo abrió; así sirve para cualquier
  // item sin que el modal tenga que saber qué se está editando.
  const [picker, setPicker] = useState(null);

  const textos = bloques(md);
  const bloque = textos[actual] ?? '';

  const subirImagen = async f => {
    const r = await fetch(`/__subir?nombre=${encodeURIComponent(f.name)}`, { method: 'POST', body: f });
    if (!r.ok) throw new Error(await r.text());
    return (await r.json()).ruta;
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
          <option value="">+ Diapositiva…</option>
          {Object.keys(ESQUELETOS).map(l => <option key={l} value={l}>{l}</option>)}
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

      <div className="edicion">
        <div className="tira">
          <ListaSlides ir={ir} actual={actual} onIr={onIr}
            onMover={onMover} onDuplicar={onDuplicar} onBorrar={onBorrar} />
        </div>
        <SlideForm
          bloque={bloque} indice={actual} total={ir.slides.length}
          onBloque={txt => onChange(reemplazarBloque(md, actual, txt))}
          onPicker={cb => setPicker(() => cb)}
          onImagen={subirImagen}
          verMarkdown={verMarkdown}
          onMarkdown={() => setVerMarkdown(v => !v)}
        />
      </div>

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
          onCerrar={() => setPicker(null)}
          onElegir={ref => { picker(ref); setPicker(null); }}
        />
      )}
    </aside>
  );
}
