---
titulo: Plantilla de presentaciones
subtitulo: Sistema de diseño Sherpa
fecha: Agosto de 2026
tema: light
logo: horizontal
---

<!-- layout: cover -->
# Plantilla de presentaciones
Sistema de diseño Sherpa · Banco de Bogotá

---

<!-- layout: section; tag: 01 -->
# Cómo se arma una diapositiva

---

<!-- layout: contenido; tag: El modelo -->
# Layouts y componentes

<!-- parrafo -->
El layout decide **dónde** va el contenido. Tú eliges qué componentes meter dentro, y los puedes quitar o reordenar.

<!-- bullets -->
- [esenciales/agregar-documento] El **layout** define el fondo y las regiones
- [esenciales/actualizar-saldos] Los **componentes** se apilan dentro de la región
- [autenticacion/token-activo] Cada componente sabe medirse, así la geometría sigue cerrada

---

<!-- layout: contenido; tag: Componentes; color: mustard-800 -->
# Un mismo layout, distinto contenido

<!-- stats -->
- 189 | Tokens verificados
- 532 | Iconos disponibles
- 6 | Componentes
- 7 | Layouts

<!-- parrafo -->
Aquí conviven cifras y párrafo en la misma región, sin inventar un layout nuevo para la combinación.

---

<!-- layout: contenido; tag: Cifra -->
# Una cifra puede ser la diapositiva

<!-- stats -->
- 3 seg | Tiempo para comunicar la idea principal

---

<!-- layout: afirmacion; tag: Afirmación -->
# La composición hace el trabajo, no la decoración
Kiffo BDB en 160 px y espacio negativo, sin tarjetas ni iconos de relleno.

---

<!-- layout: dos-columnas; tag: Comparación -->
# Antes y después

<!-- parrafo -->
Cada layout traía sus campos fijos. Combinar cifras con un párrafo obligaba a crear otro layout.

<!-- columna -->

<!-- parrafo -->
El layout pone las regiones y tú metes los componentes que hagan falta, en el orden que quieras.

---

<!-- layout: dos-tercios; tag: Asimetría -->
# Dos tercios y un tercio

<!-- parrafo -->
Ocho columnas para la idea principal, cuatro para la cifra que la sostiene.

<!-- columna -->

<!-- stats -->
- 8+4 | Columnas, no 6+6

---

<!-- layout: contenido; tag: Tarjetas -->
# Tres ideas en tarjetas

<!-- tarjetas -->
- [naturaleza/arbol] Sostenible | El sistema crece sin multiplicar layouts.
- [personas/usuarios] Compartido | Diseño y desarrollo leen el mismo catálogo.
- [dispositivos/mobile-phone] Portátil | El mismo deck sale a cuatro destinos.

---

<!-- layout: contenido; tag: Tabla -->
# Comparar en ==columnas==

<!-- tabla -->
- Componente | Para qué sirve | Cuántos
- Tabla | Comparar cosas en columnas | Filas libres
- Tarjetas | Bloques con título y texto | De 2 a 4
- Cifras | Números clave | De 2 a 4

---

<!-- layout: dos-columnas; tag: Imagen -->
# Una imagen dentro de la región

<!-- imagen; src: decks/img/placeholder.svg; pie: La imagen se recorta a 16:9 y se mide sola -->

<!-- columna -->

<!-- parrafo -->
El componente `imagen` vive dentro de una región y convive con los demás. El layout `imagen` es otra cosa: ocupa la diapositiva entera.

---

<!-- layout: media-lateral; imagen: decks/img/placeholder.svg; tag: Producto -->
# La confirmación queda visible de inmediato

<!-- parrafo -->
El usuario ve el estado de la operación sin salir de la pantalla.

---

<!-- layout: imagen; imagen: decks/img/placeholder.svg; caption: Fotografía cálida y natural, personas reales, sin duotono ni filtros pesados -->
# La imagen va a sangre

---

<!-- layout: destacado -->
# Lo que dice el sistema

<!-- cita; autor: Sherpa Design System · voice-style.md -->
Queremos que sientas que hablas con una persona en tiempo real, incluso en un flujo 100% digital.

---

<!-- layout: section; tag: 02 -->
# Qué sigue

---

<!-- layout: contenido; tag: Roadmap -->
# Los exportadores

<!-- bullets -->
- **Figma Design** — un frame de 1920×1080 por diapositiva, ya funciona
- **HTML autocontenido** — un solo archivo con fuentes y assets embebidos
- **PDF** — impresión a escala exacta desde el navegador
- **PPTX editable** — cajas de texto y formas reales, pendiente

---

<!-- layout: cierre -->
# Gracias
Arma tu presentación con el formulario de la izquierda
