import { motion } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Deep Blue / Purple Gradient Background */}
      <div className="absolute inset-0 bg-[#020617]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[128px] mix-blend-screen" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTU5IDBMMCAwTDAgNTkiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20" />

      <div className="container relative z-10 px-6 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 space-x-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">Universal List 2026 is Live</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            The Ultimate Mobile Repair <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Compatibility Engine
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instantly find cross-model compatibility for displays, batteries, flex cables, and more. Built for modern technicians.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <MagneticButton 
              variant="gradient" 
              className="w-full sm:w-auto text-lg px-10 py-5 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <Search className="w-5 h-5 mr-2" />
              Start Searching
            </MagneticButton>
            <MagneticButton variant="ghost" className="w-full sm:w-auto text-lg px-10 py-5 text-white bg-white/5 border border-white/10 hover:bg-white/10">
              Download App
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* Floating Devices Animation - Simplified for base setup */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-0 translate-y-1/2 w-full max-w-5xl mx-auto px-6 hidden md:block"
      >
        <div className="h-[40vh] bg-gradient-to-t from-[#020617] to-transparent absolute inset-0 z-20" />
        <div className="relative rounded-t-3xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl h-[400px] shadow-2xl overflow-hidden">
           {/* Mock App Interface inside Hero */}
           <div className="h-12 border-b border-white/10 flex items-center px-6 space-x-2">
             <div className="w-3 h-3 rounded-full bg-red-500/80" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
             <div className="w-3 h-3 rounded-full bg-green-500/80" />
           </div>
           <div className="p-8">
             <div className="h-12 w-full max-w-2xl bg-white/5 rounded-xl border border-white/5 mb-8" />
             <div className="grid grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5" />
                ))}
             </div>
           </div>
        </div>
      </motion.div>
    </section>
  );
};
