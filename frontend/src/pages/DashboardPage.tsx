import { motion } from 'framer-motion';
import { Smartphone, CheckCircle, Database, Percent, Clock, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { GlassCard } from '../components/ui/GlassCard';
import { getDashboardStats, getRecentUpdates } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 10000 // Refetch every 10s for live feel
  });

  const { data: updatesData, isLoading: updatesLoading } = useQuery({
    queryKey: ['recent-updates'],
    queryFn: getRecentUpdates,
    refetchInterval: 10000
  });

  const stats = statsData?.data || {
    totalModels: 0,
    totalBrands: 0,
    verifiedModels: 0,
    verifiedPercentage: 0,
    categories: [],
    trendingSearches: []
  };

  const recentUpdates = updatesData?.data || [];

  const statCards = [
    { name: 'Total Models', value: stats.totalModels, icon: Smartphone, change: 'Live DB', color: 'from-blue-500 to-cyan-500' },
    { name: 'Verified Models', value: stats.verifiedModels, icon: CheckCircle, change: '100% Accurate', color: 'from-emerald-500 to-teal-500' },
    { name: 'Supported Brands', value: stats.totalBrands, icon: Database, change: 'Active', color: 'from-violet-500 to-fuchsia-500' },
    { name: 'Verification Ratio', value: `${stats.verifiedPercentage}%`, icon: Percent, change: 'Target 100%', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="text-[var(--color-primary)] font-semibold">{user?.name}</span> ({user?.role})! Here is the latest system state.
          </p>
        </div>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <GlassCard key={i} className="p-6 h-32 animate-pulse bg-gray-800/10"><div /></GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 relative overflow-hidden group hover:border-[var(--color-primary)]/40 transition-all duration-300">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500`} />
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                  <h3 className="text-3xl font-bold mt-1 text-[var(--color-foreground)]">{stat.value}</h3>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6 h-[400px] overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Category Distribution</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {statsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-gray-800/10 rounded-lg animate-pulse" />)}
                </div>
              ) : stats.categories.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                  No category records populated in database yet.
                </div>
              ) : (
                stats.categories.map((cat: any) => (
                  <div key={cat.id} className="p-3 bg-[var(--color-card)]/40 hover:bg-[var(--color-border)]/20 border border-[var(--color-border)] rounded-xl transition-all flex items-center justify-between">
                    <span className="font-semibold text-sm">{cat.name}</span>
                    <span className="px-3 py-1 bg-[var(--color-primary)]/15 text-[var(--color-primary)] rounded-full text-xs font-bold">
                      {cat.modelCount} Models
                    </span>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Dynamic Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6 h-[400px] overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[var(--color-secondary)]" />
              <span>Recent Activity Feed</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {updatesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-800/10 rounded-lg animate-pulse" />)}
                </div>
              ) : recentUpdates.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                  No recent activities recorded.
                </div>
              ) : (
                recentUpdates.map((act: any) => (
                  <div key={act.id} className="flex items-center space-x-4 p-3.5 bg-[var(--color-card)]/40 rounded-xl hover:bg-[var(--color-border)]/25 transition-colors border border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 font-bold border border-green-500/20">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-[var(--color-foreground)]">{act.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-500">{act.date}</span>
                        <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-1.5 py-0.5 rounded uppercase">
                          {act.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
