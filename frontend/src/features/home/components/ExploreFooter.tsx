import React from 'react';

export const ExploreFooter: React.FC = () => {
  return (
    <footer className="pt-32 pb-16 flex flex-col items-center justify-center space-y-6">
       <div className="text-center space-y-2">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Campus Utsav Event Management System</p>
          <div className="flex items-center justify-center gap-3">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2026 Campus Utsav Team</span>
             <span className="w-2 h-2 bg-slate-100 rounded-full" />
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Official Institutional Portal</span>
          </div>
       </div>
    </footer>
  );
};
