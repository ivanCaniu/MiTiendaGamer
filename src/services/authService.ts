
import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api/v1'; 
const AUTH_URL = `${API_BASE_URL}/auth`;

export interface AuthResponse {
    token: string;
    nombre: string;
    rol: string;
}


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




