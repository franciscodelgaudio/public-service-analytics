CREATE TABLE municipios (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    populacao INTEGER
);

CREATE TABLE categorias (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE prioridades (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    nivel INTEGER NOT NULL UNIQUE
);

CREATE TABLE chamados (
    id BIGSERIAL PRIMARY KEY,

    municipio_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    prioridade_id INTEGER NOT NULL,

    status VARCHAR(30) NOT NULL,

    data_abertura TIMESTAMP NOT NULL,
    data_fechamento TIMESTAMP,

    tempo_atendimento NUMERIC(10, 2),

    CONSTRAINT fk_chamado_municipio
        FOREIGN KEY (municipio_id)
        REFERENCES municipios(id),

    CONSTRAINT fk_chamado_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id),

    CONSTRAINT fk_chamado_prioridade
        FOREIGN KEY (prioridade_id)
        REFERENCES prioridades(id)
);

CREATE SCHEMA IF NOT EXISTS analytics;


-- =====================================================
-- DIMENSÃO MUNICÍPIO
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics.dim_municipio (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    uf CHAR(2) NOT NULL,
    populacao INTEGER
);


-- =====================================================
-- DIMENSÃO CATEGORIA
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics.dim_categoria (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);


-- =====================================================
-- DIMENSÃO PRIORIDADE
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics.dim_prioridade (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    nivel INTEGER NOT NULL
);


-- =====================================================
-- DIMENSÃO TEMPO
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics.dim_tempo (
    data DATE PRIMARY KEY,
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    nome_mes VARCHAR(20) NOT NULL,
    trimestre INTEGER NOT NULL
);


-- =====================================================
-- FATO CHAMADOS
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics.fact_chamados (
    id INTEGER PRIMARY KEY,

    municipio_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    prioridade_id INTEGER NOT NULL,

    status VARCHAR(30) NOT NULL,

    data_abertura DATE NOT NULL,
    data_fechamento DATE,

    tempo_atendimento NUMERIC(10, 2),

    dentro_sla BOOLEAN NOT NULL,

    CONSTRAINT fk_municipio
        FOREIGN KEY (municipio_id)
        REFERENCES analytics.dim_municipio(id),

    CONSTRAINT fk_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES analytics.dim_categoria(id),

    CONSTRAINT fk_prioridade
        FOREIGN KEY (prioridade_id)
        REFERENCES analytics.dim_prioridade(id)
);