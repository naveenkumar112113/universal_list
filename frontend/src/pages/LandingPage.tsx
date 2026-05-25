import { Link } from 'react-router-dom';
import { HeroEcosystem } from '@/components/landing/HeroEcosystem';
import { ProductPreview } from '@/components/landing/ProductPreview';
import { LiveSearchDemo } from '@/components/landing/LiveSearchDemo';
import { MultiDevice } from '@/components/landing/MultiDevice';
import { CategorySystem } from '@/components/landing/CategorySystem';
import { UpdateSystem } from '@/components/landing/UpdateSystem';
import { MobileExperience } from '@/components/landing/MobileExperience';
import { AdminPreview } from '@/components/landing/AdminPreview';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-xl font-black">U</span>
            </div>
            Universal List
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Platform</a>
            <a href="#" className="hover:text-white transition-colors">Categories</a>
            <a href="#" className="hover:text-white transition-colors">Ecosystem</a>
            <a href="#" className="hover:text-white transition-colors">Updates</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white hidden md:block">Login</Link>
            <Link to="/dashboard" className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Open App
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <HeroEcosystem />
        <LiveSearchDemo />
        <ProductPreview />
        <MultiDevice />
        <CategorySystem />
        <UpdateSystem />
        <MobileExperience />
        <AdminPreview />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#020617] py-12">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <div className="flex items-center justify-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold">U</span>
             </div>
             <span className="text-white font-bold">Universal List 2026</span>
          </div>
          <p className="text-sm">Created by Makund Mobile</p>
          <p className="text-sm mt-2">&copy; 2026 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
