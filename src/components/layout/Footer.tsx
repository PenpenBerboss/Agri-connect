import { Leaf, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-dark w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold text-white tracking-tight">AgriConnect</span>
                <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Cameroon</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              La première plateforme de mise en relation directe entre les agriculteurs camerounais et les acheteurs locaux. Nous simplifions l'agrobusiness en Afrique Centrale.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary-dark hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary-dark hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary-dark hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Plateforme</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-primary-light transition-colors">Marketplace</Link></li>
              <li><Link to="/map" className="hover:text-primary-light transition-colors">Carte interactive</Link></li>
              <li><Link to="/categories" className="hover:text-primary-light transition-colors">Catégories</Link></li>
              <li><Link to="/sellers" className="hover:text-primary-light transition-colors">Devenir vendeur</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="hover:text-primary-light transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary-light transition-colors">Contactez-nous</Link></li>
              <li><Link to="/terms" className="hover:text-primary-light transition-colors">Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-light transition-colors">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Contact</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-light shrink-0" />
                <span>Bastos, Yaoundé, Cameroun</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-light shrink-0" />
                <span>+237 6XX XX XX XX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-light shrink-0" />
                <span>hello@agriconnect.cm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">
          <p>© {new Date().getFullYear()} AgriConnect Cameroon.</p>
          <p>Propulsé par la technologie au service de la terre.</p>
        </div>
      </div>
    </footer>
  );
};
