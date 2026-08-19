// Genera src/tokens.js desde base/colors_and_type.css.
// El CSS del design system es la fuente de verdad; tokens.js es un artefacto derivado.
// Correr tras cualquier cambio en base/colors_and_type.css:  node scripts/build-tokens.js
import { readFileSync, writeFileSync } from 'node:fs';

const css = readFileSync(new URL('../base/colors_and_type.css', import.meta.url), 'utf8');

const raw = {};
for (const [, name, value] of css.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)) {
  raw[name] = value.trim().replace(/\s*\/\*.*$/, '').trim();
}

// ponytail: resolución de var() por profundidad fija. Los alias de Sherpa anidan 2 niveles;
// 10 pasadas es holgura de sobra y evita detectar ciclos.
const resolve = (v, depth = 0) =>
  depth > 10 ? v : v.replace(/var\(--([\w-]+)\)/g, (m, k) => (k in raw ? resolve(raw[k], depth + 1) : m));

const camel = s => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const tokens = Object.fromEntries(Object.entries(raw).map(([k, v]) => [camel(k), resolve(v)]));

const out = `// GENERADO por scripts/build-tokens.js — no editar a mano.
// Fuente de verdad: base/colors_and_type.css
export const tokens = ${JSON.stringify(tokens, null, 2)};
export default tokens;
`;

writeFileSync(new URL('../src/core/tokens.js', import.meta.url), out);
console.log(`tokens.js: ${Object.keys(tokens).length} tokens`);
