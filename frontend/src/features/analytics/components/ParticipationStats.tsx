import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'CS', value: 85, color: '#6366f1' },
  { name: 'IT', value: 72, color: '#818cf8' },
  { name: 'EC', value: 65, color: '#a78bfa' },
  { name: 'ME', value: 45, color: '#c7d2fe' },
  { name: 'CV', value: 38, color: '#e0e7ff' },
];

export const ParticipationStats = () => {
  return (
    <div className="h-[280px] flex flex-col w-full relative">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barGap={0}>
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em'}}
                dy={12}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 800}}
            />
            <Tooltip 
                cursor={{fill: 'transparent'}}
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
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
