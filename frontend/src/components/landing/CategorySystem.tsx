import { motion } from 'framer-motion';
import { LayoutDashboard, Battery, Smartphone, Maximize, Cpu, Power, Zap, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Display Connector', models: 245, icon: LayoutDashboard, color: 'blue' },
  { name: 'Battery', models: 210, icon: Battery, color: 'green' },
  { name: 'Combo', models: 150, icon: Smartphone, color: 'purple' },
  { name: 'Frame', models: 185, icon: Maximize, color: 'orange' },
  { name: 'Charging Flex', models: 160, icon: Zap, color: 'yellow' },
  { name: 'Touch / OCA', models: 98, icon: Smartphone, color: 'cyan' },
  { name: 'Power Flex', models: 175, icon: Power, color: 'red' },
  { name: 'Motherboard', models: 120, icon: Cpu, color: 'indigo' },
];

export const CategorySystem = () => {
  return (
    <section className="py-24 bg-[#0f172a] relative border-y border-white/5">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Organized by Component.</h2>
            <p className="text-slate-400 text-lg max-w-xl">Deep dive into specific parts. Our engine categorizes compatibility down to the micro-component level.</p>
          </div>
          <button className="flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors">
            Explore All Categories <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#020617] border border-white/10 rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-300 text-slate-300">
                  <cat.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">{cat.models} Models</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
