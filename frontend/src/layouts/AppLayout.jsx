import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ArrowLeftRight,
  FileBarChart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ChevronDown,
  Home
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/productos', 'Productos', Package],
  ['/categorias', 'Categorías', Tags],
  ['/proveedores', 'Proveedores', Truck],
  ['/movimientos', 'Movimientos', ArrowLeftRight],
  ['/reportes', 'Reportes', FileBarChart],
  ['/usuarios', 'Usuarios', Users],
  ['/configuracion', 'Configuración', Settings],
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-sm">Inventario</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Empresarial</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map(([to, label, Icon]) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-blue-600 dark:text-blue-400')} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.nombre}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.rol}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80">
          <div className="flex items-center justify-between h-14 px-3 md:px-6">
            {/* Left side */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Mobile menu button with user */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-xs">
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {user?.nombre?.split(' ')[0]}
                  <ChevronDown className={cn('w-4 h-4 transition-transform', mobileMenuOpen && 'rotate-180')} />
                </button>
                
                {/* Mobile dropdown */}
                {mobileMenuOpen && (
                  <div className="absolute top-14 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 space-y-1 lg:hidden">
                    <p className="px-3 py-1 text-xs text-slate-500 capitalize">{user?.rol}</p>
                    <Link
                      to="/configuracion"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Settings className="w-4 h-4" />
                      Configuración
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>

              {/* Search - desktop */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg w-64">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 w-full"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-3 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
