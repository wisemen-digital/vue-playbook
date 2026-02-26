# Writing Tests

#### [E2E Testing](/e2e-testing/)

## Step-by-Step: Writing a New E2E Test

### Step 1: Create the test file

Create a new file in your module's `tests/` directory:

```
src/modules/{your-module}/tests/{featureName}.e2e.spec.ts
```

The file **must** end with `.e2e.spec.ts` to be picked up by Playwright.

### Step 2: Import the base fixture

Always import `test` from the base fixture, not directly from `@playwright/test`:

```typescript
import { expect } from '@playwright/test'
import { test } from '@tests/fixture/base.fixture'
```

> `expect` still comes from `@playwright/test`. Only `test` comes from the base fixture.

### Step 3: Set permissions

Define what permissions the test user has:

```typescript
test.use({
  userPermissions: ['airline.read', 'airline.create'],
})
```

Without permissions, the user has **no permissions at all** (empty array is the default). This is intentional: it lets you test permission-gated UI elements.

### Step 4: Set up mock handlers

Inside each test, configure the API responses using `worker.use()`:

```typescript
test('creates an airline', async ({ page, worker }) => {
  await worker.use(
    MockHandlerFactory.airline.getIndex([]),
    MockHandlerFactory.airline.createAirline({ uuid: UuidUtil.getRandom() }),
  )
  // ...
})
```

> Always set up handlers **before** navigating to the page.

### Step 5: Navigate and interact

```typescript
await page.goto('/settings/airlines')

await page.getByRole('button', { name: 'Create' }).click()
```

### Step 6: Use test utilities for forms, tables, dialogs

```typescript
const testUtil = new TestUtil(page)
const dialog = testUtil.getActiveDialog()
const form = new FormTestUtil(page, dialog.locator('form'))

const nameField = form.getTextFieldByLabel('Name')
await nameField.fill('Test Airline')

await form.submit()
```

### Step 7: Assert outcomes

```typescript
await expect(page.getByText('Test Airline')).toBeVisible()
```

## Complete Real-World Example

Here is `airlineCreate.e2e.spec.ts` fully annotated:

```typescript
import { expect } from '@playwright/test'
import { test } from '@tests/fixture/base.fixture'
import { FormTestUtil } from '@tests/utils/form.test.util'
import { MockHandlerFactory } from '@tests/utils/mockHandler.factory'
import { TestUtil } from '@tests/utils/test.util'

import { AirlineDetailDtoBuilder } from '@/modules/airline/models/airline/detail/airlineDetailDto.builder'
import { UuidUtil } from '@/utils/uuid/uuid.util'

// Top-level describe groups related tests
test.describe('Airline create', () => {

  // Nested describe for a specific permission scenario
  test.describe('Permission: AIRLINE_CREATE', () => {

    // Set permissions for all tests in this describe block
    test.use({
      userPermissions: [
        'airline.read',
        'airline.create',
      ],
    })

    test('can create airline successfully', async ({ page, worker }) => {
      // Set up ALL API handlers the page will need
      await worker.use(
        MockHandlerFactory.airline.getIndex([]),                              // GET /airlines (empty list)
        MockHandlerFactory.airline.getAirlineDetail(                          // GET /airlines/:uuid
          new AirlineDetailDtoBuilder().build(),
        ),
        MockHandlerFactory.airline.createAirline({                            // POST /airlines
          uuid: UuidUtil.getRandom(),
        }),
        MockHandlerFactory.airline.getAirlineHandlerTerminals([]),            // GET /airlines/:uuid/handler-terminals
      )

      // Navigate
      await page.goto('/settings/airlines')

      // Click create button
      await page.getByRole('button', { name: 'Create' }).click()

      // Interact with the dialog form
      const testUtil = new TestUtil(page)
      const dialog = testUtil.getActiveDialog()
      const form = new FormTestUtil(page, dialog.locator('form'))

      const nameField = form.getTextFieldByLabel('Name')
      const icaoCodeField = form.getTextFieldByLabel('ICAO Code')
      const iataCodeField = form.getTextFieldByLabel('IATA Code')

      await nameField.fill('Test Airline')
      await icaoCodeField.fill('AAA')
      await iataCodeField.fill('AA')

      // Submit
      await form.submitAndExpectSuccessfulResponse('**/api/v1/airlines', {})
    })
  })

  // Test the negative case: missing permissions
  test.describe('Missing permissions', () => {
    test.describe('without AIRLINE_CREATE', () => {
      test.use({
        userPermissions: ['airline.read'],
      })

      test('cannot see create button', async ({ page, worker }) => {
        await worker.use(
          MockHandlerFactory.airline.getIndex([]),
        )

        await page.goto('/settings/airlines')

        // Assert the button does NOT exist
        await expect(page.getByRole('button', { name: 'Create' })).toHaveCount(0)
      })
    })
  })
})
```

## Testing Table Data

```typescript
import { test } from '@tests/fixture/base.fixture'
import { MockHandlerFactory } from '@tests/utils/mockHandler.factory'
import { TableTestUtil } from '@tests/utils/table.test.util'
import { AirlineIndexDtoBuilder } from '@/modules/airline/models/airline/index/airlineIndexDto.builder'

test.use({
  userPermissions: ['airline.read'],
})

test('displays airline table', async ({ page, worker }) => {
  const airline = new AirlineIndexDtoBuilder()
    .withName('Test Airline')
    .withIataCode('TA')
    .withIcaoCode('TAL')
    .build()

  await worker.use(
    MockHandlerFactory.airline.getIndex([airline]),
  )

  await page.goto('/settings/airlines')

  const tableTestUtil = new TableTestUtil(page.getByRole('table'))

  await tableTestUtil.expectHeaders(['Airline', 'ICAO Code', 'IATA Code'])
  await tableTestUtil.expectRowValues(0, ['Test Airline', 'TAL', 'TA'])
})
```

## Testing Permission Scenarios

A common pattern is testing both the "has permission" and "missing permission" cases:

```typescript
test.describe('Feature X', () => {
  // Test WITH permission
  test.describe('with permission', () => {
    test.use({ userPermissions: ['feature.read', 'feature.create'] })

    test('shows create button', async ({ page, worker }) => {
      // ...
      await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
    })
  })

  // Test WITHOUT permission
  test.describe('without create permission', () => {
    test.use({ userPermissions: ['feature.read'] })

    test('hides create button', async ({ page, worker }) => {
      // ...
      await expect(page.getByRole('button', { name: 'Create' })).toHaveCount(0)
    })
  })
})
```

## Testing Row Actions

```typescript
test('can delete via row action', async ({ page, worker }) => {
  const airline = new AirlineIndexDtoBuilder().build()

  await worker.use(
    MockHandlerFactory.airline.getIndex([airline]),
    MockHandlerFactory.airline.deleteAirline(),
  )

  await page.goto('/settings/airlines')

  const tableTestUtil = new TableTestUtil(page.getByRole('table'))

  // Click the "Options" button on row 0, then click "Delete" menu item
  await tableTestUtil.clickRowAction(0, 'Delete')
})
```

## Checklist for New Tests

- [ ] File is named `*.e2e.spec.ts` and lives in `src/modules/{module}/tests/`
- [ ] Imports `test` from `@tests/fixture/base.fixture` (not `@playwright/test`)
- [ ] Permissions are set with `test.use({ userPermissions: [...] })`
- [ ] All needed API handlers are set up with `worker.use(...)` before navigation
- [ ] Uses ARIA role selectors (`getByRole`, `getByLabel`) over CSS selectors
- [ ] Uses test utilities (`FormTestUtil`, `TableTestUtil`) for form/table interactions
- [ ] Tests both positive and negative (missing permission) scenarios where applicable
- [ ] No `test.only` left in the code (CI will reject it)

## Next Steps

- [Test Utilities](/e2e-testing/test-utilities) - Full reference for FormTestUtil, TableTestUtil, etc.
- [API Mocking](/e2e-testing/api-mocking) - How to create and use mock handlers
- [Test Data Builders](/e2e-testing/test-data-builders) - Creating test data with builders
