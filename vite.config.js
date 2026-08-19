import { mkdirSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Subida de imágenes a decks/img/. Se hace con un middleware del dev server en vez
// de la File System Access API del navegador: ya hay servidor, así la ruta que
// termina en el .md coincide siempre con la que se sirve, sin permisos ni prompts.
// ponytail: solo dev, sin auth. Es una herramienta local; si algún día se expone
// en red, esto necesita autenticación antes que ninguna otra cosa.
function subirImagenes() {
  return {
    name: 'subir-imagenes',
    configureServer(server) {
      server.middlewares.use('/__subir', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; return res.end('solo POST'); }

        const pedido = new URL(req.url, 'http://x').searchParams.get('nombre') ?? 'imagen';
        // basename + lista blanca de extensiones: nada de rutas relativas ni ../
        const limpio = pedido.split(/[/\\]/).pop().replace(/[^\w.-]/g, '-');
        if (!/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(limpio)) {
          res.statusCode = 400;
          return res.end('extensión no permitida');
        }

        const trozos = [];
        req.on('data', c => trozos.push(c));
        req.on('end', () => {
          try {
            mkdirSync('decks/img', { recursive: true });
            writeFileSync(`decks/img/${limpio}`, Buffer.concat(trozos));
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ ruta: `decks/img/${limpio}` }));
          } catch (e) {
            res.statusCode = 500;
            res.end(String(e.message));
          }
        });
      });
    },
  };
}

// base/ y assets/ se sirven desde la raíz del proyecto en dev; no hay publicDir
// porque son carpetas versionadas (base) o sincronizadas (assets), no artefactos.
export default defineConfig({
  plugins: [react(), subirImagenes()],
  publicDir: false,
  server: { port: 5173, open: false },
});
