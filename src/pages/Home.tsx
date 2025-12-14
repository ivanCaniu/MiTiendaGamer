import Carousel from '../components/Carousel'
import React,{ useEffect, useState } from 'react' 
import CategorySection from '../components/CategorySection'
import { getProductos } from '../services/productService';
import ProductCard from '../components/ProductCard'

export default function Home() {
    // 1. Estado para almacenar los productos
    const [productos, setProductos] = useState([]);
    const [destacados, setDestacados] = useState([]); // Asumo que filtrarás los destacados

    // 2. Cargar productos usando useEffect
    useEffect(() => {
        const fetchProducts = async () => {
            const allProducts = await getProductos();
            setProductos(allProducts);
            
            // Ejemplo de lógica para "Destacados" (puedes ajustarla)
            setDestacados(allProducts.slice(0, 3)); 
        };
        fetchProducts();
    }, []);


    return (
        <div>
            <Carousel/>
            <CategorySection/>
            <section className="container-narrow">
                <h2 className="h4 mb-3">Destacados</h2>
                <div className="row g-3">
                    {/* 3. Mapear la lista de Destacados */}
                    {destacados.map((p: any) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                            <ProductCard producto={p} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
