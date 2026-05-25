// Removed unused motion import
import { useQuery } from '@tanstack/react-query';
import { getCategories, getDashboardStats } from '../../services/api';
import { Link } from 'react-router-dom';
import { AdComponent } from '../../components/ui/AdComponent';
import { 
  Smartphone, 
  Battery, 
  Layers, 
  Monitor, 
  Cpu, 
  Box, 
  Zap, 
  MoreHorizontal,
  ChevronRight,
  Shield,
  Download,
  MessageCircle
} from 'lucide-react';

// Fallback data in case API fails
const mockUpdates = [
  { id: 1, date: '22/03/2026', title: 'Realme c71 combo list add' },
  { id: 2, date: '22/03/2026', title: 'X7730 Combo List add' },
  { id: 3, date: '22/03/2026', title: 'Redmi Note 10 Frame add' },
  { id: 4, date: '22/03/2026', title: 'Oppo A5 5g Combo Add' },
];

export function CatalogHomePage() {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats
  });

  const categories = categoriesData?.data || [];
  const stats = statsData?.data || { totalModels: '5000+', totalBrands: '50+' };

  const getCategoryIcon = (name: string, index: number) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('tempered') || lowerName.includes('glass')) return Shield;
    if (lowerName.includes('touch') || lowerName.includes('oca')) return Layers;
    if (lowerName.includes('display') || lowerName.includes('combo') || lowerName.includes('folder')) return Monitor;
    if (lowerName.includes('connector')) return Cpu;
    if (lowerName.includes('frame')) return Smartphone;
    if (lowerName.includes('back')) return Box;
    if (lowerName.includes('battery')) return Battery;
    if (lowerName.includes('power') || lowerName.includes('volume') || lowerName.includes('flex')) return Zap;
    if (lowerName.includes('charging') || lowerName.includes('board')) return Zap;
    
    // Default icons based on index
    const icons = [Monitor, Battery, Layers, Cpu, Box, Smartphone, Zap, Shield];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Search Bar (Mocked for layout) */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2 sm:space-x-3 text-gray-400 w-full max-w-2xl">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search models, brands, or categories..." 
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-gray-700 dark:text-gray-200"
            disabled
          />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 ml-2 sm:ml-4 shrink-0">
          <button className="relative p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border-2 border-white dark:border-gray-800 shadow-sm text-xs sm:text-sm animate-fadeIn">
            MM
          </div>
        </div>
      </div>

      <AdComponent 
        slotKey="home_top" 
        previewGradient="from-blue-600/10 via-indigo-600/5 to-purple-600/10"
        previewName="AdSlot: Home Top Banner"
        previewDescription="Displays a premium horizontal leaderboard (728x90 or fluid) between the global Search Bar and Blue Hero Card."
      />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl z-10 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
              Universal List 2026
            </h1>
            <p className="text-lg sm:text-xl font-semibold mb-2 text-blue-100">One List. All Models. Always Updated.</p>
            <p className="text-xs sm:text-sm text-blue-200/80 mb-6 leading-relaxed max-w-lg">
              Your trusted source for mobile repair compatibility data and solutions.
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 text-xs sm:text-sm w-full sm:w-auto">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Install App</span>
              </button>
              <button className="px-4 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105 text-white text-xs sm:text-sm w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>WhatsApp Community</span>
              </button>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0 flex flex-row gap-4 sm:gap-6 z-10 w-full md:w-auto justify-center">
            <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center shadow-2xl flex flex-col justify-center transform rotate-3 max-w-[140px] sm:max-w-none">
              <span className="text-2xl sm:text-3xl font-black">{stats.totalModels}</span>
              <span className="text-blue-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Models</span>
            </div>
            <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center shadow-2xl flex flex-col justify-center transform -rotate-3 mt-4 sm:mt-8 max-w-[140px] sm:max-w-none">
              <span className="text-2xl sm:text-3xl font-black">10+</span>
              <span className="text-blue-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Recent Updates</h2>
          <a href="#" className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View All Updates <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px] sm:min-w-0">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                <th className="pb-3 pl-4">Date</th>
                <th className="pb-3">Update Details</th>
                <th className="pb-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockUpdates.map((update, idx) => (
                <tr key={update.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 pl-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{update.date}</td>
                  <td className="py-4 font-medium text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex items-center space-x-3">
                    <span>{update.title}</span>
                    {idx < 2 && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[9px] sm:text-xs font-bold rounded-full uppercase tracking-wider shrink-0">
                        New
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <ChevronRight className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdComponent 
        slotKey="home_mid" 
        previewGradient="from-indigo-600/10 via-blue-600/5 to-emerald-600/10"
        previewName="AdSlot: Home Mid-Page Divider"
        previewDescription="Premium banner ad breaking up long vertical scrolls between the Recent Updates table and All Categories grid."
      />

      {/* All Categories */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Categories</h2>
        
        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat: any, idx: number) => {
              const Icon = getCategoryIcon(cat.name, idx);
              // For highlighting a specific card like the screenshot
              const isHighlighted = idx === 3; 
              
              return (
                <Link 
                  to={`/category/${cat.id}/brands`}
                  key={cat.id} 
                  className={`relative p-5 rounded-2xl border transition-all duration-300 group hover:shadow-lg flex items-start space-x-4 ${
                    isHighlighted 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 hover:-translate-y-1' 
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 text-gray-800 dark:text-gray-100'
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${
                    isHighlighted 
                      ? 'bg-white/20 text-white' 
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight mb-1">{cat.name}</h3>
                    <p className={`text-xs font-medium ${isHighlighted ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {cat.models?.length || Math.floor(Math.random() * 200) + 50} Models
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 text-gray-300 dark:text-gray-600">
                    <span className="text-xs font-bold text-gray-400">{idx + 1}.</span>
                  </div>
                </Link>
              );
            })}
            
            {/* Coming Soon Card */}
            <div className="p-5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-500 shrink-0">
                <MoreHorizontal className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-600 dark:text-gray-300 mb-1">Coming Soon</h3>
                <p className="text-xs font-medium text-gray-400">Stay Tuned</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">10K+</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Technicians</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.totalModels}</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Total Models</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">10+</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Categories</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">22/03/2026</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Latest Update</p>
        </div>
      </div>
    </div>
  );
}
