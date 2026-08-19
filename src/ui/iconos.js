// Búsqueda sobre el catálogo de sherpa-assets. Función pura: se prueba en node.

/** "abonos-cuentas-payment.svg" → "abonos cuentas payment" */
export const legible = f => f.replace(/\.svg$/, '').replace(/-/g, ' ');

/**
 * @param {{icons: Record<string,string[]>}} manifest
 * @param {string} q      texto de búsqueda (vacío = todo)
 * @param {string|null} cat  categoría o null para todas
 * @returns {{ref:string, nombre:string, cat:string}[]}
 */
export function filtrarIconos(manifest, q = '', cat = null) {
  if (!manifest?.icons) return [];
  const busca = q.trim().toLowerCase();
  const salida = [];
  for (const [c, archivos] of Object.entries(manifest.icons)) {
    if (cat && c !== cat) continue;
    for (const f of archivos) {
      const nombre = legible(f);
      // Los nombres del banco mezclan español e inglés en el mismo archivo
      // (face-id-reconocimiento-facial), así que buscar por subcadena basta.
      if (busca && !nombre.includes(busca) && !c.includes(busca)) continue;
      salida.push({ ref: `${c}/${f.replace(/\.svg$/, '')}`, nombre, cat: c });
    }
  }
  return salida;
}
