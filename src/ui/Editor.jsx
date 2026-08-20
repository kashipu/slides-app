import { useState } from 'react';
import { IconPicker } from './IconPicker.jsx';
import { ListaSlides } from './ListaSlides.jsx';
import { SlideForm } from './SlideForm.jsx';
import {
  agregarSlide, bloques, frontmatterTexto, inicioSlide, leerFrontmatter,
  ponerFrontmatter, ponerFrontmatterTexto, reemplazarBloque, ESQUELETOS,
} from './md.js';
import { LAYOUTS_UI } from './campos.js';
import { COMPONENTES, TIPOS } from '../core/componentes.js';

/**
 * Qué hay disponible. Se lee de los mismos catálogos que usa el compositor,
 * así que no puede quedar desactualizado respecto a lo que se puede insertar.
 */
function Catalogo() {
  return (
    <div className="catalogo">
      <p>Vista de referencia: se mira, no se edita. Cada diapositiva de la derecha
        muestra un layout o un componente en uso.</p>

      <label>{LAYOUTS_UI.length} layouts</label>
      <ul>
        {LAYOUTS_UI.map(l => (
          <li key={l.k}>
            <b>{l.label}</b> <code>{l.k}</code>
            <span>{l.especial
              ? 'Especial: campos fijos, no admite componentes'
              : `${l.regiones} ${l.regiones > 1 ? 'regiones' : 'región'} para componentes`}</span>
          </li>
        ))}
      </ul>

      <label>{TIPOS.length} componentes</label>
      <ul>
        {TIPOS.map(t => (
          <li key={t}>
            <b>{COMPONENTES[t].label}</b> <code>{t}</code>
            <span>{COMPONENTES[t].ayuda}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Editor({
  md, ir, onChange, avisos, error, actual, onIr,
  onPlantilla, onHTML, onPresentar, onPDF, onMover, onDuplicar, onBorrar,
  nombre, nombres, onAbrir, onCrear, onBorrarDeck, onImportar, verPlantilla,
  delProyecto, onAbrirDelProyecto,
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

  // ponytail: <input type="file"> nativo. Un deck es un .md suelto; no hace
  // falta listar el servidor ni un endpoint para abrirlo.
  const importar = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,text/markdown';
    input.onchange = async () => {
      const f = input.files?.[0];
      if (f) onImportar(f.name.replace(/\.md$/i, ''), await f.text());
    };
    input.click();
  };

  return (
    <aside>
      <header>
        <img src="/base/assets/logo.svg" alt="Banco de Bogotá" />
        <button className={verPlantilla ? 'primary' : ''} onClick={onPlantilla}>Plantilla</button>
        <button onClick={exportar} disabled={exportando}>{exportando ? 'Embebiendo…' : 'HTML'}</button>
        <button onClick={onPresentar}>Presentar</button>
        <button className="primary" onClick={onPDF}>PDF</button>
      </header>

      <div className="barra decks">
        <select value={verPlantilla ? '' : nombre} onChange={e => onAbrir(e.target.value)}>
          {verPlantilla && <option value="">Plantilla (referencia)</option>}
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={onCrear}>+ Nueva</button>
        <select value="" title="Decks que viven en decks/"
          onChange={e => e.target.value && onAbrirDelProyecto(e.target.value)}>
          <option value="">Abrir del proyecto…</option>
          {delProyecto.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={importar} title="Abrir un .md del disco">Importar…</button>
        <button onClick={onBorrarDeck} disabled={verPlantilla || nombres.length <= 1}
          title="Borrar esta presentación">✕</button>
      </div>

      {verPlantilla && <Catalogo />}

      <div className="barra" style={verPlantilla ? { display: 'none' } : undefined}>
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

      {ajustes && !verPlantilla && (
        <div className="ajustes">
          <label>Ajustes del deck</label>
          <textarea spellCheck={false} value={frontmatterTexto(md)}
            onChange={e => onChange(ponerFrontmatterTexto(md, e.target.value))} />
        </div>
      )}

      <div className="edicion">
        <div className={verPlantilla ? 'tira ancha' : 'tira'}>
          <ListaSlides ir={ir} actual={actual} onIr={onIr} soloLectura={verPlantilla}
            onMover={onMover} onDuplicar={onDuplicar} onBorrar={onBorrar} />
        </div>
        {!verPlantilla && (
          <SlideForm
            bloque={bloque} indice={actual} total={ir.slides.length}
            onBloque={txt => onChange(reemplazarBloque(md, actual, txt))}
            onPicker={cb => setPicker(() => cb)}
            onImagen={subirImagen}
            verMarkdown={verMarkdown}
            onMarkdown={() => setVerMarkdown(v => !v)}
          />
        )}
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
