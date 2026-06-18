import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', students: 400, events: 240 },
  { name: 'Tue', students: 300, events: 139 },
  { name: 'Wed', students: 200, events: 980 },
  { name: 'Thu', students: 278, events: 390 },
  { name: 'Fri', students: 189, events: 480 },
  { name: 'Sat', students: 239, events: 380 },
  { name: 'Sun', students: 349, events: 430 },
];

export const EngagementChart = () => {
  return (
    <div className="h-[280px] flex flex-col w-full relative group">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em'}}
                dy={15}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 800}}
            />
            <Tooltip 
                contentStyle={{ 
                    borderRadius: '1rem', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '10px',
                    fontWeight: 'bold'
                }}
            />
            <Area 
                type="monotone" 
                dataKey="students" 
                stroke="#6366f1" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorStudents)" 
                activeDot={{ r: 4, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
