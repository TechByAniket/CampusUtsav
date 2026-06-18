import { Search, X, ChevronDown, Check, Tag, Users, Calendar, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchEventMetaData, fetchEventStatuses } from '@/services/eventService';
import { getClubsByCollege } from '@/services/clubService';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  onClear: () => void;
  icon: any;
  colorTheme?: 'indigo' | 'orange' | 'emerald';
}

const MultiSelect = ({ 
  label, 
  options, 
  selected, 
  onToggle, 
  onClear,
  icon: Icon,
  colorTheme = 'indigo'
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = {
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-indigo-700',
      hover: 'hover:bg-indigo-100',
      check: 'bg-indigo-600 border-indigo-600',
      icon: 'text-indigo-400'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      text: 'text-orange-700',
      hover: 'hover:bg-orange-100',
      check: 'bg-orange-600 border-orange-600',
      icon: 'text-orange-400'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      hover: 'hover:bg-emerald-100',
      check: 'bg-emerald-600 border-emerald-600',
      icon: 'text-emerald-400'
    }
  };

  const theme = themes[colorTheme];
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${theme.bg} border ${theme.border} rounded-xl px-4 py-2.5 text-[11px] font-black ${theme.text} outline-none transition-all ${theme.hover} min-w-[140px] justify-between shadow-sm group`}
      >
        <div className="flex items-center gap-2">
            <Icon size={14} className={theme.icon} />
            <span className="uppercase tracking-widest whitespace-nowrap">
            {selected.length === 0 ? `ALL ${label}S` : `${selected.length} ${label}${selected.length > 1 ? 'S' : ''}`}
            </span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
                {options.map(opt => (
                  <label key={opt} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group/item">
                    <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${selected.includes(opt) ? theme.check : 'border-slate-300 group-hover/item:border-indigo-400'}`}>
                      {selected.includes(opt) && <Check size={10} className="text-white stroke-[4]" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={selected.includes(opt)}
                      onChange={() => onToggle(opt)}
                    />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight truncate">{opt}</span>
                  </label>
                ))}
             </div>
             {selected.length > 0 && (
               <button 
                 onClick={(e) => { e.stopPropagation(); onClear(); }}
                 className="w-full mt-1 pt-2 border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors py-2"
               >
                 Clear Selections
               </button>
             )}
          </div>
        </>
      )}
    </div>
  );
};

interface EventFilterBarProps {
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

export const EventFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedClubs,
  onClubsChange,
  selectedStatus,
  onStatusChange,
  collegeId,
}: EventFilterBarProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

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
      setList(list.filter(v => v !== val));
    } else {
      setList([...list, val]);
    }
  };

  const isFiltered = searchQuery || selectedCategories.length > 0 || selectedClubs.length > 0 || selectedStatus.length > 0;

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm mb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Search */}
        <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search events, venues, or clubs..." 
                className="w-full pl-14 pr-12 py-4 bg-slate-50 border border-slate-200/60 rounded-3xl text-sm font-bold placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest outline-none focus:border-indigo-300 focus:bg-white transition-all text-slate-900 shadow-inner" 
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

        {/* Right: Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden xl:block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
              <Filter size={12} className="inline mr-1" /> Filters:
          </div>

          <MultiSelect 
              label="CATEGORY" 
              options={categories} 
              selected={selectedCategories} 
              onToggle={(v) => toggleVal(selectedCategories, onCategoriesChange, v)} 
              onClear={() => onCategoriesChange([])}
              icon={Tag}
              colorTheme="indigo"
          />

          <MultiSelect 
              label="CLUB" 
              options={clubs.map(c => c.shortForm)} 
              selected={selectedClubs} 
              onToggle={(v) => toggleVal(selectedClubs, onClubsChange, v)} 
              onClear={() => onClubsChange([])}
              icon={Users}
              colorTheme="orange"
          />

          <MultiSelect 
              label="STATUS" 
              options={statuses} 
              selected={selectedStatus} 
              onToggle={(v) => toggleVal(selectedStatus, onStatusChange, v)} 
              onClear={() => onStatusChange([])}
              icon={Calendar}
              colorTheme="emerald"
          />

          {isFiltered && (
              <button 
                  onClick={() => {
                      onSearchChange("");
                      onCategoriesChange([]);
                      onClubsChange([]);
                      onStatusChange([]);
                  }}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-rose-500 px-2 transition-colors"
              >
                  Reset
              </button>
          )}
        </div>
      </div>
    </div>
  );
};
