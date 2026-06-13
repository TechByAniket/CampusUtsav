import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { ApprovalLog } from '@/types/approval';

const radiationEffect = {
  animate: {
    scale: [1, 1.8],
    opacity: [0.5, 0],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeOut"
  }
};

interface ApprovalChainProps {
  history: ApprovalLog[];
  isFinalApproved: boolean;
  currentStatus: string;
}

export const ApprovalChain: React.FC<ApprovalChainProps> = ({ history, isFinalApproved, currentStatus }) => {
  const stages = [
    { key: 'SUBMITTED', label: 'Club Submission', role: 'ROLE_CLUB' },
    { key: 'FACULTY1_APPROVED', label: 'Faculty Review', role: 'ROLE_FACULTY' },
    { key: 'HOD_APPROVED', label: 'HOD Approval', role: 'ROLE_HOD' },
    { key: 'APPROVED', label: 'Final Publication', role: 'ROLE_PRINCIPAL' }
  ];

  const getLogForStage = (stageKey: string) => {
    return history.find(h => h.toStatus === stageKey || h.action === stageKey);
  };

  const isReverted = currentStatus === 'REVERTED';
  const latestLog = history[0];

  const currentIndex = stages.findIndex(s => s.key === latestLog?.toStatus);
  const currentStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="relative py-4 select-none">
      {/* Connector lines */}
      <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-100" />
      <div 
        className="absolute left-[15px] top-4 w-[2px] bg-emerald-500 transition-all duration-700" 
        style={{ height: `${(currentStep / (stages.length - 1)) * 100}%` }} 
      />

      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const log = getLogForStage(stage.key);
          const isReached = idx <= currentStep;
          const isCurrent = idx === currentStep;
          const shouldRadiate = isCurrent && !isFinalApproved;

          return (
            <div key={stage.key} className="flex gap-4 group relative">
              <div className="relative shrink-0">
                {shouldRadiate && (
                  <motion.div
                    animate={radiationEffect.animate}
                    transition={radiationEffect.transition as any}
                    className="absolute inset-0 rounded-full bg-emerald-400"
                  />
                )}
                <div 
                  className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                    isReached 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' 
                      : 'bg-white border-slate-200 text-slate-300'
                  }`}
                >
                  {isReached ? (
                    <CheckCircle size={14} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  )}
                </div>
              </div>

              <div className={`flex-1 pt-0.5 transition-opacity duration-300 ${isReached ? 'opacity-100' : 'opacity-30'}`}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h4 className={`text-[13px] font-black tracking-wider ${isReached ? 'text-slate-900' : 'text-slate-400'}`}>
                    {stage.label}
                  </h4>
                  {log && (
                    <span className="text-[12px] font-bold text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                {log?.remarks ? (
                  log.action === 'REVERTED' || log.toStatus === 'REVERTED' ? (
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl px-3 py-1.5 mt-1 flex gap-2 items-start">
                      <AlertCircle size={15} className="text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-[13px] font-semibold text-orange-950 leading-relaxed italic">
                        "{log.remarks}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed italic mt-1 pl-1">
                      "{log.remarks}"
                    </p>
                  )
                ) : isCurrent && !isFinalApproved && !isReverted ? (
                  <p className="text-[13px] font-bold text-emerald-500 animate-pulse mt-1 pl-1">Review in progress...</p>
                ) : null}

                {isReverted && isCurrent && latestLog?.action === 'REVERTED' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-2 p-3 bg-orange-50/50 border border-orange-100/40 rounded-2xl relative flex gap-2.5 items-start"
                  >
                    <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-extrabold text-orange-950 leading-snug">
                        "{latestLog.remarks}"
                      </p>
                      <div className="mt-1 text-[11px] font-semibold text-orange-500/70 tracking-wider">
                        Sent by {latestLog.actionBy.replace('ROLE_', '')} • {new Date(latestLog.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
