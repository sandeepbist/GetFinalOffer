FROM node:20-alpine AS base

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG DATABASE_URL
ARG REDIS_URL
ARG OPENAI_API_KEY
ARG NEXT_PUBLIC_APP_URL

CMD ["npx", "tsx", "workers/index.ts"]
