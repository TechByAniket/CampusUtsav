import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from './EmptyState';

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryDistributionChartProps {
  categoryChartData: CategoryData[];
  chartColors: string[];
}

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  categoryChartData,
  chartColors,
}) => {
  return (
    <div className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm transition-all hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50 flex flex-col justify-between h-[450px]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
          <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Events by Category</h3>
        </div>
        <p className="text-slate-400 text-xs font-medium pl-3.5">Distribution count mapped by structural classification.</p>
      </div>

      {categoryChartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center mt-4">
          <EmptyState message="No category distribution available" />
        </div>
      ) : (
        <div className="flex-1 w-full mt-5 overflow-y-auto pr-1 custom-scrollbar space-y-5 flex flex-col justify-start">
          {categoryChartData.map((item, idx) => {
            const total = categoryChartData.reduce((acc, c) => acc + c.value, 0);
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const barColor = chartColors[idx % chartColors.length];
            return (
              <div key={item.name} className="space-y-1">
                {/* 1. Top of Bar: Right-aligned Number */}
                <div className="flex justify-end items-center">
                  <span className="text-[11px] font-black text-slate-700 tracking-wide">
                    {item.value} {item.value === 1 ? 'Event' : 'Events'}
                  </span>
                </div>

                {/* 2. Horizontal Progress Bar */}
                <div className="h-2.5 bg-slate-50 border border-slate-200/60 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`
                    }}
                  />
                </div>

                {/* 3. Bottom of Bar: Left-aligned Category Name */}
                <div className="flex justify-start items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
