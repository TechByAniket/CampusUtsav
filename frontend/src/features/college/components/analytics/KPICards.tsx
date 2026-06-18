import React from 'react';
import { motion } from 'framer-motion';

interface KPICardProps {
  label: string;
  value: string;
  trend: string;
  color: 'indigo' | 'violet' | 'emerald' | 'amber';
}

const KPICard: React.FC<KPICardProps> = ({ label, value, trend, color }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    violet: 'bg-violet-50 text-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm transition-all hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 group"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${colorMap[color]}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-[2rem] font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
    </motion.div>
  );
};

export const KPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Students" value="2,482" trend="+12%" color="indigo" />
      <KPICard label="Registrations" value="18.4k" trend="+5%" color="violet" />
      <KPICard label="Live Events" value="12" trend="Active" color="emerald" />
      <KPICard label="Engagement" value="94%" trend="+2%" color="amber" />
    </div>
  );
};
