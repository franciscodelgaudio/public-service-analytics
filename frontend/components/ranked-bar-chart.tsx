"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sequential blue, one hue - the default for a single-series magnitude chart.
const DEFAULT_COLOR = { light: "#2a78d6", dark: "#3987e5" };

type RankedBarChartProps = {
  title: string;
  endpoint: string;
  labelKey: string;
  valueKey: string;
  seriesLabel: string;
  orientation?: "horizontal" | "vertical";
  colorForValue?: (value: number) => string;
};

export function RankedBarChart({
  title,
  endpoint,
  labelKey,
  valueKey,
  seriesLabel,
  orientation = "horizontal",
  colorForValue,
}: RankedBarChartProps) {
  const [data, setData] = useState<Record<string, string>[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("failed to load");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [endpoint]);

  const chartData = data?.map((row) => ({
    [labelKey]: row[labelKey],
    [valueKey]: Number(row[valueKey]),
  }));

  const config: ChartConfig = {
    [valueKey]: { label: seriesLabel, theme: DEFAULT_COLOR },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-sm text-destructive">
            Não foi possível carregar os dados.
          </p>
        )}

        {!error && !chartData && (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        )}

        {!error && chartData && chartData.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum dado encontrado.
          </p>
        )}

        {!error && chartData && chartData.length > 0 && (
          <ChartContainer config={config} className="aspect-auto h-80 w-full">
            {orientation === "horizontal" ? (
              <BarChart data={chartData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis
                  dataKey={labelKey}
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {chartData.map((row, index) => (
                    <Cell
                      key={index}
                      fill={
                        colorForValue
                          ? colorForValue(Number(row[valueKey]))
                          : `var(--color-${valueKey})`
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={labelKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                  width={36}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey={valueKey} radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {chartData.map((row, index) => (
                    <Cell
                      key={index}
                      fill={
                        colorForValue
                          ? colorForValue(Number(row[valueKey]))
                          : `var(--color-${valueKey})`
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
