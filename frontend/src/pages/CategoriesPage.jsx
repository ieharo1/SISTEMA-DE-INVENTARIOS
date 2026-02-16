import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, Tags } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Modal, PageLoader, EmptyState } from '../components/ui';
import { Card, CardContent } from '../components/ui/Card';

const CategoriesPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    descripción: ''
  });

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/catalog/categories');
      let cats = Array.isArray(data) ? data : data.data || [];
      if (search) {
        cats = cats.filter(c => 
          c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
          c.descripción?.toLowerCase().includes(search.toLowerCase())
        );
      }
      setCategories(cats);
    } catch (error) {
      toast.error('Error al cargar categorías');
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    fetchCategories().finally(() => setLoading(false));
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await api.patch(`/catalog/categories/${editingCategory._id}`, form);
        toast.success('Categoría actualizada');
      } else {
        await api.post('/catalog/categories', form);
        toast.success('Categoría creada');
      }
      setModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setSaving(true);
    try {
      await api.delete(`/catalog/categories/${deletingCategory._id}`);
      toast.success('Categoría eliminada');
      setDeleteModalOpen(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', descripción: '' });
    setEditingCategory(null);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setForm({
      nombre: category.nombre || '',
      descripción: category.descripción || ''
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categorías</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona las categorías de productos</p>
        </div>
        {canManage && (
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Buscar categorías..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <EmptyState
                icon={Tags}
                title="No hay categorías"
                description="Crea categorías para organizar tus productos"
                action={canManage && (
                  <Button onClick={() => setModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                  </Button>
                )}
              />
            </Card>
          </div>
        ) : (
          categories.map((category) => (
            <Card key={category._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Tags className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{category.nombre}</h3>
                      <p className="text-sm text-slate-500">{category.descripción || 'Sin descripción'}</p>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(category)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button
                        onClick={() => { setDeletingCategory(category); setDeleteModalOpen(true); }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
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
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre *"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Descripción
            </label>
            <textarea
              value={form.descripción}
              onChange={(e) => setForm({ ...form, descripción: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Descripción de la categoría"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {editingCategory ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeletingCategory(null); }}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            ¿Estás seguro de eliminar la categoría <strong>{deletingCategory?.nombre}</strong>?
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

export default CategoriesPage;
