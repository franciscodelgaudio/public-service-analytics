// src/app/api/chamados-por-mes/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
          TO_CHAR(DATE_TRUNC('month', data_abertura), 'YYYY-MM') AS mes,
          COUNT(*) AS total

      FROM analytics.fact_chamados

      GROUP BY 1
      ORDER BY 1;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to load chamados por mes", error);

    return NextResponse.json(
      { error: "Failed to load chamados por mes" },
      { status: 500 }
    );
  }
}
