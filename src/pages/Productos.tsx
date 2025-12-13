import { useMemo, useState } from 'react'
import { getProductos, getCategorias, searchProductos } from '../data/dataService'
import ProductCard from '../components/ProductCard'

export default function Productos(){
  const [q,setQ] = useState('')
  const cats = getCategorias()
  const [cat,setCat] = useState<string>('')
  const list = useMemo(()=>{
    let base = q ? searchProductos(q) : getProductos()
    if(cat) base = base.filter(p=>p.categoria===cat)
    return base
  },[q,cat])

  return (
    <section className="container-narrow">
      <h1 className="h3 mb-3">Productos</h1>
      <div className="row g-2 mb-3">
        <div className="col-md-6"><input className="form-control" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <div className="col-md-6">
          <select className="form-select" value={cat} onChange={e=>setCat(e.target.value)}>
            <option value="">Todas las categorías</option>
            {cats.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="row g-3">
        {list.map(p=>(
          <div className="col-12 col-sm-6 col-lg-4" key={p.id}><ProductCard producto={p}/></div>
        ))}
      </div>
    </section>
  )
}
