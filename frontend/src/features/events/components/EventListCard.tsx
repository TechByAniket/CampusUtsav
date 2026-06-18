import { 
  Calendar, Clock, MapPin, 
  ExternalLink, CheckCircle2, 
  Clock3, RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { EventSummary } from '@/types/event';

interface EventListCardProps {
  event: EventSummary;
  onClick?: () => void;
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

const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case 'APPROVED':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-100',
        icon: CheckCircle2,
        label: 'Approved'
      };
    case 'REVERTED':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-100',
        icon: RotateCcw,
        label: 'Reverted'
      };
    case 'HOD_APPROVED':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-100',
        icon: CheckCircle2,
        label: 'HOD Approved'
      };
    case 'SUBMITTED':
    default:
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-100',
        icon: Clock3,
        label: 'Pending'
      };
  }
};

export const EventListCard = ({ event, onClick }: EventListCardProps) => {
  const status = getStatusStyles(event.status);
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group relative bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer"
    >
      {/* Poster Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={event.posterUrl} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
           <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
             {event.eventCategory}
           </span>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 ${status.bg} border ${status.border} rounded-full flex items-center gap-1.5 shadow-sm`}>
           <StatusIcon size={12} className={status.text} />
           <span className={`text-[10px] font-black uppercase tracking-wider ${status.text}`}>
             {status.label}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Club */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
             <img src={event.clubLogoUrl} className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-100" alt="club" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{event.clubNameShortForm}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
            {event.title}
          </h3>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-2.5">
           <div className="flex items-center gap-2.5 text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                 <Calendar size={14} className="text-slate-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 leading-none mb-0.5">Date</span>
                 <span className="text-xs font-bold text-slate-700">{formatEventDate(event.startDate, event.endDate)}</span>
              </div>
           </div>

           <div className="flex items-center gap-2.5 text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                 <Clock size={14} className="text-slate-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 leading-none mb-0.5">Timing</span>
                 <span className="text-xs font-bold text-slate-700">{event.startTime?.slice(0, 5)} - {event.endTime?.slice(0, 5)}</span>
              </div>
           </div>

           <div className="flex items-center gap-2.5 text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                 <MapPin size={14} className="text-slate-400" />
              </div>
              <div className="flex flex-col overflow-hidden">
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 leading-none mb-0.5">Venue</span>
                 <span className="text-xs font-bold text-slate-700 truncate">{event.venue}</span>
              </div>
           </div>
        </div>

        {/* Action / View */}
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
           <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg">
              {event.eventType}
           </span>
           <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              View Details <ExternalLink size={12} />
           </div>
        </div>
      </div>

      {/* Decorative side accent */}
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${status.bg.replace('50', '500')} opacity-0 active:opacity-100 transition-opacity`} />
    </motion.div>
  );
};
