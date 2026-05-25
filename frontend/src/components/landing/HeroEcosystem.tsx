import { motion } from 'framer-motion';
import { Search, ChevronRight, Apple, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export const HeroEcosystem = () => {
  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const placeholders = ['Search "Vivo V11 Display"...', 'Search "iPhone 13 Battery"...', 'Search "Samsung A50 Charging Flex"...'];
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setSearchPlaceholder(placeholders[i]);
      i = (i + 1) % placeholders.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617] pt-20 pb-32">
      {/* Animated Glowing Orbs Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQwIDBMMCAwTDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center px-3 py-1 space-x-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm font-medium text-blue-200">The Modern Technician's Ecosystem</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            One Engine for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Total Compatibility.
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
            Stop guessing. Instantly access the world's most accurate database for mobile repair components, directly from your dashboard or mobile app.
          </p>

          {/* Live Search Bar in Hero */}
          <motion.div 
            className="relative group max-w-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative flex items-center bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Search className="w-6 h-6 text-slate-400 ml-4" />
              <input 
                type="text" 
                placeholder={searchPlaceholder}
                className="w-full bg-transparent border-none outline-none text-white px-4 py-4 text-lg placeholder-slate-500 transition-all duration-300"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25 flex items-center">
                Search
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </motion.div>

          <div className="flex items-center gap-4 pt-4">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
              <Apple className="w-5 h-5" />
              App Store
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors backdrop-blur-md">
              <Play className="w-5 h-5" />
              Google Play
            </button>
          </div>
        </motion.div>

        {/* Right Column: Floating Device Mockups */}
        <div className="relative h-[600px] hidden lg:block perspective-1000">
          {/* Main Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, rotateY: 15, rotateX: 5, z: -100 }}
            animate={{ opacity: 1, rotateY: -5, rotateX: 2, z: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute right-0 top-10 w-[600px] h-[400px] bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col transform-gpu"
          >
            {/* Topbar */}
            <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto w-64 h-6 bg-white/5 rounded-full" />
            </div>
            {/* Sidebar + Main */}
            <div className="flex flex-1">
              <div className="w-48 bg-white/[0.02] border-r border-white/5 p-4 flex flex-col gap-2">
                <div className="h-6 w-full bg-blue-500/20 rounded mb-4" />
                {[1,2,3,4].map(i => <div key={i} className="h-4 w-3/4 bg-white/5 rounded" />)}
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="h-20 w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/5" />
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5" />)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Mobile Mockup */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-10 bottom-20 w-[240px] h-[480px] bg-[#020617] border-[6px] border-slate-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-20"
          >
            <div className="absolute top-0 w-full h-6 flex justify-center pt-2">
              <div className="w-20 h-4 bg-slate-800 rounded-full" />
            </div>
            <div className="pt-12 px-4 pb-4 h-full flex flex-col gap-4">
              <div className="h-10 w-full bg-white/10 rounded-full" />
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4].map(i => <div key={i} className="h-20 bg-blue-500/10 rounded-xl border border-blue-500/20" />)}
              </div>
              <div className="flex-1 bg-white/5 rounded-xl mt-2 border border-white/5" />
              <div className="h-14 w-full bg-white/5 rounded-2xl flex items-center justify-around px-4">
                {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 bg-white/20 rounded-full" />)}
              </div>
            </div>
          </motion.div>

          {/* Floating Data Card */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 bottom-32 w-64 bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-30 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="w-6 h-6 bg-green-500 rounded-full" />
            </div>
            <div>
              <p className="text-white font-medium">100% Match Found</p>
              <p className="text-slate-400 text-sm">Vivo V11 Display</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
