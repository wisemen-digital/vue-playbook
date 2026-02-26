# Best Practices

#### [E2E Testing](/e2e-testing/)

## DO

### Use ARIA Role Selectors as Primary Strategy

Prefer semantic selectors that match how users and screen readers perceive the UI:

```typescript
// Best: ARIA roles
await page.getByRole('button', { name: 'Create' }).click()
await page.getByRole('heading', { name: 'Airlines' }).isVisible()
await page.getByRole('table')
await page.getByRole('dialog')

// Good: Labels
await page.getByLabel('Name').fill('Test')

// Good: Text content
await page.getByText('No airlines found')

// Acceptable: Test IDs (when no semantic alternative exists)
await page.getByTestId('airline-map-canvas')
```

### Selector Priority

1. `getByRole()` - buttons, links, headings, tables, dialogs, form controls
2. `getByLabel()` - form inputs with associated labels
3. `getByText()` - visible text content
4. `getByTestId()` - custom `data-test-id` attributes (last resort)

### Use the Test Utilities

Always use `FormTestUtil`, `TableTestUtil`, `TestUtil`, and `MapTestUtil` instead of writing raw selectors:

```typescript
// DO: Use FormTestUtil
const form = new FormTestUtil(page, dialog.locator('form'))
const nameField = form.getTextFieldByLabel('Name')
await nameField.fill('Test')

// DON'T: Raw selectors
await page.locator('input[name="name"]').fill('Test')
```

### Set Up All Handlers Before Navigation

```typescript
test('displays airlines', async ({ page, worker }) => {
  // Set up ALL handlers the page needs
  await worker.use(
    MockHandlerFactory.airline.getIndex([airline]),
    MockHandlerFactory.airline.getAirlineHandlerTerminals([]),
  )

  // Then navigate
  await page.goto('/settings/airlines')
})
```

### Test Both Permission Scenarios

For permission-gated features, test both the "has permission" and "missing permission" cases:

```typescript
test.describe('Airline management', () => {
  test.describe('with create permission', () => {
    test.use({ userPermissions: ['airline.read', 'airline.create'] })
    test('shows create button', async ({ page, worker }) => { ... })
  })

  test.describe('without create permission', () => {
    test.use({ userPermissions: ['airline.read'] })
    test('hides create button', async ({ page, worker }) => { ... })
  })
})
```

### Use Builders for Test Data

```typescript
// DO: Use builder with explicit values
const airline = new AirlineIndexDtoBuilder()
  .withName('Test Airline')
  .withIcaoCode('TAL')
  .build()

// DON'T: Inline object literals
const airline = {
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Airline',
  iataCode: 'TA',
  icaoCode: 'TAL',
  icon: null,
}
```

### Use `await expect(...)` for Assertions

Playwright's `expect` with `await` automatically retries until the condition is met:

```typescript
// DO: Auto-retrying assertion
await expect(page.getByText('Success')).toBeVisible()

// DON'T: One-shot check that can be flaky
const text = await page.textContent('.message')
expect(text).toBe('Success')
```

### Use Descriptive Test Names

Name tests by what the user is doing, not what the code does:

```typescript
// DO
test('can create airline successfully', ...)
test('cannot see create button without permission', ...)
test('displays airline table with correct data', ...)

// DON'T
test('test1', ...)
test('airline post', ...)
test('button visibility', ...)
```

### Scope Forms to Dialogs

When interacting with a form inside a dialog, scope the `FormTestUtil` to the dialog:

```typescript
const testUtil = new TestUtil(page)
const dialog = testUtil.getActiveDialog()
const form = new FormTestUtil(page, dialog.locator('form'))
```

This prevents accidentally interacting with form elements outside the dialog.

### Use `test.describe()` to Group Related Tests

```typescript
test.describe('Airline CRUD', () => {
  test.describe('Create', () => {
    test.use({ userPermissions: ['airline.read', 'airline.create'] })
    test('can create airline', ...)
  })

  test.describe('Delete', () => {
    test.use({ userPermissions: ['airline.read', 'airline.delete'] })
    test('can delete airline', ...)
  })
})
```

---

## DON'T

### Don't Use CSS Selectors

```typescript
// DON'T
await page.locator('.btn-primary').click()
await page.locator('#create-form input:first-child').fill('Test')
await page.locator('div.table-row:nth-child(2)').click()
```

CSS selectors are brittle and break when styling or DOM structure changes.

### Don't Use `test.only` in Committed Code

```typescript
// NEVER commit this - CI will reject it
test.only('my test', async ({ page }) => { ... })
```

The `forbidOnly` config option catches this on CI.

### Don't Hardcode UUIDs

```typescript
// DON'T
const uuid = '123e4567-e89b-12d3-a456-426614174000'

// DO
const uuid = UuidUtil.getRandom()

// Or use the builder default
const airline = new AirlineIndexDtoBuilder().build()  // UUID auto-generated
```

### Don't Skip Accessibility Fixes

When a test fails due to accessibility violations, fix the component, don't work around the check.

### Don't Add Artificial Waits

```typescript
// DON'T
await page.waitForTimeout(2000)

// DO - wait for specific conditions
await expect(page.getByRole('table')).toBeVisible()
await page.waitForResponse((res) => res.url().includes('/api/v1/airlines'))
```

### Don't Test Implementation Details

Test user-visible behavior, not internal state:

```typescript
// DON'T - testing implementation
expect(await page.evaluate(() => (window as any).__store__.state.airlines.length)).toBe(3)

// DO - testing user-visible behavior
const table = new TableTestUtil(page.getByRole('table'))
await table.expectRowValues(0, ['Airline A', ...])
await table.expectRowValues(1, ['Airline B', ...])
await table.expectRowValues(2, ['Airline C', ...])
```

### Don't Create Overly Broad Handlers

```typescript
// DON'T - catches everything, hard to debug
http.get('*', () => HttpResponse.json({}))

// DO - specific endpoint
http.get('*/api/v1/airlines', () => HttpResponse.json(
  PaginationTestUtil.toOffsetPaginationResponse(airlines)
))
```

### Don't Duplicate Permissions Across Tests

If all tests in a file need the same permissions, set them once at the file or describe level:

```typescript
// DON'T - repetitive
test('test 1', async ({ page, worker }) => { ... })
test('test 2', async ({ page, worker }) => { ... })
// Each with test.use inside

// DO - set once at the top
test.use({ userPermissions: ['airline.read'] })
test('test 1', ...)
test('test 2', ...)
```

## File Naming Convention

| Convention | Example |
|-----------|---------|
| Test file | `airlineCreate.e2e.spec.ts` |
| Camel case | Feature + action: `airlineCreate`, `userDelete`, `parkingZoneOverview` |
| Suffix | Always `.e2e.spec.ts` |
| Location | `src/modules/{module}/tests/` |

Existing test names follow this pattern:
- `airlineCreate.e2e.spec.ts`
- `airlineDelete.e2e.spec.ts`
- `airlineOverview.e2e.spec.ts`
- `airlineUpdate.e2e.spec.ts`
- `userCreate.e2e.spec.ts`
- `parkingZoneCreate.e2e.spec.ts`

## Test Structure Convention

```typescript
import { expect } from '@playwright/test'
import { test } from '@tests/fixture/base.fixture'
// Import utilities as needed
// Import builders and types as needed

test.describe('Feature name', () => {
  test.describe('Permission scenario', () => {
    test.use({ userPermissions: [...] })

    test('user action and expected outcome', async ({ page, worker }) => {
      // 1. Arrange: set up handlers and data
      await worker.use(...)

      // 2. Act: navigate and interact
      await page.goto(...)
      await page.getByRole(...).click()

      // 3. Assert: verify outcomes
      await expect(...).toBeVisible()
    })
  })
})
```

## Next Steps

- [Writing Tests](/e2e-testing/writing-tests) - Apply these practices
- [Common Pitfalls](/e2e-testing/common-pitfalls) - What happens when you don't follow these
