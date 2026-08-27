# pipeline/extract.py

import pandas as pd


CHAMADOS_PATH = "data/raw/chamados.csv"
MUNICIPIOS_PATH = "data/raw/municipios.csv"
CATEGORIAS_PATH = "data/raw/categorias.csv"
PRIORIDADES_PATH = "data/raw/prioridades.csv"


def extract_chamados():
    return pd.read_csv(CHAMADOS_PATH)


def extract_municipios():
    return pd.read_csv(MUNICIPIOS_PATH)


def extract_categorias():
    return pd.read_csv(CATEGORIAS_PATH)


def extract_prioridades():
    return pd.read_csv(PRIORIDADES_PATH)