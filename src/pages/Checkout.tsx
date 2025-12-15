

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { state, total, dispatch } = useCart();
    const navigate = useNavigate();
    const [direccion, setDireccion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (state.items.length === 0 || !direccion) return;

        setLoading(true);
        
        try {
            
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            
           
            dispatch({ type: 'clear' }); 
            alert('¡Compra realizada con éxito! Revisa tu dirección: ' + direccion);
            
            // 3. Redirigir a Home o a la página de éxito
            navigate('/'); 

        } catch (error) {
            // En la simulación, esto no debería ocurrir, pero mantenemos el bloque
            console.error('Fallo el proceso de checkout simulado:', error);
            alert('Fallo al procesar tu orden.');
        } finally {
            setLoading(false);
        }
    };

    if (state.items.length === 0) {
        return <p className="container-narrow py-5 text-center">Tu carrito está vacío.</p>;
    }

    return (
        <section className="container-narrow py-5">
            <h1 className="h3 mb-4">Finalizar Compra (Simulación)</h1>
            
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
                        
                        <button type="submit" className="btn btn-success btn-lg mt-3" disabled={loading || state.items.length === 0}>
                            {loading ? 'Procesando...' : `Pagar $${new Intl.NumberFormat('es-CL').format(total)} (Simulado)`}
                        </button>
                    </form>
                </div>

                {/* Columna de Resumen del Pedido (sin cambios) */}
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