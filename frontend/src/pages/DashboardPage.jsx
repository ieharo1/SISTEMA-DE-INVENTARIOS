import { useEffect, useState } from 'react';
import {
  Package,
  AlertTriangle,
  DollarSign,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { PageLoader } from '../components/ui/Loader';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
        
        // Add notification for low stock
        if (data.productosBajoStock > 0) {
          addNotification({
            titulo: 'Alerta de Stock',
            mensaje: `Tienes ${data.productosBajoStock} productos con stock bajo`
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification]);

  if (loading) return <PageLoader />;
  if (!stats) return <div className="text-center py-12">Error al cargar datos</div>;

  const statCards = [
    {
      title: 'Total Productos',
      value: stats.totalProductos || 0,
      icon: Package,
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Bajo Stock',
      value: stats.productosBajoStock || 0,
      icon: AlertTriangle,
      color: 'red',
      change: stats.productosBajoStock > 5 ? 'Alto' : 'Normal',
      trend: stats.productosBajoStock > 5 ? 'down' : 'up'
    },
    {
      title: 'Valor Inventario',
      value: `$${(stats.valorTotalInventario || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'emerald',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Movimientos del Mes',
      value: stats.movimientosMes || 0,
      icon: ArrowLeftRight,
      color: 'indigo',
      change: '+24%',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Resumen de tu inventario en tiempo real</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas vs Salidas */}
        <Card>
          <CardHeader>
            <CardTitle>Movimientos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.entradasVsSalidas || []}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="_id" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      border: 'none', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Stock por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {stats.stockPorCategoria && stats.stockPorCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.stockPorCategoria}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="total"
                      nameKey="_id"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {stats.stockPorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <Activity className="w-8 h-8 mr-2" />
                  No hay datos disponibles
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent movements */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Producto</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Cantidad</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Usuario</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {stats.movimientosRecientes?.length > 0 ? (
                  stats.movimientosRecientes.map((mov, idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mov.tipo === 'entrada' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">
                        {mov.producto?.nombre || 'Producto'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">
                        {mov.cantidad}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">
                        {mov.usuario?.nombre || 'Usuario'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {new Date(mov.fecha).toLocaleDateString('es-MX')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No hay movimientos recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
