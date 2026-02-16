import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Package, Mail, Lock, Eye, EyeOff, Loader2, User, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const RegisterPage = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    teléfono: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nombre || !form.email || !form.contraseña) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    if (form.contraseña !== form.confirmarContraseña) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (form.contraseña.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register({
        nombre: form.nombre,
        email: form.email,
        teléfono: form.teléfono,
        contraseña: form.contraseña
      });
      toast.success('Cuenta creada exitosamente');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-500 p-12 flex-col justify-between relative overflow-hidden">
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
            Únete a nuestro<br />sistema de inventario
          </h2>
          <p className="text-blue-100 text-lg max-w-md">
            Comience a gestionar sus productos y movimientos de manera eficiente.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <span>Gestión de productos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <span>Reportes avanzados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white">Inventario</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Empresarial</p>
            </div>
          </div>

          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Crear cuenta
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Complete el formulario para registrarse
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre completo"
                type="text"
                placeholder="Juan Pérez"
                icon={User}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                autoComplete="name"
              />

              <Input
                label="Correo electrónico"
                type="email"
                placeholder="correo@empresa.com"
                icon={Mail}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />

              <Input
                label="Teléfono (opcional)"
                type="tel"
                placeholder="+1 234 567 8900"
                icon={Phone}
                value={form.teléfono}
                onChange={(e) => setForm({ ...form, teléfono: e.target.value })}
                autoComplete="tel"
              />

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={Lock}
                  value={form.contraseña}
                  onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Input
                label="Confirmar contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={form.confirmarContraseña}
                onChange={(e) => setForm({ ...form, confirmarContraseña: e.target.value })}
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                ¿Ya tiene cuenta?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </Card>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2024 Sistema de Inventarios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
