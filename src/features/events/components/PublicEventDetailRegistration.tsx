import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ShieldCheck, UserPlus, ExternalLink, X, AlertCircle } from 'lucide-react';
import type { RootState } from '@/store/store';
import { EventRegistrationForm } from './RegisterEventForm';

interface PublicEventDetailRegistrationProps {
  eventId: number;
  title: string;
  status: string;
  deadline: string;
  minTeamSize?: number;
  maxTeamSize?: number;
  isTeamEvent?: boolean;
  isEligible?: boolean;
  ineligibilityReason?: string;
  allowedBranches?: Record<string, string>;
  allowedYears?: Record<string, string>;
}

export const PublicEventDetailRegistration = ({
  eventId,
  title,
  status,
  deadline,
  minTeamSize = 1,
  maxTeamSize = 1,
  isTeamEvent = false,
  isEligible = true,
  ineligibilityReason = "",
  allowedBranches = {},
  allowedYears = {}
}: PublicEventDetailRegistrationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role);

  const canRegister = role === 'ROLE_STUDENT' && status !== 'COMPLETED';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden"
      >
        <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100/50">
          <ShieldCheck size={14} className="text-indigo-600" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
            Registration
          </span>
        </div>
        
        <div className="p-5 space-y-4">
          {/* Eligibility Notice */}
          {!canRegister ? (
             <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
               <AlertCircle size={14} className="text-slate-400 shrink-0" />
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Only students can register. If you are a student, please login to continue.
               </p>
             </div>
          ) : !isEligible ? (
             <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
               <AlertCircle size={14} className="text-rose-500 shrink-0" />
               <p className="text-[11px] font-bold text-rose-600 uppercase tracking-widest leading-relaxed">
                  Not Eligible: {ineligibilityReason}
               </p>
             </div>
          ) : (
             <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
               <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
               <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest leading-relaxed">
                  You are eligible to register for this event!
               </p>
             </div>
          )}

          <button 
            disabled={!canRegister || !isEligible}
            onClick={() => setIsModalOpen(true)}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl shadow-lg transition-all font-black text-xs uppercase tracking-widest active:scale-95 group ${
              canRegister && isEligible 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 border border-indigo-500' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'
            }`}
          >
            <UserPlus size={16} />
            <span>Register Now</span>
            <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity ml-1" />
          </button>
        </div>
      </motion.div>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 font-sans">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
             >
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 z-10 w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-lg"
                >
                   <X size={20} />
                </button>

                <EventRegistrationForm 
                  eventId={eventId}
                  eventTitle={title}
                  minTeamSize={minTeamSize}
                  maxTeamSize={maxTeamSize}
                  isTeamEvent={isTeamEvent}
                  onClose={() => setIsModalOpen(false)}
                  allowedBranches={allowedBranches}
                  allowedYears={allowedYears}
                />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
