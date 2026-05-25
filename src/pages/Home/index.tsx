import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Search, 
  Globe, 
  Zap, 
  SquareUserRound, 
  Fingerprint,
  Boxes,
  MapPin,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../../core/constants';
import { RecommendationService } from '../../core/services/recommendationService';
import { motion } from 'motion/react';
import { formatPrice } from '../../shared/utils';
import { useStore } from '../../application/store/useStore';

export const Home = () => {
  const { user, toggleFavorite, isFavorite, products } = useStore();
  
  const personalRecs = RecommendationService.getPersonalRecommendations(user?.id || 'visitor', 4);
  const trendingProducts = RecommendationService.getTrendingProducts(4);
  const nearbyProducts = (user && user.location && typeof user.location === 'object')
    ? RecommendationService.getNearbyProducts(user.location.lat, user.location.lng, 4)
    : products.slice(10, 14);

  return (
    <div className="space-y-16 md:space-y-32 pb-16 md:pb-32 bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <img 
            src="/assets/back1.jpg" 
            alt="Agriculture Cameroun" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full mb-8 shadow-2xl">
               <span className="flex h-2 w-2 rounded-full bg-primary-light animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">L'Atlas de l'Or Vert du Cameroun</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] font-black mb-6 md:mb-8 leading-[1] tracking-tighter">
              L'Agriculture <br/><span className="text-primary-light italic font-serif serif-bold">Sublimée.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-8 md:mb-14 leading-relaxed font-black tracking-tight max-w-xl opacity-90">
              Connectez-vous à la terre. Achetez et vendez sans intermédiaires sur notre plateforme agricole.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="bg-primary-dark hover:bg-white hover:text-slate-950 text-white px-8 md:px-12 py-4 md:py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(76,175,80,0.3)] transition-all duration-500 active:scale-95 group"
              >
                <span>Explorer le Marché</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/register" 
                className="bg-white/5 hover:bg-white/10 backdrop-blur-2xl text-white border border-white/20 px-8 md:px-12 py-4 md:py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all duration-500"
              >
                Devenir Vendeur
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[60%] bg-primary-dark/20 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-white p-2 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100">
            {[
               { label: 'Producteurs', value: '15,000+', icon: <SquareUserRound /> },
               { label: 'Localités', value: '250+', icon: <Globe /> },
               { label: 'Tonnage Mensuel', value: '1,200T', icon: <Zap /> },
               { label: 'Confiance', value: '99.9%', icon: <Fingerprint /> }
            ].map((stat, i) => (
               <div key={i} className="bg-slate-50/50 p-8 flex items-center space-x-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-primary-dark">
                     {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.1em] mt-1">{stat.label}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
          <div className="text-center md:text-left space-y-3">
            <span className="text-primary-dark font-black tracking-[0.3em] uppercase text-[10px]">L'Art des Terroirs</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Nos Filières d'Excellence</h2>
            <p className="text-slate-500 font-medium max-w-lg">La richesse de chaque région du Cameroun, sélectionnée pour sa qualité supérieure.</p>
          </div>
          <Link to="/products" className="bg-slate-950 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all flex items-center group">
            Tout Explorer <ArrowUpRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.value}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] hover:border-primary-light transition-all duration-500 text-center group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-light to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {cat.imagePath ? (
                <img src={cat.imagePath} alt={cat.label} className="w-20 h-20 mx-auto mb-8 rounded-full object-cover group-hover:rotate-12 transition-transform duration-500 filter grayscale group-hover:grayscale-0" />
              ) : (
                <div className="text-6xl mb-8 group-hover:rotate-12 transition-transform duration-500 filter grayscale group-hover:grayscale-0">{cat.icon}</div>
              )}
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">{cat.label}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Section (Atlas View) */}
      <section className="max-w-7xl mx-auto px-6 overflow-hidden">
         <div className="bg-slate-950 rounded-[4rem] p-16 md:p-24 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-dark/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <div>
                    <span className="text-primary-light font-black tracking-[0.3em] uppercase text-[11px]">AgriConnect Intelligence</span>
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mt-4 leading-tight">Suivez le Marché <br/>en Temps Réel.</h2>
                  </div>
                  <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">
                    Notre atlas interactif vous permet d'identifier les zones de production active et d'optimiser votre logistique en un clic.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link to="/map" className="bg-primary-dark hover:bg-primary-light text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary-dark/40 transition-all duration-500 text-center">
                       Ouvrir l'Atlas
                    </Link>
                    <div className="flex items-center space-x-4">
                       <div className="flex -space-x-4">
                          {[1,2,3,4].map(i => (
                             <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800" />
                          ))}
                       </div>
                       <span className="text-slate-500 text-xs font-bold font-mono">15k+ utilisateurs en ligne</span>
                    </div>
                  </div>
               </div>
               <div className="relative">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-[3rem] border border-slate-800 shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-700">
                     <div className="bg-slate-950 rounded-[2.5rem] overflow-hidden aspect-[4/3] relative">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover opacity-40 brightness-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-primary-dark rounded-full flex items-center justify-center text-white shadow-3xl animate-bounce">
                               <Globe size={32} />
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Recommendations - Pour Vous */}
      {user && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
            <div className="text-center md:text-left space-y-3">
              <span className="text-accent font-black tracking-[0.3em] uppercase text-[10px] flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-3 h-3" /> Basé sur vos préférences
              </span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Sélectionné pour Vous</h2>
              <p className="text-slate-500 font-medium max-w-lg">Des produits qui correspondent à votre activité et vos recherches récentes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {personalRecs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Near You Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <div className="text-center md:text-left space-y-3">
            <span className="text-primary-dark font-black tracking-[0.3em] uppercase text-[10px] flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-3 h-3" /> Proximité Directe
            </span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Près de chez Vous</h2>
            <p className="text-slate-500 font-medium max-w-lg">Découvrez les producteurs actifs dans votre région pour réduire vos coûts logistiques.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {nearbyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular Products with Sleek Cards */}
      <section className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
            <div className="text-center md:text-left space-y-3">
              <span className="text-primary-dark font-black tracking-[0.3em] uppercase text-[10px] flex items-center justify-center md:justify-start gap-2">
                <TrendingUp className="w-3 h-3" /> Tendance Actuelle
              </span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Récoltes à la Une</h2>
              <p className="text-slate-500 font-medium max-w-lg">Les produits les plus plébiscités par nos acheteurs ce mois-ci.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
      </section>

      {/* Featured CTA (Sleek Gradient) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden rounded-[4rem] p-20 lg:p-32 border border-slate-800 shadow-[0_100px_150px_-50px_rgba(0,0,0,0.5)]">
          <div className="relative z-10 lg:w-3/5 text-center lg:text-left">
             <span className="text-primary-light font-black tracking-[0.3em] uppercase text-[11px]">Expansion Commerciale</span>
             <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight mt-6">Propulsez Votre <br/><span className="text-primary-light italic font-serif">Boutique Directe.</span></h2>
             <p className="text-slate-400 text-xl mb-14 leading-relaxed font-medium">
               Ouvrez votre accès au marché national et international. Rejoignez l'élite des producteurs camerounais en 5 minutes.
             </p>
             <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
               <Link 
                 to="/register" 
                 className="bg-primary-dark hover:bg-white hover:text-slate-950 text-white px-12 py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary-dark/20 transition-all duration-500 group flex items-center justify-center"
               >
                 <span>Rejoindre l'Alliance</span>
                 <ArrowUpRight className="ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <div className="flex items-center justify-center space-x-6 px-4">
                  <Boxes className="text-slate-700 w-8 h-8" />
                  <div className="text-left">
                     <p className="text-white text-sm font-bold">100% Gratuit</p>
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Inscription instantanée</p>
                  </div>
               </div>
             </div>
          </div>
          {/* Abstract decor */}
          <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-primary-dark/10 rounded-full blur-[150px] pointer-events-none" />
        </div>
      </section>
    </div>
  );
};

const ProductCard = (props: any) => {
  const { product } = props;
  return (
  <motion.div
    whileHover={{ y: -5 }}
    className="group flex flex-col h-full"
  >
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-200 hover:border-primary-light transition-all duration-500 flex flex-col h-full overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1595111028886-df9b824d395a?w=800&q=80'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-dark shadow-sm">
            {product.category}
          </span>
          {product.subcategory && (
            <span className="bg-primary-dark/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
              {product.subcategory}
            </span>
          )}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow bg-white">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.location?.city || 'Cameroun'}</span>
        </div>
        <h3 className="font-black text-xl text-slate-900 group-hover:text-primary-dark transition-colors line-clamp-1 tracking-tight mb-2">{product.name}</h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-8 leading-relaxed font-medium">{product.description}</p>
        
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-xl md:text-2xl font-black text-primary-dark tracking-tighter truncate">{formatPrice(product.price)}</span>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">/ {product.unit}</span>
          </div>
          <Link 
            to={`/products/${product.id}`}
            className="bg-slate-950 text-white p-3 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-slate-950/10 shrink-0"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
  );
};
