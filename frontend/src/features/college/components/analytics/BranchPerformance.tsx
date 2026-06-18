import React from 'react';
import { Users } from 'lucide-react';
import { RegistrationsByBranch } from '@/features/analytics/components/RegistrationsByBranch';
import { SectionHeader } from '../overview/SectionHeader';

export const BranchPerformance: React.FC = () => {
  return (
    <div className="col-span-12 lg:col-span-7 bg-white rounded-[1.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:border-slate-200">
      <SectionHeader 
        title="Registrations by Department" 
        subtitle="Branch-level pool share" 
        icon={<Users size={16} className="text-emerald-600" />} 
      />
      <div className="mt-8">
        <RegistrationsByBranch />
      </div>
    </div>
  );
};
