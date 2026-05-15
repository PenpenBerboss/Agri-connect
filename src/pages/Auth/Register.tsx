import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, Leaf, MoveRight, UserPlus, ShieldCheck } from 'lucide-react';
import { useStore } from '../../application/store/useStore';
import { motion } from 'motion/react';
import { cn } from '../../shared/utils';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'react-hot-toast';

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'buyer' | 'farmer'>('buyer');
  const [showModal, setShowModal] = useState(false);
  const { register: registerUser } = useStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await registerUser({ ...data, role });
      toast.success('Compte créé avec succès !');
      if (role === 'farmer') {
        setShowModal(true);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
       console.error("Erreur inscription:", error);
       toast.error('Erreur lors de l’inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      <Modal 
        isOpen={showModal} 
        onClose={() => navigate('/login')} 
        title="Demande Soumise"
      >
        <p className="text-slate-600 leading-relaxed">
          Votre demande de création de compte vendeur a été soumise. Elle est en attente de validation par l'administrateur.
        </p>
        <div className="mt-8">
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-primary-dark text-white font-bold rounded-[1.5rem] hover:bg-primary-light transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </Modal>

      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-light/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full space-y-12 bg-white/80 backdrop-blur-2xl p-12 md:p-16 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white relative z-10"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 text-slate-950 group">
            <div className="p-3 bg-slate-950 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-slate-900/20">
               <Leaf className="w-6 h-6 text-primary-light" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-950">AgriConnect</span>
          </Link>
          <div className="mt-10 space-y-2">
            <h2 className="text-4xl font-black text-slate-950 tracking-tight">Rejoindre l'Alliance</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">
               Votre porte d'entrée vers l'excellence agricole camerounaise.
            </p>
          </div>
        </div>

        <div className="flex p-2 bg-slate-100/50 backdrop-blur-md rounded-[2rem] border border-slate-100 shadow-inner">
          <button 
            type="button" 
            onClick={() => setRole('buyer')}
            className={cn(
              "flex-1 py-4 px-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500", 
              role === 'buyer' ? "bg-white text-primary-dark shadow-xl shadow-slate-200/50 scale-[1.02]" : "text-slate-400 hover:text-slate-600"
            )}
          >Espace Acheteur</button>
          <button 
            type="button" 
            onClick={() => setRole('farmer')}
            className={cn(
              "flex-1 py-4 px-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500", 
              role === 'farmer' ? "bg-white text-primary-dark shadow-xl shadow-slate-200/50 scale-[1.02]" : "text-slate-400 hover:text-slate-600"
            )}
          >Espace Producteur</button>
        </div>

        <form className="mt-12 space-y-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identité Complète</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300"><User className="h-5 w-5" /></div>
                <input {...register('name', { required: true })} className="block w-full pl-14 pr-6 py-4.5 border border-slate-100 rounded-[1.5rem] bg-slate-50/50 text-slate-950 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-light/10 focus:bg-white focus:border-primary-light transition-all text-sm" placeholder="Ex: Paul Biya" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300"><Phone className="h-5 w-5" /></div>
                <input {...register('phone', { required: true })} className="block w-full pl-14 pr-6 py-4.5 border border-slate-100 rounded-[1.5rem] bg-slate-50/50 text-slate-950 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-light/10 focus:bg-white focus:border-primary-light transition-all text-sm" placeholder="+237 ..." />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Professionnel</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300"><Mail className="h-5 w-5" /></div>
              <input {...register('email', { required: true })} type="email" className="block w-full pl-14 pr-6 py-4.5 border border-slate-100 rounded-[1.5rem] bg-slate-50/50 text-slate-950 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-light/10 focus:bg-white focus:border-primary-light transition-all text-sm" placeholder="agence@domaine.cm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Clé Secrète</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300"><Lock className="h-5 w-5" /></div>
              <input {...register('password', { required: true, minLength: 6 })} type="password" className="block w-full pl-14 pr-6 py-4.5 border border-slate-100 rounded-[1.5rem] bg-slate-50/50 text-slate-950 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-light/10 focus:bg-white focus:border-primary-light transition-all text-sm" placeholder="••••••••" />
            </div>
            <p className="mt-3 text-[10px] text-slate-400 font-bold italic ml-1">Sécurité : 6 caractères minimum requis.</p>
          </div>

          <div className="bg-slate-950 rounded-[2rem] p-8 flex items-start space-x-4 border border-slate-900 shadow-2xl">
             <div className="bg-primary-dark/20 p-2 rounded-xl">
               <ShieldCheck className="w-5 h-5 text-primary-light" />
             </div>
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
               En activant votre profil, vous adhérez à la <strong>Charte de l'Alliance</strong> et à notre protocole de protection des données agricoles nationales.
             </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-5 px-8 border-none font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] text-white bg-primary-dark hover:bg-white hover:text-slate-950 shadow-[0_20px_50px_rgba(76,175,80,0.3)] hover:shadow-2xl hover:shadow-white/20 active:scale-[0.98] transition-all duration-500 group"
          >
            {isLoading ? (
              <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" /> Initialisation...</span>
            ) : (
              <span className="flex items-center">Activer mon Accès <MoveRight className="ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400">
          Déjà membre de l'Alliance ?{' '}
          <Link to="/login" className="text-primary-dark hover:text-primary-light transition-colors ml-2">Connectez-vous ici</Link>
        </p>
      </motion.div>
    </div>
  );
};
