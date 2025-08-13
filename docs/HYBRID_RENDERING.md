# Hybrid Rendering Setup - Static + Dynamic Pages

This document explains how the Unburdy website is configured for hybrid rendering, combining static site generation for marketing pages with server-side rendering for dynamic functionality.

## Overview

The site uses Nuxt 3's hybrid rendering to optimize performance and functionality:

- **Static Pages**: Marketing content pre-rendered at build time for fast loading
- **Dynamic Pages**: User-facing features that require server-side processing
- **API Routes**: Server-side endpoints for authentication and data processing

## Rendering Configuration

### Static Pages (Pre-rendered)
These pages are built at compile time and served as static HTML:

```typescript
// nuxt.config.ts
routeRules: {
  '/': { prerender: true },                    // Homepage
  '/preise': { prerender: true },              // Pricing
  '/idee-hinter-unburdy': { prerender: true }, // About page
  '/legal/**': { prerender: true },            // Legal pages
}
```

**Benefits:**
- ⚡ Fastest loading times
- 🌐 Great for SEO
- 📱 Works offline
- 💰 Lower server costs

### Dynamic Pages (Server-rendered)
These pages require server-side processing:

```typescript
routeRules: {
  '/lc/anmelden': { ssr: true },      // Registration (needs CSRF)
  '/onboarding/**': { ssr: true }, // Onboarding flow (needs auth)
  '/api/**': { ssr: true },        // API routes (always server-side)
}
```

**Benefits:**
- 🔒 Secure CSRF token generation
- 🔐 Server-side authentication
- 📊 Real-time data processing
- 🛡️ Better security

## CSRF Token Management

### The Problem with Static Sites
Static sites can't generate CSRF tokens at build time because:
- Tokens must be unique per session
- Tokens have expiration times
- Tokens require server-side validation

### Our Hybrid Solution

#### 1. CSRF Token Generation API
```typescript
// server/api/csrf-token.get.ts
export default defineEventHandler(async (event) => {
  const csrfToken = crypto.randomBytes(32).toString('hex')
  const timestamp = Date.now()
  const signedToken = signTokenWithTimestamp(csrfToken, timestamp)
  
  setCookie(event, 'csrf-token', signedToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  })
  
  return { csrfToken }
})
```

#### 2. CSRF Validation Utility
```typescript
// server/utils/csrf.ts
export function validateCsrfToken(event, providedToken) {
  const signedToken = getCookie(event, 'csrf-token')
  return verifyTokenAndTimestamp(signedToken, providedToken)
}
```

#### 3. CSRF Composable
```javascript
// composables/useCsrf.js
export const useCsrf = () => {
  const getToken = async () => {
    const response = await $fetch('/api/csrf-token')
    return response.csrfToken
  }
  
  return { getToken }
}
```

## Analytics and Prerendering

### Umami Tracking with Static Pages

**Good News**: Umami analytics works perfectly with prerendered pages! Here's why:

#### How It Works
1. **Build Time**: Static HTML is generated without analytics code
2. **Runtime**: When user visits, JavaScript hydrates and:
   - Umami script loads from CDN
   - Campaign parameters are extracted from URL
   - Page views and events are tracked normally

#### Current Implementation
```typescript
// plugins/analytics.client.ts - Client-side only
export default defineNuxtPlugin({
  setup() {
    if (process.client) {  // ✅ Correct: Only runs in browser
      // Load Umami script
      useHead({
        script: [{
          src: config.public.umamiUrl,
          'data-website-id': config.public.umamiSiteId,
          async: true,
          defer: true
        }]
      })
      
      // Track page views on route changes
      router.afterEach((to, from) => {
        const { trackPageView } = useAnalytics()
        trackPageView(to.path)
      })
    }
  }
})
```

#### Benefits of This Approach
- 🚀 **Fast Initial Load**: No analytics blocking static content
- 🔒 **Privacy Compliant**: No tracking during build
- 📊 **Full Functionality**: All tracking works after hydration
- 🎯 **Campaign Attribution**: UTM parameters captured correctly

### Performance Optimization

#### 1. Lazy Loading Analytics
```typescript
// Enhanced analytics loading
const loadAnalytics = async () => {
  // Only load after critical content is ready
  await nextTick()
  
  if (!window.umami) {
    const script = document.createElement('script')
    script.src = config.public.umamiUrl
    script.dataset.websiteId = config.public.umamiSiteId
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }
}

// Load analytics after page is interactive
onMounted(() => {
  setTimeout(loadAnalytics, 1000) // 1s delay for better performance
})
```

#### 2. Preload Analytics Script
```typescript
// nuxt.config.ts - Preload for faster loading
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'preload',
          href: process.env.NUXT_PUBLIC_UMAMI_URL,
          as: 'script',
          crossorigin: 'anonymous'
        }
      ]
    }
  }
})
```

### Campaign Tracking Considerations

#### Static Pages with Campaign Parameters
```bash
# These work perfectly with prerendered pages:
https://unburdy.com/?utm_source=google&utm_campaign=summer_sale
https://unburdy.com/preise?utm_source=facebook&utm_medium=social
```

**What Happens**:
1. Static HTML serves instantly (fast First Contentful Paint)
2. JavaScript hydrates and extracts UTM parameters
3. Campaign data is stored in localStorage
4. All subsequent tracking includes campaign attribution

#### Dynamic Pages with Campaigns
```bash
# These get full server-side + client-side tracking:
https://unburdy.com/lc/anmelden?utm_source=newsletter&utm_campaign=trial
https://unburdy.com/onboarding/schritt-1?utm_source=google&utm_content=cta
```

### Testing Analytics with Prerendering

#### 1. Build and Test
```bash
# Generate static pages
npm run build

# Test locally
npm run preview

# Visit with campaign parameters
open http://localhost:3000/?utm_source=test&utm_campaign=prerender_test
```

#### 2. Verify Tracking
```javascript
// Check in browser console
console.log('Umami loaded:', !!window.umami)
console.log('Campaign data:', localStorage.getItem('unburdy_campaign'))

// Test manual tracking
window.umami.track('test-event', { source: 'manual' })
```

#### 3. Network Tab Verification
- Look for requests to your Umami domain
- Verify tracking data is being sent
- Check for any CORS or loading issues

### Build Process
```bash
npm run build
```

This creates:
- Static HTML files for pre-rendered routes
- Server functions for dynamic routes
- Client-side JavaScript for interactivity

### Deployment Structure
```
.output/
├── public/           # Static assets and pre-rendered pages
│   ├── index.html    # Static homepage
│   ├── preise.html   # Static pricing
│   └── assets/       # CSS, JS, images
└── server/           # Server-side functions
    ├── api/          # API endpoints
    └── routes/       # Dynamic page handlers
```

### Hosting Options

#### Option 1: Vercel (Recommended)
```json
// vercel.json
{
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ]
}
```

#### Option 2: Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[functions]
  directory = ".output/server"
```

#### Option 3: Traditional Hosting + Node.js
- Upload `.output/public/` to static hosting (CDN)
- Deploy `.output/server/` to Node.js server
- Configure reverse proxy for API routes

## Environment Configuration

### Development
```bash
# .env
NUXT_API_BASE_URL=http://localhost:8080/api/v1
NUXT_API_TOKEN=dev_token_123
NUXT_CSRF_SECRET=dev-secret-key-32-chars-minimum
```

### Production
```bash
# .env.production
NUXT_API_BASE_URL=https://api.unburdy.com
NUXT_API_TOKEN=prod_secure_token_here
NUXT_CSRF_SECRET=super-secure-random-key-32-chars-min
NUXT_PUBLIC_UMAMI_SITE_ID=your-umami-id
```

## Performance Optimizations

### Static Assets
- Images optimized at build time
- CSS/JS bundled and minified
- Critical CSS inlined

### Dynamic Routes
- Server-side caching where appropriate
- Database connection pooling
- API response optimization

### Caching Strategy
```typescript
routeRules: {
  '/': { 
    prerender: true,
    headers: { 'cache-control': 's-maxage=31536000' } // 1 year
  },
  '/lc/anmelden': { 
    ssr: true,
    headers: { 'cache-control': 'no-cache' } // Always fresh
  }
}
```

## Security Considerations

### Static Pages
- No server-side vulnerabilities
- Content Security Policy (CSP) headers
- HTTPS enforcement

### Dynamic Pages
- CSRF protection on all forms
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure cookie configuration

### API Security
```typescript
// Example secure API route
export default defineEventHandler(async (event) => {
  // CSRF validation
  requireValidCsrf(event, body.csrfToken)
  
  // Input validation
  validateInputs(body)
  
  // Rate limiting
  await checkRateLimit(event)
  
  // Process request...
})
```

## Testing

### Static Pages
```bash
# Test static generation
npm run generate
npm run preview
```

### Dynamic Pages
```bash
# Test SSR functionality
npm run build
npm run preview
```

### CSRF Token Flow
1. Visit `/lc/anmelden` (SSR page)
2. Check that CSRF token is generated
3. Submit form with token
4. Verify server validation works

## Monitoring

### Build Monitoring
- Track build times for static pages
- Monitor bundle sizes
- Check for build failures

### Runtime Monitoring
- Server response times for dynamic pages
- CSRF token generation/validation rates
- API endpoint performance

### Error Tracking
- Client-side errors on static pages
- Server-side errors on dynamic pages
- CSRF validation failures

## Troubleshooting

### Static Pages Not Updating
1. Clear build cache: `rm -rf .nuxt .output`
2. Rebuild: `npm run build`
3. Check route rules in `nuxt.config.ts`

### CSRF Token Issues
1. Verify server route is SSR: `routeRules: { '/lc/anmelden': { ssr: true } }`
2. Check cookie settings (httpOnly, secure, sameSite)
3. Validate token generation and signature

### Deployment Issues
1. Ensure environment variables are set
2. Check build output structure
3. Verify server functions are deployed correctly

## Best Practices

### 1. Route Classification
- **Static**: Content that rarely changes (marketing, legal)
- **Dynamic**: User-specific content (auth, dashboard)
- **Hybrid**: Content with dynamic elements (pricing with user-specific offers)

### 2. Data Loading
- **Static**: Use `asyncData` or build-time data fetching
- **Dynamic**: Use `useFetch` with server-side execution
- **Client**: Use `useLazyFetch` for non-critical data

### 3. SEO Optimization
- Static pages get full SEO benefits
- Dynamic pages need proper meta tag handling
- Use `useSeoMeta` for consistent SEO data

### 4. Performance Monitoring
- Lighthouse scores for static pages
- Core Web Vitals for all pages
- Server response times for dynamic routes

This hybrid approach gives you the best of both worlds: blazing-fast static pages for marketing content and full server-side capabilities for user-facing features!
