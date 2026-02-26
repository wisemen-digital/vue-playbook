# Getting Started

#### [E2E Testing](/e2e-testing/)

## Prerequisites

Before running e2e tests, make sure you have:

1. **Node.js** installed (check `.nvmrc` or `package.json` for the required version)
2. **pnpm** as the package manager (this is a pnpm workspace monorepo)
3. **Dependencies installed:** run `pnpm install` from the repository root
4. **Playwright browsers installed:**

```bash
npx playwright install chromium
```

> We only run tests in Chromium. Firefox and WebKit projects are commented out in the config.

## Running Tests

### Run all e2e tests

```bash
cd apps/web
pnpm test:e2e
```

This command:
1. Starts the Vite dev server on port 4000 (in `mock` environment mode)
2. Runs the `setup` project first (authenticates a test user)
3. Runs all `*.e2e.spec.ts` tests in parallel using Chromium

### Run a specific test file

```bash
npx playwright test src/modules/airline/tests/airlineCreate.e2e.spec.ts
```

### Run tests matching a pattern

```bash
npx playwright test --grep "can create airline"
```

### Run with Playwright UI mode

UI mode gives you a visual interface for running and debugging tests:

```bash
npx playwright test --ui
```

### Run in headed mode (see the browser)

```bash
npx playwright test --headed
```

### Run with the debug config

There is a separate `playwright.debug.config.ts` for local debugging. It uses port 3000, runs in headed mode, and has no action timeout:

```bash
npx playwright test --config playwright.debug.config.ts
```

### View the last test report

```bash
npx playwright show-report
```

### Run with code coverage

```bash
pnpm test:coverage-playwright
```

This builds the app with Istanbul instrumentation, runs tests, and generates an HTML coverage report in `coverage-playwright/`.

## What Happens When You Run Tests

Understanding the test execution flow helps when debugging issues:

```
pnpm test:e2e
  |
  +--> Vite dev server starts on port 4000 (ENVIRONMENT=mock)
  |
  +--> "setup" project runs first
  |      |
  |      +--> auth.setup.ts executes
  |      |     - Mocks OAuth/OIDC flow
  |      |     - Fills tenant code (JFK001) and email
  |      |     - Saves auth state to tests/.auth/user.json
  |
  +--> "chromium" project runs (depends on setup)
         |
         +--> For each *.e2e.spec.ts file (in parallel):
               - Loads auth state from tests/.auth/user.json
               - Sets up MSW worker with base handlers
               - Sets up console monitoring
               - Sets up WebSocket mock
               - Injects test permissions into browser
               - Runs test actions
               - Runs accessibility check (axe-core)
               - Validates no console errors/warnings
               - Collects coverage (if enabled)
```

## Your First Test

Here is a minimal e2e test to understand the anatomy:

```typescript
// src/modules/example/tests/exampleOverview.e2e.spec.ts

import { test } from '@tests/fixture/base.fixture'
import { MockHandlerFactory } from '@tests/utils/mockHandler.factory'

// Set permissions for all tests in this file
test.use({
  userPermissions: ['example.read'],
})

test('displays example page', async ({ page, worker }) => {
  // 1. Set up mock API responses
  await worker.use(
    MockHandlerFactory.example.getIndex([]),
  )

  // 2. Navigate to the page
  await page.goto('/examples')

  // 3. Assert something is visible
  await expect(page.getByRole('heading', { name: 'Examples' })).toBeVisible()
})
```

Key things to note:
- Import `test` from `@tests/fixture/base.fixture` (NOT from `@playwright/test`)
- Set permissions with `test.use({ userPermissions: [...] })`
- Set up API mocks with `worker.use(...)` before navigating
- Use ARIA role selectors like `getByRole()` as the primary selector strategy

## Next Steps

- [Architecture](/e2e-testing/architecture) - Understand how the test infrastructure is organized
- [Writing Tests](/e2e-testing/writing-tests) - Detailed guide on writing real tests
- [Common Pitfalls](/e2e-testing/common-pitfalls) - Avoid common mistakes
