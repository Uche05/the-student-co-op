import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { RadarData } from "../types";

interface StatsRadarChartProps {
  data?: RadarData[];
}

export function StatsRadarChart({ data }: StatsRadarChartProps) {
  const chartData = data || [
    { skill: "Communication", user: 85, industry: 70 },
    { skill: "Emotional Intelligence", user: 78, industry: 72 },
    { skill: "Resilience", user: 82, industry: 68 },
    { skill: "Problem Solving", user: 90, industry: 80 },
    { skill: "Leadership", user: 75, industry: 70 },
  ];

  return (
    <div className="w-full h-[400px] lg:h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <Radar
            name="Your Score"
            dataKey="user"
            stroke="#3182CE"
            fill="#3182CE"
            fillOpacity={0.6}
          />
          <Radar
            name="Industry Benchmark"
            dataKey="industry"
            stroke="#64748B"
            fill="#64748B"
            fillOpacity={0.3}
          />
          <Legend 
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
