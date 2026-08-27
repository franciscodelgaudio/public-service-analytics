// src/app/api/chamados-por-municipio/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
          m.nome AS municipio,
          COUNT(*) AS total

      FROM analytics.fact_chamados f
      JOIN analytics.dim_municipio m ON m.id = f.municipio_id

      GROUP BY m.nome
      ORDER BY total DESC
      LIMIT 10;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to load chamados por municipio", error);

    return NextResponse.json(
      { error: "Failed to load chamados por municipio" },
      { status: 500 }
    );
  }
}
