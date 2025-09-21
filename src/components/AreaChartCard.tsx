import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  
} from "@/components/ui/chart";

const starWarsData = [
  { year: 1977, title: "A New Hope", Ryan: 10, Josh: 7, Avg: 8.5 },
  { year: 1980, title: "Empire Strikes Back", Ryan: 10, Josh: 8, Avg: 9 },
  { year: 1983, title: "Return of the Jedi", Ryan: 10, Josh: 8, Avg: 9 },
  { year: 1999, title: "The Phantom Menace", Ryan: 9, Josh: 10, Avg: 9.5 },
  { year: 2002, title: "Attack of the Clones", Ryan: 10, Josh: 10, Avg: 10 },
  { year: 2005, title: "Revenge of the Sith", Ryan: 10, Josh: 10, Avg: 10 },
  { year: 2015, title: "The Force Awakens", Ryan: 7, Josh: 7, Avg: 7 },
  { year: 2016, title: "Rogue One", Ryan: 8, Josh: 7, Avg: 7.5 },
  { year: 2017, title: "The Last Jedi", Ryan: 1, Josh: 3, Avg: 2 },
  { year: 2018, title: "Solo", Ryan: 3, Josh: 4, Avg: 3.5 },
  { year: 2019, title: "The Rise of Skywalker", Ryan: 7, Josh: 8, Avg: 7.5 },
];


const starWarsChartConfig: ChartConfig = {
  Ryan: {
    label: "Ryan",
    color: "var(--color-chart-1)",
  },
  Josh: {
    label: "Josh",
    color: "var(--color-chart-2)",
  },
  Avg: {
    label: "Average",
    color: "var(--color-chart-3)",
  },
};

function starWarsLabelFormatter(value: string | number | Date) {
  return `${value}`;
}

export default function AreaChartCard() {
  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-2 space-y-0 border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle>Star Wars</CardTitle>
          <CardDescription>
            Showing the ratings of all 11 main Star Wars movies by the main men Josh and Ryan
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={starWarsChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={starWarsData}>
            <defs>
              <linearGradient id="fillRyan" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillJosh" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {/* <linearGradient id="fillAvg" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0.1}
                />
              </linearGradient> */}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              // tickFormatter={(value) => {
              //   const date = new Date(value);
              //   return date.toLocaleDateString("en-US", {
              //     month: "short",
              //     day: "numeric",
              //   });
              // }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={starWarsLabelFormatter}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="Josh"
              type="linear"
              fill="url(#fillJosh)"
              stroke="var(--color-chart-2)"
              stackId="a"
            />
            <Area
              dataKey="Ryan"
              type="linear"
              fill="url(#fillRyan)"
              stroke="var(--color-chart-1)"
              stackId="b"
            />
            {/* <Area
              dataKey="Avg"
              type="natural"
              fill="url(#fillAvg)"
              stroke="var(--color-chart-3)"
              stackId="a"
            /> */}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
