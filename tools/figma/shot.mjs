// Captura una diapositiva desde el navegador, a 1920×1080 exactos.
//   node tools/figma/shot.mjs <deck> <indice> <salida.png> [urlBase]
// Usa el Chrome ya instalado: nada de descargar Chromium para tomar una foto.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const CHROMES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

export function capturar(deck, n, salida, base = 'http://localhost:5173') {
  const chrome = CHROMES.find(existsSync);
  if (!chrome) throw new Error('no encuentro Chrome; --review necesita un navegador instalado');
  const url = `${base}/tools/figma/slide.html?deck=${encodeURIComponent(deck)}&n=${n}`;
  execFileSync(chrome, [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--virtual-time-budget=8000', '--window-size=1920,1080',
    `--screenshot=${salida}`, url,
  ], { stdio: 'ignore' });
  return salida;
}

if (process.argv[1].endsWith('shot.mjs')) {
  const [deck, n, salida, base] = process.argv.slice(2);
  if (!deck || n == null || !salida) {
    console.error('uso: node tools/figma/shot.mjs <deck> <indice> <salida.png> [urlBase]');
    process.exit(1);
  }
  capturar(deck, Number(n), salida, base);
  console.error(`→ ${salida}`);
}
