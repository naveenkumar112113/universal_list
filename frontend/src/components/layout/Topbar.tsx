import { Bell, Search as SearchIcon, User, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdvancedSearch } from '../search/AdvancedSearch';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 border-b border-[var(--color-border)] glass-panel sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-[var(--color-foreground)] opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] focus:outline-none shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        <div 
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 flex-1 ${
            searchFocused 
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 bg-transparent' 
              : 'border-[var(--color-border)] bg-[var(--color-input)]/50'
          }`}
        >
          <SearchIcon className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Quick search models, parts (Ctrl+K)..."
            className="bg-transparent border-none outline-none w-full text-sm text-[var(--color-foreground)] placeholder-gray-500 cursor-pointer"
            readOnly
            onClick={() => setIsSearchOpen(true)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      <AdvancedSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-[var(--color-border)]/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-medium shadow-lg">
            {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
