# StockWallet 📈

O **StockWallet** é uma plataforma completa de análise de investimentos que combina **análise fundamentalista** e **técnica** para auxiliar na tomada de decisão. O sistema calcula o Preço Justo de ativos, monitora tendências com Médias Móveis (EMA) e oferece um dashboard visual com indicadores financeiros.

## 🚀 Funcionalidades

- **Dashboard Interativo**: Acompanhamento visual de ativos com cards informativos.
- **Análise Técnica**: Gráficos com Médias Móveis Exponenciais (EMA50 e EMA200) para identificar tendências.
- **Análise Fundamentalista**: Tabela completa com indicadores como P/L, P/VP, ROE, Dividend Yield, Valuation, etc.
- **Cálculo de Preço Justo**: Algoritmo automático (baseado na fórmula de Graham) para estimar o valor intrínseco da ação.
- **Watchlist Inteligente**: Adicione e monitore seus ativos favoritos.
- **Atualização Automática**: Cron jobs configurados para atualizar cotações e indicadores periodicamente.

## 🛠️ Tecnologias

- **Backend**: Node.js, Express
- **Frontend**: EJS (Server-side rendering), CSS3, Chart.js
- **Banco de Dados**: MongoDB
- **Infraestrutura**: Docker, Docker Compose
- **Dados**: Integração com Yahoo Finance
- **Documentação**: Swagger UI

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) e Docker Compose

## 🔧 Instalação e Execução Local

Siga este passo a passo para rodar o projeto localmente de forma segura, sem expor suas credenciais.

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/StockWallet.git
cd StockWallet
```

### 2. Configuração de Variáveis de Ambiente (.env)

⚠️ **IMPORTANTE:** Nunca commite seu arquivo `.env`. Ele contém senhas e chaves sensíveis.

Crie um arquivo chamado `.env` na raiz do projeto. Você pode copiar o modelo abaixo:

**Arquivo `.env`:**

```ini
# Configuração do Servidor
PROXY_PORT=3000

# Configuração do Banco de Dados (URI para a aplicação)
# Formato: mongodb://usuario:senha@host:porta/database?authSource=admin
MONGO_URI=mongodb://admin:minha_senha_segura@localhost:27017/stockwallet?authSource=admin

# Credenciais para o container do MongoDB (Docker)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=minha_senha_segura
```

> **Nota:** Certifique-se de que a senha definida em `MONGO_ROOT_PASSWORD` seja a mesma usada na `MONGO_URI`.

### 3. Subir o Banco de Dados (MongoDB)

Utilize o Docker Compose para iniciar o banco de dados com as credenciais que você definiu no `.env`. O arquivo `docker-compose.yml` já está configurado para ler essas variáveis.

```bash
docker-compose up -d
```

Isso iniciará um container MongoDB na porta `27017`.

### 4. Instalar Dependências e Rodar a Aplicação

Instale os pacotes do Node.js e inicie o servidor:

```bash
npm install
npm run dev
```

O servidor iniciará em `http://localhost:3000`.

## 📖 Documentação da API

O projeto possui documentação interativa via Swagger.
Após iniciar a aplicação, acesse:

👉 **http://localhost:3000/docs**

## 🔄 Cron Jobs

O sistema possui um agendamento automático (Cron Job) que roda diariamente às 11:00 AM para atualizar os preços e indicadores de todos os ativos cadastrados na base.

## 🛡️ Segurança e Boas Práticas

- O arquivo `.env` é listado no `.gitignore` para evitar vazamento de credenciais.
- As senhas do banco de dados são injetadas via variáveis de ambiente no container Docker.
- O acesso ao banco é protegido por autenticação.

## 📂 Estrutura do Projeto

```
StockWallet/
├── docker-compose.yml   # Configuração dos serviços Docker
├── Dockerfile           # (Opcional) Para containerizar a app
├── server.js            # Ponto de entrada da aplicação
├── src/
│   ├── controllers/     # Lógica de controle das rotas
│   ├── models/          # Conexão e Schemas do Banco
│   ├── routes/          # Definição das rotas da API
│   ├── services/        # Regras de negócio (Cálculos, Yahoo Finance)
│   └── views/           # Templates EJS (Frontend)
└── swagger.yaml         # Especificação da API
```
