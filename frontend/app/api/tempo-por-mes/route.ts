// src/app/api/tempo-por-mes/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
          TO_CHAR(DATE_TRUNC('month', data_abertura), 'YYYY-MM') AS mes,

          ROUND(
              PERCENTILE_CONT(0.5) WITHIN GROUP (
                  ORDER BY tempo_atendimento
              )::numeric,
              2
          ) AS tempo_mediano,

          ROUND(
              PERCENTILE_CONT(0.9) WITHIN GROUP (
                  ORDER BY tempo_atendimento
              )::numeric,
              2
          ) AS tempo_p90

      FROM analytics.fact_chamados
      WHERE tempo_atendimento IS NOT NULL

      GROUP BY 1
      ORDER BY 1;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to load tempo por mes", error);

    return NextResponse.json(
      { error: "Failed to load tempo por mes" },
      { status: 500 }
    );
  }
}
