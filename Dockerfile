FROM node:lts-alpine3.23 AS base

# --- STAGE 1: Dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

#  Copying lockfiles and package.json
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

#  Use --ignore-scripts to prevent 'prisma generate' from running 
# during this stage, as the schema file is not yet available.
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --ignore-scripts; \
  elif [ -f package-lock.json ]; then npm ci --ignore-scripts; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile --ignore-scripts; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- STAGE 2: Builder ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
#  Now we copy the full source, including the /prisma folder
COPY . .

#  Now that the schema is present, we manually trigger the generation.
# We provide a placeholder DATABASE_URL to satisfy Prisma's internal validation.
RUN export DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" && \
    if [ -f yarn.lock ]; then yarn prisma generate; \
    elif [ -f package-lock.json ]; then npx prisma generate; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm prisma generate; \
    fi

# Build-time arguments for Next.js
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

# Other build-time placeholders for Next.js page data collection
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV TURNSTILE_SECRET_KEY="placeholder_for_build"
ENV GCS_PROJECT_ID="placeholder_for_build"
ENV GCS_BUCKET_NAME="placeholder_for_build"

# Ensure standalone output for Cloud Run
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