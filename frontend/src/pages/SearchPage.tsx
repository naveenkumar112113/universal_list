import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Smartphone } from 'lucide-react';
import { searchModels } from '../services/api';
import useDebounce from '../hooks/useDebounce';
import { GlassCard } from '../components/ui/GlassCard';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['search-page', debouncedQuery],
    queryFn: () => searchModels(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Advanced Search</h1>
        <p className="text-gray-500 mt-2">Find models, parts, and detailed compatibilities across the entire database.</p>
      </div>

      <GlassCard className="p-2">
        <div className="flex items-center px-4 py-2">
          <Search className="w-6 h-6 text-gray-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search by model, brand, or compatibility (e.g., iPhone 13 Display)..."
            className="flex-1 bg-transparent text-lg outline-none text-[var(--color-foreground)] placeholder-gray-500 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </GlassCard>

      <div className="mt-8">
        {isLoading && query.length > 1 ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center p-12 text-gray-500 bg-[var(--color-card)]/50 rounded-2xl border border-[var(--color-border)]">
            No results found for "{query}". Try a different keyword or brand.
          </div>
        ) : data?.data?.length > 0 ? (
          <div className="space-y-4">
            {data.data.map((model: any) => (
              <GlassCard key={model.id} className="p-4 hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer group">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{model.name}</h3>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">
                        {model.brand?.name}
                      </span>
                    </div>
                    <p className="text-[var(--color-primary)] font-medium mt-1">
                      {model.category?.name}
                    </p>
                    
                    {model.compatibilityLists && model.compatibilityLists.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                        <p className="text-sm text-gray-500 mb-2 font-medium">Compatible Parts:</p>
                        <div className="flex flex-wrap gap-2">
                          {model.compatibilityLists.map((comp: any) => (
                            <span key={comp.id} className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-md border border-green-200 dark:border-green-800">
                              {comp.compatibleWith} {comp.type ? `(${comp.type})` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
            <GlassCard className="p-6">
              <h3 className="font-bold mb-2">Search Tips</h3>
              <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Search by exact model name (e.g., "Galaxy S23")</li>
                <li>Search by alias names</li>
                <li>Find all displays for a specific brand</li>
              </ul>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-bold mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {['iPhone 12 Pro Display', 'Samsung A51 Battery', 'Vivo Y20 Combo'].map(term => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
