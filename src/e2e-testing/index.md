# E2E Testing

Complete documentation for the Playwright end-to-end testing setup. This section covers everything from getting started to CI integration, including architecture, API mocking, test utilities, and best practices.

## Table of contents

- [Getting Started](/e2e-testing/getting-started.md)
- [Architecture](/e2e-testing/architecture.md)
- [Configuration](/e2e-testing/configuration.md)
- [Writing Tests](/e2e-testing/writing-tests.md)
- [Fixtures & Setup](/e2e-testing/fixtures-and-setup.md)
- [API Mocking](/e2e-testing/api-mocking.md)
- [Test Utilities](/e2e-testing/test-utilities.md)
- [Test Data Builders](/e2e-testing/test-data-builders.md)
- [Accessibility Testing](/e2e-testing/accessibility-testing.md)
- [Common Pitfalls](/e2e-testing/common-pitfalls.md)
- [Best Practices](/e2e-testing/best-practices.md)
- [Debugging](/e2e-testing/debugging.md)
- [CI & Coverage](/e2e-testing/ci-and-coverage.md)

## Quick Reference

- **Run all e2e tests:** `pnpm test:e2e`
- **Run a specific test file:** `npx playwright test src/modules/airline/tests/airlineCreate.e2e.spec.ts`
- **Run with UI mode:** `npx playwright test --ui`
- **View last test report:** `npx playwright show-report`
- **Test file naming:** `*.e2e.spec.ts`
- **Test file location:** `src/modules/{module}/tests/`

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| `@playwright/test` | 1.56.1 | Test runner and browser automation |
| `playwright-msw` | 3.0.1 | MSW integration for Playwright |
| `msw` | 2.10.4 | API mocking (Mock Service Worker) |
| `@axe-core/playwright` | 4.10.2 | Accessibility testing |
| `nyc` | 17.1.0 | Code coverage reporting |
| `vite-plugin-istanbul` | 7.1.0 | Coverage instrumentation |
