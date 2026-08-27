# pipeline/load.py

import pandas as pd

from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL


DATABASE_URL = URL.create(
    "postgresql+psycopg2",
    username="postgres",
    password=')52m5Ip"hV35',
    host="localhost",
    port=5432,
    database="postgres",
)


def get_engine():

    return create_engine(
        DATABASE_URL
    )


def _truncate(table, engine):

    with engine.begin() as conn:
        conn.execute(
            text(
                f"TRUNCATE TABLE analytics.{table} RESTART IDENTITY CASCADE"
            )
        )


def load_municipios(
    df: pd.DataFrame,
    engine,
):

    _truncate("dim_municipio", engine)

    df.to_sql(
        "dim_municipio",
        engine,
        schema="analytics",
        if_exists="append",
        index=False,
    )


def load_categorias(
    df: pd.DataFrame,
    engine,
):

    _truncate("dim_categoria", engine)

    df.to_sql(
        "dim_categoria",
        engine,
        schema="analytics",
        if_exists="append",
        index=False,
    )


def load_prioridades(
    df: pd.DataFrame,
    engine,
):

    _truncate("dim_prioridade", engine)

    df.to_sql(
        "dim_prioridade",
        engine,
        schema="analytics",
        if_exists="append",
        index=False,
    )


def load_chamados(
    df: pd.DataFrame,
    engine,
):

    _truncate("fact_chamados", engine)

    df.to_sql(
        "fact_chamados",
        engine,
        schema="analytics",
        if_exists="append",
        index=False,
    )


def create_dim_tempo(
    data_inicio,
    data_fim,
    engine,
):

    datas = pd.date_range(
        start=data_inicio,
        end=data_fim,
        freq="D",
    )

    df = pd.DataFrame({
        "data": datas.date,
        "ano": datas.year,
        "mes": datas.month,
        "nome_mes": datas.month_name(),
        "trimestre": datas.quarter,
    })

    df.to_sql(
        "dim_tempo",
        engine,
        schema="analytics",
        if_exists="replace",
        index=False,
    )