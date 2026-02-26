# API Mocking

#### [E2E Testing](/e2e-testing/)

## Overview

All API calls in e2e tests are intercepted by **MSW (Mock Service Worker)** via the `playwright-msw` integration. No real API server is needed. This gives us:

- **Full control** over API responses (success, error, empty states)
- **Deterministic tests** that don't depend on external services
- **Fast execution** with no network latency

## How It Works

```
Browser (Playwright)              Node.js (Test Runner)
     |                                  |
     |  App makes fetch('/api/v1/...')  |
     |  ──────────────────────────────> |
     |                                  |  playwright-msw intercepts
     |                                  |  matches against registered handlers
     |                                  |  returns mock response
     |  <────────────────────────────── |
     |  App receives mock JSON          |
```

The `playwright-msw` library bridges MSW (which normally runs in a browser service worker) to work with Playwright's Node.js test runner. Handlers are defined in Node.js and the library intercepts requests at the network level.

## Two Layers of Handlers

### Base Handlers (Always Active)

Loaded by `base.fixture.ts` when creating the MSW worker. These handle endpoints that every page needs:

```typescript
worker: createWorkerFixture([
  ...authHandlers,          // /api/v1/users/me, OIDC endpoints, tenant lookup
  ...googleApiHandlers,     // Google Maps API
  ...notificationHandlers,  // Notifications
  ...preferencesHandlers,   // User UI preferences
  ...tenantSettingsHandlers, // Tenant settings
])
```

You **never** need to set these up in your tests. They are always available.

### Test-Specific Handlers

Set up in each test via `worker.use(...)`. These mock the endpoints your specific page needs:

```typescript
test('displays airlines', async ({ page, worker }) => {
  await worker.use(
    MockHandlerFactory.airline.getIndex([airline]),
  )
  // ...
})
```

Test-specific handlers **override** base handlers with matching URLs for the duration of that test.

## The MockHandlerFactory

**File:** `tests/utils/mockHandler.factory.ts`

A central factory that provides access to all domain-specific handler classes:

```typescript
MockHandlerFactory.airline          // AirlineHandlers
MockHandlerFactory.alert            // AlertHandlers
MockHandlerFactory.charger          // ChargerHandlers
MockHandlerFactory.engagementStandard // EngagementStandardHandlers
MockHandlerFactory.geoZone          // GeoZoneHandlers
MockHandlerFactory.gse              // GseHandlers
MockHandlerFactory.organisation     // OrganisationHandlers
MockHandlerFactory.parkingSpot      // ParkingSpotHandlers
MockHandlerFactory.parkingSpotType  // ParkingSpotTypeHandlers
MockHandlerFactory.parkingZone      // ParkingZoneHandlers
MockHandlerFactory.plug             // PlugHandlers
MockHandlerFactory.turnaround       // TurnaroundHandlers
MockHandlerFactory.user             // UserHandlers
```

## Handler Classes

Each handler class is in `tests/utils/handlers/` and follows the same pattern:

```typescript
// tests/utils/handlers/airline.handlers.ts
export class AirlineHandlers {
  static getIndex(data: AirlineResponse[]): HttpHandler {
    return http.get('*/api/v1/airlines', () =>
      HttpResponse.json(PaginationTestUtil.toOffsetPaginationResponse(data)))
  }

  static getAirlineDetail(data: ViewAirlineDetailResponse): HttpHandler {
    return http.get('*/api/v1/airlines/:uuid', () =>
      HttpResponse.json(data))
  }

  static createAirline(data: { uuid: string }): HttpHandler {
    return http.post('*/api/v1/airlines', () =>
      HttpResponse.json(data))
  }

  static updateAirline(): HttpHandler {
    return http.put('*/api/v1/airlines/:uuid', () =>
      HttpResponse.json())
  }

  static deleteAirline(): HttpHandler {
    return http.delete('*/api/v1/airlines/:uuid', () =>
      HttpResponse.json())
  }
}
```

### Key Patterns

| Pattern | Example | When to Use |
|---------|---------|-------------|
| Return data | `getIndex(data)` | List/detail endpoints that return JSON |
| Return empty | `deleteAirline()` | Mutation endpoints that return empty 200 |
| Return created UUID | `createAirline({ uuid })` | Create endpoints that return the new ID |
| URL parameters | `*/api/v1/airlines/:uuid` | Endpoints with path parameters |

### URL Matching

Handlers use glob patterns prefixed with `*` to match any origin:

```typescript
http.get('*/api/v1/airlines', ...)     // Matches http://api.base.url/api/v1/airlines
http.get('*/api/v1/airlines/:uuid', ...)  // Matches any UUID in the path
```

The `*` prefix is important because the actual API base URL (`http://api.base.url`) comes from `.env.test`.

## Pagination Utilities

**File:** `tests/utils/pagination.test.util.ts`

Most list endpoints return paginated responses. The `PaginationTestUtil` wraps arrays in the expected format:

### Offset Pagination

```typescript
PaginationTestUtil.toOffsetPaginationResponse([item1, item2])
// Returns:
// {
//   items: [item1, item2],
//   meta: { offset: 0, limit: 2, total: 2 }
// }
```

### Keyset Pagination

```typescript
PaginationTestUtil.toKeysetPaginationResponse([item1, item2])
// Returns:
// {
//   items: [item1, item2],
//   meta: { limit: 2, next: null }
// }
```

Use whichever pagination style your endpoint expects.

## Writing a New Handler Class

When adding e2e tests for a new module, you'll need to create handlers:

### 1. Create the handler class

```typescript
// tests/utils/handlers/newFeature.handlers.ts
import { PaginationTestUtil } from '@tests/utils/pagination.test.util'
import type { HttpHandler } from 'msw'
import { http, HttpResponse } from 'msw'
import type { NewFeatureResponse } from '@/client'

export class NewFeatureHandlers {
  static getIndex(data: NewFeatureResponse[]): HttpHandler {
    return http.get('*/api/v1/new-features', () =>
      HttpResponse.json(PaginationTestUtil.toOffsetPaginationResponse(data)))
  }

  static create(data: { uuid: string }): HttpHandler {
    return http.post('*/api/v1/new-features', () =>
      HttpResponse.json(data))
  }

  static delete(): HttpHandler {
    return http.delete('*/api/v1/new-features/:uuid', () =>
      HttpResponse.json())
  }
}
```

### 2. Register in MockHandlerFactory

```typescript
// tests/utils/mockHandler.factory.ts
import { NewFeatureHandlers } from '@tests/utils/handlers/newFeature.handlers'

export class MockHandlerFactory {
  // ... existing handlers ...

  static get newFeature(): typeof NewFeatureHandlers {
    return NewFeatureHandlers
  }
}
```

### 3. Use in tests

```typescript
await worker.use(
  MockHandlerFactory.newFeature.getIndex([item]),
  MockHandlerFactory.newFeature.create({ uuid: UuidUtil.getRandom() }),
)
```

## Using `http` Directly for One-Off Handlers

For handlers you only need in a single test, you can use the `http` fixture directly instead of creating a handler class:

```typescript
test('handles special case', async ({ page, worker, http }) => {
  await worker.use(
    http.get('*/api/v1/special-endpoint', () =>
      HttpResponse.json({ special: true })),
  )
  // ...
})
```

This is handy for quick one-off mocks but should be avoided for endpoints used across multiple tests.

## Mocking Error Responses

To test error handling, return an error status:

```typescript
static getIndexError(): HttpHandler {
  return http.get('*/api/v1/airlines', () =>
    new HttpResponse(JSON.stringify({ error: 'Server Error' }), { status: 500 }))
}
```

Or for validation errors:

```typescript
static createValidationError(): HttpHandler {
  return http.post('*/api/v1/airlines', () =>
    new HttpResponse(JSON.stringify({
      error: 'Validation failed',
      details: { name: 'Name is required' },
    }), { status: 422 }))
}
```

## Next Steps

- [Test Data Builders](/e2e-testing/test-data-builders) - Creating mock data with builders
- [Test Utilities](/e2e-testing/test-utilities) - Interacting with the UI after mocking
- [Common Pitfalls](/e2e-testing/common-pitfalls) - Mocking-related gotchas
