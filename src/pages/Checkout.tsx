import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Checkout(){
  const { state, total, dispatch } = useCart()
  const nav = useNavigate()
  const location = useLocation()

  useEffect(()=>{
    if(!location.state?.fromCart && state.items.length===0) nav('/')
  },[state.items, location, nav])

  function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const ok = Math.random() > 0.3
    const orderId = Date.now()
    dispatch({type:'clear'})
    nav(ok? '/compra-exitosa' : '/pago-rechazado', { state:{ orderId, total } })
  }

  const totalFmt = new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(total)

  return (
    <section className="container-narrow">
      <h1 className="h3 mb-3">Checkout</h1>
      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-md-6"><label className="form-label">Nombre</label><input className="form-control" required/></div>
        <div className="col-md-6"><label className="form-label">Apellido</label><input className="form-control" required/></div>
        <div className="col-12"><label className="form-label">Dirección</label><input className="form-control" required/></div>
        <div className="col-md-6"><label className="form-label">Ciudad</label><input className="form-control" required/></div>
        <div className="col-md-6"><label className="form-label">Región</label><input className="form-control" required/></div>
        <div className="col-12"><label className="form-label">Email</label><input type="email" className="form-control" required/></div>
        <div className="col-12"><p className="lead">Total a pagar: <strong>{totalFmt}</strong></p></div>
        <div className="col-12"><button className="btn btn-primary">Pagar</button></div>
      </form>
    </section>
  )
}
