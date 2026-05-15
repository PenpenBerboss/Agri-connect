import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, Leaf, MoveRight, Github, ShieldCheck } from 'lucide-react';
import { useStore } from '../../application/store/useStore';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const pending = JSON.parse(localStorage.getItem('AGR_PENDING_SELLERS') || '[]');
      const isPending = pending.find((s:any) => s.email === data.email);
      if (isPending) {
         alert('Votre compte est en attente de validation par l\'administrateur.');
         setIsLoading(false);
         return;
      }
      await login(data.email, data.password);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-light/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full space-y-10 bg-white/80 backdrop-blur-2xl p-12 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white relative z-10"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 text-slate-950 group">
            <div className="p-3 bg-slate-950 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-slate-900/20">
               <Leaf className="w-6 h-6 text-primary-light" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-950">AgriConnect</span>
          </Link>
          <div className="mt-10 space-y-2">
            <h2 className="text-4xl font-black text-slate-950 tracking-tight">Accès Privé</h2>
            <p className="text-slate-500 font-medium text-lg italic">
              "La terre ne ment jamais, connectez-vous y."
            </p>
          </div>
        </div>

        <form className="mt-12 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Identifiant Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  {...register('email', { required: 'Email requis' })}
                  type="email"
                  className="block w-full pl-14 pr-6 py-4.5 border border-slate-100 rounded-[1.5rem] bg-slate-50/50 text-slate-950 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-light/10 focus:bg-white focus:border-primary-light transition-all text-sm"
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-[10px] text-rose-500 font-black uppercase tracking-widest ml-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Clef d'accès</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  {...register('password', { required: 'Mot de passe requis' })}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-14 pr-14 py-4.5 border border-slate-100 rounded-[1.5rem] bg-slate-50/50 text-slate-950 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-light/10 focus:bg-white focus:border-primary-light transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-[10px] text-rose-500 font-black uppercase tracking-widest ml-1">{errors.password.message as string}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer appearance-none h-5 w-5 border-2 border-slate-200 rounded-lg checked:bg-primary-dark checked:border-primary-dark transition-all cursor-pointer" />
                <ShieldCheck className="absolute h-3 w-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <label className="ml-3 block text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer group-hover:text-slate-900 transition-colors">Rester connecté</label>
            </div>
            <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary-dark hover:text-primary-light transition-colors">Oubli ?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-5 px-6 border-none font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] text-white bg-slate-950 hover:bg-primary-dark shadow-2xl shadow-slate-950/20 active:scale-[0.98] disabled:opacity-50 transition-all duration-500 group"
          >
            {isLoading ? (
              <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" /> Traitement...</span>
            ) : (
              <span className="flex items-center">Entrer dans l'Alliance <MoveRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            )}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="bg-white/80 backdrop-blur-xl px-6 text-slate-300">Synchronisation</span></div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button 
              type="button" 
              onClick={() => useStore.getState().signInWithGoogle()}
              className="flex items-center justify-center gap-3 px-6 py-4 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white/50 hover:bg-white hover:shadow-xl transition-all shadow-slate-200/50"
            >
               <Github className="w-4 h-4" /> Google
            </button>
            <button 
              type="button" 
              onClick={() => useStore.getState().signInWithFacebook()}
              className="flex items-center justify-center gap-3 px-6 py-4 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white/50 hover:bg-white hover:shadow-xl transition-all shadow-slate-200/50"
            >
               Facebook
            </button>
          </div>
        </form>

        <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400">
          Nouveau sur le marché ?{' '}
          <Link to="/register" className="text-primary-dark hover:text-primary-light flex items-center justify-center mt-3 group">
             Créer mon profil d'acheteur <MoveRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
