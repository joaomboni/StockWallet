# API Busca Dados — Fundamentus

API em Node.js/Express para consultar dados financeiros (Yahoo Finance), calcular o "Preço Justo" e persistir resultados no MongoDB. A documentação interativa está disponível via Swagger UI em `/docs`.

## Sumário
- Visão geral
- Funcionalidades
- Arquitetura e Fluxo
- Requisitos
- Instalação
- Configuração (.env)
- Executando o projeto
- Documentação (Swagger UI)
- Endpoints principais (com exemplos)
- Banco de dados e persistência
- Cálculo do Preço Justo
- Tratamento de erros
- Dicas e solução de problemas
- Scripts npm
- Estrutura do projeto
- Licença

## Visão geral
Este serviço expõe endpoints para:
- Obter indicadores básicos de um ativo (via Yahoo Finance);
- Calcular o Preço Justo de um ativo a partir de VPA e LPA (calculado a partir de preço e P/L);
- Salvar/atualizar o resultado no MongoDB;
- Excluir um resultado salvo pelo símbolo (ticker).

Base path da API: `/api`

## Funcionalidades
- Consulta de fundamentos (P/L, LPA estimado, P/VPA, VPA, Dividend Yield e preço atual).
- Cálculo de Preço Justo e upsert no MongoDB (coleção `precos`).
- Limite de até 5 registros persistidos (para controle e simplicidade).
- Exclusão de registro por `symbol`.

## Arquitetura e Fluxo
- Node.js + Express
- Yahoo Finance (pacote `yahoo-finance2`) para dados de mercado
- MongoDB (driver oficial) para persistência
- Swagger UI integrado via `swagger-ui-express` em `/docs`

Fluxo do cálculo:
1. Buscar fundamentos do símbolo informado no Yahoo Finance;
2. Calcular LPA aproximado como `price / P/L` quando ambos disponíveis;
3. Calcular `Preço Justo = sqrt(VPA * LPA * 22.05)`;
4. Salvar/atualizar documento em `precos` (chave por `symbol`).

## Requisitos
- Node.js 18+ (recomendado)
- npm 8+
- MongoDB em execução (local ou remoto)

## Instalação
1. Clonar o repositório (ou abrir a pasta do projeto).
2. Instalar dependências:
   ```bash
   npm install
   ```

## Configuração (.env)
Crie um arquivo `.env` na raiz do projeto (baseie-se em `.env-example` se existir) com as variáveis:
```
PROXY_PORT=3000
MONGO_URI=mongodb://localhost:27017
MONGO_DB=fundamentus
```
- `PROXY_PORT` define a porta do servidor Express.
- `MONGO_URI` string de conexão do MongoDB.
- `MONGO_DB` nome do banco usado pelo app.

## Executando o projeto
- Desenvolvimento (auto-reload com nodemon):
  ```bash
  npm run dev
  ```
- Produção / execução simples:
  ```bash
  npm start
  ```

Se tudo estiver correto, você verá algo como:
```
📦 MongoDB conectado com sucesso!
Example app listening on port 3000
```

## Documentação (Swagger UI)
Acesse a documentação interativa em:
```
http://Endereço:<PROXY_PORT>/docs
```
O arquivo OpenAPI está em `./swagger.yaml`. Você também pode abrir no editor online: https://editor.swagger.io (File > Import File) se preferir.

## Endpoints principais (com exemplos)
Base URL: `http://localhost:<PROXY_PORT>`

- GET `/api/hello-world`
  - Retorna uma saudação simples.
  - Exemplo:
    ```bash
    curl http://Endereço:<PORT>/api/hello-world
    ```
  - 200 OK: `Hello World!`

- POST `/api/api-busca?symbol=<TICKER>`
  - Consulta fundamentos no Yahoo Finance.
  - Parâmetros:
    - `symbol` (query) — ex.: `PETR4.SA`, `AAPL`.
  - Exemplo:
    ```bash
    curl -X POST "http://endreço:<port>/api/api-busca?symbol=PETR4.SA"
    ```
  - 200 OK (exemplo de resposta):
    ```json
    {
      "symbol": "PETR4.SA",
      "pl": 12.34,
      "lpa": 1.56,
      "pvp": 1.8,
      "vpa": 10.2,
      "dividendYield": 0.03,
      "price": 19.2
    }
    ```

- POST `/api/preco-justo?symbol=<TICKER>`
  - Calcula o Preço Justo e salva/atualiza no MongoDB.
  - Parâmetros: `symbol` (query).
  - Exemplo:
    ```bash
    curl -X POST "http://endreço:<port>/api/preco-justo?symbol=PETR4.SA"
    ```
  - 200 OK (exemplo de resposta):
    ```json
    {
      "symbol": "PETR4.SA",
      "precoJusto": 14.8,
      "fundamentos": {
        "pl": 12.34,
        "lpa": 1.56,
        "pvp": 1.8,
        "vpa": 10.2,
        "dividendYield": 0.03,
        "price": 19.2
      }
    }
    ```

- DELETE `/api/delete?symbol=<TICKER>`
  - Exclui o registro de Preço Justo para o símbolo informado.
  - Parâmetros: `symbol` (query).
  - Exemplo:
    ```bash
    curl -X DELETE "http://endreço:<port>/api/delete?symbol=PETR4.SA"
    ```
  - 200 OK (exemplo):
    ```json
    { "message": "Registro com symbol PETR4.SA deletado com sucesso." }
    ```

Para detalhes completos de schemas e exemplos, consulte o Swagger em `/docs` ou o `swagger.yaml`.

## Banco de dados e persistência
- Conexão: `src/models/connect.js` lê `MONGO_URI`/`MONGO_DB` do `.env` e mantém um cliente compartilhado (`getDatabase()`).
- Coleção: `precos`.
- Persistência do cálculo: `updateOne({ symbol }, { $set: { ... } }, { upsert: true })` — atualiza ou cria o documento por `symbol`.
- Limite de registros: até 5 documentos.

## Cálculo do Preço Justo
Implementação em `src/services/precoJusto.js`:
- Busca fundamentos via `src/services/yahoo.js` (Yahoo Finance v3);
- LPA estimado: `lpa = price / pl` quando ambos existem, senão `null`;
- Fórmula: `Preço Justo = sqrt(vpa * lpa * 22.05)`;
- Caso `vpa` ou `lpa` sejam `null`, a API retorna erro 400 com mensagem adequada.

## Tratamento de erros
- Respostas de erro seguem o formato:
  ```json
  { "error": "Mensagem descritiva" }
  ```
- Principais situações:
  - Dados insuficientes para cálculo do Preço Justo;
  - Conexão com MongoDB indisponível;
  - Registro inexistente ao tentar deletar por `symbol`;
  - Parâmetro `symbol` ausente.

## Dicas e solução de problemas
- Swagger não abre/atualiza:
  - Acesse `http://endereço:<PROXY_PORT>/docs`;
  - Force refresh (Ctrl+F5 / Cmd+Shift+R);
  - Garanta que o servidor foi reiniciado após editar `swagger.yaml` (em dev com nodemon recarrega).
- Conexão MongoDB falhando:
  - Verifique `MONGO_URI`/`MONGO_DB` no `.env`;
  - Confirme que o serviço MongoDB está em execução;
  - Teste a conexão com uma ferramenta cliente.
- Yahoo Finance retornando valores `null`:
  - Nem todos os símbolos possuem todos os indicadores; tente outro ticker ou mercado.
- Porta ocupada:
  - Ajuste `PROXY_PORT` no `.env` e reinicie.

## Scripts npm
- `npm start` — inicia o servidor (`server.js`).
- `npm run dev` — inicia com `nodemon` para recarregar em mudanças.

## Estrutura do projeto (resumo)
```
.
├── server.js
├── swagger.yaml
├── src
│   ├── controllers
│   │   └── controller.js
│   ├── models
│   │   └── connect.js
│   ├── routes
│   │   └── routes.js
│   └── services
│       ├── precoJusto.js
│       └── yahoo.js
├── package.json
└── README.md
```

## Licença
Nenhuma licença explícita definida neste repositório. Considere adicionar uma (por exemplo, MIT) conforme sua necessidade.
