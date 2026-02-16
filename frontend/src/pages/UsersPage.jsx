import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, Users as UsersIcon, Shield, Mail, Calendar } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Modal, PageLoader, EmptyState, Badge } from '../components/ui';
import { Card, CardContent } from '../components/ui/Card';

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    teléfono: '',
    contraseña: '',
    rol: 'empleado'
  });

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterRole) params.append('rol', filterRole);
      
      const { data } = await api.get(`/users?${params}`);
      let usrs = Array.isArray(data) ? data : data.data || [];
      setUsers(usrs);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    }
  }, [search, filterRole]);

  useEffect(() => {
    setLoading(true);
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        await api.patch(`/users/${editingUser._id}`, form);
        toast.success('Usuario actualizado');
      } else {
        await api.post('/users', form);
        toast.success('Usuario creado');
      }
      setModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    if (deletingUser._id === currentUser._id) {
      toast.error('No puedes eliminarte a ti mismo');
      return;
    }
    setSaving(true);
    try {
      await api.delete(`/users/${deletingUser._id}`);
      toast.success('Usuario eliminado');
      setDeleteModalOpen(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.patch(`/users/${user._id}`, { estado: user.estado === 'activo' ? 'inactivo' : 'activo' });
      toast.success(`Usuario ${user.estado === 'activo' ? 'desactivado' : 'activado'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Error al cambiar estado');
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', email: '', teléfono: '', contraseña: '', rol: 'empleado' });
    setEditingUser(null);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      nombre: user.nombre || '',
      email: user.email || '',
      teléfono: user.teléfono || '',
      contraseña: '',
      rol: user.rol || 'empleado'
    });
    setModalOpen(true);
  };

  const getRoleBadge = (rol) => {
    const roles = {
      admin: { variant: 'danger', label: 'Admin' },
      supervisor: { variant: 'warning', label: 'Supervisor' },
      empleado: { variant: 'info', label: 'Empleado' }
    };
    const config = roles[rol] || roles.empleado;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Usuarios</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar usuarios..."
                icon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              placeholder="Todos los roles"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              options={[
                { value: '', label: 'Todos los roles' },
                { value: 'admin', label: 'Administrador' },
                { value: 'supervisor', label: 'Supervisor' },
                { value: 'empleado', label: 'Empleado' }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <EmptyState
                icon={UsersIcon}
                title="No hay usuarios"
                description="Agrega usuarios al sistema"
                action={
                  <Button onClick={() => setModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Nuevo Usuario
                  </Button>
                }
              />
            </Card>
          </div>
        ) : (
          users.map((user) => (
            <Card key={user._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      user.rol === 'admin' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                      user.rol === 'supervisor' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                      'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                      {user.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{user.nombre}</h3>
                      {getRoleBadge(user.rol)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(user)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                    {user._id !== currentUser._id && (
                      <button
                        onClick={() => { setDeletingUser(user); setDeleteModalOpen(true); }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  {user.teléfono && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Shield className="w-4 h-4" />
                      {user.teléfono}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    Creado: {new Date(user.fechaCreacion).toLocaleDateString('es-MX')}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      user.estado === 'activo'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {user.estado === 'activo' ? 'Activo ✓' : 'Inactivo'}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre *"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <Input
            label="Email *"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Teléfono"
            value={form.teléfono}
            onChange={(e) => setForm({ ...form, teléfono: e.target.value })}
          />
          <Input
            label={editingUser ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña *'}
            type="password"
            value={form.contraseña}
            onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
            required={!editingUser}
          />
          <Select
            label="Rol *"
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            options={[
              { value: 'empleado', label: 'Empleado' },
              { value: 'supervisor', label: 'Supervisor' },
              { value: 'admin', label: 'Administrador' }
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeletingUser(null); }}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            ¿Estás seguro de eliminar al usuario <strong>{deletingUser?.nombre}</strong>?
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
