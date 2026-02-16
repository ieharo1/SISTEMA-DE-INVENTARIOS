import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, User, Bell, Shield, Palette, Database, Info } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [saving, setSaving] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    email: '',
    teléfono: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    contraseñaActual: '',
    nuevaContraseña: '',
    confirmarContraseña: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    stockBajo: true,
    movimientos: false
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        nombre: user.nombre || '',
        email: user.email || '',
        teléfono: user.teléfono || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/users/${user._id}`, profileForm);
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.nuevaContraseña !== passwordForm.confirmarContraseña) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (passwordForm.nuevaContraseña.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/users/${user._id}/password`, {
        contraseñaActual: passwordForm.contraseñaActual,
        nuevaContraseña: passwordForm.nuevaContraseña
      });
      toast.success('Contraseña actualizada');
      setPasswordForm({ contraseñaActual: '', nuevaContraseña: '', confirmarContraseña: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'sistema', label: 'Sistema', icon: Database }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              value={profileForm.nombre}
              onChange={(e) => setProfileForm({ ...profileForm, nombre: e.target.value })}
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            <Input
              label="Teléfono"
              value={profileForm.teléfono}
              onChange={(e) => setProfileForm({ ...profileForm, teléfono: e.target.value })}
            />
            <div className="pt-4">
              <Button type="submit" loading={saving}>
                <Save className="w-4 h-4" />
                Guardar cambios
              </Button>
            </div>
          </form>
        );

      case 'seguridad':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Contraseña actual"
              type="password"
              value={passwordForm.contraseñaActual}
              onChange={(e) => setPasswordForm({ ...passwordForm, contraseñaActual: e.target.value })}
            />
            <Input
              label="Nueva contraseña"
              type="password"
              value={passwordForm.nuevaContraseña}
              onChange={(e) => setPasswordForm({ ...passwordForm, nuevaContraseña: e.target.value })}
            />
            <Input
              label="Confirmar nueva contraseña"
              type="password"
              value={passwordForm.confirmarContraseña}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmarContraseña: e.target.value })}
            />
            <div className="pt-4">
              <Button type="submit" loading={saving}>
                <Shield className="w-4 h-4" />
                Cambiar contraseña
              </Button>
            </div>
          </form>
        );

      case 'notificaciones':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Notificaciones por email</p>
                <p className="text-sm text-slate-500">Recibe actualizaciones por correo</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Alertas de stock bajo</p>
                <p className="text-sm text-slate-500">Notifica cuando un producto está bajo</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, stockBajo: !notifications.stockBajo })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.stockBajo ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.stockBajo ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Resumen de movimientos</p>
                <p className="text-sm text-slate-500">Recibe un resumen diario de movimientos</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, movimientos: !notifications.movimientos })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.movimientos ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.movimientos ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        );

      case 'sistema':
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-slate-900 dark:text-white">Información del sistema</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Versión:</span>
                  <span className="text-slate-900 dark:text-white">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Entorno:</span>
                  <span className="text-slate-900 dark:text-white">Producción</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tu rol:</span>
                  <span className="text-slate-900 dark:text-white capitalize">{user?.rol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Última conexión:</span>
                  <span className="text-slate-900 dark:text-white">
                    {new Date().toLocaleDateString('es-MX')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración</h1>
        <p className="text-slate-500 dark:text-slate-400">Administra tu cuenta y preferencias</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <Card>
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{tabs.find(t => t.id === activeTab)?.label}</CardTitle>
              <CardDescription>
                {activeTab === 'perfil' && 'Actualiza tu información personal'}
                {activeTab === 'seguridad' && 'Gestiona tu seguridad'}
                {activeTab === 'notificaciones' && 'Configura tus preferencias'}
                {activeTab === 'sistema' && 'Información del sistema'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTab()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
