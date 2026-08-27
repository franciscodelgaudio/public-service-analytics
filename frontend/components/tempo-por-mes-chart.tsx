"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type TempoPorMes = {
  mes: string;
  tempo_mediano: string | null;
  tempo_p90: string | null;
};

// Categorical slots 1 and 2, fixed order - mediana leads, p90 is the tail signal.
const chartConfig: ChartConfig = {
  tempo_mediano: {
    label: "Mediana",
    theme: {
      light: "#2a78d6",
      dark: "#3987e5",
    },
  },
  tempo_p90: {
    label: "P90",
    theme: {
      light: "#eb6834",
      dark: "#d95926",
    },
  },
};

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "2-digit",
});

function formatMonth(mes: string) {
  return monthFormatter.format(new Date(`${mes}-01T00:00:00`)).replace(".", "");
}

export function TempoPorMesChart() {
  const [data, setData] = useState<TempoPorMes[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/tempo-por-mes")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load tempo por mes");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const chartData = data?.map((row) => ({
    mes: formatMonth(row.mes),
    tempo_mediano: row.tempo_mediano != null ? Number(row.tempo_mediano) : null,
    tempo_p90: row.tempo_p90 != null ? Number(row.tempo_p90) : null,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo de atendimento por mês</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-sm text-destructive">
            Não foi possível carregar o tempo de atendimento por mês.
          </p>
        )}

        {!error && !chartData && (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        )}

        {!error && chartData && chartData.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum chamado resolvido encontrado.
          </p>
        )}

        {!error && chartData && chartData.length > 0 && (
          <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={36}
                label={{ value: "dias", angle: -90, position: "insideLeft" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="tempo_mediano"
                type="monotone"
                stroke="var(--color-tempo_mediano)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: "var(--color-tempo_mediano)", fill: "var(--background)" }}
              />
              <Line
                dataKey="tempo_p90"
                type="monotone"
                stroke="var(--color-tempo_p90)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: "var(--color-tempo_p90)", fill: "var(--background)" }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
