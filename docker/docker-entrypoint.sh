#!/bin/sh

echo "=== Unburdy Frontend Configuration ==="

# Generate runtime configuration for frontend
cat > /usr/share/nginx/html/env.js << EOF
window.__ENV__ = {
  API_BASE_URL: '$API_BASE_URL',
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
