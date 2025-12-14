import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductoById } from '../services/productService'
import type { Producto } from '../data/interfaces'; 
import { useCart } from '../context/CartContext'; 

export default function DetalleProducto() {
  
    const { id } = useParams<{ id: string }>(); 
    const [producto, setProducto] = useState<Producto | null>(null); 
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    // Obtener la función DISPATCH del contexto del carrito
    const { dispatch } = useCart(); 

    // ----------------------------------------------------
    // Lógica de Carga de Datos (GET API)
    // ----------------------------------------------------
    useEffect(() => {
        if (!id) {
            navigate('/productos'); 
            return;
        }

        const fetchDetail = async () => {
            setIsLoading(true);
            const data = await getProductoById(id);
            setProducto(data);
            setIsLoading(false);
        };
        fetchDetail();
    }, [id, navigate]); 

    // ----------------------------------------------------
    // Lógica para Añadir al Carrito
    // ----------------------------------------------------
    const handleAddToCart = () => {
        if (producto) {
            
            dispatch({ type: 'add', item: producto }); 
            alert(`${producto.nombre || 'Producto'} añadido al carrito!`); 
        }
    };

    
    if (isLoading) {
        return (
            <section className="container-narrow text-center p-5">
                <p>Cargando detalles del producto...</p>
            </section>
        );
    }

    if (!producto) {
        return (
            <section className="container-narrow text-center p-5">
                <h2 className="h4">Producto no encontrado</h2>
                <button className="btn btn-primary" onClick={() => navigate('/productos')}>
                    Volver al Catálogo
                </button>
            </section>
        );
    }
    
    
    return (
        <section className="container-narrow py-5">
            <div className="row">
                <div className="col-md-6 mb-4">
                    {/* Muestra la oferta (uso de encadenamiento opcional) */}
                    {producto?.oferta && ( 
                        <span className="badge bg-danger mb-2">¡OFERTA!</span>
                    )}
                    <img 
                        // Uso de operador OR (||) para fallback de imagen
                        src={producto?.imagenUrl || 'https://via.placeholder.com/600x400.png?text=Sin+Imagen'} 
                        className="img-fluid rounded shadow-sm" 
                        alt={producto?.nombre || 'Producto'} 
                    />
                </div>
                <div className="col-md-6">
                    {/* Uso de operador OR (||) para fallback de textos */}
                    <h1 className="h2 mb-3">{producto?.nombre || 'Nombre no disponible'}</h1>
                    <p className="lead">{producto?.descripcion || 'Sin descripción'}</p>
                    <hr />
                    <p><strong>Categoría:</strong> {producto?.categoria || 'N/A'}</p>
                    <p>
                        <strong>Stock Disponible:</strong> 
                        {/* Uso de operador de fusión nula (??) para stock */}
                        <span className={(producto?.stock ?? 0) > 0 ? 'text-success' : 'text-danger'}>
                            {producto?.stock ?? 0}
                        </span> unidades
                    </p>
                    
                    <h2 className="text-success my-4 display-5">
                        {/* CRÍTICO: Verificación estricta del precio antes de formatear */}
                        {(producto?.precio != null && !isNaN(Number(producto.precio)))
                            ? `$${new Intl.NumberFormat('es-CL').format(producto.precio)}`
                            : "Precio no disponible"}
                    </h2>
                    
                    <button 
                        className="btn btn-primary btn-lg"
                        onClick={handleAddToCart} 
                        
                        disabled={(producto?.stock ?? 0) <= 0} 
                    >
                        Añadir al Carrito
                    </button>
                </div>
            </div>
        </section>
    );
}


