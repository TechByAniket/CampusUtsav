import React from 'react';
import { X, Users, Info, UserCircle, Shield, Activity, ChevronDown, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Club {
  id: number;
  name: string;
  shortForm: string;
  adminName: string;
  managedBy: string;
  status: string;
  logoUrl: string;
}

interface ClubDetailModalProps {
  club: Club;
  availableStatuses: string[];
  pendingStatusChanges: Record<number, string>;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
  onUpdateStatus: (id: number) => void;
}

const InfoTile = ({ icon, label, value, action }: { icon: React.ReactNode, label: string, value: string, action?: React.ReactNode }) => (
  <div className="p-5 rounded-[2rem] border flex items-start gap-4 bg-slate-50 border-slate-100 transition-all hover:border-indigo-100 group">
    <div className="mt-0.5 text-indigo-500 bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 leading-none">{label}</p>
      <p className="text-[13px] font-bold truncate leading-tight text-slate-900">{value}</p>
      {action && action}
    </div>
  </div>
);

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  club,
  availableStatuses,
  pendingStatusChanges,
  onClose,
  onStatusChange,
  onUpdateStatus
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-y-auto max-h-[90vh] no-scrollbar border border-white/20">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-95 shadow-sm"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-10">
          <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner overflow-hidden ring-4 ring-slate-50">
            {club.logoUrl ? (
                <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
            ) : (
                <Users size={44} className="text-slate-300" />
            )}
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none px-4">{club.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
             <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100/50">
               {club.shortForm}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
           <InfoTile icon={<Info size={16}/>} label="Club ID" value={`#${club.id}`} />
           <InfoTile icon={<UserCircle size={16}/>} label="Club Admin" value={club.adminName} />
           <InfoTile icon={<Shield size={16}/>} label="Managed By" value={club.managedBy} />
           
           <InfoTile 
              icon={<Activity size={16}/>} 
              label="Account Status" 
              action={
                <div className="flex items-center gap-2 mt-3">
                    <div className="relative flex-1">
                        <select 
                            className="appearance-none w-full bg-orange-50 border border-orange-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-orange-700 outline-none focus:ring-2 focus:ring-orange-200 transition-all cursor-pointer"
                            value={pendingStatusChanges[club.id] || club.status}
                            onChange={(e) => onStatusChange(club.id, e.target.value)}
                        >
                            {availableStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                    </div>
                    {pendingStatusChanges[club.id] && pendingStatusChanges[club.id] !== club.status && (
                        <button 
                          onClick={() => onUpdateStatus(club.id)} 
                          className="bg-orange-600 text-white text-[9px] font-black px-4 py-2.5 rounded-xl shadow-lg shadow-orange-100 hover:bg-orange-700 animate-pulse transition-all active:scale-95"
                        >
                          UPDATE
                        </button>
                    )}
                </div>
              }
              value={club.status} 
           />
        </div>
        
        <div className="flex flex-col gap-3">
            <Link 
                to={`/college-dashboard/clubs/${club.id}`} 
                className="flex items-center justify-center py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
                <ExternalLink size={16} /> Open Club Dashboard
            </Link>
            <button 
               onClick={onClose}
               className="flex items-center justify-center py-5 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest gap-2 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95"
            >
                Return to Directory
            </button>
        </div>
      </div>
    </div>
  );
};
