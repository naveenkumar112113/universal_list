import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Smartphone, 
  Settings, 
  Search,
  LogOut,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Models', path: '/dashboard/models', icon: Smartphone },
  { name: 'Brands', path: '/dashboard/brands', icon: Database },
  { name: 'Advanced Search', path: '/dashboard/search', icon: Search },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <div className={`w-64 h-screen border-r border-[var(--color-border)] bg-[var(--color-background)] glass-panel flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
          U-List 2026
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-[var(--radius-sm)] transition-colors duration-200 ${
                isActive 
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' 
                  : 'text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-8 bg-[var(--color-primary)] rounded-r-full"
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

      <div className="p-4 border-t border-[var(--color-border)]">
        {isAdmin && (
          <NavLink
            to="/dashboard/admin"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 w-full px-4 py-3 rounded-[var(--radius-sm)] transition-colors duration-200 ${
                isActive 
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' 
                  : 'text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span>Admin Settings</span>
          </NavLink>
        )}
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-[var(--radius-sm)] text-red-500 hover:bg-red-500/10 transition-colors duration-200 mt-1 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
