import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Technical', value: 24, color: '#6366f1' },
  { name: 'Cultural', value: 18, color: '#818cf8' },
  { name: 'Sports', value: 12, color: '#a78bfa' },
  { name: 'Workshop', value: 8, color: '#c7d2fe' },
];

export const EventsByCategory = () => {
  return (
    <div className="h-[250px] flex flex-col w-full relative">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#475569', fontSize: 9, fontWeight: 900, letterSpacing: '0.05em'}}
                width={80}
            />
            <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ 
                    borderRadius: '0.75rem', 
                    border: '1px solid #f1f5f9', 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '10px'
                }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
