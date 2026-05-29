import React from 'react';
import { Filter } from 'lucide-react';

interface ClubOption {
  id: number;
  name: string;
  shortForm: string;
}

interface ClubFilterBarProps {
  selectedClub: string;
  onClubChange: (club: string) => void;
  clubsList: ClubOption[];
}

export const ClubFilterBar: React.FC<ClubFilterBarProps> = ({
  selectedClub,
  onClubChange,
  clubsList,
}) => {
  return (
    <div className="bg-white/80 rounded-[2rem] border border-slate-100 p-5 px-6 shadow-sm backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center gap-6 justify-between relative overflow-hidden group">
      <div className="absolute inset-y-0 left-0 w-[4px] bg-gradient-to-b from-orange-500 to-amber-500" />
      
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
          <Filter size={18} />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 leading-none">Filters & Scope</h4>
          <p className="text-slate-400 text-[10px] mt-1 font-medium">Narrow down analytics dashboard by student club.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
        {/* Club selector dropdown styled as premium bento element */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Club Filter</label>
          <div className="relative">
            <select
              value={selectedClub}
              onChange={(e) => onClubChange(e.target.value)}
              className="appearance-none w-full sm:w-60 bg-slate-50 border border-slate-250/60 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer select-none shadow-sm"
            >
              <option value="ALL">All Clubs / Councils</option>
              {clubsList.map(club => (
                <option key={club.id} value={club.id}>{club.name} ({club.shortForm})</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
          </div>
        </div>
      </div>
    </div>
  );
};
