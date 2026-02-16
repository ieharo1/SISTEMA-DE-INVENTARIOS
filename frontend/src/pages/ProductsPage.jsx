import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Package,
  AlertTriangle,
  MoreVertical,
  X
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Modal, PageLoader, EmptyState, Badge } from '../components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    descripción: '',
    SKU: '',
    categoría: '',
    proveedor: '',
    precioCompra: '',
    precioVenta: '',
    stockActual: '',
    stockMinimo: '',
    ubicación: '',
    códigoBarras: ''
  });

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterCategory) params.append('categoría', filterCategory);
      if (filterStock) params.append('stock', filterStock);
      
      const { data } = await api.get(`/products?${params}`);
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  }, [search, filterCategory, filterStock]);

  const fetchCatalog = async () => {
    try {
      const [catRes, supRes] = await Promise.all([
        api.get('/catalog/categories'),
        api.get('/catalog/suppliers')
      ]);
      setCategories(catRes.data.data || catRes.data || []);
      setSuppliers(supRes.data.data || supRes.data || []);
    } catch (error) {
      console.error('Error fetching catalog:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCatalog()]);
      setLoading(false);
    };
    init();
  }, [fetchProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        precioCompra: parseFloat(form.precioCompra) || 0,
        precioVenta: parseFloat(form.precioVenta) || 0,
        stockActual: parseInt(form.stockActual) || 0,
        stockMinimo: parseInt(form.stockMinimo) || 0
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id}`, payload);
        toast.success('Producto actualizado');
      } else {
        await api.post('/products', payload);
        toast.success('Producto creado');
      }
      setModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setSaving(true);
    try {
      await api.delete(`/products/${deletingProduct._id}`);
      toast.success('Producto eliminado');
      setDeleteModalOpen(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      descripción: '',
      SKU: '',
      categoría: '',
      proveedor: '',
      precioCompra: '',
      precioVenta: '',
      stockActual: '',
      stockMinimo: '',
      ubicación: '',
      códigoBarras: ''
    });
    setEditingProduct(null);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      nombre: product.nombre || '',
      descripción: product.descripción || '',
      SKU: product.SKU || '',
      categoría: product.categoría?._id || product.categoría || '',
      proveedor: product.proveedor?._id || product.proveedor || '',
      precioCompra: product.precioCompra || '',
      precioVenta: product.precioVenta || '',
      stockActual: product.stockActual || '',
      stockMinimo: product.stockMinimo || '',
      ubicación: product.ubicación || '',
      códigoBarras: product.códigoBarras || ''
    });
    setModalOpen(true);
  };

  const canEdit = user?.rol === 'admin' || user?.rol === 'supervisor';
  const canDelete = user?.rol === 'admin';

  const columns = [
    {
      header: 'Producto',
      accessor: 'nombre',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{row.nombre}</p>
            <p className="text-xs text-slate-500">SKU: {row.SKU}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Categoría',
      accessor: 'categoría',
      render: (row) => (
        <Badge variant="primary">{row.categoría?.nombre || 'Sin categoría'}</Badge>
      )
    },
    {
      header: 'Stock',
      accessor: 'stockActual',
      render: (row) => {
        const low = row.stockActual <= row.stockMinimo;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${low ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
              {row.stockActual}
            </span>
            {low && <AlertTriangle className="w-4 h-4 text-red-500" />}
          </div>
        );
      }
    },
    {
      header: 'Precio Compra',
      accessor: 'precioCompra',
      render: (row) => `$${parseFloat(row.precioCompra || 0).toFixed(2)}`
    },
    {
      header: 'Precio Venta',
      accessor: 'precioVenta',
      render: (row) => `$${parseFloat(row.precioVenta || 0).toFixed(2)}`
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => openEdit(row)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => { setDeletingProduct(row); setDeleteModalOpen(true); }}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Productos</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona el catálogo de productos</p>
        </div>
        {canEdit && (
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar productos..."
                icon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              placeholder="Todas las categorías"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={categories.map(c => ({ value: c._id, label: c.nombre }))}
            />
            <Select
              placeholder="Filtrar stock"
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              options={[
                { value: '', label: 'Todo el stock' },
                { value: 'bajo', label: 'Stock bajo' },
                { value: 'normal', label: 'Stock normal' },
                { value: 'agotado', label: 'Agotado' }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      icon={Package}
                      title="No hay productos"
                      description="Comienza agregando tu primer producto"
                      action={canEdit && (
                        <Button onClick={() => setModalOpen(true)} size="sm">
                          <Plus className="w-4 h-4" />
                          Agregar producto
                        </Button>
                      )}
                    />
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    {columns.map((col, cidx) => (
                      <td key={cidx} className="px-6 py-4">
                        {col.render ? col.render(product) : product[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
            <Input
              label="SKU *"
              value={form.SKU}
              onChange={(e) => setForm({ ...form, SKU: e.target.value })}
              required
            />
            <Input
              label="Descripción"
              value={form.descripción}
              onChange={(e) => setForm({ ...form, descripción: e.target.value })}
              className="md:col-span-2"
            />
            <Select
              label="Categoría"
              value={form.categoría}
              onChange={(e) => setForm({ ...form, categoría: e.target.value })}
              options={categories.map(c => ({ value: c._id, label: c.nombre }))}
              placeholder="Seleccionar categoría"
            />
            <Select
              label="Proveedor"
              value={form.proveedor}
              onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
              options={suppliers.map(s => ({ value: s._id, label: s.nombre }))}
              placeholder="Seleccionar proveedor"
            />
            <Input
              label="Precio Compra *"
              type="number"
              step="0.01"
              value={form.precioCompra}
              onChange={(e) => setForm({ ...form, precioCompra: e.target.value })}
              required
            />
            <Input
              label="Precio Venta *"
              type="number"
              step="0.01"
              value={form.precioVenta}
              onChange={(e) => setForm({ ...form, precioVenta: e.target.value })}
              required
            />
            <Input
              label="Stock Actual *"
              type="number"
              value={form.stockActual}
              onChange={(e) => setForm({ ...form, stockActual: e.target.value })}
              required
            />
            <Input
              label="Stock Mínimo *"
              type="number"
              value={form.stockMinimo}
              onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })}
              required
            />
            <Input
              label="Ubicación"
              value={form.ubicación}
              onChange={(e) => setForm({ ...form, ubicación: e.target.value })}
            />
            <Input
              label="Código de Barras"
              value={form.códigoBarras}
              onChange={(e) => setForm({ ...form, códigoBarras: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeletingProduct(null); }}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            ¿Estás seguro de eliminar el producto <strong>{deletingProduct?.nombre}</strong>?
            Esta acción no se puede deshacer.
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

export default ProductsPage;
