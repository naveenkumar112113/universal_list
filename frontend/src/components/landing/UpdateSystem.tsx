import { motion } from 'framer-motion';
import { Activity, GitMerge, FilePlus, CheckCircle, RefreshCw } from 'lucide-react';

const updates = [
  { id: 1, type: 'add', title: 'Realme C71 Combo List Added', user: 'Admin', time: '2 hours ago', icon: FilePlus, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 2, type: 'update', title: 'X7730 Combo List Verified', user: 'Tech_Raj', time: '5 hours ago', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  { id: 3, type: 'merge', title: 'Merged 15 Vivo Models into single Compatibility ID', user: 'System', time: '1 day ago', icon: GitMerge, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 4, type: 'refresh', title: 'Database Sync Completed', user: 'System', time: '1 day ago', icon: RefreshCw, color: 'text-slate-400', bg: 'bg-slate-500/10' },
];

export const UpdateSystem = () => {
  return (
    <section className="py-24 bg-[#020617] relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">A Living, Breathing Database.</h2>
          <p className="text-slate-400 text-lg">Thousands of technicians rely on our daily updates. See what's changing in real-time.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#0f172a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">System Activity Log</h3>
                <p className="text-sm text-slate-400">Live feed of database changes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-400">Live</span>
            </div>
          </div>

          {/* Feed */}
          <div className="p-8">
            <div className="relative border-l-2 border-white/10 pl-6 space-y-10 ml-4">
              {updates.map((update) => (
                <div key={update.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[35px] top-1 w-10 h-10 rounded-full ${update.bg} border border-white/10 flex items-center justify-center ${update.color}`}>
                    <update.icon className="w-4 h-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="bg-[#020617] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors">
                    <h4 className="text-lg font-semibold text-white mb-1">{update.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white">
                          {update.user.charAt(0)}
                        </div>
                        {update.user}
                      </span>
                      <span>•</span>
                      <span>{update.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
