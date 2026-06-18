import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon, rightElement }) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/50 shadow-sm">
        {icon}
      </div>
      <div>
        <h2 className="text-[11px] font-black text-slate-900 tracking-[0.05em] uppercase leading-none">{title}</h2>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1.5">{subtitle}</p>
      </div>
    </div>
    {rightElement}
  </div>
);
