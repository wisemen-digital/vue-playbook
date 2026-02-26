# Architecture

#### [E2E Testing](/e2e-testing/)

## Folder Structure

```
apps/web/
├── playwright.config.ts              # Main Playwright configuration
├── playwright.debug.config.ts        # Debug configuration (headed, port 3000)
├── .env.test                         # Environment variables for test mode
│
├── tests/                            # Shared test infrastructure
│   ├── .auth/
│   │   └── user.json                 # Stored auth state (auto-generated)
│   ├── auth.setup.ts                 # Authentication setup project
│   ├── auth.spec.ts                  # Auth verification (used by setup)
│   ├── fixture/
│   │   └── base.fixture.ts           # Extended test fixture (permissions, MSW, coverage, a11y)
│   └── utils/
│       ├── index.ts                  # Barrel export for utilities
│       ├── a11y.util.ts              # Accessibility checking (axe-core)
│       ├── console.util.ts           # Console error/warning monitoring
│       ├── coverage.util.ts          # Istanbul coverage collection
│       ├── form.test.util.ts         # Form field interaction helpers
│       ├── map.test.util.ts          # Map canvas interaction helpers
│       ├── pagination.test.util.ts   # Pagination response wrappers
│       ├── permissionContext.test.util.ts  # Global permission state
│       ├── table.test.util.ts        # Table assertion/interaction helpers
│       ├── test.util.ts              # General helpers (dialog locators)
│       ├── websocket.util.ts         # WebSocket route mocking
│       ├── mockHandler.factory.ts    # Central factory for all mock handlers
│       └── handlers/                 # Domain-specific MSW handlers
│           ├── airline.handlers.ts
│           ├── alert.handlers.ts
│           ├── charger.handlers.ts
│           ├── engagementStandard.handlers.ts
│           ├── geoZone.handlers.ts
│           ├── gse.handlers.ts
│           ├── organisation.handlers.ts
│           ├── parkingSpot.handlers.ts
│           ├── parkingSpotType.handlers.ts
│           ├── parkingZone.handlers.ts
│           ├── plug.handlers.ts
│           ├── turnaround.handlers.ts
│           └── user.handlers.ts
│
├── src/
│   ├── mocks/                        # Application-level MSW mocks (shared with dev mode)
│   │   ├── browser.mock.ts           # MSW browser worker setup
│   │   └── handlers/
│   │       ├── auth.mock.ts          # Auth/OIDC mock handlers + getCurrentUser()
│   │       ├── permissions.mock.ts   # Permission groups mock
│   │       ├── notification.mock.ts  # Notification handlers
│   │       ├── preferences.mock.ts   # User preferences handlers
│   │       ├── googleApi.mock.ts     # Google Maps API mock
│   │       └── tenantSettings.mock.ts # Tenant settings mock
│   │
│   └── modules/
│       └── {module}/
│           ├── models/
│           │   └── {entity}/
│           │       └── {entityDto}.builder.ts    # Test data builders
│           └── tests/
│               └── {testName}.e2e.spec.ts        # E2E test files
```

## How The Pieces Connect

```
                    playwright.config.ts
                           |
                    defines two projects:
                    /                    \
             "setup"                  "chromium"
          (auth.setup.ts)           (*.e2e.spec.ts)
                |                        |
        authenticates user          depends on "setup"
        saves storageState          loads storageState
                                         |
                                  base.fixture.ts
                                   /    |    \     \
                          coverage  permissions  MSW worker  console monitoring
                                        |           |
                              permissionContext   createWorkerFixture
                                        |           |
                              read by auth.mock  injects base handlers:
                              to build /me       - authHandlers
                              response           - googleApiHandlers
                                                 - notificationHandlers
                                                 - preferencesHandlers
                                                 - tenantSettingsHandlers
                                                         |
                                                test-specific handlers
                                                added via worker.use()
                                                         |
                                              MockHandlerFactory.{domain}
                                                         |
                                              handlers/{domain}.handlers.ts
                                                         |
                                                  DTO builders create
                                                  mock response data
```

## Two Layers of Mocking

The project has **two layers** of MSW handlers, and understanding this is important:

### Layer 1: Base Handlers (always active)

Defined in `src/mocks/handlers/` and loaded by `base.fixture.ts` into the MSW worker. These handle:
- Authentication (`/api/v1/users/me`, OIDC endpoints, token exchange)
- Tenant lookup (`/api/v1/find-tenant-by-slug`)
- Google Maps API
- Notifications
- User preferences
- Tenant settings

These are **always active** in every test. You don't need to set them up manually.

### Layer 2: Test-Specific Handlers (per test)

Defined in `tests/utils/handlers/` and applied via `worker.use(...)` inside individual tests. These mock the specific API endpoints your test needs (e.g., listing airlines, creating a user).

```typescript
// Layer 2: set up in each test
await worker.use(
  MockHandlerFactory.airline.getIndex([airline]),
  MockHandlerFactory.airline.createAirline({ uuid: '...' }),
)
```

Test-specific handlers **override** base handlers for the duration of the test.

## Test ↔ Source Code Co-location

E2e tests live **alongside their module's source code**, not in a separate top-level test directory:

```
src/modules/airline/
├── components/         # Vue components
├── models/
│   └── airline/
│       ├── index/
│       │   ├── airlineIndexDto.builder.ts   # Test data builder
│       │   └── ...
│       └── detail/
│           ├── airlineDetailDto.builder.ts  # Test data builder
│           └── ...
├── views/              # Page components
└── tests/              # E2E tests for this module
    ├── airlineCreate.e2e.spec.ts
    ├── airlineDelete.e2e.spec.ts
    ├── airlineOverview.e2e.spec.ts
    └── airlineUpdate.e2e.spec.ts
```

This pattern keeps tests close to the code they're testing, making it easy to find and update them together.

## Path Aliases

The project uses two TypeScript path aliases relevant to e2e tests:

| Alias | Resolves to | Use for |
|-------|-------------|---------|
| `@/*` | `./src/*` | Importing app code (builders, types, utils) |
| `@tests/*` | `./tests/*` | Importing test fixtures, utilities, handlers |

Examples:
```typescript
import { test } from '@tests/fixture/base.fixture'
import { FormTestUtil } from '@tests/utils/form.test.util'
import { AirlineIndexDtoBuilder } from '@/modules/airline/models/airline/index/airlineIndexDto.builder'
```

## Next Steps

- [Configuration](/e2e-testing/configuration) - Deep dive into playwright.config.ts
- [Fixtures & Setup](/e2e-testing/fixtures-and-setup) - Understand the base fixture and auth setup
- [API Mocking](/e2e-testing/api-mocking) - Learn the mocking architecture in detail
