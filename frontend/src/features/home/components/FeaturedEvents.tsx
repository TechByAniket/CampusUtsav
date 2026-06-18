import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Zap, Target, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  posterUrl: string;
  eventCategory: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
}

interface FeaturedEventsProps {
  events: Event[];
}

const formatEventDate = (startDate?: string, endDate?: string) => {
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

const getCategoryIcon = (category: string) => {
  switch (category.toUpperCase()) {
    case 'CULTURAL': return <Palette size={14} />;
    case 'TECHNICAL': return <Zap size={14} />;
    case 'SPORTS': return <Target size={14} />;
    default: return <Star size={14} />;
  }
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <section className="mb-24">
      {/* Spotlight Header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
           <Star size={20} className="fill-indigo-600" />
        </div>
        <div>
           <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">
             Campus Spotlight
           </h2>
           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60 leading-none mt-1">Intelligence Pick v2.4</p>
        </div>
      </div>

      {/* CASE 1: Single Featured Event (Showcase Layout) */}
      {events.length === 1 && (
        <Link to={`/explore-events/events/${events[0].id}`}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex flex-col md:flex-row items-center gap-10 bg-slate-900 p-8 lg:p-12 rounded-[56px] border border-slate-800 shadow-2xl overflow-hidden cursor-pointer"
          >
            {/* Glossy Background Accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] -translate-y-1/2 translate-x-1/4 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 blur-[100px] translate-y-1/2 -translate-x-1/4 rounded-full pointer-events-none" />

            <div className="relative w-full md:w-[420px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl shrink-0 border-[6px] border-slate-800/80 group-hover:scale-[1.02] transition-transform duration-700">
              <img src={events[0].posterUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={events[0].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="relative space-y-8 flex-1">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 w-fit text-white">
                 {getCategoryIcon(events[0].eventCategory)}
                 <span className="font-black uppercase text-[10px] tracking-widest">
                   {events[0].eventCategory} Spotlight
                 </span>
              </div>

              <h3 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                {events[0].title}
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center gap-8 border-l-2 border-indigo-500/30 pl-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operations Phase</p>
                    <p className="text-xl font-black text-white">{events[0].venue}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scheduled Date</p>
                    <p className="text-xl font-black text-white">{formatEventDate(events[0].startDate, events[0].endDate)}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <button className="h-16 px-10 bg-white text-slate-950 font-black rounded-3xl hover:bg-indigo-50 transition-all shadow-xl active:scale-95 uppercase text-xs tracking-[0.2em] flex items-center gap-4 group/btn">
                    Register Now
                    <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                 </button>
              </div>
            </div>
          </motion.div>
        </Link>
      )}

      {/* CASE 2: Two+ Featured Events (Grid Lookbook Layout) */}
      {events.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event, idx) => (
            <Link to={`/explore-events/events/${event.id}`} key={idx}>
              <motion.div 
                whileHover={{ y: -12 }}
                className="group relative bg-white p-6 rounded-[48px] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col sm:flex-row gap-8 items-center cursor-pointer"
              >
                <div className="w-full sm:w-48 aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg shrink-0 border-[6px] border-slate-50 transition-transform duration-700 group-hover:scale-105">
                  <img src={event.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                </div>
                <div className="space-y-5 flex-1 pr-4">
                  <div className={`flex items-center gap-2 px-3 py-1.5 w-fit rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${idx % 2 === 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    {getCategoryIcon(event.eventCategory)}
                    {event.eventCategory}
                  </div>
                  <h3 className="text-3xl font-black leading-[1.1] text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>📍 {event.venue}</span>
                    <span className="opacity-30">•</span>
                    <span>{formatEventDate(event.startDate, event.endDate)}</span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};