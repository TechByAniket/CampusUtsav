import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, Sparkles, Filter, Check, X, ChevronDown, Users, User, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getStudentRegistrations } from '@/services/studentService';
import { MyRegistrationsList } from '../components/MyRegistrationsList';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

export interface StudentRegistration {
  eventId: number;
  registrationId?: number;
  teamId?: number;
  eventTitle: string;
  eventStartDate: string;
  eventEndDate: string;
  startTime: string;
  endTime: string;
  attendanceActive: boolean;
  venue: string;
  clubName: string;
  clubShortForm: string;
  attendanceMarked: boolean;
  markedAt: string | null;
  registrationType: 'INDIVIDUAL' | 'TEAM';
  teamName: string | null;
  teamMemberId?: number;
  leader?: boolean;
  registrationDeadline?: string;
}

const MyRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedAttendance, setSelectedAttendance] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getStudentRegistrations();
      setRegistrations(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      const attendanceMatch = selectedAttendance.length === 0 || 
        (selectedAttendance.includes('present') && reg.attendanceMarked) ||
        (selectedAttendance.includes('absent') && !reg.attendanceMarked);
      
      const typeMatch = selectedType.length === 0 || selectedType.includes(reg.registrationType);
      
      return attendanceMatch && typeMatch;
    });
  }, [registrations, selectedAttendance, selectedType]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Retrieving Your History...</p>
      </div>
    );
  }

  const activeFilterCount = selectedAttendance.length + selectedType.length;

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 sm:px-6 lg:px-12 py-10 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -mr-40 -mt-40" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  My <span className="text-indigo-600">Registrations</span>
                </h1>
                <p className="text-slate-400 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] mt-1">Your Journey Across Campus Events</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MultiSelect
                label="ATTENDANCE"
                options={['present', 'absent']}
                selected={selectedAttendance}
                onToggle={(v) => toggleFilter(selectedAttendance, setSelectedAttendance, v)}
                onClear={() => setSelectedAttendance([])}
                icon={CheckCircle2}
                colorTheme="emerald"
              />

              <MultiSelect
                label="TYPE"
                options={['INDIVIDUAL', 'TEAM']}
                selected={selectedType}
                onToggle={(v) => toggleFilter(selectedType, setSelectedType, v)}
                onClear={() => setSelectedType([])}
                icon={Users}
                colorTheme="indigo"
              />

              {activeFilterCount > 0 && (
                <button 
                  onClick={() => { setSelectedAttendance([]); setSelectedType([]); }}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-rose-500 px-2 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-2">
          {filteredRegistrations.length > 0 ? (
            <MyRegistrationsList registrations={filteredRegistrations} onRefresh={fetchRegistrations} />
          ) : (
            <div className="bg-white py-20 rounded-[3rem] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                  <Filter size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No matching events</h3>
               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Try adjusting your filters to find what you're looking for</p>
               <button 
                  onClick={() => { setSelectedAttendance([]); setSelectedType([]); }}
                  className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
               >
                  Clear all filters
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRegistrationsPage;
