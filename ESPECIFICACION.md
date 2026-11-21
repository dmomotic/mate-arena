# Mate Arena — Especificación del MVP

## 1. Producto

Simulador de matemáticas con competencias tipo PISA, presentado como videojuego. El estudiante nunca ve la palabra "examen".

| Concepto real | En la interfaz |
|---|---|
| Prueba | Partida / misión |
| Pregunta | Reto |
| Nota | XP y nivel |
| Área de matemáticas | Poder |
| Punto débil | "Por entrenar" / "Tu próxima misión" |

Las cuatro áreas (poderes): **Cantidad**, **Cambio y relaciones**, **Espacio y forma**, **Datos y azar**.

## 2. Tema visual

### Colores (variables CSS)

| Variable | Hex | Uso |
|---|---|---|
| `--fondo` | `#0E1022` | Fondo de página |
| `--superficie` | `#191C38` | Tarjetas |
| `--superficie-hover` | `#20244A` | Botón de opción al pasar el cursor |
| `--borde` | `#2C3160` | Bordes |
| `--texto` | `#F2F3FF` | Texto principal |
| `--texto-2` | `#A9AED6` | Texto secundario |
| `--lima` | `#C6F432` | Primario: botones, XP, aciertos (texto encima: `--fondo`) |
| `--violeta` | `#9B85FF` | Secundario: etiquetas, avatar, top jugadores |
| `--naranja` | `#FF9F1C` | Racha, fallos, "por entrenar" |
| `--cian` | `#38D6FF` | Informativo |

Los fallos van en naranja, nunca en rojo. Acierto y fallo se distinguen además por texto ("Correcta", "Tu respuesta"), no solo por color.

### Tipografía (Google Fonts)

- Títulos, números y botones: **Chakra Petch** 600/700.
- Texto: **Inter** 400/500/600/700.

### Logo

"MATE" en `--texto` y "ARENA" dentro de un bloque `--lima` con texto `--fondo`, `transform: skewX(-8deg)`, esquinas redondeadas y sombra dura `--violeta` desplazada. Ver `Main.dc.html`.

## 3. Rutas y pantallas

### `/` Inicio

Referencia: `Main.dc.html` (escritorio), `MainMovil.dc.html` (móvil).

- Encabezado: etiqueta "TEMPORADA 1 · MATEMÁTICAS" y botón "Entrar" → `/lobby`.
- Logo gigante "MATE ARENA" y botón "JUGAR AHORA" → `/partida`.
- Título "¿Quién manda?" con la línea "EL TRONO SE DISPUTA CADA SEMANA".
- Dos tarjetas: **Top colegios** (puntaje promedio) y **Top jugadores** (puntos acumulados, con el colegio debajo del apodo). Escritorio: 5 filas cada una. Móvil: 3 filas.
- Pie: "¿Tu colegio no aparece? Súmalo a la arena".
- Animaciones: brillo y destello en "ARENA"; pulso en el botón; filas que entran escalonadas; puntajes que cuentan desde 0; cada 4.5 s un jugador supera al de arriba (su fila sube resaltada con etiqueta "SUBIÓ").

Datos de ejemplo (inventados, mantenerlos):

- Colegios: Colegio Ceiba Real 872 · Liceo Monte Jade 845 · Instituto Lago Azul 811 · Colegio Volcán Dorado 790 · Liceo Quetzal Norte 764.
- Jugadores: Ixchel_GT (Colegio Ceiba Real) 2940 · Balam22 (Liceo Monte Jade) 2815 · Jaguar_15 (Colegio Ceiba Real) 2760 · Quetzal_07 (Instituto Lago Azul) 2590 · Kame_Mate (Colegio Volcán Dorado) 2470.

### `/lobby` Lobby del jugador

Referencia: `Lobby.dc.html`, `LobbyMovil.dc.html`. Una sola idea: "esta es tu misión de hoy, juégala".

- Encabezado: logo pequeño → `/`, racha y avatar con la inicial del apodo.
- Progreso: "{apodo} · Nivel {n}", barra de XP y "{xp en el nivel} / 1000 XP para nivel {n+1}".
- Tarjeta de misión: "TU MISIÓN DE HOY · +150 XP", título "Sube tu poder de {poder más bajo}" y botón "JUGAR" → `/partida`.
- Línea de liga: "Vas {posición}.º en tu liga" y "Te faltan {n} XP para el {posición-1}.º lugar" → `/`.
- Animaciones: bloques que entran escalonados, barra que se llena, brillo suave en la tarjeta, pulso en el botón.

### `/partida` Partida

Referencia: `PartidaWeb.dc.html`, `Partida.dc.html`. La lógica está en su `renderVals()`.

Jugando:
- Encabezado con logo → `/lobby` y contador de XP de la partida.
- "RETO {n} DE {total}" con barra de avance.
- Tarjeta con "PODER: {ÁREA}" y el enunciado.
- Cuatro opciones (A–D). Escritorio: dos columnas. Móvil: una.
- Al elegir: se bloquean las opciones; la correcta toma borde lima y etiqueta "Correcta"; si fallaste, la tuya toma borde naranja y etiqueta "Tu respuesta". Aparece el veredicto ("Reto superado · +50 XP" o "Casi. Así se resuelve:"), la explicación y el botón "SIGUIENTE RETO" (o "VER RESULTADOS" en el último).

Resultados:
- "PARTIDA TERMINADA", "+{xp} XP" en grande, "{aciertos} de {total} retos superados".
- Lista de poderes jugados con "Superado" o "Por entrenar".
- Si hubo fallos: tarjeta "TU PRÓXIMA MISIÓN — Entrena {primer poder fallado}". Si no: "Partida perfecta".
- Botones "JUGAR OTRA VEZ" y "Volver al lobby".

Animaciones: el reto entra deslizándose desde la derecha y las opciones escalonadas; la barra crece con transición; rebote en la correcta y sacudida en la fallada; el contador de XP rebota al sumar; resultados en secuencia.

## 4. Reglas de juego

- Una partida tiene **5 retos** tomados de `retos.json`.
- Selección: al menos 2 retos del poder más bajo del jugador (si no hay historial, de "Datos y azar"), y el resto de áreas distintas, en orden aleatorio. No repetir retos dentro de una partida.
- Cada acierto da **50 XP**.
- **Nivel** = `1 + floor(xpTotal / 1000)`.
- **Poder** de un área = porcentaje de aciertos acumulados en esa área (0–100). El poder más bajo define la misión del lobby; en empate, el que tenga más intentos.
- **Racha**: días consecutivos con al menos una partida terminada.

## 5. Datos

### `retos.json`

```json
{ "id": "can-1", "area": "Cantidad", "texto": "…", "opciones": ["…","…","…","…"], "correcta": 1, "explicacion": "…" }
```

`correcta` es el índice (0–3) dentro de `opciones`.

### Jugador (`localStorage`, clave `mate-arena:jugador`)

```json
{
  "apodo": "Jaguar_15",
  "colegio": "Colegio Ceiba Real",
  "xpTotal": 0,
  "racha": 0,
  "ultimaPartida": null,
  "areas": {
    "Cantidad": { "aciertos": 0, "intentos": 0 },
    "Cambio y relaciones": { "aciertos": 0, "intentos": 0 },
    "Espacio y forma": { "aciertos": 0, "intentos": 0 },
    "Datos y azar": { "aciertos": 0, "intentos": 0 }
  }
}
```

Si no existe, crearlo con esos valores por defecto. Envolver lecturas y escrituras en `try/catch`.

### Rankings

Sin backend en esta versión. El top de jugadores usa los datos de ejemplo y **agrega al jugador real** con su `xpTotal`, ordenado por puntos y marcado como "(tú)". La posición del lobby sale de esa misma lista. El top de colegios queda con datos de ejemplo.

## 6. Fuera de alcance

Login, backend, panel del docente, reporte para familias, pagos. Los retos son originales con contexto guatemalteco: no usar la marca PISA en la interfaz ni ítems oficiales.

## 7. Listo cuando

- El flujo inicio → lobby → partida → resultados → lobby funciona en un teléfono real con el enlace de Vercel.
- Recargar cualquier ruta no da 404.
- Tras una partida, el lobby muestra el XP, nivel y poder más bajo actualizados, y el jugador aparece en el top del inicio.
- Sin desbordes horizontales a 390 px.
