import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  MessageSquare, 
  ShieldAlert, 
  BarChart3, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  Menu
} from 'lucide-react';
import { MOCK_USERS, MOCK_PRODUCTS } from '../../data/mockData';
import { cn, formatPrice } from '../../lib/utils';
import { motion } from 'motion/react';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'reviews'>('users');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mini Sidebar */}
      <aside className="w-20 bg-gray-900 flex flex-col items-center py-8 space-y-8">
         <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-white"><ShieldAlert className="w-6 h-6" /></div>
         <div className="flex flex-col space-y-4">
            <button onClick={() => setActiveTab('users')} className={cn("p-4 rounded-2xl transition-all", activeTab === 'users' ? "bg-primary-light text-white shadow-lg" : "text-gray-400 hover:text-white")}><Users className="w-6 h-6" /></button>
            <button onClick={() => setActiveTab('products')} className={cn("p-4 rounded-2xl transition-all", activeTab === 'products' ? "bg-primary-light text-white shadow-lg" : "text-gray-400 hover:text-white")}><Package className="w-6 h-6" /></button>
            <button onClick={() => setActiveTab('reviews')} className={cn("p-4 rounded-2xl transition-all", activeTab === 'reviews' ? "bg-primary-light text-white shadow-lg" : "text-gray-400 hover:text-white")}><MessageSquare className="w-6 h-6" /></button>
         </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8 overflow-y-auto">
         <header className="flex justify-between items-center mb-10">
            <div>
               <h1 className="text-3xl font-black text-gray-900 capitalize">Console Admin: {activeTab}</h1>
               <p className="text-gray-500 font-medium">Modération et gestion de la plateforme AgriConnect.</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input placeholder="Rechercher..." className="bg-white border-none rounded-xl py-2.5 pl-10 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary-light" />
                </div>
            </div>
         </header>

         {/* Content based on Tab */}
         <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            {activeTab === 'users' && (
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                        <th className="px-8 py-5">Utilisateur</th>
                        <th className="px-8 py-5">Rôle</th>
                        <th className="px-8 py-5">Localisation</th>
                        <th className="px-8 py-5">Inscription</th>
                        <th className="px-8 py-5">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {MOCK_USERS.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-8 py-5 flex items-center space-x-3">
                              <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />
                              <div>
                                 <p className="font-bold text-sm text-gray-900">{u.name}</p>
                                 <p className="text-[10px] text-gray-400">{u.email}</p>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <span className={cn(
                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                                u.role === 'farmer' ? "bg-green-100 text-green-700" : u.role === 'admin' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                              )}>{u.role}</span>
                           </td>
                           <td className="px-8 py-5 text-xs text-gray-600 font-medium">{u.location || 'N/A'}</td>
                           <td className="px-8 py-5 text-xs text-gray-500 font-bold">{u.joinedAt}</td>
                           <td className="px-8 py-5">
                              <button className="text-gray-400 hover:text-gray-900"><MoreVertical className="w-4 h-4" /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}

            {activeTab === 'products' && (
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                        <th className="px-8 py-5">Produit</th>
                        <th className="px-8 py-5">Prix</th>
                        <th className="px-8 py-5">Vendeur</th>
                        <th className="px-8 py-5">Statut</th>
                        <th className="px-8 py-5">Vues</th>
                        <th className="px-8 py-5">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {MOCK_PRODUCTS.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-8 py-5">
                              <p className="font-bold text-sm text-gray-900 truncate max-w-[200px]">{p.name}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-black">{p.category}</p>
                           </td>
                           <td className="px-8 py-5 text-sm font-bold text-primary-dark">{formatPrice(p.price)}</td>
                           <td className="px-8 py-5 text-sm text-gray-600 font-medium">{p.sellerName}</td>
                           <td className="px-8 py-5">
                              <div className="flex items-center space-x-1 text-green-600">
                                 <CheckCircle className="w-3 h-3" />
                                 <span className="text-[10px] font-bold uppercase">Actif</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-sm font-bold text-gray-400">{p.views}</td>
                           <td className="px-8 py-5 flex space-x-2">
                              <button className="text-red-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                              <button className="text-blue-400 hover:text-blue-600"><CheckCircle className="w-4 h-4" /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}

            {activeTab === 'reviews' && (
               <div className="p-20 text-center text-gray-400 flex flex-col items-center">
                  <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold">Aucun avis à modérer pour le moment.</p>
               </div>
            )}
         </div>
      </main>
    </div>
  );
};
