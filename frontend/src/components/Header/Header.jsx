import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about" style={{ marginLeft: '12px' }}>
          About
        </Link>
      </nav>
    </header>
  )
}
