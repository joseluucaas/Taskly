# 📝 Taskly

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-informational)

O **Taskly** é uma aplicação full-stack de gerenciamento de tarefas, o projeto aplica arquitetura de APIs REST, TypeScript, autenticação, segurança, banco de dados relacional e boas práticas de engenharia de software.

---

## 📚 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack utilizada](#-stack-utilizada)
- [Princípios de engenharia](#-princípios-de-engenharia)
- [Arquitetura](#-arquitetura)
- [Executando localmente com Docker](#-executando-localmente-com-docker)
- [Modelagem do banco de dados](#-modelagem-do-banco-de-dados)
- [Execução manual para desenvolvimento](#-execução-manual-para-desenvolvimento)
- [API e endpoints](#-api-e-endpoints)
- [Segurança](#-segurança)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Roadmap](#-roadmap)
- [Autor](#-autor)

---

## 📖 Sobre o projeto

Cada pessoa possui uma área privada para organizar tarefas, categorias e etiquetas, acompanhar indicadores no dashboard, registrar comentários e consultar notificações.

Além das funcionalidades, a API possui autenticação JWT com refresh token, autorização por recurso, validação de dados, tratamento global de erros, testes de integração e documentação interativa.

---

## ✨ Funcionalidades

### 👤 Autenticação

- Cadastro, login, logout e renovação de sessão.
- Hash de senhas com bcrypt.
- Access token JWT e refresh token.
- Proteção de rotas e rate limit no login.

### 📝 Tarefas e organização

- CRUD de tarefas com descrição, prazo e status.
- Paginação, busca por título e descrição, filtros por status, período e ordenação.
- Categorias com cor e vínculo opcional.
- Etiquetas com relação muitos-para-muitos.
- Comentários em tarefas.
- Dashboard com métricas e próximas tarefas.
- Notificações internas com leitura e exclusão.

### 🛡️ Qualidade da API

- Validação com Zod e respostas padronizadas.
- Middleware global de erros e logs estruturados com Winston.
- Swagger/OpenAPI e health check.
- 20 testes de integração em oito suítes.

---

## 🛠 Stack utilizada

**Back-end**

- [Node.js](https://nodejs.org/) : ambiente de execução;
- [Express](https://expressjs.com/) : framework do servidor HTTP.
- [TypeScript](https://www.typescriptlang.org/) : com ESM/`nodenext` — tipagem estática.
- [Prisma](https://www.prisma.io/) : ORM para comunicação com o banco.
- [PostgreSQL](https://www.postgresql.org/) : banco de dados relacional.
- [Docker](https://www.docker.com/) : execução local do front-end, back-end e PostgreSQL.
- [bcrypt](https://www.npmjs.com/package/bcrypt) e [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : autenticação.
- [Zod](https://zod.dev/), [Swagger/OpenAPI](https://swagger.io/), Winston, Helmet, CORS e express-rate-limit : qualidade e segurança.
- [Jest](https://jestjs.io/) + [Supertest](https://www.npmjs.com/package/supertest) : testes automatizados.

**Front-end — interface integrada à API**

- [React](https://react.dev/) : construção da interface.
- [TypeScript](https://www.typescriptlang.org/) : tipagem estática.
- [Vite](https://vite.dev/) : ambiente de desenvolvimento e build.
- CSS com variáveis de tema : estilização responsiva e temas claro/escuro.
- [Axios](https://axios-http.com/) : consumo da API e renovação de sessão.
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) formulários e validação.
- [Lucide](https://lucide.dev/) e [Framer Motion](https://motion.dev/) : ícones e animações.

---

## 🧩 Princípios de engenharia

O Taskly aplica padrões de engenharia de forma pragmática, priorizando legibilidade, testes e manutenção. O projeto não se apresenta como uma implementação formal de Clean Architecture a organização descrita abaixo corresponde ao código existente.

**Clean Code e qualidade**

- Nomes semânticos, funções com responsabilidades delimitadas e respostas de API padronizadas.
- TypeScript com modo estrito, ESLint/Oxlint e Prettier.
- Validação centralizada com Zod e tratamento global de erros.
- Testes de integração no back-end e tipagem explícita nas integrações do front-end.

**SOLID e orientação a objetos — back-end**

- **SRP:** rotas, middlewares, controllers e services possuem responsabilidades separadas;
- **DIP aplicado nas fronteiras HTTP:** controllers recebem services por injeção de dependência, configurada em um ponto único de composição (`src/container.ts`).
- **POO:** controllers, services e erros de domínio são modelados por classes, com encapsulamento de regras internas.
- **OCP de forma prática:** novos recursos podem adicionar rotas, services e controllers sem alterar o fluxo central da aplicação.

**Composição e separação de responsabilidades — front-end**

- Componentes funcionais React, hooks e services para consumo da API.
- Componentes reutilizáveis para elementos de interface, como `Dialog` e `ConfirmDialog`.
- Separação entre apresentação, estado de tela e integrações HTTP.
- O front-end privilegia composição de componentes em vez de classes, que é o padrão atual recomendado pelo React.

---

## 🏗 Arquitetura

```mermaid
flowchart TB
    Client["Cliente / Front-end React"]
    Container["Container de composição"]
    subgraph API["Back-end · Express"]
      Routes["Routes"] --> Middlewares["Middlewares"] --> Controllers["Controllers"] --> Services["Services"] --> Prisma["Prisma Client"]
    end
    Container -. injeta dependências .-> Controllers
    DB[("PostgreSQL")]
    Client -- HTTP/JSON --> Routes
    Prisma --> DB
```

Routes definem endpoints, middlewares tratam autenticação, validação e erros, controllers lidam com HTTP, services concentram regras de negócio, e Prisma acessa o banco. Essa separação reduz acoplamento e facilita testes e manutenção.

---

## 🐳 Executando localmente com Docker

O Docker executa o front-end, o back-end e o PostgreSQL em containers separados, isso permite reproduzir a aplicação completa em qualquer máquina com Docker instalado.

### 1. Configure as variáveis locais

Se ainda não existir um arquivo `.env` na raiz, crie-o a partir do exemplo e altere a senha e o segredo antes de iniciar:

```bash
cp .env.example .env
```

No PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Se o seu `.env` já existir, não o sobrescreva: use o `.env.example` como referência e adicione as variáveis que estiverem faltando, especialmente `JWT_SECRET`.

Preencha obrigatoriamente `POSTGRES_PASSWORD` e `JWT_SECRET` com valores próprios, para gerar um segredo no PowerShell.

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

Cole o resultado em `JWT_SECRET`. O arquivo `.env` é local e não deve ser enviado ao Git.

### 2. Inicie a aplicação completa

```bash
docker compose up -d --build
```

Na primeira execução, o Docker cria o banco, aguarda o PostgreSQL ficar saudável, aplica as migrations do Prisma, inicia a API e só então inicia o front-end, 0s três serviços usam a rede interna `taskly-net`.

- Front-end: `http://localhost:5173`
- API: `http://localhost:8080`
- Health check: `http://localhost:8080/health`
- PostgreSQL: `localhost:5432`

Confira o estado dos serviços antes de abrir a aplicação.

```bash
docker compose ps
```

O esperado é `postgres` e `backend` com status `healthy` e `frontend` em execução. Caso algum serviço não inicie, consulte os logs.

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

Para encerrar os containers mantendo os dados do banco.

```bash
docker compose down
```

Para apagar também os dados locais do PostgreSQL e começar do zero.

```bash
docker compose down -v
```

> Atenção: `docker compose down -v` remove permanentemente o banco local criado pelo Docker.

---

## 🗃 Modelagem do banco de dados

```mermaid
erDiagram
    USER ||--o{ TASK : possui
    USER ||--o{ CATEGORY : cria
    USER ||--o{ TAG : cria
    USER ||--o{ NOTIFICATION : recebe
    USER ||--o{ REFRESH_TOKEN : possui
    USER ||--|| USER_PREFERENCE : configura
    TASK }o--|| CATEGORY : pertence
    TASK }o--o{ TAG : recebe
    TASK ||--o{ COMMENT : possui
    USER {
        string id PK
        string name
        string email UK
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }
    USER_PREFERENCE {
        string id PK
        string language
        string theme
        boolean soundEnabled
        boolean notificationsEnabled
        boolean dueDateReminders
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
    TASK {
        string id PK
        string title
        string description
        boolean completed
        datetime dueDate
        string userId FK
        string categoryId FK
        datetime createdAt
        datetime updatedAt
    }
    CATEGORY {
        string id PK
        string name
        string color
        string userId FK
    }
    TAG {
        string id PK
        string name
        string color
        string userId FK
    }
    COMMENT {
        string id PK
        string content
        string taskId FK
        datetime createdAt
        datetime updatedAt
    }
    NOTIFICATION {
        string id PK
        string title
        string message
        datetime readAt
        string userId FK
    }
    REFRESH_TOKEN {
        string id PK
        string token UK
        datetime expiresAt
        string userId FK
    }
```

Um `User` pode possuir várias tarefas, categorias, etiquetas, notificações e refresh tokens, além de uma única preferência de uso. Cada tarefa pertence a um usuário, pode ter uma categoria, várias etiquetas e vários comentários, as consultas consideram o `userId` autenticado, impedindo acesso ou associação indevida a recursos de outra conta, as exclusões em cadeia removem os recursos dependentes de uma conta ou tarefa, ao excluir uma categoria a tarefa permanece e sua categoria é removida.

---

## 💻 Execução manual para desenvolvimento

Para conhecer e executar o projeto completo, prefira o fluxo com Docker acima, o fluxo manual abaixo é opcional e útil para desenvolver ou acessar o Swagger, que é exposto apenas com `NODE_ENV=development`.

### Pré-requisitos

- Node.js 20 ou superior.
- Docker Desktop.
- Git.

```bash
git clone https://github.com/joseluucaas/taskly.git
cd taskly
docker compose up -d postgres
cd backend
npm install
```

Crie `backend/.env`. Para conectar ao PostgreSQL iniciado pelo Compose, use as mesmas credenciais definidas no `.env` da raiz:

```env
DATABASE_URL="postgresql://taskly:SUA_POSTGRES_PASSWORD@localhost:5432/taskly?schema=public"
JWT_SECRET="SEU_JWT_SECRET"
NODE_ENV=development
PORT=8080
FRONTEND_URL="http://localhost:5173,http://127.0.0.1:5173"
```

```bash
npx prisma migrate dev
npm run dev
```

Em outro terminal.

```bash
cd frontEnd
npm install
npm run dev
```

O front-end ficará disponível em `http://localhost:5173`, a API em `http://localhost:8080` e o Swagger em `http://localhost:8080/api-docs`, para validar o back-end, use `npm test`, `npm run build` e `npm run lint` dentro de `Backend`, no front-end, use `npm run build` e `npm run lint` dentro de `FrontEnd`.

---

## 🔌 API e endpoints

Rotas protegidas exigem `Authorization: Bearer <accessToken>`.

| Grupo        | Método         | Endpoint                      | Descrição                                                      |
| ------------ | -------------- | ----------------------------- | -------------------------------------------------------------- |
| Auth         | POST           | `/auth/register`              | Cadastra um usuário                                            |
| Auth         | POST           | `/auth/login`                 | Retorna access e refresh token                                 |
| Auth         | POST           | `/auth/refresh`               | Renova o access token                                          |
| Auth         | POST           | `/auth/logout`                | Invalida o refresh token                                       |
| Conta        | GET/PATCH      | `/users/me`                   | Consulta ou atualiza nome e e-mail do perfil                   |
| Conta        | PATCH          | `/users/me/preferences`       | Salva idioma, tema, sons e preferências de notificações        |
| Conta        | PATCH          | `/users/me/password`          | Altera a senha e encerra as sessões ativas                     |
| Conta        | POST           | `/users/me/logout-all`        | Encerra todas as sessões da conta                              |
| Tarefas      | POST/GET       | `/tasks`                      | Cria ou lista tarefas; `search` busca no título e na descrição |
| Tarefas      | GET/PUT/DELETE | `/tasks/:id`                  | Gerencia uma tarefa                                            |
| Dashboard    | GET            | `/dashboard`                  | Retorna métricas e próximas tarefas                            |
| Categorias   | GET/POST       | `/categories`                 | Lista ou cria categorias                                       |
| Categorias   | GET/PUT/DELETE | `/categories/:id`             | Gerencia categoria                                             |
| Etiquetas    | GET/POST       | `/tags`                       | Lista ou cria etiquetas                                        |
| Etiquetas    | GET/PUT/DELETE | `/tags/:id`                   | Gerencia etiqueta                                              |
| Comentários  | GET/POST       | `/tasks/:taskId/comments`     | Lista ou cria comentários                                      |
| Comentários  | PUT/DELETE     | `/tasks/:taskId/comments/:id` | Gerencia comentário                                            |
| Notificações | GET            | `/notifications`              | Lista notificações                                             |
| Notificações | PATCH          | `/notifications/:id/read`     | Marca como lida                                                |
| Notificações | DELETE         | `/notifications/:id`          | Exclui notificação                                             |
| Sistema      | GET            | `/health`                     | Verifica a saúde da API                                        |

Na listagem de tarefas, os parâmetros opcionais são `page`, `limit`, `completed`, `search`, `dueDateFrom`, `dueDateTo`, `sort` e `order`. A busca considera o título e a descrição; os filtros de data usam o formato `dia-mês-ano`.

---

### Documentação da API

O Taskly utiliza Swagger/OpenAPI para documentar e testar a API diretamente pelo navegador.

Em ambiente de desenvolvimento, a documentação está disponível em.

- Swagger UI: `http://localhost:8080/api-docs`.
- OpenAPI JSON: `http://localhost:8080/openapi.json`.
- Atalho: `http://localhost:8080/docs`.

A interface permite visualizar e testar os endpoints, informando o Bearer Token quando necessário, por segurança ela não é exposta pelo container do back-end, que executa com `NODE_ENV=production`, nela é possível consultar:

- endpoints de autenticação, tarefas, dashboard, categorias, etiquetas, comentários e notificações.
- parâmetros de consulta de paginação, filtros e ordenação.
- autenticação via JWT Bearer Token.
- corpos de requisição, respostas e códigos HTTP.
- modelos utilizados pela API.

A integração utiliza `swagger-jsdoc` para gerar a especificação e `swagger-ui-express` para disponibilizar a interface interativa.

---

## 📦 Padronização das respostas

```json
{ "success": true, "data": {} }
```

Listagens paginadas acrescentam `meta` com dados como página atual, limite e total. Endpoints de exclusão bem-sucedidos retornam `204 No Content`. Erros seguem este formato:

```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Tarefa não encontrada",
    "details": null
  }
}
```

---

## 🔒 Segurança

- Senhas protegidas com bcrypt; nunca são armazenadas em texto puro.
- JWT e refresh tokens para sessões.
- Refresh tokens persistidos e invalidados no logout ou no encerramento de sessões.
- Autorização por recurso via `userId`.
- Zod valida entradas antes das regras de negócio.
- Helmet, CORS e limite de JSON de 100 KB.
- Em produção, `FRONTEND_URL` é obrigatória para restringir CORS.
- Rate limit contra tentativas repetidas de login.
- Segredos ficam em variáveis de ambiente, fora do Git.
- Erros possuem códigos previsíveis sem expor detalhes internos.
- Health checks e reinício automático dos containers para a execução local.

---

## 📂 Estrutura de pastas

```text
Taskly/
├── Backend/
│   ├── prisma/                 # schema, migrations e seed
│   ├── src/
│   │   ├── config/             # Prisma, logs e Swagger
│   │   ├── container.ts         # composição das dependências da aplicação
│   │   ├── controllers/        # camada HTTP
│   │   ├── errors/             # erros da aplicação
│   │   ├── generated/          # Prisma Client gerado automaticamente
│   │   ├── middlewares/        # autenticação, validação e erros
│   │   ├── routes/             # endpoints
│   │   ├── schemas/            # validações Zod
│   │   ├── services/           # regras de negócio
│   │   ├── types/              # tipos globais
│   │   ├── utils/              # respostas padronizadas
│   │   ├── app.ts              # configuração do Express
│   │   └── server.ts           # inicialização do servidor
│   ├── tests/                  # testes de integração
│   ├── eslint.config.ts
│   ├── jest.config.mjs
│   ├── package.json
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   └── Dockerfile              # imagem de produção do back-end
├── FrontEnd/
│   ├── src/
│   │   ├── components/ui/      # diálogos reutilizáveis
│   │   ├── services/           # integrações HTTP e sons da interface
│   │   ├── App.tsx             # composição das telas e estado principal
│   │   └── App.css             # estilos e temas da aplicação
│   ├── package.json
│   └── Dockerfile              # build Vite e servidor Nginx
├── docker-compose.yml          # front-end, back-end e PostgreSQL locais
├── .env.example                # variáveis necessárias ao Docker Compose
├── .gitignore
└── README.md
```

---

## 🗺 Roadmap

## Back-end

- [x] **Configuração do ambiente**
  - [x] TypeScript com ESM (`nodenext`)
  - [x] ESLint + Prettier
- [x] **Banco de dados**
  - [x] Prisma + PostgreSQL via Docker
  - [x] Modelagem de `User`, `Task`, `Category`, `Tag`, `Comment`, `Notification`, `RefreshToken` e `UserPreference`
  - [x] Migrations aplicadas
- [x] **Servidor e arquitetura**
  - [x] Express configurado
  - [x] Rota de health check
  - [x] Arquitetura em camadas
  - [x] Container Docker do back-end com migrations automáticas
- [x] **Autenticação**
  - [x] Cadastro, login e proteção por JWT
  - [x] Refresh token, renovação de sessão e logout
  - [x] Rate limiting no login
- [x] **Tarefas e organização**
  - [x] CRUD de tarefas
  - [x] Paginação, filtros e ordenação
  - [x] Dashboard de tarefas
  - [x] Categorias e etiquetas
  - [x] Comentários e notificações
- [x] **Tratamento de erros e validação**
  - [x] Error handler centralizado
  - [x] Validação com Zod em todas as rotas
  - [x] Respostas padronizadas e logs estruturados
- [x] **Testes automatizados**
  - [x] Testes de autenticação, tarefas, dashboard e recursos auxiliares
  - [x] 20 testes de integração
- [x] **Documentação da API**
  - [x] Swagger/OpenAPI, Swagger UI e OpenAPI JSON
  - [x] Documentação das rotas implementadas
- [x] **Segurança**
  - [x] Helmet, CORS, limite de JSON e autorização por recurso

## Front-end

- [x] **Configuração do ambiente**
  - [x] React + TypeScript + Vite
  - [x] Organização inicial de componentes e serviços
  - [x] Container Docker para execução local
  - [x] Configurações de tema, idioma, sons, exibição e acessibilidade
- [x] **Autenticação**
  - [x] Telas de cadastro e login conectadas à API
  - [x] Logout e armazenamento local da sessão
  - [x] Tema inicial conforme o sistema e idioma PT/EN
  - [x] Perfil editável, preferências persistentes e controles de segurança
- [x] **Dashboard inicial**
  - [x] Métricas, listagem e conclusão de tarefas pela API
  - [x] Animação de boas-vindas após a autenticação
- [x] **Gerenciamento de tarefas**
  - [x] CRUD, busca por título e descrição e alteração de status
  - [x] Categorias, etiquetas, comentários e notificações conectados à API
  - [ ] Filtros avançados, paginação e ordenação na interface
- [ ] **Qualidade**
  - [x] Estados de vazio e tratamento inicial de erros
  - [ ] Acessibilidade completa e estados de carregamento avançados
  - [ ] Testes de interface

---

### Commits

Este projeto segue a convenção [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) facilitando a leitura do histórico e a identificação de cada mudança.

| Prefixo     | Uso                                             |
| ----------- | ----------------------------------------------- |
| `feat:`     | Nova funcionalidade                             |
| `fix:`      | Correção de bug                                 |
| `refactor:` | Reorganização de código sem mudar comportamento |
| `docs:`     | Mudanças na documentação                        |
| `chore:`    | Configuração e tarefas de manutenção            |
| `test:`     | Adição ou ajuste de testes                      |

---

## 👤 Autor

**José Lucas**

Desenvolvedor Full-Stack
