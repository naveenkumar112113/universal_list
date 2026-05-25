import { useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { CatalogSidebar } from '../components/layout/CatalogSidebar';
import { RequestModelModal } from '../components/ui/RequestModelModal';
import { Menu } from 'lucide-react';

export function CatalogLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRequestOpen = searchParams.get('request-model') === 'true';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('request-model');
    setSearchParams(newParams);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#020617] overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <CatalogSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:ml-64 ml-0 overflow-hidden relative">
        {/* Mobile top bar (only visible on mobile/tablet < lg) */}
        <header className="lg:hidden h-14 bg-white dark:bg-[#0b1329] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-20 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">U</span>
            </div>
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Universal List 2026
            </span>
          </div>
          
          <button 
            onClick={() => setSearchParams({ 'request-model': 'true' })}
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Request
          </button>
        </header>

        {/* Backdrop overlay for mobile drawer */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#020617] transition-colors duration-300">
          <Outlet />
        </main>
      </div>

      {isRequestOpen && <RequestModelModal onClose={handleClose} />}
    </div>
  );
}
