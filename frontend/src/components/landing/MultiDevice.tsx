import { motion } from 'framer-motion';

export const MultiDevice = () => {
  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center min-h-[100vh]">
      <div className="text-center mb-16 z-10 max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">One Ecosystem. Every Device.</h2>
        <p className="text-xl text-slate-400">Whether you are at the repair bench on a tablet, out in the field on your phone, or managing inventory on a desktop.</p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto h-[600px] flex items-center justify-center">
        {/* Desktop Background Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="absolute z-10 w-[800px] h-[500px] bg-[#0f172a] rounded-xl border border-white/10 shadow-2xl overflow-hidden hidden md:block"
        >
          {/* Desktop Topbar */}
          <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
             <div className="w-3 h-3 rounded-full bg-slate-600" />
             <div className="w-3 h-3 rounded-full bg-slate-600" />
             <div className="w-3 h-3 rounded-full bg-slate-600" />
             <div className="ml-4 w-48 h-4 bg-white/5 rounded" />
          </div>
          {/* Desktop Content */}
          <div className="flex h-full">
            <div className="w-48 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-6 w-full bg-white/5 rounded" />)}
            </div>
            <div className="flex-1 p-6 flex flex-col gap-4">
              <div className="h-32 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-white/5" />
              <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl border border-white/5" />)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tablet Mockup (Right) */}
        <motion.div 
          initial={{ opacity: 0, x: 100, rotate: 5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute z-20 md:right-[5%] lg:right-[15%] w-[320px] md:w-[400px] h-[500px] bg-[#020617] rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Tablet Content - Data List View */}
          <div className="h-12 border-b border-white/10 flex items-center px-4 bg-white/5">
             <div className="w-24 h-4 bg-white/10 rounded" />
             <div className="ml-auto w-32 h-6 bg-black/40 rounded-full border border-white/10" />
          </div>
          <div className="p-4 flex flex-col gap-3">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 bg-white/20 rounded" />
                  <div className="h-2 w-1/2 bg-white/10 rounded" />
                </div>
                <div className="w-4 h-4 rounded-full bg-green-500/30 border border-green-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile Mockup (Left) */}
        <motion.div 
          initial={{ opacity: 0, x: -100, rotate: -5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute z-30 md:left-[10%] lg:left-[20%] top-10 w-[260px] h-[540px] bg-[#020617] rounded-[2.5rem] border-[8px] border-slate-900 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        >
          {/* Notch */}
          <div className="h-6 w-full flex justify-center absolute top-0 z-40 bg-transparent">
             <div className="w-32 h-6 bg-slate-900 rounded-b-xl" />
          </div>
          
          {/* Mobile Content */}
          <div className="flex-1 overflow-hidden pt-10 px-4 bg-gradient-to-b from-blue-900/20 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">U</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10" />
            </div>
            
            <div className="h-12 w-full bg-black/40 rounded-xl border border-white/10 mb-6" />
            
            <div className="space-y-3">
              <div className="h-24 w-full bg-white/5 rounded-2xl border border-white/5" />
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/5" />)}
              </div>
            </div>
          </div>
          
          {/* Bottom Nav */}
          <div className="h-16 bg-[#0f172a] border-t border-white/10 flex items-center justify-around px-2 z-40">
             {[1,2,3,4].map((i) => (
               <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 1 ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500'}`}>
                 <div className="w-5 h-5 bg-current rounded" />
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
