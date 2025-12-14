import axios from 'axios';
const PRODUCT_API_URL = "http://localhost:8081/api/v1/productos";

const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        throw new Error("No se encontró el token de autenticación.");
    }
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const getProductos = async (isOffer?: boolean) => {
    try {
        let url = PRODUCT_API_URL;
        
        if (isOffer === true) {
            url += '?oferta=true';
        }
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return []; 
    }
};

export const getProductoById = async (id: string | number) => {
    try {
        const response = await axios.get(`${PRODUCT_API_URL}/${id}`); 
        return response.data;
    } catch (error) {
        console.error(`Error al obtener producto ${id}:`, error);
        return null;
    }
};

export const createProducto = async (productoData: any) => {
    const headers = getAuthHeaders();
    const response = await axios.post(PRODUCT_API_URL, productoData, headers);
    return response.data;
};

export const updateProducto = async (id: number, productoData: any) => {
    const headers = getAuthHeaders();
    const response = await axios.put(`${PRODUCT_API_URL}/${id}`, productoData, headers);
    return response.data;
};

export const deleteProducto = async (id: number) => {
    const headers = getAuthHeaders();
    await axios.delete(`${PRODUCT_API_URL}/${id}`, headers);
};