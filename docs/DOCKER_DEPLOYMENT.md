# Docker Deployment Guide - Fast Static + Easy Deploy

This guide explains how to deploy your hybrid Nuxt app to your Docker server, combining the speed of static pages with the flexibility of server-side functionality.

## 🚀 Deployment Strategy Overview

### **Hybrid Architecture Benefits**
- ⚡ **Static pages** (/, /preise, /legal/*) served instantly
- 🔒 **Dynamic pages** (/lc/anmelden, /onboarding/*) with server functionality
- 🛡️ **API routes** (/api/*) for secure operations
- 📊 **Analytics** work perfectly on all page types
- 🎯 **Campaign tracking** with UTM parameters

### **Docker Deployment Advantages**
- 🔄 **Zero-downtime deployments**
- 📦 **Consistent environments** (dev/staging/prod)
- 🚀 **Easy scaling** and rollbacks
- 🔧 **Simple configuration** management

## 📁 Files Created

### Core Files
- `Dockerfile` - Multi-stage build for optimized container
- `docker-compose.yml` - Local development setup
- `nginx.conf` - Optimized reverse proxy configuration
- `.github/workflows/deploy-docker.yml` - Automated deployment

## 🔧 Setup Instructions

### 1. Server Preparation

```bash
# On your Docker server
mkdir -p /opt/unburdy-web
cd /opt/unburdy-web

# Copy nginx.conf to your server
scp nginx.conf user@your-server:/opt/unburdy-web/

# Ensure Docker and Docker Compose are installed
docker --version
docker-compose --version
```

### 2. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

```bash
# Docker Registry (Docker Hub, GitHub Container Registry, etc.)
DOCKER_REGISTRY=your-registry.com
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password

# Server Access
SERVER_HOST=your-server-ip
SERVER_USER=deploy-user
SERVER_SSH_KEY=your-private-ssh-key
SERVER_PORT=22

# Application Environment
NUXT_API_BASE_URL=https://api.unburdy.com
NUXT_API_TOKEN=your-production-api-token
NUXT_CSRF_SECRET=your-super-secure-csrf-secret-32-chars
NUXT_UNBURDY_APP=https://app.unburdy.com

# Analytics
NUXT_PUBLIC_UMAMI_URL=https://analytics.unburdy.de/script.js
NUXT_PUBLIC_UMAMI_SITE_ID=c95943fd-990d-4553-b1a3-72a47fc84789
NUXT_PUBLIC_DOMAIN=unburdy.de
```

### 3. Deploy Your Application

```bash
# Option 1: Manual deployment trigger
# Go to GitHub Actions → "Deploy to Docker Server" → "Run workflow"

# Option 2: Tag-based deployment
git tag v1.0.0
git push origin v1.0.0  # Automatically triggers deployment
```

## 🏗️ Architecture Details

### Build Process
```dockerfile
# Multi-stage Docker build:
# 1. Dependencies stage - Install packages
# 2. Builder stage - Build hybrid app
# 3. Runner stage - Optimized production container
```

### Runtime Architecture
```
Internet → Nginx (Port 80/443) → Nuxt App (Port 3000)
                ↓
        ┌─────────────────┐
        │   Nginx Proxy   │  ← Rate limiting, caching, SSL
        └─────────────────┘
                ↓
        ┌─────────────────┐
        │   Nuxt Server   │  ← Hybrid rendering, API routes
        └─────────────────┘
```

### Page Serving Strategy
```bash
# Static pages (prerendered, cached 1 hour)
/ → Nginx → Nuxt (static HTML) → Browser ⚡
/preise → Nginx → Nuxt (static HTML) → Browser ⚡
/legal/* → Nginx → Nuxt (static HTML) → Browser ⚡

# Dynamic pages (SSR, no cache)
/lc/anmelden → Nginx → Nuxt (server-side) → Browser 🔒
/onboarding/* → Nginx → Nuxt (server-side) → Browser 🔒

# API routes (rate limited, no cache)
/api/* → Nginx → Nuxt (server-side) → Response 🛡️
```

## 🎯 Performance Optimizations

### Nginx Configuration
- **Static assets**: 1-year cache with immutable headers
- **Static pages**: 1-hour cache for marketing content  
- **Dynamic pages**: No cache for user-specific content
- **API routes**: Rate limiting (10 req/s general, 5 req/s auth)

### Docker Optimizations
- Multi-stage build reduces image size
- Build cache for faster subsequent builds
- Health checks for reliable deployments
- Non-root user for security

### Nuxt Optimizations
- Hybrid rendering for optimal performance
- Preconnect to analytics domain
- Delayed analytics loading for better performance
- Campaign tracking with localStorage persistence

## 🚀 Deployment Workflow

### Automated Process
1. **Code push/tag** triggers GitHub Action
2. **Docker build** with all environment variables
3. **Multi-platform build** (AMD64 + ARM64)
4. **Push to registry** with version tags
5. **SSH to server** and deploy with Docker Compose
6. **Health check** ensures successful deployment
7. **Cleanup** old images to save space

### Zero-Downtime Deployment
```bash
# Docker Compose handles rolling updates
docker-compose up -d  # Starts new container
# Old container keeps serving until new one is healthy
# Traffic switches to new container
# Old container is removed
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Container health
docker-compose ps

# Application health
curl http://your-server/health

# Nginx status
docker-compose logs nginx

# App logs
docker-compose logs unburdy-web
```

### Log Management
```bash
# View logs
docker-compose logs -f unburdy-web

# Log rotation (add to crontab)
0 0 * * * docker system prune -f
```

## 🔒 Security Features

### Application Security
- CSRF protection on all forms
- Rate limiting on API endpoints
- Secure cookie configuration
- Input validation and sanitization

### Infrastructure Security
- Non-root container user
- Security headers via Nginx
- Optional SSL/TLS termination
- Network isolation via Docker

## 🧪 Testing Your Deployment

### Local Testing
```bash
# Test the full stack locally
docker-compose up --build

# Test with production-like setup
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### Production Testing
```bash
# Test static pages (should be fast)
curl -w "%{time_total}s" https://unburdy.de/
curl -w "%{time_total}s" https://unburdy.de/preise

# Test dynamic pages (should work with CSRF)
curl -I https://unburdy.de/lc/anmelden

# Test API endpoints
curl https://unburdy.de/api/csrf-token

# Test with campaign parameters
curl https://unburdy.de/?utm_source=test&utm_campaign=docker_deploy
```

## 🎊 Benefits Summary

### vs Pure Static (current WebDAV approach)
- ✅ Keep fast static pages
- ✅ Add server functionality (CSRF, auth)
- ✅ Better analytics and campaign tracking
- ✅ Real-time data when needed

### vs Pure SSR
- ✅ Static pages load instantly
- ✅ Better SEO for marketing content
- ✅ Lower server load
- ✅ Better caching strategies

### vs Serverless
- ✅ No cold starts
- ✅ Persistent connections
- ✅ Full control over infrastructure
- ✅ Cost predictability

This hybrid Docker approach gives you the **best of all worlds**: lightning-fast static marketing pages, secure dynamic functionality, easy deployment, and full control over your infrastructure! 🚀
