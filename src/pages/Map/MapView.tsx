import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { formatPrice, cn } from '../../shared/utils';
import { useStore } from '../../application/store/useStore';
import { Link } from 'react-router-dom';
import { MapPin, Search, Navigation, Layers, Filter, MoveRight, LocateFixed } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

// Component to handle user location
const LocationMarker = ({ shouldLocate }: { shouldLocate: boolean }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    if (shouldLocate) {
      map.locate().on("locationfound", function (e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, 12);
      });
    }
  }, [shouldLocate, map]);

  return position === null ? null : (
    <Marker position={position} icon={L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })}>
      <Popup>Vous êtes ici</Popup>
    </Marker>
  );
};

export const MapView = () => {
  const { products, fetchProducts } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [shouldLocate, setShouldLocate] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);
  
  // Center of Cameroon (approximate for display)
  const cameroonCenter: [number, number] = [7.3697, 12.3547];

  const handleLocate = () => {
    setShouldLocate(true);
    // Reset after a short delay so it can be clicked again
    setTimeout(() => setShouldLocate(false), 1000);
  };

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="h-[calc(100vh-64px)] relative flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Search & Filter Toolbar */}
      <div className="absolute top-6 left-6 z-[400] right-6 md:right-auto md:w-[400px] space-y-4">
         <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-dark transition-colors" />
            <input 
              placeholder="Localité, produit ou vendeur..." 
              className="w-full bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[1.5rem] py-5 pl-14 pr-6 focus:ring-4 focus:ring-primary-light/20 focus:bg-white transition-all text-sm font-bold text-slate-800 placeholder-slate-400"
            />
         </div>
         
         <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-[2rem] shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Filtrer l'atlas</span>
               <Filter className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex flex-wrap gap-2">
               <button 
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  selectedCategory === 'all' ? 'bg-primary-dark text-white shadow-lg shadow-primary-dark/30 scale-105' : 'bg-white/50 text-slate-500 hover:bg-white hover:text-primary-dark border border-slate-100'
                )}
               >Tout</button>
               {['cacao', 'plantain', 'piment', 'maïs', 'café', 'manioc'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                      selectedCategory === cat ? 'bg-primary-light text-white shadow-lg shadow-primary-light/30 scale-105' : 'bg-white/50 text-slate-500 hover:bg-white hover:text-primary-dark border border-slate-100'
                    )}
                  >{cat}</button>
               ))}
            </div>
         </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 z-0 relative">
        <button 
          onClick={handleLocate}
          className="absolute bottom-10 right-10 z-[400] bg-white p-4 rounded-2xl shadow-2xl text-primary-dark hover:bg-primary-dark hover:text-white transition-all active:scale-90"
          title="Ma position"
        >
          <LocateFixed className="w-6 h-6" />
        </button>

        <MapContainer center={cameroonCenter} zoom={6} className="w-full h-full grayscale-[0.2] contrast-[1.1]">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker shouldLocate={shouldLocate} />
          {filteredProducts.filter(p => p.location?.lat && p.location?.lng).map(product => (
            <Marker key={product.id} position={[product.location.lat, product.location.lng]}>
              <Popup className="sleek-popup">
                <div className="w-56 p-2">
                   <div className="overflow-hidden rounded-xl h-28 mb-3">
                    <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1595111028886-df9b824d395a?w=800&q=80'} className="w-full h-full object-cover" alt="" />
                   </div>
                   <h3 className="font-black text-slate-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                   <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <MapPin className="w-3 h-3 mr-1 text-primary-light" />
                      <span>{product.location?.city || 'Cameroun'}</span>
                   </div>
                   <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="font-black text-primary-dark text-lg tracking-tighter">{formatPrice(product.price)}</span>
                      <Link to={`/products/${product.id}`} className="bg-slate-950 text-white p-2.5 rounded-xl shadow-lg hover:bg-primary-dark transition-all">
                         <Navigation className="w-4 h-4" />
                      </Link>
                   </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Floating Product List (Desktop) */}
      <aside className="hidden lg:block w-[450px] bg-white border-l border-slate-200 p-8 overflow-y-auto scrollbar-hide">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Exploration Locale</h2>
               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Produits à proximité de vous</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
               <Layers className="w-5 h-5 text-slate-400" />
            </div>
         </div>
          <div className="space-y-6">
            {filteredProducts.map(p => (
               <Link 
                to={`/products/${p.id}`}
                key={p.id} 
                className="group flex gap-5 p-4 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 items-center overflow-hidden"
               >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg shadow-slate-200/50">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1595111028886-df9b824d395a?w=800&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[9px] font-black uppercase text-primary-dark bg-primary-dark/5 px-2 py-0.5 rounded-full">{p.category}</span>
                     </div>
                     <h4 className="font-black text-slate-900 truncate group-hover:text-primary-dark transition-colors tracking-tight">{p.name}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1 text-primary-light" />
                        {p.location?.city || 'Cameroun'}
                     </p>
                     <div className="mt-3 flex items-center justify-between">
                        <p className="font-black text-lg text-primary-dark tracking-tighter">{formatPrice(p.price)}</p>
                        <MoveRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-primary-dark transition-all" />
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </aside>
    </div>
  );
};
