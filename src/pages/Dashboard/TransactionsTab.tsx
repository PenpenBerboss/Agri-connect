import { Briefcase, MoveRight, Filter, FileDown, Plus, X } from 'lucide-react';
import { MOCK_ORDERS } from '../../services/mock/mockData';
import { formatPrice, cn } from '../../shared/utils';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const TransactionsTab = () => {
  const navigate = useNavigate();
  const [showAddSale, setShowAddSale] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'processing': return 'En cours';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const handleSaleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    alert(`Nouvelle vente: ${formData.get('productName')} - ${formData.get('quantity')} unités.`);
    setShowAddSale(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sleek">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ventes & Commandes</h2>
          <p className="text-slate-500 font-medium text-sm">Suivez vos revenus et l'état de vos livraisons.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddSale(true)}
            className="flex items-center space-x-2 bg-slate-950 text-white px-6 py-4 rounded-xl hover:bg-primary-dark shadow-xl shadow-slate-950/20 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Vente</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sleek overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID Commande</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Produit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Montant</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">#{order.id.split('-')[1]}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{order.date}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-900">{order.customerName}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{order.productName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{order.quantity} {order.unit}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-primary-dark tracking-tighter">{formatPrice(order.amount)}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      getStatusColor(order.status)
                    )}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary-dark hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <MoveRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <AnimatePresence>
        {showAddSale && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddSale(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2rem] p-10 shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl font-black">Nouvelle Vente</h2>
                    <button onClick={() => setShowAddSale(false)} className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100"><X size={20} /></button>
                </div>
                <form onSubmit={handleSaleSubmit} className="space-y-4">
                    <input name="productName" placeholder="Nom du produit" className="w-full bg-slate-50 rounded-xl p-4 text-sm font-bold outline-none" required />
                    <input name="quantity" type="number" placeholder="Quantité" className="w-full bg-slate-50 rounded-xl p-4 text-sm font-bold outline-none" required />
                    <button type="submit" className="w-full bg-slate-950 text-white p-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all">Enregistrer</button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
