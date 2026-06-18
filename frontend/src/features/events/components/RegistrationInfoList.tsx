import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { 
  Phone, Mail, Search, X, Check,
  UserCircle, Users, ChevronDown, 
  Calendar, ShieldCheck, User, Smartphone, AlertCircle, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { getRegistrationMeta, getTeamMeta } from '@/services/metaService';
import { cancelEventRegistration } from '@/services/eventRegistrationService';
import type { 
  EventRegistrationsResponse, 
  TeamRegistration, 
  IndividualRegistration, 
  RegistrationStudent 
} from '@/types/event';

type RegistrationInfoListProps = {
  registrations: EventRegistrationsResponse;
  isTeamEvent: boolean;
  onRefresh?: () => void;
};

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

// --- HELPER COMPONENTS ---

const CompactInfoTile = ({ icon, label, value, isLowCase = false }: { icon: React.ReactNode; label: string; value: string; isLowCase?: boolean }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-indigo-100">
        <div className="text-indigo-500 shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
        <div className="min-w-0 flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className={`text-[13px] font-bold text-slate-700 truncate ${isLowCase ? 'lowercase' : 'uppercase'}`}>{value}</p>
        </div>
    </div>
  </div>
);

const DetailModal = ({ 
  type,
  data, 
  onClose, 
  getYearLabel 
}: { 
  type: 'INDIVIDUAL' | 'TEAM';
  data: IndividualRegistration | TeamRegistration;
  onClose: () => void; 
  getYearLabel: (y: number) => string;
}) => {
  const [selectedMember, setSelectedMember] = useState<RegistrationStudent | null>(
    type === 'INDIVIDUAL' ? (data as IndividualRegistration).student : (data as TeamRegistration).leader
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-slate-50">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {type === 'TEAM' ? (data as TeamRegistration).teamName : 'Participant Details'}
            </h3>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-8">
            {/* Identity Profile */}
            <div className="flex items-center gap-6 mb-8">
                <div className="relative shrink-0">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 border-4 border-slate-50 shadow-inner overflow-hidden">
                        <UserCircle size={60} />
                    </div>
                    {type === 'TEAM' && selectedMember?.id === (data as TeamRegistration).leader.id && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 border-4 border-white rounded-xl shadow-lg flex items-center justify-center text-white">
                            <ShieldCheck size={14} />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight truncate leading-tight mb-2">{selectedMember?.name}</h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-4 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[11px] font-black uppercase tracking-widest">
                            {selectedMember?.identificationNumber}
                        </span>
                        <span className="px-4 py-1 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest">
                            {selectedMember?.branch}-{getYearLabel(selectedMember?.year || 0)}-{selectedMember?.division}-{selectedMember?.rollNo}
                        </span>
                    </div>
                </div>
            </div>

            {/* Member Switcher (Team Mode) */}
            {type === 'TEAM' && (
                <div className="mb-8 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Squad Members</p>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
                        {(data as TeamRegistration).members.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedMember?.id === member.id ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {member.id === (data as TeamRegistration).leader.id ? 'Leader' : member.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                <CompactInfoTile icon={<Mail size={16} />} label="Email Address" value={selectedMember?.email || ''} isLowCase />
                <CompactInfoTile icon={<Smartphone size={16} />} label="Contact Number" value={selectedMember?.phone || ''} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <a 
                    href={`tel:${selectedMember?.phone}`} 
                    className="flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest gap-3 hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-100"
                >
                    <Phone size={16} /> Call Now
                </a>
                <a 
                    href={`mailto:${selectedMember?.email}`}
                    className="flex items-center justify-center py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest gap-3 hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-100"
                >
                    <Mail size={16} /> Email
                </a>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const RegistrationInfoList = ({ registrations, isTeamEvent, onRefresh }: RegistrationInfoListProps) => {
  const [activeTab, setActiveTab] = useState<'INDIVIDUAL' | 'TEAM'>(
    isTeamEvent ? 'TEAM' : 'INDIVIDUAL'
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReg, setSelectedReg] = useState<IndividualRegistration | TeamRegistration | null>(null);
  const role = useSelector((state: RootState) => state.auth.role);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const handleCancelRegistration = async (registrationId: number) => {
    try {
      setCancellingId(registrationId);
      const res = await cancelEventRegistration(registrationId);
      toast.success(typeof res === 'string' ? res : "Registration cancelled successfully");
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel registration");
    } finally {
      setCancellingId(null);
    }
  };

  // Metadata states
  const [teamStatuses, setTeamStatuses] = useState<string[]>([]);
  const [registrationStatuses, setRegistrationStatuses] = useState<string[]>([]);

  const [selectedTeamStatuses, setSelectedTeamStatuses] = useState<string[]>([]);
  const [selectedRegStatuses, setSelectedRegStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [regMeta, teamMeta] = await Promise.all([
          getRegistrationMeta(),
          getTeamMeta()
        ]);
        if (regMeta?.registrationStatus) {
          setRegistrationStatuses(regMeta.registrationStatus.map((m: any) => m.code));
        }
        if (teamMeta?.teamStatus) {
          setTeamStatuses(teamMeta.teamStatus.map((m: any) => m.code));
        }
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    };
    fetchMeta();
  }, []);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else {
      setList([...list, value]);
    }
  };
  
  const getYearLabel = (year: number) => {
    const mapping: Record<number, string> = { 1: 'FY', 2: 'SY', 3: 'TY', 4: 'FINAL' };
    return mapping[year] || year.toString();
  };

  const filteredTeams = useMemo(() => {
    return registrations.teams.filter(t => {
      const matchesSearch = t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.leader.identificationNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedTeamStatuses.length === 0 || selectedTeamStatuses.includes(t.status || '');
      return matchesSearch && matchesStatus;
    });
  }, [registrations.teams, searchQuery, selectedTeamStatuses]);

  const filteredIndividuals = useMemo(() => {
    return registrations.individuals.filter(i => {
      const matchesSearch = i.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            i.student.identificationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            i.student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedRegStatuses.length === 0 || selectedRegStatuses.includes(i.status || '');
      return matchesSearch && matchesStatus;
    });
  }, [registrations.individuals, searchQuery, selectedRegStatuses]);

  const currentData = activeTab === 'TEAM' ? filteredTeams : filteredIndividuals;

  return (
    <div className="w-full font-sans">
        
        {/* --- FILTERS & SEARCH --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Conditional Tab Display */}
            {isTeamEvent ? (
                <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-slate-200 shadow-sm w-fit">
                    <button 
                        onClick={() => setActiveTab('TEAM')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TEAM' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Users size={14} /> Team ({registrations.teams.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('INDIVIDUAL')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'INDIVIDUAL' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <User size={14} /> Individual ({registrations.individuals.length})
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
                    <User size={16} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Individual Registrations ({registrations.individuals.length})</span>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
               {activeTab === 'TEAM' && teamStatuses.length > 0 && (
                 <MultiSelect
                   label="TEAM STATUS"
                   options={teamStatuses}
                   selected={selectedTeamStatuses}
                   onToggle={(v) => toggleFilter(selectedTeamStatuses, setSelectedTeamStatuses, v)}
                   onClear={() => setSelectedTeamStatuses([])}
                   icon={Users}
                   colorTheme="indigo"
                 />
               )}
               {activeTab === 'INDIVIDUAL' && registrationStatuses.length > 0 && (
                 <MultiSelect
                   label="REG STATUS"
                   options={registrationStatuses}
                   selected={selectedRegStatuses}
                   onToggle={(v) => toggleFilter(selectedRegStatuses, setSelectedRegStatuses, v)}
                   onClear={() => setSelectedRegStatuses([])}
                   icon={Calendar}
                   colorTheme="emerald"
                 />
               )}

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search records..." 
                        className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none w-full md:w-80 font-medium transition-all focus:border-indigo-300 shadow-sm" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>
            </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="min-h-[400px]">
            {currentData.length === 0 ? (
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
                        {currentData.map((reg) => {
                            const student = activeTab === 'TEAM' ? (reg as TeamRegistration).leader : (reg as IndividualRegistration).student;
                            const team = activeTab === 'TEAM' ? (reg as TeamRegistration) : null;
                            return (
                                <div 
                                    key={reg.registrationId} 
                                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                                    onClick={() => setSelectedReg(reg)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-500 border border-slate-100">
                                                {activeTab === 'TEAM' ? <Users size={16} /> : <User size={16} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 uppercase text-sm leading-tight">
                                                    {activeTab === 'TEAM' ? `${team?.teamName} (${team?.members.length})` : student.name}
                                                </h3>
                                                <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{student.identificationNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${reg.paymentDone ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                {reg.paymentDone ? 'Paid' : 'Pending'}
                                            </span>
                                            {reg.status && (
                                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${reg.status.startsWith('CANCEL') ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                                    {reg.status.replace(/_/g, ' ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                            {student.branch}-{getYearLabel(student.year)}-{student.division}-{student.rollNo}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {(role === "ROLE_CLUB" || role === "ROLE_PRINCIPAL") && (!reg.status || !reg.status.startsWith("CANCEL")) && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleCancelRegistration(reg.registrationId); }}
                                                    disabled={cancellingId === reg.registrationId}
                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                                                >
                                                    {cancellingId === reg.registrationId ? <Loader2 size={12} className="animate-spin" /> : "Cancel"}
                                                </button>
                                            )}
                                            <ChevronDown size={14} className="text-slate-300 -rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* DESKTOP VIEW (Table) */}
                    <div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-left">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Identity Profile</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">
                                             {activeTab === 'TEAM' ? 'Leader' : 'Academic Info'}
                                         </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Communication</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Status & Date</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentData.map((reg) => {
                                        const student = activeTab === 'TEAM' ? (reg as TeamRegistration).leader : (reg as IndividualRegistration).student;
                                        const team = activeTab === 'TEAM' ? (reg as TeamRegistration) : null;
                                        
                                        return (
                                            <tr key={reg.registrationId} className="hover:bg-indigo-50/40 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800 uppercase text-sm truncate max-w-[200px]">
                                                        {activeTab === 'TEAM' ? `${team?.teamName} (${team?.members.length})` : student.name}
                                                    </div>
                                                    
                                                    {activeTab === 'INDIVIDUAL' && (
                                                        <div className="text-[12px] text-slate-400 font-mono font-bold leading-none mt-1">
                                                            ID: {student.identificationNumber}
                                                        </div>
                                                    )}
                                                </td>

                                                                                                 <td className="px-6 py-4">
                                                     {activeTab === 'TEAM' ? (
                                                         <div className="flex flex-col gap-1.5">
                                                             <div className="font-bold text-slate-800 uppercase text-xs">
                                                                 {student.name}
                                                             </div>
                                                             <div className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full w-fit whitespace-nowrap">
                                                                 {student.branch}-{getYearLabel(student.year)}-{student.division}-{student.rollNo}
                                                             </div>
                                                         </div>
                                                     ) : (
                                                         <div className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full w-fit whitespace-nowrap">
                                                             {student.branch}-{getYearLabel(student.year)}-{student.division}-{student.rollNo}
                                                         </div>
                                                     )}
                                                 </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700 truncate max-w-[180px]">
                                                        <Smartphone size={12} className="text-indigo-400 shrink-0" /> {student.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400 mt-1 truncate max-w-[180px]">
                                                        <Mail size={12} className="text-slate-300 shrink-0" /> {student.email}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border w-fit ${reg.paymentDone ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                                {reg.paymentDone ? 'Paid' : 'Pending'}
                                                            </span>
                                                            {reg.status && (
                                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border w-fit ${reg.status.startsWith('CANCEL') ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                                                    {reg.status.replace(/_/g, ' ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
                                                            <Calendar size={10} className="text-slate-300" />
                                                            {new Date(reg.registeredAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col gap-2">
                                                        <button 
                                                            onClick={() => setSelectedReg(reg)}
                                                            className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
                                                        >
                                                            View Details
                                                        </button>
                                                        {(role === "ROLE_CLUB" || role === "ROLE_PRINCIPAL") && (!reg.status || !reg.status.startsWith("CANCEL")) && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleCancelRegistration(reg.registrationId); }}
                                                                disabled={cancellingId === reg.registrationId}
                                                                className="px-5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm disabled:opacity-50 whitespace-nowrap"
                                                            >
                                                                {cancellingId === reg.registrationId ? <Loader2 size={12} className="animate-spin" /> : "Cancel"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>

      {/* --- REFINED DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedReg && (
          <DetailModal 
            type={activeTab}
            data={selectedReg} 
            onClose={() => setSelectedReg(null)} 
            getYearLabel={getYearLabel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
