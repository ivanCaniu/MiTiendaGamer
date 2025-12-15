import React, { useEffect, useState } from 'react';
import { getProductos } from '../services/productService'; 
import ProductCard from '../components/ProductCard'; // Asumiendo que usas ProductCard

export default function Ofertas() {
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            const data = await getProductos(true); 
            setList(data);
        };
        fetchOffers();
    }, []);

    return (
        <section className="container-narrow">
            <h1 className="h3 mb-3">🔥 ¡Ofertas! 🔥</h1>
            <div className="row g-3">
                {list.map((p: any) => (
                    <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                        <ProductCard producto={p} />
                    </div>
                ))}
            </div>
            {list.length === 0 && <p className="text-center p-5">Actualmente no hay productos en oferta.</p>}
        </section>
    );
}