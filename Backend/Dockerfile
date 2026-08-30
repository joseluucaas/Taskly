# Etapa de build: instala dependências, gera o Prisma Client e compila o TypeScript.
FROM node:22-bookworm-slim AS build

WORKDIR /app

# Prisma utiliza OpenSSL para carregar o engine de acesso ao PostgreSQL.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# O Prisma exige a variável ao gerar o cliente, mas não abre conexão nesta fase.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/taskly?schema=public

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY src ./src

RUN npx prisma generate && npm run build

# Etapa de execução: reutiliza as dependências geradas no build. O Prisma CLI
# permanece disponível para aplicar migrations com a mesma versão do projeto.
FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# O engine nativo do Prisma não é copiado pelo TypeScript e precisa acompanhar
# o cliente compilado para consultas ao PostgreSQL em Linux.
COPY --from=build /app/src/generated/prisma/*.so.node ./dist/generated/prisma/
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

# Em produção, Winston grava logs sem precisar executar a API como root.
RUN mkdir /app/logs && chown node:node /app/logs

# As migrations são aplicadas antes da API aceitar requisições.
USER node

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
