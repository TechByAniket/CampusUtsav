import { motion } from 'framer-motion';
import { Shapes, GraduationCap } from 'lucide-react';
import type { AdminEventDetail } from '@/types/event';

interface AdminEventDetailOverviewProps {
  event: AdminEventDetail;
}

export const AdminEventDetailOverview: React.FC<AdminEventDetailOverviewProps> = ({ event }) => {
  const branches = Object.values(event.allowedBranches || {});
  const years = Object.values(event.allowedYears || {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
    >
      {/* About Section */}
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-5">Overview</h2>
        <p className="text-slate-600 text-[15px] leading-[1.9] whitespace-pre-line font-medium">
          {event.description}
        </p>
      </div>

      <div className="h-px bg-slate-100 mx-6 md:mx-8" />

      {/* Demographics */}
      <div className="p-6 md:p-8 space-y-5">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shapes size={13} /> Allowed Branches
          </p>
          <div className="flex flex-wrap gap-2">
            {branches.length > 0 ? branches.map((b, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200/80 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors cursor-default">
                {b}
              </span>
            )) : (
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100/50">All Branches Eligible</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <GraduationCap size={13} /> Allowed Years
          </p>
          <div className="flex flex-wrap gap-2">
            {years.length > 0 ? years.map((y, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200/80 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors cursor-default">
                {y}
              </span>
            )) : (
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100/50">All Years Eligible</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
