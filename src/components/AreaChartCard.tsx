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

  return ratings;
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

// function getMovieYear(searchValue: any) {
//   // Iterate over each franchise in the imported data.
//   for (const franchiseKey in MoviesData) {
//     // Get the array of movies for the current franchise.
//     const movies = MoviesData[franchiseKey].Movies;

//     // Search the movies array for a matching title.
//     const foundMovie = movies.find(
//       (movie) => movie.MovieTitle.toLowerCase() === searchValue.toLowerCase()
//     );

//     // If a movie is found, return its year.
//     if (foundMovie) {
//       return foundMovie.Year;
//     }
//   }
// }

// function GraphLabelFormatter(value: string | number | Date) {
//   return getMovieYear(value) + ` - ${value}`;
// }

export default function AreaChartCard({ graphtype, }: {
  graphtype?: FranchiseName;
}) {
  const graphType: FranchiseName = (graphtype ?? "StarWars") as FranchiseName;
  const data = MoviesData[graphType];
  console.log("Wassup");

  console.log(data);
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
          <AreaChart data={calculateRatings(data.Movies)}>
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
                <ChartTooltipContent
                  // labelFormatter={GraphLabelFormatter}
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
              connectNulls={true}
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
