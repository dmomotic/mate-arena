import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { leerJugador } from '../datos/jugador.js'
import { COLEGIOS, ligaCon, rivalesDe } from '../datos/ranking.js'
import '../estilos/inicio.css'

const DURACION_CONTEO = 1400
const CADA_SUBIDA = 4500

function Fila({ puesto, nombre, sub, tu, pts, t, intro, subio, tick }) {
  const suavizado = 1 - Math.pow(1 - t, 3)
  let clase = 'fila'
  if (puesto === 1) clase += ' fila-primera'
  if (tu) clase += ' fila-tu'
  if (subio) clase += tick % 2 ? ' fila-flash-a' : ' fila-flash-b'
  else if (intro) clase += ' fila-entra'
  return (
    <li className={clase} style={intro && !subio ? { animationDelay: (puesto - 1) * 90 + 'ms' } : undefined}>
      <span className="fila-puesto">{puesto}</span>
      <span className="fila-quien">
        <span className="fila-nombre">
          {nombre}
          {tu && <span className="fila-marca"> (tú)</span>}
        </span>
        {sub && <span className="fila-sub">{sub}</span>}
      </span>
      {subio && <span className="fila-subio">SUBIÓ</span>}
      <span className="fila-pts">{Math.round(pts * suavizado).toLocaleString('en-US')}</span>
    </li>
  )
}

export default function Inicio() {
  const [jugador] = useState(leerJugador)
  const [rivales, setRivales] = useState(() => rivalesDe(jugador))
  const [t, setT] = useState(0)
  const [intro, setIntro] = useState(true)
  const [subida, setSubida] = useState({ nombre: null, tick: 0 })

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setT(1)
      setIntro(false)
      return
    }
    const inicio = performance.now()
    let cuadro = requestAnimationFrame(function paso(ahora) {
      const avance = Math.min(1, (ahora - inicio) / DURACION_CONTEO)
      setT(avance)
      if (avance < 1) cuadro = requestAnimationFrame(paso)
      else setIntro(false)
    })

    /* Cada 4.5 s un rival supera al de arriba. El jugador real nunca recibe puntos inventados. */
    const reloj = setInterval(() => {
      const visibles = window.matchMedia('(min-width: 768px)').matches ? 5 : 3
      let quien = null
      setRivales((ps) => {
        const tope = Math.min(ps.length - 1, visibles)
        if (tope < 1) return ps
        const k = 1 + Math.floor(Math.random() * tope)
        const copia = [...ps]
        const sube = { ...ps[k], pts: ps[k - 1].pts + 5 + Math.floor(Math.random() * 30) }
        copia[k] = ps[k - 1]
        copia[k - 1] = sube
        quien = sube.nombre
        return copia
      })
      setSubida((s) => ({ nombre: quien ?? s.nombre, tick: s.tick + 1 }))
    }, CADA_SUBIDA)

    return () => {
      cancelAnimationFrame(cuadro)
      clearInterval(reloj)
    }
  }, [])

  const liga = ligaCon(jugador, rivales)

  return (
    <div className="inicio">
      <header className="inicio-cabecera">
        <div className="temporada">TEMPORADA 1 · MATEMÁTICAS</div>
        <Link to="/lobby" className="entrar">Entrar</Link>
      </header>

      <section className="heroe">
        <h1 className="heroe-logo" aria-label="Mate Arena">
          <span>MATE</span>
          <span className="heroe-arena">
            ARENA
            <span className="heroe-destello" aria-hidden="true" />
          </span>
        </h1>
        <Link to="/partida" className="boton-primario heroe-jugar">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l14 8-14 8z" />
          </svg>
          JUGAR AHORA
        </Link>
      </section>

      <div className="trono">
        <h2 className="trono-titulo">¿Quién manda?</h2>
        <span className="trono-linea">EL TRONO SE DISPUTA CADA SEMANA</span>
      </div>

      <section className="tops">
        <div className="top top-colegios">
          <div className="top-cabecera">
            <h3 className="top-titulo">Top colegios</h3>
            <span className="top-nota">Puntaje promedio</span>
          </div>
          <ol className="top-lista">
            {COLEGIOS.map((c, i) => (
              <Fila key={c.nombre} puesto={i + 1} nombre={c.nombre} pts={c.pts} t={t} intro={intro} />
            ))}
          </ol>
        </div>

        <div className="top top-jugadores">
          <div className="top-cabecera">
            <h3 className="top-titulo">Top jugadores</h3>
            <span className="top-nota">Puntos acumulados</span>
          </div>
          <ol className="top-lista">
            {liga.map((j, i) => (
              <Fila
                key={j.nombre}
                puesto={i + 1}
                nombre={j.nombre}
                sub={j.colegio}
                tu={j.tu}
                pts={j.pts}
                t={t}
                intro={intro}
                subio={!j.tu && subida.nombre === j.nombre}
                tick={subida.tick}
              />
            ))}
          </ol>
        </div>
      </section>

      <footer className="pie">
        <div className="pie-interior">
          <span>
            ¿Tu colegio no aparece?{' '}
            <a className="pie-enlace" href="mailto:[SU CORREO DE CONTACTO]">Súmalo a la arena</a>
          </span>
          <span className="pie-firma">Mate Arena · Hecho en Guatemala</span>
        </div>
      </footer>
    </div>
  )
}
