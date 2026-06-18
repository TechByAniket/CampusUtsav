import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Student } from '@/services/studentService';
import { getAllBranchesOfCollege } from '@/services/collegeService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Mail, Search, X, 
  GraduationCap, Info, UserCircle, Users, Hash, ChevronDown, Check,
  Filter, XCircle
} from 'lucide-react';

type StudentsInfoListProps = {
  students: Student[];
};

// --- HELPER COMPONENTS ---

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

const InfoRow = ({ label, value, isLowCase = false }: { label: string; value: string; isLowCase?: boolean }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100/60 last:border-0">
    <span className="text-[13px] font-medium text-slate-500">{label}</span>
    <span className={`text-[13px] font-bold text-slate-900 ${isLowCase ? 'lowercase' : 'uppercase'}`}>{value}</span>
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
      className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative overflow-y-auto max-h-[75vh] no-scrollbar border border-white/20"
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

        {/* Info List */}
        <div className="flex flex-col mb-8 text-left px-2">
            <InfoRow label="Academic Year" value={getYearLabel(student.year)} />
            <InfoRow label="Branch & Div" value={`${student.branch} - ${student.division}`} />
            <InfoRow label="Roll Number" value={student.rollNo.toString()} />
            <InfoRow label="Email Address" value={student.email} isLowCase />
            <InfoRow label="Contact Number" value={student.phone} />
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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
        </div>

        {/* --- SEARCH AND FILTERS ROW --- */}
        <div className="flex flex-row gap-3 items-center justify-between mb-8 w-full relative z-20">
          {/* Search Field */}
          <div className="flex-1 w-full relative group bg-slate-50 rounded-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name, ID, or email..." 
              className="w-full pl-14 pr-12 py-3.5 bg-transparent text-sm font-bold placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest outline-none text-slate-900" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
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
              {(selectedYears.length + selectedBranches.length) > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-indigo-600 text-white rounded-full text-[10px]">
                  {selectedYears.length + selectedBranches.length}
                </span>
              )}
            </button>
            
            {(selectedYears.length > 0 || selectedBranches.length > 0 || searchQuery) && (
               <button 
                   onClick={() => {
                       setSearchQuery("");
                       setSelectedYears([]);
                       setSelectedBranches([]);
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
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Filter Students</h3>
                      <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-1.5 rounded-full shadow-sm border border-slate-200">
                        <X size={14} />
                      </button>
                    </div>
                    
                    <div className="overflow-y-auto no-scrollbar p-2 space-y-1">
                      <FilterSection
                        title="Academic Year"
                        options={years}
                        selected={selectedYears}
                        onToggle={toggleYear}
                        icon={GraduationCap}
                        colorClass="text-indigo-500"
                      />
                      <FilterSection
                        title="Branch"
                        options={branches}
                        selected={selectedBranches}
                        onToggle={toggleBranch}
                        icon={Users}
                        colorClass="text-teal-500"
                      />
                    </div>
                    
                    {(selectedYears.length > 0 || selectedBranches.length > 0) && (
                       <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                         <button 
                            onClick={() => { setSelectedYears([]); setSelectedBranches([]); }}
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
                <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse table-fixed min-w-[800px]">
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

