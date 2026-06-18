import { Search, X, Filter, Check, Tag, Users, Calendar, XCircle, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchEventMetaData, fetchEventStatuses } from '@/services/eventService';
import { getClubsByCollege } from '@/services/clubService';
import { motion, AnimatePresence } from 'framer-motion';

interface ExploreFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedClubs: string[];
  onClubsChange: (clubs: string[]) => void;
  selectedStatus: string[];
  onStatusChange: (status: string[]) => void;
  collegeId: string | number;
}

const FilterSection = ({
  title,
  options,
  selected,
  onToggle,
  onClear,
  icon: Icon,
  colorClass,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  onClear?: () => void;
  icon: any;
  colorClass: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = selected.length;

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 hover:bg-slate-50 transition-colors px-2 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className={colorClass} />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">{title}</h3>
          {activeCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-2 pb-4 px-2">
              {options.map((opt) => (
                <label key={opt} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${selected.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                    {selected.includes(opt) && <Check size={10} className="text-white stroke-[4]" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selected.includes(opt)}
                    onChange={() => onToggle(opt)}
                  />
                  <span className="text-xs font-bold text-slate-700 truncate">{opt}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ExploreFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedClubs,
  onClubsChange,
  selectedStatus,
  onStatusChange,
  collegeId,
}: ExploreFilterBarProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meta, stats, clubsData] = await Promise.all([
          fetchEventMetaData(),
          fetchEventStatuses(),
          getClubsByCollege(collegeId)
        ]);
        
        setCategories(Object.keys(meta) || []);
        setStatuses(stats || []);
        setClubs(clubsData || []);
      } catch (err) {
        console.error("Filter sync failed.", err);
      }
    };
    if (collegeId) fetchData();
  }, [collegeId]);

  const toggleVal = (list: string[], setList: (vals: string[]) => void, val: string) => {
    if (list.includes(val)) {
      setList(list.filter((v) => v !== val));
    } else {
      setList([...list, val]);
    }
  };

  const activeFiltersCount = selectedCategories.length + selectedClubs.length + selectedStatus.length;
  const isFiltered = searchQuery || activeFiltersCount > 0;

  const clearAllFilters = () => {
    onCategoriesChange([]);
    onClubsChange([]);
    onStatusChange([]);
  };

  return (
    <>
      <div className="flex flex-row gap-3 items-center justify-between mb-10 w-full">
        {/* Search */}
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events..." 
            className="w-full pl-14 pr-12 py-3.5 bg-white border border-slate-200/60 rounded-full text-sm font-bold placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest outline-none focus:border-indigo-300 transition-all text-slate-900 shadow-sm" 
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-400 rounded-full transition-all"
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
          
          {isFiltered && (
             <button 
                 onClick={() => {
                     onSearchChange("");
                     clearAllFilters();
                 }}
                 className="hidden md:flex items-center gap-1.5 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 px-3 transition-colors"
             >
                 <XCircle size={14} /> Clear All
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
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filters</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <FilterSection
                      title="Categories"
                      options={categories}
                      selected={selectedCategories}
                      onToggle={(v) => toggleVal(selectedCategories, onCategoriesChange, v)}
                      onClear={() => onCategoriesChange([])}
                      icon={Tag}
                      colorClass="text-indigo-500"
                    />
                    
                    {clubs.length > 0 && (
                      <FilterSection
                        title="Clubs"
                        options={clubs.map(c => c.nameShortForm)}
                        selected={selectedClubs}
                        onToggle={(v) => toggleVal(selectedClubs, onClubsChange, v)}
                        onClear={() => onClubsChange([])}
                        icon={Users}
                        colorClass="text-rose-500"
                      />
                    )}

                    <FilterSection
                      title="Status"
                      options={statuses}
                      selected={selectedStatus}
                      onToggle={(v) => toggleVal(selectedStatus, onStatusChange, v)}
                      onClear={() => onStatusChange([])}
                      icon={Calendar}
                      colorClass="text-emerald-500"
                    />
                  </div>
                    {(selectedCategories.length > 0 || selectedClubs.length > 0 || selectedStatus.length > 0) && (
                       <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                         <button 
                            onClick={clearAllFilters}
                            className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                         >
                            Reset All Filters
                         </button>
                       </div>
                    )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
