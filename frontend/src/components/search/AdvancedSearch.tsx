import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Smartphone, CheckCircle, Database } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { searchModels, searchSuggestions } from '../../services/api';
import useDebounce from '../../hooks/useDebounce';

export function AdvancedSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  // 1. Fetch autocomplete suggestions as they type
  const { data: suggestData, isLoading: suggestLoading } = useQuery({
    queryKey: ['search-suggest', debouncedQuery],
    queryFn: () => searchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  // 2. Fetch full matching models list
  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['search-models', debouncedQuery],
    queryFn: () => searchModels(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelectModel = (_modelId: number) => {
    onClose();
    // Redirect to models page or highlights
    navigate(`/dashboard/models?q=${query}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onClose();
      navigate(`/dashboard/search?q=${encodeURIComponent(query)}`);
    }
  };

  if (!isOpen) return null;

  const suggestions = suggestData?.data || [];
  const models = modelsData?.data || [];
  const isLoading = suggestLoading || modelsLoading;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-[var(--color-card)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--color-border)] z-10 mx-4"
        >
          <div className="flex items-center px-4 py-4 border-b border-[var(--color-border)]">
            <Search className="w-6 h-6 text-gray-400 mr-3 animate-pulse" />
            <input
              autoFocus
              type="text"
              placeholder="Type model, brand (e.g. Vivo) and hit Enter..."
              className="flex-1 bg-transparent text-lg outline-none text-[var(--color-foreground)] placeholder-gray-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[var(--color-border)]/50 rounded-full transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {isLoading && query.length > 1 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mb-4"></div>
                Analyzing dynamic database...
              </div>
            ) : query.length > 1 && models.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No matching models or compatibilities found for "{query}".
              </div>
            ) : models.length > 0 ? (
              <div className="p-2 space-y-1">
                {/* Auto Suggestions Header */}
                {suggestions.length > 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-[var(--color-border)]/30 mb-1 flex items-center justify-between">
                    <span>Instant Matches</span>
                    <span className="text-[var(--color-primary)] lowercase text-[10px]">debounced auto-suggest</span>
                  </div>
                )}
                
                {suggestions.map((sug: any) => (
                  <div
                    key={`sug-${sug.id}`}
                    onClick={() => {
                      setQuery(sug.name);
                    }}
                    className="flex items-center space-x-2 px-3 py-1.5 hover:bg-[var(--color-primary)]/10 rounded-md cursor-pointer transition-colors text-sm text-gray-300"
                  >
                    <Search className="w-3.5 h-3.5 text-gray-500" />
                    <span>{sug.name}</span>
                    <span className="text-[10px] text-gray-500 bg-[var(--color-border)]/50 px-1.5 py-0.5 rounded ml-auto uppercase">
                      {sug.brand?.name}
                    </span>
                  </div>
                ))}

                {/* Full Details Header */}
                <div className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-[var(--color-border)]/30 my-2 flex items-center justify-between">
                  <span>Compatibility Ecosystem</span>
                  <span className="text-green-400 text-[10px] font-bold">dynamic databases</span>
                </div>

                {models.map((model: any) => (
                  <div 
                    key={model.id}
                    onClick={() => handleSelectModel(model.id)}
                    className="flex items-start space-x-4 p-3 hover:bg-[var(--color-border)]/45 border border-transparent hover:border-[var(--color-border)] rounded-xl cursor-pointer transition-all duration-200"
                  >
                    <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[var(--color-foreground)] flex items-center space-x-2">
                          <span>{model.name}</span>
                          {model.isVerified && (
                            <span className="text-green-500 bg-green-500/10 p-0.5 rounded-full border border-green-500/20">
                              <CheckCircle className="w-3 h-3" />
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] bg-[var(--color-primary)]/15 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-bold uppercase">
                          {model.brand?.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Category: <span className="font-semibold text-gray-300">{model.category?.name}</span>
                      </p>
                      {model.compatibilityLists && model.compatibilityLists.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {model.compatibilityLists.map((comp: any) => (
                            <span key={comp.id} className="text-[10px] bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-medium">
                              {comp.compatibleWith} {comp.connectorType ? `(${comp.connectorType})` : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Popular Search Queries</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Vivo V11', 'Vivo Y81', 'Vivo Y11', 'Vivo Y200 5G', 'Battery List'].map(term => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-2 bg-[var(--color-border)]/50 hover:bg-[var(--color-border)] hover:text-[var(--color-primary)] rounded-full text-xs font-semibold transition-all border border-[var(--color-border)]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-border)]/20 flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Press <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-gray-800">Enter</kbd> for advanced view</span>
            </div>
            <span><kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-gray-800">Esc</kbd> to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
