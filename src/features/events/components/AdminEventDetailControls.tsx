import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Users, BarChart3, ClipboardCheck,
  ShieldAlert, X, CheckCircle, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { approveEventByRole, revertEventByRole } from '@/services/eventService';

interface AdminEventDetailControlsProps {
  role: string | null;
  eventId?: number;
  currentStatus?: string;
  onActionComplete?: () => void;
}

export const AdminEventDetailControls: React.FC<AdminEventDetailControlsProps> = ({
  role,
  eventId,
  currentStatus,
  onActionComplete
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decision, setDecision] = useState<'APPROVE' | 'REVERT'>('APPROVE');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!role || role === 'ROLE_STUDENT') return null;

  const REVIEWER_ROLES = ['ROLE_COLLEGE', 'ROLE_PRINCIPAL', 'ROLE_FACULTY', 'ROLE_HOD'];
  const isReviewer = role && REVIEWER_ROLES.includes(role);
  const showActionButton = isReviewer && currentStatus !== 'APPROVED' && currentStatus !== 'REJECTED' && currentStatus !== 'REVERTED';

  const handleSubmit = async () => {
    if (!eventId) return;
    if (decision === 'REVERT' && !remarks.trim()) {
      toast.error('Remarks are required to revert the event.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (decision === 'APPROVE') {
        await approveEventByRole(eventId, remarks.trim() || 'Approved');
        toast.success('Event approved successfully!');
      } else {
        await revertEventByRole(eventId, remarks.trim());
        toast.success('Event reverted successfully!');
      }
      setIsModalOpen(false);
      setRemarks('');
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (err: any) {
      toast.error(err.message || 'Action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.12)] overflow-hidden">
        {/* Header banner */}
        <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50/60 border-b border-amber-100/50">
          <ShieldCheck size={14} className="text-amber-600" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
            Admin Controls
          </span>
        </div>
        <div className="p-5 space-y-2.5">
          {showActionButton && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.97] flex items-center justify-center gap-2.5 mb-2"
            >
              <ShieldAlert size={16} /> Take Action
            </button>
          )}

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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-slate-200 my-auto p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Review Decision</h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setRemarks('');
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-widest block mb-2">Select Option</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDecision('APPROVE')}
                      className={`py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-sm active:scale-95 flex flex-col items-center gap-2 border-2 ${
                        decision === 'APPROVE'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle size={20} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecision('REVERT')}
                      className={`py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-sm active:scale-95 flex flex-col items-center gap-2 border-2 ${
                        decision === 'REVERT'
                          ? 'bg-amber-50 border-amber-500 text-amber-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <RotateCcw size={20} />
                      Revert
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-widest block">
                    Remarks {decision === 'REVERT' && <span className="text-rose-500 font-bold">*</span>}
                  </label>
                  <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder={decision === 'REVERT' ? 'Reason for reverting (Required)...' : 'Optional approval remarks...'}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-medium outline-none focus:border-indigo-500 transition-all text-slate-900"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 text-white ${
                    isSubmitting
                      ? 'bg-slate-400 cursor-not-allowed'
                      : decision === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                      : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Action'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
