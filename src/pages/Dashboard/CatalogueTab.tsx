import React, { useState } from 'react';
import { Boxes, Plus, Search, SquarePen, Trash2, ScanEye } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../services/mock/mockData';
import { formatPrice, cn } from '../../shared/utils';
import { useStore } from '../../application/store/useStore';

export const CatalogueTab = () => {
  const { user, products, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  
  const userProducts = products.filter(p => 
    p.sellerId === user?.id && 
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sleek">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mon Catalogue</h2>
          <p className="text-slate-500 font-medium text-sm">Gérez vos produits et stocks en temps réel.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-440 w-4 h-4" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer mes produits..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" 
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sleek overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Produit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Catégorie</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Prix</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                        <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm group-hover:text-primary-dark transition-colors">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-900">{formatPrice(p.price)}</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/{p.unit}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                       <span className="text-sm font-black text-slate-900">{p.stock}</span>
                       <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              p.stock > 100 ? "bg-emerald-500" : p.stock > 20 ? "bg-amber-500" : "bg-rose-500"
                            )} 
                            style={{ width: `${Math.min(100, (p.stock / 200) * 100)}%` }} 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Actif</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary-dark hover:bg-slate-50 transition-all shadow-sm">
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
