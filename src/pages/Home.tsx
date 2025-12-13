import Carousel from '../components/Carousel'
import CategorySection from '../components/CategorySection'
import { getProductos } from '../data/dataService'
import ProductCard from '../components/ProductCard'

export default function Home(){
  const destacados = getProductos().slice(0,6)
  return (
    <div>
      <Carousel/>
      <CategorySection/>
      <section className="container-narrow">
        <h2 className="h4 mb-3">Destacados</h2>
        <div className="row g-3">
          {destacados.map(p => (
            <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
              <ProductCard producto={p}/>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
