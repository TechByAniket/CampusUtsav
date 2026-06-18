import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "@/store/store";
import {
  User,
  BookOpen,
  Fingerprint,
  Calendar,
  Users,
  Hash,
  Search,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Mail,
  Plus
} from "lucide-react";
import { fetchTeamMembersMetaData } from "@/services/eventService";
import { registerForEvent } from "@/services/eventRegistrationService";

/* ================= UTILS ================= */

const YEAR_MAPPING: Record<string, string> = {
  "1": "FY",
  "2": "SY",
  "3": "TY",
  "4": "FINAL"
};

/* ================= COMPONENT ================= */

export const EventRegistrationForm: React.FC<{
  onClose: () => void;
  eventTitle?: string;
  minTeamSize?: number;
  maxTeamSize?: number;
  isTeamEvent?: boolean;
  eventId: number;
  allowedBranches?: Record<string, string>;
  allowedYears?: Record<string, string>;
}> = ({ 
  onClose, minTeamSize = 1, maxTeamSize = 1, isTeamEvent = false, eventTitle, eventId,
  allowedBranches = {}, allowedYears = {}
}) => {
   const student = useSelector((state: RootState) => state.auth.studentSummary);
   const curStudentCollegeId = useSelector((state: RootState) => state.auth.collegeId);

  /* ================= FORM STATE ================= */
  const [registrationType, setRegistrationType] = useState<"INDIVIDUAL" | "TEAM">(
    minTeamSize > 1 ? "TEAM" : (isTeamEvent ? "TEAM" : "INDIVIDUAL")
  );
  const [leaderId, setLeaderId] = useState<number | null>(student?.id || null);

  const [formData, setFormData] = useState({
    teamName: "",
    teamMembers: [] as string[],
  });

  const [partnerCount, setPartnerCount] = useState<number>(Math.max(1, minTeamSize - 1));

  /* Preview data per team member index */
  const [teamMembersMeta, setTeamMembersMeta] = useState<
    Record<number, any>
  >({});
  
  const [verifyingIdx, setVerifyingIdx] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= VERIFY MEMBER ================= */

  const verifyTeamMember = async (idx: number) => {
    const idNumber = formData.teamMembers[idx];
    if (!idNumber) return;

    setVerifyingIdx(idx);
    try {
      const data = await fetchTeamMembersMetaData(idNumber);
      
      if(data.collegeId !== curStudentCollegeId) {
        toast.error("Team members must be from the same college.");
        return;
      }
      
      // Eligibility Check
      const branchList = Object.values(allowedBranches);
      const yearList = Object.values(allowedYears);
      
      const partnerYearLabel = YEAR_MAPPING[String(data.year)] || String(data.year);
      
      const isBranchEligible = branchList.length === 0 || branchList.includes(data.branch);
      const isYearEligible = yearList.length === 0 || yearList.includes(partnerYearLabel);

      if (!isBranchEligible || !isYearEligible) {
        toast.error(`${data.name} (${partnerYearLabel}) is not eligible for this event.`);
        // Remove from list
        setTeamMembersMeta((prev) => {
          const updated = { ...prev };
          delete updated[idx];
          return updated;
        });
        return;
      }

      setTeamMembersMeta((prev) => ({
        ...prev,
        [idx]: data,
      }));
      toast.success(`${data.name} verified successfully.`);
    } catch {
      toast.error("Student not found in institutional database.");
      setTeamMembersMeta((prev) => {
        const updated = { ...prev };
        delete updated[idx];
        return updated;
      });
    } finally {
      setVerifyingIdx(null);
    }
  };

  const addPartnerField = () => {
    if (partnerCount + 1 > maxTeamSize - 1) {
      toast.error("Maximum team size limit reached.");
      return;
    }
    setPartnerCount(prev => prev + 1);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const isTeam = registrationType === "TEAM";
    
    // Final validation for team formation
    if (isTeam) {
       if (!formData.teamName.trim()) {
         toast.error("Please provide a name for your team.");
         return;
       }
       const verifiedCount = Object.keys(teamMembersMeta).length;
       if (verifiedCount < minTeamSize - 1) {
         toast.error(`Verification incomplete. Please verify at least ${minTeamSize - 1} team members.`);
         return;
       }
       if (!leaderId) {
         toast.error("Please select a team leader.");
         return;
       }
    }

    // Prepare payload according to backend model
    const registrationPayload = {
      studentId: student?.id, // The person initiating the registration
      leaderId: isTeam ? leaderId : student?.id,
      teamName: isTeam ? formData.teamName : null,
      registrationType: registrationType,
      teamMemberIds: isTeam ? Object.values(teamMembersMeta).map(m => m.id) : [],
    };

    try {
      setIsSubmitting(true);
      await registerForEvent(eventId, registrationPayload);
      toast.success("Successfully registered for " + (eventTitle || "event"));
      onClose(); // Auto close on success
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans overflow-hidden min-h-[500px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-header {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .bento-tile {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .bento-tile:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <div className="glass-header px-6 py-5 text-white relative border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
               <ShieldCheck size={18} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 leading-none">Registration Form</p>
               <h2 className="text-xl text-primary font-extrabold tracking-tight uppercase leading-none truncate max-w-[300px]">
                 {eventTitle || "Event Entry"}
               </h2>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar font-jakarta">
        
        {/* ===== REGISTRATION TYPE SELECTION ===== */}
        {isTeamEvent && minTeamSize === 1 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
               <div className="w-1 h-4 bg-primary rounded-full" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Registration Mode</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setRegistrationType("INDIVIDUAL");
                  setLeaderId(student?.id || null);
                }}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  registrationType === "INDIVIDUAL"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                <User size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Individual</span>
              </button>
              <button
                onClick={() => setRegistrationType("TEAM")}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  registrationType === "TEAM"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                <Users size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Team</span>
              </button>
            </div>
          </section>
        )}

        {/* ===== COORDINATOR BENTO INFO ===== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1 h-4 bg-indigo-600 rounded-full" />
             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Primary Candidate Information</h3>
             {registrationType === "TEAM" && (
                <div className="px-3 py-1.5 rounded-full border flex items-center gap-2 bg-amber-50/50 border-amber-500/20 text-amber-600">
                  <Users size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                    Team Formation
                  </span>
                </div>
             )}
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
             <IdentityTile label="Full Name" value={student?.name} icon={<User size={14} />} color="indigo" />
             <IdentityTile label="Roll No" value={student?.rollNo} icon={<Fingerprint size={14} />} color="slate" />
             <IdentityTile label="Branch" value={student?.branch} icon={<BookOpen size={14} />} color="blue" />
             <IdentityTile label="Year" value={YEAR_MAPPING[String(student?.year)] || student?.year} icon={<Calendar size={14} />} color="violet" />
             <IdentityTile label="Email" value={student?.email} icon={<Mail size={14} />} color="orange" className="lg:col-span-2" />
          </div>
        </section>

        {/* ===== TEAM ARCHITECTURE ===== */}
        {registrationType === "TEAM" && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center gap-2 mb-1">
               <div className="w-1 h-4 bg-amber-500 rounded-full" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Unit Identification & Formation</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                   <Hash size={16} />
                </div>
                <input
                  placeholder="TEAM CODENAME"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-amber-500 transition-all text-xs uppercase tracking-widest"
                />
              </div>

              {/* Members Grid - High Density */}
              <div className="space-y-3">
                 {Array.from({ length: partnerCount }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                          <Users size={14} />
                        </div>
                        <input
                          placeholder={`Member ${idx + 2} College/University UID`}
                          value={formData.teamMembers[idx] || ""}
                          onChange={(e) => {
                            const updated = [...formData.teamMembers];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, teamMembers: updated });
                          }}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 outline-none focus:border-indigo-600 transition-all capitalize tracking-widest"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={verifyingIdx === idx}
                        onClick={() => verifyTeamMember(idx)}
                        className="px-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-indigo-600 transition-all flex items-center gap-2 shrink-0 active:scale-95"
                      >
                        {verifyingIdx === idx ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Search size={14} />} 
                        {verifyingIdx === idx ? "SCAN" : "VERIFY"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {teamMembersMeta[idx] && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between px-3 py-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl overflow-hidden"
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                 <User size={12} />
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[10px] font-black text-slate-900 uppercase truncate max-w-[150px]">{teamMembersMeta[idx].name}</p>
                                 <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter">
                                   {teamMembersMeta[idx].branch} • {YEAR_MAPPING[String(teamMembersMeta[idx].year)] || teamMembersMeta[idx].year} YEAR
                                 </p>
                              </div>
                           </div>
                           <CheckCircle2 size={16} className="text-emerald-500 shrink-0" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {partnerCount < maxTeamSize - 1 && minTeamSize !== maxTeamSize && (
                <button
                  type="button"
                  onClick={addPartnerField}
                  className="mt-2 text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 flex items-center gap-2 w-fit"
                >
                  <Plus size={14} /> Add Member
                </button>
              )}

              {/* Leader Selection Section */}
              {Object.keys(teamMembersMeta).length === partnerCount && (
                <div className="space-y-3 pt-2">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Command & Control (Select Leader)</h3>
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      {/* Current User Option */}
                      <button
                        onClick={() => setLeaderId(student?.id || null)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          leaderId === student?.id
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-100 bg-white hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${leaderId === student?.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                            <ShieldCheck size={16} />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black text-slate-900 uppercase">You (Coordinator)</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{student?.name}</p>
                          </div>
                        </div>
                        {leaderId === student?.id && <CheckCircle2 size={16} className="text-emerald-500" />}
                      </button>

                      {/* Verified Members Options */}
                      {Object.values(teamMembersMeta).map((member: any) => (
                        <button
                          key={member.id}
                          onClick={() => setLeaderId(member.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                            leaderId === member.id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-100 bg-white hover:border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${leaderId === member.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                              <User size={16} />
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-black text-slate-900 uppercase">Team Member</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{member.name}</p>
                            </div>
                          </div>
                          {leaderId === member.id && <CheckCircle2 size={16} className="text-emerald-500" />}
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* ===== REFINED SLIM FOOTER ===== */}
      <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-white">
        <button
          onClick={onClose}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors py-2"
        >
          Decline
        </button>
        
        <button
          disabled={isSubmitting || (registrationType === "TEAM" && !leaderId)}
          onClick={handleSubmit}
          className="px-8 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center gap-3 hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg active:scale-95 group"
        >
          {isSubmitting ? (
            <>
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
               SYNCING PROTOCOL
            </>
          ) : (
            <>
              Finalize Entry 
              <Zap size={14} className="group-hover:text-yellow-400 transition-colors" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ================= COMPACT BENTO TILE ================= */

const IdentityTile = ({ label, value, icon, color = "indigo", className = "" }: any) => (
  <div className={`bento-tile group bg-slate-50 p-2 border border-slate-100 rounded-2xl flex items-center gap-3 ${className}`}>
    <div className={`w-8 h-8 rounded-xl bg-white border border-slate-100 text-${color}-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 leading-none">
        {label}
      </p>
      <p className="text-[12px] font-extrabold text-slate-800 capitalize truncate leading-tight">
        {value || "---"}
      </p>
    </div>
  </div>
);
