"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Gauge, ListChecks } from "lucide-react";

import { ChamadosPorMesChart } from "@/components/chamados-por-mes-chart";
import { KpiCard } from "@/components/kpi-card";
import { RankedBarChart } from "@/components/ranked-bar-chart";
import { TempoPorMesChart } from "@/components/tempo-por-mes-chart";
import { SLA_COLOR, slaLevel } from "@/lib/sla";

type KpiResponse = {
  total_chamados: string;
  chamados_resolvidos: string;
  tempo_medio_atendimento: string | null;
  tempo_mediano_atendimento: string | null;
  percentual_dentro_sla: string | null;
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

function slaStatus(pct: number) {
  if (pct >= 90) {
    return { status: "good" as const, label: "Dentro da meta" };
  }
  if (pct >= 75) {
    return { status: "warning" as const, label: "Próximo do limite" };
  }
  return { status: "critical" as const, label: "Fora da meta" };
}

export default function Home() {
  const [data, setData] = useState<KpiResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/kpis")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load kpis");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const pct =
    data?.percentual_dentro_sla != null
      ? Number(data.percentual_dentro_sla)
      : null;
  const sla = pct !== null ? slaStatus(pct) : null;

  return (
    <div className="min-h-screen flex-1 bg-muted/30 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard de chamados
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral dos indicadores de atendimento
        </p>

        {error && (
          <p className="mt-6 text-sm text-destructive">
            Não foi possível carregar os indicadores.
          </p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total de chamados"
            value={
              data ? numberFormatter.format(Number(data.total_chamados)) : "—"
            }
            icon={ListChecks}
          />

          <KpiCard
            label="Chamados resolvidos"
            value={
              data
                ? numberFormatter.format(Number(data.chamados_resolvidos))
                : "—"
            }
            icon={CheckCircle2}
          />

          <KpiCard
            label="Tempo de atendimento (mediana)"
            value={
              data?.tempo_mediano_atendimento
                ? `${numberFormatter.format(
                    Number(data.tempo_mediano_atendimento)
                  )} dias`
                : "—"
            }
            icon={Clock}
          />

          <KpiCard
            label="Dentro do SLA"
            value={pct !== null ? `${numberFormatter.format(pct)}%` : "—"}
            icon={Gauge}
            status={sla?.status}
            statusLabel={sla?.label}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ChamadosPorMesChart />
          <TempoPorMesChart />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <RankedBarChart
            title="Chamados por categoria"
            endpoint="/api/chamados-por-categoria"
            labelKey="categoria"
            valueKey="total"
            seriesLabel="Chamados"
          />

          <RankedBarChart
            title="Chamados por município (top 10)"
            endpoint="/api/chamados-por-municipio"
            labelKey="municipio"
            valueKey="total"
            seriesLabel="Chamados"
          />
        </div>

        <h2 className="mt-8 text-lg font-semibold tracking-tight">
          Performance por prioridade
        </h2>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <RankedBarChart
            title="Tempo médio de atendimento por prioridade"
            endpoint="/api/performance"
            labelKey="prioridade"
            valueKey="tempo_medio_atendimento"
            seriesLabel="Dias"
            orientation="vertical"
          />

          <RankedBarChart
            title="Dentro do SLA por prioridade"
            endpoint="/api/performance"
            labelKey="prioridade"
            valueKey="percentual_dentro_sla"
            seriesLabel="% dentro do SLA"
            orientation="vertical"
            colorForValue={(value) => SLA_COLOR[slaLevel(value)]}
          />
        </div>
      </div>
    </div>
  );
}
