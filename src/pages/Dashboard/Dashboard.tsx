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
  Package, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { MOCK_STATS, MOCK_PRODUCTS } from '../../data/mockData';
import { formatPrice, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CatalogueTab } from './CatalogueTab';
import { TransactionsTab } from './TransactionsTab';
import { ReportsTab } from './ReportsTab';

type TabType = 'overview' | 'catalogue' | 'transactions' | 'reports' | 'settings';

export const Dashboard = () => {
  const { user, logout } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const userProducts = MOCK_PRODUCTS.filter(p => p.sellerId === user?.id);

  const stats = [
    { label: 'Ventes Mensuelles', value: '1.25M XAF', icon: <DollarSign />, color: 'from-emerald-400 to-emerald-600', trend: '+12%' },
    { label: 'Portée Totale', value: '4.89K', icon: <Eye />, color: 'from-blue-400 to-blue-600', trend: '+5%' },
    { label: 'Stock Actif', value: userProducts.length.toString(), icon: <Package />, color: 'from-amber-400 to-amber-600', trend: '-2%' },
    { label: 'Performance', value: '94%', icon: <TrendingUp />, color: 'from-rose-400 to-rose-600', trend: '+8%' },
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
                     <div className="p-3 bg-slate-50 rounded-2xl"><Package className="w-5 h-5 text-slate-400" /></div>
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
              <Calendar className="w-10 h-10 text-slate-300" />
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
              <TrendingUp className="w-6 h-6" />
           </div>
           <div className="flex flex-col -space-y-1">
              <span className="font-black text-2xl tracking-tighter text-white">AgriPanel</span>
              <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Enterprise v2.0</span>
           </div>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'overview', label: 'Dashboard', icon: <TrendingUp className="w-5 h-5" /> },
            { id: 'catalogue', label: 'Catalogue', icon: <Package className="w-5 h-5" /> },
            { id: 'transactions', label: 'Transactions', icon: <DollarSign className="w-5 h-5" /> },
            { id: 'reports', label: 'Rapports', icon: <BarChart className="w-5 h-5" /> },
            { id: 'settings', label: 'Configuration', icon: <Settings className="w-5 h-5" /> },
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

        <div className="mt-auto space-y-6">
          <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-900">
             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Statut Serveur</p>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-xs font-bold text-emerald-500">Operationel • Douala</span>
             </div>
          </div>
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
               <button className="bg-primary-dark text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-3 shadow-2xl shadow-primary-dark/20 hover:scale-105 active:scale-95 transition-all">
                  <Plus className="w-5 h-5" />
                  <span>Nouveau</span>
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
    </div>
  );
};
