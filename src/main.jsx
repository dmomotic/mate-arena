import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './estilos/tema.css'
import Inicio from './pantallas/Inicio.jsx'
import Lobby from './pantallas/Lobby.jsx'
import Partida from './pantallas/Partida.jsx'
import Registro from './pantallas/Registro.jsx'
import { estaRegistrado, leerJugador } from './datos/jugador.js'

/* Lobby y partida piden apodo y colegio la primera vez. */
function ConJugador({ children }) {
  const [jugador, setJugador] = useState(leerJugador)
  return estaRegistrado(jugador) ? children : <Registro alListo={setJugador} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/lobby" element={<ConJugador><Lobby /></ConJugador>} />
        <Route path="/partida" element={<ConJugador><Partida /></ConJugador>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
