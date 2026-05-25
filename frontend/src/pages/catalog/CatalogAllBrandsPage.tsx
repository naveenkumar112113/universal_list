import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBrands } from '../../services/api';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, RefreshCw, Users, ThumbsUp } from 'lucide-react';
import { CachedImage } from '../../components/ui/CachedImage';

export function CatalogAllBrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands
  });

  const brands = brandsData?.data || [];

  const filteredBrands = brands.filter((brand: any) => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto space-y-8 bg-gray-50/50 dark:bg-[#020617]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Supported Brands</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse compatibility database by brand</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search brand..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Brands Grid */}
      {brandsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBrands.length > 0 ? filteredBrands.map((brand: any) => (
            <Link 
              to={`/brand/${brand.id}/models`}
              key={brand.id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all transform hover:-translate-y-1 group"
            >
              <CachedImage 
                src={brand.logoUrl} 
                alt={brand.name} 
                className="h-10 object-contain animate-fadeIn" 
                fallback={
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 group-hover:scale-110 transition-transform uppercase tracking-tighter">
                    {brand.name}
                  </div>
                }
              />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">
                {brand.name}
              </span>
            </Link>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              No brands found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {/* Feature Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b border-gray-200 dark:border-gray-800 text-center">
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">100%<br/>Verified Data</span>
        </div>
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Regular<br/>Updates</span>
        </div>
        <div className="flex flex-col items-center">
          <Users className="w-8 h-8 text-indigo-500 mb-2" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Trusted by<br/>Technicians</span>
        </div>
        <div className="flex flex-col items-center">
          <ThumbsUp className="w-8 h-8 text-purple-500 mb-2" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Easy to<br/>Use</span>
        </div>
      </div>
    </div>
  );
}
