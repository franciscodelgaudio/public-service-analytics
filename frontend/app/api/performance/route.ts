// src/app/api/performance/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
          p.nome AS prioridade,
          COUNT(*) AS total_chamados,

          ROUND(
              AVG(f.tempo_atendimento),
              2
          ) AS tempo_medio_atendimento,

          ROUND(
              AVG(
                  CASE
                      WHEN f.dentro_sla
                      THEN 1.0
                      ELSE 0.0
                  END
              ) * 100,
              2
          ) AS percentual_dentro_sla

      FROM analytics.fact_chamados f
      JOIN analytics.dim_prioridade p ON p.id = f.prioridade_id

      GROUP BY p.nivel, p.nome
      ORDER BY p.nivel;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to load performance metrics", error);

    return NextResponse.json(
      { error: "Failed to load performance metrics" },
      { status: 500 }
    );
  }
}
