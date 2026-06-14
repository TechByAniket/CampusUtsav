import React, { useState } from 'react';
import { Search, Filter, X, Check, XCircle, ChevronDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClubsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableStatuses: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  clubs: any[];
}

export const ClubsFilterBar: React.FC<ClubsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  availableStatuses,
  activeTab,
  onTabChange,
  clubs
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const activeFiltersCount = activeTab ? 1 : 0;

  return (
    <div className="w-full mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
            Club Management
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1.5 tracking-wide">
            Administrate and view student clubs across the campus
          </p>
        </div>
      </div>

      {/* --- SEARCH AND FILTERS ROW --- */}
      <div className="flex flex-row gap-3 items-center justify-between w-full relative z-20">
        {/* Search Field */}
        <div className="flex-1 w-full relative group bg-slate-50 rounded-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, short form, or admin..." 
            className="w-full pl-14 pr-12 py-3.5 bg-transparent text-sm font-bold placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest outline-none text-slate-900" 
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200/50 hover:bg-rose-500 hover:text-white text-slate-400 rounded-full transition-all"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <div className="flex items-center gap-3 shrink-0 relative z-50">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2.5 px-5 py-3.5 border transition-all rounded-full font-black uppercase text-[11px] tracking-widest shadow-sm active:scale-95 ${isFilterOpen ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200/60 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'}`}
          >
            <Filter size={16} className={isFilterOpen ? 'text-indigo-600' : 'text-indigo-500'} />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-indigo-600 text-white rounded-full text-[10px]">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {(searchQuery) && (
             <button 
                 onClick={() => {
                     onSearchChange("");
                 }}
                 className="hidden md:flex items-center gap-1.5 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 px-3 transition-colors"
             >
                 <XCircle size={14} /> Clear Search
             </button>
          )}

          {/* Filter Dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-3 w-[280px] sm:w-[320px] bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden z-50 flex flex-col max-h-[70vh]"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Filter Clubs</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-1.5 rounded-full shadow-sm border border-slate-200">
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto no-scrollbar p-2 space-y-1">
                    <div className="border-b border-slate-100 last:border-0 pb-4">
                        <div className="flex items-center gap-3 py-4 px-2">
                          <Activity size={16} className="text-emerald-500" />
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Account Status</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2 px-2">
                          {availableStatuses.map((opt) => (
                            <label key={opt} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all group">
                              <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${activeTab === opt ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                    {activeTab === opt && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                  </div>
                                  <input
                                    type="radio"
                                    name="clubStatus"
                                    className="hidden"
                                    checked={activeTab === opt}
                                    onChange={() => onTabChange(opt)}
                                  />
                                  <span className="text-xs font-bold text-slate-700 truncate">{opt}</span>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {clubs.filter(c => c.status === opt).length}
                              </span>
                            </label>
                          ))}
                        </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
