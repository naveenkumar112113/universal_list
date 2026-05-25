import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchModels } from '../../services/api';
import { Search, CheckCircle, Smartphone } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';

export function CatalogAllModelsPage() {
  const [, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['search-models', debouncedSearchQuery],
    queryFn: () => searchModels(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length > 1
  });

  const models = modelsData?.data || [];

  const formatCompatibilityString = (model: any) => {
    const parts = [model.name];
    if (model.aliases) {
      parts.push(...model.aliases.map((a: any) => a.aliasName));
    }
    if (model.compatibilityLists) {
      parts.push(...model.compatibilityLists.map((c: any) => c.compatibleWith));
    }
    const uniqueParts = Array.from(new Set(parts));
    return uniqueParts.join(' = ');
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto space-y-8 bg-gray-50/50 dark:bg-[#020617]">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Universal Search</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Search the complete mobile compatibility database</p>
      </div>

      {/* Big Search Input */}
      <div className="relative">
        <Search className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Type brand name or model (e.g. Vivo v28, Oppo A5)..." 
          className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Search Results */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {searchQuery.length <= 1 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center space-y-2">
            <Smartphone className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            <p className="font-semibold text-lg">Start Typing to Search</p>
            <p className="text-sm max-w-sm">Enter at least 2 characters to search across thousands of mobile compatibility lists.</p>
          </div>
        ) : modelsLoading ? (
          <div className="p-6 space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : models.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {models.map((model: any, index: number) => {
              const compString = formatCompatibilityString(model);
              return (
                <div 
                  key={model.id}
                  className="p-5 flex items-center hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <div className="mr-4 text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded text-xs font-bold uppercase tracking-wider">
                        {model.brand?.name || 'Mobile'}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 rounded text-xs font-bold uppercase tracking-wider">
                        {model.category?.name || 'Parts'}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed mt-2">
                      <span className="text-gray-400 font-normal mr-1">{index + 1}.</span> 
                      {compString}
                      {model.isVerified && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 inline-block ml-2 -mt-0.5" />
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center space-y-4">
            <Smartphone className="w-12 h-12 text-gray-300 dark:text-gray-600 animate-pulse" />
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">No compatibility lists found matching "{searchQuery}"</p>
            <p className="text-sm max-w-md text-gray-500 dark:text-gray-400">Can't find the model compatibility mapping you need? Click below to request it, and our technicians will add it to the database.</p>
            <button
              onClick={() => setSearchParams({ 'request-model': 'true' })}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Request "{searchQuery}" Compatibility List
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
