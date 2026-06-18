import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import type { AdminEventDetail } from '@/types/event';

interface SharedEventDetailContactProps {
  event: AdminEventDetail;
}

export const SharedEventDetailContact: React.FC<SharedEventDetailContactProps> = ({ event }) => {
  const contacts = Object.entries(event.contactDetails || {});
  if (contacts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
    >
      {/* Header banner */}
      <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50/60 border-b border-rose-100/50">
        <Phone size={14} className="text-rose-600" />
        <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
          Need Help?
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Please contact the event organizers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contacts.map(([name, info]: [string, any]) => (
            <div key={name} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-1.5 hover:bg-slate-100/50 transition-colors">
              <p className="text-sm font-bold text-slate-900">{name}</p>
              <div className="flex flex-col gap-1 min-w-0">
                {info.email && (
                  <a href={`mailto:${info.email}`} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors truncate">
                    <Mail size={12} className="shrink-0" />
                    <span className="truncate">{info.email}</span>
                  </a>
                )}
                {info.phone && (
                  <a href={`tel:${info.phone}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold transition-colors truncate">
                    <Phone size={12} className="shrink-0" />
                    <span className="truncate">{info.phone}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
