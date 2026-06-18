import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Sparkles, Calendar, MapPin, Clock, Tag } from 'lucide-react';
import { toast } from 'sonner';

import { getEventRegistrations, getEventDetailsByEventId } from '@/services/eventService';
import type { EventRegistrationsResponse, AdminEventDetail } from '@/types/event';
import { RegistrationInfoList } from '../components/RegistrationInfoList';

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

export const EventRegistrationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<EventRegistrationsResponse | null>(null);
  const [event, setEvent] = useState<AdminEventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [regData, eventData] = await Promise.all([
        getEventRegistrations(id),
        getEventDetailsByEventId(id)
      ]);
      setRegistrations(regData);
      setEvent(eventData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Synchronizing Intelligence...</p>
      </div>
    );
  }

  if (!registrations || !event) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <Sparkles size={40} className="text-slate-200" />
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Intelligence Lost</h2>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase">Go Back</button>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-slate-50/30 pt-0 pb-10 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 -mt-6">
      <div className="max-w-[1550px] mx-auto space-y-12 relative">
        
        {/* Navigation & Informative Header (Floating) */}
        <div className="relative z-[100]">
              <button 
                onClick={() => navigate(-1)}
                className="absolute -top-6 left-0 group flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-100 transition-all shadow-sm">
                  <ChevronLeft size={18} className="text-indigo-600" />
                </div>
                <div className="flex flex-col items-start opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                   <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Return to Console</p>
                </div>
              </button>
        </div>

        {/* Informative Header Card */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10 pt-4">
                <div className="flex flex-col md:flex-row md:items-center gap-6 min-w-0">
                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight truncate">
                            {event.title} <span className="text-indigo-600 ml-2">Registrations</span>
                        </h1>
                        
                        {/* Event Quick Details Bar */}
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4">
                            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                                <Calendar size={13} className="text-indigo-500" />
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{formatEventDate(event.startDate, event.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                                <Clock size={13} className="text-indigo-500" />
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{event.startTime?.slice(0, 5)} - {event.endTime?.slice(0, 5)}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                                <MapPin size={13} className="text-indigo-500" />
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight truncate max-w-[250px]">{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 border border-indigo-700 rounded-full shadow-sm">
                                <Tag size={13} className="text-indigo-100" />
                                <span className="text-[11px] font-black text-white uppercase tracking-tight">{event.eventCategory}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Poster (Desktop Only) */}
                <div className="hidden lg:block shrink-0">
                    <div className="w-48 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500 group">
                        <img 
                            src={event.posterUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Main Interface */}
        <div className="pt-2">
            <RegistrationInfoList 
              registrations={registrations} 
              isTeamEvent={event.teamEvent} 
              onRefresh={fetchData}
            />
        </div>
      </div>
    </section>
  );
};
