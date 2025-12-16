
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
        return response.data; 
    } catch (error: any) {
       
        throw new Error(error.response?.data?.message || "Credenciales incorrectas o error de servidor.");
    }
};



export function getAuthHeaders() {
    const token = localStorage.getItem('token'); 
    
    
    if (token) {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    
    return {};
}



