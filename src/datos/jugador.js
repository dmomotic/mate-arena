export const AREAS = ['Cantidad', 'Cambio y relaciones', 'Espacio y forma', 'Datos y azar']
export const XP_POR_ACIERTO = 50
export const XP_POR_NIVEL = 1000

const CLAVE = 'mate-arena:jugador'
const AREA_INICIAL = 'Datos y azar'

function jugadorPorDefecto() {
  return {
    apodo: 'Jaguar_15',
    colegio: 'Colegio Ceiba Real',
    xpTotal: 0,
    racha: 0,
    ultimaPartida: null,
    areas: Object.fromEntries(AREAS.map((a) => [a, { aciertos: 0, intentos: 0 }])),
  }
}

export function guardarJugador(jugador) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(jugador))
  } catch {
    // Sin almacenamiento (modo privado, cuota llena): la partida sigue, solo no se guarda.
  }
}

export function leerJugador() {
  const base = jugadorPorDefecto()
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) {
      guardarJugador(base)
      return base
    }
    const leido = JSON.parse(crudo)
    const areas = {}
    for (const a of AREAS) {
      const v = leido?.areas?.[a]
      areas[a] = {
        aciertos: Number(v?.aciertos) || 0,
        intentos: Number(v?.intentos) || 0,
      }
    }
    return {
      apodo: typeof leido.apodo === 'string' && leido.apodo ? leido.apodo : base.apodo,
      colegio: typeof leido.colegio === 'string' && leido.colegio ? leido.colegio : base.colegio,
      xpTotal: Number(leido.xpTotal) || 0,
      racha: Number(leido.racha) || 0,
      ultimaPartida: typeof leido.ultimaPartida === 'string' ? leido.ultimaPartida : null,
      areas,
    }
  } catch {
    return base
  }
}

export function nivelDe(xpTotal) {
  return 1 + Math.floor(xpTotal / XP_POR_NIVEL)
}

export function poderDe(area) {
  return area.intentos > 0 ? Math.round((area.aciertos / area.intentos) * 100) : 0
}

/* El poder más bajo define la misión. Empate: el que tenga más intentos. */
export function poderMasBajo(jugador) {
  const total = AREAS.reduce((n, a) => n + jugador.areas[a].intentos, 0)
  if (total === 0) return AREA_INICIAL
  return [...AREAS].sort((a, b) => {
    const A = jugador.areas[a]
    const B = jugador.areas[b]
    return (
      poderDe(A) - poderDe(B) ||
      B.intentos - A.intentos ||
      (b === AREA_INICIAL) - (a === AREA_INICIAL)
    )
  })[0]
}

function fechaLocal(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function hoyYAyer() {
  const d = new Date()
  const hoy = fechaLocal(d)
  d.setDate(d.getDate() - 1)
  return [hoy, fechaLocal(d)]
}

/* La racha solo cuenta si la última partida fue hoy o ayer. */
export function rachaVigente(jugador) {
  const [hoy, ayer] = hoyYAyer()
  return jugador.ultimaPartida === hoy || jugador.ultimaPartida === ayer ? jugador.racha : 0
}

/* resultados: [{ area, acierto }] de una partida terminada. Devuelve el jugador actualizado y lo guarda. */
export function registrarPartida(resultados) {
  const jugador = leerJugador()
  const [hoy, ayer] = hoyYAyer()
  const areas = { ...jugador.areas }
  let aciertos = 0
  for (const r of resultados) {
    const previa = areas[r.area]
    areas[r.area] = {
      aciertos: previa.aciertos + (r.acierto ? 1 : 0),
      intentos: previa.intentos + 1,
    }
    if (r.acierto) aciertos += 1
  }
  let racha = 1
  if (jugador.ultimaPartida === hoy) racha = Math.max(1, jugador.racha)
  else if (jugador.ultimaPartida === ayer) racha = jugador.racha + 1
  const nuevo = {
    ...jugador,
    xpTotal: jugador.xpTotal + aciertos * XP_POR_ACIERTO,
    racha,
    ultimaPartida: hoy,
    areas,
  }
  guardarJugador(nuevo)
  return nuevo
}
