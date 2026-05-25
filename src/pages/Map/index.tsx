import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useStore } from '../../application/store/useStore';
import { formatPrice, cn } from '../../shared/utils';
import { Link } from 'react-router-dom';
import { MapPin, Boxes, ArrowRight, Star } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration de l'icône par défaut de Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

export const GlobalMap = () => {
  const { products, fetchProducts } = useStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  // Position par défaut centrée sur le Cameroun (Adamaoua/Centre)
  const defaultCenter: [number, number] = [7.3697, 12.3547];

  return (
    <div className="h-[calc(100vh-80px)] w-full relative bg-slate-100">
      {/* Header Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xl px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Atlas AgriConnect</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark">
              {products.length} zones de production actives
            </p>
          </div>
          <div className="flex gap-2">
            <div className="bg-primary-dark text-white p-3 rounded-2xl shadow-lg">
              <Boxes size={20} />
            </div>
          </div>
        </div>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={6} 
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {products.map((product) => {
          // On ne place le marqueur que si les coordonnées existent
          if (!product.location?.lat || !product.location?.lng) return null;

          return (
            <Marker 
              key={product.id} 
              position={[product.location.lat, product.location.lng]}
            >
              <Popup className="sleek-popup-custom">
                <div className="w-64 p-2">
                  <div className="relative h-32 mb-4 rounded-2xl overflow-hidden">
                    <img 
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1595111028886-df9b824d395a?w=800&q=80'} 
                      className="w-full h-full object-cover" 
                      alt={product.name} 
                    />
                    <div className="absolute top-2 left-2 bg-primary-dark/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black text-white uppercase">
                      {product.category}
                    </div>
                  </div>
                  
                  <h3 className="font-black text-slate-900 text-sm mb-1 leading-tight">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 text-accent mb-3">
                    <Star size={10} className="fill-current" />
                    <span className="text-[10px] font-black">{product.rating}</span>
                    <span className="text-slate-400 text-[10px] ml-1 uppercase">{product.location.city}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-primary-dark">{formatPrice(product.price)}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">/ {product.unit}</span>
                    </div>
                    <Link 
                      to={`/products/${product.id}`}
                      className="bg-slate-950 text-white p-2 rounded-xl hover:bg-primary-dark transition-all"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};