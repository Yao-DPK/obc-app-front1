# ============================================================
# STAGE 1 – Builder
# ============================================================
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
WORKDIR /app

# Dépendances
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
#COPY packages/tsconfig/package.json ./packages/tsconfig/
RUN pnpm install 

# Code source
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages

# Variables d'environnement de build (Vite)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build
RUN pnpm --filter @obc-app/web build

# ============================================================
# STAGE 2 – Nginx (serveur statique)
# ============================================================
FROM nginx:1.27-alpine AS runner

# Copier la config Nginx personnalisée
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]