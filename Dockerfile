# Base Node.js image (Debian Slim for rock-solid native modules & Prisma compatibility)
FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm install

# Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments from Docker Compose / Coolify
ARG COOLIFY_FQDN
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG DATABASE_URL
ARG STRIPE_SECRET_KEY

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV AUTH_SECRET="educatech-build-time-secret-key-123456"
ENV NEXTAUTH_SECRET="educatech-build-time-secret-key-123456"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV DATABASE_URL="file:./dev.db"
ENV STRIPE_SECRET_KEY="sk_test_mock"

# Generate Prisma Client & initialize local database schema for build safety
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss || true
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV SOCKET_PORT 3001
ENV HOSTNAME "0.0.0.0"

# Create nextjs system user and permissions
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs
RUN mkdir -p /app/prisma/data && chown -R nextjs:nodejs /app/prisma

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/socket-server.js ./socket-server.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]
