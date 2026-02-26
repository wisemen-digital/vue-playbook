# Configuration

#### [E2E Testing](/e2e-testing/)

## Main Config: `playwright.config.ts`

This is the primary configuration file. Here is each section explained:

### Environment

```typescript
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

const PORT = 4000
const ENVIRONMENT = 'mock'
```

- Loads variables from `.env.test`
- Tests run on port **4000**
- The app runs in **mock** environment mode, which enables MSW to intercept all API calls

### Timeouts

| Timeout | Value | Purpose |
|---------|-------|---------|
| `timeout` | 30,000ms (30s) | Maximum time for an entire test |
| `expect.timeout` | 10,000ms (10s) | Maximum time for `expect()` assertions to resolve |
| `actionTimeout` | 10,000ms (10s) | Maximum time for actions like `click()`, `fill()` |
| `webServer.timeout` | 120,000ms (2min) | Maximum time for the dev server to start |

### Projects

Two projects run in sequence:

```typescript
projects: [
  {
    name: 'setup',
    testMatch: /auth\.setup\.ts/,       // Runs auth setup first
  },
  {
    name: 'chromium',
    dependencies: ['setup'],             // Waits for auth to complete
    testMatch: /.*\.e2e\.spec\.ts/,
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'tests/.auth/user.json',  // Reuses saved auth state
    },
  },
]
```

- **setup**: Authenticates a user and saves browser state (cookies, localStorage) to `tests/.auth/user.json`
- **chromium**: All actual e2e tests run here. The saved auth state is loaded so tests start already logged in

> Firefox and WebKit are commented out. We only test in Chromium.

### Test Matching

```typescript
testMatch: [
  'src/modules/**/tests/*.e2e.spec.ts',
]
```

Tests must:
- Live in `src/modules/{module}/tests/`
- Be named `*.e2e.spec.ts`

### Shared Settings

```typescript
use: {
  actionTimeout: 10_000,
  baseURL: `http://localhost:${PORT}`,
  headless: true,
  testIdAttribute: 'data-test-id',
  trace: 'on-first-retry',
}
```

| Setting | Value | Purpose |
|---------|-------|---------|
| `baseURL` | `http://localhost:4000` | Allows using relative URLs: `page.goto('/airlines')` |
| `headless` | `true` | No browser UI visible (use `--headed` flag to override) |
| `testIdAttribute` | `data-test-id` | Custom attribute for `getByTestId()` selectors |
| `trace` | `on-first-retry` | Captures a trace file only on the first retry of a failed test |

### Parallelization and Retries

```typescript
fullyParallel: true,
workers: '100%',
retries: process.env.CI ? 2 : 0,
forbidOnly: Boolean(process.env.CI),
```

| Setting | Local | CI |
|---------|-------|-----|
| `workers` | 100% of CPU cores | 100% of CPU cores |
| `retries` | 0 (fail immediately) | 2 (retry twice) |
| `forbidOnly` | `false` | `true` (fails if `test.only` is found) |

### Web Server

```typescript
webServer: {
  command: process.env.COVERAGE === 'true' || process.env.PLAYWRIGHT_USE_PREVIEW === 'true'
    ? `pnpm build && pnpm preview --port ${PORT}`
    : `pnpm dev --port ${PORT}`,
  env: { ENVIRONMENT },
  port: PORT,
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
}
```

- **Default (local):** Uses the Vite dev server (`pnpm dev`) for fast startup and HMR
- **Coverage mode:** Builds the app with Istanbul instrumentation, then serves with `pnpm preview`
- **`reuseExistingServer`:** Locally, reuses an already-running server. On CI, always starts fresh

## Environment Variables: `.env.test`

```bash
API_BASE_URL=http://api.base.url
API_WEBSOCKET_URL=wss://api.base.url/websockets

AUTH_BASE_URL=http://auth.base.url
AUTH_CLIENT_ID=auth_client_id
AUTH_ORGANIZATION_ID=auth_organization_id
AUTH_INTERNAL_ORGANIZATION_ID=auth_internal_organization_id

GOOGLE_MAPS_API_KEY=google_maps_api_key

ENVIRONMENT=mock
```

These are **fake/placeholder values** because all API calls are intercepted by MSW. The URLs don't point to real services. The key setting is `ENVIRONMENT=mock` which tells the app to initialize the MSW service worker.

## Debug Config: `playwright.debug.config.ts`

A separate config for debugging individual tests locally:

| Setting | Debug Config | Main Config |
|---------|-------------|-------------|
| Port | 3000 | 4000 |
| Headless | `false` (visible) | `true` |
| Action timeout | `0` (no limit) | 10s |
| Test match | `tests/debug.spec.ts` | `src/modules/**/tests/*.e2e.spec.ts` |
| Projects | `debug` (no auth setup) | `setup` + `chromium` |
| Retries | 0 | 0 (local) / 2 (CI) |

Usage:
```bash
npx playwright test --config playwright.debug.config.ts
```

This config is useful when you want to write or debug a single test with the browser visible and no timeouts.

## Next Steps

- [Fixtures & Setup](/e2e-testing/fixtures-and-setup) - How the auth setup project works
- [Debugging](/e2e-testing/debugging) - Full debugging guide
