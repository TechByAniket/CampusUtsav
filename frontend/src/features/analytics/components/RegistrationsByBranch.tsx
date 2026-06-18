import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Computer Sci', value: 850, color: '#6366f1' },
  { name: 'Info Tech', value: 720, color: '#818cf8' },
  { name: 'Electronics', value: 650, color: '#a78bfa' },
  { name: 'Mechanical', value: 450, color: '#c7d2fe' },
  { name: 'Civil Eng', value: 380, color: '#e0e7ff' },
];

export const RegistrationsByBranch = () => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="h-[280px] flex flex-col w-full relative">
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={75}
              outerRadius={95}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ 
                    borderRadius: '0.75rem', 
                    border: '1px solid #f1f5f9', 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '10px'
                }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Registrations</p>
            <p className="text-3xl font-black text-slate-900 leading-none">{total.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-8 mt-6">
        {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                <span className="text-[9px] font-bold text-slate-300 ml-auto">{item.value}</span>
            </div>
        ))}
      </div>
    </div>
  );
};
