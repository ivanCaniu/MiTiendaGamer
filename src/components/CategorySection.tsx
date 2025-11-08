import { Link } from 'react-router-dom'
import { getCategorias } from '../dataService'

export default function CategorySection(){
  const categorias = getCategorias()
  return (
    <section className="container-narrow mb-4">
      <h2 className="h4 mb-3">Explorar por categoría</h2>
      <div className="d-flex flex-wrap gap-2">
        {categorias.map(c => (
          <Link key={c} to={`/categorias?cat=${encodeURIComponent(c)}`} className="btn btn-outline-light btn-sm">{c}</Link>
        ))}
      </div>
    </section>
  )
}
