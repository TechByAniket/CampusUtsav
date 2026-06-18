import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Technical', value: 45, color: '#6366f1' },
  { name: 'Cultural', value: 30, color: '#818cf8' },
  { name: 'Sports', value: 15, color: '#a78bfa' },
  { name: 'Other', value: 10, color: '#c7d2fe' },
];

export const CategoryDistribution = () => {
  return (
    <div className="h-[250px] flex flex-col w-full relative">
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={75}
              outerRadius={95}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ 
                    borderRadius: '0.75rem', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '10px',
                    fontWeight: 'bold'
                }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
            <p className="text-2xl font-black text-slate-900 leading-none">100%</p>
        </div>
      </div>

      {/* Modern Legend */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-4">
        {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                <span className="text-[9px] font-bold text-slate-300 ml-auto">{item.value}%</span>
            </div>
        ))}
      </div>
    </div>
  );
};
