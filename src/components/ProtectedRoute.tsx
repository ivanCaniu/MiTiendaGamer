import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JSX } from 'react';

interface Props {
  children: JSX.Element;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { user } = useAuth();


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si requiere admin y el usuario NO es admin, mandar al Home
  if (requireAdmin && user.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Si cumple todo, mostrar la página
  return children;
}