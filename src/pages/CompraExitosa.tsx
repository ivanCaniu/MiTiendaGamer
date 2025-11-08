import { useLocation, Link } from 'react-router-dom'
export default function CompraExitosa(){
  const { state } = useLocation() as { state?: { orderId:number, total:number } }
  const totalFmt = new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(state?.total??0)
  return (
    <section className="container-narrow text-center">
      <h1 className="text-success mb-3">¡Compra exitosa!</h1>
      <p>Orden #{state?.orderId}</p>
      <p>Total pagado: <strong>{totalFmt}</strong></p>
      <Link className="btn btn-primary" to="/">Volver a la tienda</Link>
    </section>
  )
}
