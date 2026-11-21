import { sumarXp } from './api.js'

export const AREAS = ['Cantidad', 'Cambio y relaciones', 'Espacio y forma', 'Datos y azar']
export const XP_POR_ACIERTO = 50
export const XP_POR_NIVEL = 1000

const CLAVE = 'mate-arena:jugador'
const AREA_INICIAL = 'Datos y azar'

function jugadorPorDefecto() {
  return {
    id: null,
    llave: null,
    apodo: 'Jaguar_15',
    colegio: 'Colegio Ceiba Real',
    xpTotal: 0,
    pendientes: [],
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
      id: typeof leido.id === 'string' ? leido.id : null,
      llave: typeof leido.llave === 'string' ? leido.llave : null,
      pendientes: Array.isArray(leido.pendientes) ? leido.pendientes.filter(Number.isInteger) : [],
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

/* Registrado = tiene apodo propio guardado en la base, con su llave para sumar XP. */
export function estaRegistrado(jugador) {
  return Boolean(jugador.id && jugador.llave)
}

/* Arranca de cero con el apodo recién registrado. */
export function iniciarJugador({ id, llave, apodo, colegio }) {
  const nuevo = { ...jugadorPorDefecto(), id, llave, apodo, colegio }
  guardarJugador(nuevo)
  return nuevo
}

/* Envía a la base los aciertos que aún no se han subido. Si falla la red, quedan para el próximo intento. */
let envio = null
export function sincronizar() {
  if (envio) return envio
  envio = (async () => {
    let jugador = leerJugador()
    while (estaRegistrado(jugador) && jugador.pendientes.length > 0) {
      const { datos, error } = await sumarXp(jugador.id, jugador.llave, jugador.pendientes[0])
      if (error) break
      jugador = leerJugador()
      jugador = { ...jugador, pendientes: jugador.pendientes.slice(1) }
      if (jugador.pendientes.length === 0) jugador.xpTotal = datos.xp_total
      guardarJugador(jugador)
    }
    return jugador
  })().finally(() => {
    envio = null
  })
  return envio
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
    pendientes: [...jugador.pendientes, aciertos],
  }
  guardarJugador(nuevo)
  return nuevo
}
