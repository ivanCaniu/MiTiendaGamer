import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Carrito(){
  const { state, total, dispatch } = useCart()
  const totalFmt = new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(total)

  return (
    <section className="container-narrow">
      <h1 className="h3 mb-3">Carrito</h1>
      {state.items.length===0? <div className="alert alert-info">Tu carrito está vacío.</div> : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th></th></tr></thead>
            <tbody>
              {state.items.map(i=>(
                <tr key={i.id}>
                  <td>{i.nombre}</td>
                  <td>{i.qty}</td>
                  <td>{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(i.precio*i.qty)}</td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={()=>dispatch({type:'remove',id:i.id})}>Quitar</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={2} className="text-end fw-bold">Total</td><td className="fw-bold">{totalFmt}</td><td></td></tr></tfoot>
          </table>
        </div>
      )}
      <div className="d-flex gap-2">
        <Link className="btn btn-secondary" to="/">Seguir comprando</Link>
        <Link className="btn btn-primary" to="/checkout" state={{fromCart:true}}>Ir al checkout</Link>
      </div>
    </section>
  )
}
