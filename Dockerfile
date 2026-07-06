# ─── Stage 1: Install all dependencies ───────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ─── Stage 2: Build the application ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# All other vars (secrets, URLs) are injected at runtime by docker-compose — never baked in.
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_ENV="true"
# Runs: tsc --noEmit && next build --turbopack
RUN npm run build

# ─── Stage 3: Production runner (minimal image) ───────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DOCKER_ENV="true"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone server output (requires output: 'standalone' in next.config.ts)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Built-in fetch available in Node 20; no dotenv-cli needed — env vars
# are injected by Docker/docker-compose at runtime.
CMD ["node", "server.js"]
