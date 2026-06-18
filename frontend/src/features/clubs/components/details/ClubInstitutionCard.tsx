import React from 'react';
import { Briefcase, MapPin, Info } from 'lucide-react';

interface ClubInstitutionCardProps {
  collegeName: string;
  city: string;
  state: string;
  district: string;
}

export const ClubInstitutionCard: React.FC<ClubInstitutionCardProps> = ({ 
  collegeName, 
  city, 
  state, 
  district 
}) => {
  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[2rem] p-6 border border-white/5 shadow-xl text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/5 text-white/70 rounded-lg border border-white/10"><Briefcase size={16} /></div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/70">Institution</h3>
          </div>
          
          <h4 className="text-[13px] font-black uppercase tracking-tight leading-snug mb-5 text-white">
            {collegeName}
          </h4>
          
          <div className="space-y-3">
             <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/50">
                <MapPin size={12} className="text-indigo-400" /> {city}, {state}
             </div>
             <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/50">
                <Info size={12} className="text-indigo-400" /> District: {district}
             </div>
          </div>
          
          <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95">
            Institutional Portfolio
          </button>
        </div>
    </div>
  );
};

