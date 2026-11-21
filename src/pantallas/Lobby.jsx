import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../componentes/Logo.jsx'
import { leerJugador, nivelDe, poderMasBajo, rachaVigente, sincronizar, XP_POR_NIVEL } from '../datos/jugador.js'
import { posicionEn, useLiga } from '../datos/ranking.js'
import '../estilos/lobby.css'

export default function Lobby() {
  const [jugador, setJugador] = useState(leerJugador)
  const { liga } = useLiga(jugador)

  /* Sube a la base cualquier XP que haya quedado sin enviar. */
  useEffect(() => {
    let vivo = true
    sincronizar().then((j) => {
      if (vivo) setJugador(j)
    })
    return () => {
      vivo = false
    }
  }, [])

  const nivel = nivelDe(jugador.xpTotal)
  const xpNivel = jugador.xpTotal % XP_POR_NIVEL
  const racha = rachaVigente(jugador)
  const { posicion, faltan } = posicionEn(liga)

  return (
    <div className="lobby">
      <header className="lobby-cabecera">
        <Logo to="/" etiqueta="Mate Arena, ir al inicio" />
        <div className="lobby-estado">
          <div className="racha">Racha {racha} {racha === 1 ? 'día' : 'días'}</div>
          <div className="avatar" aria-hidden="true">{jugador.apodo.charAt(0).toUpperCase()}</div>
        </div>
      </header>

      <main className="lobby-main">
        <div className="progreso">
          <div className="progreso-nombre">{jugador.apodo} · Nivel {nivel}</div>
          <div className="progreso-xp">{xpNivel} / {XP_POR_NIVEL} XP para nivel {nivel + 1}</div>
          <div
            className="progreso-barra"
            role="progressbar"
            aria-label="XP del nivel"
            aria-valuemin={0}
            aria-valuemax={XP_POR_NIVEL}
            aria-valuenow={xpNivel}
          >
            <div className="progreso-relleno" style={{ width: (xpNivel / XP_POR_NIVEL) * 100 + '%' }} />
          </div>
        </div>

        <section className="mision">
          <div className="mision-rotulo">TU MISIÓN DE HOY · +150 XP</div>
          <h1 className="mision-titulo">Sube tu poder de {poderMasBajo(jugador)}</h1>
          <Link to="/partida" className="boton-primario mision-boton">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8z" />
            </svg>
            JUGAR
          </Link>
        </section>

        {posicion > 0 && (
        <Link to="/" className="liga">
          <span className="liga-posicion">
            Vas <span className="liga-numero">{posicion}.º</span> en tu liga
          </span>
          {posicion > 1 && (
            <span className="liga-faltan">Te faltan {faltan} XP para el {posicion - 1}.º lugar</span>
          )}
        </Link>
        )}
      </main>
    </div>
  )
}
