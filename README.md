# Mate Arena

Simulador de competencias matemáticas presentado como videojuego competitivo, para estudiantes de unos 15 años. MVP para la hackathon Build & Pitch (track EdTech, Guatemala).

**Demo:** https://mate-arena.vercel.app

El estudiante nunca ve la palabra "examen": juega partidas, supera retos, gana XP y entrena poderes.

| Concepto real | En la interfaz |
|---|---|
| Prueba | Partida / misión |
| Pregunta | Reto |
| Nota | XP y nivel |
| Área de matemáticas | Poder |
| Punto débil | "Por entrenar" / "Tu próxima misión" |

## Qué hace

- **Inicio (`/`)**: ranking de colegios y de jugadores, actualizado en vivo cuando alguien suma XP.
- **Registro**: la primera vez, el jugador elige un apodo único y su colegio. Sin contraseña.
- **Lobby (`/lobby`)**: nivel, XP, racha, misión del día según el poder más bajo y posición en la liga.
- **Partida (`/partida`)**: 5 retos con contexto guatemalteco, explicación tras cada respuesta y resumen de poderes al final.

Reglas de juego:

- Una partida toma 5 retos de `retos.json`: 2 del poder más bajo del jugador y 1 de cada una de las otras tres áreas, en orden aleatorio.
- Cada acierto da 50 XP. Nivel = `1 + floor(xpTotal / 1000)`.
- El poder de un área es el porcentaje de aciertos acumulados en ella.
- Las cuatro áreas: Cantidad, Cambio y relaciones, Espacio y forma, Datos y azar.

## Tecnología

- **Frontend**: Vite + React (JavaScript) con `react-router-dom`. CSS plano con variables, sin librerías de componentes.
- **Backend**: Supabase (Postgres), llamado directo desde el navegador con `@supabase/supabase-js`.
- **Despliegue**: Vercel, conectado a este repositorio. Cada push a `main` redespliega.

## Correr en local

Requiere Node 20 o superior.

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173`. Para generar la versión de producción:

```bash
npm run build
```

No hay que configurar nada más: el archivo `.env` del repositorio ya trae la URL y la clave pública de Supabase. Esa clave es pública por diseño y solo permite lo que las reglas de la base autorizan.

## Estructura

```
retos.json            Banco de 12 retos (3 por área)
ESPECIFICACION.md     Paleta, tipografía, pantallas y reglas del MVP
diseno/               Diseños de referencia (escritorio y móvil)
vercel.json           Reescribe todas las rutas a /index.html
src/
  main.jsx            Rutas y control de registro
  pantallas/          Inicio, Lobby, Partida, Registro
  componentes/        Logo
  datos/
    api.js            Cliente de Supabase y llamadas a la base
    jugador.js        Progreso local, niveles, poderes, racha y sincronización
    partida.js        Selección de retos
    ranking.js        Liga en vivo y colegios
  estilos/            Tema (variables y animaciones) y un CSS por pantalla
```

## Datos

**En Supabase**

- `colegios`: nombre y puntaje. Son datos de ejemplo, inventados.
- `jugadores`: apodo, colegio y XP total. El apodo es único sin distinguir mayúsculas (3 a 16 caracteres: letras, números o guion bajo).
- `jugador_llaves`: llave secreta de cada jugador. No se puede leer desde el navegador.

El navegador solo puede leer `colegios` y `jugadores`. Para escribir usa dos funciones:

- `registrar_jugador(apodo, colegio)`: crea el jugador y devuelve su llave. Responde `apodo_en_uso` si el apodo ya existe.
- `sumar_xp(id, llave, aciertos)`: suma 50 XP por acierto, hasta 5 aciertos por llamada, solo si la llave coincide.

**En el dispositivo** (`localStorage`, clave `mate-arena:jugador`)

Identidad del jugador (id y llave), aciertos e intentos por área, racha y XP pendiente de enviar. Si falla la red al terminar una partida, el XP queda pendiente y se envía al abrir el lobby.

## Limitaciones conocidas

- No hay login: el apodo está ligado al navegador. Si se borran sus datos, hay que elegir un apodo nuevo.
- No hay límite de frecuencia al sumar XP, así que el puntaje se puede inflar con llamadas repetidas.
- Los apodos no pasan por un filtro de palabras.
- El ranking de colegios usa puntajes de ejemplo; todavía no se calcula a partir de los jugadores.
- El enlace de contacto del pie de página aún no tiene correo.

Fuera de alcance en esta versión: panel del docente, reporte para familias y pagos. Los retos son originales; no se usan ítems oficiales de ninguna prueba.
