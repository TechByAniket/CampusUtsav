import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Shield } from 'lucide-react';

interface Club {
  id: number;
  name: string;
  shortForm: string;
  adminName: string;
  managedBy: string;
  status: string;
  logoUrl: string;
}

interface ClubsMobileListProps {
  clubs: Club[];
  onSelect: (club: Club) => void;
}

export const ClubsMobileList: React.FC<ClubsMobileListProps> = ({ clubs, onSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {clubs.map((c) => (
        <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center shadow-inner flex-shrink-0">
              {c.logoUrl ? (
                <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-black text-slate-400">{c.shortForm}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-slate-900 uppercase text-xs leading-tight truncate">{c.name}</h3>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1">{c.shortForm}</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                <UserCircle size={14} />
              </div>
              <span className="truncate">Admin: {c.adminName}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                <Shield size={14} />
              </div>
              <span className="truncate">Managed By: {c.managedBy}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link 
              to={`/college-dashboard/clubs/${c.id}`} 
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-slate-200 transition-all active:scale-95"
            >
              Portal
            </Link>
            <button 
              onClick={() => onSelect(c)} 
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Control
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
