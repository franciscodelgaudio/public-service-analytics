# Public Service Analytics

Pipeline de dados e dashboard analítico para chamados de serviços públicos municipais (iluminação, obras, saúde, transporte, etc). O projeto cobre o fluxo completo: extração de dados brutos, validação de qualidade, transformação em modelo dimensional, carga em um data warehouse Postgres e visualização em um dashboard web.

## Arquitetura

```
data/raw/            → CSVs de origem (chamados, municípios, categorias, prioridades)
pipeline/             → ETL em Python (extract → validate → transform → load)
data/processed/       → Saída da validação (chamados válidos / rejeitados)
sql/schema.sql        → Schema operacional + esquema estrela "analytics" (Postgres)
frontend/             → Dashboard em Next.js consumindo o warehouse via API routes
docker-compose.yml    → Container Postgres para desenvolvimento local
```

O pipeline carrega os dados em um esquema estrela (`analytics`) com uma tabela fato (`fact_chamados`) e dimensões de município, categoria, prioridade e tempo. O frontend lê diretamente desse schema via SQL.

## Stack

- **Pipeline**: Python, pandas, SQLAlchemy, psycopg2
- **Banco**: PostgreSQL 18 (via Docker)
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Recharts, node-postgres (`pg`)

## Pré-requisitos

- Docker
- Python 3.14+
- Node.js 20+

## Como rodar

### 1. Subir o banco de dados

```bash
docker compose up -d
```

Isso inicia um Postgres em `localhost:5432`. Em seguida, aplique o schema:

```bash
psql -h localhost -U postgres -d postgres -f sql/schema.sql
```

### 2. Rodar o pipeline de dados

```bash
pip install pandas sqlalchemy psycopg2-binary faker
python -m pipeline.generate_data   # opcional: gera dados fictícios em data/raw
python -m pipeline.main            # extract → validate → transform → load
```

O pipeline imprime o total de chamados extraídos, válidos e rejeitados, e carrega os dados no schema `analytics`.

### 3. Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O app lê a variável `DATABASE_URL` de `frontend/.env.local` (não versionado) para se conectar ao Postgres.

## Qualidade de dados

A etapa de validação (`pipeline/validate.py`) identifica e separa registros com problemas como:

- IDs duplicados
- Tempo de atendimento negativo
- Data de fechamento anterior à abertura
- Status inválido
- Município, categoria ou prioridade ausente/inexistente
- Chamado "resolvido" sem data de fechamento

Registros válidos e rejeitados são salvos em `data/processed/` para auditoria.

## Dashboard

O dashboard exibe:

- KPIs gerais (total de chamados, resolvidos, tempo médio/mediano de atendimento, % dentro do SLA)
- Chamados por mês e tempo médio de atendimento por mês
- Ranking de chamados por categoria e por município
- Performance (tempo médio e % dentro do SLA) por prioridade

SLA é calculado com limite de 5 dias para chamados resolvidos (`pipeline/transform.py`).

## Nota de segurança

A credencial do Postgres usada em desenvolvimento está hardcoded em `docker-compose.yml` e `pipeline/load.py`. Antes de qualquer uso além do ambiente local, mova para variáveis de ambiente/segredos e rotacione a senha.
