import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar(){
  const { qty } = useCart()
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">MiTienda Gamer</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorías</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/ofertas">Ofertas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/tiendas">Tiendas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/acerca">Acerca</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>
          </ul>
          <Link to="/carrito" className="btn btn-accent btn-sm">Carrito ({qty})</Link>
        </div>
      </div>
    </nav>
  )
}
