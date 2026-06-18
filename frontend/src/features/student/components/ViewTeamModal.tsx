import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { getTeamMembers, addMember, leaveTeam, removeMember } from "../../../services/teamService";
import { fetchTeamMembersMetaData } from "../../../services/eventService";
import type { StudentRegistration } from "../pages/MyRegistrationsPage";

type ViewTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  teamName: string;
  reg: StudentRegistration;
  onRefresh: () => void;
};

const getYearShortLabel = (year: any) => {
  switch (year) {
    case 1: return "FY";
    case 2: return "SY";
    case 3: return "TY";
    case 4: return "LY";
    default: return "Y" + year;
  }
};

export const ViewTeamModal = ({ isOpen, onClose, teamId, teamName, reg, onRefresh }: ViewTeamModalProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<number | null>(null);

  // New features:
  const [minTeamSize, setMinTeamSize] = useState<number | null>(null);
  const [maxTeamSize, setMaxTeamSize] = useState<number | null>(null);
  
  // Verification states:
  const [idNumber, setIdNumber] = useState<string>("");
  const [fetchingStudent, setFetchingStudent] = useState(false);
  const [fetchedStudent, setFetchedStudent] = useState<any>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchMembers = async () => {
        try {
          setLoading(true);
          const tId = teamId || reg.teamId || (reg as any).team?.id;
          if (!tId) {
            toast.error("No valid team ID found for this registration");
            setLoading(false);
            return;
          }
          let rawData = await getTeamMembers(tId);
          console.log("Fetched team members data:", rawData, "for team ID:", tId);
          let data = rawData;
          if (Array.isArray(rawData) && rawData[0]?.members) {
            setMinTeamSize(rawData[0].minTeamSize || 1);
            setMaxTeamSize(rawData[0].maxTeamSize || 4);
            data = rawData[0].members;
          } else if (rawData && rawData.members) {
            setMinTeamSize(rawData.minTeamSize || 1);
            setMaxTeamSize(rawData.maxTeamSize || 4);
            data = rawData.members;
          }
          setMembers(Array.isArray(data) ? data : []);
        } catch (error: any) {
          toast.error(error.message || "Failed to load team members");
        } finally {
          setLoading(false);
        }
      };
      fetchMembers();
    }
  }, [isOpen, teamId, reg]);

  const handleLeave = async (memberId: number) => {
    try {
      setLeavingId(memberId);
      const res = await leaveTeam(memberId);
      toast.success(typeof res === 'string' ? res : "Successfully left the team!");
      onClose();
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to leave team");
    } finally {
      setLeavingId(null);
    }
  };

  const handleRemove = async (memberId: number) => {
    try {
      setLeavingId(memberId);
      const res = await removeMember(memberId);
      toast.success(typeof res === 'string' ? res : "Successfully removed team member!");
      
      const tId = teamId || reg.teamId || (reg as any).team?.id;
      let rawData = await getTeamMembers(tId!);
      let data = rawData;
      if (Array.isArray(rawData) && rawData[0]?.members) {
        data = rawData[0].members;
      } else if (rawData && rawData.members) {
        data = rawData.members;
      }
      setMembers(Array.isArray(data) ? data : []);

      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setLeavingId(null);
    }
  };

  const handleVerifyStudent = async () => {
    if (!idNumber.trim()) {
      toast.error("Please enter an identification number");
      return;
    }
    try {
      setFetchingStudent(true);
      setFetchedStudent(null);
      const data = await fetchTeamMembersMetaData(idNumber.trim());
      setFetchedStudent(data);
      toast.success("Student verified successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to verify student details");
    } finally {
      setFetchingStudent(false);
    }
  };

  const handleAddMember = async () => {
    if (!fetchedStudent) {
      toast.error("Please verify a student first");
      return;
    }
    try {
      setAdding(true);
      const tId = teamId || reg.teamId || (reg as any).team?.id;
      const sId = fetchedStudent.studentId || fetchedStudent.id;
      const res = await addMember(tId!, sId);
      toast.success(typeof res === 'string' ? res : "Successfully added team member!");
      setIdNumber("");
      setFetchedStudent(null);
      
      // Refresh modal
      let rawData = await getTeamMembers(tId!);
      let data = rawData;
      if (Array.isArray(rawData) && rawData[0]?.members) {
        data = rawData[0].members;
      } else if (rawData && rawData.members) {
        data = rawData.members;
      }
      const updatedMembers = Array.isArray(data) ? data : [];
      setMembers(updatedMembers);

      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setAdding(false);
    }
  };

  if (!isOpen) return null;

  const currentUserMember = members.find(m => m.teamMemberId === reg.teamMemberId);
  const isLeader = reg.leader || currentUserMember?.leader === true;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border border-slate-200"
      >
        <div className="px-8 py-5 flex items-center justify-between border-b border-slate-50">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Squad Members for {teamName}
            </h3>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
        </div>

        <div className="px-8 py-3 bg-indigo-50/50 border-b border-slate-100 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-indigo-600">
          <div>Size Limit: {minTeamSize || 1}-{maxTeamSize || 'N/A'}</div>
          <div>Total: {members.length} member{members.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="px-8 py-4">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Squad Members...</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
                    {isLeader && members.length < (maxTeamSize || 4) && (
                        <div className="mb-4 p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Add Team Member</p>
                                {fetchedStudent && (
                                    <button
                                        onClick={handleAddMember}
                                        disabled={adding}
                                        className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-black text-[9px] uppercase tracking-widest rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 disabled:opacity-50 shadow-sm shrink-0"
                                    >
                                        {adding ? <Loader2 size={12} className="animate-spin" /> : "Add Member"}
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text"
                                    placeholder="Enter ID Number (e.g. 23IT12)"
                                    value={idNumber}
                                    onChange={(e) => { setIdNumber(e.target.value); setFetchedStudent(null); }}
                                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-800 outline-none uppercase placeholder:capitalize"
                                />
                                <button
                                    onClick={handleVerifyStudent}
                                    disabled={fetchingStudent || !idNumber.trim()}
                                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-black text-[9px] uppercase tracking-widest rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 disabled:opacity-50 shadow-sm whitespace-nowrap"
                                >
                                    {fetchingStudent ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
                                </button>
                            </div>

                            {fetchedStudent && (
                                <div className="p-2 bg-white border border-indigo-100/60 rounded-lg flex items-center justify-between gap-2 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 uppercase text-[10px] leading-tight">
                                            {fetchedStudent.name}
                                        </p>
                                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-tight mt-0.5">
                                            {getYearShortLabel(fetchedStudent.year)}-{fetchedStudent.branch || fetchedStudent.branchShortForm || 'N/A'}-{fetchedStudent.division}-{fetchedStudent.rollNo}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        {members.map((m) => (
                            <div key={m.teamMemberId || m.studentId} className="flex flex-row items-center justify-between gap-3 rounded-2xl px-4 py-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/20 text-[10px] font-black uppercase tracking-wider transition-all duration-300">
                                <div className="flex-1 flex flex-row items-center gap-3 min-w-0">
                                    <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 shrink-0">
                                        <Users size={16} />
                                    </div>
                                    <div className="flex flex-row items-center gap-4 truncate">
                                        <p className="font-bold text-slate-800 shrink-0 truncate">
                                            {m.name}
                                        </p>
                                        {m.leader && (
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-lg text-[8px] font-black tracking-widest shrink-0 w-fit">
                                                Leader
                                            </span>
                                        )}
                                        <p className="font-bold text-indigo-500 tracking-wider shrink-0">
                                            {getYearShortLabel(m.year)}-{m.branchShortForm || m.branch || 'N/A'}-{m.division}-{m.rollNo}
                                        </p>
                                        {(m.phone || m.email) && (
                                            <p className="text-[9px] font-bold text-slate-400 tracking-widest truncate hidden sm:inline shrink-0">
                                                {m.phone && `${m.phone}`}
                                                {m.email && ` | ${m.email}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                {(m.teamMemberId === reg.teamMemberId || m.studentId === (reg as any).studentId) && !m.leader && (
                                    <button 
                                        onClick={() => handleLeave(m.teamMemberId)}
                                        disabled={leavingId === m.teamMemberId}
                                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1 disabled:opacity-50 shrink-0"
                                    >
                                        {leavingId === m.teamMemberId ? <Loader2 size={12} className="animate-spin" /> : "Leave"}
                                    </button>
                                )}
                                {isLeader && !m.leader && (
                                    <button 
                                        onClick={() => handleRemove(m.teamMemberId)}
                                        disabled={leavingId === m.teamMemberId}
                                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1 disabled:opacity-50 shrink-0"
                                    >
                                        {leavingId === m.teamMemberId ? <Loader2 size={12} className="animate-spin" /> : "Remove"}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {!isLeader && currentUserMember && (
                        <button
                            onClick={() => handleLeave(currentUserMember.teamMemberId)}
                            disabled={leavingId === currentUserMember.teamMemberId}
                            className="w-full mt-4 py-3.5 bg-rose-600 text-white hover:bg-rose-700 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-rose-100 disabled:opacity-50"
                        >
                            {leavingId === currentUserMember.teamMemberId ? <Loader2 size={14} className="animate-spin" /> : "Leave Team"}
                        </button>
                    )}
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};
