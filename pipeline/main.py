# pipeline/main.py

from .extract import (
    extract_chamados,
    extract_municipios,
    extract_categorias,
    extract_prioridades,
)

from .validate import validate_chamados

from .transform import transform_chamados


def main():

    print("====================================")
    print("       INICIANDO DATA PIPELINE")
    print("====================================")

    # -----------------------------------------
    # EXTRACT
    # -----------------------------------------

    print("\n[1/4] Extraindo dados...")

    chamados = extract_chamados()
    municipios = extract_municipios()
    categorias = extract_categorias()
    prioridades = extract_prioridades()

    print(
        f"Chamados extraídos: {len(chamados)}"
    )

    # -----------------------------------------
    # VALIDATE
    # -----------------------------------------

    print("\n[2/4] Validando dados...")

    validos, rejeitados, erros = (
        validate_chamados(
            chamados,
            municipios,
        )
    )

    print(
        f"Registros válidos: {len(validos)}"
    )

    print(
        f"Registros rejeitados: {len(rejeitados)}"
    )

    # -----------------------------------------
    # TRANSFORM
    # -----------------------------------------

    print("\n[3/4] Transformando dados...")

    validos = transform_chamados(
        validos
    )

    # -----------------------------------------
    # SAVE
    # -----------------------------------------

    print("\n[4/4] Salvando resultados...")

    validos.to_csv(
        "data/processed/chamados_validos.csv",
        index=False,
    )

    rejeitados.to_csv(
        "data/processed/chamados_rejeitados.csv",
        index=False,
    )

    print(
        "\nPipeline finalizado!"
    )


if __name__ == "__main__":
    main()