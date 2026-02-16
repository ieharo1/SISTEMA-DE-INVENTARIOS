import { cn } from '../../lib/utils';

function Spinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        'border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-slate-500 animate-pulse">Cargando...</p>
      </div>
    </div>
  );
}

function LoaderOverlay({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-2xl flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {message && <p className="text-slate-600 dark:text-slate-300">{message}</p>}
      </div>
    </div>
  );
}

export { Spinner, PageLoader, LoaderOverlay };
