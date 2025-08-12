# Contact API Security Documentation

## Overview
The contact endpoint has been secured with multiple layers of protection to ensure it can only be called by your website and to prevent abuse.

## Security Measures Implemented

### 1. CSRF Protection
- **Purpose**: Prevents cross-site request forgery attacks
- **How it works**: 
  - Each form submission requires a valid CSRF token
  - Tokens are generated server-side and expire after 1 hour
  - Tokens are signed with a secret key to prevent tampering
- **Endpoint**: `GET /api/csrf-token` - generates new tokens
- **Implementation**: Tokens must be included in POST requests to `/api/contact`

### 2. Rate Limiting
- **Purpose**: Prevents spam and abuse
- **Limits**: 5 requests per 10 minutes per IP address
- **Implementation**: In-memory storage (for production, consider Redis)
- **Response**: Returns HTTP 429 when limit exceeded

### 3. Origin/Referer Validation
- **Purpose**: Ensures requests come from your website
- **Allowed origins**:
  - Your production domain (based on Host header)
  - `http://localhost:3001` (development)
  - `http://localhost:3000` (development fallback)
- **Implementation**: Checks `referer` and `origin` headers

### 4. Method Validation
- **Purpose**: Only allows POST requests
- **Implementation**: Returns HTTP 405 for non-POST methods

### 5. Input Validation
- **Purpose**: Ensures all required fields are present
- **Required fields**: name, email, subject, message, csrfToken
- **Implementation**: Returns HTTP 400 for missing fields

## API Endpoints

### Get CSRF Token
```
GET /api/csrf-token
```
**Response:**
```json
{
  "csrfToken": "timestamp.randomBytes.signature"
}
```

### Submit Contact Form
```
POST /api/contact
```
**Headers:**
- `Content-Type: application/json`
- `Origin: https://yourdomain.com` (automatically set by browser)

**Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "subject": "Subject",
  "message": "Message content",
  "newsletter": false,
  "csrfToken": "valid_csrf_token"
}
```

### User Registration
```
POST /api/register
```
**Headers:**
- `Content-Type: application/json`
- `Origin: https://yourdomain.com` (automatically set by browser)

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "agb": true,
  "marketingConsent": false,
  "csrfToken": "valid_csrf_token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

**Error Responses:**
- `400`: Missing required fields / Invalid input
- `403`: Invalid/missing CSRF token or forbidden origin
- `405`: Method not allowed (non-POST)
- `429`: Rate limit exceeded
- `500`: Server error

## Rate Limiting

- **Contact Form**: 5 requests per 10 minutes per IP
- **Registration**: 3 attempts per hour per IP (stricter due to account creation)

## Environment Variables

Add to your `.env` file:
```env
NUXT_CSRF_SECRET=your-super-secret-csrf-key-minimum-32-characters-long
```

## Frontend Integration

The contact form automatically:
1. Fetches a CSRF token on page load
2. Includes the token in form submissions
3. Refreshes the token after successful submissions

## Testing

You can test the security measures:

```bash
# Test without CSRF token (should fail)
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}'

# Test with valid CSRF token (should succeed)
TOKEN=$(curl -s http://localhost:3001/api/csrf-token | jq -r '.csrfToken')
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"subject\":\"Test\",\"message\":\"Test\",\"csrfToken\":\"$TOKEN\"}"
```

## Production Considerations

1. **Rate Limiting**: Consider using Redis or a database for rate limiting in production
2. **CSRF Secret**: Use a strong, random secret (minimum 32 characters)
3. **HTTPS**: Always use HTTPS in production
4. **Domain Validation**: Update allowed origins for your production domain
5. **Monitoring**: Implement logging and monitoring for security events
6. **Backup Protection**: Consider adding additional headers like X-Requested-With

## Security Headers (Recommended)

Consider adding these security headers in your Nuxt config:

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    }
  }
})
```

## Monitoring and Alerts

Consider implementing:
- Failed authentication attempt logging
- Rate limit breach notifications
- Invalid token attempt tracking
- Suspicious activity detection
