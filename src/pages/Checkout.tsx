import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { createOrder, OrderPayload } from '../services/OrderService';

export default function Checkout() {
    const { state, total, dispatch } = useCart();
    const navigate = useNavigate();
    const [direccion, setDireccion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (state.items.length === 0 || !direccion) return;

        setLoading(true);
        
        // 1. Mapear los ítems del carrito al formato que espera el Backend de Pedidos (8082)
        const itemsPayload = state.items.map(item => ({
            productoId: item.id!,
            cantidad: item.qty,
            precioUnitario: item.precio,
        }));
        
        const payload: OrderPayload = {
            items: itemsPayload,
            direccion,
            total,
        };

        try {
            // 2. Enviar la orden al Microservicio de Pedidos (8082)
            await createOrder(payload);

            // 3. Éxito: Vaciar el carrito
            dispatch({ type: 'clear' }); 
            alert('¡Compra realizada con éxito! Recibirás un email de confirmación.');
            navigate('/'); // Redirigir a Home o a la página de éxito

        } catch (error) {
            console.error('Fallo el proceso de checkout:', error);
            alert('Fallo al procesar tu orden. Revisa el stock y que el Backend de Pedidos (8082) esté activo.');
        } finally {
            setLoading(false);
        }
    };

    if (state.items.length === 0) {
        return <p className="container-narrow py-5 text-center">Tu carrito está vacío.</p>;
    }

    return (
        <section className="container-narrow py-5">
            <h1 className="h3 mb-4">Finalizar Compra</h1>
            
            <div className="row g-5">
                {/* Columna de Formulario de Dirección */}
                <div className="col-md-6">
                    <form onSubmit={handleSubmitOrder}>
                        <h5>Información de Envío</h5>
                        <div className="mb-3">
                            <label className="form-label">Dirección Completa</label>
                            <textarea 
                                className="form-control"
                                value={direccion}
                                onChange={e => setDireccion(e.target.value)}
                                required
                            />
                        </div>
                        {/* Aquí se añadirían más campos (Ciudad, ZIP, etc.) y la forma de pago */}
                        
                        <button type="submit" className="btn btn-success btn-lg mt-3" disabled={loading || state.items.length === 0}>
                            {loading ? 'Procesando...' : `Pagar $${new Intl.NumberFormat('es-CL').format(total)}`}
                        </button>
                    </form>
                </div>

                {/* Columna de Resumen del Pedido */}
                <div className="col-md-6">
                    <h5>Resumen ({state.items.length} productos)</h5>
                    <ul className="list-group mb-3">
                        {state.items.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">{item.nombre}</h6>
                                    <small className="text-muted">{item.qty} x ${item.precio}</small>
                                </div>
                                <span className="text-muted">${new Intl.NumberFormat('es-CL').format(item.precio * item.qty)}</span>
                            </li>
                        ))}
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total (CLP)</span>
                            <strong>${new Intl.NumberFormat('es-CL').format(total)}</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}