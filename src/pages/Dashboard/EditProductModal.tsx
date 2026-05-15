import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUploader } from '../../components/ImageUploader';
import { useStore } from '../../application/store/useStore';
import { toast } from 'react-hot-toast';
import { CATEGORIES } from '../../core/constants';

interface EditProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { updateProduct, user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState(product?.images?.[0] || '');

  useEffect(() => {
    if (product) {
      setProductImage(product.images?.[0] || '');
    }
  }, [product]);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsLoading(true);
    try {
      const updatedData = {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        subcategory: formData.get('subcategory') as string,
        price: Number(formData.get('price')),
        unit: formData.get('unit') as string,
        description: formData.get('description') as string,
        images: [productImage || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1595111028886-df9b824d395a?w=800&q=80'],
        stock: Number(formData.get('stock')),
        harvest_period: formData.get('harvest_period') as string,
        season: formData.get('season') as string,
        location: {
           ...product.location,
           city: formData.get('city') as string || product.location?.city || 'Yaoundé',
           lat: product.location?.lat || 3.8480,
           lng: product.location?.lng || 11.5021,
           region: product.location?.region || 'Centre'
        },
        recommendation_tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(v => v.trim()) : (product.recommendation_tags || []),
      };

      await updateProduct({ ...product, ...updatedData });
      toast.success('Produit mis à jour !');
      onClose();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] my-auto"
          >
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Modifier Produit</h2>
                   <p className="text-slate-500 font-medium">Mettez à jour les informations de votre produit.</p>
                 </div>
                 <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                   <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nom du produit</label>
                      <input name="name" type="text" defaultValue={product.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Catégorie</label>
                      <select name="category" defaultValue={product.category} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none appearance-none cursor-pointer">
                         {CATEGORIES.map(cat => (
                           <option key={cat.value} value={cat.value}>{cat.label}</option>
                         ))}
                         <option value="épices">Épices</option>
                      </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sous-catégorie</label>
                      <input name="subcategory" type="text" defaultValue={product.subcategory} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Période de récolte</label>
                      <input name="harvest_period" type="text" defaultValue={product.harvest_period} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Saison</label>
                      <input name="season" type="text" defaultValue={product.season} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Prix (XAF)</label>
                      <input name="price" type="number" defaultValue={product.price} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Unité</label>
                      <input name="unit" type="text" defaultValue={product.unit} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ville</label>
                      <input name="city" type="text" defaultValue={product.location?.city} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stock Disponible</label>
                      <input name="stock" type="number" defaultValue={product.stock} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tags (virgules)</label>
                      <input name="tags" type="text" defaultValue={product.recommendation_tags?.join(', ')} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                    </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                   <textarea name="description" defaultValue={product.description} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none min-h-[120px]" required></textarea>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Image du produit</label>
                   <ImageUploader 
                     bucket="products" 
                     onUpload={(url) => setProductImage(url)} 
                     defaultImage={productImage}
                   />
                 </div>

                 <button type="submit" disabled={isLoading} className="w-full bg-primary-dark text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary-dark/20 hover:bg-black transition-all disabled:opacity-50">
                    {isLoading ? 'Mise à jour en cours...' : 'Enregistrer les Modifications'}
                 </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
