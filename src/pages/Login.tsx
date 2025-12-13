import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setError('');

    try {
        const exito = await login(email, pass);
        
        if (exito) {
            // La lógica de redirección se ejecuta después de que el login asíncrono termina
            navigate('/'); 
        } else {
            setError('Credenciales incorrectas o error de servidor.');
        }
    } catch (e) {
         setError('Error de conexión o credenciales incorrectas.');
    }
};

  return (
    <div className="container-narrow" style={{maxWidth: '400px', marginTop: '50px'}}>
      <h2 className="text-center mb-4">Iniciar Sesión</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input className="form-control" type="password" value={pass} onChange={e => setPass(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100 mb-3">Entrar</button>
        <div className="text-center">
          <small>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></small>
        </div>
      </form>
    </div>
  );
}