import { motion } from 'framer-motion';
import { Users, Database, Shield, BarChart3 } from 'lucide-react';

export const AdminPreview = () => {
  return (
    <section className="py-24 bg-[#020617] relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#020617] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Enterprise-Grade Admin Control.</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Manage the entire ecosystem from a powerful, centralized command center. Add models, verify compatibility, and monitor system health.
        </p>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#0f172a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Admin Topbar */}
          <div className="h-14 bg-white/5 border-b border-white/10 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-white font-bold tracking-widest uppercase text-sm">Command Center</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-slate-400 text-sm">System Status: <span className="text-green-400 font-medium">Optimal</span></div>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-3 gap-8">
            {/* Stats Column */}
            <div className="space-y-4">
              <div className="bg-[#020617] border border-white/5 rounded-xl p-5 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                   <Database className="w-6 h-6" />
                 </div>
                 <div>
                   <div className="text-slate-400 text-sm">Total Models</div>
                   <div className="text-2xl font-bold text-white">15,482</div>
                 </div>
              </div>
              <div className="bg-[#020617] border border-white/5 rounded-xl p-5 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                   <Users className="w-6 h-6" />
                 </div>
                 <div>
                   <div className="text-slate-400 text-sm">Active Technicians</div>
                   <div className="text-2xl font-bold text-white">4,291</div>
                 </div>
              </div>
              <div className="bg-[#020617] border border-white/5 rounded-xl p-5 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                   <BarChart3 className="w-6 h-6" />
                 </div>
                 <div>
                   <div className="text-slate-400 text-sm">Daily API Requests</div>
                   <div className="text-2xl font-bold text-white">1.2M</div>
                 </div>
              </div>
            </div>

            {/* Main Data Table Mockup */}
            <div className="md:col-span-2 bg-[#020617] border border-white/5 rounded-xl flex flex-col">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                 <h4 className="text-white font-medium">Pending Verifications</h4>
                 <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors">
                   Review All
                 </button>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-3">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <div className="col-span-2">Model Merge Request</div>
                  <div>Submitted By</div>
                  <div>Action</div>
                </div>
                {/* Table Rows */}
                {[
                  { model: "Vivo Y200 5G = Vivo T3", user: "TechShop_DL", status: "review" },
                  { model: "Oppo A17k Display Match", user: "Ravi_Repairs", status: "review" },
                  { model: "Samsung A54 Battery", user: "MobileFix_99", status: "review" }
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 p-3 bg-white/5 rounded-lg items-center border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="col-span-2 text-sm text-slate-300 font-medium truncate">{row.model}</div>
                    <div className="text-xs text-slate-400">{row.user}</div>
                    <div className="flex gap-2">
                       <button className="w-7 h-7 rounded bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                         ✓
                       </button>
                       <button className="w-7 h-7 rounded bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                         ✕
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
