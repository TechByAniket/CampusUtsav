import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, type PieLabelRenderProps } from "recharts";

const data = [
  { name: "COMP", value: 400 },
  { name: "IT", value: 300 },
  { name: "ECS", value: 300 },
  { name: "MECH", value: 200 },
  { name: "AUTO", value: 100 },
  { name: "EXTC", value: 150 },
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


export const Doughnut = () => {
  return (
    <div className="w-full h-[350px] flex flex-col justify-center items-center">
      <span className="font-semibold">Registered Students</span>
        <ResponsiveContainer width="90%" height="90%">
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              label = {renderLabel}
              labelLine={false}
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={0} // no gap in slices
              dataKey="value"
            >
              {data.map((entry,index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie> 

            <Legend 
              align="center"
              iconSize={10} 
              iconType="circle" 
            />  
            
          </PieChart>
        </ResponsiveContainer>
    </div>
  );
}


const RADIAN = Math.PI / 180;


const renderLabel = (props: PieLabelRenderProps) => {
  const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, name, value } = props;

  // distance from outer edge
  const distanceFromOuter = 10; // adjust this
  const radius = outerRadius + distanceFromOuter;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#000"
      fontSize={12}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${value}`}
    </text>
  );
};