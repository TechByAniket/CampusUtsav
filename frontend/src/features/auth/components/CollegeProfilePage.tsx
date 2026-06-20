import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, User, Mail, Phone, Globe, MapPin, 
  CheckCircle2, AlertCircle, Building2,
  Info, Share2, ShieldCheck, Contact,
  Briefcase, School, Award, Hash, BookOpen, UserCircle
} from 'lucide-react';
import { getMyCollegeProfileDetails } from '@/services/collegeService';
import { toast } from 'sonner';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

// ─── MAIN COMPONENT ───
const CollegeProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getMyCollegeProfileDetails();
        setProfileData(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load college profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pt-24 min-h-screen">
        <PageSkeleton layout="dashboard" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-transparent font-sans">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm">
          <Info size={32} />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Profile Not Found</h2>
          <p className="text-sm text-slate-500">Could not retrieve college profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      <CollegeProfileHero profileData={profileData} />

      <div className="relative z-20 max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* ─── LEFT COLUMN (~65%) ─── */}
          <div className="lg:col-span-8 space-y-7">
            <CollegeProfileOverview profileData={profileData} />
            <CollegeProfileContact profileData={profileData} />
          </div>

          {/* ─── RIGHT COLUMN (~35%) ─── */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <SharedProfileAccountInfo profileData={profileData} />
            <CollegeProfileLocation profileData={profileData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfilePage;


// ─── HELPER COMPONENTS ───

const CollegeProfileHero = ({ profileData }: { profileData: any }) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-indigo-100/90 via-indigo-50/30 to-indigo-100/70 border-b border-slate-200/60 rounded-b-[32px] shadow-[0_15px_45px_rgba(15,23,42,0.15)] overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-indigo-200/25 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-violet-200/20 rounded-full blur-[100px] translate-y-1/3" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10 pt-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
          <div className="lg:col-span-8 min-w-0">
            <div className="flex items-center gap-5">
              {profileData.logoUrl ? (
                <img src={profileData.logoUrl} alt={profileData.name} className="w-20 h-20 md:w-24 md:h-24 rounded-[1.25rem] object-cover shrink-0 border border-white/50 shadow-sm" />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.25rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <School className="w-10 h-10 text-indigo-400" />
                </div>
              )}
              <div className="min-w-0 space-y-1">
                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                  {profileData.name}
                </h1>
                <p className="text-slate-500 text-xs md:text-sm font-semibold flex items-center gap-2 mt-1.5">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border border-indigo-200/50">
                    {profileData.shortForm || "COLLEGE"}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border border-slate-200 flex items-center gap-1">
                    <Hash size={10} /> ID: {profileData.id}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:text-right">
             <div className="flex items-center lg:justify-end gap-3 pt-2 lg:pt-0">
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 shadow-sm">
                 <span className="w-2 h-2 rounded-full bg-emerald-400" />
                 <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Active Profile</span>
               </div>
               <button
                 onClick={handleShare}
                 className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-md hover:shadow-lg transition-all"
               >
                 <Share2 size={16} />
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollegeProfileOverview = ({ profileData }: { profileData: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: 0.1 }}
    className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
  >
    <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50/60 border-b border-blue-100/50">
      <Building2 size={14} className="text-blue-600" />
      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
        Institution Information
      </span>
    </div>
    <div className="p-6 md:p-8 space-y-4">
      <div className="flex items-center justify-between py-1 gap-3 min-w-0">
        <span className="text-sm font-medium text-slate-500 shrink-0">Affiliation</span>
        <span className="text-sm font-bold text-slate-900 truncate">{profileData.affiliation || '---'}</span>
      </div>
      <div className="flex items-center justify-between py-1 gap-3 min-w-0">
        <span className="text-sm font-medium text-slate-500 shrink-0">Website</span>
        <span className="text-sm font-bold text-slate-900 truncate">
          {profileData.websiteUrl ? (
            <a href={profileData.websiteUrl.startsWith('http') ? profileData.websiteUrl : `https://${profileData.websiteUrl}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              {profileData.websiteUrl}
            </a>
          ) : (
             <span className="text-slate-400">---</span>
          )}
        </span>
      </div>
    </div>
  </motion.div>
);

const CollegeProfileContact = ({ profileData }: { profileData: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: 0.2 }}
    className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
  >
    <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50/60 border-b border-rose-100/50">
      <Contact size={14} className="text-rose-600" />
      <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
        Contact Information
      </span>
    </div>
    <div className="p-6 md:p-8 space-y-6">
      
      {/* Admin Head */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Admin Head</p>
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2 hover:bg-slate-100/50 transition-colors">
          <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><UserCircle size={14} className="text-slate-400"/> {profileData.adminName}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-1">
            <a href={`mailto:${profileData.email}`} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
              <Mail size={12} /> {profileData.email}
            </a>
            <a href={`tel:${profileData.phone}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold transition-colors">
              <Phone size={12} /> {profileData.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

import { SharedProfileAccountInfo } from './SharedProfileAccountInfo';
const CollegeProfileLocation = ({ profileData }: { profileData: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
    >
      <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-50 to-indigo-50/60 border-b border-violet-100/50">
        <MapPin size={14} className="text-violet-600" />
        <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
          Location
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
            <MapPin className="w-6 h-6 text-slate-400" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-slate-800 leading-tight truncate">
              {profileData.city}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                 {`${profileData.district}, ${profileData.state}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
