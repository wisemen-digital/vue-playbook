# Debugging

#### [E2E Testing](/e2e-testing/)

## Quick Debugging Commands

| Command | Purpose |
|---------|---------|
| `npx playwright test --headed` | See the browser while tests run |
| `npx playwright test --ui` | Interactive UI mode for running and debugging |
| `npx playwright show-report` | Open the last HTML test report |
| `npx playwright test --debug` | Step-by-step debugging with Playwright Inspector |
| `npx playwright test --config playwright.debug.config.ts` | Use debug config (headed, no timeout) |

## Playwright UI Mode

The most powerful debugging tool. Start it with:

```bash
npx playwright test --ui
```

UI mode lets you:
- See all tests in a tree view
- Run individual tests
- Watch tests execute in real time
- Step through test actions
- Inspect the DOM at each step
- View network requests
- See console logs

## Trace Viewer

Traces are recorded on the **first retry** of a failed test (configured via `trace: 'on-first-retry'`). They capture:
- Screenshots at each action
- DOM snapshots
- Network requests and responses
- Console logs
- Test source code

### Viewing Traces

After a failed test run:

```bash
npx playwright show-report
```

1. Click on the failed test
2. Click on the "Traces" tab
3. Click "View trace" to open the trace viewer

Or open a trace file directly:

```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

### Force Trace Recording

To record traces for all tests (not just retries):

```bash
npx playwright test --trace on
```

## Debug Config

**File:** `playwright.debug.config.ts`

A dedicated config for local debugging with relaxed settings:

| Setting | Value | Why |
|---------|-------|-----|
| Port | 3000 | Different from main config to avoid conflicts |
| Headless | `false` | See the browser |
| Action timeout | `0` (unlimited) | No timeout pressure while debugging |
| Test match | `tests/debug.spec.ts` | Single file for experimentation |
| Projects | `debug` only | No auth setup |
| Reuse server | `true` | Faster iteration |

Usage:
```bash
npx playwright test --config playwright.debug.config.ts
```

Create a `tests/debug.spec.ts` file for quick experiments without affecting real tests.

## Console Monitoring

**File:** `tests/utils/console.util.ts`

The base fixture captures all console errors and warnings during tests. If any are found, the test fails.

### Understanding Console Failures

When a test fails due to console output, the error will show the captured messages:

```
expect(errors).toStrictEqual([])  // Shows the error messages
expect(warnings).toStrictEqual([])  // Shows the warning messages
```

### Excluded Warnings

Some known library warnings are excluded and won't fail tests:

```typescript
const EXCLUDED_WARNINGS = [
  'You are trying to animate filter from',    // Motion library
  'You are trying to animate transform from',  // Motion library
]
```

### Debugging Console Issues

1. Run the test in headed mode to see the browser console
2. Open DevTools (the test pauses on `--debug` flag)
3. Check the Console tab for errors/warnings
4. Fix the app code or add the warning to the exclude list if it's a known library issue

## Debugging Test Failures

### Step 1: Read the Error Message

Playwright error messages are descriptive. Common patterns:

| Error | Meaning |
|-------|---------|
| `Timeout 30000ms exceeded` | Test took too long (likely waiting for an element that never appeared) |
| `expect.toBeVisible` timed out | Element never became visible (missing handler? wrong selector?) |
| `Expected 1 element, found 0` | Selector matched nothing |
| `strict mode violation` | Selector matched multiple elements (make it more specific) |
| `wcag21aaViolations` | Accessibility violation (see [Accessibility Testing](/e2e-testing/accessibility-testing)) |

### Step 2: Reproduce Locally

```bash
# Run just the failing test
npx playwright test src/modules/airline/tests/airlineCreate.e2e.spec.ts

# Run with browser visible
npx playwright test src/modules/airline/tests/airlineCreate.e2e.spec.ts --headed

# Run with Playwright Inspector for step-by-step debugging
npx playwright test src/modules/airline/tests/airlineCreate.e2e.spec.ts --debug
```

### Step 3: Check Your Handlers

Most failures come from missing or incorrect mock handlers. Verify:

1. All API endpoints the page calls have handlers
2. Handlers return the expected data format
3. Handlers are set up **before** `page.goto()`
4. Pagination wrappers match the endpoint's response format

### Step 4: Use Playwright Inspector

Run with `--debug` to open the Inspector:

```bash
npx playwright test <test-file> --debug
```

The Inspector lets you:
- Step through test actions one at a time
- Inspect the DOM at each step
- Try selectors in the locator input
- See network requests

### Step 5: Add Temporary Debugging

For stubborn issues, add temporary debugging aids:

```typescript
// Pause the test to inspect the page
await page.pause()

// Take a screenshot
await page.screenshot({ path: 'debug-screenshot.png' })

// Log page content
console.log(await page.content())

// Wait for a specific response to debug API issues
const response = await page.waitForResponse('**/api/v1/airlines')
console.log(await response.json())
```

Remember to remove these before committing.

## Debugging CI Failures

### 1. Check the CI Artifacts

Failed CI runs produce test artifacts (screenshots, traces) that are uploaded as build artifacts. Download them from the GitHub Actions run page.

### 2. Run with Same Retries as CI

```bash
npx playwright test --retries 2
```

### 3. Common CI-Only Failures

| Issue | Cause | Fix |
|-------|-------|-----|
| Test passes locally, fails on CI | Timing issues, resource constraints | Use `await expect(...)` for all assertions |
| Auth setup timeout | Slow CI environment | Auth setup has 30s timeout for `/users/me` |
| Server startup timeout | Slow build on CI | Config allows 120s for server startup |

## WebSocket Debugging

WebSocket connections are mocked automatically by the base fixture. If your test involves WebSocket interactions, the mock is a simple echo server:

```typescript
// The mock setup (from websocket.util.ts)
page.routeWebSocket('wss://api.base.url/websockets*', (ws) => {
  ws.onMessage((message) => {
    if (message === 'request') {
      ws.send('response')
    }
  })
})
```

If you need custom WebSocket behavior for a test, you can set up additional WebSocket routes in your test before navigation.

## Next Steps

- [Common Pitfalls](/e2e-testing/common-pitfalls) - Known issues to watch for
- [CI & Coverage](/e2e-testing/ci-and-coverage) - Understanding CI test runs
