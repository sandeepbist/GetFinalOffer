FROM node:20-alpine AS base

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# All configuration is injected at runtime via the environment
# (docker run -e DATABASE_URL=... or your orchestrator's env mechanism).
# Build-time ARGs are not visible at runtime and are intentionally not used.
CMD ["npx", "tsx", "workers/index.ts"]
