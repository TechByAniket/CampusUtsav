import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface Club {
  id: number;
  name: string;
  shortForm: string;
  adminName: string;
  managedBy: string;
  status: string;
  logoUrl: string;
}

interface ClubsTableProps {
  clubs: Club[];
  availableStatuses: string[];
  pendingStatusChanges: Record<number, string>;
  onStatusChange: (id: number, status: string) => void;
  onUpdateStatus: (id: number) => void;
}

export const ClubsTable: React.FC<ClubsTableProps> = ({
  clubs,
  availableStatuses,
  pendingStatusChanges,
  onStatusChange,
  onUpdateStatus
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
      <div className="max-h-[500px] overflow-y-auto overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse min-w-[800px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-slate-900 border-b border-slate-800 text-left">
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Club Information</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Admin Name</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Managed By</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Account Status</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clubs.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center shadow-sm">
                    {c.logoUrl ? (
                      <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-black text-slate-400">{c.shortForm}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase text-sm leading-tight tracking-tight">{c.name}</div>
                    <div className="text-[12px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">{c.shortForm}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">{c.adminName}</div>
              </td>

              <td className="px-6 py-4">
                <div className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">{c.managedBy}</div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select 
                      className="appearance-none bg-orange-50 border border-orange-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-orange-700 cursor-pointer outline-none transition-all focus:ring-2 focus:ring-orange-200" 
                      value={pendingStatusChanges[c.id] || c.status} 
                      onChange={(e) => onStatusChange(c.id, e.target.value)}
                    >
                      {availableStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                  {pendingStatusChanges[c.id] && pendingStatusChanges[c.id] !== c.status && (
                    <button 
                      onClick={() => onUpdateStatus(c.id)} 
                      className="bg-orange-600 text-white text-[10px] font-black px-3 py-2 rounded-xl animate-pulse shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all"
                    >
                      UPDATE
                    </button>
                  )}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center justify-center">
                  <Link 
                    to={`/college-dashboard/clubs/${c.id}`} 
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-100"
                  >
                    View Dashboard
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
