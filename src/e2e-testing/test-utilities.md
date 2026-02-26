# Test Utilities

#### [E2E Testing](/e2e-testing/)

## Overview

The project provides several utility classes for common UI interactions. Using these instead of raw Playwright calls makes tests more readable and maintainable.

All utilities are in `tests/utils/`.

## FormTestUtil

**File:** `tests/utils/form.test.util.ts`

Abstracts interaction with form fields. Each field type has its own class with `fill()` and `getValue()` methods.

### Creating an Instance

```typescript
import { FormTestUtil } from '@tests/utils/form.test.util'

// Form on the page (auto-selects the first <form> element)
const form = new FormTestUtil(page)

// Form scoped to a specific locator (e.g., inside a dialog)
const dialog = testUtil.getActiveDialog()
const form = new FormTestUtil(page, dialog.locator('form'))
```

### Field Types

#### TextField

For standard text inputs (`<input type="text">`, `<textarea>`, etc.):

```typescript
const nameField = form.getTextFieldByLabel('Name')
await nameField.fill('Test Value')

const value = await nameField.getValue()  // Returns the input value
```

#### DateField

For date pickers. Uses keyboard navigation to fill date parts:

```typescript
const dateField = form.getDateFieldByLabel('Start Date')

// Fill with a specific date (month/day/year order for keyboard input)
await dateField.fill({ month: '01', day: '15', year: '2025' })

// Fill with "today" (uses ArrowUp to increment)
await dateField.fill()  // undefined triggers ArrowUp navigation

const value = await dateField.getValue()
// Returns: { day: '15', month: '01', year: '2025' }
```

#### TimeField

For time inputs:

```typescript
const timeField = form.getTimeFieldByLabel('Start Time')
await timeField.fill({ hour: '14', minute: '30' })

const value = await timeField.getValue()
// Returns: { hour: '14', minute: '30' }
```

#### PinInputField

For PIN/code inputs (like the tenant code on the login page):

```typescript
const pinField = form.getPinInputFieldByLabel('Tenant code')
await pinField.fill('JFK001')
```

#### SelectField

For dropdown selects:

```typescript
const typeField = form.getSelectFieldByLabel('Type')
await typeField.fill('Admin')  // Clicks the dropdown, then clicks the "Admin" option

const value = await typeField.getValue()  // Returns the display text
```

#### AutocompleteField

For searchable dropdown fields (behaves like SelectField):

```typescript
const orgField = form.getAutocompleteFieldByLabel('Organisation')
await orgField.fill('Wisemen')  // Clicks field, then clicks matching option
```

#### CheckboxField

For checkboxes:

```typescript
const activeField = form.getCheckboxFieldByLabel('Active')
await activeField.fill(true)   // Checks the checkbox
await activeField.fill(false)  // Unchecks the checkbox

const isChecked = await activeField.getValue()  // Returns boolean
```

### Common Field Methods

All field types share these methods:

| Method | Description |
|--------|-------------|
| `fill(value)` | Set the field value |
| `getValue()` | Get the current field value |
| `expectToBeDisabled()` | Assert the field is disabled |
| `expectToBeEnabled()` | Assert the field is enabled |

### Submitting Forms

```typescript
await form.submit()
```

This finds the submit button using the form's `id` attribute. It looks for an element with `[form="formId"]` attribute and clicks it.

```typescript
await form.submitAndExpectSuccessfulResponse('**/api/v1/airlines', {})
```

Currently this just calls `submit()` (the response checking is commented out), but it's the intended way to submit and verify the API call was made.

## TableTestUtil

**File:** `tests/utils/table.test.util.ts`

Abstracts interaction with HTML tables.

### Creating an Instance

```typescript
import { TableTestUtil } from '@tests/utils/table.test.util'

const tableTestUtil = new TableTestUtil(page.getByRole('table'))
```

### Methods

#### `expectHeaders(headers: string[])`

Assert the table has the expected column headers:

```typescript
await tableTestUtil.expectHeaders(['Airline', 'ICAO Code', 'IATA Code'])
```

#### `expectRowValues(rowIndex, values)`

Assert a row contains the expected cell values. The `rowIndex` is 0-based (header row is automatically skipped):

```typescript
await tableTestUtil.expectRowValues(0, ['Test Airline', 'TAL', 'TA'])

// Use null or undefined for cells that should show a dash '-'
await tableTestUtil.expectRowValues(1, ['Another Airline', null, 'AB'])

// Use RegExp for partial matching
await tableTestUtil.expectRowValues(0, [/Test/, 'TAL', 'TA'])
```

#### `getRowByIndex(rowIndex)`

Get a row locator by 0-based index (skips header):

```typescript
const firstRow = tableTestUtil.getRowByIndex(0)
await firstRow.click()
```

#### `clickRowAction(rowIndex, actionName)`

Click a row action from the options menu. This:
1. Finds the "Options" button on the row
2. Clicks it to open the dropdown menu
3. Clicks the menu item with the given name

```typescript
await tableTestUtil.clickRowAction(0, 'Delete')
await tableTestUtil.clickRowAction(1, 'Edit')
```

#### `expectRowActionToBeHidden(rowIndex, actionName)`

Assert that a row action is not visible (either the Options button is hidden, or the specific action is missing):

```typescript
await tableTestUtil.expectRowActionToBeHidden(0, 'Delete')
```

## TestUtil

**File:** `tests/utils/test.util.ts`

General-purpose helpers for common page interactions.

### Creating an Instance

```typescript
import { TestUtil } from '@tests/utils/test.util'

const testUtil = new TestUtil(page)
```

### Methods

#### `getActiveDialog()`

Returns a locator for the currently active dialog:

```typescript
const dialog = testUtil.getActiveDialog()

// Then scope form interactions to the dialog
const form = new FormTestUtil(page, dialog.locator('form'))
```

#### `expectNoActiveDialog()`

Assert no dialog is currently open:

```typescript
await testUtil.expectNoActiveDialog()
```

## MapTestUtil

**File:** `tests/utils/map.test.util.ts`

Abstracts interaction with map canvas elements (Google Maps).

### Creating an Instance

```typescript
import { MapTestUtil } from '@tests/utils/map.test.util'

const mapTestUtil = new MapTestUtil(page.locator('canvas'))
```

### Methods

#### `drawPolygon()`

Clicks five points on the map canvas to draw a rectangle polygon:

```typescript
await mapTestUtil.drawPolygon()
```

The coordinates are:
1. (100, 100) - top-left
2. (200, 100) - top-right
3. (200, 200) - bottom-right
4. (100, 200) - bottom-left
5. (100, 100) - close the polygon

## PaginationTestUtil

**File:** `tests/utils/pagination.test.util.ts`

Static utility for wrapping data arrays in pagination response formats. Used inside handler classes.

See [API Mocking - Pagination Utilities](/e2e-testing/api-mocking#pagination-utilities) for details.

## Import Convenience

All core utilities are re-exported from `tests/utils/index.ts`:

```typescript
export { runAccessibilityCheck } from './a11y.util'
export { setupConsoleMonitoring } from './console.util'
export { setupContextWithCoverage } from './coverage.util'
export { permissionContext } from './permissionContext.test.util'
export { setupWebSocketMock } from './websocket.util'
```

These are used internally by the base fixture. You typically don't need to import them directly in your tests.

## Next Steps

- [Writing Tests](/e2e-testing/writing-tests) - See utilities in action in real tests
- [Test Data Builders](/e2e-testing/test-data-builders) - Creating data for mock handlers
- [Common Pitfalls](/e2e-testing/common-pitfalls) - Utility-related gotchas
