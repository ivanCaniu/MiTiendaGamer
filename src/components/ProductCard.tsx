// src/components/ProductCard.tsx
import { Link } from 'react-router-dom'
import type { Producto } from '../data/interfaces'
import { useCart } from '../context/CartContext'

export default function ProductCard({ producto }: { producto: Producto }) {
  const { dispatch } = useCart()

  const src =
    producto.imagenUrl.startsWith('http') || producto.imagenUrl.startsWith('/')
      ? producto.imagenUrl
      : new URL(`../images/${producto.imagenUrl}`, import.meta.url).href

  const precio = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })
    .format(producto.precio)

  return (
    <div className="card h-100">
      <img
        src={src}
        className="card-img-top"
        alt={producto.nombre}
        onError={(e) => {
          console.error('No se pudo cargar la imagen:', src)
          ;(e.currentTarget as HTMLImageElement).src = '/images/placeholder.png' 
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="text-success fw-bold">{precio}</p>
        <div className="mt-auto d-flex justify-content-between">
          <button
            className="btn btn-accent btn-sm"
            onClick={() => dispatch({ type: 'add', item: producto })}
          >
            Agregar
          </button>
          <Link to={`/productos/${producto.id}`} className="btn btn-outline-light btn-sm">
            Ver
          </Link>
        </div>
      </div>
    </div>
  )
}

