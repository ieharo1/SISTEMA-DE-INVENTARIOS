import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, Truck, Phone, Mail, MapPin } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Modal, PageLoader, EmptyState } from '../components/ui';
import { Card, CardContent } from '../components/ui/Card';

const SuppliersPage = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    contacto: '',
    teléfono: '',
    email: '',
    dirección: ''
  });

  const fetchSuppliers = useCallback(async () => {
    try {
      const { data } = await api.get('/catalog/suppliers');
      let sups = Array.isArray(data) ? data : data.data || [];
      if (search) {
        sups = sups.filter(s => 
          s.nombre?.toLowerCase().includes(search.toLowerCase()) ||
          s.contacto?.toLowerCase().includes(search.toLowerCase()) ||
          s.email?.toLowerCase().includes(search.toLowerCase())
        );
      }
      setSuppliers(sups);
    } catch (error) {
      toast.error('Error al cargar proveedores');
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    fetchSuppliers().finally(() => setLoading(false));
  }, [fetchSuppliers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSupplier) {
        await api.patch(`/catalog/suppliers/${editingSupplier._id}`, form);
        toast.success('Proveedor actualizado');
      } else {
        await api.post('/catalog/suppliers', form);
        toast.success('Proveedor creado');
      }
      setModalOpen(false);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSupplier) return;
    setSaving(true);
    try {
      await api.delete(`/catalog/suppliers/${deletingSupplier._id}`);
      toast.success('Proveedor eliminado');
      setDeleteModalOpen(false);
      setDeletingSupplier(null);
      fetchSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', contacto: '', teléfono: '', email: '', dirección: '' });
    setEditingSupplier(null);
  };

  const openEdit = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      nombre: supplier.nombre || '',
      contacto: supplier.contacto || '',
      teléfono: supplier.teléfono || '',
      email: supplier.email || '',
      dirección: supplier.dirección || ''
    });
    setModalOpen(true);
  };

  const canManage = user?.rol === 'admin';

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Proveedores</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona los proveedores</p>
        </div>
        {canManage && (
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="w-4 h-4" />
            Nuevo Proveedor
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Buscar proveedores..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <EmptyState
                icon={Truck}
                title="No hay proveedores"
                description="Agrega proveedores para tus productos"
                action={canManage && (
                  <Button onClick={() => setModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Nuevo Proveedor
                  </Button>
                )}
              />
            </Card>
          </div>
        ) : (
          suppliers.map((supplier) => (
            <Card key={supplier._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{supplier.nombre}</h3>
                      <p className="text-sm text-slate-500">{supplier.contacto || 'Sin contacto'}</p>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(supplier)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button
                        onClick={() => { setDeletingSupplier(supplier); setDeleteModalOpen(true); }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  {supplier.teléfono && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Phone className="w-4 h-4" />
                      {supplier.teléfono}
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Mail className="w-4 h-4" />
                      {supplier.email}
                    </div>
                  )}
                  {supplier.dirección && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {supplier.dirección}
                    </div>
                  )}
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
        title={editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
            label="Contacto"
            value={form.contacto}
            onChange={(e) => setForm({ ...form, contacto: e.target.value })}
            placeholder="Nombre de contacto"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Teléfono"
              type="tel"
              value={form.teléfono}
              onChange={(e) => setForm({ ...form, teléfono: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Dirección
            </label>
            <textarea
              value={form.dirección}
              onChange={(e) => setForm({ ...form, dirección: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Dirección del proveedor"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {editingSupplier ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeletingSupplier(null); }}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            ¿Estás seguro de eliminar el proveedor <strong>{deletingSupplier?.nombre}</strong>?
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

export default SuppliersPage;
