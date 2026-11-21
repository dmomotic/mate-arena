import { Link } from 'react-router-dom'

export default function Logo({ to, etiqueta }) {
  return (
    <Link to={to} aria-label={etiqueta} className="logo">
      MATE <span className="logo-arena">ARENA</span>
    </Link>
  )
}
