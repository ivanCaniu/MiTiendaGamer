import { useMemo, useState } from 'react'
import { getCategorias, getProductosPorCategoria } from '../dataService'
import ProductCard from '../components/ProductCard'

export default function Categorias(){
  const cats = getCategorias()
  const [selected,setSelected] = useState<string>(cats[0]??'')
  const list = useMemo(()=> selected? getProductosPorCategoria(selected):[],[selected])

  return (
    <section className="container-narrow">
      <h1 className="h3 mb-3">Categorías</h1>
      {cats.length===0? <div className="alert alert-info">No hay categorías.</div> : (
        <>
          <div className="mb-3" style={{maxWidth:360}}>
            <select className="form-select" value={selected} onChange={e=>setSelected(e.target.value)}>
              {cats.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="row g-3">
            {list.map(p=>(<div className="col-12 col-sm-6 col-lg-4" key={p.id}><ProductCard producto={p}/></div>))}
          </div>
        </>
      )}
    </section>
  )
}
