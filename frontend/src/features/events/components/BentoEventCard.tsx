import React from 'react'
import { CalendarDays, MapPin, ArrowRight } from "lucide-react"
import type { Event } from "@/types/event"
import { motion } from 'framer-motion'

// Reusing status styling logic for consistency
const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case 'UPCOMING':
      return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Live Soon' };
    case 'ONGOING':
      return { bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-100', label: 'In Progress' };
    case 'COMPLETED':
      return { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200', label: 'Finished' };
    default:
      return { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100', label: 'Pending' };
  }
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

export const BentoEventCard: React.FC<Event> = (event) => {
  const statusConfig = getStatusStyles(event.status);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Poster Media Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={event.posterUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
           <div className={`flex items-center gap-1.5 px-3 py-1.5 ${statusConfig.bg} ${statusConfig.text} backdrop-blur-md rounded-full shadow-lg border border-white/20`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.text.replace('text-', 'bg-')} animate-pulse`} />
              <span className="text-[9px] font-black uppercase tracking-widest">{statusConfig.label}</span>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-6">
        <div className="space-y-3">
           <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-indigo-100/50">
                {event.eventCategory}
              </span>
              <span className="text-[10px] font-bold text-slate-400">•</span>
              <span className="text-[10px] font-bold text-slate-400 truncate">{event.club.name}</span>
           </div>

           <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 uppercase tracking-tight">
             {event.title}
           </h3>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
           <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                 <CalendarDays size={12} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Schedule</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700">
                {formatEventDate(event.startDate, event.endDate)}
              </p>
           </div>
           
           <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                 <MapPin size={12} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Venue</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700 truncate">
                {event.venue}
              </p>
           </div>
        </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between">
           <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                 CU
              </div>
           </div>
           <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
              <span>View Intelligence</span>
              <ArrowRight size={14} />
           </div>
        </div>
      </div>
    </motion.div>
  )
}
