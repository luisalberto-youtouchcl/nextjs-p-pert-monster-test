FROM node:lts-alpine3.23 AS base

# --- STAGE 1: Dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- STAGE 2: Builder ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1. BUILD-TIME ARGUMENTS
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY

# 2. ASSIGN TO ENV
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

# 3. BUILD-TIME PLACEHOLDERS
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV TURNSTILE_SECRET_KEY="placeholder_for_build"
ENV GCS_PROJECT_ID="placeholder_for_build"
ENV GCS_BUCKET_NAME="placeholder_for_build"

# [Inference] Using printf instead of Heredoc (<<EOF) to avoid "unknown instruction" errors 
# in older Cloud Build environments.
RUN printf 'import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {\n  output: "standalone",\n  typescript: {\n    ignoreBuildErrors: true,\n  },\n  eslint: {\n    ignoreDuringBuilds: true,\n  }\n};\n\nexport default nextConfig;' > next.config.ts

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- STAGE 3: Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["node", "server.js"]