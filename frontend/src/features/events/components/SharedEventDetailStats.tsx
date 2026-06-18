import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Globe, Instagram, Linkedin, FileText, Lock, Download, ArrowUpRight } from 'lucide-react';
import type { AdminEventDetail } from '@/types/event';

interface SharedEventDetailStatsProps {
  event: AdminEventDetail;
  statusConfig: {
    bg: string;
    text: string;
    dot: string;
    label: string;
    heroBg: string;
    heroText: string;
  };
  role: string | null;
  isPublic?: boolean;
}

export const SharedEventDetailStats: React.FC<SharedEventDetailStatsProps> = ({ event, statusConfig, role, isPublic }) => {
  const publicFiles = Object.entries(event.publicAttachments || {});
  const privateFiles = isPublic ? [] : Object.entries(event.privateAttachments || {});

  // Extract social links if they are already present in the response object
  const instagramUrl = (event as any).instagramUrl || (event.club as any)?.instagramUrl;
  const linkedInUrl = (event as any).linkedinUrl || (event as any).linkedInUrl || (event.club as any)?.linkedInUrl || (event.club as any)?.linkedinUrl;
  const websiteUrl = (event as any).websiteUrl || (event.club as any)?.websiteUrl;

  return (
    <>
      {/* Quick Stats / Event Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
      >
        {/* Deadline banner */}
        <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100/50">
          <Clock size={14} className="text-emerald-600" />
          <span className="text-xs font-extrabold uppercase tracking-wider">
            <span className="text-slate-500">Deadline:</span> <span className="text-emerald-600">{event.registrationDeadline || "TBA"}</span>
          </span>
        </div>

        <div className="p-5 space-y-3">
          {[
            { label: "Category", value: event.eventCategory },
            { label: "Type", value: event.eventType ? event.eventType.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "" },
            { label: "Participation", value: event.teamEvent ? `Team (${event.minTeamSize}–${event.maxTeamSize})` : "Individual" },
            { label: "Entry Fee", value: event.fees === 0 ? "FREE" : `₹${event.fees}` },
            { label: "Status", value: event.status, isStatus: true },
            ...(event.club ? [{
              label: "Organized By",
              value: event.club.name,
              isLink: (role === 'ROLE_COLLEGE' || role === 'ROLE_PRINCIPAL'),
              to: `/college-dashboard/clubs/${event.club.id}`
            }] : [])
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-1 gap-3 min-w-0">
              <span className="text-sm font-medium text-slate-500 shrink-0">{row.label}</span>
              {row.isStatus ? (
                <span className={`flex items-center gap-1.5 text-sm font-bold ${statusConfig.heroText} shrink-0`}>
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                  {statusConfig.label}
                </span>
              ) : row.isLink ? (
                <Link to={row.to || '#'} className="inline-flex items-center gap-0.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline truncate text-right transition-colors">
                  <ArrowUpRight size={14} className="shrink-0" />
                  {row.value}
                </Link>
              ) : (
                <span className="text-sm font-bold text-slate-900 truncate text-right">{row.value}</span>
              )}
            </div>
          ))}

          {event.club && (websiteUrl || instagramUrl || linkedInUrl) && (
            <>
              <div className="h-px bg-slate-100 my-2" />
              <div className="flex items-center justify-center gap-6 pt-2">
                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-500 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all duration-200"
                    title="Website"
                  >
                    <Globe size={20} className="stroke-[2.5]" />
                  </a>
                )}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-600 hover:text-pink-700 hover:scale-110 active:scale-95 transition-all duration-200"
                    title="Instagram"
                  >
                    <Instagram size={20} className="stroke-[2.5]" />
                  </a>
                )}
                {linkedInUrl && (
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:scale-110 active:scale-95 transition-all duration-200"
                    title="LinkedIn"
                  >
                    <Linkedin size={20} className="stroke-[2.5]" />
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Event Documents — Separate Card */}
      {(publicFiles.length > 0 || privateFiles.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
        >
          {/* Header banner */}
          <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-50 to-indigo-50/60 border-b border-violet-100/50">
            <FileText size={14} className="text-violet-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
              Event Documents
            </span>
            <span className="ml-1.5 text-[10px] font-bold text-violet-500 bg-violet-100/60 px-2 py-0.5 rounded-full">
              {publicFiles.length + privateFiles.length}
            </span>
          </div>

          <div className="p-5 space-y-2.5">
            {publicFiles.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-violet-50 hover:shadow-sm transition-all group/f">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 truncate group-hover/f:text-violet-700 transition-colors">{name}</span>
                </div>
                <Download size={14} className="text-slate-300 group-hover/f:text-violet-500 shrink-0 transition-colors" />
              </a>
            ))}
            {privateFiles.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:shadow-sm transition-all group/f">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Lock size={16} />
                  </div>
                  <div className="truncate">
                    <span className="text-sm font-semibold text-slate-700 truncate group-hover/f:text-rose-700 transition-colors block">{name}</span>
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Restricted</span>
                  </div>
                </div>
                <Download size={14} className="text-slate-300 group-hover/f:text-rose-500 shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};
