import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, X, Calendar, Clock, MapPin,
  CheckCircle2, RotateCcw, Tag, Layers,
  AlertCircle, Image as ImageIcon, Send, Edit3, Globe, Lock, Phone,
  ArrowRight, Filter, MessageSquare, History,
  ChevronRight, Info, LayoutDashboard,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import {
  getAllPendingApprovalsByRole,
  approveEventByRole,
  revertEventByRole,
  getRevertedEventsByClub,
  getEventDetailsByEventId
} from '@/services/eventService';
import { OnePageCreateEventForm } from '@/features/events/components/CreateEventForm';
import { Button } from '@/components/ui/button';

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  eventCategory: string;
  eventType: string;
  venue: string;
  remarks: string | null;
  status: string;
  posterUrl: string;
  clubId: number;
  clubNameShortForm: string;
  description?: string;
  fees?: number;
}

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

export const InboxList = ({ mode = 'COLLEGE' }) => {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [actionRemark, setActionRemark] = useState("");

  useEffect(() => { loadEvents(); }, [mode]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = mode === 'CLUB' ? await getRevertedEventsByClub() : await getAllPendingApprovalsByRole();
      setEventList(data || []);
    } catch (err: any) { toast.error(err.message); }
    finally { setIsLoading(false); }
  };

  const openResubmitForm = async (eventId: number) => {
    try {
      if (!eventId) return toast.error("Invalid Event ID");
      const details = await getEventDetailsByEventId(eventId);
      setSelectedEvent({ ...details, id: eventId });
      setIsResubmitting(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAction = async (id: number, actionType: 'APPROVED' | 'REVERT', remarkContent = "") => {
    try {
      if (actionType === 'APPROVED') {
        await approveEventByRole(id, remarkContent || "Approved");
        toast.success("Event Approved Successfully!");
      } else if (actionType === 'REVERT') {
        if (!remarkContent) return toast.error("Remark is required for Revert.");
        await revertEventByRole(id, remarkContent);
        toast.success("Event Reverted to Club!");
      }
      setEventList(prev => prev.filter(e => e.id !== id));
      setSelectedEvent(null);
      setActionRemark("");
    } catch (err: any) { toast.error(err.message); }
  };

  const filteredEvents = useMemo(() => {
    return eventList.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toString().includes(searchQuery)
    );
  }, [eventList, searchQuery]);

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REVERTED': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'HOD_APPROVED': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'FACULTY1_APPROVED': return 'bg-violet-50 text-violet-600 border-violet-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="w-full space-y-10 pb-10">

        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
              {mode === 'CLUB' ? 'Action Required' : 'Inbox'}
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 tracking-wide">
              {mode === 'CLUB' ? 'Review and update your pending event revisions' : 'Streamline and approve institutional request workflows'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search by title or ID..."
                className="pl-11 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-indigo-300 w-full md:w-80 font-bold shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="px-5 py-3 bg-slate-100 rounded-2xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{filteredEvents.length} Pending Tasks</span>
            </div>
          </div>
        </header>

        {/* --- MAIN TABLE AREA --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 min-h-[500px]">

          {/* TOOLBAR */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                {mode === 'CLUB' ? 'Reverted Submissions' : 'Approval Inbox'}
              </h2>
            </div>
          </div>

          {/* TABLE VIEW */}
          <div className="overflow-x-auto no-scrollbar">
            {isLoading ? (
              <div className="py-40 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compiling Records...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-40 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                  <AlertCircle size={40} />
                </div>
                <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Inbox is clear. No pending items.</p>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-left">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Event Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Schedule & Logistics</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Current Progress</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-md shrink-0 relative">
                            {event.posterUrl ? (
                              <img src={event.posterUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-slate-800 uppercase text-sm truncate max-w-[280px] group-hover:text-indigo-600 transition-colors leading-tight">{event.title}</div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/50">#{event.id}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.clubNameShortForm || "CLUB"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2.5 text-[11px] font-black text-slate-700 uppercase tracking-tight">
                            <Calendar className="size-3 text-indigo-500" /> {formatEventDate(event.startDate, event.endDate)}
                          </div>
                          <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <MapPin className="size-3 text-slate-300" /> {event.venue?.slice(0, 25)}...
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border w-fit shadow-sm ${getStatusStyles(event.status)}`}>
                            {event.status.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            <Clock className="size-2.5 text-slate-300" /> {event.startTime?.slice(0, 5)}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                          >
                            Review Details <Info size={14} />
                          </button>
                          {mode === 'CLUB' && (
                            <button
                              onClick={() => openResubmitForm(event.id)}
                              className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-lg transition-all active:scale-95 group/btn flex items-center gap-2 shadow-xl shadow-slate-100"
                            >
                              Edit <Edit3 size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      {/* --- CAPSULE-LITE REVIEW MODAL --- */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full ${isResubmitting ? 'max-w-4xl' : 'max-w-lg'} bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-slate-200 my-auto`}
            >
              {/* Header: Clean & Compact */}
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                  <img src={selectedEvent.posterUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-slate-900 uppercase truncate leading-tight mb-1">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded-lg">ID #{selectedEvent.id}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${getStatusStyles(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => { setSelectedEvent(null); setIsResubmitting(false); setActionRemark(""); }} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>

              <div className="max-h-[85vh] overflow-y-auto no-scrollbar">
                {isResubmitting ? (
                  <OnePageCreateEventForm
                    initialData={selectedEvent as any}
                    isModal={true}
                    onClose={() => { setSelectedEvent(null); setIsResubmitting(false); loadEvents(); }}
                  />
                ) : (
                  <div className="p-10 space-y-10">
                    {/* KEY DETAILS IN A CAPSULE GRID */}
                    <div className="grid grid-cols-2 gap-4">
                      <CapsuleDetail icon={<Calendar size={14} />} label="Date" value={formatEventDate(selectedEvent.startDate, selectedEvent.endDate)} />
                      <CapsuleDetail icon={<Clock size={14} />} label="Time" value={selectedEvent.startTime?.slice(0, 5)} />
                      <CapsuleDetail icon={<MapPin size={14} />} label="Venue" value={selectedEvent.venue} />
                      <CapsuleDetail icon={<Tag size={14} />} label="Category" value={selectedEvent.eventCategory} />
                    </div>

                    {/* Description Strip */}
                    <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                      <p className="text-[12px] font-bold text-slate-500 leading-relaxed italic">
                        "{selectedEvent.description}"
                      </p>
                    </div>

                    {/* Previous Remarks (If any) */}
                    {selectedEvent.remarks && (
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-[1.5rem] flex gap-3 items-center">
                        <AlertCircle size={18} className="shrink-0 text-orange-500" />
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase text-orange-600 mb-0.5 tracking-widest">Previous Feedback</p>
                          <p className="text-[12px] font-black text-orange-900 leading-snug">"{selectedEvent.remarks}"</p>
                        </div>
                      </div>
                    )}

                    {/* Review Section */}
                    {mode !== 'CLUB' && (
                      <div className="space-y-6 pt-2">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase text-slate-400 ml-4 tracking-widest">Official Review Remarks</label>
                          <textarea
                            rows={2}
                            value={actionRemark}
                            onChange={(e) => setActionRemark(e.target.value)}
                            placeholder="Type your notes for the club admin..."
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.8rem] text-[13px] font-bold uppercase outline-none focus:border-indigo-500 transition-all text-slate-900"
                          />
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => handleAction(selectedEvent.id, 'REVERT', actionRemark)}
                            className="flex-1 py-4 bg-white border-2 border-orange-500 text-orange-600 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest hover:bg-orange-50 transition-all shadow-sm active:scale-95"
                          >
                            Revert
                          </button>
                          <button
                            onClick={() => handleAction(selectedEvent.id, 'APPROVED', actionRemark)}
                            className="flex-[2] py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100 active:scale-95"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    )}

                    {mode === 'CLUB' && (
                      <button
                        onClick={() => openResubmitForm(selectedEvent.id)}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                      >
                        <Edit3 size={18} className="mr-2 inline" /> Start Resubmission Flow
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CapsuleDetail = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center gap-4 transition-all hover:bg-white hover:shadow-sm">
    <div className="text-indigo-500 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1 tracking-wider">{label}</p>
      <p className="text-[12px] font-black text-slate-800 uppercase truncate">{value || 'N/A'}</p>
    </div>
  </div>
);