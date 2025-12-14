import { useEffect, useMemo, useState } from 'react'
import { getProductos} from '../services/productService'
import ProductCard from '../components/ProductCard'

export default function Productos() {
    // 1. Estados necesarios
    const [q, setQ] = useState(''); // Estado para la búsqueda
    const [cat, setCat] = useState(''); // Estado para la categoría seleccionada
    const [productos, setProductos] = useState([]); // Estado para almacenar TODOS los productos
    const [categorias, setCategorias] = useState<string[]>([]);// Estado para las categorías

    // 2. Cargar productos y categorías al inicio (useEffect)
    useEffect(() => {
        const fetchData = async () => {
            // Cargar productos del Microservicio (8081)
            const allProducts = await getProductos();
            setProductos(allProducts);

            // Extraer categorías únicas (puedes hacer esta lógica en el frontend por ahora)
            const uniqueCats = [...new Set(allProducts.map((p: any) => p.categoria))];
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

    }, [productos, q, cat]); // Dependencias: Si cambia la lista original, la búsqueda o la categoría

    return (
        <section className="container-narrow">
            <h1 className="h3 mb-3">Productos</h1>
            {/* ... (Resto del JSX: Input de Búsqueda y Select de Categoría) ... */}

            <div className="row g-3">
                {/* 4. Mapear la lista FILTRADA */}
                {filteredProducts.map((p: any) => (
                    <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                        <ProductCard producto={p} />
                    </div>
                ))}
            </div>
        </section>
    );
}
