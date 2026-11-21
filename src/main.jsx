import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './estilos/tema.css'
import Inicio from './pantallas/Inicio.jsx'
import Lobby from './pantallas/Lobby.jsx'
import Partida from './pantallas/Partida.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/partida" element={<Partida />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
