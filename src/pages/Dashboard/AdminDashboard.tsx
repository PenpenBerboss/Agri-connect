import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import { useStore } from '../../application/store/useStore';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_REVIEWS } from '../../services/mock/mockData';
import { formatPrice, cn } from '../../shared/utils';
import { Modal } from '../../components/ui/Modal';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'stats' | 'users' | 'products' | 'reviews' | 'pending';

export const AdminDashboard = () => {
  const { user, logout, register: registerUser } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  React.useEffect(() => {
    const saved = localStorage.getItem('AGR_PENDING_SELLERS');
    if (saved) setPendingSellers(JSON.parse(saved));
  }, []);

  const savePendingSellers = (sellers: any[]) => {
    localStorage.setItem('AGR_PENDING_SELLERS', JSON.stringify(sellers));
    setPendingSellers(sellers);
  };
   
  const validateSeller = async (seller: any) => {
    await registerUser(seller);
    savePendingSellers(pendingSellers.filter(s => s.email !== seller.email));
    setModalTitle('Compte validé');
    setModalMessage(`Le vendeur ${seller.name} a été validé avec succès.`);
    setShowModal(true);
    setActiveTab('stats');
  };

  const rejectSeller = (email: string) => {
    savePendingSellers(pendingSellers.filter(s => s.email !== email));
  };

  const stats = [
    { label: 'Utilisateurs', value: MOCK_USERS.length.toString(), icon: <Users />, color: 'from-blue-400 to-blue-600', trend: '+12%', isUp: true },
    { label: 'Ventes Totales', value: '4.2M XAF', icon: <Activity />, color: 'from-emerald-400 to-emerald-600', trend: '+25%', isUp: true },
    { label: 'Produits Actifs', value: MOCK_PRODUCTS.length.toString(), icon: <Boxes />, color: 'from-amber-400 to-amber-600', trend: '+8%', isUp: true },
    { label: 'Alertes', value: '3', icon: <AlertCircle />, color: 'from-rose-400 to-rose-600', trend: '-2', isUp: false },
  ];

  const [users, setUsers] = useState(MOCK_USERS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [usersPage, setUsersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const usersPaginated = users.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE);
  const productsPaginated = products.slice((productsPage - 1) * ITEMS_PER_PAGE, productsPage * ITEMS_PER_PAGE);

  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));
  const approveReview = (id: string) => setReviews(reviews.filter(r => r.id !== id));
  const deleteReview = (id: string) => setReviews(reviews.filter(r => r.id !== id));

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
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("w-12 h-12 flex items-center justify-center rounded-2xl text-white shadow-lg bg-gradient-to-br", stat.color)}>
                      {React.cloneElement(stat.icon as React.ReactElement, { size: 24 })}
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
                          <img src={u.avatar} className="w-10 h-10 rounded-xl bg-slate-100" alt="" />
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
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase">Actif</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-slate-400">{u.joinedAt}</td>
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
                      <img src={review.userAvatar} className="w-10 h-10 rounded-xl" alt="" />
                      <div>
                        <p className="font-black text-slate-900 text-sm">{review.userName}</p>
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
                      <tr key={seller.email}>
                        <td className="px-8 py-6">{seller.name}</td>
                        <td className="px-8 py-6">{seller.email}</td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => validateSeller(seller)} className="text-emerald-500 font-bold text-xs mr-4">Valider</button>
                          <button onClick={() => rejectSeller(seller.email)} className="text-rose-500 font-bold text-xs">Rejeter</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
            { id: 'pending', label: 'Demandes Vendeurs', icon: <UserCheck /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === item.id ? "bg-primary-dark text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              {React.cloneElement(item.icon as React.ReactElement, { size: 18 })}
              <span>{item.label}</span>
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
            <img src={user?.avatar} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-1 shadow-lg" alt="" />
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
