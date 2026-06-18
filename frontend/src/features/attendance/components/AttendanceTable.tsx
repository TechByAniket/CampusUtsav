import React, { useState, useMemo } from 'react';
import { 
  Search, Users, GraduationCap, Clock, ChevronDown, Check
} from 'lucide-react';

export interface Attendee {
  studentId: number;
  name: string;
  branch: string;
  year: number;
  div: string;
  identificationNumber: string;
  rollNo: number;
  present: boolean;
  markedAt: string | null;
}

interface AttendanceTableProps {
  attendees: Attendee[];
  loading?: boolean;
  availableBranches?: string[];
}

// --- HELPER COMPONENTS ---
const MultiSelect = ({ 
  label, 
  options, 
  selected, 
  onToggle, 
  onClear,
  icon: Icon 
}: { 
  label: string; 
  options: string[]; 
  selected: string[]; 
  onToggle: (val: string) => void;
  onClear: () => void;
  icon?: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 text-[11px] font-black text-indigo-700 outline-none transition-all hover:bg-indigo-100 min-w-[140px] justify-between shadow-sm"
      >
        <div className="flex items-center gap-2">
            {Icon && <Icon size={12} className="text-indigo-400" />}
            <span className="uppercase tracking-widest whitespace-nowrap">
            {selected.length === 0 ? `ALL ${label}S` : `${selected.length} ${label}${selected.length > 1 ? 'S' : ''}`}
            </span>
        </div>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="max-h-60 overflow-y-auto no-scrollbar py-1 text-left">
                {options.map(opt => (
                  <label key={opt} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                    <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${selected.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
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
                 className="w-full mt-1 pt-2 border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors py-2"
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

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ attendees, loading, availableBranches = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const years = ['FY', 'SY', 'TY', 'FINAL'];
  const branches = useMemo(() => {
    if (availableBranches && availableBranches.length > 0) return availableBranches;
    const uniqueBranches = Array.from(new Set(attendees.map(a => a.branch))).sort();
    return uniqueBranches;
  }, [attendees, availableBranches]);

  const getYearLabel = (year: number) => {
    const mapping: Record<number, string> = { 1: 'FY', 2: 'SY', 3: 'TY', 4: 'FINAL' };
    return mapping[year] || year.toString();
  };

  const filteredData = useMemo(() => {
    return attendees.filter(s => {
      const studentYearLabel = getYearLabel(s.year);
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(studentYearLabel);
      const matchesBranch = selectedBranches.length === 0 || selectedBranches.includes(s.branch);
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.identificationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.branch.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesYear && matchesBranch && matchesSearch;
    });
  }, [attendees, searchQuery, selectedYears, selectedBranches]);

  const toggleYear = (year: string) => {
    setSelectedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]);
  };

  const toggleBranch = (branch: string) => {
    setSelectedBranches(prev => prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 text-center shadow-sm">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Fetching attendance records...</p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
            Attendance List 
            <span className="text-indigo-600 text-lg tabular-nums bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-100">
              {filteredData.filter(a => a.present).length}/{filteredData.length}
            </span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Real-time status of participants</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
                type="text" 
                placeholder="Search students..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none w-full md:w-64 font-medium transition-all focus:border-indigo-300 shadow-sm" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>

          <MultiSelect 
            label="Year"
            options={years}
            selected={selectedYears}
            onToggle={toggleYear}
            onClear={() => setSelectedYears([])}
            icon={GraduationCap}
          />

          <MultiSelect 
            label="Branch"
            options={branches}
            selected={selectedBranches}
            onToggle={toggleBranch}
            onClear={() => setSelectedBranches([])}
            icon={Users}
          />
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[400px]">
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Users size={32} />
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No matching records found</p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW (Cards) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredData.map((s) => (
                <div key={s.studentId} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-transform active:scale-[0.98]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-500 border border-slate-100">
                        <Users size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 uppercase text-sm leading-tight">{s.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{s.identificationNumber}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      s.present ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {s.present ? 'Present' : 'Absent'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      {s.branch}-{getYearLabel(s.year)}-{s.div}-{s.rollNo}
                    </div>
                    {s.markedAt && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                        <Clock size={12} className="text-indigo-400" /> {new Date(s.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW (Table) */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-left">
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Identity Profile</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Identification</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Academic Info</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Status</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Marked At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.map((s) => (
                      <tr key={s.studentId} className="hover:bg-indigo-50/40 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 uppercase text-sm truncate max-w-[200px]">
                            {s.name}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-[12px] text-slate-400 font-mono font-bold leading-none">
                            ID: {s.identificationNumber}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full w-fit whitespace-nowrap">
                            {s.branch}-{getYearLabel(s.year)}-{s.div}-{s.rollNo}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit ${
                            s.present ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                          }`}>
                            {s.present ? 'Present' : 'Absent'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {s.markedAt ? (
                            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
                              <Clock size={14} className="text-indigo-400" />
                              {new Date(s.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                          ) : (
                            <span className="text-slate-300 font-black text-[11px] uppercase tracking-widest">---</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
