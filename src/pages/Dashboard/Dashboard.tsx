import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Plus, 
  Boxes, 
  ScanEye, 
  Zap, 
  HandCoins, 
  Settings2, 
  LogOut,
  BellRing,
  Search,
  MoveRight,
  LocateFixed,
  CalendarDays,
  MessageSquare,
  Star,
  BarChart3,
  X
} from 'lucide-react';
import { useStore } from '../../application/store/useStore';
import { MOCK_STATS, MOCK_PRODUCTS } from '../../services/mock/mockData';
import { formatPrice, cn } from '../../shared/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CatalogueTab } from './CatalogueTab';
import { TransactionsTab } from './TransactionsTab';
import { ReportsTab } from './ReportsTab';
import { ImageUploader } from '../../components/ImageUploader';

type TabType = 'overview' | 'catalogue' | 'transactions' | 'reports' | 'settings';

export const Dashboard = () => {
  const { user, logout, addProduct, products } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  const [productImage, setProductImage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      unit: formData.get('unit') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      sellerId: user?.id || '1',
      sellerName: user?.name || 'Vendeur',
      images: [productImage || 'https://images.unsplash.com/photo-1595111028886-df9b824d395a?w=800&q=80'], // Use uploaded image
      stock: 100,
      rating: 5,
      reviews: 0,
      views: 0,
      tags: ['Nouveau']
    };

    addProduct(newProduct as any);
    setShowAddProduct(false);
    setActiveTab('catalogue');
    setProductImage('');
  };

  const handleSaleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    alert(`Nouvelle vente: ${formData.get('productName')} - ${formData.get('quantity')} unités.`);
    setShowAddSale(false);
  };

  const totalViews = userProducts.reduce((sum, p) => sum + (p.views || 0), 0);
  const avgRating = userProducts.length > 0 
    ? (userProducts.reduce((sum, p) => sum + p.rating, 0) / userProducts.length).toFixed(1) 
    : '0.0';

  const stats = [
    { label: 'Nombre Produits', value: userProducts.length.toString(), icon: <Boxes />, color: 'from-amber-400 to-amber-600', trend: '+2' },
    { label: 'Vues Totales', value: totalViews >= 1000 ? `${(totalViews/1000).toFixed(1)}K` : totalViews.toString(), icon: <ScanEye />, color: 'from-blue-400 to-blue-600', trend: '+15%' },
    { label: 'Contacts Reçus', value: '24', icon: <MessageSquare />, color: 'from-emerald-400 to-emerald-600', trend: '+5' },
    { label: 'Note Moyenne', value: `${avgRating}/5`, icon: <Star />, color: 'from-rose-400 to-rose-600', trend: 'stable' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-12 pb-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {stats.map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-6 relative overflow-hidden group"
                  >
                     <div className={cn("absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-[0.03] rounded-bl-[100px] transition-all group-hover:scale-150", stat.color)} />
                     <div className="flex justify-between items-start">
                       <div className={cn("w-14 h-14 flex items-center justify-center rounded-2xl text-white shadow-2xl bg-gradient-to-br shadow-slate-900/10", stat.color)}>
                          {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-7 h-7' })}
                       </div>
                       <div className={cn("px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-slate-50 border border-slate-100", 
                         stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'
                       )}>
                         {stat.trend}
                       </div>
                     </div>
                     <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{stat.value}</p>
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
               {/* Sales Chart */}
               <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex justify-between items-end mb-12">
                     <div>
                       <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analyse de Croissance</h2>
                       <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Évolution des ventes par trimestre</p>
                     </div>
                     <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button className="px-6 py-2.5 text-[10px] font-black uppercase bg-white shadow-xl rounded-xl text-primary-dark">Volume</button>
                        <button className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">Revenu</button>
                     </div>
                  </div>
                  <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_STATS}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={15} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                          <Tooltip 
                           contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                          />
                          <Area 
                           type="monotone" 
                           dataKey="sales" 
                           stroke="#4CAF50" 
                           strokeWidth={6} 
                           fillOpacity={1} 
                           fill="url(#colorSales)" 
                          />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Product Table Sidebar */}
               <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-10">
                     <h2 className="text-xl font-black text-slate-900 tracking-tight">Top Stocks</h2>
                     <div className="p-3 bg-slate-50 rounded-2xl"><Boxes className="w-5 h-5 text-slate-400" /></div>
                  </div>
                  <div className="space-y-6 flex-1">
                     {userProducts.slice(0, 5).map((p) => (
                       <div key={p.id} className="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-lg border-2 border-white">
                           <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="font-black text-slate-900 truncate text-sm">{p.name}</h4>
                             <div className="flex items-center justify-between mt-1">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.stock} {p.unit}</span>
                               <span className="text-xs font-black text-primary-dark tracking-tighter">{formatPrice(p.price)}</span>
                             </div>
                             <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                               <div className="bg-primary-dark h-full font-bold" style={{ width: `${Math.min(100, (p.stock / 500) * 100)}%` }} />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('catalogue')}
                    className="mt-10 w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all"
                  >
                     Voir tout l'inventaire
                  </button>
               </div>
            </div>
          </div>
        );
      case 'catalogue':
        return <CatalogueTab />;
      case 'transactions':
        return <TransactionsTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-200 shadow-sleek">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CalendarDays className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Bientôt disponible</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Cette section est en cours d'optimisation pour votre exploitation.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 bg-slate-950 text-slate-400 p-8 border-r border-slate-900 sticky top-0 h-screen">
        <div className="flex items-center space-x-4 mb-16 px-2">
           <div className="w-12 h-12 bg-primary-dark rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-primary-dark/20 rotate-6">
              <Zap className="w-6 h-6" />
           </div>
           <div className="flex flex-col -space-y-1">
              <span className="font-black text-2xl tracking-tighter text-white">AgriPanel</span>
              <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Enterprise v2.0</span>
           </div>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'overview', label: 'Dashboard', icon: <Zap className="w-5 h-5" /> },
            { id: 'catalogue', label: 'Catalogue', icon: <Boxes className="w-5 h-5" /> },
            { id: 'transactions', label: 'Transactions', icon: <HandCoins className="w-5 h-5" /> },
            { id: 'reports', label: 'Rapports', icon: <BarChart3 className="w-5 h-5" /> },
            { id: 'settings', label: 'Configuration', icon: <Settings2 className="w-5 h-5" /> },
          ].map((item) => (
             <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as TabType)}
              className={cn(
                "w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all group",
                activeTab === item.id ? "bg-primary-dark text-white shadow-2xl shadow-primary-dark/20" : "hover:bg-slate-900 hover:text-white"
              )}
             >
               <span className={cn("transition-colors", activeTab === item.id ? "text-white" : "text-slate-600 group-hover:text-primary-light")}>{item.icon}</span>
               <span>{item.label}</span>
               {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-xl" />}
             </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Sortie</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 space-y-12 overflow-y-auto w-full max-w-full">
         {/* Top Bar */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                 {activeTab === 'overview' ? `Bonjour, ${user?.name} 🇨🇲` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
               </h1>
               <p className="text-slate-500 font-medium">
                 {activeTab === 'overview' ? "Vue d'ensemble de votre exploitation agricole." : `Gestion de votre section ${activeTab}.`}
               </p>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input placeholder="Rechercher..." className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-4 focus:ring-primary-light/10 transition-all" />
               </div>
               <button 
                  onClick={() => {
                    if (activeTab === 'catalogue') setShowAddProduct(true);
                    else if (activeTab === 'transactions') alert('Nouvelle transaction (Simulé)');
                    else if (activeTab === 'reports') alert('Nouvelle exportation (Simulé)');
                    else setShowAddProduct(true);
                  }}
                  className="bg-primary-dark text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-3 shadow-2xl shadow-primary-dark/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  <span>
                    {activeTab === 'catalogue' ? 'Nouveau Produit' : 
                     activeTab === 'transactions' ? 'Nouvelle Vente' : 
                     activeTab === 'reports' ? 'Export Rapport' : 'Nouveau'}
                  </span>
               </button>
            </div>
         </div>

         <AnimatePresence mode="wait">
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, x: 10 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -10 }}
             transition={{ duration: 0.3 }}
           >
             {renderContent()}
           </motion.div>
         </AnimatePresence>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProduct(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] my-auto"
            >
              <div className="p-10 shrink-0">
                <div className="flex justify-between items-start mb-8">
                   <div>
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nouveau Produit</h2>
                     <p className="text-slate-500 font-medium">Remplissez les détails pour publier sur le marché.</p>
                   </div>
                   <button onClick={() => setShowAddProduct(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                     <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nom du produit</label>
                        <input name="name" type="text" placeholder="ex: Maïs de l'Ouest" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Catégorie</label>
                        <select name="category" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none appearance-none cursor-pointer">
                           <option>Céréales</option>
                           <option>Tubercules</option>
                           <option>Fruits</option>
                           <option>Légumes</option>
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Prix (XAF)</label>
                        <input name="price" type="number" placeholder="2500" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Unité</label>
                        <input name="unit" type="text" placeholder="kg, sac, régime" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ville</label>
                        <input name="location" type="text" placeholder="Bafoussam" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                      </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                     <textarea name="description" placeholder="Décrivez la qualité, l'origine et la disponibilité..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none min-h-[120px]" required></textarea>
                   </div>

                   <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center hover:border-primary-light transition-all group cursor-pointer">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-light/10 transition-all">
                        <Plus className="w-6 h-6 text-slate-300 group-hover:text-primary-dark" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ajouter des photos</p>
                   </div>

                   <button type="submit" className="w-full bg-primary-dark text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary-dark/20 hover:bg-black transition-all">
                      Publier Maintenant
                   </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
