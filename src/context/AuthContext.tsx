import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Usuario } from '../data/interfaces';
import { loginUser, registerUser, AuthResponse } from '../services/authService';

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, pass: string) => boolean; // Retorna true si fue exitoso
  register: (nombre: string, email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthCtx = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);


  useEffect(() => {
    const storedUser = localStorage.getItem('usuarioLogueado');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
        // LLAMADA AL BACKEND
        const response: AuthResponse = await loginUser(email, pass); 

        const rolNormalizado = response.rol.toLowerCase() as 'cliente' | 'admin';
        
        localStorage.setItem('jwtToken', response.token); 
        localStorage.setItem('usuarioLogueado', JSON.stringify({ nombre: response.nombre, rol: rolNormalizado }));
        
        setUser({ nombre: response.nombre, rol: rolNormalizado } as any); // Actualizar el estado
        return true;
    } catch (e) {
        console.error("Fallo de autenticación:", e);
        return false;
    }
};

  const register = async (nombre: string, email: string, pass: string): Promise<boolean> => {
    try {
        // LLAMADA AL BACKEND
        const response: AuthResponse = await registerUser(nombre, email, pass);

        const rolNormalizado = response.rol.toLowerCase() as 'cliente' | 'admin';
        
        localStorage.setItem('jwtToken', response.token); 
        localStorage.setItem('usuarioLogueado', JSON.stringify({ nombre: response.nombre, rol: rolNormalizado }));
        
        setUser({ nombre: response.nombre, rol: rolNormalizado } as any);
        return true;
    } catch (e) {
        console.error("Fallo de registro:", e);
        return false;
    }
};
  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuarioLogueado');
  };

  return (
    <AuthCtx.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}