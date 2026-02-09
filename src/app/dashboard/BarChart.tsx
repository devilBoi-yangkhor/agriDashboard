"use client";

import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarChartProps {
  data: Array<{ metric: string; value: number }>;
}

export function ChartBarInteractive({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="metric"
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "none",
            borderRadius: "8px",
            color: "#F9FAFB",
          }}
          formatter={(value: number) => [`${value}%`, "Usage"]}
          labelStyle={{ color: "#9CA3AF", fontWeight: "bold" }}
        />
        <Legend />
        <Bar
          dataKey="value"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
          name="Usage Percentage"
        />
      </ReBarChart>
    </ResponsiveContainer>
  );
}

// Alternative simpler version if you're still getting errors:
export function ChartBarInteractiveSimple({ data }: BarChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3B82F6" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// If you're getting type errors with Recharts, use this version:
export function ChartBarInteractiveAlt({ data }: BarChartProps) {
  // Transform data if needed
  const chartData = data.map((item) => ({
    name: item.metric,
    value: item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}