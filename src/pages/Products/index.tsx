import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  X,
  ArrowRight,
  Heart
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '../../data/mockData';
import { formatPrice, cn } from '../../lib/utils';
import { Category } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>((categoryParam as any) || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const { toggleFavorite, isFavorite } = useStore();

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase()) || 
                           p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return b.views - a.views;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [query, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-primary-dark/5 px-3 py-1 rounded-full text-primary-dark text-[10px] font-bold uppercase tracking-widest">
              <LayoutGrid className="w-3 h-3" />
              <span>Cameroun Marketplace</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Le Marché Agricole</h1>
            <p className="text-slate-500 font-medium">Découvrez {filteredProducts.length} produits authentiques en direct des fermes.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm hover:border-primary-light md:hidden text-slate-800 transition-all font-bold text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtres</span>
            </button>
            <div className="relative group min-w-[200px]">
               <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none bg-white border border-slate-200 px-5 py-3 pr-12 rounded-2xl shadow-sm hover:border-primary-light focus:ring-4 focus:ring-primary-light/10 text-sm font-bold text-slate-800 cursor-pointer transition-all"
               >
                 <option value="newest">Les plus récents</option>
                 <option value="popular">Les plus populaires</option>
                 <option value="price-asc">Prix: Croissant</option>
                 <option value="price-desc">Prix: Décroissant</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-primary-dark" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0 h-fit sticky top-28">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10">
              {/* Category Filter */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-widest mb-6 flex items-center">
                  Catégories
                </h3>
                <div className="space-y-1.5 text-[0.9rem]">
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-between group",
                      selectedCategory === 'all' ? "bg-primary-dark text-white shadow-lg shadow-primary-dark/20" : "text-slate-600 hover:bg-slate-50 hover:text-primary-dark"
                    )}
                  >
                    <span>Toutes</span>
                    {selectedCategory !== 'all' && <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-between group",
                        selectedCategory === cat.value ? "bg-primary-dark text-white shadow-lg shadow-primary-dark/20" : "text-slate-600 hover:bg-slate-50 hover:text-primary-dark"
                      )}
                    >
                      <span className="flex items-center"><span className="mr-3">{cat.icon}</span> {cat.label}</span>
                      {selectedCategory !== cat.value && <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-widest mb-6">
                   Budget Max
                </h3>
                <div className="space-y-6">
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary-dark h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Jusqu'à</span>
                    <span className="text-sm font-black text-primary-dark">{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             {filteredProducts.length === 0 ? (
               <div className="bg-white rounded-[3rem] p-24 text-center flex flex-col items-center border border-slate-200 shadow-sm">
                  <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-8">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Aucun résultat</h3>
                  <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
                    Nous n'avons pas trouvé de produits correspondant à vos critères actuels. Essayez d'ajuster vos filtres.
                  </p>
                  <button 
                    onClick={() => { setSelectedCategory('all'); setPriceRange([0,100000]); setSearchParams({}); }}
                    className="bg-primary-dark text-white px-10 py-4 rounded-2xl font-extrabold shadow-xl shadow-primary-dark/20 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                  >
                    Réinitialiser
                  </button>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                 {filteredProducts.map((product) => (
                   <motion.div
                     layout
                     key={product.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="group"
                   >
                     <div className="card-sleek flex flex-col h-full bg-white overflow-hidden rounded-[2rem] border border-slate-200 hover:border-primary-light transition-all duration-500">
                        <Link to={`/products/${product.id}`} className="relative aspect-[4/3] block overflow-hidden">
                           <img 
                             src={product.images[0]} 
                             alt={product.name}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                           />
                           <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                             <span className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                               {product.category}
                             </span>
                             {product.isPopular && (
                               <span className="bg-accent px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-accent/20">
                                 Top Choix
                               </span>
                             )}
                           </div>
                           <button 
                            onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                            className={cn(
                              "absolute top-5 right-5 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
                              isFavorite(product.id) ? "bg-accent text-white" : "bg-white/20 text-white hover:bg-white hover:text-accent"
                            )}
                           >
                             <Heart className={cn("w-5 h-5", isFavorite(product.id) && "fill-current")} />
                           </button>
                        </Link>
                        
                        <div className="p-7 flex flex-col flex-grow">
                           <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-1 text-accent">
                                 <Star className="w-3.5 h-3.5 fill-current" />
                                 <span className="text-xs font-black">{product.rating}</span>
                                 <span className="text-slate-400 text-[10px] font-bold uppercase ml-1">({product.reviewsCount})</span>
                              </div>
                              <div className="flex items-center text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                 <MapPin className="w-3 h-3 mr-1" />
                                 <span>{product.location.city}</span>
                              </div>
                           </div>

                           <Link to={`/products/${product.id}`}>
                             <h3 className="text-lg font-black text-slate-900 group-hover:text-primary-dark transition-colors line-clamp-1 mb-2 tracking-tight">
                               {product.name}
                             </h3>
                           </Link>
                           
                           <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">
                              {product.description}
                           </p>

                           <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex flex-col">
                                 <span className="text-2xl font-black text-primary-dark leading-none tracking-tighter">{formatPrice(product.price)}</span>
                                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">/{product.unit}</span>
                              </div>
                              <Link 
                               to={`/products/${product.id}`}
                               className="bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-primary-dark shadow-lg shadow-slate-950/10 active:scale-95 transition-all"
                              >
                                Explorer
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
      </div>

      {/* Mobile Filter Sheet (Simplified for now) */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white z-[70] rounded-t-[2.5rem] p-8 md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Filtres de recherche</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-10">
                <div>
                   <h3 className="font-bold mb-4">Catégories</h3>
                   <div className="grid grid-cols-2 gap-2">
                     <button 
                      onClick={() => setSelectedCategory('all')}
                      className={cn("px-4 py-2 rounded-xl border text-sm font-medium", selectedCategory === 'all' ? "bg-primary-dark text-white border-primary-dark" : "border-gray-200")}
                     >Tout</button>
                     {CATEGORIES.map(cat => (
                        <button 
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={cn("px-4 py-2 rounded-xl border text-sm font-medium", selectedCategory === cat.value ? "bg-primary-dark text-white border-primary-dark" : "border-gray-200")}
                        >{cat.icon} {cat.label}</button>
                     ))}
                   </div>
                </div>

                <div>
                   <h3 className="font-bold mb-4">Prix Maximum</h3>
                   <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-light"
                   />
                   <div className="text-center mt-4 font-bold text-primary-dark">{formatPrice(priceRange[1])}</div>
                </div>

                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-primary-dark text-white py-4 rounded-xl font-bold text-lg"
                >Appliquer les filtres</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
