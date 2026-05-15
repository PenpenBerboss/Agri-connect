import React from 'react';
import { useStore } from '../../application/store/useStore';
import { formatPrice, cn } from '../../shared/utils';
import { 
  ShoppingBag, 
  Heart, 
  Settings2, 
  LogOut, 
  MoveRight,
  CircleCheckBig,
  CreditCard,
  CircleUserRound
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const BuyerProfile = () => {
  const { user, logout, favorites, orders, fetchOrders } = useStore();

  React.useEffect(() => {
    // chargement initial
    if (orders.length === 0) fetchOrders();
  }, [fetchOrders, orders.length]);

  React.useEffect(() => {
    // recharge quand l'utilisateur est défini (cas après création/connexion)
    if (user?.id && orders.length > 0) {
      // si une commande vient d'être créée, fetchOrders garantit la synchro DB
      // (sinon on reste bloqué sur l'état local persistant)
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const userOrders = orders.filter(o => o.customer_id === user?.id);

  const menuItems = [
    { icon: ShoppingBag, label: 'Mes Commandes', count: userOrders.length, path: '/cart' },
    { icon: Heart, label: 'Mes Favoris', count: favorites.length, path: '/favorites' },
    { icon: Settings2, label: 'Paramètres', path: '#' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="relative">
            <img 
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
              alt={user?.name} 
              className="w-32 h-32 rounded-[2.5rem] bg-slate-100 object-cover border-4 border-slate-50 shadow-inner"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary-dark text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
              <CircleUserRound className="w-5 h-5" />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">{user?.email}</p>
            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <span className="bg-slate-50 text-slate-500 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100">
                Acheteur Certifié
              </span>
              <span className="bg-primary-light/10 text-primary-dark px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-primary-light/10">
                Membre depuis {user?.joined_at ? new Date(user.joined_at).getFullYear() : '2024'}
              </span>
            </div>
          </div>

          <button 
            onClick={logout}
            className="p-5 bg-rose-50 text-rose-500 rounded-3xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, idx) => (
            <Link 
              key={idx}
              to={item.path}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-dark group-hover:text-white transition-all mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">{item.label}</h3>
              {item.count !== undefined && (
                <p className="text-2xl font-black text-primary-dark mt-1">{item.count}</p>
              )}
            </Link>
          ))}
        </div>

        {/* Mes Commandes */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Mes Commandes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Produit</th>
                  <th className="px-6 py-4 text-left">Quantité</th>
                  <th className="px-6 py-4 text-left">Montant</th>
                  <th className="px-6 py-4 text-left">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {userOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-bold">#{order.id.split('-')[1] || order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.products?.name}</td>
                    <td className="px-6 py-4 text-sm">{order.quantity} unités</td>
                    <td className="px-6 py-4 text-sm font-black">{formatPrice(order.amount)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                        order.status === 'delivered' ? "bg-green-100 text-green-600" : "bg-primary-light/20 text-primary-dark"
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dernières Activités</h2>
            <Link to="/cart" className="text-xs font-black text-primary-dark uppercase tracking-widest hover:underline">
              Voir tout
            </Link>
          </div>

          <div className="space-y-4">
            {userOrders.slice(0, 3).map((order) => (
              <Link to={`/orders/${order.id}`} key={order.id} className="flex items-center gap-6 p-6 rounded-3xl border border-slate-50 hover:border-slate-200 transition-all group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-light/20 group-hover:text-primary-dark transition-all">
                  <CircleCheckBig className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 line-clamp-1">{order.products?.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">{formatPrice(order.amount)}</p>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md",
                    order.status === 'delivered' ? "bg-green-100 text-green-600" : "bg-primary-light/20 text-primary-dark"
                  )}>
                    {order.status === 'delivered' ? 'Livré' : 'En cours'}
                  </span>
                </div>
                <MoveRight className="w-5 h-5 text-slate-200 group-hover:text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
