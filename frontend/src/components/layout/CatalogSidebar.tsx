import { NavLink, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Grid, 
  Tag, 
  Smartphone,
  Moon,
  Sun,
  HelpCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdComponent } from '../ui/AdComponent';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Categories', path: '/categories', icon: Grid },
  { name: 'Brands', path: '/brands', icon: Tag },
  { name: 'Models', path: '/models', icon: Smartphone },
  // { name: 'Updates', path: '/updates', icon: Clock },
  // { name: 'Compare', path: '/compare', icon: GitCompare },
  // { name: 'Favorites', path: '/favorites', icon: Heart },
  // { name: 'Support', path: '/support', icon: Headphones },
];

interface CatalogSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CatalogSidebar({ isOpen, onClose }: CatalogSidebarProps) {
  const [, setSearchParams] = useSearchParams();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user prefers dark mode, default to dark since we use a dark theme often
    return document.documentElement.classList.contains('dark') || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`w-64 h-screen border-r border-[var(--color-border)] bg-[var(--color-background)] flex flex-col fixed left-0 top-0 z-40 overflow-y-auto custom-scrollbar transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white text-lg font-black">U</span>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-tight">
            Universal List 2026
          </h1>
          <p className="text-[10px] text-gray-500">Created by Makund Mobile</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-[var(--radius-sm)] transition-colors duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-catalog"
                    className="absolute left-0 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-2">
        <button
          onClick={() => {
            setSearchParams({ 'request-model': 'true' });
            onClose();
          }}
          className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/15 cursor-pointer hover:shadow-lg hover:shadow-blue-500/25"
        >
          <HelpCircle className="w-4 h-4 animate-pulse" />
          <span>Request New Model</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Download App Promo */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-xl p-4 shadow-lg">
          <h4 className="font-bold text-sm mb-1">Download App</h4>
          <p className="text-xs text-blue-200 mb-3 leading-tight">Get the Universal List App for Android</p>
          <a href="#" className="flex items-center justify-center space-x-2 bg-black/30 hover:bg-black/50 transition-colors py-2 rounded-lg text-xs font-semibold">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 01-.585-1.42V3.234c0-.528.204-1.037.584-1.42zM14.86 10.932l4.606-2.66a1.996 1.996 0 000-3.464L6.29 1.055l8.57 9.877zM4.945.719L14.07 9.844l4.025-2.325a2.593 2.593 0 00-1.258-.87L6.463.303A2.006 2.006 0 004.945.719zM15.568 11.64l4.032 2.328a2.002 2.002 0 010 3.465l-13.176 7.608a1.996 1.996 0 01-1.325.29L15.568 11.64z"/></svg>
            <span>Google Play</span>
          </a>
        </div>

        {/* Join Community Promo */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/50">
          <h4 className="font-bold text-sm mb-1">Join Community</h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-3 leading-tight">Connect with technicians and shop owners</p>
          <a href="#" className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white transition-colors py-2 rounded-lg text-xs font-semibold shadow-md shadow-emerald-500/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          </a>
        </div>

        <AdComponent 
          slotKey="sidebar" 
          previewGradient="from-indigo-900/40 via-blue-900/30 to-indigo-900/40" 
          previewName="AdSlot: Sidebar Widget"
          previewDescription="A small, responsive vertical box ad unit designed to utilize dead space in the left sidebar."
        />

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between py-2 px-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 p-1 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <motion.div 
              className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm"
              animate={{ x: isDarkMode ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {isDarkMode ? <Moon className="w-2.5 h-2.5 text-blue-600" /> : <Sun className="w-2.5 h-2.5 text-orange-500" />}
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  );
}
