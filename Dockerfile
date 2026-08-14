# Base Node.js image (Debian Slim for rock-solid native modules & Prisma compatibility)
FROM node:20-slim AS base

# Install OpenSSL and CA certificates for Prisma
FROM base AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm install

# Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV DATABASE_URL "file:./dev.db"
ENV NEXTAUTH_SECRET "educatech-build-time-secret-key-123456"

RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
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
