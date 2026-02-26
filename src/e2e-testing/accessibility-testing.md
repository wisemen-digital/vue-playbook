# Accessibility Testing

#### [E2E Testing](/e2e-testing/)

## Overview

Every e2e test automatically runs an accessibility check after the test actions complete. This is powered by **axe-core** via the `@axe-core/playwright` integration.

You do **not** need to manually add accessibility checks to your tests. The base fixture handles it.

## How It Works

After each test, the `page` fixture in `base.fixture.ts` runs:

```typescript
await runAccessibilityCheck(page, testInfo)
```

This function (in `tests/utils/a11y.util.ts`):

1. Runs an axe-core scan on the current page state
2. Checks for violations against WCAG standards
3. **Fails the test** if WCAG 2.1 AA violations are found
4. Warns (but does not fail) for other WCAG violations
5. Attaches the full scan results to the test report

## WCAG Standards Checked

The scan checks these standard tags:

| Tag | Standard | Behavior |
|-----|----------|----------|
| `wcag2a` | WCAG 2.0 Level A | Warn only |
| `wcag2aa` | WCAG 2.0 Level AA | Warn only |
| `wcag21a` | WCAG 2.1 Level A | Warn only |
| `wcag21aa` | WCAG 2.1 Level AA | **Fails the test** |

### Why WCAG 2.1 AA Fails

WCAG 2.1 AA is the enforced standard. Violations at this level will cause the test to fail:

```typescript
const wcag21aaViolations = accessibilityScanResults.violations
  .filter((v) => v.tags.includes('wcag21aa'))
expect(wcag21aaViolations).toEqual([])  // Test fails if not empty
```

Other violations are tracked but don't block the test.

## Reading Accessibility Results

Accessibility scan results are automatically attached to the test report:

```typescript
await testInfo.attach('accessibility-scan-results', {
  body: JSON.stringify(accessibilityScanResults, null, 2),
  contentType: 'application/json',
})
```

To view them:

1. Run tests: `pnpm test:e2e`
2. Open the HTML report: `npx playwright show-report`
3. Click on a test
4. Look for the "accessibility-scan-results" attachment

The attachment contains the full axe-core report with:
- **violations**: Rules that failed
- **passes**: Rules that passed
- **incomplete**: Rules that could not be fully evaluated
- **inapplicable**: Rules that don't apply to the page

## Handling Edge Cases

### Page Navigation

If the page navigates away during test cleanup (destroying the execution context), the accessibility check is skipped gracefully:

```typescript
if (page.isClosed()) {
  return  // Skip if page is already closed
}

// ...
.catch((error) => {
  if (error.message.includes('Execution context was destroyed')) {
    console.warn('Skipping accessibility check due to navigation context being destroyed')
    return { violations: [] }
  }
  throw error
})
```

### When Tests Navigate Away

If your test ends with a navigation (e.g., form submission redirects), the accessibility check runs on whatever page state exists at the end. Make sure the final page state is meaningful.

## Common Accessibility Violations

| Violation | Issue | Fix |
|-----------|-------|-----|
| `button-name` | Button without accessible name | Add `aria-label` or text content |
| `image-alt` | Image without alt text | Add `alt` attribute |
| `label` | Form input without label | Add `<label>` or `aria-label` |
| `color-contrast` | Insufficient color contrast | Increase contrast ratio |
| `link-name` | Link without accessible name | Add text content or `aria-label` |

## Disabling for a Specific Test

If you absolutely need to skip the accessibility check for a test (not recommended), you would need to close the page before the fixture cleanup runs. However, this is **strongly discouraged**. Instead, fix the accessibility issue.

## Next Steps

- [Best Practices](/e2e-testing/best-practices) - Writing accessible selectors
- [Common Pitfalls](/e2e-testing/common-pitfalls) - Accessibility-related test failures
