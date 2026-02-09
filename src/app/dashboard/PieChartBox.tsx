"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "blue",
  },
  safari: {
    label: "Safari",
    color: "lightseagreen",
  },
  firefox: {
    label: "Firefox",
    color: "orange",
  },
  edge: {
    label: "Edge",
    color: "purple",
  },
  other: {
    label: "Other",
    color: "gray",
  },
} satisfies ChartConfig

export function PieChartBox({ title="Pie Chart", description, chartData} : { title?: string; description?: string, chartData?: any[]}) {
  return (
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[350px] pb-0"
        >
          <PieChart>
            <ChartTooltip cursor={false}
              content={<ChartTooltipContent hideLabel />}/>
            <Pie data={chartData} dataKey="total" stroke="0" nameKey="name" >
              <LabelList dataKey="name" className="fill-background"
                stroke="none"
                fontSize={12}/>
              </Pie>
          </PieChart>
        </ChartContainer>
      </div>
  )
}
