import { useState } from 'react'
import { getProductos, createProducto, updateProducto, deleteProducto, getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../data/dataService'
import type { Producto, Usuario } from '../data/interfaces'

export default function Admin(){
  const [tab,setTab] = useState<'productos'|'usuarios'>('productos')

  return (
    <section className="container-narrow">
      <h1 className="h3 mb-3">Panel Administrativo</h1>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${tab==='productos'?'active':''}`} onClick={()=>setTab('productos')}>Productos</button></li>
        <li className="nav-item"><button className={`nav-link ${tab==='usuarios'?'active':''}`} onClick={()=>setTab('usuarios')}>Usuarios</button></li>
      </ul>
      {tab==='productos'? <AdminProductos/> : <AdminUsuarios/>}
    </section>
  )
}

function AdminProductos(){
  const [list,setList]=useState<Producto[]>(getProductos())
  const [form,setForm]=useState<Omit<Producto,'id'>>({nombre:'',descripcion:'',precio:0,imagen:'',categoria:'',oferta:false})

  function refresh(){ setList(getProductos()) }
  function onSubmit(e:React.FormEvent){ e.preventDefault(); if(!form.nombre||!form.categoria) return; createProducto(form); setForm({nombre:'',descripcion:'',precio:0,imagen:'',categoria:'',oferta:false}); refresh() }
  function toggleOffer(p:Producto){ updateProducto(p.id,{oferta:!p.oferta}); refresh() }
  function del(id:number){ deleteProducto(id); refresh() }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <h4>Crear producto</h4>
        <form className="vstack gap-2" onSubmit={onSubmit}>
          <input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} required/>
          <textarea className="form-control" placeholder="Descripción" value={form.descripcion} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))}/>
          <input type="number" className="form-control" placeholder="Precio" value={form.precio} onChange={e=>setForm(f=>({...f,precio:Number(e.target.value)}))} required/>
          <input className="form-control" placeholder="Categoría" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} required/>
          <input className="form-control" placeholder="URL Imagen" value={form.imagen} onChange={e=>setForm(f=>({...f,imagen:e.target.value}))}/>
          <div className="form-check">
            <input id="offer" className="form-check-input" type="checkbox" checked={!!form.oferta} onChange={e=>setForm(f=>({...f,oferta:e.target.checked}))}/>
            <label className="form-check-label" htmlFor="offer">En oferta</label>
          </div>
          <button className="btn btn-success">Guardar</button>
        </form>
      </div>
      <div className="col-12 col-lg-7">
        <h4>Productos</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Oferta</th><th></th></tr></thead>
            <tbody>
              {list.map(p=>(
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(p.precio)}</td>
                  <td><button className="btn btn-sm btn-outline-secondary" onClick={()=>toggleOffer(p)}>{p.oferta? 'Quitar':'Poner'}</button></td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={()=>del(p.id)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminUsuarios(){
  const [list,setList]=useState<Usuario[]>(getUsuarios())
  const [form,setForm]=useState<Omit<Usuario,'id'>>({nombre:'',email:'',rol:'cliente'})
  function refresh(){ setList(getUsuarios()) }
  function onSubmit(e:React.FormEvent){ e.preventDefault(); if(!form.nombre||!form.email) return; createUsuario(form); setForm({nombre:'',email:'',rol:'cliente'}); refresh() }
  function toggleRol(u:Usuario){ const rol = u.rol==='admin'?'cliente':'admin'; updateUsuario(u.id,{rol}); refresh() }
  function del(id:number){ deleteUsuario(id); refresh() }
  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <h4>Crear usuario</h4>
        <form className="vstack gap-2" onSubmit={onSubmit}>
          <input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} required/>
          <input type="email" className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/>
          <select className="form-select" value={form.rol} onChange={e=>setForm(f=>({...f,rol:e.target.value as any}))}>
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-success">Guardar</button>
        </form>
      </div>
      <div className="col-12 col-lg-7">
        <h4>Usuarios</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr></thead>
            <tbody>
              {list.map(u=>(
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td><button className="btn btn-sm btn-outline-secondary" onClick={()=>toggleRol(u)}>{u.rol}</button></td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={()=>del(u.id)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
