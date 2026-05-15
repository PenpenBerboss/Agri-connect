import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, CheckCircle, PackageSearch, XCircle, Clock } from 'lucide-react';
import { useStore } from '../../application/store/useStore';
import { formatPrice, cn } from '../../shared/utils';

export const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, fetchOrders, user } = useStore();
  const ObjectOrder = orders.find(o => o.id === id);

  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
    }
  }, [fetchOrders, orders.length]);

  if (!ObjectOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
         <p className="text-slate-500 font-bold">Chargement de la commande...</p>
      </div>
    );
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'processing': return <PackageSearch className="w-5 h-5 text-blue-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-rose-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au Dashboard</span>
        </button>

        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-100 pb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Commande #{ObjectOrder.id.split('-')[0]}</h1>
              <p className="text-slate-500 font-bold text-sm">
                Date: {new Date(ObjectOrder.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl border",
              getStatusColor(ObjectOrder.status)
            )}>
              {getStatusIcon(ObjectOrder.status)}
              <span className="font-black uppercase tracking-widest text-xs">
                {getStatusLabel(ObjectOrder.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Informations Produit</h3>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                     <Box className="w-8 h-8 text-primary-dark" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{ObjectOrder.products?.name || 'Produit'}</h4>
                    <p className="text-slate-500 font-bold mt-1">Quantité: {ObjectOrder.quantity} unités</p>
                    <p className="text-primary-dark font-black tracking-tighter mt-2">{formatPrice(ObjectOrder.amount)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Résumé Financier</h3>
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-500 font-bold">Sous-total</span>
                      <span className="font-black text-slate-900">{formatPrice(ObjectOrder.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-500 font-bold">Frais</span>
                      <span className="font-black text-slate-900">{formatPrice(0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-sm font-black uppercase tracking-widest text-slate-900">Total</span>
                       <span className="text-2xl font-black text-primary-dark tracking-tighter">{formatPrice(ObjectOrder.amount)}</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
