// src/app/api/chamados-por-categoria/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
          c.nome AS categoria,
          COUNT(*) AS total

      FROM analytics.fact_chamados f
      JOIN analytics.dim_categoria c ON c.id = f.categoria_id

      GROUP BY c.nome
      ORDER BY total DESC;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to load chamados por categoria", error);

    return NextResponse.json(
      { error: "Failed to load chamados por categoria" },
      { status: 500 }
    );
  }
}
