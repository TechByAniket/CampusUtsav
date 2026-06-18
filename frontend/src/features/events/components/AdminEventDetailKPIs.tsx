import { motion } from 'framer-motion';
import { 
  ClipboardCheck, Users2, UserCheck, Activity, UserMinus, 
  UserCircle2, CreditCard, Shapes, GraduationCap 
} from 'lucide-react';
import type { AdminEventDetail } from '@/types/event';

interface AdminEventDetailKPIsProps {
  event: AdminEventDetail;
  showAnalytics: boolean;
  analytics: any;
}

const kpiColors = [
  { bg: "from-indigo-50/60 to-indigo-100/30 border-indigo-100/40", text: "text-indigo-600", label: "text-indigo-400" },
  { bg: "from-emerald-50/60 to-emerald-100/30 border-emerald-100/40", text: "text-emerald-600", label: "text-emerald-400" },
  { bg: "from-cyan-50/60 to-cyan-100/30 border-cyan-100/40", text: "text-cyan-600", label: "text-cyan-400" },
  { bg: "from-amber-50/60 to-amber-100/30 border-amber-100/40", text: "text-amber-600", label: "text-amber-400" },
  { bg: "from-rose-50/60 to-rose-100/30 border-rose-100/40", text: "text-rose-600", label: "text-rose-400" },
];

export const AdminEventDetailKPIs: React.FC<AdminEventDetailKPIsProps> = ({ event, showAnalytics, analytics }) => {
  const kpis = showAnalytics && analytics ? [
    { label: "Registrations", val: analytics.totalRegistrations ?? 0, icon: ClipboardCheck },
    { label: "Participants", val: analytics.totalParticipants ?? 0, icon: Users2 },
    { label: "Attendance", val: analytics.totalAttendance ?? 0, icon: UserCheck },
    { label: "Turnout Rate", val: `${analytics.attendanceRate ?? 0}%`, icon: Activity },
    { label: "Drop-Off", val: `${analytics.dropOffRate ?? 0}%`, icon: UserMinus },
  ] : [
    { label: "Capacity", val: event.maxParticipants, icon: Users2 },
    { label: "Team Size", val: event.teamEvent ? `${event.minTeamSize}–${event.maxTeamSize}` : "Solo", icon: UserCircle2 },
    { label: "Entry Fee", val: event.fees === 0 ? "FREE" : `₹${event.fees}`, icon: CreditCard },
    { label: "Branches", val: Object.keys(event.allowedBranches || {}).length || "All", icon: Shapes },
    { label: "Years", val: Object.keys(event.allowedYears || {}).length || "All", icon: GraduationCap },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-4"
    >
      {kpis.map((kpi, i) => {
        const col = kpiColors[i % kpiColors.length];
        return (
          <div key={i} className={`bg-gradient-to-br ${col.bg} rounded-2xl border p-4 shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 group text-center flex flex-col justify-between items-center min-h-[110px]`}>
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200/20 shadow-sm group-hover:scale-105 transition-transform text-slate-800">
              <kpi.icon size={16} />
            </div>
            <div className="w-full min-w-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">{kpi.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-none truncate">{kpi.val}</p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};
