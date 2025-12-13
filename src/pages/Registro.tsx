import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!nombre.trim() || !email.trim() || !pass.trim()) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      // 2. LLAMADA ASÍNCRONA A LA FUNCIÓN REGISTER DEL CONTEXTO
      // El contexto llama al authService.ts, que a su vez llama al Backend
      const exito = await register(nombre, email, pass);
      
      if (exito) {
        // 3. Redirigir al Home después del registro exitoso (y auto-login)
        navigate('/');
      } else {
        // 4. Si el backend o el contexto devuelve 'false' (ej: email ya existe)
        setError('El correo ya está registrado o hubo un error al crear la cuenta.');
      }
    } catch (e: any) {
      // Capturar cualquier error de la API (ej: problema de conexión)
      console.error("Error en el proceso de registro:", e);
      setError(e.message || 'Error de conexión con el servidor.');
    }
  };

  return (
    <div className="container-narrow" style={{maxWidth: '400px', marginTop: '50px'}}>
      <h2 className="text-center mb-4">Crear Cuenta</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label>Nombre</label>
          <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input className="form-control" type="password" value={pass} onChange={e => setPass(e.target.value)} required />
        </div>
        <button className="btn btn-success w-100 mb-3">Registrarse</button>
        <div className="text-center">
          <small>¿Ya tienes cuenta? <Link to="/login">Ingresa aquí</Link></small>
        </div>
      </form>
    </div>
  );
}