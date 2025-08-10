FROM node:22-alpine AS builder

# Define build args for all NUXT_* and NGINX_* variables
ARG NUXT_API_BASE_URL
ARG NUXT_API_TOKEN
ARG NUXT_CSRF_SECRET
ARG NUXT_LOG_LEVEL
ARG NUXT_UNBURDY_APP
ARG NUXT_PUBLIC_UMAMI_HOST
ARG NUXT_PUBLIC_UMAMI_SITE_ID
ARG NUXT_PUBLIC_DOMAIN
ARG NGINX_SHOW_LOGS
ARG NGINX_LOG_LEVEL
WORKDIR /app

COPY package*.json yarn.lock* ./

# Create .env file in builder stage, prioritizing build args over env
RUN echo "Generating .env from build args and environment..." && \
  (env | grep -E '^(NUXT|NGINX)_' | awk -F= '{print $1"="$2}' > .env.envvars) && \
  (for var in NUXT_API_BASE_URL NUXT_API_TOKEN NUXT_CSRF_SECRET NUXT_LOG_LEVEL NUXT_UNBURDY_APP NUXT_PUBLIC_UMAMI_HOST NUXT_PUBLIC_UMAMI_SITE_ID NUXT_PUBLIC_DOMAIN NGINX_SHOW_LOGS NGINX_LOG_LEVEL; do \
    val=$(eval echo \$$var); \
    if [ -n "$val" ]; then \
      echo "$var=$val"; \
    fi; \
  done > .env.buildargs) && \
  awk -F= '!a[$1]++' .env.buildargs .env.envvars > .env && \
  rm .env.envvars .env.buildargs && \
  cat .env

# Install dependencies
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:22-alpine AS production

# Install nginx, supervisor, and wget for health checks
RUN apk add --no-cache nginx supervisor wget gettext vim bash curl

# Create directories and set permissions
RUN mkdir -p /run/nginx /var/log/nginx /var/log/supervisor /var/www/html \
    && touch /var/log/nginx/access.log /var/log/nginx/error.log \ 
    && chown -R nginx:nginx /var/log/nginx \
    && chown nginx:nginx /var/log/nginx/access.log /var/log/nginx/error.log

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.output ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock* ./

COPY ./docker/start-nuxt.sh ./
COPY ./docker/replicate-env.sh ./
RUN chmod +x start-nuxt.sh replicate-env.sh
# RUN ./replicate-env.sh

# Install production dependencies only
RUN if [ -f yarn.lock ]; then \
        yarn --frozen-lockfile --production && yarn cache clean; \
    elif [ -f package-lock.json ]; then \
        npm ci --omit=dev && npm cache clean --force; \
    else \
        npm install --only=production && npm cache clean --force; \
    fi

# Copy static files to nginx document root
COPY --from=builder /app/.output/public /var/www/html/  
RUN chown -R nginx:nginx /var/www/html

# Copy nginx configuration for static file serving
COPY nginx.conf /etc/nginx/nginx.conf

COPY ./docker/supervisord.conf /etc/supervisord.conf
COPY ./docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Debug: Test nginx configuration
RUN nginx -t || echo "Nginx config test failed!"

# Debug: Check what files are in static directory
RUN echo "=== Contents of /var/www/html ==="
RUN ls -la /var/www/html/ || echo "No /var/www/html directory"

# Debug: Check nginx version and modules
RUN nginx -V

# Debug: Check if nginx config file exists and show contents
RUN echo "=== Nginx config file ===" && cat /etc/nginx/nginx.conf || echo "No nginx config found"

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Set build args
ARG GITHUB_SHA
ENV GITHUB_SHA=$GITHUB_SHA

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]