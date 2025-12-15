
import { useState, useEffect } from 'react'
import type { Producto, Usuario } from '../data/interfaces'
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productService' 
import { useAuth } from '../context/AuthContext' 


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
  const { user } = useAuth(); 
  
  // 1. ESTADO DE LA LISTA
  const [list,setList]=useState<Producto[]>([]) 
  
  // 2. ESTADO DEL FORMULARIO Y EDICIÓN
  // Define un formulario vacío para resetear/crear
  const emptyForm: Omit<Producto,'id'> = {
      nombre:'',
      descripcion:'',
      precio:0,
      stock: 0, 
      imagenUrl:'',
      categoria:'',
      oferta:false
  }
  // El estado del formulario puede ser 'Producto' (si tiene ID, estamos editando) o 'Omit<Producto, id>' (si no tiene ID, estamos creando)
  const [form,setForm]=useState<Producto|Omit<Producto,'id'>>(emptyForm) 

  // Función para establecer el modo de edición
  function startEdit(p:Producto){
      setForm(p); // ✅ Carga los datos del producto en el formulario
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }
  
  // Función para cancelar la edición y limpiar el formulario
  function cancelEdit(){
      setForm(emptyForm);
  }


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
    
    if(user?.rol !== 'admin') { 
        alert("Acceso denegado. Solo administradores pueden modificar productos."); 
        return; 
    }

    if(!form.nombre||!form.categoria) return; 
    
    try {
        // ✅ LÓGICA DE ACTUALIZACIÓN VS CREACIÓN
        if ('id' in form && form.id) {
            // Si tiene ID, es una ACTUALIZACIÓN (PUT)
            await updateProducto(form.id, form as any); 
        } else {
            // Si no tiene ID, es una CREACIÓN (POST)
            await createProducto(form as any); 
        }

        setForm(emptyForm); // Limpiar y restablecer el formulario
        refresh(); // Recargar la lista
    } catch (error) {
        console.error("Error en la operación CRUD:", error);
        alert("Fallo la operación. Revisa si tu token de ADMIN es válido o si el backend está disponible.");
    }
  }

  // 5. FUNCIÓN ASÍNCRONA PARA ELIMINAR PRODUCTO (DELETE)
  async function del(id:number){ 
    if(user?.rol !== 'admin') { 
        alert("Acceso denegado."); 
        return; 
    }
    
    try {
        if(window.confirm('¿Estás seguro de que quieres eliminar este producto?')){
            await deleteProducto(id); 
            refresh();
            if ('id' in form && form.id === id) { // Si elimina el producto que se está editando
                cancelEdit();
            }
        }
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
        // Usa PUT para actualizar solo el campo 'oferta'
        await updateProducto(p.id! ,{...p, oferta:!p.oferta} as any); 
        refresh();
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Fallo al actualizar.");
    }
  }


  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        {/* Título dinámico */}
        <h4>{('id' in form && form.id) ? 'Editar producto: ' + form.nombre : 'Crear producto'}</h4>
        <form className="vstack gap-2" onSubmit={onSubmit}>
          {/* Inputs de texto/área */}
          <input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} required/>
          <textarea className="form-control" placeholder="Descripción" rows={3} value={form.descripcion} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))}></textarea>
          
          {/* Input de Precio */}
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

          {/* Input de Stock */}
          <input 
            type="number" 
            className="form-control" 
            placeholder="Stock" 
            value={form.stock} 
            onChange={e=>setForm(f=>({...f,stock:Number(e.target.value)}))} 
            required
            min="0"
          />

          {/* Input de Categoría y URL */}
          <input className="form-control" placeholder="Categoría" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} required/>
          <input className="form-control" placeholder="URL Imagen" value={form.imagenUrl} onChange={e=>setForm(f=>({...f,imagenUrl:e.target.value}))}/>
          
          {/* Checkbox de Oferta */}
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="oferta" checked={form.oferta} onChange={e=>setForm(f=>({...f,oferta:e.target.checked}))}/>
            <label className="form-check-label" htmlFor="oferta">En Oferta</label>
          </div>

          {/* Botón Guardar / Actualizar */}
          <button className={`btn btn-${('id' in form && form.id) ? 'warning' : 'success'}`}>
              {('id' in form && form.id) ? 'Actualizar Producto' : 'Guardar Nuevo Producto'}
          </button>

          {/* Botón de Cancelar Edición */}
          {('id' in form && form.id) && (
              <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
                  Cancelar Edición
              </button>
          )}

        </form>
      </div>
      <div className="col-12 col-lg-7">
        <h4>Productos</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>ID</th><th>Nombre</th><th>Stock</th><th>Precio</th><th>Categoría</th><th>Oferta</th><th>Acciones</th></tr></thead>
            <tbody>
              {list.map(p=> (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.stock}</td>
                  <td>${p.precio}</td>
                  <td>{p.categoria}</td>
                  <td>
                    {/* Botón de Toggle Oferta */}
                    <button className={`btn btn-sm btn-outline-${p.oferta?'success':'secondary'}`} onClick={()=>toggleOffer(p)}>{p.oferta?'Sí':'No'}</button>
                  </td>
                  <td>
                      {/* ✅ Botón de Edición */}
                      <button className="btn btn-sm btn-primary me-2" onClick={()=>startEdit(p)}>Editar</button>
                      {/* Botón de Eliminación */}
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>del(p.id!)}>Eliminar</button>
                  </td>
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
    
    // MOCK FUNCTIONS - DEBERÍAN CONECTARSE A UN MICROSERVICIO DE USUARIOS (8080)
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