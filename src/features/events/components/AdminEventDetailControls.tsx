import { Link } from 'react-router-dom';
import { ShieldCheck, Users, BarChart3, ClipboardCheck } from 'lucide-react';

interface AdminEventDetailControlsProps {
  role: string | null;
}

export const AdminEventDetailControls: React.FC<AdminEventDetailControlsProps> = ({ role }) => {
  if (!role || role === 'ROLE_STUDENT') return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden">
      {/* Header banner */}
      <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50/60 border-b border-amber-100/50">
        <ShieldCheck size={14} className="text-amber-600" />
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
          Admin Controls
        </span>
      </div>
      <div className="p-5 space-y-2.5">
        <Link to="registrations" className="block">
          <button className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.97] flex items-center justify-center gap-2.5">
            <Users size={16} /> Registrations
          </button>
        </Link>
        <div className="grid grid-cols-2 gap-2.5">
          <Link to="analytics" className="block">
            <button className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm rounded-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-2">
              <BarChart3 size={14} /> Analytics
            </button>
          </Link>
          <Link to="attendance" className="block">
            <button className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-2">
              <ClipboardCheck size={14} /> Attendance
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
