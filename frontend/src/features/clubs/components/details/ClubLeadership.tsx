import React from 'react';
import { Shield, UserCircle, Mail, Phone, GraduationCap } from 'lucide-react';

interface ClubLeadershipProps {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  facultyName: string | null;
  facultyEmail: string | null;
}

export const ClubLeadership: React.FC<ClubLeadershipProps> = ({ 
  adminName, 
  adminEmail, 
  adminPhone, 
  facultyName, 
  facultyEmail 
}) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-bl-[4rem] transition-transform group-hover:scale-110" />
       <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 border border-amber-100/50"><Shield size={16} /></div>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Leadership</h3>
          </div>
          
          <div className="space-y-4">
             {/* Admin Card */}
             <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-indigo-100">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm"><UserCircle size={20}/></div>
                   <div>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">Admin</p>
                      <h4 className="text-[12px] font-bold text-slate-900 uppercase mt-1 tracking-tight">{adminName}</h4>
                   </div>
                </div>
                <p className="text-[10px] font-medium text-slate-400 truncate pl-11">{adminEmail}</p>
             </div>

             {/* Faculty Card */}
             {facultyName && (
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-emerald-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm"><GraduationCap size={20}/></div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Mentor</p>
                        <h4 className="text-[12px] font-bold text-slate-900 uppercase mt-1 tracking-tight">{facultyName}</h4>
                    </div>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 truncate pl-11">{facultyEmail}</p>
                </div>
             )}
             
             {/* Action Buttons */}
             <div className="grid grid-cols-2 gap-2 pt-2">
                <a href={`mailto:${adminEmail}`} className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95">
                  <Mail size={12}/> Message
                </a>
                <a href={`tel:${adminPhone}`} className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                  <Phone size={12}/> Call
                </a>
             </div>
          </div>
       </div>
    </div>
  );
};

