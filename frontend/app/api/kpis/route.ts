// src/app/api/kpis/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
          COUNT(*) AS total_chamados,

          COUNT(*) FILTER (
              WHERE status = 'resolvido'
          ) AS chamados_resolvidos,

          COUNT(*) FILTER (
              WHERE status = 'aberto'
          ) AS chamados_abertos,

          COUNT(*) FILTER (
              WHERE status = 'em_andamento'
          ) AS chamados_em_andamento,

          COUNT(*) FILTER (
              WHERE status = 'cancelado'
          ) AS chamados_cancelados,

          ROUND(
              AVG(tempo_atendimento),
              2
          ) AS tempo_medio_atendimento,

          ROUND(
              PERCENTILE_CONT(0.5) WITHIN GROUP (
                  ORDER BY tempo_atendimento
              )::numeric,
              2
          ) AS tempo_mediano_atendimento,

          ROUND(
              AVG(
                  CASE
                      WHEN dentro_sla
                      THEN 1.0
                      ELSE 0.0
                  END
              ) * 100,
              2
          ) AS percentual_dentro_sla

      FROM analytics.fact_chamados;
    `);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to load KPIs", error);

    return NextResponse.json(
      { error: "Failed to load KPIs" },
      { status: 500 }
    );
  }
}
