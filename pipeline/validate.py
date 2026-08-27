# pipeline/validate.py

import pandas as pd


STATUS_VALIDOS = {
    "aberto",
    "em_andamento",
    "resolvido",
    "cancelado",
}


def validate_chamados(
    df: pd.DataFrame,
    municipios: pd.DataFrame,
):
    df = df.copy()

    df["data_abertura"] = pd.to_datetime(
        df["data_abertura"],
        errors="coerce",
    )

    df["data_fechamento"] = pd.to_datetime(
        df["data_fechamento"],
        errors="coerce",
    )

    erros = {}

    # -----------------------------------------------------
    # ID duplicado
    # -----------------------------------------------------

    duplicados = df["id"].duplicated(
        keep=False
    )

    erros["id_duplicado"] = duplicados

    # -----------------------------------------------------
    # Tempo negativo
    # -----------------------------------------------------

    erros["tempo_atendimento_negativo"] = (
        df["tempo_atendimento"] < 0
    )

    # -----------------------------------------------------
    # Data inconsistente
    # -----------------------------------------------------

    erros["data_fechamento_anterior_abertura"] = (
        df["data_fechamento"].notna()
        &
        (
            df["data_fechamento"]
            < df["data_abertura"]
        )
    )

    # -----------------------------------------------------
    # Status inválido
    # -----------------------------------------------------

    status_normalizado = (
        df["status"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    erros["status_invalido"] = (
        ~status_normalizado.isin(
            STATUS_VALIDOS
        )
    )

    # -----------------------------------------------------
    # Município nulo
    # -----------------------------------------------------

    erros["municipio_nulo"] = (
        df["municipio_id"].isna()
    )

    # -----------------------------------------------------
    # Categoria nula
    # -----------------------------------------------------

    erros["categoria_nula"] = (
        df["categoria_id"].isna()
    )

    # -----------------------------------------------------
    # Prioridade nula
    # -----------------------------------------------------

    erros["prioridade_nula"] = (
        df["prioridade_id"].isna()
    )

    # -----------------------------------------------------
    # Fechamento ausente em chamado resolvido
    # -----------------------------------------------------

    erros["fechamento_ausente"] = (
        (status_normalizado == "resolvido")
        &
        (df["data_fechamento"].isna())
    )

    # -----------------------------------------------------
    # Município inexistente
    # -----------------------------------------------------

    municipios_validos = set(
        municipios["id"]
    )

    erros["municipio_inexistente"] = (
        df["municipio_id"].notna()
        &
        ~df["municipio_id"].isin(
            municipios_validos
        )
    )

    # -----------------------------------------------------
    # Consolidando erros
    # -----------------------------------------------------

    erros_df = pd.DataFrame(
        erros,
        index=df.index,
    )

    df["quantidade_erros"] = (
        erros_df.sum(axis=1)
    )

    df["valido"] = (
        df["quantidade_erros"] == 0
    )

    # -----------------------------------------------------
    # Motivos
    # -----------------------------------------------------

    def obter_motivos(row):
        motivos = []

        for coluna in erros_df.columns:
            if row[coluna]:
                motivos.append(coluna)

        return ", ".join(motivos)

    df["motivos"] = erros_df.apply(
        obter_motivos,
        axis=1,
    )

    validos = df[
        df["valido"]
    ].copy()

    rejeitados = df[
        ~df["valido"]
    ].copy()

    return validos, rejeitados, erros_df