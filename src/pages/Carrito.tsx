import React from 'react'
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Carrito() {
    // 1. Obtener datos y funciones del carrito
    const { state, total, qty, dispatch } = useCart();
    const navigate = useNavigate();

    // Funciones de manejo de acciones
    const handleIncrease = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({ type: 'increase', id });
    }
    const handleDecrease = (id: number) => dispatch({ type: 'decrease', id });
    const handleRemove = (id: number) => dispatch({ type: 'remove', id });
    const handleClear = () => {
        if(window.confirm('¿Deseas vaciar completamente el carrito?')){
            dispatch({ type: 'clear' });
        }
    };
    
    const handleGoToCheckout = () => {
        navigate('/checkout'); // ⬅️ USAR LA FUNCIÓN NAVIGATE
    }
    

    if (state.items.length === 0) {
        return (
            <section className="container-narrow py-5 text-center">
                <h1 className="h3">Tu Carrito está Vacío 😔</h1>
                <p>Añade algunos productos geniales para empezar.</p>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/productos')}>
                    Ir a la Tienda
                </button>
            </section>
        );
    }

    // 2. Renderizado del Carrito con Productos
    return (
        <section className="container py-5">
            <h1 className="h3 mb-4">🛒 Resumen de tu Compra ({qty} ítems)</h1>
            
            <div className="row">
                <div className="col-lg-8">
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio Unitario</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.items.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img 
                                                    src={item.imagenUrl || 'https://via.placeholder.com/50'} 
                                                    alt={item.nombre} 
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }} 
                                                />
                                                {item.nombre}
                                            </div>
                                        </td>
                                        <td>${new Intl.NumberFormat('es-CL').format(item.precio)}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDecrease(item.id!)}>-</button>
                                                <span className="mx-2">{item.qty}</span>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={(e) => handleIncrease(item.id!, e)}>+</button>
                                            </div>
                                        </td>
                                        <td>
                                            <strong>${new Intl.NumberFormat('es-CL').format(item.precio * item.qty)}</strong>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.id!)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Columna de Resumen de Pago */}
                <div className="col-lg-4">
                    <div className="card shadow-sm p-4">
                        <h5 className="card-title">Resumen del Pedido</h5>
                        <hr />
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-muted">Total de Productos ({qty})</span>
                            <span className="lead">
                                <strong>${new Intl.NumberFormat('es-CL').format(total)}</strong>
                            </span>
                        </div>
                        <button className="btn btn-success btn-lg mb-2" onClick={handleGoToCheckout}
                        disabled={total === 0}>
                            Ir a Pagar
                        </button>
                        <button className="btn btn-link text-danger" onClick={handleClear}>
                            Vaciar Carrito
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}