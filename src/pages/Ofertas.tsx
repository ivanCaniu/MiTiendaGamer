import { getOfertas } from '../dataService'
import ProductCard from '../components/ProductCard'

export default function Ofertas(){
  const list = getOfertas()
  return (
    <section className="container-narrow">
      <h1 className="h3 mb-3">Ofertas</h1>
      <div className="row g-3">
        {list.map(p=>(<div className="col-12 col-sm-6 col-lg-4" key={p.id}><ProductCard producto={p}/></div>))}
      </div>
    </section>
  )
}
