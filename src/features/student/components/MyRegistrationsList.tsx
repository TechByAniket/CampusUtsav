import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Tag, CheckCircle2, 
  AlertCircle, ArrowUpRight, Loader2, Sparkles, Users,
  X, UserCircle, ShieldCheck, Mail, Smartphone, Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { markAttendance } from '@/services/eventAttendanceService';
import { leaveTeam, getTeamMembers, addMember, removeMember } from '@/services/teamService';
import { cancelEventRegistration } from '@/services/eventRegistrationService';
import { getMyStudentProfileDetails, getAllStudentsByCollege } from '@/services/studentService';
import { fetchTeamMembersMetaData } from '@/services/eventService';
import type { StudentRegistration } from '../pages/MyRegistrationsPage';

import QRScannerModal from './QRScannerModal';

const formatEventDate = (startDate: string, endDate: string) => {
  if (!startDate) return "";
  if (!endDate || startDate === endDate) {
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return startDate;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } else {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return `${startDate} – ${endDate}`;
    const day1 = d1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const day2 = d2.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${day1} – ${day2}`;
  }
};

import { ViewTeamModal } from './ViewTeamModal';

type MyRegistrationsListProps = {
  registrations: StudentRegistration[];
  onRefresh: () => void;
};

export const MyRegistrationsList = ({ registrations, onRefresh }: MyRegistrationsListProps) => {
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<{ id: number, title: string } | null>(null);
  
  const [selectedTeamReg, setSelectedTeamReg] = useState<StudentRegistration | null>(null);

  const handleStartScan = (eventId: number, title: string) => {
    setActiveEvent({ id: eventId, title });
    setIsScannerOpen(true);
  };

  const handleScanSuccess = async (token: string) => {
    if (!activeEvent) return;
    
    setIsScannerOpen(false);
    try {
      setMarkingId(activeEvent.id);
      await markAttendance(token);
      toast.success("Attendance verified successfully!");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    } finally {
      setMarkingId(null);
      setActiveEvent(null);
    }
  };

  const isBeforeDeadline = (deadlineStr?: string, eventStartDate?: string) => {
    const now = new Date();
    if (deadlineStr) {
      return now < new Date(deadlineStr);
    }
    if (eventStartDate) {
      return now < new Date(eventStartDate);
    }
    return true;
  };

  const handleLeaveTeam = async (teamMemberId: number, eventTitle: string) => {
    try {
      setMarkingId(teamMemberId);
      const res = await leaveTeam(teamMemberId);
      toast.success(typeof res === 'string' ? res : `Successfully left the team for ${eventTitle}`);
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to leave team");
    } finally {
      setMarkingId(null);
    }
  };

  const handleCancelRegistration = async (registrationId: number, eventTitle: string) => {
    try {
      setMarkingId(registrationId);
      const res = await cancelEventRegistration(registrationId);
      toast.success(typeof res === 'string' ? res : `Successfully cancelled registration for ${eventTitle}`);
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel registration");
    } finally {
      setMarkingId(null);
    }
  };

  const handleViewTeam = (reg: StudentRegistration) => {
    setSelectedTeamReg(reg);
  };

  if (registrations.length === 0) {
    return (
      <div className="bg-white rounded-[3rem] border border-slate-200 p-20 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Sparkles size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">No Registrations Yet</h3>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Explore events and start your journey</p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
        {/* --- MOBILE VIEW --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
            {registrations.map((reg) => (
                <div key={reg.eventId} className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="min-w-0">
                            <h3 className="font-black text-slate-900 uppercase text-sm leading-tight truncate">{reg.eventTitle}</h3>
                            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1">{reg.clubShortForm}</p>
                        </div>
                        {reg.attendanceMarked ? (
                             <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                                <CheckCircle2 size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Present</span>
                             </div>
                        ) : reg.attendanceActive ? (
                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100 animate-pulse">
                                <Sparkles size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Live</span>
                            </div>
                        ) : (
                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                Upcoming
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] text-slate-500 font-bold uppercase tracking-tight shadow-sm">
                            <Calendar size={11} className="text-indigo-400" /> {formatEventDate(reg.eventStartDate, reg.eventEndDate)}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] text-slate-500 font-bold uppercase tracking-tight shadow-sm">
                            <Clock size={11} className="text-indigo-400" /> {reg.startTime.slice(0, 5)} - {reg.endTime.slice(0, 5)}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] text-slate-500 font-bold uppercase tracking-tight shadow-sm">
                            <MapPin size={11} className="text-indigo-400" /> {reg.venue}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {reg.attendanceMarked ? (
                            <div className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest bg-slate-50 border border-slate-100 rounded-xl py-2">
                                COMPLETED
                            </div>
                        ) : reg.attendanceActive ? (
                            <button 
                                onClick={() => handleStartScan(reg.eventId, reg.eventTitle)}
                                disabled={markingId === reg.eventId}
                                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-100"
                            >
                                {markingId === reg.eventId ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}
                                Mark Attendance
                            </button>
                        ) : isBeforeDeadline(reg.registrationDeadline, reg.eventStartDate) ? (
                            reg.registrationType === 'INDIVIDUAL' ? (
                                <button 
                                    onClick={() => handleCancelRegistration(Number(reg.registrationId), reg.eventTitle)}
                                    disabled={markingId === Number(reg.registrationId)}
                                    className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 mt-1"
                                >
                                    {markingId === Number(reg.registrationId) ? <Loader2 size={12} className="animate-spin" /> : "Cancel Registration"}
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleViewTeam(reg)}
                                    className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 mt-1"
                                >
                                    View Team
                                </button>
                            )
                        ) : (
                            <div className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest bg-slate-50 border border-slate-100 rounded-xl py-2">
                                WAITING
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-left">
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Event & Organizer</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Schedule & Venue</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Registration</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Attendance Status</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {registrations.map((reg) => (
                        <tr key={reg.eventId} className="hover:bg-indigo-50/40 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="font-black text-slate-900 uppercase text-sm group-hover:text-indigo-600 transition-colors">{reg.eventTitle}</div>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase tracking-tighter border border-indigo-100">
                                        {reg.clubShortForm}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reg.clubName}</span>
                                </div>
                            </td>

                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                                    <Calendar size={13} className="text-indigo-400" /> {formatEventDate(reg.eventStartDate, reg.eventEndDate)}
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-tight">
                                        <Clock size={12} className="text-slate-300" /> {reg.startTime.slice(0, 5)} - {reg.endTime.slice(0, 5)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-tight">
                                        <MapPin size={12} className="text-slate-300" /> {reg.venue}
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                    {reg.registrationType === 'TEAM' ? (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 border border-sky-100 rounded-full w-fit">
                                                <Users size={12} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Team</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-900 pl-1">{reg.teamName}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-full w-fit">
                                            <Tag size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Individual</span>
                                        </div>
                                    )}
                                </div>
                            </td>

                            <td className="px-6 py-5">
                                {reg.attendanceMarked ? (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.1em]">
                                            <CheckCircle2 size={14} className="fill-emerald-50" />
                                            Marked Present
                                        </div>
                                        {reg.markedAt && (
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-5">
                                                At {new Date(reg.markedAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                            </div>
                                        )}
                                    </div>
                                ) : reg.attendanceActive ? (
                                    <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-[0.15em] animate-pulse">
                                        <Sparkles size={14} />
                                        Session Live
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-300 font-black text-[10px] uppercase tracking-[0.15em]">
                                        <AlertCircle size={14} />
                                        Not Started
                                    </div>
                                )}
                            </td>

                            <td className="px-6 py-5 text-center">
                                <div className="flex flex-col gap-2 items-center">
                                     {reg.attendanceMarked ? (
                                         <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                             COMPLETED
                                         </div>
                                     ) : reg.attendanceActive ? (
                                         <button 
                                             onClick={() => handleStartScan(reg.eventId, reg.eventTitle)}
                                             disabled={markingId === reg.eventId}
                                             className="group/btn relative px-6 py-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all active:scale-95 flex items-center gap-2 mx-auto shadow-lg shadow-orange-100"
                                         >
                                             {markingId === reg.eventId ? (
                                                 <Loader2 size={14} className="animate-spin text-white" />
                                             ) : (
                                                 <>
                                                     <span>Mark Presence</span>
                                                     <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                 </>
                                             )}
                                         </button>
                                     ) : isBeforeDeadline(reg.registrationDeadline, reg.eventStartDate) ? (
                                         reg.registrationType === 'INDIVIDUAL' ? (
                                             <button 
                                                 onClick={() => handleCancelRegistration(Number(reg.registrationId), reg.eventTitle)}
                                                 disabled={markingId === Number(reg.registrationId)}
                                                 className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 mt-1"
                                             >
                                                 {markingId === Number(reg.registrationId) ? <Loader2 size={12} className="animate-spin" /> : "Cancel Registration"}
                                             </button>
                                         ) : (
                                             <button 
                                                 onClick={() => handleViewTeam(reg)}
                                                 className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 mt-1"
                                             >
                                                 View Team
                                             </button>
                                         )
                                     ) : (
                                         <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                             WAITING
                                         </div>
                                     )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* QR Scanner Modal */}
        <QRScannerModal 
            isOpen={isScannerOpen} 
            onClose={() => setIsScannerOpen(false)} 
            onScanSuccess={handleScanSuccess}
            eventTitle={activeEvent?.title || ""}
        />

        {/* View Team Modal */}
        <AnimatePresence>
          {selectedTeamReg && (
            <ViewTeamModal
              isOpen={!!selectedTeamReg}
              onClose={() => setSelectedTeamReg(null)}
              teamId={selectedTeamReg.teamId!}
              teamName={selectedTeamReg.teamName || "Your Team"}
              reg={selectedTeamReg}
              onRefresh={onRefresh}
            />
          )}
        </AnimatePresence>
    </div>
  );
};
