import axios from 'axios';
import type { Producto } from '../data/interfaces'; 
import { getAuthHeaders } from './authService'; 

const PRODUCT_API_URL = "http://localhost:8081/api/v1/productos"; 


export const getProductos = async (): Promise<Producto[]> => { 
    const response = await axios.get(PRODUCT_API_URL);
    return response.data;
};

export const getProductoById = async (id: string | number): Promise<Producto | null> => {
    try {
        const response = await axios.get(`${PRODUCT_API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener producto por id', error);
        return null;
    }
};


export const createProducto = async (producto: Omit<Producto, 'id'>) => {
    try {
       
        const headers = getAuthHeaders(); 
        const config = { headers: headers }; 
        const response = await axios.post(PRODUCT_API_URL, producto, config); 
        return response.data;
    } catch (error) {
        // El 403 o 401 cae aquí
        console.error("Error en createProducto:", error); 
        throw error;
    }
};

// 2. ACTUALIZAR PRODUCTO (PROTEGIDO - ADMIN)
export const updateProducto = async (id: number, producto: Partial<Producto>) => {
    try {
        const headers = getAuthHeaders();
        const config = { headers: headers }; 

        const response = await axios.put(`${PRODUCT_API_URL}/${id}`, producto, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 3. ELIMINAR PRODUCTO (PROTEGIDO - ADMIN)
export const deleteProducto = async (id: number) => {
    try {
        const headers = getAuthHeaders();
        const config = { headers: headers }; 
        
        const response = await axios.delete(`${PRODUCT_API_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};