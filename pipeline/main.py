# pipeline/main.py

from pipeline.extract import (
    extract_chamados,
    extract_municipios,
    extract_categorias,
    extract_prioridades,
)

from pipeline.validate import (
    validate_chamados,
)

from pipeline.transform import (
    transform_chamados,
)

from pipeline.load import (
    get_engine,
    load_municipios,
    load_categorias,
    load_prioridades,
    load_chamados,
    create_dim_tempo,
)


def main():

    print("=" * 50)
    print("        INICIANDO DATA PIPELINE")
    print("=" * 50)

    # ---------------------------------------------
    # EXTRACT
    # ---------------------------------------------

    print("\n[1/4] Extract")

    chamados = extract_chamados()
    municipios = extract_municipios()
    categorias = extract_categorias()
    prioridades = extract_prioridades()

    print(
        f"Chamados: {len(chamados)}"
    )

    # ---------------------------------------------
    # VALIDATE
    # ---------------------------------------------

    print("\n[2/4] Validate")

    validos, rejeitados, erros = (
        validate_chamados(
            chamados,
            municipios,
        )
    )

    print(
        f"Válidos: {len(validos)}"
    )

    print(
        f"Rejeitados: {len(rejeitados)}"
    )

    # ---------------------------------------------
    # TRANSFORM
    # ---------------------------------------------

    print("\n[3/4] Transform")

    validos = transform_chamados(
        validos
    )

    # ---------------------------------------------
    # LOAD
    # ---------------------------------------------

    print("\n[4/4] Load")

    engine = get_engine()

    load_municipios(
        municipios,
        engine,
    )

    load_categorias(
        categorias,
        engine,
    )

    load_prioridades(
        prioridades,
        engine,
    )

    load_chamados(
        validos,
        engine,
    )

    create_dim_tempo(
        "2025-08-01",
        "2026-08-01",
        engine,
    )

    print("\nPipeline concluído!")

    print("=" * 50)


if __name__ == "__main__":
    main()