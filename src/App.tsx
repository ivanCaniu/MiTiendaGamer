import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Tiendas from './pages/Tiendas'
import Acerca from './pages/Acerca'
import Productos from './pages/Productos'
import Ofertas from './pages/Ofertas'
import Categorias from './pages/Categorias'
import DetalleProducto from './pages/DetalleProducto'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import CompraExitosa from './pages/CompraExitosa'
import CompraFallida from './pages/CompraFallida'
import Admin from './pages/Admin'
import { CartProvider } from './context/CartContext'

export default function App(){
  return (
    <CartProvider>
      <Navbar/>
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/nosotros" element={<Nosotros/>}/>
          <Route path="/tiendas" element={<Tiendas/>}/>
          <Route path="/acerca" element={<Acerca/>}/>
          <Route path="/productos" element={<Productos/>}/>
          <Route path="/ofertas" element={<Ofertas/>}/>
          <Route path="/categorias" element={<Categorias/>}/>
          <Route path="/productos/:id" element={<DetalleProducto/>}/>
          <Route path="/carrito" element={<Carrito/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/compra-exitosa" element={<CompraExitosa/>}/>
          <Route path="/pago-rechazado" element={<CompraFallida/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </main>
      <Footer/>
    </CartProvider>
  )
}
