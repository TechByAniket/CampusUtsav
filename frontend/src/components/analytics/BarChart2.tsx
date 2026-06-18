import React from 'react'
import { LabelList, ResponsiveContainer } from 'recharts'
import { BarChart as RechartBarChart } from 'recharts';
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const data = [
  { name: "Technical", value: 400 },
  { name: "Cultural", value: 300 },
  { name: "Webinar", value: 300 },
  { name: "Social", value: 200 },
  { name: "Workshops", value: 500 },
];

const COLORS = [
  "#F59E0B", // Golden Yellow – Primary / Important slice
  "#3B82F6", // Blue – Calm / Standard slice
  "#10B981", // Green – Growth / Success slice
  "#EF4444", // Red – Attention / Alerts slice
  "#8B5CF6", // Purple – Extra / Special slice
  "#F97316", // Orange – Secondary slice
  "#6366F1", // Indigo – Another category
  "#14B8A6", // Teal – Supporting slice
  "#E879F9", // Pink – Optional / Misc
  "#6B7280", // Gray – Neutral / Base
];


export const BarChart2 = () => {
  return (
    <div className="w-full h-[350px] flex flex-col justify-center items-center bg-white rounded-[8px]">
      <span className="font-semibold text-gray-800 my-2">
        Events Conducted (Category)
      </span>
      <ResponsiveContainer width="100%" height="100%">
        <RechartBarChart
          data={data}
          margin={{ top: 20, right: 40, left: 5, bottom: 20 }}
        >
          {/* Modern grid */}
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* X Axis */}
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            interval={0} // show all labels
            angle={-30} // rotate for long names
            textAnchor="end"
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          />

          {/* Bars */}
          <Bar barSize={25} dataKey="value" radius={[0, 0, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                // fill={COLORS[index % COLORS.length]}
                fill='#3B82F6'
                style={{ transition: "fill 0.3s" }}
              />
            ))}

            {/* Labels above bars */}
            <LabelList
              dataKey="value"
              position="top"
              fill="#111827"
              fontSize={12}
              formatter={(val) => `${val}`}
            />
          </Bar>
        </RechartBarChart>
      </ResponsiveContainer>
    </div>
  )
}
