import React from 'react';
import { Globe, Instagram, Linkedin, CheckCircle } from 'lucide-react';

interface ClubSocialConnectProps {
  instagramUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
}

export const ClubSocialConnect: React.FC<ClubSocialConnectProps> = ({ 
  instagramUrl, 
  linkedInUrl, 
  websiteUrl 
}) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
       <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100"><Globe size={16} /></div>
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Connect</h3>
       </div>
       
       <div className="grid grid-cols-3 gap-2">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="aspect-square flex flex-col items-center justify-center gap-1 bg-rose-50 text-rose-600 rounded-2xl group hover:bg-rose-600 hover:text-white transition-all shadow-sm">
               <Instagram size={18} className="group-hover:scale-110 transition-transform" />
               <span className="text-[7px] font-black uppercase tracking-tight">Insta</span>
            </a>
          )}
          {linkedInUrl && (
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="aspect-square flex flex-col items-center justify-center gap-1 bg-blue-50 text-blue-700 rounded-2xl group hover:bg-blue-700 hover:text-white transition-all shadow-sm">
               <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
               <span className="text-[7px] font-black uppercase tracking-tight">LinkedIn</span>
            </a>
          )}
          {websiteUrl && (
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="aspect-square flex flex-col items-center justify-center gap-1 bg-slate-100 text-slate-700 rounded-2xl group hover:bg-slate-900 hover:text-white transition-all shadow-sm">
               <Globe size={18} className="group-hover:scale-110 transition-transform" />
               <span className="text-[7px] font-black uppercase tracking-tight">Web</span>
            </a>
          )}
       </div>
       
       <div className="mt-6 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
          <p className="text-[9px] font-black text-emerald-600 uppercase flex items-center justify-center gap-1.5 tracking-widest">
            <CheckCircle size={12} /> Account Verified
          </p>
       </div>
    </div>
  );
};

