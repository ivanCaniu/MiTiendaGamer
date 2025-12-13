
import axios from 'axios';
// Ajusta la URL base a donde corre tu backend (generalmente 8080)
const API_BASE_URL = 'http://localhost:8080/api/v1'; 
const AUTH_URL = `${API_BASE_URL}/auth`;

// Interfaz que coincide con el AuthResponse.java de tu backend
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