import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, ChevronRight, Smartphone } from 'lucide-react';

export const LiveSearchDemo = () => {
  const [query, setQuery] = useState('Vivo V11');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const results = [
    { model: 'Vivo V11', compatibleWith: ['Vivo V11 Pro', 'Vivo Z3i', 'Vivo Y97', 'Vivo Z3'], brand: 'VIVO', match: '100%' },
    { model: 'Vivo V11i', compatibleWith: ['Vivo Y81', 'Vivo Y83'], brand: 'VIVO', match: '85%' },
  ];

  useEffect(() => {
    // Animate typing effect for demo
    const text = 'Vivo V11 Display';
    let currentText = '';
    let i = 0;
    
    setIsSearching(true);
    setShowResults(false);
    
    const interval = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setQuery(currentText);
        i++;
      } else {
        clearInterval(interval);
        setIsSearching(false);
        setShowResults(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-[#0f172a] relative border-y border-white/5">
      <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 space-x-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live Compatibility Engine Demo
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Instant Answers. No Guesswork.</h2>
          <p className="text-slate-400 text-lg">See how fast the engine finds cross-compatible parts across thousands of models.</p>
        </div>

        <div className="bg-[#020617] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Search Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
              placeholder="Search model here..."
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Results Dropdown Area */}
          <div className="min-h-[300px] bg-[#0f172a] rounded-xl border border-white/5 overflow-hidden">
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col"
                >
                  <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Compatibility Results for "{query}"
                  </div>
                  
                  {results.map((result, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-bold text-lg">{result.model}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">{result.brand}</span>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-sm text-slate-400 mr-1">Compatible with:</span>
                            {result.compatibleWith.map((compat, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm flex items-center gap-1">
                                {compat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
                            {result.match} Match
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="p-4 flex justify-center bg-white/[0.01]">
                    <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                      View all 12 results
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
