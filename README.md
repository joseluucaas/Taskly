# 📝 Todo List Full-Stack

Aplicação de gerenciamento de tarefas com autenticação de usuários, construída como projeto de estudo aprofundado em back-end, com foco em **Clean Code**, **SOLID** e **Programação Orientada a Objetos**.

> 🚧 Projeto em desenvolvimento ativo. Este README é atualizado conforme novas partes são construídas.

---

## 📚 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Stack utilizada](#-stack-utilizada)
- [Arquitetura](#-arquitetura)
- [Modelagem do banco de dados](#-modelagem-do-banco-de-dados)
- [Como rodar o projeto localmente](#-como-rodar-o-projeto-localmente)
- [API e Endpoints](#-api-e-endpoints)
- [Segurança](#-segurança)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Roadmap](#-roadmap)
- [Convenções e Padrões](#-convenções-e-padrões)
- [Autor](#-autor)

---

## 📖 Sobre o projeto

Uma lista de tarefas (to-do list) onde cada usuário se cadastra, faz login, e gerencia suas próprias tarefas — com título, descrição, prazo e status de conclusão.

O objetivo principal deste projeto **não é só a funcionalidade em si**, mas o processo de construí-la seguindo boas práticas de arquitetura de back-end: separação de responsabilidades (controllers, services, repositories), tipagem forte com TypeScript, autenticação segura com hash de senha e JWT, e modelagem de dados relacional.

---

## 🛠 Stack utilizada

**Back-end**
- [Node.js](https://nodejs.org/) — ambiente de execução
- [Express 5](https://expressjs.com/) — framework do servidor HTTP
- [TypeScript](https://www.typescriptlang.org/) (ESM/`nodenext`) — tipagem estática
- [Prisma 6](https://www.prisma.io/) — ORM (mapeamento objeto-relacional)
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
- [Docker](https://www.docker.com/) — containerização do banco em ambiente local
- [bcrypt](https://www.npmjs.com/package/bcrypt) — hash de senhas
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — autenticação via JWT
- [Zod](https://zod.dev/) — validação de dados de entrada
- [Jest](https://jestjs.io/) + [Supertest](https://www.npmjs.com/package/supertest) — testes automatizados

**Front-end** *(em construção)*
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🏗 Arquitetura

O back-end segue uma separação de camadas, onde cada uma tem uma única responsabilidade:

```mermaid
flowchart TB
    Client["Cliente (React)"]

    subgraph API["Back-end · Express"]
        Routes["Routes<br/><i>define os endpoints</i>"]
        Middlewares["Middlewares<br/><i>autenticação (JWT) e validação (Zod)</i>"]
        Controllers["Controllers<br/><i>recebem request, devolvem response</i>"]
        Services["Services<br/><i>regras de negócio</i>"]
        Repository["Repository / Prisma Client<br/><i>acesso a dados</i>"]
    end

    DB[("PostgreSQL")]

    Client -- "HTTP (JSON)" --> Routes
    Routes --> Middlewares
    Middlewares --> Controllers
    Controllers --> Services
    Services --> Repository
    Repository --> DB
```

**Por que essa separação importa:** cada camada só conhece a camada logo abaixo dela. O `Controller` não sabe como o banco funciona; o `Service` não sabe se a requisição veio de uma rota HTTP ou de um teste automatizado. Isso torna o código mais fácil de testar e de modificar sem quebrar outras partes.

---

## 🗃 Modelagem do banco de dados

```mermaid
erDiagram
    USER ||--o{ TASK : possui
    USER {
        string id PK
        string name
        string email UK
        string passwordHash
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
        datetime createdAt
        datetime updatedAt
    }
```

Um `User` pode ter várias `Task`s (relação um-para-muitos). Cada tarefa pertence a exatamente um usuário, garantido pela chave estrangeira `userId`.

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- Node.js 20+
- Docker Desktop

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/joseluucaas/todo-list-fullstack.git
cd todo-list-fullstack

# 2. Suba o banco de dados PostgreSQL
docker compose up -d

# 3. Configure as variáveis de ambiente do back-end
cd Backend
cp .env.example .env
# edite o .env com suas credenciais, se necessário

# 4. Instale as dependências
npm install

# 5. Rode as migrations do Prisma
npx prisma migrate dev

# 6. Suba o servidor em modo desenvolvimento
npm run dev
```

O servidor sobe por padrão em `http://localhost:3000`.

---

## 🔌 API e Endpoints

Todos os endpoints protegidos exigem o header `Authorization: Bearer <token>`.

### Autenticação

| Método | Endpoint | Descrição | Corpo da requisição | Resposta |
|--------|----------|-----------|----------------------|----------|
| POST | `/auth/register` | Cadastra um novo usuário | `{ "name", "email", "password" }` | `{ "id", "name", "email", "createdAt" }` |
| POST | `/auth/login` | Autentica e retorna um token JWT | `{ "email", "password" }` | `{ "token" }` |

### Tarefas *(em desenvolvimento)*

| Método | Endpoint | Descrição | Corpo da requisição | Resposta |
|--------|----------|-----------|----------------------|----------|
| POST | `/tasks` | Cria uma nova tarefa | `{ "title", "description?", "dueDate?" }` | Tarefa criada |
| GET | `/tasks` | Lista as tarefas do usuário logado | — | Array de tarefas |
| PUT | `/tasks/:id` | Atualiza uma tarefa | Campos a atualizar | Tarefa atualizada |
| DELETE | `/tasks/:id` | Remove uma tarefa | — | Status 204 |

---

## 🔒 Segurança

- **Hash de senhas com bcrypt** (salt rounds: 10) — a senha em texto puro nunca é armazenada
- **Mensagens de erro genéricas no login** — a API responde a mesma mensagem tanto para email inexistente quanto para senha incorreta, evitando enumeração de usuários
- **Restrição de unicidade de email** a nível de banco de dados (`@unique` no schema)
- **Tokens JWT assinados** com segredo forte, armazenado em variável de ambiente (nunca no código-fonte)
- **Variáveis sensíveis fora do controle de versão** (`.env` no `.gitignore`, apenas `.env.example` é versionado)
- `helmet` configurado para headers de segurança HTTP *(planejado)*
- Middleware de autenticação para proteger rotas privadas *(em desenvolvimento)*
- Rate limiting no endpoint de login, prevenindo força bruta *(planejado)*

---

## 📂 Estrutura de pastas

```
todo-list-fullstack/
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma       # modelagem do banco (User, Task)
│   │   └── migrations/         # histórico de mudanças no banco
│   ├── src/
│   │   ├── app.ts              # configuração do Express
│   │   ├── server.ts           # inicialização do servidor
│   │   └── generated/          # Prisma Client (gerado automaticamente)
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   └── package.json
├── FrontEnd/                   # React + Tailwind (em construção)
├── docker-compose.yml          # container do PostgreSQL
└── README.md
```

---

## 🗺 Roadmap

- [x] **Configuração do ambiente**
  - [x] TypeScript com ESM (`nodenext`)
  - [x] ESLint + Prettier
- [x] **Banco de dados**
  - [x] Prisma + PostgreSQL via Docker
  - [x] Modelagem do schema (`User`, `Task`)
  - [x] Migrations aplicadas
- [x] **Servidor**
  - [x] Express configurado
  - [x] Rota de health check
- [x] **Autenticação**
  - [x] Cadastro de usuário (hash de senha com bcrypt)
  - [x] Login com geração de token JWT
  - [ ] Middleware de proteção de rotas
- [ ] **CRUD de tarefas**
  - [ ] Criar tarefa
  - [ ] Listar tarefas do usuário
  - [ ] Atualizar tarefa
  - [ ] Excluir tarefa
- [ ] **Testes automatizados**
  - [ ] Testes de autenticação
  - [ ] Testes de CRUD de tarefas
- [ ] **Front-end**
  - [ ] Setup React + Tailwind
  - [ ] Telas de login/cadastro
  - [ ] Dashboard de tarefas
- [ ] **Deploy**
  - [ ] Back-end
  - [ ] Front-end

---

## 📐 Convenções e padrões

### Commits

Este projeto segue a convenção [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), facilitando a leitura do histórico e a identificação do tipo de cada mudança:

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `refactor:` | Reorganização de código sem mudar comportamento |
| `docs:` | Mudanças na documentação |
| `chore:` | Configuração, tarefas de manutenção |
| `test:` | Adição ou ajuste de testes |

---

## 👤 Autor

**Jose Lucas**
Desenvolvedor Full-Stack 
