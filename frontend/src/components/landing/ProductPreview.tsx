import { motion } from 'framer-motion';
import { LayoutDashboard, Grid, Wrench, Bell, Database, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </div>
);

const CategoryCard = ({ icon: Icon, title, models }: any) => (
  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-slate-400 text-sm">{models} Models</p>
      </div>
    </div>
  </div>
);

export const ProductPreview = () => {
  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-4xl font-bold text-white mb-4">Real Platform. Real Workflow.</h2>
          <p className="text-xl text-slate-400">Not just another search bar. A complete ecosystem designed specifically for mobile repair technicians.</p>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[800px] max-h-[80vh]"
        >
          {/* Sidebar */}
          <div className="w-64 bg-[#0a0f1d] border-r border-white/5 flex-shrink-0 flex flex-col hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b border-white/5">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-white font-bold text-lg">Universal List</span>
            </div>
            <div className="p-4 flex-1 space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
              <SidebarItem icon={Grid} label="Categories" />
              <SidebarItem icon={Database} label="Brands & Models" />
              <SidebarItem icon={Bell} label="Updates" />
              <SidebarItem icon={Wrench} label="Technician Tools" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden">
            {/* Topbar */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
              <div className="text-slate-300 font-medium">Welcome back, Technician</div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50" />
              </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              
              {/* Recent Updates Panel */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Recent Compatibility Updates</h3>
                  <button className="text-blue-400 text-sm font-medium flex items-center">View All <ChevronRight className="w-4 h-4 ml-1" /></button>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { date: 'Today', title: 'Realme C71 Combo List Added', status: 'New' },
                    { date: 'Yesterday', title: 'X7730 Combo List Updated', status: 'Updated' },
                    { date: '2 days ago', title: 'Redmi Note 10 Frame Added', status: 'Verified' }
                  ].map((update, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-slate-500 text-sm w-20">{update.date}</div>
                        <div className="text-slate-300 font-medium">{update.title}</div>
                      </div>
                      <div className="px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {update.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories Grid */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">All Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <CategoryCard icon={LayoutDashboard} title="Display Connector" models="245" />
                  <CategoryCard icon={Grid} title="Touch / OCA Glass" models="98" />
                  <CategoryCard icon={FileText} title="Folder / Display" models="150" />
                  <CategoryCard icon={Wrench} title="Frame / Middle Frame" models="185" />
                  <CategoryCard icon={Database} title="Battery List" models="210" />
                  <CategoryCard icon={CheckCircle2} title="Charging Sub Board" models="160" />
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
