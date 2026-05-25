import { motion } from 'framer-motion';
import { Home, Search, Grid, User, Bell } from 'lucide-react';

export const MobileExperience = () => {
  return (
    <section className="py-24 bg-[#0f172a] relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Phone Mockup */}
        <div className="flex justify-center relative">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/30 rounded-full blur-[100px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-[320px] h-[650px] bg-[#020617] rounded-[3rem] border-[12px] border-slate-900 shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-10"
          >
            {/* Notch */}
            <div className="absolute top-0 w-full h-7 flex justify-center z-50">
               <div className="w-40 h-7 bg-slate-900 rounded-b-3xl" />
            </div>

            {/* App Header */}
            <div className="pt-12 pb-4 px-6 bg-gradient-to-b from-blue-900/40 to-transparent flex justify-between items-center z-40">
              <div>
                <h3 className="text-white font-bold text-lg">Universal List</h3>
                <p className="text-blue-300 text-xs">Makund Mobile</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* App Body Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6 custom-scrollbar z-30">
              
              {/* Search Bar Mobile */}
              <div className="h-12 bg-white/5 rounded-2xl flex items-center px-4 border border-white/10">
                <Search className="w-5 h-5 text-slate-400 mr-2" />
                <span className="text-slate-500 text-sm">Search models...</span>
              </div>

              {/* Install Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 relative overflow-hidden">
                 <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
                 <h4 className="text-white font-bold text-lg leading-tight relative z-10">Get the full<br/>experience</h4>
                 <button className="mt-3 px-4 py-1.5 bg-white text-blue-900 rounded-full text-xs font-bold relative z-10">
                   Install App
                 </button>
              </div>

              {/* Categories */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="text-white font-bold">Categories</h4>
                  <span className="text-blue-400 text-xs">See All</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/5 p-3 flex flex-col justify-end">
                       <div className="w-8 h-8 rounded-lg bg-blue-500/20 mb-auto" />
                       <div className="h-2 w-3/4 bg-white/20 rounded mt-2" />
                       <div className="h-1.5 w-1/2 bg-white/10 rounded mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 w-full h-20 bg-[#0f172a]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-4 z-50 rounded-t-3xl pb-2">
              {[
                { icon: Home, active: true },
                { icon: Grid, active: false },
                { icon: Search, active: false },
                { icon: User, active: false },
              ].map((item, i) => (
                <div key={i} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${item.active ? 'text-blue-400' : 'text-slate-500'}`}>
                  <item.icon className={`w-6 h-6 ${item.active ? 'fill-blue-400/20' : ''}`} />
                  {item.active && <div className="w-1 h-1 bg-blue-400 rounded-full mt-1" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Copy */}
        <div className="space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">Native Mobile Experience.</h2>
          <p className="text-xl text-slate-400">
            We know technicians work on the move. That's why Universal List is designed as a progressive web app with a flawless, native-feeling mobile interface.
          </p>
          <ul className="space-y-4 pt-4">
            {[
              "Bottom navigation for one-handed use.",
              "Swipeable lists for fast browsing.",
              "Instant search right from your pocket.",
              "Offline-capable data caching."
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
