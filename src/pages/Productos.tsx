import { useEffect, useMemo, useState } from 'react'
import { getProductos} from '../services/productService'
import ProductCard from '../components/ProductCard'

export default function Productos() {
    // 1. Estados necesarios
    const [q, setQ] = useState(''); // Estado para la búsqueda
    const [cat, setCat] = useState(''); // Estado para la categoría seleccionada
    const [productos, setProductos] = useState([]); // Estado para almacenar TODOS los productos
    const [categorias, setCategorias] = useState<string[]>([]);// Estado para las categorías

    
    useEffect(() => {
        const fetchData = async () => {
            const allProducts = await getProductos();
            setProductos(allProducts);

            // Extraer categorías únicas (filtrando nulos)
            const uniqueCats = [...new Set(allProducts.map((p: any) => p.categoria).filter(c => c))];
            setCategorias(uniqueCats);
        };
        fetchData();
    }, []);

    // 3. Lógica de Filtrado/Búsqueda (useMemo)
    const filteredProducts = useMemo(() => {
        let list = productos;
        
        // Aplicar Búsqueda (q)
        if (q) {
            list = list.filter((p: any) => 
                p.nombre.toLowerCase().includes(q.toLowerCase())
            );
        }

        // Aplicar Filtrado por Categoría (cat)
        if (cat) {
            list = list.filter((p: any) => p.categoria === cat);
        }
        
        return list;

    }, [productos, q, cat]);

    return (
        <section className="container-narrow">
            <h1 className="h3 mb-3">Productos</h1>
            
            <div className="row g-2 mb-3">
                {/* Input de búsqueda */}
                <div className="col-md-6">
                    <input className="form-control" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)}/>
                </div>
                
                {/* Select de Categorías */}
                <div className="col-md-6">
                    <select className="form-select" value={cat} onChange={e=>setCat(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {categorias.map(c=>( // ✅ Mapear el estado 'categorias'
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row g-3">
                {/* Mapear la lista FILTRADA */}
                {filteredProducts.map((p: any) => (
                    <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                        <ProductCard producto={p} />
                    </div>
                ))}
            </div>
        </section>
    );
}
