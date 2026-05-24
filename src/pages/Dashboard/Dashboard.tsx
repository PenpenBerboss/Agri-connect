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
  X,
  Users,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';
import { useStore } from '../../application/store/useStore';
import { formatPrice, cn } from '../../shared/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CatalogueTab } from './CatalogueTab';
import { TransactionsTab } from './TransactionsTab';
import { ReportsTab } from './ReportsTab';
import { AdminDashboard } from './AdminDashboard';
import { toast } from 'react-hot-toast';
import { ImageUploader } from '../../components/ImageUploader';
import { CATEGORIES } from '../../core/constants';
import { apiService } from '../../services/apiService';

type TabType = 'overview' | 'catalogue' | 'transactions' | 'reports' | 'settings' | 'users';

export const Dashboard = () => {
  const { user, logout, addProduct, products, orders, fetchOrders } = useStore();
  const userProducts = user?.role === 'admin' ? products : products.filter(p => p.seller_id === user?.id);
  const userOrders = user?.role === 'admin' ? orders : orders.filter(o => o.seller_id === user?.id || (o.product_id && userProducts.some(p => p.id === o.product_id)));

  React.useEffect(() => {
    if (orders.length === 0) fetchOrders();
  }, [fetchOrders, orders.length]);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  const [productImage, setProductImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');

  React.useEffect(() => {
    if (user?.role === 'admin') {
      apiService.getProfiles().then(setUsers).catch(console.error);
    }
  }, [user?.role]);

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || '').includes(userSearch.toLowerCase()) || 
    (u.email?.toLowerCase() || '').includes(userSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return alert('Erreur: Session utilisateur introuvable. Veuillez vous reconnecter.');
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    
    setIsLoading(true);
    try {
      const newProduct = {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000),
        category: formData.get('category') as string,
        subcategory: formData.get('subcategory') as string,
        price: Number(formData.get('price')),
        unit: formData.get('unit') as string,
        location: {
           city: (formData.get('location') as string) || user.city || 'Yaoundé',
           lat: (user as any).lat || 3.8480,
           lng: (user as any).lng || 11.5021,
           region: (user as any).region || 'Centre'
        },
        description: formData.get('description') as string,
        seller_id: user.id,
        seller_name: user.name,
        images: [productImage || 'https://images.unsplash.com/photo-1595111028886-df9b824d395a?w=800&q=80'],
        stock: Number(formData.get('stock') || 100),
        harvest_period: formData.get('harvest_period') as string,
        season: formData.get('season') as string,
        availability_status: 'disponible',
        recommendation_tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(v => v.trim()) : [],
        keywords: [formData.get('category') as string, formData.get('subcategory') as string, name],
      };

      await addProduct(newProduct as any);
      setShowAddProduct(false);
      setActiveTab('catalogue');
      setProductImage('');
      toast.success('Produit publié avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de la publication du produit:', error);
      toast.error(`Erreur: ${error.message || 'Impossible de publier le produit'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = toast.loading('Enregistrement de la vente...');
    try {
      // Mocking async sale
      await new Promise(r => setTimeout(r, 1000));
      toast.success(`Vente enregistrée: ${formData.get('productName')}`, { id });
      setShowAddSale(false);
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement', { id });
    }
  };

  const totalRevenue = userOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const totalSales = userOrders.length;
  // Dynamic stats
  const stats = [
    { label: 'Nombre Produits', value: userProducts.length.toString(), icon: <Boxes />, color: 'from-amber-400 to-amber-600', trend: 'actif' },
    { label: 'Ventes Totales', value: totalSales.toString(), icon: <ScanEye />, color: 'from-blue-400 to-blue-600', trend: 'livré' },
    { label: 'Revenu Total', value: formatPrice(totalRevenue), icon: <HandCoins />, color: 'from-emerald-400 to-emerald-600', trend: 'xaf' },
    { label: 'Note Moyenne', value: `5.0/5`, icon: <Star />, color: 'from-rose-400 to-rose-600', trend: 'stable' },
  ];

  // Generate dynamic chart data based on userOrders
  const getChartData = () => {
     if (userOrders.length === 0) return [{ name: 'Vide', sales: 0 }];
     
     const grouped: Record<string, number> = {};
     userOrders.forEach(o => {
        const date = new Date(o.created_at);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
        grouped[monthName] = (grouped[monthName] || 0) + Number(o.amount || 0);
     });
     
     return Object.keys(grouped).map(key => ({ name: key, sales: grouped[key] }));
  };
  const dynamicStats = getChartData();

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
                        <AreaChart data={dynamicStats}>
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
      case 'users':
        return (
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Gestion des Utilisateurs</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Rechercher un utilisateur..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary-light transition-all outline-none" 
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5 text-left">Utilisateur</th>
                    <th className="px-8 py-5 text-left">Rôle</th>
                    <th className="px-8 py-5 text-left">Statut</th>
                    <th className="px-8 py-5 text-left">Date d'inscription</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-10 h-10 rounded-xl bg-slate-100 object-cover" alt="" />
                          <div>
                            <p className="font-black text-slate-900 text-sm">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg",
                          u.role === 'admin' ? "bg-rose-50 text-rose-500" : u.role === 'farmer' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-500"
                        )}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            u.status === 'active' ? "bg-emerald-500" : u.status === 'suspended' ? "bg-rose-500" : "bg-amber-500"
                          )} />
                          <span className="text-[10px] font-bold text-slate-600 uppercase">{u.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-slate-400">{new Date(u.joined_at).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={async () => {
                            if (window.confirm('Supprimer cet utilisateur ?')) {
                              try {
                                await apiService.deleteProfile(u.id);
                                setUsers(users.filter(usr => usr.id !== u.id));
                                toast.success('Utilisateur supprimé');
                              } catch (e) {
                                toast.error('Erreur lors de la suppression');
                              }
                            }
                          }}
                          className="p-2 text-rose-400 hover:text-rose-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto space-y-12 pb-12">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Paramètres du Compte</h2>
                  <p className="text-slate-500 font-medium">Gérez vos informations personnelles et préférences.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-3xl">
                  <Settings2 className="w-8 h-8 text-slate-400" />
                </div>
              </div>

              <form className="space-y-8" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name') as string,
                  avatar_url: formData.get('avatar_url') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  city: formData.get('city') as string,
                  neighborhood: formData.get('neighborhood') as string,
                  region: formData.get('region') as string,
                  lat: formData.get('lat') ? Number(formData.get('lat')) : undefined,
                  lng: formData.get('lng') ? Number(formData.get('lng')) : undefined,
                  language: formData.get('language') as string,
                };
                try {
                  await useStore.getState().updateProfile(data);
                  toast.success('Profil mis à jour avec succès !');
                } catch (err) {
                  toast.error('Erreur lors de la mise à jour.');
                }
              }}>
                <div className="flex items-center gap-8 mb-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="w-24 h-24 bg-primary-light/20 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                    <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Photo de profil</p>
                    <ImageUploader 
                      bucket="profiles" 
                      onUpload={(url) => {
                        useStore.getState().updateProfile({ avatar_url: url });
                      }}
                      defaultImage={user?.avatar_url}
                    />
                    <input type="hidden" name="avatar_url" defaultValue={user?.avatar_url || ''} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nom Complet</label>
                    <input name="name" type="text" defaultValue={user?.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                    <input name="email" type="email" defaultValue={user?.email} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Téléphone</label>
                    <input name="phone" type="tel" defaultValue={(user as any)?.phone || ''} placeholder="+237 6xx xxx xxx" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Langue</label>
                    <select name="language" defaultValue={(user as any)?.language || 'fr'} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none appearance-none cursor-pointer">
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ville</label>
                    <input name="city" type="text" defaultValue={(user as any)?.city || ''} placeholder="ex: Yaoundé" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Région</label>
                    <input name="region" type="text" defaultValue={(user as any)?.region || ''} placeholder="ex: Centre" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Quartier</label>
                    <input name="neighborhood" type="text" defaultValue={(user as any)?.neighborhood || ''} placeholder="ex: Bastos" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Latitude</label>
                    <input name="lat" type="number" step="any" defaultValue={(user as any)?.lat || 3.8480} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Longitude</label>
                    <input name="lng" type="number" step="any" defaultValue={(user as any)?.lng || 11.5021} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-primary-dark text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary-dark/20 hover:bg-black transition-all">
                    Enregistrer les Modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-200 shadow-sleek">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CalendarDays className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Section Indisponible</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Cette fonctionnalité sera bientôt activée pour votre compte.
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
          {([
            { id: 'overview', label: 'Dashboard', icon: <Zap className="w-5 h-5" /> },
            { id: 'catalogue', label: 'Catalogue', icon: <Boxes className="w-5 h-5" /> },
            { id: 'transactions', label: 'Transactions', icon: <HandCoins className="w-5 h-5" /> },
            { id: 'reports', label: 'Rapports', icon: <BarChart3 className="w-5 h-5" /> },
            user?.role === 'admin' && { id: 'users', label: 'Utilisateurs', icon: <Users className="w-5 h-5" /> },
            { id: 'settings', label: 'Configuration', icon: <Settings2 className="w-5 h-5" /> },
          ].filter(Boolean) as any[]).map((item) => (
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
                           {CATEGORIES.map(cat => (
                             <option key={cat.value} value={cat.value}>{cat.label}</option>
                           ))}
                           <option value="épices">Épices</option>
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sous-catégorie</label>
                        <input name="subcategory" type="text" placeholder="ex: manioc, poivre, etc." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Période de récolte</label>
                        <input name="harvest_period" type="text" placeholder="ex: Juin-Août" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Saison</label>
                        <input name="season" type="text" placeholder="ex: Saison Sèche" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
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

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stock Disponible</label>
                        <input name="stock" type="number" placeholder="ex: 500" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Mots-clés / Tags (séparés par virgule)</label>
                        <input name="tags" type="text" placeholder="bio, frais, local" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                      </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                     <textarea name="description" placeholder="Décrivez la qualité, l'origine et la disponibilité..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none min-h-[120px]" required></textarea>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Image du produit</label>
                     <ImageUploader 
                       bucket="products" 
                       onUpload={(url) => setProductImage(url)} 
                       defaultImage={productImage}
                     />
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
