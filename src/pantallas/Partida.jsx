import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../componentes/Logo.jsx'
import { leerJugador, registrarPartida, XP_POR_ACIERTO } from '../datos/jugador.js'
import { armarPartida } from '../datos/partida.js'
import '../estilos/partida.css'

const LETRAS = 'ABCD'

export default function Partida() {
  const [retos, setRetos] = useState(() => armarPartida(leerJugador()))
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [log, setLog] = useState([])
  const [terminada, setTerminada] = useState(false)
  const respuestaRef = useRef(null)

  const reto = retos[i]
  const total = retos.length
  const respondido = elegida !== null
  const acerto = respondido && elegida === reto.correcta
  const aciertos = log.filter(Boolean).length
  const xp = aciertos * XP_POR_ACIERTO
  const pct = Math.round(((i + (respondido ? 1 : 0)) / total) * 100)
  const ultimo = i === total - 1

  /* En teléfonos el veredicto y el botón pueden quedar bajo el pliegue. */
  useEffect(() => {
    if (!respondido || !respuestaRef.current) return
    const quieto = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    respuestaRef.current.scrollIntoView({ block: 'nearest', behavior: quieto ? 'auto' : 'smooth' })
  }, [respondido, i])

  function elegir(k) {
    if (respondido) return
    setElegida(k)
    setLog((l) => [...l, k === reto.correcta])
  }

  function siguiente() {
    if (!ultimo) {
      setI(i + 1)
      setElegida(null)
      window.scrollTo(0, 0)
      return
    }
    registrarPartida(retos.map((r, k) => ({ area: r.area, acierto: log[k] === true })))
    setTerminada(true)
    window.scrollTo(0, 0)
  }

  function reiniciar() {
    setRetos(armarPartida(leerJugador()))
    setI(0)
    setElegida(null)
    setLog([])
    setTerminada(false)
    window.scrollTo(0, 0)
  }

  /* Poderes jugados, sin repetir: superado solo si no se escapó ningún reto del área. */
  const poderes = []
  if (terminada) {
    retos.forEach((r, k) => {
      const previo = poderes.find((p) => p.area === r.area)
      if (previo) previo.ok = previo.ok && log[k]
      else poderes.push({ area: r.area, ok: log[k] })
    })
  }
  const idxFallo = log.indexOf(false)
  const porEntrenar = idxFallo !== -1 ? retos[idxFallo].area : ''

  return (
    <div className="partida">
      <header className="partida-cabecera">
        <Logo to="/lobby" etiqueta="Mate Arena, salir al lobby" />
        <div key={aciertos} className={'xp-chip' + (aciertos > 0 && !terminada ? ' xp-chip-suma' : '')}>
          {xp} XP
        </div>
      </header>

      {!terminada && (
        <main className="partida-main">
          <div className="avance">
            <div className="avance-texto">RETO {i + 1} DE {total}</div>
            <div
              className="barra"
              role="progressbar"
              aria-label="Avance de la partida"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            >
              <div className="barra-relleno" style={{ width: pct + '%' }} />
            </div>
          </div>

          <div key={reto.id} className="reto">
            <div className="reto-poder">PODER: {reto.area.toUpperCase()}</div>
            <p className="reto-texto">{reto.texto}</p>
          </div>

          <div className="opciones">
            {reto.opciones.map((texto, k) => {
              const esCorrecta = respondido && k === reto.correcta
              const esFallo = respondido && !esCorrecta && k === elegida
              let clase = 'opcion'
              if (!respondido) clase += ' opcion-entra'
              if (esCorrecta) clase += ' opcion-correcta'
              if (esFallo) clase += ' opcion-fallo'
              return (
                <button
                  key={reto.id + k}
                  type="button"
                  className={clase}
                  style={respondido ? undefined : { animationDelay: 120 + k * 70 + 'ms' }}
                  disabled={respondido}
                  onClick={() => elegir(k)}
                >
                  <span className="opcion-letra">{LETRAS.charAt(k)}</span>
                  <span className="opcion-texto">{texto}</span>
                  {esCorrecta && <span className="opcion-etiqueta">Correcta</span>}
                  {esFallo && <span className="opcion-etiqueta">Tu respuesta</span>}
                </button>
              )
            })}
          </div>

          {respondido && (
            <div className="respuesta" ref={respuestaRef} aria-live="polite">
              <div className="veredicto">
                <div className={'veredicto-titulo' + (acerto ? '' : ' veredicto-fallo')}>
                  {acerto ? 'Reto superado · +50 XP' : 'Casi. Así se resuelve:'}
                </div>
                <div className="veredicto-porque">{reto.explicacion}</div>
              </div>
              <button type="button" className="boton-primario respuesta-boton" onClick={siguiente}>
                {ultimo ? 'VER RESULTADOS' : 'SIGUIENTE RETO'}
              </button>
            </div>
          )}
        </main>
      )}

      {terminada && (
        <main className="partida-main resultados">
          <div className="resultados-cima">
            <div className="rotulo">PARTIDA TERMINADA</div>
            <div className="resultados-xp">+{xp} XP</div>
            <div className="resultados-cuenta">{aciertos} de {total} retos superados</div>
          </div>

          <div className="poderes">
            <div className="rotulo poderes-titulo">TUS PODERES EN ESTA PARTIDA</div>
            {poderes.map((p, k) => (
              <div key={p.area} className="poder" style={{ animationDelay: 300 + k * 120 + 'ms' }}>
                <span className="poder-area">{p.area}</span>
                <span className={'poder-estado' + (p.ok ? '' : ' poder-entrenar')}>
                  {p.ok ? 'Superado' : 'Por entrenar'}
                </span>
              </div>
            ))}
          </div>

          {porEntrenar ? (
            <div className="mision-siguiente">
              <div className="rotulo mision-siguiente-rotulo">TU PRÓXIMA MISIÓN</div>
              <div className="mision-siguiente-titulo">Entrena {porEntrenar}</div>
              <div className="mision-siguiente-texto">
                Ahí se te escapó un reto. Mejorarlo es lo que más XP te da en la liga.
              </div>
            </div>
          ) : (
            <div className="mision-siguiente mision-perfecta">
              <div className="mision-siguiente-titulo">Partida perfecta</div>
              <div className="mision-siguiente-texto">
                Superaste todos los retos. La siguiente partida sube de dificultad.
              </div>
            </div>
          )}

          <div className="resultados-acciones">
            <button type="button" className="boton-primario" onClick={reiniciar}>
              JUGAR OTRA VEZ
            </button>
            <Link to="/lobby" className="boton-secundario">Volver al lobby</Link>
          </div>
        </main>
      )}
    </div>
  )
}
