# Asistente Virtual — Guion de presentación (v2)

**Audiencia:** comité / stakeholders de canales
**Propósito:** contar qué ha pasado, pedir dos decisiones y mostrar a dónde vamos
**Duración estimada:** 25–30 minutos

**Las dos peticiones del deck:**
1. Entrar al dashboard de Banca Móvil
2. Absorber el CAD

**El argumento que las habilita:** debe haber un solo asistente, y ya lo tenemos.

**Regla del deck:** en pantalla va la narrativa. Las cifras viven en este documento y solo salen si preguntan.

---

## Cómo leer este documento

- **En pantalla** — lo que se proyecta. Corto.
- **Por qué está aquí** — la decisión narrativa detrás.
- **Lo que la sustenta** — evidencia interna. No se muestra.

---

# BLOQUE 1 · VISIÓN

## Lámina 1 — A dónde va el asistente

**En pantalla**

> **Un solo asistente que conoce al cliente y resuelve donde está.**
>
> Para el cliente: deja de buscar dónde se hace algo. Pregunta y lo resuelve, en el canal donde ya está, sin repetir su historia.
>
> Para el banco: una sola conversación con el cliente en todos los canales digitales, que informa, acompaña y origina — y libera a los canales asistidos de lo que no necesita un humano.
>
> Hoy el asistente explica. Mañana reconoce y resuelve.

**Por qué está aquí**

El deck no puede abrir explicando tecnología. Abre declarando intención.

La frase "hoy explica, mañana reconoce y resuelve" es la columna vertebral de toda la presentación: todo lo que sigue es o evidencia de lo que ya explica, o el camino hacia reconocer y resolver.

Está escrita en presente y con el banco como sujeto, no como reacción a un problema.

**Lo que la sustenta**

- "Sin repetir su historia" apunta a memoria conversacional y omnicanalidad, ambas ausentes hoy. Es promesa de visión, no de corto plazo.
- "Origina" no es aspiracional: ya ocurre. Es el puente con la lámina 5.
- Evitar la palabra "chatbot" en toda la presentación.

---

## Lámina 2 — Qué es hoy

**En pantalla**

> El asistente es una IA conversacional, no un chatbot de menús.
> Entiende lo que la persona quiere decir, no solo lo que escribe exacto.
>
> Su fuente es una sola: el portal público del banco.
>
> Hoy no se autentica, no ve datos del cliente y no ejecuta transacciones.

**Por qué está aquí**

Media sala llega pensando "chatbot". Si no se corrige aquí, las capacidades futuras suenan a exageración y las limitaciones actuales suenan a mal desarrollo.

Declarar los tres límites de una vez, y temprano, evita que aparezcan como objeción más adelante. También prepara el impacto de la lámina 5: todo lo que el asistente ya produce, lo produce con estas tres restricciones puestas.

**Lo que la sustenta**

- Motor LLM sobre LangGraph. No hay árbol de decisión.
- Fuente única: bancodebogota.com/personas.
- No lee PDF ni imágenes del portal — parte del contenido del banco vive en esos formatos y queda fuera de alcance.
- Entiende variantes ortográficas y lenguaje coloquial: "me robaron el cel" activa el flujo de seguridad.

---

# BLOQUE 2 · DÓNDE ESTAMOS

## Lámina 3 — Dónde está desplegado

**En pantalla**

| Canal | Dónde | Segmento |
|---|---|---|
| Portal Público | Vivo | PN + PJ |
| Banca Móvil | Vivo, **fuera del login** | PN + PJ |
| Corporate | Vivo, solo consulta | PJ |

> Banca Virtual es el único canal sin asistente. No es la prioridad hoy.

**Por qué está aquí**

La tabla existe para que quede visible una sola cosa: en Banca Móvil el asistente está **afuera**. Ese "fuera del login" es la semilla de la petición del bloque 4 y conviene sembrarlo temprano sin argumentarlo todavía.

Banca Virtual se menciona y se descarta en la misma línea. Nombrarlo evita la pregunta; descartarlo evita que se lleve la conversación.

**Lo que la sustenta**

- Banca Móvil fuera del login cumple función de onboarding. Es el único uso posible sin sesión.
- Corporate atiende solo PJ y hoy es solo consulta.
- El asistente atiende PJ en tres canales sin base de conocimiento para PJ. Brecha conocida, no resuelta.
- **Si preguntan por Banca Virtual:** la app y Banca Móvil ya cubren esa necesidad para PN. Profundizar en los canales vivos tiene más retorno que abrir un cuarto.

---

## Lámina 4 — Qué aprendimos al llegar a Banca Móvil

**En pantalla**

> Un evento de alta demanda nos puso el asistente en Banca Móvil, con muchos más usuarios de los habituales y en pocos días.
>
> Tres cosas quedaron:
>
> - El asistente aguantó volúmenes muy por encima de lo normal
> - El contenido del portal se actualizó y mejoró de forma sustancial
> - Tenemos base histórica de comportamiento en un canal que no teníamos

**Por qué está aquí**

Es la prueba de robustez, y alimenta directamente el argumento del bloque 3. Sin ella, "un solo asistente" es preferencia. Con ella, es constatación.

Se cuenta el aprendizaje, no el proyecto: nombrar la migración abre una conversación distinta que no aporta al objetivo.

**Lo que la sustenta**

- Ventana del evento: aproximadamente 31 de julio a 5 de agosto de 2026.
- Huella más visible: botones rápidos pasaron de ~11.500 mensajes en julio a ~62.200 en agosto. "Canales de atención" pasó de 3.564 a 24.171 en un mes.
- Tráfico concentrado en rutas de soporte: `atencion-al-cliente` y subrutas de canales digitales dominan las páginas consultadas.
- **Advertencia:** no tenemos el escalamiento desagregado por canal. El tablero disponible es del Portal Público. No improvisar cifra en sala.

---

## Lámina 5 — Qué ya nos está dando

**En pantalla**

> Hoy, sin autenticación y con una sola fuente de información:
>
> - **Es el único asistente del banco que origina producto.** Crédito de libre inversión, tarjeta, cuenta de ahorros y CDT ya se colocan desde la conversación.
> - **Es el único que tiene todo el portal.** Ningún otro punto de contacto digital tiene esa cobertura.
> - **Sostiene la demanda fuera de horario**, cuando las oficinas están cerradas.
> - **Absorbe el pico.** Ya demostró que aguanta.
>
> Todo esto con capacidades de nivel 1 y 2. Nada de esto requirió integración.

**Por qué está aquí**

Es la lámina que da derecho a pedir lo del bloque 4. Sin ella, el deck es una lista de aspiraciones.

La colocación se presenta como **prueba de capacidad, no como cifra de volumen**. "Es el único asistente del banco que origina producto" es incontestable. El número invita a "¿solo eso?".

**Puente hacia el bloque 4 — decirlo en voz, no en lámina:** si el asistente ya origina producto siendo ciego a los datos del cliente, la pregunta obvia es cuánto originaría reconociéndolo.

**Lo que la sustenta**

- 249 colocaciones, ~988 millones en el período. CVR 6,3% sobre 3.938 solicitudes.
- Embudo: 30.864 impresiones → 3.938 solicitudes → 249 colocaciones. De impresión a colocación, 0,8%.
- Por producto: tarjeta ~491 millones (51), libre inversión ~430 millones (103), vehículo ~56 millones (1), CDT ~10 millones (3), ahorros 91 aperturas.
- CVR por producto: CDT 33,3%, libre inversión 6,1%, tarjeta 2,4%.
- Fuera de horario: aproximación propia sobre la tabla horaria del tablero. **Recalcular con el criterio exacto de horario de oficina antes de presentar.**
- **Riesgo del dato:** no hay benchmark ni modelo de atribución. No sabemos si esas colocaciones habrían ocurrido igual sin el asistente. Por eso no va cifra en pantalla.

---

# BLOQUE 3 · POR QUÉ UN SOLO ASISTENTE

## Lámina 6 — Ya tenemos el asistente que debería ser el único

**En pantalla**

> No es una decisión de futuro. Es reconocer lo que ya existe.
>
> **Calidad de respuesta** — responde con dato concreto, paso a paso y link oficial. Desambigua antes de contestar en vez de adivinar.
>
> **Robustez** — ya soportó un evento de alta demanda sin caerse.
>
> **Usuarios** — es el asistente del banco con más conversaciones atendidas, en tres canales y dos segmentos.
>
> **Conocimiento** — es el único que tiene todo el portal.
>
> Construir otro asistente es duplicar lo que ya funciona.

**Por qué está aquí**

Esta es la lámina que habilita todo el bloque 4. Si el comité acepta que debe haber un solo asistente y que ya lo tenemos, absorber el CAD y resolver PQR dejan de ser propuestas y pasan a ser consecuencias.

El argumento está construido con evidencia, no con principio de marca. "Queremos uno solo" es preferencia y se debate. "Ya tenemos uno que funciona, es robusto y tiene los usuarios" es constatación y es mucho más difícil de discutir.

La última línea es la que hace el trabajo. Deja la carga de la prueba del otro lado: quien quiera un asistente aparte tiene que explicar por qué.

**Lo que la sustenta**

- Calidad: el mejor flujo actual entrega pasos numerados exactos más link oficial. El conocimiento de producto, trámite y reglas normativas es sólido.
- Robustez: el evento de Banca Móvil es la evidencia. Ver lámina 4.
- Volumen: ~295 mil conversaciones y ~598 mil mensajes solo en Portal Público en el período, más el volumen de Banca Móvil.
- **Lo que no se dice en pantalla y hay que tener listo:** el asistente tiene fallas conocidas (saludo enlatado, deriva de más, no admite cuándo no sabe). Si alguien las trae, la respuesta es que son problemas de calidad resolubles sobre una base que ya existe — no razones para construir otra base.

---

## Lámina 7 — Un motor, un contexto por canal

**En pantalla**

> Un solo asistente no significa una sola respuesta.
>
> Si el asistente del portal público responde dentro de Banca Móvil, va a decir "descarga la App Banca Móvil" — cuando el usuario ya está adentro.
>
> **Una sola interfaz. Una sola personalidad. Un contexto por canal.**
>
> Lo que cambia según dónde y con quién:
> - **El tono** — no se habla igual en un onboarding que en una consulta de mora
> - **El contenido** — cada canal tiene su base de conocimiento
> - **El alcance** — el canal define qué se puede hacer
> - **El segmento** — PN y PJ no tienen las mismas necesidades ni el mismo lenguaje

**Por qué está aquí**

Previene el malentendido inverso de la lámina 6: que "un solo asistente" se lea como copiar y pegar el mismo bot en todos lados.

El ejemplo de "descarga la app" hace el problema evidente en cinco segundos y evita una discusión abstracta de arquitectura.

El criterio operativo es **voz constante, tono variable** — la misma lógica que ya aplica el manual de voz y tono del banco por etapa del journey, extendida aquí por canal y por segmento.

**Lo que la sustenta**

- El manual de voz y tono ya opera así: los tres pilares de personalidad (práctico, con gracia, sincero) son constantes; el tono se adapta al momento.
- **Alineación pendiente:** el roadmap existente dice "mismo nombre, personalidad, voz y tono en todos los asistentes digitales". Esta lámina separa voz de tono. Actualizar el roadmap para que no se lean como contradictorios.
- Banca Móvil fuera del login y dentro del login son dos contextos distintos, aunque sea el mismo canal.
- Corporate necesita base de conocimiento propia (PJ) y permisos por rol. No es una variante de la de PN.
- Alternativa descartada: un asistente por canal. Resuelve el contexto pero rompe la lámina 6 y multiplica el mantenimiento.

---

# BLOQUE 4 · LO QUE PEDIMOS

## Lámina 8 — El asistente tiene que entrar al dashboard

**En pantalla**

> Hoy el asistente está en Banca Móvil, pero **afuera**: en el login, haciendo onboarding.
>
> Todo el valor está adentro.
>
> **Adentro el usuario ya está autenticado.**
> Es el único canal donde ya sabemos quién es el cliente sin construir nada nuevo.
>
> Es la puerta a reconocer y resolver.

**Por qué está aquí**

Es la petición principal del deck y el cambio de marco más importante.

En todas las versiones anteriores la autenticación aparecía como el habilitador más lejano y más caro — dependiente de Legal, Compliance y Seguridad. Entrar al dashboard le da la vuelta: el usuario **ya** está autenticado. No hay que construir la autenticación, hay que conectarse a una sesión que ya existe.

Eso convierte la petición de "denos presupuesto para un proyecto largo" en "denos el espacio donde ya está resuelta la parte difícil".

**Lo que la sustenta**

- **Precisión crítica, y hay que tenerla lista:** estar dentro de una sesión autenticada no es lo mismo que tener acceso a los datos del cliente. La app sabe quién es el usuario; que el asistente pueda consumir esa sesión y consultar saldo o estado de producto es una decisión técnica y legal aparte. La lámina dice "es la puerta", no "está resuelto".
- Riesgo de expectativa: dentro del dashboard el usuario va a preguntar saldo, cuota y estado de transferencia. Si el asistente entra sin acceso a datos, es el mismo asistente ciego en el lugar donde la expectativa es más alta. Hay que definir el alcance de la primera versión antes de entrar.
- Demanda que respalda: transacción/operación (~29% de intenciones) y consulta de producto (~27%) son las dos principales, y ambas dependen de datos de cuenta.
- El canal primario de contención hoy es Banca Móvil (~139 mil). El asistente ya está mandando gente al dashboard desde afuera. Estar adentro cierra ese ciclo.

---

## Lámina 9 — Qué vamos a hacer con el CAD

**En pantalla**

> Adentro del dashboard ya hay algo: el Centro de Ayuda.
>
> Concentra todo el contenido del canal, pero es **estático**: la persona busca, lee y decide sola.
>
> El CAD y el asistente resuelven la misma necesidad en el mismo lugar, con dos mecanismos distintos.
>
> **Lo absorbemos.** Todo lo construido se incorpora al asistente. El contenido estático se vuelve conversación.
>
> No se descarta nada. Se transforma.

**Por qué está aquí**

Es la segunda petición y la consecuencia directa de la lámina 8. No es un tema aparte: si el asistente entra al dashboard, la pregunta de qué pasa con el CAD se responde sola.

Enmarcar la absorción como aprovechamiento y no como reemplazo es deliberado. Hay trabajo de otras áreas ahí adentro y el deck no puede sonar a que se va a botar.

**Lo que la sustenta**

- El contenido del CAD ya está curado y validado. Absorberlo acelera la base de conocimiento del canal en vez de construirla de cero.
- Contenido estático obliga a la persona a saber qué buscar. El asistente resuelve desde la pregunta en lenguaje natural.
- Los temas de mayor volumen coinciden exactamente con lo que vive el CAD: acceso y problemas técnicos (~49 mil), claves y PIN (~29 mil), documentos y certificados (~20 mil).
- Mantener ambos significa mantener dos bases de conocimiento que se van a desincronizar.
- **Definir antes de presentar:** quién es el dueño del contenido después de la absorción, y qué pasa con la interfaz actual del CAD durante la transición.

---

## Lámina 10 — La complicación: PQR

**En pantalla**

> Dentro del CAD vive el asistente de PQR. **No es nuestro.**
>
> Absorber el CAD obliga a definir qué pasa con él.
>
> Lo que hay que decidir:
> - Quién es el dueño de la experiencia de PQR en canales digitales
> - Si el asistente de PQR se integra, se reemplaza o convive
> - Cómo se mantiene trazabilidad y cumplimiento durante la transición
>
> Y no es solo Banca Móvil: con Bre-B, Corporate también va a necesitar atender PQR por obligación normativa.

**Por qué está aquí**

Es el punto más filoso y el que sí requiere decisión del comité. No puede ir como detalle dentro de la lámina del CAD: involucra a otra área y toca cumplimiento.

Se presenta como preguntas abiertas y no como propuesta cerrada, deliberadamente. La decisión no es nuestra sola y llegar con la solución hecha genera resistencia del área dueña.

Corporate entra aquí como cierre y no como lámina propia. Su relevancia es que empuja hacia la misma capacidad desde otro canal: si dos canales van a necesitar PQR, la capacidad se construye una vez con contexto por canal.

**Lo que la sustenta**

- El asistente de PQR es de otro equipo/proveedor. Absorber el CAD sin resolver esto deja dos asistentes conviviendo en el mismo canal — exactamente lo que la lámina 6 dice que no queremos.
- Demanda de PQR en Portal Público: ~7.400 conversaciones con esa intención, ~9.600 con tema PQRS.
- El indicador de "resolución" de PQR en el tablero (~90%) es engañoso: el asistente resuelve *decir dónde radicar*, no la radicación.
- PQR tiene tono propio en el manual de voz: empático, explicativo, resolutivo, franco. Cualquier integración debe respetarlo.
- **Verificar con Legal antes de presentar:** la obligación normativa de PQR asociada a Bre-B. En pantalla se afirma como obligación; conviene tenerlo por escrito.
- **No comprometer fecha** de absorción del asistente de PQR. Depende de una negociación con otra área.

---

# BLOQUE 5 · A DÓNDE VAMOS

## Lámina 11 — Las 12 capacidades

**En pantalla**

> Lo que el asistente va a poder hacer, en cuatro niveles de madurez:
>
> **Informar** — responde con información pública
> Asesoría de portafolio · Orientación a canales físicos
>
> **Guiar** — acompaña un proceso paso a paso
> Adquisición de producto · Documentos y certificados · Soporte y diagnóstico
>
> **Reconocer** — sabe quién es el cliente y qué tiene
> Consulta de estado · Seguridad y contingencia · Cobranza y mora · Anticipación
>
> **Actuar** — ejecuta y tramita
> Autogestión no monetaria · Operación monetaria asistida · PQR y reclamaciones
>
> **Informar y guiar ya existen. Reconocer y actuar empiezan en el dashboard.**

**Por qué está aquí**

Responde "¿para qué todo lo anterior?". Los cuatro niveles importan más que las doce capacidades: comunican progresión, no lista de deseos.

La última línea cierra el arco con la lámina 8. Los dos niveles que faltan son exactamente los que dependen de conocer al cliente, y ahí es donde entrar al dashboard deja de ser una petición de espacio y se vuelve la condición de todo lo demás.

PQR aparece como capacidad formal, lo que cierra el arco con la lámina 10.

**Lo que la sustenta**

- Cada capacidad se define a nivel generalizado: adquisición de tarjeta de crédito y de tarjeta débito son la misma capacidad con productos distintos.
- **Verificar:** la agrupación en cuatro niveles viene del trabajo previo de capacidades. Contrastar contra el documento maestro antes de presentar.
- Demanda que respalda los niveles altos: transacción/operación ~29%, consulta de producto ~27%, problema técnico ~10%, seguridad y fraude ~8%, cancelación de producto ~2%.
- Las capacidades de "reconocer" y "actuar" son las que dependen de acceso a datos, no solo de sesión autenticada. Ver la precisión de la lámina 8.

---

## Lámina 12 — Ninguna capacidad es blanco o negro

**En pantalla**

> Cada capacidad se puede resolver en tres niveles:
>
> **Nivel 1 — Información:** te explico cómo se hace
> **Nivel 2 — Redirección:** te llevo al lugar exacto donde se hace
> **Nivel 3 — Integración:** lo hacemos aquí mismo
>
> Hoy casi todo vive en nivel 1 y 2.
>
> El roadmap no es construir capacidades nuevas. Es subir de nivel las que ya existen.

**Por qué está aquí**

Evita la lectura binaria de la lámina anterior ("no tenemos ninguna de estas capacidades"). El asistente ya opera muchas de las doce en nivel 1 y 2.

También hace medible el progreso: se puede reportar avance capacidad por capacidad, nivel por nivel. Es la base de la métrica de resolución que hoy no existe.

Y refuerza la petición: la brecha de nivel 2 a nivel 3 casi siempre se bloquea en datos e integración, no en contenido.

**Lo que la sustenta**

- El mejor flujo actual (documentos y certificados) es un nivel 2 bien ejecutado: pasos exactos más link oficial.
- Hoy medimos contención (81%), no resolución. Una conversación que termina en "hazlo en la App" cuenta como contenida. El canal primario de contención es Banca Móvil (~139 mil) — es decir, redirección exitosa, no resolución.
- Señales de que contención no basta: promedio de 2,0 mensajes por conversación, NSS de −22,84%, ~86.900 conversaciones abiertas donde el usuario nunca escribió.
- Existe un problema conocido de medición del flag de derivación. Cualquier tablero que lo use está inflado.
- **Si preguntan por el número:** 81% de contención, aclarando de inmediato que incluye redirección.

---

## Lámina 13 — Qué ganamos

**En pantalla**

> **Hoy informamos. Con esto, resolvemos y originamos.**
>
> - **Contención con resolución** — dejar de mandar a otro canal lo que se puede cerrar aquí
> - **Más originación** — hoy la conversación recomienda; mañana acompaña hasta el desembolso
> - **Menos carga en canales asistidos** — lo que hoy escala por falta de datos, no por complejidad
> - **Un solo lugar** — el cliente deja de escoger entre CAD, asistente y PQR

**Por qué está aquí**

Cierra el arco que abre la lámina 5. Ahí se muestra lo que el asistente ya produce siendo ciego a los datos del cliente; aquí, qué cambia cuando deja de serlo.

El último punto es el que amarra las dos peticiones: entrar al dashboard y absorber el CAD producen, juntos, un solo punto de entrada.

**Lo que la sustenta**

- Contención con resolución: buena parte de los ~139 mil contenidos vía Banca Móvil son redirecciones que podrían cerrarse en canal con datos de cuenta.
- Originación: el salto está en acompañar el trámite, no en mostrar más el producto. El CVR de impresión a colocación es 0,8%.
- Carga en canales asistidos: las intenciones que más escalan son cancelación de producto y solicitud de asesor (~33% cada una). Escalan por falta de datos y de capacidad de trámite.
- Un solo lugar: hoy en Banca Móvil conviven CAD, asistente y asistente de PQR. Tres entradas para la misma necesidad.
- **No prometer cifras.** No hay modelo de proyección ni benchmark. Los cuatro beneficios se enuncian como dirección, no como meta.

---

## Lámina 14 — Lo que necesitamos decidir hoy

**En pantalla**

> **1. Entrar al dashboard de Banca Móvil**
> Aprobar el espacio y definir el alcance de la primera versión.
>
> **2. Absorber el CAD**
> Confirmar la absorción y definir el dueño del contenido.
>
> **3. Definir el dueño de la experiencia de PQR en canales digitales**
> Es la que condiciona el cronograma de las dos anteriores.

**Por qué está aquí**

Toda presentación de estatus tiene que terminar en pedido. Sin esta lámina, la sala escucha, asiente y no pasa nada.

Tres decisiones y no más. Las dos primeras tienen respuesta esperada; la tercera requiere negociación y es la que puede frenar todo, por eso se declara explícitamente como condicionante en vez de dejarla implícita.

**Lo que la sustenta**

- La decisión 1 no pide integración con datos: pide el espacio y la definición de alcance. Deliberadamente pequeña para que sea fácil decir que sí.
- La decisión 3 se enuncia como "definir dueño" y no "apagar el asistente de PQR", porque lo segundo no nos corresponde proponerlo.
- **Preparar de antemano:** si preguntan por costo o equipo, este deck no lo cubre. Decidir antes si se lleva lámina de respaldo o se responde con compromiso de siguiente sesión.

---

# Notas de preparación

**Riesgos de la sesión**

1. **"¿Adentro del dashboard va a ver el saldo?"** — La sesión autenticada es la puerta; el acceso a datos es una decisión técnica y legal aparte. No prometer.
2. **"¿Cuánto contiene hoy?"** — 81%, aclarando de inmediato que incluye redirección. Enlazar con la lámina 12.
3. **"¿Cuánto escalamos en Banca Móvil durante el evento?"** — No tenemos el dato desagregado. No improvisar cifra.
4. **"¿Por qué no un asistente por canal?"** — Láminas 6 y 7. Un motor, contexto por canal.
5. **"¿Y el asistente de PQR se apaga?"** — No decidido. Es lo que se pide decidir en la lámina 14.
6. **"El asistente tiene fallas conocidas"** — Ciertas y resolubles. Son razones para mejorar la base, no para construir otra.
7. **"¿Cuándo?"** — El deck no lleva fechas a propósito. Pide decisiones, no compromete entregas.

**Pendientes antes de presentar**

- [ ] Definir el alcance de la primera versión dentro del dashboard: ¿con acceso a datos o sin él?
- [ ] Validar con Legal la obligación normativa de PQR asociada a Bre-B
- [ ] Contrastar la agrupación de las 12 capacidades en cuatro niveles contra el documento maestro
- [ ] Recalcular el dato de tráfico fuera de horario con el criterio real de horario de oficina
- [ ] Alinear con el área dueña del asistente de PQR antes de presentar la lámina 10
- [ ] Definir dueño del contenido del CAD post-absorción
- [ ] Decidir si se lleva lámina de respaldo con costo y equipo