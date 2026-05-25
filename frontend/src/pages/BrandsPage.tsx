import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { CachedImage } from '../components/ui/CachedImage';

export function BrandsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  // Delete Target state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setIsModalOpen(false);
      setName('');
      setLogoUrl('');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to create brand');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setIsModalOpen(false);
      setEditingBrand(null);
      setName('');
      setLogoUrl('');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to update brand');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to delete brand');
    }
  });

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setName('');
    setLogoUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: any) => {
    setEditingBrand(brand);
    setName(brand.name);
    setLogoUrl(brand.logoUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Brand name is required');
    
    const payload = {
      name: name.trim(),
      logoUrl: logoUrl.trim() || undefined
    };

    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const brands = data?.data?.filter((b: any) => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-gray-500 mt-1">Manage mobile brands in the system.</p>
        </div>
        
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-[var(--color-primary)]/30 font-semibold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center space-x-3 bg-white/5 dark:bg-black/20">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search brands..."
            className="bg-transparent border-none outline-none w-full text-sm text-[var(--color-foreground)] placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-sm font-medium text-gray-500 bg-white/5 dark:bg-black/10">
                <th className="py-4 px-6 w-24">ID</th>
                <th className="py-4 px-6">Brand Details</th>
                <th className="py-4 px-6 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-red-500">
                    Failed to load brands. Please check your connection.
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-gray-500">
                    No brands found.
                  </td>
                </tr>
              ) : (
                brands.map((brand: any, index: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    key={brand.id} 
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/20 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-gray-500">#{brand.id}</td>
                    <td className="py-4 px-6 font-medium">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0">
                          <CachedImage 
                            src={brand.logoUrl} 
                            alt={brand.name} 
                            className="w-full h-full object-contain p-1.5" 
                            fallback={
                              <span className="text-sm font-black uppercase text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-lg">
                                {brand.name.slice(0, 2)}
                              </span>
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--color-foreground)]">{brand.name}</span>
                          <span className="text-xs text-gray-500 font-medium">{brand._count?.models || 0} compatibility lists</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenEditModal(brand)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded-full transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteTarget(brand)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-full transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <h3 className="text-xl font-bold">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Brand Name
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                  placeholder="e.g. Realme, Motorola"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Logo URL (Optional)
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white/5 border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                  placeholder="e.g. https://logo.clearbit.com/realme.com"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingBrand(null);
                    setName('');
                    setLogoUrl('');
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-[var(--color-border)] cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50 cursor-pointer"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <h3 className="text-xl font-bold text-red-500">Delete Brand</h3>
            <p className="text-sm text-gray-400">
              Are you sure you want to delete <span className="font-bold text-white">{deleteTarget.name}</span>? This action cannot be undone and will delete all associated models and lists.
            </p>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-[var(--color-border)] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 cursor-pointer"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Brand'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
