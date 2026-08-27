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