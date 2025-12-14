
import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api/v1'; 
const PRODUCT_API_URL = "http://localhost:8081/api/v1/productos";
const AUTH_URL = `${API_BASE_URL}/auth`;

export interface AuthResponse {
    token: string;
    nombre: string;
    rol: string;
}

// Función para el REGISTRO (POST /api/v1/auth/register)
export const registerUser = async (nombre: string, email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${AUTH_URL}/register`, {
            nombre,
            email,
            password
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al intentar registrarse.");
    }
};

// Función para el LOGIN (POST /api/v1/auth/login)
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${AUTH_URL}/login`, {
            email,
            password
        });
        return response.data; // Devuelve token, nombre, rol
    } catch (error: any) {
        // Manejo específico de credenciales incorrectas
        throw new Error(error.response?.data?.message || "Credenciales incorrectas o error de servidor.");
    }
};

export const getProductos = async () => {
    try {
        const response = await axios.get(PRODUCT_API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
};

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