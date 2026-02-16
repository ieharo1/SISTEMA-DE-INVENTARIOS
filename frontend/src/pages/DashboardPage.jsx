import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p>Cargando dashboard...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <Card label="Total productos" value={stats.totalProductos} />
        <Card label="Bajo stock" value={stats.productosBajoStock} />
        <Card label="Valor inventario" value={`$${stats.valorTotalInventario.toFixed(2)}`} />
        <Card label="Movimientos del mes" value={stats.movimientosMes} />
      </div>
      <div className="bg-white dark:bg-slate-800 p-4 rounded shadow h-80">
        <h3 className="font-semibold mb-2">Entradas vs salidas</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.entradasVsSalidas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Card = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-800 p-3 rounded shadow">
    <p className="text-sm opacity-70">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default DashboardPage;
