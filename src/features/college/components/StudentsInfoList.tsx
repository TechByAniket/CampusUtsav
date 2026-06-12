import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Student } from '@/services/studentService';
import { getAllBranchesOfCollege } from '@/services/collegeService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Mail, Search, X, 
  GraduationCap, Info, UserCircle, Users, Hash, ChevronDown, Check
} from 'lucide-react';

type StudentsInfoListProps = {
  students: Student[];
};

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
        className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-[11px] font-black text-indigo-700 outline-none transition-all hover:bg-indigo-100 min-w-[140px] justify-between shadow-sm"
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
             <div className="max-h-60 overflow-y-auto no-scrollbar py-1">
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

const InfoPill = ({ icon, label, value, isLowCase = false }: { icon: React.ReactNode; label: string; value: string; isLowCase?: boolean }) => (
  <div className="flex items-center gap-4 px-5 py-3 rounded-full bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-indigo-100 group w-full">
    <div className="text-indigo-500 group-hover:scale-110 transition-transform shrink-0">{icon}</div>
    <div className="flex items-center justify-between flex-1 min-w-0">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">{label}</span>
      <span className={`text-[13px] font-bold text-slate-700 truncate pl-3 ${isLowCase ? 'lowercase' : 'uppercase'}`}>{value}</span>
    </div>
  </div>
);

const StudentProfileModal = ({ 
  student, 
  onClose, 
  getYearLabel 
}: { 
  student: Student; 
  onClose: () => void; 
  getYearLabel: (y: number) => string;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden no-scrollbar border border-white/20"
    >
      {/* Decorative Banner */}
      <div className="h-28 bg-gradient-to-br from-indigo-50 to-white relative border-b border-slate-100">
         <button 
           onClick={onClose} 
           className="absolute top-5 right-5 p-2 bg-slate-200/50 hover:bg-slate-300/50 text-slate-500 rounded-full transition-colors z-10"
         >
           <X size={16} />
         </button>
      </div>

      <div className="px-6 pb-8 -mt-12 relative z-10 text-center">
        {/* Profile Avatar */}
        <div className="inline-block relative mb-4">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
             <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                <UserCircle size={80} />
             </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full shadow-lg" />
        </div>

        {/* Identity Section */}
        <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight leading-none mb-2">{student.name}</h2>
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full mb-8">
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">{student.identificationNumber}</span>
        </div>

        {/* Info Grid - Bento Pill Style */}
        <div className="grid grid-cols-2 gap-2 mb-8">
            <InfoPill icon={<GraduationCap size={12} />} label="Year" value={getYearLabel(student.year)} />
            <InfoPill icon={<Hash size={12} />} label="Roll" value={student.rollNo.toString()} />
            <div className="col-span-2">
                <InfoPill icon={<Users size={12} />} label="Branch & Div" value={`${student.branch} - ${student.division}`} />
            </div>
            <div className="col-span-2">
                <InfoPill icon={<Mail size={12} />} label="Email" value={student.email} isLowCase />
            </div>
            <div className="col-span-2">
                <InfoPill icon={<Phone size={12} />} label="Contact" value={student.phone} />
            </div>
        </div>

        {/* Final Actions */}
        <div className="grid grid-cols-2 gap-2">
          <a 
            href={`tel:${student.phone}`} 
            className="flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            <Phone size={14} /> Call
          </a>
          <a 
            href={`mailto:${student.email}`}
            className="flex items-center justify-center py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-100"
          >
            <Mail size={14} /> Email
          </a>
        </div>
      </div>
    </motion.div>
  </div>
);

// --- MAIN COMPONENT ---

export const StudentsInfoList = ({ students }: StudentsInfoListProps) => {
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [branches, setBranches] = useState<string[]>([]);
  
  const collegeId = useSelector((state: RootState) => state.auth.collegeId);
  const years = ['FY', 'SY', 'TY', 'FINAL'];

  useEffect(() => {
    const fetchBranches = async () => {
      if (!collegeId) return;
      try {
        const data = await getAllBranchesOfCollege(collegeId);
        if (typeof data === 'object' && !Array.isArray(data)) {
            setBranches(Object.values(data));
        } else {
            setBranches(data);
        }
      } catch (error) {
        console.error("Failed to fetch branches", error);
      }
    };
    fetchBranches();
  }, [collegeId]);

  const getYearLabel = (year: number) => {
    if (year === 1) return 'FY';
    if (year === 2) return 'SY';
    if (year === 3) return 'TY';
    if (year === 4) return 'FINAL';
    return year.toString();
  };

  const filteredData = useMemo(() => {
    return students.filter(s => {
      const studentYearLabel = getYearLabel(s.year);
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(studentYearLabel);
      const matchesBranch = selectedBranches.length === 0 || selectedBranches.includes(s.branch);
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.identificationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesYear && matchesBranch && matchesSearch;
    });
  }, [students, selectedYears, selectedBranches, searchQuery]);

  const toggleYear = (year: string) => {
    setSelectedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]);
  };

  const toggleBranch = (branch: string) => {
    setSelectedBranches(prev => prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]);
  };

  return (
    <div className="w-full font-sans">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
              Student Directory
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 tracking-wide">
              Access and manage comprehensive student profiles and records
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none w-full md:w-72 font-medium transition-all focus:border-indigo-300" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* --- FILTERS ROW --- */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/50 p-2 rounded-2xl border border-slate-100">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Filters:</div>
          <MultiSelect 
            label="YEAR" 
            options={years} 
            selected={selectedYears} 
            onToggle={toggleYear} 
            onClear={() => setSelectedYears([])}
            icon={GraduationCap}
          />
          <MultiSelect 
            label="BRANCH" 
            options={branches} 
            selected={selectedBranches} 
            onToggle={toggleBranch} 
            onClear={() => setSelectedBranches([])}
            icon={Users}
          />
          {(selectedYears.length > 0 || selectedBranches.length > 0) && (
            <button 
              onClick={() => { setSelectedYears([]); setSelectedBranches([]); }}
              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 px-2 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="min-height-[400px]">
            {filteredData.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-200 p-20 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Users size={32} />
                </div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No matching records found</p>
            </div>
            ) : (
            <>
                {/* --- MOBILE VIEW --- */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredData.map((s) => (
                    <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm" onClick={() => setSelectedStudent(s)}>
                    <div className="flex justify-between items-start mb-3">
                        <div>
                        <h3 className="font-bold text-slate-800 uppercase text-sm leading-tight">{s.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{s.identificationNumber}</p>
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase">{getYearLabel(s.year)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        <GraduationCap size={12} className="text-indigo-500" /> {s.branch} • Div {s.division} • Roll {s.rollNo}
                    </div>
                    </div>
                ))}
                </div>

                {/* --- DESKTOP VIEW --- */}
                <div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
                <table className="w-full border-collapse table-fixed">
                    <thead>
                    <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-left">
                        <th className="w-[30%] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Student Identity</th>
                        <th className="w-[25%] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Academic Info</th>
                        <th className="w-[30%] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Contact Details</th>
                        <th className="w-[15%] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredData.map((s) => (
                        <tr key={s.id} className="hover:bg-indigo-50/40 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 uppercase text-sm truncate">{s.name}</div>
                            <div className="text-[12px] text-slate-400 font-mono font-bold leading-none mt-1">ID: {s.identificationNumber}</div>
                        </td>

                        <td className="px-6 py-4">
                            <div className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full w-fit whitespace-nowrap">
                                {getYearLabel(s.year)} • {s.branch}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mt-1">
                                Div {s.division} • Roll {s.rollNo}
                            </div>
                        </td>

                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700 truncate">
                                <Phone size={12} className="text-indigo-400 shrink-0" /> {s.phone}
                            </div>
                            <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400 mt-1 truncate">
                                <Mail size={12} className="text-slate-300 shrink-0" /> {s.email}
                            </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                            <button 
                                onClick={() => setSelectedStudent(s)}
                                className="px-4 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                            >
                                Details
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </>
            )}
        </div>

      {/* --- STUDENT PROFILE MODAL --- */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentProfileModal 
            student={selectedStudent} 
            onClose={() => setSelectedStudent(null)} 
            getYearLabel={getYearLabel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

