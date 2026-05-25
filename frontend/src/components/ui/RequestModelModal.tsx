import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { getBrands, getCategories, requestModel } from '../../services/api';

interface RequestModelModalProps {
  onClose: () => void;
}

export function RequestModelModal({ onClose }: RequestModelModalProps) {
  const [modelName, setModelName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Queries
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const brands = brandsData?.data || [];
  const categories = categoriesData?.data || [];

  // Mutation
  const requestMutation = useMutation({
    mutationFn: requestModel,
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to submit model request');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim()) return alert('Model name is required');
    if (!brandId) return alert('Please select a brand');
    if (!categoryId) return alert('Please select a category');

    requestMutation.mutate({
      name: modelName.trim(),
      brandId: Number(brandId),
      categoryId: Number(categoryId),
      notes: notes.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />

        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Request Submitted!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              Thank you! Our technicians will map the compatibility lists for <span className="font-semibold text-gray-900 dark:text-white">{modelName}</span> soon.
            </p>
            <button 
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
            >
              Done
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request New Model</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Can't find a compatibility list? Request our team to add it.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Model Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Realme C55"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white placeholder-gray-400"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Brand</label>
                  {brandsLoading ? (
                    <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                  ) : (
                    <select
                      required
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white select-arrow"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((b: any) => (
                        <option key={b.id} value={b.id.toString()}>{b.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Category</label>
                  {categoriesLoading ? (
                    <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                  ) : (
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white select-arrow"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id.toString()}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Notes / Specific Details (Optional)</label>
                <textarea 
                  placeholder="Describe your request (e.g. Specify connector types, alternate model names, or if you need a brand not listed above)"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white placeholder-gray-400 resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={requestMutation.isPending}
                className="w-full mt-4 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{requestMutation.isPending ? 'Submitting Request...' : 'Submit Request'}</span>
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
