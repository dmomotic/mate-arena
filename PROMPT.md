# Prompt para Claude Code — Mate Arena (MVP)

Copia todo lo que está debajo de la línea y pégalo como primer mensaje en Claude Code, con la carpeta `mate-arena-handoff` abierta como carpeta de trabajo.

---

Vas a construir el MVP de **Mate Arena**, una aplicación web para la hackathon Build & Pitch (track EdTech, Guatemala). Es un simulador de matemáticas tipo PISA presentado como videojuego competitivo para estudiantes de unos 15 años. Tenemos pocas horas: prioriza que funcione de punta a punta y se vea igual al diseño, por encima de agregar funciones.

## Material que tienes en esta carpeta

- `ESPECIFICACION.md`: paleta, tipografía, rutas, comportamiento y modelo de datos. Es la fuente de verdad.
- `retos.json`: banco de 12 retos de matemáticas (3 por área). Úsalo tal cual.
- `diseno/*.dc.html`: los diseños aprobados. No son React: son la referencia visual exacta. Lee de ahí el marcado, los estilos en línea, los `@keyframes` y la lógica de `renderVals()` para portarlos. No copies la etiqueta `<x-dc>`, `support.js` ni la clase `DCLogic`.
  - `Main.dc.html` y `MainMovil.dc.html`: inicio con rankings (escritorio y móvil).
  - `Lobby.dc.html` y `LobbyMovil.dc.html`: lobby del jugador.
  - `PartidaWeb.dc.html` y `Partida.dc.html`: partida interactiva.

Lee primero `ESPECIFICACION.md` y los seis diseños antes de escribir código.

## Qué construir

1. Proyecto **Vite + React** (JavaScript, sin TypeScript) con `react-router-dom`. CSS plano con variables; sin Tailwind ni librerías de componentes.
2. Tres rutas: `/` (inicio), `/lobby`, `/partida`.
3. **Una sola versión adaptable por pantalla**, no dos. Parte del diseño móvil (390 px) y amplía al de escritorio con media queries. El jurado entrará desde el teléfono.
4. Todas las animaciones del diseño, respetando `prefers-reduced-motion`.
5. Lógica de partida con los retos de `retos.json`, según la especificación.
6. Progreso del jugador guardado en `localStorage`.
7. `vercel.json` con una regla que reescriba todas las rutas a `/index.html`, para que recargar `/lobby` o `/partida` no dé 404.

## Orden de trabajo

1. Crea el proyecto, el tema (variables CSS, fuentes, keyframes) y las rutas vacías. Verifica que `npm run build` pase.
2. Inicializa git, haz el primer commit y **despliega a Vercel con el plugin de Vercel que ya está conectado**, para tener un enlace público desde el principio. Dime el enlace.
3. Construye la partida (es el corazón del demo), luego el lobby y al final el inicio.
4. Después de cada pantalla: build, commit y redeploy.
5. Al terminar, prueba el flujo completo a 390 px de ancho y a 1440 px, y dime qué quedó pendiente.

## Reglas

- No agregues funciones que no estén en la especificación (ni login, ni backend, ni panel docente). Si algo te parece necesario, pregúntame antes.
- No cambies textos, colores ni nombres del diseño. El nombre "Mate Arena" y los datos de ranking son de ejemplo y se quedan así por ahora.
- No uses emojis en la interfaz; los íconos son SVG en línea como en el diseño.
- Usa botones y enlaces reales (`<button>`, `<a>`/`<Link>`), con áreas táctiles de al menos 44 px.
- Si el despliegue o el build fallan, muéstrame el error exacto en vez de intentar rodearlo.
