import { useParams, Link } from 'react-router-dom'
import { getProductoById } from '../dataService'
import { useCart } from '../context/CartContext'

export default function DetalleProducto(){
  const { id } = useParams()
  const producto = id? getProductoById(Number(id)) : undefined
  const { dispatch } = useCart()

  if(!producto){
    return (<div className="container-narrow"><div className="alert alert-warning">Producto no encontrado.</div><Link to="/" className="btn btn-outline-light">Volver</Link></div>)
  }
  const price = new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(producto.precio)
  return (
    <section className="container-narrow">
      <div className="row g-4">
        <div className="col-md-6"><img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded"/></div>
        <div className="col-md-6">
          <h1 className="h3">{producto.nombre}</h1>
          <p className="text-muted">{producto.descripcion}</p>
          <p className="h4 text-success">{price}</p>
          <button className="btn btn-accent me-2" onClick={()=>dispatch({type:'add',item:producto})}>Agregar al carrito</button>
          <Link to="/carrito" className="btn btn-outline-light">Ir al carrito</Link>
        </div>
      </div>
    </section>
  )
}
