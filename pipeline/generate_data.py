import random
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
from faker import Faker


fake = Faker("pt_BR")
random.seed(42)


OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# MUNICÍPIOS
# ---------------------------------------------------------

municipios = [
    (1, "Foz do Iguaçu", "PR", 285000),
    (2, "Curitiba", "PR", 1770000),
    (3, "Londrina", "PR", 580000),
    (4, "Maringá", "PR", 425000),
    (5, "Cascavel", "PR", 350000),
    (6, "Ponta Grossa", "PR", 360000),
    (7, "São José dos Pinhais", "PR", 330000),
    (8, "Colombo", "PR", 250000),
    (9, "Guarapuava", "PR", 185000),
    (10, "Paranaguá", "PR", 145000),
]

# Cria municípios adicionais fictícios
for i in range(11, 51):
    municipios.append(
        (
            i,
            fake.city(),
            "PR",
            random.randint(20000, 300000),
        )
    )


municipios_df = pd.DataFrame(
    municipios,
    columns=["id", "nome", "uf", "populacao"]
)


# ---------------------------------------------------------
# CATEGORIAS
# ---------------------------------------------------------

categorias = [
    (1, "Iluminação"),
    (2, "Obras"),
    (3, "Saúde"),
    (4, "Transporte"),
    (5, "Atendimento"),
    (6, "Educação"),
    (7, "Segurança"),
    (8, "Saneamento"),
    (9, "Meio Ambiente"),
    (10, "Documentação"),
]


categorias_df = pd.DataFrame(
    categorias,
    columns=["id", "nome"]
)


# ---------------------------------------------------------
# PRIORIDADES
# ---------------------------------------------------------

prioridades = [
    (1, "Baixa", 1),
    (2, "Média", 2),
    (3, "Alta", 3),
    (4, "Crítica", 4),
]


prioridades_df = pd.DataFrame(
    prioridades,
    columns=["id", "nome", "nivel"]
)


# ---------------------------------------------------------
# CHAMADOS
# ---------------------------------------------------------

status = [
    "aberto",
    "em_andamento",
    "resolvido",
    "cancelado",
]

inicio = datetime(2025, 8, 1)
fim = datetime(2026, 8, 1)


chamados = []


for chamado_id in range(1, 10001):

    municipio_id = random.randint(1, 50)
    categoria_id = random.randint(1, 10)
    prioridade_id = random.randint(1, 4)

    status_atual = random.choice(status)

    data_abertura = fake.date_time_between(
        start_date=inicio,
        end_date=fim,
    )

    data_fechamento = None
    tempo_atendimento = None

    if status_atual == "resolvido":

        tempo_atendimento = max(
            1,
            int(random.gauss(7, 4))
        )

        data_fechamento = (
            data_abertura
            + timedelta(days=tempo_atendimento)
        )

    chamados.append(
        {
            "id": chamado_id,
            "municipio_id": municipio_id,
            "categoria_id": categoria_id,
            "prioridade_id": prioridade_id,
            "status": status_atual,
            "data_abertura": data_abertura,
            "data_fechamento": data_fechamento,
            "tempo_atendimento": tempo_atendimento,
        }
    )


chamados_df = pd.DataFrame(chamados)


# ---------------------------------------------------------
# INSERINDO PROBLEMAS DE DATA QUALITY
# ---------------------------------------------------------

# 1. Municípios com grafia inconsistente
municipios_df.loc[
    municipios_df["nome"] == "Foz do Iguaçu",
    "nome"
] = "Foz do Iguacu"


# 2. Status inconsistentes
indices = chamados_df.sample(30, random_state=1).index

chamados_df.loc[
    indices[:10],
    "status"
] = "Resolvido"

chamados_df.loc[
    indices[10:20],
    "status"
] = "RESOLVIDO"

chamados_df.loc[
    indices[20:],
    "status"
] = "Em Andamento"


# 3. Tempos negativos
indices = chamados_df.sample(10, random_state=2).index

chamados_df.loc[
    indices,
    "tempo_atendimento"
] = -random.randint(1, 10)


# 4. Datas de fechamento anteriores à abertura
indices = chamados_df.sample(10, random_state=3).index

chamados_df.loc[
    indices,
    "data_fechamento"
] = (
    chamados_df.loc[indices, "data_abertura"]
    - timedelta(days=2)
)


# 5. NULL em município
indices = chamados_df.sample(10, random_state=4).index

chamados_df.loc[
    indices,
    "municipio_id"
] = None


# 6. Duplicação de registros
duplicados = chamados_df.sample(
    20,
    random_state=5
)

chamados_df = pd.concat(
    [chamados_df, duplicados],
    ignore_index=True
)


# ---------------------------------------------------------
# EXPORTAÇÃO
# ---------------------------------------------------------

municipios_df.to_csv(
    OUTPUT_DIR / "municipios.csv",
    index=False,
    encoding="utf-8"
)

categorias_df.to_csv(
    OUTPUT_DIR / "categorias.csv",
    index=False,
    encoding="utf-8"
)

prioridades_df.to_csv(
    OUTPUT_DIR / "prioridades.csv",
    index=False,
    encoding="utf-8"
)

chamados_df.to_csv(
    OUTPUT_DIR / "chamados.csv",
    index=False,
    encoding="utf-8"
)


print("Dados gerados com sucesso!")
print(f"Diretório: {OUTPUT_DIR}")
print(f"Chamados: {len(chamados_df)}")