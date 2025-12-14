import { useState, useEffect } from 'react'
// 🛑 ELIMINAR: import { getProductos, createProducto, updateProducto, deleteProducto, getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../data/dataService'
import type { Producto, Usuario } from '../data/interfaces'

// ✅ NUEVAS IMPORTACIONES ASÍNCRONAS PARA PRODUCTOS (PUERTO 8081)
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productService' 
import { useAuth } from '../context/AuthContext' // Para verificar el rol de ADMIN


export default function Admin(){
  const [tab,setTab] = useState<'productos'|'usuarios'>('productos')

  return (
    <section className="container-narrow">
      <h1 className="h3 mb-3">Panel Administrativo</h1>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${tab==='productos'?'active':''}`} onClick={()=>setTab('productos')}>Productos</button></li>
        <li className="nav-item"><button className={`nav-link ${tab==='usuarios'?'active':''}`} onClick={()=>setTab('usuarios')}>Usuarios</button></li>
      </ul>
      {tab==='productos'? <AdminProductos/> : <AdminUsuarios/> }
    </section>
  )
}

function AdminProductos(){
  const { user } = useAuth(); // Obtener el usuario logueado
  
  // 1. ESTADO DE LA LISTA: Inicia vacío y se llena con useEffect
  const [list,setList]=useState<Producto[]>([]) 
  
  // 2. ESTADO DEL FORMULARIO: Se añade el campo 'stock: 0'
  const [form,setForm]=useState<Omit<Producto,'id'>>({
      nombre:'',
      descripcion:'',
      precio:0,
      stock: 0, // ✅ AÑADIDO CAMPO STOCK
      imagenUrl:'',
      categoria:'',
      oferta:false
  })

  // 3. FUNCIÓN ASÍNCRONA PARA CARGAR/REFRESCAR PRODUCTOS
  async function refresh(){ 
    const data = await getProductos(); 
    setList(data);
  }

  // Cargar productos al montar el componente
  useEffect(() => { refresh(); }, [])

  // 4. FUNCIÓN ASÍNCRONA PARA CREAR/ACTUALIZAR PRODUCTO
  async function onSubmit(e:React.FormEvent){ 
    e.preventDefault(); 
    
    // GUARDIÁN: Verificar si el usuario es ADMIN
    if(user?.rol !== 'admin') { 
        alert("Acceso denegado. Solo administradores pueden modificar productos."); 
        return; 
    }

    if(!form.nombre||!form.categoria) return; 
    
    try {
        // La lógica de creación/actualización debe estar en productService
        if (form.id) {
            // Lógica para actualizar (si tienes un botón de edición)
            await updateProducto(form.id, form as any); 
        } else {
            // Lógica para crear
            await createProducto(form as any); // LLAMADA ASÍNCRONA A 8081 CON TOKEN
        }

        // Limpiar formulario y restablecer stock
        setForm({nombre:'',descripcion:'',precio:0,stock:0,imagenUrl:'',categoria:'',oferta:false}); 
        refresh(); // Recargar la lista después de la operación
    } catch (error) {
        console.error("Error en la operación CRUD:", error);
        alert("Fallo la operación. Revisa si tu token de ADMIN es válido o si el backend está disponible.");
    }
  }

  // 5. FUNCIÓN ASÍNCRONA PARA ELIMINAR PRODUCTO
  async function del(id:number){ 
    if(user?.rol !== 'admin') { 
        alert("Acceso denegado."); 
        return; 
    }
    
    try {
        await deleteProducto(id); // LLAMADA ASÍNCRONA A 8081 CON TOKEN
        refresh();
    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Fallo al eliminar.");
    }
  }

  // 6. FUNCIÓN ASÍNCRONA PARA TOGGLE OFFER (UPDATE)
  async function toggleOffer(p:Producto){ 
    if(user?.rol !== 'admin') { 
        alert("Acceso denegado."); 
        return; 
    }
    
    try {
        // Envía solo el campo 'oferta' a actualizar
        await updateProducto(p.id! ,{oferta:!p.oferta} as any); 
        refresh();
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Fallo al actualizar.");
    }
  }


  return (
    <div className="row">
      <div className="col-12 col-lg-5">
        <h4>Crear producto</h4>
        <form className="vstack gap-2" onSubmit={onSubmit}>
          <input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} required/>
          <textarea className="form-control" placeholder="Descripción" rows={3} value={form.descripcion} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))}></textarea>
          
          <input 
            type="number" 
            className="form-control" 
            placeholder="Precio" 
            value={form.precio} 
           
            onChange={e=>setForm(f=>({...f,precio:Number(e.target.value)}))} 
            required
            step="0.01"
            min="0"
          />

          {/* ✅ NUEVO CAMPO AGREGADO: STOCK */}
          <input 
            type="number" 
            className="form-control" 
            placeholder="Stock" 
            value={form.stock} 
            
            onChange={e=>setForm(f=>({...f,stock:Number(e.target.value)}))} 
            required
            min="0"
          />

          <input className="form-control" placeholder="Categoría" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} required/>
          <input className="form-control" placeholder="URL Imagen" value={form.imagenUrl} onChange={e=>setForm(f=>({...f,imagenUrl:e.target.value}))}/>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="oferta" checked={form.oferta} onChange={e=>setForm(f=>({...f,oferta:e.target.checked}))}/>
            <label className="form-check-label" htmlFor="oferta">En Oferta</label>
          </div>
          <button className="btn btn-success">{form.id? 'Actualizar' : 'Guardar'}</button>
        </form>
      </div>
      <div className="col-12 col-lg-7">
        <h4>Productos</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>ID</th><th>Nombre</th><th>Stock</th><th>Precio</th><th>Categoría</th><th>Oferta</th><th></th></tr></thead>
            <tbody>
              {list.map(p=> (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.stock}</td> {/* ✅ MOSTRAR STOCK EN LA TABLA */}
                  <td>${p.precio}</td>
                  <td>{p.categoria}</td>
                  <td><button className={`btn btn-sm btn-outline-${p.oferta?'success':'secondary'}`} onClick={()=>toggleOffer(p)}>{p.oferta?'Sí':'No'}</button></td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={()=>del(p.id!)}>Eliminar</button></td>
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
    
    const mockGetUsuarios = () => { /* tu logica de dataService.getUsuarios() */ return [] as Usuario[] }
    const mockToggleRol = (u: Usuario) => { /* tu logica de dataService.updateUsuario() */ }
    const mockDel = (id: number) => { /* tu logica de dataService.deleteUsuario() */ }
    const mockCreate = (u: any) => { /* tu logica de dataService.createUsuario() */ }


    const [list,setList]=useState<Usuario[]>(mockGetUsuarios())
    const [form,setForm]=useState<Omit<Usuario,'id'>>({nombre:'',email:'',rol:'cliente'})

    function refresh(){ setList(mockGetUsuarios()) }
    function onSubmit(e:React.FormEvent){ e.preventDefault(); if(!form.nombre||!form.email) return; mockCreate(form); setForm({nombre:'',email:'',rol:'cliente'}); refresh() }
    function toggleRol(u:Usuario){ mockToggleRol(u); refresh() }
    function del(id:number){ mockDel(id); refresh() }
    
    return (
      <div className="row">
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