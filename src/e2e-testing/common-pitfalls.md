# Common Pitfalls

#### [E2E Testing](/e2e-testing/)

## 1. Importing `test` from the Wrong Place

**Problem:** You import `test` from `@playwright/test` instead of `@tests/fixture/base.fixture`.

```typescript
// WRONG - no permissions, no MSW, no a11y checks
import { test } from '@playwright/test'

// CORRECT - all fixtures available
import { test } from '@tests/fixture/base.fixture'
```

**Symptoms:** `worker` is undefined, permissions don't work, no accessibility checks run, console monitoring is missing.

**Fix:** Always import `test` from `@tests/fixture/base.fixture`. Only `expect` should come from `@playwright/test`.

---

## 2. Forgetting to Set Up Mock Handlers Before Navigation

**Problem:** You navigate to a page before setting up the required API handlers.

```typescript
// WRONG - page loads and API calls have no handlers
await page.goto('/settings/airlines')
await worker.use(MockHandlerFactory.airline.getIndex([]))

// CORRECT - handlers set up before navigation
await worker.use(MockHandlerFactory.airline.getIndex([]))
await page.goto('/settings/airlines')
```

**Symptoms:** The page shows loading spinners, error states, or empty content. Tests time out waiting for elements.

**Fix:** Always call `worker.use(...)` before `page.goto(...)`.

---

## 3. Missing Required Handlers

**Problem:** You set up handlers for some endpoints but not all the ones the page calls on load.

```typescript
// A page that shows airlines AND handler terminals
// WRONG - missing handler-terminals handler
await worker.use(
  MockHandlerFactory.airline.getIndex([airline]),
)

// CORRECT - all endpoints covered
await worker.use(
  MockHandlerFactory.airline.getIndex([airline]),
  MockHandlerFactory.airline.getAirlineHandlerTerminals([]),
)
```

**Symptoms:** Partial page rendering, some sections show loading/error states, unhandled request warnings.

**Fix:** Open the page in the browser (with MSW devtools) to see which API calls the page makes. Set up handlers for all of them.

---

## 4. Forgetting Permissions

**Problem:** You don't set `userPermissions` and the user has no permissions at all.

```typescript
// WRONG - no permissions, user can't see anything
test('can create airline', async ({ page, worker }) => {
  await worker.use(MockHandlerFactory.airline.getIndex([]))
  await page.goto('/settings/airlines')
  // Button won't be visible because user lacks 'airline.create' permission
  await page.getByRole('button', { name: 'Create' }).click()
})

// CORRECT
test.use({ userPermissions: ['airline.read', 'airline.create'] })

test('can create airline', async ({ page, worker }) => {
  // ...
})
```

**Symptoms:** Elements that should be visible are missing. Buttons, menu items, or entire pages are hidden.

**Fix:** Always set `test.use({ userPermissions: [...] })` at the appropriate describe or file level.

---

## 5. Leaving `test.only` in the Code

**Problem:** You used `test.only()` during development and forgot to remove it.

```typescript
// This will FAIL on CI
test.only('my test', async ({ page }) => { ... })
```

**Symptoms:** CI build fails with `forbidOnly` error.

**Fix:** Remove `test.only()` before pushing. Search your changes for `.only` before committing.

---

## 6. Console Errors Causing Test Failures

**Problem:** Your test passes functionally, but fails because the app logged console errors or warnings.

The base fixture monitors console output and fails the test if any `error` or `warning` messages are logged.

**Symptoms:** Test assertions pass, but the test still fails. The error message shows unexpected console errors/warnings.

**Fix:**
- Fix the underlying console error/warning in the app code
- If it's a known library warning (like Motion animation warnings), it may already be excluded in `console.util.ts`:

```typescript
const EXCLUDED_WARNINGS = [
  'You are trying to animate filter from',
  'You are trying to animate transform from',
]
```

---

## 7. Flaky Tests Due to Timing

**Problem:** Tests pass locally but fail intermittently on CI.

**Common causes:**
- Not waiting for API responses before asserting
- Not waiting for animations to complete
- Race conditions between navigation and assertion

**Fix strategies:**

```typescript
// WRONG - assert immediately without waiting
await page.goto('/settings/airlines')
expect(page.getByText('Test Airline')).toBeVisible()  // May fail if data hasn't loaded

// CORRECT - Playwright's expect auto-retries
await page.goto('/settings/airlines')
await expect(page.getByText('Test Airline')).toBeVisible()  // Retries until visible or timeout
```

Always use `await expect(...)` for assertions. Playwright's `expect` automatically retries until the condition is met or the timeout expires.

---

## 8. Wrong Row Index in Table Assertions

**Problem:** `TableTestUtil` uses 0-based row indexing but internally adds +1 to skip the header row.

```typescript
// Row 0 = first data row (not the header)
await tableTestUtil.expectRowValues(0, ['First Item', ...])
await tableTestUtil.expectRowValues(1, ['Second Item', ...])
```

**Symptoms:** Assertions match the wrong row data.

**Fix:** Remember that row index 0 means the first data row, not the header.

---

## 9. Form Submit Not Working

**Problem:** `form.submit()` doesn't do anything or throws an error.

The `submit()` method works by:
1. Getting the form's `id` attribute
2. Finding a button/element with `[form="<id>"]` attribute
3. Clicking that element

**Symptoms:** "Expected 1 element, found 0" error.

**Fix:** Ensure:
- The `<form>` element has an `id` attribute
- The submit button has a matching `form="<id>"` attribute
- If the form is inside a dialog, pass the dialog's form locator: `new FormTestUtil(page, dialog.locator('form'))`

---

## 10. Test-Specific Handlers Not Overriding Base Handlers

**Problem:** A handler you set up in a test doesn't seem to take effect because a base handler catches the same URL first.

This is especially tricky with the `/api/v1/users/:userUuid` DELETE handler, which is in `auth.mock.ts` globally (with a comment explaining why).

**Symptoms:** API calls return unexpected data from a different handler.

**Fix:** Check both layers of handlers (see [Architecture - Two Layers of Mocking](/e2e-testing/architecture#two-layers-of-mocking)). Test-specific handlers set via `worker.use()` should override base handlers, but verify URL patterns match exactly.

---

## 11. Accessibility Violations Failing Tests

**Problem:** Your test passes functionally but fails due to WCAG 2.1 AA violations.

**Symptoms:** Test error mentions `wcag21aaViolations` is not empty.

**Fix:**
1. Open the test report (`npx playwright show-report`)
2. Look at the "accessibility-scan-results" attachment
3. Find the specific violation (e.g., missing label, insufficient contrast)
4. Fix the accessibility issue in the component code

Do **not** try to skip the accessibility check. Fix the underlying issue instead.

---

## 12. Using CSS Selectors Instead of ARIA Roles

**Problem:** Using CSS selectors or test IDs when ARIA role selectors would be more appropriate.

```typescript
// AVOID - brittle, tied to implementation
await page.locator('.btn-primary').click()
await page.locator('[data-test-id="create-btn"]').click()

// PREFER - semantic, resilient to refactoring
await page.getByRole('button', { name: 'Create' }).click()
```

**Symptoms:** Tests break when CSS classes or DOM structure changes, even though the UI behavior is unchanged.

**Fix:** Use ARIA role selectors as the primary strategy. See [Best Practices](/e2e-testing/best-practices) for the selector priority guide.

---

## 13. DateField Fill Order

**Problem:** The `DateField.fill()` method types date parts in a specific order: month, day, year. Getting this wrong produces incorrect dates.

```typescript
// Fills January 15, 2025
await dateField.fill({ month: '01', day: '15', year: '2025' })
```

The keyboard input follows the browser's native date input behavior, which expects month/day/year order with Tab between parts.

**Fix:** Always provide all three parts (`month`, `day`, `year`) as zero-padded strings.

## Next Steps

- [Best Practices](/e2e-testing/best-practices) - How to avoid these pitfalls
- [Debugging](/e2e-testing/debugging) - How to investigate failing tests
