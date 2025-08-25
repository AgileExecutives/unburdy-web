# API Endpoints Documentation

This document lists all API endpoints used in the Unburdy Web project.

## API Endpoints Overview

| Purpose | Nuxt API Endpoint | Backend API Endpoint |
|---------|------------------|---------------------|
| **Authentication & User Management** |
| User registration | `POST /api/register` | `POST /auth/register` |
| User login | `POST /api/login` | `POST /auth/login` |
| Verify user session | `GET /api/verify` | - |
| Verify email verification token | `POST /api/verify-token` | - |
| Validate user authentication token | `POST /api/validate-token` | - |
| Get password security requirements | `GET /api/auth/password-security` | `GET /auth/password-security` |
| **CSRF Protection** |
| Get CSRF token for form submissions | `GET /api/csrf-token` | - |
| **Contact & Communication** |
| Submit contact form | `POST /api/contact` | `POST /contact` |
| **Onboarding & Customer Data** |
| Save/update onboarding data | `POST /api/onboarding` | `POST /onboarding` |
| Search for potential customers (fuzzy matching) | `GET /api/fuzzy/potential-customers` | `GET /fuzzy/potential_customers` |
| Advanced customer search | `POST /api/fuzzy/potential-customers` | `POST /fuzzy/potential_customers` |
| **Invoice Management** |
| Generate and download invoice | `POST /api/invoice` | `POST /invoice` |
| **Static Data Resources** |
| German federal states data | `GET /api/static/bundeslaender` | `GET /static/bundeslaender` |
| School holidays and public holidays | `GET /api/static/ferien-feiertage` | `GET /static/ferien-feiertage` |
| Youth offices (Jugendämter) data | `GET /api/static/jugendaemter` | `GET /static/jugendaemter` |
| System enumerations (focus areas, service offers, etc.) | `GET /api/static/enumerations` | `GET /static/enumerations` |
| Generic static data endpoint | `GET /api/static/[name]` | `GET /static/[name]` |
| **Analytics** |
| Proxy for Umami analytics | `GET /api/umami-proxy` | - |

## API Configuration

### Environment Variables
- `NUXT_API_BASE_URL` - Backend API base URL
- `NUXT_API_TOKEN` - Backend API authentication token

### Runtime Configuration
```typescript
// nuxt.config.ts
runtimeConfig: {
  apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://api.unburdy.de',
  apiToken: process.env.NUXT_API_TOKEN,
  public: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://api.unburdy.de'
  }
}
```

## Usage Patterns

### Internal API Calls (Nuxt Server Routes)
```typescript
// Frontend to Nuxt API
const response = await $fetch('/api/register', {
  method: 'POST',
  body: userData
})
```

### External API Calls (Backend Integration)
```typescript
// Nuxt server to external backend
const response = await $fetch('/auth/register', {
  method: 'POST',
  baseURL: config.apiBaseUrl,
  headers: {
    'Authorization': `Bearer ${config.apiToken}`
  },
  body: userData
})
```

### Generated API Client Usage
```typescript
// Using typed API client
const api = useTypedApi()
const result = await api.auth.register(userData)
```

## File Downloads

### Invoice Downloads
- PDF files are downloaded via blob handling
- Requires bearer token authentication
- URLs are constructed from `invoiceDownloadUrl` responses

## Notes

1. **Rate Limiting**: Several endpoints implement rate limiting (contact, register, login)
2. **CSRF Protection**: Form submissions require CSRF tokens
3. **Authentication**: Most backend operations require bearer token authentication
4. **Error Handling**: All endpoints implement comprehensive error handling
5. **Type Safety**: Generated API client provides full TypeScript support
