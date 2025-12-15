import axios from 'axios';
import { getAuthHeaders } from './authService';
const ORDER_API_URL = "http://localhost:8082/api/v2/ordenes"; // ⚠️ ASUMIMOS PUERTO 8082

export interface OrderPayload {
    items: { productoId: number, cantidad: number, precioUnitario: number }[];
    direccion: string;
    total: number;
    // Otros campos como userId, paymentMethod...
}

export const createOrder = async (payload: OrderPayload) => {
    try {
        // Necesita el token de autenticación para saber quién es el cliente
        const headers = getAuthHeaders(); 
        
        // El Microservicio 8082 recibirá esta orden y ejecutará el descuento de stock en 8081
        const response = await axios.post(ORDER_API_URL, payload, { headers });
        return response.data;
    } catch (error) {
        console.error("Error al crear la orden:", error);
        throw error;
    }
};