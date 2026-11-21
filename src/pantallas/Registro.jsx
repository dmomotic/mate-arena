import { useEffect, useState } from 'react'
import Logo from '../componentes/Logo.jsx'
import { APODO_VALIDO, listarColegios, registrarJugador } from '../datos/api.js'
import { iniciarJugador } from '../datos/jugador.js'
import '../estilos/registro.css'

const MENSAJES = {
  apodo_invalido: 'Usa de 3 a 16 caracteres: letras, números o guion bajo.',
  apodo_en_uso: 'Ese apodo ya está en uso. Prueba con otro.',
  colegio_invalido: 'Elige tu colegio de la lista.',
  sin_conexion: 'No pudimos conectar con la arena. Revisa tu internet e inténtalo de nuevo.',
}

export default function Registro({ alListo }) {
  const [colegios, setColegios] = useState([])
  const [cargaFallida, setCargaFallida] = useState(false)
  const [apodo, setApodo] = useState('')
  const [colegioId, setColegioId] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function cargarColegios() {
    setCargaFallida(false)
    const { datos, error: fallo } = await listarColegios()
    if (fallo) setCargaFallida(true)
    else setColegios([...datos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')))
  }

  useEffect(() => {
    cargarColegios()
  }, [])

  async function enviar(evento) {
    evento.preventDefault()
    if (enviando) return
    const limpio = apodo.trim()
    if (!APODO_VALIDO.test(limpio)) return setError(MENSAJES.apodo_invalido)
    if (!colegioId) return setError(MENSAJES.colegio_invalido)
    setError('')
    setEnviando(true)
    const { datos, error: fallo } = await registrarJugador(limpio, Number(colegioId))
    setEnviando(false)
    if (fallo) return setError(MENSAJES[fallo] ?? MENSAJES.sin_conexion)
    const colegio = colegios.find((c) => c.id === Number(colegioId))?.nombre ?? ''
    alListo(iniciarJugador({ id: datos.id, llave: datos.llave, apodo: datos.apodo, colegio }))
  }

  return (
    <div className="registro">
      <header className="registro-cabecera">
        <Logo to="/" etiqueta="Mate Arena, ir al inicio" />
      </header>

      <main className="registro-main">
        <form className="registro-tarjeta" onSubmit={enviar} noValidate>
          <div className="registro-rotulo">NUEVO JUGADOR</div>
          <h1 className="registro-titulo">Elige tu apodo</h1>

          <div className="campo">
            <label className="campo-etiqueta" htmlFor="apodo">Apodo</label>
            <input
              id="apodo"
              className="campo-control"
              type="text"
              value={apodo}
              onChange={(e) => {
                setApodo(e.target.value)
                setError('')
              }}
              maxLength={16}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="apodo-ayuda"
            />
            <div id="apodo-ayuda" className="campo-ayuda">
              De 3 a 16 caracteres: letras, números o guion bajo. No se puede repetir.
            </div>
          </div>

          <div className="campo">
            <label className="campo-etiqueta" htmlFor="colegio">Colegio</label>
            <select
              id="colegio"
              className="campo-control"
              value={colegioId}
              onChange={(e) => {
                setColegioId(e.target.value)
                setError('')
              }}
            >
              <option value="">Elige tu colegio</option>
              {colegios.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {cargaFallida && (
              <div className="campo-ayuda campo-aviso">
                No pudimos cargar los colegios.{' '}
                <button type="button" className="enlace-boton" onClick={cargarColegios}>
                  Reintentar
                </button>
              </div>
            )}
          </div>

          {error && <div className="registro-error" role="alert">{error}</div>}

          <button type="submit" className="boton-primario registro-boton" disabled={enviando}>
            {enviando ? 'ENTRANDO…' : 'ENTRAR A LA ARENA'}
          </button>
        </form>
      </main>
    </div>
  )
}
