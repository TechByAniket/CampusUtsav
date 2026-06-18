import React from 'react'

interface StatCardProps {
    title: string;
    value: string | number;
    colour?: ColorKey;
}

type ColorKey = 'blue' | 'green' | 'red' | 'yellow' | 'primaryLight';

const colorsMap: Record<ColorKey, string> = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  red: 'text-red-500',
  yellow: 'text-amber-500',
  primaryLight: 'text-primaryLight',
};


export const StatCard: React.FC<StatCardProps> = ({ title, value, colour }) => {
  return (
    <div className="h-[12vh] w-[70vw] sm:w-[45vw] md:w-full bg-white rounded-xl p-4 flex flex-col gap-1 shadow-sm">
      <span className="font-semibold">{title}</span>
      <span className={`text-2xl font-bold ${colour ? colorsMap[colour] : colorsMap.primaryLight}`}>{value}</span>
    </div>
  );
};
