#!/bin/bash

# Test script for verifying analytics with prerendered pages
echo "🧪 Testing Analytics with Prerendered Pages"
echo "=========================================="

# Build the site
echo "📦 Building site with prerendering..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Start preview server
echo "🚀 Starting preview server..."
npm run preview &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "🔍 Testing page loads..."

# Test static pages
echo "Testing homepage (prerendered)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200" && echo "✅ Homepage loads" || echo "❌ Homepage failed"

echo "Testing pricing page (prerendered)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/preise | grep -q "200" && echo "✅ Pricing loads" || echo "❌ Pricing failed"

echo "Testing about page (prerendered)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/idee-hinter-unburdy | grep -q "200" && echo "✅ About loads" || echo "❌ About failed"

# Test dynamic pages
echo "Testing registration page (SSR)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/anmelden | grep -q "200" && echo "✅ Registration loads" || echo "❌ Registration failed"

# Test with campaign parameters
echo "Testing campaign tracking..."
curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/?utm_source=test&utm_campaign=prerender_test" | grep -q "200" && echo "✅ Campaign URL loads" || echo "❌ Campaign URL failed"

# Test API endpoints
echo "Testing CSRF API..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/csrf-token | grep -q "200" && echo "✅ CSRF API works" || echo "❌ CSRF API failed"

echo ""
echo "🎯 Manual Testing Instructions:"
echo "1. Open http://localhost:3000/?utm_source=test&utm_campaign=prerender_test"
echo "2. Open browser dev tools and check:"
echo "   - Network tab for Umami script loading"
echo "   - Console for campaign tracking logs"
echo "   - localStorage for 'unburdy_campaign' data"
echo "3. Navigate to /anmelden and verify CSRF token generation"
echo "4. Check your Umami dashboard for tracked events"

echo ""
echo "Press Ctrl+C to stop the preview server"
wait $SERVER_PID
