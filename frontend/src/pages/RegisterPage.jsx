import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ nombre: '', email: '', contraseña: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Cuenta creada');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error de registro');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="bg-white dark:bg-slate-800 p-6 rounded shadow w-full max-w-sm space-y-3">
        <h2 className="text-xl font-semibold">Registro</h2>
        <input className="w-full p-2 border rounded text-black" placeholder="Nombre" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input className="w-full p-2 border rounded text-black" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 border rounded text-black" placeholder="Contraseña" type="password" onChange={(e) => setForm({ ...form, contraseña: e.target.value })} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterPage;
