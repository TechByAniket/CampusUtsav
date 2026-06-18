import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertCircle, Globe, Instagram, Linkedin } from 'lucide-react';

export const SharedProfileAccountInfo = ({ profileData, type = 'GENERAL' }: { profileData: any, type?: 'STAFF' | 'CLUB' | 'GENERAL' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: 0.15 }}
    className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
  >
    <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100/50">
      <ShieldCheck size={14} className="text-emerald-600" />
      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
        Account Status
      </span>
    </div>
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between py-1 gap-3 min-w-0">
        <span className="text-sm font-medium text-slate-500 shrink-0">{type === 'STAFF' ? 'Profile ID' : 'Username'}</span>
        <span className="text-sm font-bold text-slate-900 truncate bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
          {type === 'STAFF' ? `STF-${profileData.id}` : profileData.username}
        </span>
      </div>
      
      {type === 'STAFF' ? (
        <div className="flex items-center justify-between py-1 gap-3 min-w-0">
          <span className="text-sm font-medium text-slate-500 shrink-0">Official Email</span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            <CheckCircle2 size={12} /> Verified
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between py-1 gap-3 min-w-0">
          <span className="text-sm font-medium text-slate-500 shrink-0">Email Verified</span>
          {profileData.emailVerified ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <CheckCircle2 size={12} /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              <AlertCircle size={12} /> Pending
            </span>
          )}
        </div>
      )}

      {type === 'STAFF' ? (
        <div className="flex items-center justify-between py-1 gap-3 min-w-0">
          <span className="text-sm font-medium text-slate-500 shrink-0">Phone Number</span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            <CheckCircle2 size={12} /> Verified
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between py-1 gap-3 min-w-0">
          <span className="text-sm font-medium text-slate-500 shrink-0">Phone Verified</span>
          {profileData.phoneVerified ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <CheckCircle2 size={12} /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              <AlertCircle size={12} /> Pending
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between py-1 gap-3 min-w-0">
        <span className="text-sm font-medium text-slate-500 shrink-0">{type === 'STAFF' ? 'Active Since' : type === 'CLUB' ? 'Joined' : 'Registered On'}</span>
        <span className="text-sm font-bold text-slate-900">{new Date(profileData.createdAt).toLocaleDateString()}</span>
      </div>

      {type === 'CLUB' && (profileData.websiteUrl || profileData.instagramUrl || profileData.linkedInUrl) && (
        <>
          <div className="h-px bg-slate-100 my-3" />
          <div className="flex items-center justify-center gap-6 pt-1 pb-2">
            {profileData.websiteUrl && (
              <a href={profileData.websiteUrl.startsWith('http') ? profileData.websiteUrl : `https://${profileData.websiteUrl}`} target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all duration-200">
                <Globe size={20} className="stroke-[2.5]" />
              </a>
            )}
            {profileData.instagramUrl && (
              <a href={profileData.instagramUrl.startsWith('http') ? profileData.instagramUrl : `https://instagram.com/${profileData.instagramUrl}`} target="_blank" rel="noreferrer" className="text-pink-600 hover:text-pink-700 hover:scale-110 active:scale-95 transition-all duration-200">
                <Instagram size={20} className="stroke-[2.5]" />
              </a>
            )}
            {profileData.linkedInUrl && (
              <a href={profileData.linkedInUrl.startsWith('http') ? profileData.linkedInUrl : `https://linkedin.com/company/${profileData.linkedInUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:scale-110 active:scale-95 transition-all duration-200">
                <Linkedin size={20} className="stroke-[2.5]" />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  </motion.div>
);
