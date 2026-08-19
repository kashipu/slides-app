import { useEffect, useMemo, useState } from 'react';
import { filtrarIconos } from './iconos.js';

// El manifiesto se lee una vez por sesión: 532 iconos en 16 categorías.
let cache = null;

export function IconPicker({ onElegir, onCerrar }) {
  const [manifest, setManifest] = useState(cache);
  const [error, setError] = useState(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(null);

  useEffect(() => {
    if (cache) return;
    fetch('/assets/manifest.json')
      .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status)))
      .then(m => { cache = m; setManifest(m); })
      .catch(() => setError('No encuentro assets/. Corre npm run sync-assets y recarga.'));
  }, []);

  useEffect(() => {
    const tecla = e => { if (e.key === 'Escape') onCerrar(); };
    addEventListener('keydown', tecla);
    return () => removeEventListener('keydown', tecla);
  }, [onCerrar]);

  const categorias = useMemo(() => Object.keys(manifest?.icons ?? {}).sort(), [manifest]);

  const resultados = useMemo(() => filtrarIconos(manifest, q, cat), [manifest, q, cat]);

  return (
    <div className="modal" onClick={onCerrar}>
      <div className="panel" onClick={e => e.stopPropagation()}>
        <header>
          <input autoFocus placeholder="Buscar icono…" value={q} onChange={e => setQ(e.target.value)} />
          <button onClick={onCerrar}>Cerrar</button>
        </header>

        {error && <p className="vacio">{error}</p>}

        {manifest && (
          <>
            <nav className="cats">
              <button className={cat ? '' : 'on'} onClick={() => setCat(null)}>Todas</button>
              {categorias.map(c =>
                <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>
                  {c.replace(/-/g, ' ')}
                </button>)}
            </nav>

            <div className="rejilla">
              {resultados.map(i => (
                <button key={i.ref} title={i.ref} onClick={() => onElegir(i.ref)}>
                  <img loading="lazy" src={`/assets/iconos/${i.ref}.svg`} alt="" />
                  <span>{i.nombre}</span>
                </button>
              ))}
            </div>

            <footer>{resultados.length} icono{resultados.length === 1 ? '' : 's'}</footer>
          </>
        )}
      </div>
    </div>
  );
}
