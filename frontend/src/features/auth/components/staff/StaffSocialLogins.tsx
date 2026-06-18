import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export const StaffSocialLogins: React.FC = () => {
  return (
    <div className="flex gap-3 mb-6">
      <button
        type="button"
        className="flex-1 h-[44px] flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all active:scale-[0.98]"
      >
        <FcGoogle size={18} />
        <span className="hidden sm:inline">Google</span>
      </button>
      <button
        type="button"
        className="flex-1 h-[44px] flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all active:scale-[0.98]"
      >
        <FaFacebook size={18} className="text-blue-600" />
        <span className="hidden sm:inline">Facebook</span>
      </button>
    </div>
  );
};
