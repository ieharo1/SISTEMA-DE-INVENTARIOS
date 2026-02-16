import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, ArrowUpRight, ArrowDownLeft, Filter, Package, User, Calendar } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Modal, PageLoader, EmptyState, Badge } from '../components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const MovementsPage = () => {
  const { user } = useAuth();
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    producto: '',
    tipo: 'entrada',
    cantidad: '',
    motivo: '',
    referencia: ''
  });

  const fetchMovements = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterType) params.append('tipo', filterType);
      if (filterDate) params.append('fecha', filterDate);
      
      const { data } = await api.get(`/products/movements?${params}`);
      let movs = Array.isArray(data) ? data : data.data || [];
      setMovements(movs);
    } catch (error) {
      toast.error('Error al cargar movimientos');
    }
  }, [search, filterType, filterDate]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      const prods = Array.isArray(data) ? data : data.data || [];
      setProducts(prods);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchMovements(), fetchProducts()]);
      setLoading(false);
    };
    init();
  }, [fetchMovements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/products/movements', {
        ...form,
        cantidad: parseInt(form.cantidad)
      });
      toast.success('Movimiento registrado');
      setModalOpen(false);
      resetForm();
      fetchMovements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar movimiento');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      producto: '',
      tipo: 'entrada',
      cantidad: '',
      motivo: '',
      referencia: ''
    });
  };

  const canCreate = user?.rol === 'admin' || user?.rol === 'supervisor' || user?.rol === 'empleado';

  const columns = [
    {
      header: 'Tipo',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.tipo === 'entrada' ? (
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          )}
          <Badge variant={row.tipo === 'entrada' ? 'success' : 'danger'}>
            {row.tipo === 'entrada' ? 'Entrada' : 'Salida'}
          </Badge>
        </div>
      )
    },
    {
      header: 'Producto',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-slate-400" />
          <span className="text-slate-900 dark:text-white">{row.producto?.nombre || 'Producto'}</span>
        </div>
      )
    },
    {
      header: 'Cantidad',
      render: (row) => (
        <span className={`font-medium ${row.tipo === 'entrada' ? 'text-emerald-600' : 'text-red-600'}`}>
          {row.tipo === 'entrada' ? '+' : '-'}{row.cantidad}
        </span>
      )
    },
    {
      header: 'Motivo',
      render: (row) => (
        <span className="text-slate-600 dark:text-slate-300">{row.motivo || '-'}</span>
      )
    },
    {
      header: 'Usuario',
      render: (row) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300">{row.usuario?.nombre || 'Usuario'}</span>
        </div>
      )
    },
    {
      header: 'Fecha',
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar className="w-4 h-4" />
          {new Date(row.fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Movimientos</h1>
          <p className="text-slate-500 dark:text-slate-400">Historial de entradas y salidas</p>
        </div>
        {canCreate && (
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="w-4 h-4" />
            Nuevo Movimiento
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar movimientos..."
                icon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              placeholder="Todos los tipos"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: '', label: 'Todos los tipos' },
                { value: 'entrada', label: 'Entradas' },
                { value: 'salida', label: 'Salidas' },
                { value: 'ajuste', label: 'Ajustes' }
              ]}
            />
            <Select
              placeholder="Filtrar por fecha"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              options={[
                { value: '', label: 'Todas las fechas' },
                { value: 'hoy', label: 'Hoy' },
                { value: 'semana', label: 'Esta semana' },
                { value: 'mes', label: 'Este mes' }
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
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      icon={ArrowUpRight}
                      title="No hay movimientos"
                      description="Registra el primer movimiento de inventario"
                      action={canCreate && (
                        <Button onClick={() => setModalOpen(true)} size="sm">
                          <Plus className="w-4 h-4" />
                          Nuevo movimiento
                        </Button>
                      )}
                    />
                  </td>
                </tr>
              ) : (
                movements.map((movement, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    {columns.map((col, cidx) => (
                      <td key={cidx} className="px-6 py-4">
                        {col.render(movement)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Movement Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title="Nuevo Movimiento"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Tipo de movimiento *"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            options={[
              { value: 'entrada', label: 'Entrada (Agregar stock)' },
              { value: 'salida', label: 'Salida (Reducir stock)' },
              { value: 'ajuste', label: 'Ajuste' }
            ]}
          />
          
          <Select
            label="Producto *"
            value={form.producto}
            onChange={(e) => setForm({ ...form, producto: e.target.value })}
            options={products.map(p => ({ value: p._id, label: p.nombre }))}
            placeholder="Seleccionar producto"
          />
          
          <Input
            label="Cantidad *"
            type="number"
            min="1"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
            required
          />
          
          <Input
            label="Motivo"
            value={form.motivo}
            onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            placeholder="Ej: Compra, Venta, Devolución"
          />
          
          <Input
            label="Referencia"
            value={form.referencia}
            onChange={(e) => setForm({ ...form, referencia: e.target.value })}
            placeholder="Número de factura o pedido"
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Registrar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MovementsPage;
