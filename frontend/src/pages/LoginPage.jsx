import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', contraseña: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      toast.success('Bienvenido');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error de autenticación');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="bg-white dark:bg-slate-800 p-6 rounded shadow w-full max-w-sm space-y-3">
        <h2 className="text-xl font-semibold">Iniciar sesión</h2>
        <input className="w-full p-2 border rounded text-black" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 border rounded text-black" placeholder="Contraseña" type="password" onChange={(e) => setForm({ ...form, contraseña: e.target.value })} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
        <Link to="/register" className="text-sm text-blue-500">Crear cuenta</Link>
      </form>
    </div>
  );
};

export default LoginPage;
