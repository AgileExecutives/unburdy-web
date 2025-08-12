# API Types Generation

This project uses OpenAPI TypeScript generator to create type-safe API clients.

## Setup

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Generate API types:**
   ```bash
   yarn api:generate
   ```

## Available Commands

- `yarn api:generate` - Generate types from local OpenAPI spec (`api/openapi.yaml`)
- `yarn api:generate-dev` - Generate types from development server (`localhost:8080`)
- `yarn api:generate-prod` - Generate types from production server (`api.unburdy.de`)

## File Structure

```
├── api/
│   └── openapi.yaml          # OpenAPI specification
├── types/
│   └── api/                  # Generated API types (auto-generated)
│       ├── models/           # Type definitions
│       ├── services/         # API service classes
│       └── core/             # Core utilities
└── app/composables/
    └── useTypedApi.ts        # Typed API composable
```

## Usage

### 1. Basic Usage with Generated Types

After running `yarn api:generate`, you can import generated types:

```typescript
import type { User, UserResponse } from '~/types/api/models'
import { AuthenticationService } from '~/types/api/services'

// Use generated service classes
const userResponse = await AuthenticationService.postAuthRegister({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
})
```

### 2. Custom Typed Composable

Use the custom `useTypedApi` composable for more control:

```typescript
const api = useTypedApi()

// Register user
const response = await api.auth.register({
  email: 'user@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe'
})

// Validate token
const validation = await api.onboarding.validateToken({
  token: 'abc123'
})

// Submit contact form
const result = await api.contact.submit({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!'
})
```

## API Endpoints

Current endpoints defined in `api/openapi.yaml`:

### Authentication
- `POST /auth/register` - Register new user

### Onboarding
- `POST /onboarding/validate_token` - Validate onboarding token

### Contact
- `POST /contact` - Submit contact form

## Updating API Types

1. **Update OpenAPI spec:** Edit `api/openapi.yaml` to add/modify endpoints
2. **Regenerate types:** Run `yarn api:generate`
3. **Update composables:** Update `useTypedApi.ts` to include new endpoints

## Environment Variables

The API base URL is configured via:
- `NUXT_API_BASE_URL` - API base URL (default: `https://api.unburdy.de`)

## Generated Files

The generated files in `types/api/` are automatically created and should not be edited manually. They are excluded from git via `.gitignore`.

To regenerate after changes:
```bash
yarn api:generate
```
