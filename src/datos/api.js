import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const clave = import.meta.env.VITE_SUPABASE_KEY

export const supabase =
  url && clave ? createClient(url, clave, { auth: { persistSession: false } }) : null

export const APODO_VALIDO = /^[A-Za-z0-9_]{3,16}$/

/* Todas devuelven { datos, error }. error es un código corto; nunca lanzan. */

async function intentar(consulta) {
  if (!supabase) return { datos: null, error: 'sin_conexion' }
  try {
    const { data, error } = await consulta()
    if (error) return { datos: null, error: 'sin_conexion' }
    if (data && data.error) return { datos: null, error: data.error }
    return { datos: data, error: null }
  } catch {
    return { datos: null, error: 'sin_conexion' }
  }
}

export function listarColegios() {
  return intentar(() =>
    supabase.from('colegios').select('id, nombre, puntaje').order('puntaje', { ascending: false }),
  )
}

export async function traerLiga() {
  const r = await intentar(() =>
    supabase
      .from('jugadores')
      .select('id, apodo, xp_total, colegios(nombre)')
      .order('xp_total', { ascending: false })
      .order('actualizado', { ascending: true })
      .limit(200),
  )
  if (r.error) return r
  return {
    datos: r.datos.map((j) => ({
      id: j.id,
      nombre: j.apodo,
      colegio: j.colegios?.nombre ?? '',
      pts: j.xp_total,
    })),
    error: null,
  }
}

/* El apodo es único en la base (sin distinguir mayúsculas): error 'apodo_en_uso' si ya existe. */
export function registrarJugador(apodo, colegioId) {
  return intentar(() =>
    supabase.rpc('registrar_jugador', { p_apodo: apodo, p_colegio_id: colegioId }),
  )
}

export function sumarXp(id, llave, aciertos) {
  return intentar(() =>
    supabase.rpc('sumar_xp', { p_id: id, p_llave: llave, p_aciertos: aciertos }),
  )
}

/* Avisa cada vez que cambia la tabla de jugadores. Devuelve la función para cancelar. */
export function suscribirLiga(alCambiar) {
  if (!supabase) return () => {}
  const canal = supabase
    .channel('liga-' + Math.random().toString(36).slice(2))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'jugadores' }, alCambiar)
    .subscribe()
  return () => {
    supabase.removeChannel(canal)
  }
}
