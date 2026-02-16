import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Download, 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  Filter
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
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Select, PageLoader } from '../components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('inventario');
  const [dateRange, setDateRange] = useState('mes');
  const [reportData, setReportData] = useState(null);

  const canExport = user?.rol === 'admin' || user?.rol === 'supervisor';

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/reports/${reportType}?rango=${dateRange}`);
      setReportData(data);
    } catch (error) {
      toast.error('Error al cargar reporte');
    } finally {
      setLoading(false);
    }
  }, [reportType, dateRange]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportReport = async (format) => {
    try {
      const response = await api.get(`/reports/${reportType}/export?formato=${format}&rango=${dateRange}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Reporte exportado en ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Error al exportar reporte');
    }
  };

  const reportTypes = [
    { value: 'inventario', label: 'Inventario Actual', icon: Package },
    { value: 'movimientos', label: 'Movimientos', icon: TrendingUp },
    { value: 'bajo-stock', label: 'Productos Bajo Stock', icon: AlertTriangle },
    { value: 'valor', label: 'Valor del Inventario', icon: DollarSign }
  ];

  const renderChart = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'inventario':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.productos}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="nombre" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="stockActual" fill="#3b82f6" name="Stock" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stockMinimo" fill="#f59e0b" name="Stock Mínimo" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'movimientos':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={reportData.movimientos}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="fecha" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="entradas" stroke="#10b981" name="Entradas" />
              <Line type="monotone" dataKey="salidas" stroke="#ef4444" name="Salidas" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bajo-stock':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={reportData.productos}
                cx="50%"
                cy="50%"
                outerRadius={150}
                dataKey="stockActual"
                nameKey="nombre"
                label={({ nombre, stockActual }) => `${nombre}: ${stockActual}`}
              >
                {reportData.productos?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'valor':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.categorias}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="nombre" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => `$${value.toLocaleString('es-MX')}`} />
              <Bar dataKey="valor" fill="#8b5cf6" name="Valor" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const renderStats = () => {
    if (!reportData?.resumen) return null;

    const stats = [
      { label: 'Total Productos', value: reportData.resumen.totalProductos, icon: Package, color: 'blue' },
      { label: 'Valor Total', value: `$${(reportData.resumen.valorTotal || 0).toLocaleString('es-MX')}`, icon: DollarSign, color: 'emerald' },
      { label: 'Bajo Stock', value: reportData.resumen.bajoStock || 0, icon: AlertTriangle, color: 'red' },
      { label: 'Movimientos', value: reportData.resumen.totalMovimientos || 0, icon: TrendingUp, color: 'indigo' }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reportes</h1>
          <p className="text-slate-500 dark:text-slate-400">Genera y exporta reportes</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Tipo de reporte
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {reportTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setReportType(type.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      reportType === type.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Período
              </label>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                options={[
                  { value: 'semana', label: 'Esta semana' },
                  { value: 'mes', label: 'Este mes' },
                  { value: 'trimestre', label: 'Este trimestre' },
                  { value: 'año', label: 'Este año' }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {renderStats()}

      {/* Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{reportTypes.find(t => t.value === reportType)?.label}</CardTitle>
          {canExport && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
                <Download className="w-4 h-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
                <Download className="w-4 h-4" />
                Excel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {reportData ? (
            renderChart()
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              <FileText className="w-8 h-8 mr-2" />
              No hay datos para mostrar
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
