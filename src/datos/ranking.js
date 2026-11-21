/* Datos de ejemplo de la especificación. Sin backend en esta versión. */

export const COLEGIOS = [
  { nombre: 'Colegio Ceiba Real', pts: 872 },
  { nombre: 'Liceo Monte Jade', pts: 845 },
  { nombre: 'Instituto Lago Azul', pts: 811 },
  { nombre: 'Colegio Volcán Dorado', pts: 790 },
  { nombre: 'Liceo Quetzal Norte', pts: 764 },
]

export const JUGADORES = [
  { nombre: 'Ixchel_GT', colegio: 'Colegio Ceiba Real', pts: 2940 },
  { nombre: 'Balam22', colegio: 'Liceo Monte Jade', pts: 2815 },
  { nombre: 'Jaguar_15', colegio: 'Colegio Ceiba Real', pts: 2760 },
  { nombre: 'Quetzal_07', colegio: 'Instituto Lago Azul', pts: 2590 },
  { nombre: 'Kame_Mate', colegio: 'Colegio Volcán Dorado', pts: 2470 },
]

/* Los rivales de ejemplo, sin la fila que lleva el apodo del jugador real. */
export function rivalesDe(jugador) {
  return JUGADORES.filter((j) => j.nombre !== jugador.apodo)
}

/* Inserta al jugador real en una lista de rivales ya ordenada. En empate queda arriba. */
export function ligaCon(jugador, rivales = rivalesDe(jugador)) {
  const yo = { nombre: jugador.apodo, colegio: jugador.colegio, pts: jugador.xpTotal, tu: true }
  const pos = rivales.findIndex((r) => r.pts <= yo.pts)
  const liga = [...rivales]
  liga.splice(pos === -1 ? liga.length : pos, 0, yo)
  return liga
}

export function posicionEnLiga(jugador) {
  const liga = ligaCon(jugador)
  const idx = liga.findIndex((f) => f.tu)
  return {
    posicion: idx + 1,
    faltan: idx > 0 ? liga[idx - 1].pts - jugador.xpTotal : 0,
  }
}
