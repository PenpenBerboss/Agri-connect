import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, ShieldCheck, Star } from 'lucide-react';
import { formatPrice, cn } from '../../shared/utils';
import { useStore } from '../../application/store/useStore';

export const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = React.useState(0);
  const { products } = useStore();
  const sellerProducts = products.filter(p => p.seller_id === id);
  const seller = sellerProducts.length > 0 ? {
    id,
    name: sellerProducts[0].seller_name || 'Vendeur Inconnu',
    role: 'farmer',
    location: sellerProducts[0].location
  } : null;

  if (!seller) {
    return <div className="p-20 text-center">Vendeur non trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <ChevronLeft /> Retour
        </button>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl mb-12">
          <div className="flex items-center gap-8">
            <img src={(seller as any).avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.name}`} className="w-32 h-32 rounded-full bg-slate-100 object-cover" alt={seller.name} />
            <div>
              <h1 className="text-4xl font-black mb-2">{seller.name}</h1>
              <p className="text-primary-dark font-bold mb-4">{seller.role === 'farmer' ? 'Producteur Certifié' : 'Vendeur'}</p>
              <div className="flex gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1"><MapPin size={16} /> {seller.location?.city || 'Localisation inconnue'}</span>
                <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-green-500" /> Vendeur Vérié</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">Noter le vendeur :</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)} className={cn("transition-all", s <= rating ? "text-yellow-400" : "text-slate-300")}>
                      <Star size={20} fill={s <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black mb-8">Produits publiés ({sellerProducts.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sellerProducts.map(p => (
            <div key={p.id} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <img src={p.images[0]} className="w-full h-48 object-cover rounded-2xl mb-4" alt={p.name} />
              <h3 className="font-bold text-lg mb-1">{p.name}</h3>
              <p className="font-black text-primary-dark">{formatPrice(p.price)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
