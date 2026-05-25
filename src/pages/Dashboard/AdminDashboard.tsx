import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Boxes, 
  Star, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  MoreVertical, 
  Trash2, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  UserCheck,
  AlertCircle,
  LogOut,
  Zap,
  Plus
} from 'lucide-react';
import { useStore } from '../../application/store/useStore';
import { formatPrice, cn } from '../../shared/utils';
import { Modal } from '../../components/ui/Modal';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

type AdminTab = 'stats' | 'users' | 'products' | 'reviews' | 'pending';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, register: registerUser } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab | 'settings'>('stats');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const pendingSellers = users.filter((u: any) => u.role === 'farmer' && u.status === 'pending');

  const validateSeller = async (seller: any) => {
    try {
       await apiService.updateProfileStatus(seller.id, 'active');
       setUsers(users.map(u => u.id === seller.id ? { ...u, status: 'active' } : u));
       toast.success(`Le vendeur ${seller.name} a été validé !`);
       setActiveTab('stats');
    } catch (error) {
       console.error("Error validating seller", error);
       toast.error("Erreur de validation");
    }
  };

  const rejectSeller = async (seller: any) => {
    try {
       await apiService.updateProfileStatus(seller.id, 'suspended');
       setUsers(users.map(u => u.id === seller.id ? { ...u, status: 'suspended' } : u));
       toast.success("Demande rejetée");
    } catch (error) {
       console.error("Error rejecting seller", error);
       toast.error("Erreur de rejet");
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
       try {
          const profilesData = await apiService.getProfiles();
          setUsers(profilesData);
          const productsData = await apiService.getProducts();
          setProducts(productsData);
          const ordersData = await apiService.getOrders();
          setOrders(ordersData);
          const reviewsData = await apiService.getReviews();
          setReviews(reviewsData);
       } catch (error) {
          console.error("Failed to load admin data", error);
       }
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

  const stats = [
    { label: 'Utilisateurs', value: users.length.toString(), icon: <Users />, color: 'from-blue-400 to-blue-600', trend: 'actif', isUp: true },
    { label: 'Ventes Totales', value: formatPrice(totalRevenue), icon: <Activity />, color: 'from-emerald-400 to-emerald-600', trend: 'xaf', isUp: true },
    { label: 'Produits Actifs', value: products.length.toString(), icon: <Boxes />, color: 'from-amber-400 to-amber-600', trend: 'stock', isUp: true },
    { label: 'Alertes', value: pendingSellers.length.toString(), icon: <AlertCircle />, color: 'from-rose-400 to-rose-600', trend: 'pending', isUp: false },
  ];
  const [usersPage, setUsersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const usersPaginated = users.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE);
  const productsPaginated = products.slice((productsPage - 1) * ITEMS_PER_PAGE, productsPage * ITEMS_PER_PAGE);

  const deleteUser = async (id: string) => {
     try {
        await apiService.deleteProfile(id);
        setUsers(users.filter(u => u.id !== id));
        toast.success("Utilisateur supprimé");
     } catch (e) {
        console.error("Error deleting user", e);
        toast.error("Erreur de suppression");
     }
  };
  const deleteProduct = async (id: string) => {
     try {
        await apiService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success("Produit supprimé");
     } catch (e) {
        console.error("Error deleting product", e);
        toast.error("Erreur de suppression");
     }
  };
  const approveReview = async (id: string) => {
    try {
      await apiService.deleteReview(id); // Using delete for both currently
      setReviews(reviews.filter(r => r.id !== id));
      toast.success("Avis approuvé");
    } catch (e) {
      console.error("Error approving review", e);
      toast.error("Erreur d'approbation");
    }
  };
  const deleteReview = async (id: string) => {
    try {
      await apiService.deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
      toast.success("Avis supprimé");
    } catch (e) {
      console.error("Error deleting review", e);
      toast.error("Erreur de suppression");
    }
  };

  const Pagination = ({ totalItems, currentPage, setPage }: { totalItems: number, currentPage: number, setPage: (p: number) => void }) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;
    return (
      <div className="flex gap-2 p-6 border-t border-slate-100 justify-center">
        <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-lg disabled:opacity-50">Précédent</button>
        <span className="px-4 py-2 font-bold text-xs flex items-center">Page {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-lg disabled:opacity-50">Suivant</button>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (stat.label === 'Alertes') setActiveTab('pending');
                    if (stat.label === 'Utilisateurs') setActiveTab('users');
                    if (stat.label === 'Produits Actifs') setActiveTab('products');
                  }}
                  className={cn(
                    "bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 transition-all",
                    (stat.label === 'Alertes' && pendingSellers.length > 0) ? "cursor-pointer hover:border-rose-300 hover:bg-rose-50/30" : "cursor-default"
                  )}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("w-12 h-12 flex items-center justify-center rounded-2xl text-white shadow-lg bg-gradient-to-br", stat.color)}>
                      {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 24 })}
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full",
                      stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                    )}>
                      {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Activité du Système</h3>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Graphique de performance (Simulé)</p>
              </div>
            </div>
          </div>
        );

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
                  {usersPaginated.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} className="w-10 h-10 rounded-xl bg-slate-100 object-cover" alt="" />
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
                        <button onClick={() => deleteUser(u.id)} className="p-2 text-rose-400 hover:text-rose-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination totalItems={users.length} currentPage={usersPage} setPage={setUsersPage} />
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Gestion des Produits</h3>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-primary-dark text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Plus size={16} />
                Ajouter un Projet
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5 text-left">Produit</th>
                    <th className="px-8 py-5 text-left">Catégorie</th>
                    <th className="px-8 py-5 text-left">Prix</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {productsPaginated.map((p) => (
                    <tr key={p.id}>
                      <td className="px-8 py-6 font-black text-sm">{p.name}</td>
                      <td className="px-8 py-6 text-sm text-slate-500">{p.category}</td>
                      <td className="px-8 py-6 text-sm">{formatPrice(p.price)}</td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => deleteProduct(p.id)} className="text-rose-500 hover:text-rose-700 font-bold text-xs">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination totalItems={products.length} currentPage={productsPage} setPage={setProductsPage} />
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Signalement & Avis</h3>
              <span className="bg-rose-50 text-rose-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {reviews.length} Avis en attente
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img src={review.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="font-black text-slate-900 text-sm">{review.profiles?.name || 'Anonymous'}</p>
                        <div className="flex text-accent">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={10} className={cn(i <= review.rating ? "fill-current" : "text-slate-100")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveReview(review.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => deleteReview(review.id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Demandes Vendeurs en attente</h3>
            </div>
            {pendingSellers.length === 0 ? (
               <p className="p-8 text-center text-slate-500">Aucune demande en attente.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-50">
                    {pendingSellers.map((seller) => (
                      <tr key={seller.id}>
                        <td className="px-8 py-6">{seller.name}</td>
                        <td className="px-8 py-6">{seller.email}</td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => validateSeller(seller)} className="text-emerald-500 font-bold text-xs mr-4">Valider</button>
                          <button onClick={() => rejectSeller(seller)} className="text-rose-500 font-bold text-xs">Rejeter</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-4xl mx-auto space-y-12 pb-12">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configuration Profil</h2>
                  <p className="text-slate-500 font-medium">Mise à jour de vos informations administratives.</p>
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
                  language: formData.get('language') as string,
                };
                try {
                  await useStore.getState().updateProfile(data);
                  toast.success('Profil Administrateur mis à jour !');
                } catch (err) {
                  toast.error('Erreur de mise à jour.');
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nom Complet</label>
                    <input name="name" type="text" defaultValue={user?.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                    <input name="email" type="email" defaultValue={user?.email} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Téléphone</label>
                    <input name="phone" type="tel" defaultValue={(user as any)?.phone || ''} placeholder="+237 6xx xxx xxx" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Langue</label>
                    <select name="language" defaultValue={(user as any)?.language || 'fr'} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none appearance-none cursor-pointer">
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ville</label>
                    <input name="city" type="text" defaultValue={(user as any)?.city || ''} placeholder="ex: Yaoundé" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Quartier</label>
                    <input name="neighborhood" type="text" defaultValue={(user as any)?.neighborhood || ''} placeholder="ex: Bastos" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary-light/10 transition-all outline-none" />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-primary-dark text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary-dark/20 hover:bg-black transition-all">
                    Enregistrer Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 p-8 sticky top-0 h-screen border-r border-slate-900">
        <div className="flex items-center gap-4 mb-20 px-2">
          <div className="w-10 h-10 bg-primary-dark rounded-xl flex items-center justify-center text-white rotate-6">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="font-black text-white text-lg tracking-tight">AdminPanel</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">v1.2 Stable</p>
          </div>
        </div>

        <nav className="space-y-3 flex-1">
          {[
            { id: 'stats', label: 'Statistiques', icon: <BarChart3 /> },
            { id: 'users', label: 'Utilisateurs', icon: <Users /> },
            { id: 'products', label: 'Produits', icon: <Boxes /> },
            { id: 'reviews', label: 'Modération', icon: <Star /> },
            { id: 'pending', label: 'Validation Producteurs', icon: <UserCheck /> },
            { id: 'settings', label: 'Configuration', icon: <Activity /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === item.id ? "bg-primary-dark text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <div className="flex items-center gap-4">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
                <span>{item.label}</span>
              </div>
              {item.id === 'pending' && pendingSellers.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-lg shadow-lg animate-pulse">
                  {pendingSellers.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="mt-auto flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Admin Console</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Gestion Centralisée AgriConnect Cameroon</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-black text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-primary-dark font-black uppercase tracking-widest">Super Administrateur</p>
            </div>
            <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-1 shadow-lg object-cover" alt="" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        
        <Modal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          title={modalTitle}
        >
          <p className="text-slate-600 leading-relaxed font-medium">
            {modalMessage}
          </p>
          <div className="mt-8">
            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-4 bg-emerald-500 text-white font-bold rounded-[1.5rem] hover:bg-emerald-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
};
