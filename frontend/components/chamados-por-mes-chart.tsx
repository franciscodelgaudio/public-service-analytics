"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChamadosPorMes = {
  mes: string;
  total: string;
};

// Sequential blue, one hue - the only series on this chart.
const chartConfig: ChartConfig = {
  total: {
    label: "Chamados",
    theme: {
      light: "#2a78d6",
      dark: "#3987e5",
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

export function ChamadosPorMesChart() {
  const [data, setData] = useState<ChamadosPorMes[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/chamados-por-mes")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load chamados por mes");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const chartData = data?.map((row) => ({
    mes: formatMonth(row.mes),
    total: Number(row.total),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chamados por mês</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-sm text-destructive">
            Não foi possível carregar os chamados por mês.
          </p>
        )}

        {!error && !chartData && (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        )}

        {!error && chartData && chartData.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum chamado encontrado.
          </p>
        )}

        {!error && chartData && chartData.length > 0 && (
          <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
            <BarChart data={chartData}>
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
                allowDecimals={false}
                width={36}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
