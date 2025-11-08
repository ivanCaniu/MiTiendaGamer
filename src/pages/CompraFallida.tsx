import { useLocation, Link } from 'react-router-dom'
export default function CompraFallida(){
  const { state } = useLocation() as { state?: { orderId:number } }
  return (
    <section className="container-narrow text-center">
      <h1 className="text-danger mb-3">No se pudo realizar el pago</h1>
      <p>Intento de orden #{state?.orderId}</p>
      <Link className="btn btn-outline-primary" to="/checkout">Intentar nuevamente</Link>
    </section>
  )
}
