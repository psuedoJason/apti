import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
} from "recharts";
import { useMemo, useState } from "react";
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
import MoviesData from "@/data/GraphData.json";
import {
  type FranchiseInterface,
  type GraphDataInterface,
} from "@/components/interfaces";

const importedData: GraphDataInterface = MoviesData as GraphDataInterface;

type FranchiseName = keyof typeof MoviesData;
// type RatingsData = ValueOf<typeof GraphData[data]>;

function calculateMultipliers(
  data: FranchiseInterface["Movies"],
  key: "Ryan" | "Josh" | undefined
) {
  for (let i = 1; i < data.length; i++) {
    if (data[i] == undefined || key == undefined) continue;
    if (data[i][key] == 8) {
      data[i][`${key}Mult`] = 0.2;
    } else if (data[i][key] == 9) {
      data[i][`${key}Mult`] = 0.4;
    } else if (data[i][key] == 10) {
      data[i][`${key}Mult`] = 0.6;
    }
  }
}

function addRatings(
  data: FranchiseInterface["Movies"],
  ratings: FranchiseInterface["Movies"],
  key: "Ryan" | "Josh" | undefined
) {
  for (let i = 1; i < data.length; i++) {
    if (data[i] == undefined || ratings[i] == undefined || key == undefined)
      continue;
    if (ratings[i][key] > 4) {
      ratings[i][key] =
        ratings[i - 1][key] +
        data[i][key] +
        data[i][`${key}Mult`] * ratings[i][`${key}Mult`];
    } else {
      ratings[i][key] = ratings[i - 1][key] - data[i][key];
    }

    if (data[i][key] == 1) {
      ratings[i][key] = ratings[i][key] - ratings[i][key] * 0.5;
    } else if (data[i][key] == 2) {
      ratings[i][key] = ratings[i][key] - ratings[i][key] * 0.4;
    } else if (data[i][key] == 3) {
      ratings[i][key] = ratings[i][key] - ratings[i][key] * 0.3;
    } else if (data[i][key] == 4) {
      ratings[i][key] = ratings[i][key] - ratings[i][key] * 0.2;
    }
  }
}

function calculateRatings(data: FranchiseInterface["Movies"]) {
  data.sort((a, b) => a.Year - b.Year);

  let ratings = structuredClone(data);

  calculateMultipliers(data, "Ryan");
  calculateMultipliers(data, "Josh");

  addRatings(data, ratings, "Ryan");
  addRatings(data, ratings, "Josh");

  return dramatizeGraphData(ratings);
}

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

function getMovieYear(searchValue: any) {
  // Iterate over each franchise in the imported data.
  for (const franchiseKey in MoviesData) {
    // Get the array of movies for the current franchise.

    const movies = MoviesData[franchiseKey as FranchiseName].Movies;

    // Search the movies array for a matching title.
    const foundMovie = movies.find(
      (movie) => movie.MovieTitle.toLowerCase() === searchValue.toLowerCase()
    );

    // If a movie is found, return its year.
    if (foundMovie) {
      return foundMovie.Year;
    }
  }
}

function GraphLabelFormatter(value: string | number | Date) {
  if (!value) return "";
  const year = getMovieYear(value);
  if (year === undefined) return "";
  return year + ` - ${value}`;
}

function dramatizeGraphData(data: FranchiseInterface["Movies"]) {
  let interval = 30;

  let extraDataPoints: FranchiseInterface["Movies"] = [];
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = 0; j < interval; j++) {
      let ryanDiff = data[i + 1]["Ryan"] - data[i]["Ryan"];
      let lowerBoundJoshValue = data[i]["Josh"];
      let upperBoundJoshValue = data[i + 1]["Josh"];
      let joshDiff = upperBoundJoshValue - lowerBoundJoshValue;
      let interpolatedYear =
        data[i]["Year"] +
        ((data[i + 1]["Year"] - data[i]["Year"]) / interval) * (j + 1);

      let interpolatedRyanValue =
        data[i]["Ryan"] +
        (ryanDiff / interval) * (j + 1) +
        Math.random() * (Math.abs(ryanDiff) * 2 - Math.abs(ryanDiff)) * 0.5;

      let interpolatedJoshValue =
        data[i]["Josh"] +
        (joshDiff / interval) * (j + 1) +
        Math.random() * (Math.abs(joshDiff) * 2 - Math.abs(joshDiff)) * 0.5;

      extraDataPoints.push({
        Year: interpolatedYear,
        Ryan: interpolatedRyanValue,
        Josh: interpolatedJoshValue,
        RyanMult: 0,
        JoshMult: 0,
      });
    }
  }
  data = data.concat(extraDataPoints);
  data.sort((a, b) => a.Year - b.Year);
  return data;
}

export default function AreaChartCard({
  graphtype,
}: {
  graphtype?: FranchiseName;
}) {
  const graphType: FranchiseName = (graphtype ?? "StarWars") as FranchiseName;
  const data = MoviesData[graphType];

  // client-side memoized chart data (includes interpolated points)
  const chartData = useMemo(() => calculateRatings(data.Movies), [graphType]);
  // currently highlighted real datapoint (MovieTitle present)
  const [highlight, setHighlight] = useState<
    FranchiseInterface["Movies"][number] | null
  >(null);

  function findNearestWithTitle(year: number | undefined) {
    if (year == null) return null;
    let nearest = null;
    let bestDiff = Number.POSITIVE_INFINITY;
    for (const d of chartData) {
      if (!d || !d.MovieTitle) continue;
      const diff = Math.abs(d.Year - year);
      if (diff < bestDiff) {
        bestDiff = diff;
        nearest = d;
      }
    }
    return nearest;
  }

  function CustomTooltip(props: any) {
    const { active, payload, label } = props;
    if (!active) return null;
    const dataPoint = payload?.[0]?.payload;
    // if hovered point has a MovieTitle, render as before
    if (dataPoint?.MovieTitle) {
      return (
        <ChartTooltipContent
          {...props}
          labelFormatter={GraphLabelFormatter}
          indicator="dot"
        />
      );
    }

    // fallback: find the nearest real movie datapoint and render tooltip for that
    const nearest = highlight ?? findNearestWithTitle(dataPoint?.Year);
    if (!nearest) return null;
    const fakePayload = [{ payload: nearest }];
    const newProps = {
      ...props,
      payload: fakePayload,
      label: nearest.MovieTitle ?? label,
    };
    return (
      <ChartTooltipContent
        {...newProps}
        labelFormatter={GraphLabelFormatter}
        indicator="dot"
      />
    );
  }

  function CustomActiveDot(props: any & { color?: string }) {
    const { cx, cy, payload, color = "var(--color-chart-1)" } = props;
    if (!payload || !payload.MovieTitle || cx == null || cy == null)
      return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={color}
        stroke="#fff"
        strokeWidth={1.5}
        pointerEvents="none"
      />
    );
  }

  return (
    <Card className="relative flex-1 card basis-2/5">
      <div className="absolute inset-0 bg-white opacity-10 rounded-[10px]"></div>
      <CardHeader className="flex flex-col sm:flex-row items-center gap-2 space-y-0 border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle>{data.GraphTitle}</CardTitle>
          <CardDescription>{data.Description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={starWarsChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
            onMouseMove={(state: any) => {
              const payload = state?.activePayload?.[0]?.payload;
              if (!payload) {
                setHighlight(null);
                return;
              }
              if (payload.MovieTitle) {
                setHighlight(payload);
                return;
              }
              // hovered an interpolated point - pick nearest real datapoint
              const nearest = findNearestWithTitle(payload.Year);
              setHighlight(nearest);
            }}
            onMouseLeave={() => setHighlight(null)}
          >
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
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="MovieTitle" axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <CustomTooltip
                // labelFormatter={GraphLabelFormatter}
                // indicator="dot"
                />
              }
            />
            <Area
              dataKey="Josh"
              type="linear"
              fill="url(#fillJosh)"
              stroke="var(--color-chart-2)"
              stackId="a"
              connectNulls={true}
              activeDot={<CustomActiveDot color="var(--color-chart-2)" />}
            />
            <Area
              dataKey="Ryan"
              type="linear"
              fill="url(#fillRyan)"
              stroke="var(--color-chart-1)"
              stackId="b"
              activeDot={<CustomActiveDot color="var(--color-chart-1)" />}
            />
            {highlight ? (
              <>
                <ReferenceDot
                  x={highlight.MovieTitle}
                  y={highlight.Josh}
                  r={4}
                  fill="var(--color-chart-2)"
                  stroke="#fff"
                />
                <ReferenceDot
                  x={highlight.MovieTitle}
                  y={highlight.Ryan}
                  r={4}
                  fill="var(--color-chart-1)"
                  stroke="#fff"
                />
              </>
            ) : null}
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
