import React from 'react';
import { Search } from 'lucide-react';

interface ClubsHeaderProps {
  totalClubs: number;
  onSearch: (query: string) => void;
}

export const ClubsHeader: React.FC<ClubsHeaderProps> = ({ totalClubs, onSearch }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
          Club Management
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1.5 tracking-wide">
          Administrate and view student clubs across the campus
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search name, short form, or admin..." 
          className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full md:w-80 font-medium transition-all" 
          onChange={(e) => onSearch(e.target.value)} 
        />
      </div>
    </div>
  );
};
