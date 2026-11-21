import { useEffect, useState } from 'react'
import { listarColegios, suscribirLiga, traerLiga } from './api.js'
import { estaRegistrado } from './jugador.js'

/* Datos de ejemplo: se muestran mientras carga la base o si no hay conexión. */

export const COLEGIOS = [
  { nombre: 'Colegio Ceiba Real', puntaje: 872 },
  { nombre: 'Liceo Monte Jade', puntaje: 845 },
  { nombre: 'Instituto Lago Azul', puntaje: 811 },
  { nombre: 'Colegio Volcán Dorado', puntaje: 790 },
  { nombre: 'Liceo Quetzal Norte', puntaje: 764 },
]

export const JUGADORES = [
  { nombre: 'Ixchel_GT', colegio: 'Colegio Ceiba Real', pts: 2940 },
  { nombre: 'Balam22', colegio: 'Liceo Monte Jade', pts: 2815 },
  { nombre: 'Jaguar_15', colegio: 'Colegio Ceiba Real', pts: 2760 },
  { nombre: 'Quetzal_07', colegio: 'Instituto Lago Azul', pts: 2590 },
  { nombre: 'Kame_Mate', colegio: 'Colegio Volcán Dorado', pts: 2470 },
]

const CADA_CONSULTA = 15000

/* Sin conexión: la lista de ejemplo con el jugador local insertado por puntos. */
function ligaDeEjemplo(jugador) {
  if (!estaRegistrado(jugador)) return JUGADORES
  const rivales = JUGADORES.filter((j) => j.nombre.toLowerCase() !== jugador.apodo.toLowerCase())
  const yo = { nombre: jugador.apodo, colegio: jugador.colegio, pts: jugador.xpTotal, tu: true }
  const pos = rivales.findIndex((r) => r.pts <= yo.pts)
  const liga = [...rivales]
  liga.splice(pos === -1 ? liga.length : pos, 0, yo)
  return liga
}

/*
 * Liga ordenada por puntos, con la fila del jugador marcada como `tu`.
 * Se actualiza en vivo cuando alguien suma XP; además consulta cada 15 s por si el canal en vivo falla.
 */
export function useLiga(jugador) {
  const [filas, setFilas] = useState(null)

  useEffect(() => {
    let vivo = true
    async function cargar() {
      const { datos } = await traerLiga()
      if (vivo && datos) setFilas(datos)
    }
    cargar()
    const cancelar = suscribirLiga(cargar)
    const reloj = setInterval(cargar, CADA_CONSULTA)
    return () => {
      vivo = false
      cancelar()
      clearInterval(reloj)
    }
  }, [])

  if (!filas) return { liga: ligaDeEjemplo(jugador), enVivo: false }
  return {
    liga: filas.map((f) => (f.id === jugador.id ? { ...f, tu: true } : f)),
    enVivo: true,
  }
}

export function useColegios() {
  const [colegios, setColegios] = useState(COLEGIOS)
  useEffect(() => {
    let vivo = true
    listarColegios().then(({ datos }) => {
      if (vivo && datos?.length) setColegios(datos)
    })
    return () => {
      vivo = false
    }
  }, [])
  return colegios
}

export function posicionEn(liga) {
  const idx = liga.findIndex((f) => f.tu)
  if (idx === -1) return { posicion: 0, faltan: 0 }
  return { posicion: idx + 1, faltan: idx > 0 ? liga[idx - 1].pts - liga[idx].pts : 0 }
}
