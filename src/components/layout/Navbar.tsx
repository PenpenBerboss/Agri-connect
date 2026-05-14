import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  User as UserIcon, 
  Heart, 
  ShoppingCart, 
  Leaf,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout, favorites, cart } = useStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm transition-all h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary-dark w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-bold text-primary-dark tracking-tight">AgriConnect</span>
              <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Cameroon</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-light transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Rechercher manioc, cacao, maïs..."
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary-light transition-all text-sm font-medium placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/products" className="text-slate-600 hover:text-primary-dark font-semibold text-sm">Marketplace</Link>
            <Link to="/map" className="text-slate-600 hover:text-primary-dark font-semibold text-sm">Carte</Link>
            
            <div className="h-8 w-px bg-slate-200 mx-2" />

            <Link to="/favorites" className="relative text-slate-500 hover:text-primary-dark transition-colors">
              <Heart className="w-6 h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-slate-500 hover:text-primary-dark transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-dark text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user?.role === 'farmer' ? 'Vendeur Certifié' : 'Acheteur'}</p>
                </div>
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform overflow-hidden border-2 border-white">
                  {user?.avatar ? <img src={user.avatar} alt="" /> : user?.name?.substring(0, 2).toUpperCase()}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-dark text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-opacity-95 shadow-lg shadow-primary-dark/10 transition-all active:scale-95"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             <Link to="/favorites" className="relative text-gray-600">
              <Heart className="w-6 h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold px-1.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-gray-500" />
                </button>
              </form>
              <div className="flex flex-col space-y-3">
                <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Accueil</Link>
                <Link to="/products" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Tous les produits</Link>
                <Link to="/map" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Carte interactive</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-primary-dark font-bold">Mon Dashboard</Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-left text-red-600 font-medium">Déconnexion</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="bg-primary-dark text-white text-center py-2 rounded-full font-bold">Connexion / Inscription</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
