import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface CatalogPlaceholderPageProps {
  title: string;
  description: string;
}

export function CatalogPlaceholderPage({ title, description }: CatalogPlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto flex flex-col justify-center bg-gray-50/50 dark:bg-[#020617]">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-12 shadow-sm text-center max-w-lg mx-auto space-y-6">
        <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        </div>
        
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Go Back</span>
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
