import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, Search, X, Shield, Star, CheckCircle, 
  UserCircle, IdCard, Briefcase, ChevronDown, Users, 
  School, MapPin, Activity 
} from 'lucide-react';
import { 
  fetchAvailableRoles, fetchAccountStatuses, fetchStaffMembers, 
  updateStaffRole, updateStaffStatus, updateStaffClubAssignment 
} from '@/services/staffService';
import { getClubsByCollege} from '@/services/clubService'; 
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// --- HELPER COMPONENTS ---

const StaffInfoPill = ({ icon, label, value, action, isLowCase = false }: { icon: React.ReactNode; label: string; value: string; action?: React.ReactNode; isLowCase?: boolean }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-indigo-100 group">
      <div className="text-indigo-500 group-hover:scale-110 transition-transform shrink-0">{icon}</div>
      <div className="flex items-center justify-between flex-1 min-w-0">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest shrink-0">{label}</span>
        <span className={`text-[12px] font-bold text-slate-700 truncate pl-3 ${isLowCase ? 'lowercase' : 'uppercase'}`}>{value}</span>
      </div>
    </div>
    {action && <div className="px-2">{action}</div>}
  </div>
);

const StaffProfileModal = ({ 
  faculty, 
  onClose, 
  clubs, 
  availableStatuses, 
  availableRoles,
  pendingClubChanges,
  setPendingClubChanges,
  handleUpdateClubDatabase,
  pendingStatusChanges,
  setPendingStatusChanges,
  handleUpdateStatusDatabase,
  pendingRoleChanges,
  setPendingRoleChanges,
  handleUpdateRoleDatabase
}: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden no-scrollbar border border-white/20"
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
          <div className={`absolute -bottom-1 -right-1 w-7 h-7 border-4 border-white rounded-full shadow-lg ${faculty.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-300'}`} />
        </div>

        {/* Identity Section */}
        <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight leading-none mb-2">{faculty.name}</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full">
              {faculty.designation.replace('_', ' ')} — {faculty.employeeId}
            </span>
            {faculty.hod && (
              <span className="bg-amber-100 text-amber-700 font-black text-[9px] px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">HOD</span>
            )}
        </div>

        {/* Info Grid - Strict Two Column Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3 mb-8 text-left">
            <StaffInfoPill icon={<IdCard size={14}/>} label="EMPLOYEE ID" value={faculty.employeeId} />
            <StaffInfoPill icon={<Briefcase size={14}/>} label="DEPARTMENT" value={faculty.branchShortForm} />
            
            <StaffInfoPill 
              icon={<Shield size={14}/>} 
              label="SYSTEM ROLE" 
              value={faculty.role.replace('ROLE_', '')}
              action={
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select 
                      className="appearance-none w-full bg-indigo-50 border border-indigo-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-indigo-700 outline-none"
                      value={pendingRoleChanges[faculty.id] || faculty.role}
                      onChange={(e) => setPendingRoleChanges({ ...pendingRoleChanges, [faculty.id]: e.target.value })}
                    >
                      {availableRoles.map((role: any) => <option key={role} value={role}>{role.replace('ROLE_', '')}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                  </div>
                  {pendingRoleChanges[faculty.id] && pendingRoleChanges[faculty.id] !== faculty.role && (
                    <button onClick={() => handleUpdateRoleDatabase(faculty.id)} className="bg-indigo-600 text-white text-[9px] font-black px-3 py-2 rounded-xl">UPDATE</button>
                  )}
                </div>
              }
            />
            
            <StaffInfoPill 
              icon={<Users size={14}/>} 
              label="CLUB ASSIGN" 
              value={faculty.managedClubDetails?.shortForm || "NONE"}
              action={
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select 
                      className="appearance-none w-full bg-emerald-50 border border-emerald-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-emerald-700 outline-none"
                      value={pendingClubChanges[faculty.id] !== undefined ? pendingClubChanges[faculty.id] : (faculty.managedClubDetails?.id || "NONE")}
                      onChange={(e) => setPendingClubChanges({ ...pendingClubChanges, [faculty.id]: e.target.value })}
                    >
                      <option value="NONE">NONE</option>
                      {clubs.map((c: any) => <option key={c.id} value={c.id}>{c.shortForm}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                  </div>
                  {pendingClubChanges[faculty.id] !== undefined && pendingClubChanges[faculty.id] !== String(faculty.managedClubDetails?.id || "NONE") && (
                    <button onClick={() => handleUpdateClubDatabase(faculty.id)} className="bg-emerald-600 text-white text-[9px] font-black px-3 py-2 rounded-xl">SAVE</button>
                  )}
                </div>
              }
            />

            <StaffInfoPill 
              icon={<Activity size={14}/>} 
              label="STATUS" 
              value={faculty.status}
              action={
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select 
                      className="appearance-none w-full bg-orange-50 border border-orange-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-orange-700 outline-none"
                      value={pendingStatusChanges[faculty.id] || faculty.status}
                      onChange={(e) => setPendingStatusChanges({ ...pendingStatusChanges, [faculty.id]: e.target.value })}
                    >
                      {availableStatuses.map((st: any) => <option key={st} value={st}>{st}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                  {pendingStatusChanges[faculty.id] && pendingStatusChanges[faculty.id] !== faculty.status && (
                    <button onClick={() => handleUpdateStatusDatabase(faculty.id)} className="bg-orange-600 text-white text-[9px] font-black px-3 py-2 rounded-xl">UPDATE</button>
                  )}
                </div>
              }
            />

            <StaffInfoPill icon={<Mail size={14}/>} label="EMAIL" value={faculty.email} isLowCase />
            <StaffInfoPill icon={<Phone size={14}/>} label="CONTACT" value={faculty.phone} />
        </div>

        {/* Final Actions */}
        <div className="grid grid-cols-2 gap-2">
          <a 
            href={`tel:${faculty.phone}`} 
            className="flex items-center justify-center py-4 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            <Phone size={14} /> Call
          </a>
          <a 
            href={`mailto:${faculty.email}`}
            className="flex items-center justify-center py-4 bg-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-100"
          >
            <Mail size={14} /> Email
          </a>
        </div>
      </div>
    </motion.div>
  </div>
);

// --- MAIN COMPONENT ---

export const StaffInfoList = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  const [pendingRoleChanges, setPendingRoleChanges] = useState<Record<string, any>>({});
  const [pendingStatusChanges, setPendingStatusChanges] = useState<Record<string, any>>({});
  const [pendingClubChanges, setPendingClubChanges] = useState<Record<string, any>>({});

  const collegeId = useSelector((state: any) => state.auth.collegeId);

  useEffect(() => {
    const getData = async () => {
      try {
        const [staff, roles, statuses, clubList] = await Promise.all([
          fetchStaffMembers(),
          fetchAvailableRoles(),
          fetchAccountStatuses(),
          getClubsByCollege(collegeId)
        ]);
        setFacultyList(staff);
        setAvailableRoles(roles);
        setAvailableStatuses(statuses);
        setClubs(clubList);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    getData();
  }, []);

  const handleUpdateStatusDatabase = async (id: number | string) => {
    const newStatus = pendingStatusChanges[id];
    try {
      await updateStaffStatus(id, newStatus);
      setFacultyList((prev: any[]) => prev.map((f: any) => f.id === id ? { ...f, status: newStatus } : f));
      if (selectedFaculty?.id === id) setSelectedFaculty((prev: any) => ({ ...prev, status: newStatus }));
      const updated = { ...pendingStatusChanges }; delete updated[id];
      setPendingStatusChanges(updated);
      toast.success("Status Updated!");
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const handleUpdateRoleDatabase = async (id: number | string) => {
    const newRole = pendingRoleChanges[id];
    try {
      await updateStaffRole(id, newRole);
      setFacultyList((prev: any[]) => prev.map((f: any) => f.id === id ? { ...f, role: newRole, hod: newRole === 'ROLE_HOD' } : f));
      if (selectedFaculty?.id === id) setSelectedFaculty((prev: any) => ({ ...prev, role: newRole, hod: newRole === 'ROLE_HOD' }));
      const updated = { ...pendingRoleChanges }; delete updated[id];
      setPendingRoleChanges(updated);
      toast.success("Role Updated!");
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const handleUpdateClubDatabase = async (id: number | string) => {
    const clubId = pendingClubChanges[id];
    try {
      await updateStaffClubAssignment(id, clubId === "NONE" ? null : clubId);
      const selectedClub = clubs.find(c => c.id === parseInt(clubId));
      
      setFacultyList((prev: any[]) => prev.map((f: any) => {
        if (f.id === id) {
          return { 
            ...f, 
            clubCoordinator: clubId !== "NONE",
            managedClubDetails: clubId === "NONE" ? null : selectedClub 
          };
        }
        return f;
      }));

      if (selectedFaculty?.id === id) {
        setSelectedFaculty((prev: any) => ({
          ...prev,
          clubCoordinator: clubId !== "NONE",
          managedClubDetails: clubId === "NONE" ? null : selectedClub 
        }));
      }

      const updated = { ...pendingClubChanges }; delete updated[id];
      setPendingClubChanges(updated);
      toast.success("Club Assignment Updated!");
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const filteredData = facultyList.filter(f =>
    f.status === activeTab &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full font-sans">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
              Faculty Management
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 tracking-wide">
              Organize faculty designations, roles, and club assignments
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search faculty..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none w-full md:w-64 font-medium" onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* --- STATUS TABS --- */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {availableStatuses.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* --- MOBILE VIEW --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredData.map((f) => (
            <div key={f.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm" onClick={() => setSelectedFaculty(f)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 uppercase text-sm">{f.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{f.employeeId}</p>
                </div>
                {f.hod && <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-2 py-0.5 rounded border border-amber-200 uppercase">HOD</span>}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                 <Briefcase size={12} className="text-indigo-500" /> {f.branchShortForm} • {f.designation.replace('_', ' ')}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[9px] font-black text-indigo-600 uppercase">Tap for Quick Actions</span>
                <ChevronDown size={14} className="text-slate-300 -rotate-90" />
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Faculty Info</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Club Coordinator</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Account Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Role Management</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((f) => {
                const currentClubId = f.managedClubDetails?.id || "NONE";
                return (
                  <tr key={f.id} className="hover:bg-indigo-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                          <div className="font-bold text-slate-800 uppercase text-sm">{f.name}</div>
                          {f.hod && <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded border border-amber-200 uppercase tracking-tighter">HOD</span>}
                      </div>
                      <div className="text-[12px] text-slate-400 font-mono font-bold leading-none mt-1">ID: {f.employeeId}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                          <div className="relative">
                              <select 
                                  className={`appearance-none border rounded-xl pl-3 pr-8 py-2 text-[11px] font-black cursor-pointer outline-none transition-all ${currentClubId !== "NONE" || pendingClubChanges[f.id] ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                  value={pendingClubChanges[f.id] !== undefined ? pendingClubChanges[f.id] : currentClubId}
                                  onChange={(e) => setPendingClubChanges({ ...pendingClubChanges, [f.id]: e.target.value })}
                              >
                                  <option value="NONE">NOT ASSIGNED</option>
                                  {clubs.map(c => <option key={c.id} value={c.id}>{c.shortForm}</option>)}
                              </select>
                              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                          {pendingClubChanges[f.id] !== undefined && pendingClubChanges[f.id] !== String(currentClubId) && (
                              <button onClick={() => handleUpdateClubDatabase(f.id)} className="bg-emerald-600 text-white text-[10px] font-black px-3 py-2 rounded-xl animate-pulse shadow-md">SAVE</button>
                          )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className="relative">
                          <select className="appearance-none bg-orange-50 border border-orange-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-orange-700 cursor-pointer outline-none" value={pendingStatusChanges[f.id] || f.status} onChange={(e) => setPendingStatusChanges({ ...pendingStatusChanges, [f.id]: e.target.value })}>
                            {availableStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                        </div>
                        {pendingStatusChanges[f.id] && pendingStatusChanges[f.id] !== f.status && (
                          <button onClick={() => handleUpdateStatusDatabase(f.id)} className="bg-orange-600 text-white text-[10px] font-black px-3 py-2 rounded-xl animate-pulse">UPDATE</button>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select className="appearance-none bg-indigo-50 border border-indigo-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-indigo-700 cursor-pointer outline-none" value={pendingRoleChanges[f.id] || f.role} onChange={(e) => setPendingRoleChanges({ ...pendingRoleChanges, [f.id]: e.target.value })}>
                            {availableRoles.map(role => <option key={role} value={role}>{role.replace('ROLE_', '')}</option>)}
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                        </div>
                        {pendingRoleChanges[f.id] && pendingRoleChanges[f.id] !== f.role && (
                          <button onClick={() => handleUpdateRoleDatabase(f.id)} className="bg-indigo-600 text-white text-[10px] font-black px-3 py-2 rounded-xl animate-pulse">UPDATE</button>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                       <button onClick={() => setSelectedFaculty(f)} className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">View Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- STAFF PROFILE MODAL --- */}
        <AnimatePresence>
          {selectedFaculty && (
            <StaffProfileModal 
              faculty={selectedFaculty} 
              onClose={() => setSelectedFaculty(null)} 
              clubs={clubs}
              availableStatuses={availableStatuses}
              availableRoles={availableRoles}
              pendingClubChanges={pendingClubChanges}
              setPendingClubChanges={setPendingClubChanges}
              handleUpdateClubDatabase={handleUpdateClubDatabase}
              pendingStatusChanges={pendingStatusChanges}
              setPendingStatusChanges={setPendingStatusChanges}
              handleUpdateStatusDatabase={handleUpdateStatusDatabase}
              pendingRoleChanges={pendingRoleChanges}
              setPendingRoleChanges={setPendingRoleChanges}
              handleUpdateRoleDatabase={handleUpdateRoleDatabase}
            />
          )}
        </AnimatePresence>
    </div>
  );
};
