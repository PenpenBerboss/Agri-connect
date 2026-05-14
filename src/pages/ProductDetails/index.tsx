import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  ChevronLeft,
  MoveRight,
  Info,
  ShoppingCart,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_PRODUCTS } from '../../services/mock/mockData';
import { formatPrice, cn } from '../../shared/utils';
import { useStore } from '../../application/store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { RecommendationService } from '../../core/services/recommendationService';

// Fix Leaflet icon issue
import L from 'leaflet';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite, addToCart } = useStore();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  
  const similarProducts = product ? RecommendationService.getRecommendedProducts(4, user?.id, product) : [];
  const nearbyProducts = product ? RecommendationService.getNearbyProducts(product.location.lat, product.location.lng, 4).filter(p => p.id !== product.id) : [];

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulation de géolocalisation pour le calcul hybride (Douala par défaut)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => setUserLocation({ lat: 4.05, lng: 9.71 }) // Fallback Douala
      );
    }
  }, [id]);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-sm">
          <Info className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Produit absent</h2>
          <p className="text-slate-500 font-medium mb-8">Désolé, nous n'avons pas pu trouver ce que vous cherchez.</p>
          <Link to="/products" className="bg-primary-dark text-white px-8 py-3 rounded-xl font-bold inline-block hover:scale-105 transition-all">Retour au marché</Link>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Bonjour, je suis intéressé par votre produit "${product.name}" sur AgriConnect.`;
    window.open(`https://wa.me/237670000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    // Optional: show a toast or feedback
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Section */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-slate-600 hover:text-primary-dark hover:border-primary-light transition-all shadow-sm font-bold text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l'exploration
          </button>
          
          <div className="flex items-center space-x-3">
             <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:text-primary-dark transition-all shadow-sm"><Share2 className="w-5 h-5" /></button>
             <button 
                onClick={() => toggleFavorite(product.id)}
                className={cn(
                  "p-3 border transition-all shadow-sm rounded-2xl",
                  isFavorite(product.id) ? "bg-accent border-accent text-white" : "bg-white border-slate-200 text-slate-400 hover:text-accent hover:border-accent"
                )}
             >
               <Heart className={cn("w-5 h-5", isFavorite(product.id) && "fill-current")} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Gallery */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-slate-200 shadow-2xl border border-white">
               <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.images[activeImage]} 
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700"
               />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "min-w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                    activeImage === idx ? "border-primary-light shadow-xl opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info Area */}
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-primary-dark/10 text-primary-dark px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {product.category}
                </span>
                {product.stock < 10 && (
                  <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">
                    S'épuise vite: {product.stock} {product.unit} dispos
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter">{product.name}</h1>
              
              <div className="flex items-center space-x-6 pt-2">
                <div className="flex items-center text-accent">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-2 font-black text-slate-900 text-lg">{product.rating}</span>
                  <span className="ml-1 text-sm text-slate-400 font-bold">({product.reviewsCount} avis clients)</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center text-slate-500 font-bold text-sm">
                  <MapPin className="w-5 h-5 mr-1.5 text-primary-light" />
                  <span>{product.location.city}, {product.location.region}</span>
                </div>
              </div>
            </div>

            {/* Pricing Block */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 space-y-10">
               <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Tarification Directe</p>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-6xl font-black text-primary-dark tracking-tighter">{formatPrice(product.price)}</span>
                    <span className="text-xl text-slate-400 font-black tracking-widest">/ {product.unit}</span>
                  </div>
               </div>

               <div className="space-y-6">
                 <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200 w-fit">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-500 transition-all font-black text-lg"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-black text-lg">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-500 transition-all font-black text-lg"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary-dark hover:bg-primary-light text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-dark/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au Panier
                    </button>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-200/50 hover:scale-105 transition-all"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full bg-slate-950 hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-950/20 hover:scale-105 transition-all"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>Contacter</span>
                  </button>
               </div>
             </div>
           </div>

           <div className="space-y-6">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                 <Info className="w-5 h-5 mr-3 text-primary-light" />
                 Détails du produit
               </h3>
               <div className="text-slate-600 font-medium leading-relaxed bg-white p-8 rounded-[2rem] border border-slate-100">
                  {product.description}
                  <br /><br />
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary-dark shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
                      Qualité certifiée par AgriConnect Cameroon. Fraîcheur garantie sous 24h après récolte.
                    </p>
                  </div>
               </div>
            </div>

            {/* Seller Experience */}
            <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] flex items-center gap-6 shadow-2xl">
               <div className="relative">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`} className="w-20 h-20 rounded-full bg-white/10 p-1 border-2 border-primary-light" alt="vendeur" />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1 rounded-full border-2 border-slate-950">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
               </div>
               <div className="flex-1">
                  <h4 className="font-black text-xl tracking-tight leading-none mb-2">{product.sellerName}</h4>
                  <p className="text-[10px] text-primary-light font-bold uppercase tracking-[0.2em]">Producteur Master Class • 120+ Ventes</p>
               </div>
               <Link to={`/seller/${product.sellerId}`} className="bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all">
                  <MoveRight className="w-5 h-5" />
               </Link>
            </div>
          </div>
        </div>

        {/* Localisation Map Section */}
        <section className="mt-32">
           <div className="flex flex-col items-center text-center mb-12">
             <div className="bg-primary-light/10 text-primary-dark w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
               <MapPin className="w-6 h-6" />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Tracer la Plantation</h2>
             <p className="text-slate-500 font-medium mt-2">Visitez virtuellement la provenance de vos produits.</p>
           </div>
           
           <div className="h-[500px] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
             <MapContainer center={[product.location.lat, product.location.lng]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[product.location.lat, product.location.lng]}>
                  <Popup className="sleek-popup">
                    <div className="p-2 font-bold text-slate-900">{product.name} @ {product.location.city}</div>
                  </Popup>
                </Marker>
             </MapContainer>
             
             {/* Map Glass Overlay */}
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-md px-10 py-5 rounded-3xl border border-white/50 shadow-2xl z-[1000] hidden md:block">
               <div className="flex items-center space-x-6 text-slate-900 font-bold text-sm uppercase tracking-widest">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-dark" /> {product.location.city}</div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-2">{product.location.region}</div>
               </div>
             </div>
           </div>
        </section>

        {/* Similar Products */}
        <section className="mt-32">
           <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Produits Similaires</h2>
                <p className="text-slate-500 font-medium mt-2">Découvrez d'autres produits de la catégorie {product.category}.</p>
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map(p => (
                <ProductSmallCard key={p.id} p={p} />
              ))}
           </div>
        </section>

        {/* Nearby Products */}
        <section className="mt-32">
           <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Également à {product.location.city}</h2>
                <p className="text-slate-500 font-medium mt-2">Profitez de votre déplacement pour récupérer d'autres récoltes.</p>
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {nearbyProducts.map(p => (
                <ProductSmallCard key={p.id} p={p} />
              ))}
           </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-32">
           <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Avis de la Communauté</h2>
              <div className="flex items-center mt-4 bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm">
                <div className="flex items-center text-accent mr-3">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={cn("w-5 h-5", i <= Math.round(product.rating) ? "fill-current" : "text-slate-200")} />
                  ))}
                </div>
                <span className="font-black text-slate-900">{product.rating}/5</span>
                <span className="ml-2 text-slate-400 font-bold text-sm">({product.reviewsCount} retours)</span>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-8">
                 <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
                    <h3 className="font-black text-xl mb-6">Laisser un avis</h3>
                    <div className="space-y-6">
                       <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Votre note</p>
                         <div className="flex gap-2">
                           {[1,2,3,4,5].map(i => (
                             <button key={i} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-primary-light/10 text-slate-200 hover:text-accent transition-all flex items-center justify-center">
                               <Star className="w-6 h-6" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Commentaire</p>
                         <textarea 
                           placeholder="Partagez votre expérience avec ce produit..."
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-primary-light/10 transition-all outline-none min-h-[120px]"
                         ></textarea>
                       </div>
                       <button className="w-full bg-primary-dark text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary-dark/20 active:scale-95 transition-all">
                         Publier l'avis
                       </button>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                 {[1, 2].map((review) => (
                   <div key={review} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-4">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${review}`} className="w-12 h-12 rounded-2xl bg-slate-100" alt="avatar" />
                            <div>
                               <h5 className="font-black text-slate-900">Utilisateur Verified</h5>
                               <p className="text-[10px] text-slate-400 font-bold uppercase">Il y a 2 jours</p>
                            </div>
                         </div>
                         <div className="flex text-accent">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={cn("w-3.5 h-3.5", i <= 4 ? "fill-current" : "text-slate-100")} />
                            ))}
                         </div>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        Produit d'excellente qualité ! {product.name} est frais et correspond parfaitement à la description. Livraison rapide à {product.location.city}.
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Contact Modal */}
        <AnimatePresence>
          {isContactModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsContactModalOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
              >
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Contacter le Vendeur</h2>
                      <p className="text-slate-400 font-medium">Envoyez un message direct à {product.sellerName}.</p>
                    </div>
                    <button onClick={() => setIsContactModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <a 
                      href={`tel:+237670000000`}
                      className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary-light hover:bg-white transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary-dark group-hover:text-white transition-all">
                        <Phone className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600">Appeler</span>
                    </a>
                    <button 
                      onClick={handleWhatsApp}
                      className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-[#25D366] hover:bg-white transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#25D366] group-hover:text-white transition-all">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600">WhatsApp</span>
                    </button>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsContactModalOpen(false); }}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sujet</label>
                      <input 
                        type="text" 
                        defaultValue={`Intérêt pour ${product.name}`}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                      <textarea 
                        placeholder="Quelles sont vos questions ?" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none min-h-[120px]"
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-primary-dark text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary-dark/20 hover:bg-black transition-all">
                      Envoyer le message
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProductSmallCard = ({ p }: { p: any }) => (
  <Link 
    to={`/products/${p.id}`}
    className="bg-white rounded-[2rem] p-6 hover:shadow-2xl hover:border-primary-light border border-slate-200 transition-all group flex flex-col"
  >
    <div className="overflow-hidden rounded-2xl aspect-square mb-6">
      <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
    </div>
    <div className="flex items-center gap-1.5 mb-1">
      <MapPin className="w-3 h-3 text-slate-300" />
      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{p.location.city}</span>
    </div>
    <h4 className="font-extrabold text-slate-900 group-hover:text-primary-dark transition-colors truncate tracking-tight">{p.name}</h4>
    <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-50 pt-6">
       <span className="text-lg font-black text-primary-dark tracking-tighter truncate min-w-0">{formatPrice(p.price)}</span>
       <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-dark group-hover:text-white shrink-0 transition-all">
          <MoveRight className="w-4 h-4" />
       </div>
    </div>
  </Link>
);
