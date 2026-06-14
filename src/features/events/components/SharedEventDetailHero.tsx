import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ChevronLeft, Calendar, Clock, MapPin, 
  CreditCard, Users2, UserCircle2, Share2 
} from 'lucide-react';
import type { AdminEventDetail } from '@/types/event';

interface SharedEventDetailHeroProps {
  event: AdminEventDetail;
  statusConfig: {
    bg: string;
    text: string;
    dot: string;
    label: string;
    heroBg: string;
    heroText: string;
  };
  isPublic?: boolean;
}

const fmtDate = (s: string, e: string) => {
  if (!s) return '';
  const d1 = new Date(s);
  if (!e || s === e) return isNaN(d1.getTime()) ? s : d1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const d2 = new Date(e);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return `${s} – ${e}`;
  return `${d1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${d2.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
};

export const SharedEventDetailHero: React.FC<SharedEventDetailHeroProps> = ({ event, statusConfig, isPublic }) => {
  const navigate = useNavigate();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-100/90 via-blue-50/30 to-blue-100/70 border-b border-slate-200/60 overflow-hidden rounded-b-[32px] shadow-[0_15px_45px_rgba(15,23,42,0.15)]">
      {/* Decorative subtle flow bubbles */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-blue-200/25 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-sky-200/20 rounded-full blur-[100px] translate-y-1/3" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10 pt-4 pb-7">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-semibold tracking-wide uppercase mb-5 group transition-colors"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Console
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
          {/* 1. Title/Logo row - order-1 */}
          <div className="lg:col-span-8 order-1 min-w-0">
            <div className="flex items-center gap-4">
              {event.club && (
                <img src={event.club.logoUrl} alt={event.club.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-none tracking-tight">
                  {event.title}
                </h1>
                {event.club && (
                  <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                    By <span className="text-slate-800 font-bold">{event.club.shortForm} - {event.club.name}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Poster - order-2 on mobile, spans right column on desktop */}
          <div className="lg:col-span-4 order-2 lg:order-last lg:row-start-1 lg:col-start-9 lg:row-span-3 shrink-0 w-[190px] sm:w-[220px] lg:w-[240px] mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[1/1.4] rounded-2xl overflow-hidden border border-slate-200 shadow-[0_20px_45px_rgba(0,0,0,0.22)] bg-slate-800 group"
            >
              <img
                src={event.posterUrl}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>

          {/* 3. Key Details - order-3 */}
          <div className="lg:col-span-8 order-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 pt-2">
              {[
                { icon: Calendar,    value: fmtDate(event.startDate, event.endDate) },
                { icon: Clock,       value: `${event.startTime?.slice(0,5) || '--:--'} – ${event.endTime?.slice(0,5) || '--:--'}` },
                { icon: MapPin,      value: event.venue },
                { icon: CreditCard,  value: event.fees === 0 ? "FREE" : `₹${event.fees}` },
                { icon: Users2,      value: `${event.maxParticipants} slots` },
                { icon: UserCircle2, value: event.teamEvent ? `Team (${event.minTeamSize}–${event.maxTeamSize})` : "Individual" },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <d.icon size={20} className="text-indigo-600 shrink-0" />
                  <span className="text-xs md:text-sm font-extrabold text-slate-800 truncate">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Status Bar - order-4 */}
          <div className="lg:col-span-8 order-4">
            <div className="flex items-center gap-3 pt-2">
              {!isPublic && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg} border border-slate-200/50 shadow-sm`}>
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${statusConfig.text}`}>{statusConfig.label}</span>
                </div>
              )}
              {event.registrationDeadline && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-bold text-rose-700 uppercase tracking-wider shadow-sm">
                  <Clock size={11} className="text-rose-500" />
                  <span>Deadline: {event.registrationDeadline}</span>
                </div>
              )}
              <button
                onClick={handleShare}
                className="ml-auto w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-md hover:shadow-lg transition-all"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
