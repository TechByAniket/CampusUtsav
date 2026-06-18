import React from 'react';
import { Info, GraduationCap, Calendar } from 'lucide-react';

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoTile = ({ icon, label, value }: InfoTileProps) => (
  <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50 flex items-center gap-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/20">
    <div className="p-3 bg-white border border-slate-100 text-indigo-600 rounded-2xl shadow-sm">{icon}</div>
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-sm font-black text-slate-800 uppercase leading-none">{value}</p>
    </div>
  </div>
);

interface ClubMissionProps {
  description: string;
  branch: string;
  createdAt: string;
}

export const ClubMission: React.FC<ClubMissionProps> = ({ description, branch, createdAt }) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
       <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm text-indigo-600">
            <Info size={18} />
          </div>
          <div>
            <h2 className="text-[11px] font-black text-slate-900 tracking-[0.05em] uppercase leading-none">Mission & Vision</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Organizational Purpose</p>
          </div>
       </div>
       
       <p className="text-slate-600 text-sm leading-relaxed font-medium italic border-l-2 border-indigo-100 pl-4 py-1">
         "{description}"
       </p>
       
       <div className="grid grid-cols-2 gap-4 mt-8">
          <InfoTile icon={<GraduationCap size={16}/>} label="Branch" value={branch} />
          <InfoTile icon={<Calendar size={16}/>} label="Founded" value={new Date(createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} />
       </div>
    </div>
  );
};

