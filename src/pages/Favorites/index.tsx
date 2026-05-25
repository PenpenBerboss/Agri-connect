import React from 'react';
import { useStore } from '../../application/store/useStore';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, MoveRight, PackageX } from 'lucide-react';
import { formatPrice } from '../../shared/utils';
import { motion } from 'motion/react';

export const Favorites = () => {
  const { favorites, toggleFavorite, products } = useStore();
  const favoriteProducts = Array.isArray(products) ? products.filter(p => favorites.includes(p.id)) : [];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
           <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                Ma Collection Privée
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Mes Favoris</h1>
              <p className="text-slate-500 font-medium">Retrouvez ici les perles rares que vous avez sélectionnées.</p>
           </div>
           
           {favoriteProducts.length > 0 && (
             <div className="bg-white border border-slate-200 px-6 py-4 rounded-3xl shadow-sm flex items-center justify-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-black">{favoriteProducts.length}</div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Produits enregistrés</span>
             </div>
           )}
        </div>

        {favoriteProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[4rem] p-24 md:p-32 text-center flex flex-col items-center border border-slate-200 shadow-2xl shadow-slate-200/50"
          >
            <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10 border-8 border-white shadow-xl rotate-12">
               <Heart className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Votre collection est vide</h2>
            <p className="text-slate-500 max-w-sm mb-12 text-lg font-medium leading-relaxed">
              Explorez le marché et cliquez sur le coeur pour marquer les produits qui vous intéressent.
            </p>
            <Link 
              to="/products" 
              className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center shadow-2xl shadow-slate-950/20 hover:scale-105 active:scale-95 transition-all"
            >
              Découvrir le marché <MoveRight className="ml-4 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {favoriteProducts.map((p) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group"
              >
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200 group flex flex-col h-full hover:border-primary-light transition-all duration-500">
                  <div className="relative aspect-[16/10] overflow-hidden">
                     <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                     <div className="absolute top-6 right-6">
                        <button 
                          onClick={() => toggleFavorite(p.id)}
                          className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl text-rose-500 shadow-2xl hover:bg-rose-500 hover:text-white transition-all transform active:scale-150"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                  <div className="p-10 space-y-6 flex flex-col flex-1">
                     <div>
                        <div className="flex items-center space-x-2 mb-2">
                           <span className="text-[10px] font-black uppercase text-primary-dark bg-primary-dark/5 px-2 py-0.5 rounded-full">{p.category}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-dark transition-colors tracking-tight line-clamp-1">{p.name}</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Vendeur: {p.seller_name}</p>
                     </div>
                     
                     <div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-auto">
                        <div className="flex flex-col">
                           <span className="text-2xl font-black text-primary-dark tracking-tighter">{formatPrice(p.price)}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">/{p.unit}</span>
                        </div>
                        <Link 
                          to={`/products/${p.id}`} 
                          className="bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-primary-dark shadow-xl shadow-slate-950/10 transition-all active:scale-95"
                        >
                          Révéler
                        </Link>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
