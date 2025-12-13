import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { qty } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">MiTienda Gamer</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
            {/* --- ENLACES PÚBLICOS (Visibles para todos) --- */}
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorías</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/ofertas">Ofertas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/tiendas">Tiendas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/acerca">Acerca</NavLink></li>
            
            {/* --- ENLACE PRIVADO (Solo visible si eres ADMIN) --- */}
            {user?.rol === 'admin' && (
              <li className="nav-item">
                <NavLink className="nav-link text-warning fw-bold" to="/admin">Admin Panel</NavLink>
              </li>
            )}

          </ul>

          <div className="d-flex gap-2 align-items-center">
            {/* Botón Carrito */}
            <Link to="/carrito" className="btn btn-accent btn-sm position-relative">
              Carrito 
              {qty > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{qty}</span>}
            </Link>

            {/* Lógica de Sesión */}
            {user ? (
              <div className="d-flex align-items-center gap-2 text-white ms-3 border-start ps-3 border-secondary">
                <div className="d-flex flex-column lh-1 text-end">
                  <small className="fw-bold">{user.nombre}</small>
                  <small style={{fontSize: '0.7rem'}} className="text-muted">{user.rol === 'admin' ? 'Administrador' : 'Cliente'}</small>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Salir</button>
              </div>
            ) : (
              <div className="d-flex gap-2 ms-3 border-start ps-3 border-secondary">
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/registro" className="btn btn-primary btn-sm">Registro</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}