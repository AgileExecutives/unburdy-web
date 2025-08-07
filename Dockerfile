FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock* ./

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
RUN apk add --no-cache nginx supervisor wget

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

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

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

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]