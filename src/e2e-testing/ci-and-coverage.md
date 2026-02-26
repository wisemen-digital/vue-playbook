# CI & Coverage

#### [E2E Testing](/e2e-testing/)

## CI Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/pullrequest-check.yml`

E2e tests run automatically on every pull request (opened, synchronized, reopened, or marked ready for review) targeting the `main` branch.

The workflow uses a shared workflow from `wisemen-digital/devops-github-actions`:

```yaml
lint-build-test:
  uses: wisemen-digital/devops-github-actions/.github/workflows/project-build-and-test.yml@v1
  with:
    test-nats-enabled: true
    test-playwright-image: 'mcr.microsoft.com/playwright:v1.56.1'
    test-postgres-image: timescale/timescaledb-ha:pg16
    test-redis-enabled: true
    test-typesense-enabled: true
    test-typesense-image: 'typesense/typesense:29.0'
    test-timeout: 30
```

### CI Environment

| Component | Image/Version |
|-----------|---------------|
| Playwright | `mcr.microsoft.com/playwright:v1.56.1` |
| PostgreSQL | `timescale/timescaledb-ha:pg16` |
| Redis | Enabled |
| NATS | Enabled |
| Typesense | `typesense/typesense:29.0` |

The full infrastructure stack is available in CI for both API and frontend tests.

### CI-Specific Behavior

The Playwright config behaves differently on CI (detected via `process.env.CI`):

| Setting | Local | CI |
|---------|-------|-----|
| Retries | 0 | 2 |
| `forbidOnly` | `false` | `true` |
| Reuse existing server | Yes | No |
| Trace recording | On first retry | On first retry |

### Test Timeout

The overall CI test timeout is **30 minutes** (`test-timeout: 30`). Individual test timeout is 30 seconds.

## Test Reports

### HTML Report

After running tests locally:

```bash
npx playwright show-report
```

This opens an interactive HTML report showing:
- Test results (pass/fail/skip)
- Test duration
- Error messages and stack traces
- Screenshots (on failure)
- Trace files (on first retry)
- Accessibility scan results (as attachments)

### CI Report Artifacts

On CI, test reports and artifacts (screenshots, traces) are typically uploaded as build artifacts. Download them from the GitHub Actions run page to debug CI failures.

## Code Coverage

### How Coverage Works

Coverage is collected using **Istanbul** instrumentation via `vite-plugin-istanbul`:

1. The app is built with Istanbul instrumentation (when `COVERAGE=true`)
2. Tests run against the built app (preview mode instead of dev mode)
3. After each test, the base fixture collects `__coverage__` data from the browser
4. Coverage data is written to `.nyc_output/` as JSON files
5. `nyc` generates the final report

### Running with Coverage

```bash
pnpm test:coverage-playwright
```

This command:
1. Sets `COVERAGE=true`
2. Runs `pnpm test:e2e` (which builds the app first, then uses `pnpm preview`)
3. Runs `nyc report` to generate reports in `coverage-playwright/`

### Coverage Reports

Three report formats are generated:

| Format | Location | Purpose |
|--------|----------|---------|
| HTML | `coverage-playwright/` | Visual report for browsing |
| LCOV | `coverage-playwright/lcov.info` | For CI coverage tools |
| JSON Summary | `coverage-playwright/coverage-summary.json` | For programmatic access |

### How Coverage Collection Works

**File:** `tests/utils/coverage.util.ts`

```typescript
// 1. Before each test: initialize Istanbul coverage
await context.addInitScript(() => {
  (globalThis as any).__coverage__ = {}
})

// 2. After each test: collect coverage data
for (const page of context.pages()) {
  const coverage = await page.evaluate(() =>
    JSON.stringify((globalThis as any).__coverage__ || {}))
  if (coverage && coverage !== '{}') {
    collectIstanbulCoverage(coverage)
  }
}
```

Coverage data is written to `.nyc_output/playwright_coverage_<uuid>.json` for each test.

### Coverage vs. Speed

| Mode | Command | Web Server | Speed | Coverage |
|------|---------|------------|-------|----------|
| Normal | `pnpm test:e2e` | `pnpm dev` | Fast | No |
| Coverage | `pnpm test:coverage-playwright` | `pnpm build && pnpm preview` | Slow | Yes |

Use normal mode during development for fast feedback. Run with coverage before merging or during CI.

### Combined Coverage

The project can combine Vitest (unit test) and Playwright (e2e test) coverage:

```bash
pnpm test:coverage
```

This runs both `test:coverage-vitest` and `test:coverage-playwright` sequentially.

## Local Infrastructure

### Docker Compose

**File:** `docker-compose.yaml`

For running the full stack locally (needed for API tests, not for frontend e2e tests):

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL (TimescaleDB) | 5432 | Database |
| Zitadel | 8080 | Identity Provider |
| Typesense | 8108 | Search engine |
| NATS | 4222 | Message broker |
| Redis | 6379 | Cache |
| MinIO (S3) | 9000, 9001 | Object storage |
| Go Feature Flag | 1031 | Feature flags |

> Frontend e2e tests do **not** need Docker services. They use MSW to mock all APIs. Docker is only needed for API/backend tests.

## Troubleshooting CI

### Tests pass locally but fail on CI

1. **Timing issues:** CI machines may be slower. Ensure all assertions use `await expect(...)` for auto-retry
2. **Retries masking issues:** CI retries 2 times. A test might pass on retry due to flakiness. Check if the test has intermittent failures
3. **Server startup:** The dev server gets 120 seconds to start. On CI, the build + preview flow is used for coverage, which takes longer

### CI timeout

The 30-minute total timeout should be sufficient. If tests are timing out:
- Check if a test has an infinite loop or is stuck waiting
- Verify the web server starts within 120 seconds
- Look for tests that aren't properly cleaning up

### `forbidOnly` failure

CI fails if any test file contains `test.only`. Search your changes:

```bash
grep -r "test.only" src/modules/*/tests/
```

## Next Steps

- [Configuration](/e2e-testing/configuration) - Config details that affect CI behavior
- [Debugging](/e2e-testing/debugging) - Investigating CI failures
