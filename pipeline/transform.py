# pipeline/transform.py

import pandas as pd


def transform_chamados(
    df: pd.DataFrame,
):
    df = df.copy()

    # -----------------------------------------------------
    # Status
    # -----------------------------------------------------

    df["status"] = (
        df["status"]
        .str.strip()
        .str.lower()
        .replace(
            {
                "em andamento": "em_andamento",
            }
        )
    )

    # -----------------------------------------------------
    # Tipos
    # -----------------------------------------------------

    df["municipio_id"] = (
        df["municipio_id"]
        .astype("Int64")
    )

    df["categoria_id"] = (
        df["categoria_id"]
        .astype("Int64")
    )

    df["prioridade_id"] = (
        df["prioridade_id"]
        .astype("Int64")
    )

    # -----------------------------------------------------
    # Tempo de atendimento
    # -----------------------------------------------------

    tempo_calculado = (
        df["data_fechamento"]
        - df["data_abertura"]
    ).dt.total_seconds() / 86400

    # Usamos a diferença das datas como fonte
    # para o tempo de atendimento.
    df["tempo_atendimento"] = (
        tempo_calculado.round(2)
    )

    # -----------------------------------------------------
    # SLA
    # -----------------------------------------------------

    SLA_DIAS = 5

    df["dentro_sla"] = (
        (df["status"] == "resolvido")
        &
        (df["tempo_atendimento"] <= SLA_DIAS)
    )

    # -----------------------------------------------------
    # Colunas finais
    # -----------------------------------------------------

    colunas = [
        "id",
        "municipio_id",
        "categoria_id",
        "prioridade_id",
        "status",
        "data_abertura",
        "data_fechamento",
        "tempo_atendimento",
        "dentro_sla",
    ]

    return df[colunas]