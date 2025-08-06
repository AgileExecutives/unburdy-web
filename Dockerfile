# Multi-stage Docker build for hybrid Nuxt app
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate version info (if version.ts is needed)
RUN echo 'export const VERSION = "docker-build"' > version.ts && \
    echo 'export const BUILDTIME = "'$(date)'"' >> version.ts && \
    echo 'export const REVISION = "'${GITHUB_SHA:-"local"}'"' >> version.ts

# Build the application with hybrid rendering
RUN npm run build

# Production image with both static files and server
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt

# Copy built application
COPY --from=builder --chown=nuxt:nodejs /app/.output /app/.output

# Create necessary directories
RUN mkdir -p /app/public && chown -R nuxt:nodejs /app

USER nuxt

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node /app/.output/server/index.mjs --health-check || exit 1

# Start the application
CMD ["node", "/app/.output/server/index.mjs"]
