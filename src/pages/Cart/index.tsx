import React from 'react';
import { useStore } from '../../application/store/useStore';
import { MOCK_PRODUCTS } from '../../services/mock/mockData';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, MoveRight, ShieldCheck } from 'lucide-react';
import { formatPrice, cn } from '../../shared/utils';
import { motion } from 'motion/react';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const navigate = useNavigate();

  const cartProducts = cart.map(item => {
    const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
    return { ...product, quantity: item.quantity };
  }).filter(p => p.id) as (any & { quantity: number })[];

  const subtotal = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const shipping = cartProducts.length > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[4rem] p-16 md:p-24 text-center max-w-2xl border border-slate-200 shadow-2xl"
        >
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-10 text-slate-200 rotate-12 transition-transform hover:rotate-0 duration-500">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Votre panier est vide</h2>
          <p className="text-slate-500 font-medium mb-12 text-lg">Il semble que vous n'ayez pas encore ajouté de produits à votre sélection.</p>
          <Link to="/products" className="bg-primary-dark text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest inline-flex items-center shadow-2xl shadow-primary-dark/20 hover:scale-105 active:scale-95 transition-all">
            Explorer les produits <MoveRight className="ml-3 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="flex-1 space-y-8">
             <div className="flex justify-between items-end mb-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Mon Panier</h1>
                <button onClick={clearCart} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">Vider le panier</button>
             </div>

             <div className="space-y-6">
               {cartProducts.map((p) => (
                 <motion.div 
                  layout
                  key={p.id}
                  className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sleek group flex flex-col sm:flex-row items-center gap-8"
                 >
                   <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border-4 border-slate-50">
                      <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-dark transition-colors">{p.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">/{p.unit}</p>
                      <div className="mt-4 flex items-center justify-center sm:justify-start gap-6">
                         <div className="flex items-center bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                            <button 
                              onClick={() => updateQuantity(p.id, p.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                            >
                               <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-black text-sm">{p.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(p.id, p.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                            >
                               <Plus className="w-4 h-4" />
                            </button>
                         </div>
                         <button 
                          onClick={() => removeFromCart(p.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                         >
                            <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatPrice(p.price * p.quantity)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatPrice(p.price)} unitaire</p>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>

          {/* Checkout Summary */}
          <aside className="w-full lg:w-96 shrink-0 h-fit lg:sticky lg:top-28">
             <div className="bg-slate-950 rounded-[4rem] p-10 text-white shadow-2xl shadow-slate-950/40 space-y-10">
                <h2 className="text-2xl font-black tracking-tight">Récapitulatif</h2>
                
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-slate-400">
                      <span className="text-xs font-black uppercase tracking-widest">Sous-total</span>
                      <span className="font-bold">{formatPrice(subtotal)}</span>
                   </div>
                   <div className="flex justify-between items-center text-slate-400">
                      <span className="text-xs font-black uppercase tracking-widest">Livraison</span>
                      <span className="font-bold">{formatPrice(shipping)}</span>
                   </div>
                   <div className="h-px bg-slate-900 my-4" />
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-black uppercase tracking-widest">Total</span>
                      <span className="text-3xl font-black text-primary-light tracking-tighter">{formatPrice(total)}</span>
                   </div>
                </div>

                <button 
                  onClick={() => alert('Procédure de paiement sécurisée en cours...')}
                  className="w-full bg-primary-dark hover:bg-primary-light text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-dark/20 transition-all active:scale-95"
                >
                   Commander Maintenant
                </button>

                <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-3xl border border-slate-900">
                   <ShieldCheck className="w-6 h-6 text-primary-light shrink-0" />
                   <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 leading-relaxed">
                      Transactions 100% sécurisées via MTN MoMo / Orange Money.
                   </p>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
