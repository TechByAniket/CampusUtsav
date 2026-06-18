import { motion } from 'framer-motion';
import { Building2, MapPin } from 'lucide-react';

export const SharedProfileCollegeAffiliation = ({ profileData }: { profileData: any }) => {
  const collegeName = profileData.college?.name || profileData.collegeName;
  if (!collegeName) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
    >
      <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-50 to-indigo-50/60 border-b border-violet-100/50">
        <Building2 size={14} className="text-violet-600" />
        <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
          College Affiliation
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4">
          {profileData.college?.logoUrl ? (
             <img src={profileData.college.logoUrl} alt={profileData.college?.shortForm || 'College Logo'} className="w-12 h-12 object-contain rounded-lg shrink-0" />
          ) : (
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
              <Building2 className="w-6 h-6 text-slate-400" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-slate-800 leading-tight truncate">
              {collegeName}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                 {profileData.college?.shortForm || 'AFFILIATED'}
              </span>
              {profileData.college?.city && (
                <div className="flex items-center gap-1 text-slate-400 truncate">
                  <MapPin size={10} className="shrink-0"/>
                  <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                    {profileData.college.city}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
