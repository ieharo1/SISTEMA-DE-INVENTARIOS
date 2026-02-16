import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/', 'Dashboard'],
  ['/productos', 'Productos'],
  ['/categorias', 'Categorías'],
  ['/proveedores', 'Proveedores'],
  ['/movimientos', 'Movimientos'],
  ['/reportes', 'Reportes'],
  ['/usuarios', 'Usuarios']
];

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold">Inventario Empresarial</h1>
        <div className="flex gap-4 items-center">
          <span>{user?.nombre} ({user?.rol})</span>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Salir</button>
        </div>
      </header>
      <nav className="bg-slate-700 text-white px-4 py-2 flex gap-3 flex-wrap">
        {links.map(([to, label]) => (
          <Link key={to} to={to} className="hover:underline">
            {label}
          </Link>
        ))}
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
