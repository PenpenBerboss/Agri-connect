import React from 'react';
import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  ChevronDown,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MOCK_STATS } from '../../services/mock/mockData';
import { formatPrice, cn } from '../../shared/utils';

const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107'];

export const ReportsTab = () => {
  const pieData = [
    { name: 'Cacao', value: 45 },
    { name: 'Café', value: 25 },
    { name: 'Manioc', value: 20 },
    { name: 'Autres', value: 10 },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header section with filters */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sleek">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Rapports de Performance</h2>
          <p className="text-slate-500 font-medium mt-1">Analyse détaillée de votre activité commerciale et agricole.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-3 rounded-2xl px-5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Derniers 30 jours</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <button className="flex items-center space-x-2 bg-slate-950 text-white px-8 py-4 rounded-2xl hover:bg-primary-dark shadow-xl shadow-slate-950/20 transition-all font-black text-[10px] uppercase tracking-widest">
            <Download className="w-4 h-4" />
            <span>Télécharger Rapport</span>
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sleek border-l-8 border-l-primary-dark">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Chiffre d'Affaires</p>
            <div className="flex items-end gap-3">
               <h3 className="text-3xl font-black text-slate-900">4,250,000 F</h3>
               <span className="text-emerald-500 text-[10px] font-black mb-1.5 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +15.4%
               </span>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sleek border-l-8 border-l-blue-500">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Volume Vendu</p>
            <div className="flex items-end gap-3">
               <h3 className="text-3xl font-black text-slate-900">12.5 T</h3>
               <span className="text-emerald-500 text-[10px] font-black mb-1.5 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +8.2%
               </span>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sleek border-l-8 border-l-amber-500">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Taux de Conversion</p>
            <div className="flex items-end gap-3">
               <h3 className="text-3xl font-black text-slate-900">24.8 %</h3>
               <span className="text-rose-500 text-[10px] font-black mb-1.5 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" /> -2.1%
               </span>
            </div>
         </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Monthly Revenue Chart */}
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sleek flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">Évolution Mensuelle</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Volume vs Revenu</p>
               </div>
               <Activity className="w-6 h-6 text-primary-dark" strokeWidth={3} />
            </div>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_STATS}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="sales" fill="#4CAF50" radius={[10, 10, 10, 10]} barSize={25} />
                    <Bar dataKey="products" fill="#e2e8f0" radius={[10, 10, 10, 10]} barSize={25} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution by Category */}
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sleek flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">Répartition par Catégorie</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Distribution du volume de vente</p>
               </div>
               <Layers className="w-6 h-6 text-slate-300" strokeWidth={3} />
            </div>
            <div className="flex items-center justify-center h-80 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">100%</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global</span>
               </div>
            </div>
            <div className="flex justify-center gap-6 flex-wrap mt-4">
               {pieData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{entry.name}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
