#!/bin/sh

echo "=== Unburdy Frontend Configuration ==="

set -e

ENV_FILE_PATH="/app/.env"

# Generate a new .env file, prioritizing current NUXT_* and NGINX_* env vars over build-time .env
TMP_ENVVARS="/tmp/.env.envvars"
TMP_BUILDARGS="/tmp/.env.buildargs"

# Collect current env vars
env | grep -E '^(NUXT|NGINX)_' | awk -F= '{print $1"="$2}' > "$TMP_ENVVARS"

# Collect build-time .env if present
if [ -f "$ENV_FILE_PATH" ]; then
  cat "$ENV_FILE_PATH" > "$TMP_BUILDARGS"
else
  touch "$TMP_BUILDARGS"
fi

# Merge, prioritizing env vars
awk -F= '!a[$1]++' "$TMP_ENVVARS" "$TMP_BUILDARGS" > "$ENV_FILE_PATH"
rm -f "$TMP_ENVVARS" "$TMP_BUILDARGS"

# Show result for debug
cat "$ENV_FILE_PATH"

# Export any NUXT_* and NGINX_* variables from .env that are not already set in the environment
while IFS='=' read -r key value; do
  if echo "$key" | grep -Eq '^(NUXT|NGINX)_'; then
    if ! env | grep -q "^$key="; then
      export "$key=$value"
    fi
  fi
done < "$ENV_FILE_PATH"

# Generate runtime configuration for frontend
cat > /var/www/html/env.js << EOF
window.__ENV__ = {
  PUBLIC_UMAMI_HOST: '$NUXT_PUBLIC_UMAMI_HOST',
  PUBLIC_UMAMI_WEBSITE_ID: '$NUXT_PUBLIC_UMAMI_WEBSITE_ID',
  UNBURDY_APP: '$NUXT_UNBURDY_APP',
  API_BASE_URL: '$NUXT_API_BASE_URL',
  NODE_ENV: '$NODE_ENV'
};
EOF

# No API proxy setup needed; all API calls go to Nuxt server
# Just substitute NGINX_LOG_LEVEL if needed
sed "s|\${NGINX_LOG_LEVEL}|$NGINX_LOG_LEVEL|g" /etc/nginx/nginx.conf > /tmp/nginx.conf.tmp
mv /tmp/nginx.conf.tmp /etc/nginx/nginx.conf

# Create log directory and files with proper permissions
mkdir -p /var/log/nginx
touch /var/log/nginx/access.log /var/log/nginx/error.log /var/log/nginx/api.log /var/log/nginx/api_error.log
chown -R nginx:nginx /var/log/nginx

# Test nginx configuration
echo "Testing nginx configuration..."
if nginx -t; then
    echo "✓ Nginx configuration is valid"
else
    echo "✗ Nginx configuration test failed!"
    echo "Current configuration:"
    cat /etc/nginx/nginx.conf
    exit 1
fi

# Function to show logs in background
show_logs() {
    sleep 5  # Wait for nginx to start
    echo ""
    echo "=== Starting log monitoring (API requests will be logged) ==="
    tail -f /var/log/nginx/access.log /var/log/nginx/error.log /var/log/nginx/api.log /var/log/nginx/api_error.log &
}

# Start log monitoring if in debug mode
if [ "$NGINX_LOG_LEVEL" = "debug" ] || [ "$NGINX_SHOW_LOGS" = "true" ]; then
    show_logs
fi

echo "Starting Supervisor..."
exec supervisord -c /etc/supervisord.conf
