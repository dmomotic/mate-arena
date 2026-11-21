import retos from '../../retos.json'
import { AREAS, poderMasBajo } from './jugador.js'

function mezclar(lista) {
  const a = [...lista]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* 5 retos: 2 del poder más bajo y 1 de cada una de las otras tres áreas, en orden aleatorio. */
export function armarPartida(jugador) {
  const bajo = poderMasBajo(jugador)
  const deArea = (area) => mezclar(retos.filter((r) => r.area === area))
  const elegidos = [
    ...deArea(bajo).slice(0, 2),
    ...AREAS.filter((a) => a !== bajo).map((a) => deArea(a)[0]),
  ]
  return mezclar(elegidos)
}
