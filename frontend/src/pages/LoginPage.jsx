import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Package, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', contraseña: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.contraseña) {
      toast.error('Por favor complete todos los campos');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      toast.success('Bienvenido al sistema');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Inventory System</h1>
              <p className="text-blue-200 text-sm">TST SOLUTIONS</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white mb-4">
            Gestiona tu inventario<br />de forma profesional
          </h2>
          <p className="text-blue-100 text-lg max-w-md">
            Control total de productos, movimientos y reportes en tiempo real.
          </p>
        </div>

        <div className="relative flex items-center gap-4 text-blue-200 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            Seguridad garantizada
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            Datos en tiempo real
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white">Inventory System</h1>
              <p className="text-xs text-blue-600 font-medium">TST SOLUTIONS</p>
            </div>
          </div>

          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Bienvenido de nuevo
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Ingrese sus credenciales para acceder
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="correo@empresa.com"
                icon={Mail}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={Lock}
                  value={form.contraseña}
                  onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Recordarme</span>
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                ¿No tiene cuenta?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Crear cuenta
                </Link>
              </p>
            </div>
          </Card>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 Inventory System by TST SOLUTIONS
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
