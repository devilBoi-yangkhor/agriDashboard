"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AreaChartProps {
  data: Array<{ month: string; sales: number; revenue: number }>;
}

export function ChartAreaInteractive({ data }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--foreground))"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Area 
          type="monotone" 
          dataKey="sales" 
          stackId="1"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stackId="1"
          stroke="hsl(var(--secondary))"
          fill="hsl(var(--secondary))"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}