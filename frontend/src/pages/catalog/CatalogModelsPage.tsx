import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getModels, getBrands, getCategories } from '../../services/api';
import { ChevronLeft, Search, CheckCircle, FileText, ChevronRight } from 'lucide-react';
import { AdComponent } from '../../components/ui/AdComponent';

export function CatalogModelsPage() {
  const { categoryId, brandId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['models', categoryId, brandId],
    queryFn: () => getModels({ categoryId, brandId, limit: 100 })
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const category = categoriesData?.data?.find((c: any) => String(c.id) === String(categoryId));
  const brand = brandsData?.data?.find((b: any) => String(b.id) === String(brandId));
  
  const categoryName = category ? category.name : '';
  const brandName = brand ? brand.name : 'Brand';
  
  const models = modelsData?.data || [];

  const filteredModels = models.filter((model: any) => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = model.name.toLowerCase().includes(searchLower);
    const matchAlias = model.aliases?.some((a: any) => a.aliasName.toLowerCase().includes(searchLower));
    const matchCompat = model.compatibilityLists?.some((c: any) => c.compatibleWith.toLowerCase().includes(searchLower));
    return matchName || matchAlias || matchCompat;
  });

  const formatCompatibilityString = (model: any) => {
    // Collect all equivalent names
    const parts = [model.name];
    if (model.aliases) {
      parts.push(...model.aliases.map((a: any) => a.aliasName));
    }
    if (model.compatibilityLists) {
      parts.push(...model.compatibilityLists.map((c: any) => c.compatibleWith));
    }
    // Remove duplicates and join with =
    const uniqueParts = Array.from(new Set(parts));
    return uniqueParts.join(' = ');
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto space-y-6 bg-gray-50/50 dark:bg-[#020617]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {brandName} {categoryName ? `${categoryName} ` : ''}List
          </h1>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Model here..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Models List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {modelsLoading ? (
          <div className="p-6 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredModels.map((model: any, index: number) => {
              const compString = formatCompatibilityString(model);
              const isAdIndex = index === 3;
              return (
                <div key={model.id} className="flex flex-col">
                  <div 
                    className="p-4 md:p-5 flex items-center hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group border-b border-gray-100 dark:border-gray-800/50"
                  >
                    <div className="mr-4 text-blue-500 dark:text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 pr-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                          <span className="text-gray-400 font-normal mr-1">{index + 1}.</span> 
                          {compString}
                          {model.isVerified && (
                            <CheckCircle className="w-4 h-4 text-emerald-500 inline-block ml-2 -mt-0.5" />
                          )}
                        </p>
                        {!categoryId && model.category && (
                          <span className="self-start sm:self-auto px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                            {model.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                  {isAdIndex && (
                    <div className="p-4 bg-gray-50/30 dark:bg-gray-800/10 border-b border-gray-100 dark:border-gray-800/50">
                      <AdComponent 
                        slotKey="in_list"
                        previewGradient="from-indigo-600/5 via-purple-600/10 to-blue-600/5"
                        previewName="AdSlot: In-Feed Banner (VIVO connector list)"
                        previewDescription="Highly integrated in-feed banner (fluid or horizontal) appearing after the 4th item in compatibility listings."
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No models found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Load More Button */}
      {filteredModels.length > 0 && (
        <div className="flex justify-center pt-4">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
            Load More Models
          </button>
        </div>
      )}

    </div>
  );
}
