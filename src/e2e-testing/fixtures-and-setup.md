# Fixtures & Setup

#### [E2E Testing](/e2e-testing/)

## The Base Fixture

**File:** `tests/fixture/base.fixture.ts`

The base fixture extends Playwright's built-in `test` object with three custom fixtures:

```typescript
interface Extended {
  http: typeof http          // MSW http helper (for creating inline handlers)
  userPermissions: PermissionType[]   // Permissions for the test user
  worker: MockServiceWorker  // MSW worker for setting up API mocks
}
```

### Why Use the Custom `test`?

Importing `test` from `@tests/fixture/base.fixture` instead of `@playwright/test` gives you:

1. **Automatic authentication** - The storage state is loaded from `tests/.auth/user.json`
2. **Permission-based testing** - Set `userPermissions` to control what the user can do
3. **MSW worker** - Ready-to-use `worker` fixture for mocking API calls
4. **Console monitoring** - Automatically fails the test if console errors/warnings occur
5. **Accessibility checks** - Runs axe-core after every test
6. **Coverage collection** - Collects Istanbul coverage data if enabled
7. **WebSocket mocking** - WebSocket connections are mocked automatically

### Fixture Lifecycle

For each test, the fixtures run in this order:

```
1. context fixture
   - Sets up Istanbul coverage on the browser context

2. page fixture
   - Sets up console monitoring (captures errors/warnings)
   - Injects test permissions into permissionContext (for MSW handlers)
   - Injects permissions into browser context via addInitScript
   - Sets up WebSocket mock
   - >>> YOUR TEST RUNS HERE <<<
   - Runs accessibility check (axe-core)
   - Clears permissions
   - Validates console (fails if errors/warnings found)

3. context fixture cleanup
   - Collects coverage data
```

## Authentication Setup

**File:** `tests/auth.setup.ts`

This file runs **once** before all e2e tests as the "setup" project. It:

1. Mocks the OAuth/OIDC authorize endpoint to redirect back with a code
2. Navigates to `/auth/login`
3. Fills the tenant code (`JFK001`) using a `PinInputField`
4. Fills the email (`developer@wisemen.digital`)
5. Presses Enter to submit, triggering the OAuth token exchange
6. Waits for the `/api/v1/users/me` endpoint to respond
7. Saves the browser state (cookies, localStorage) to `tests/.auth/user.json`

```typescript
test('authenticate', async ({ page }) => {
  // Mock the OIDC authorize redirect
  await page.route('https://test-oidc.example.com/oauth/v2/authorize**', async (route) => {
    const url = new URL(route.request().url())
    const state = url.searchParams.get('state')
    await route.fulfill({
      body: '',
      headers: {
        location: `http://localhost:4000/auth/callback?code=${UuidUtil.getRandom()}&state=${state}`,
      },
      status: 302,
    })
  })

  await page.goto('/auth/login')

  // Fill tenant code
  const form = new FormTestUtil(page)
  const tenantCodeField = form.getPinInputFieldByLabel('Tenant code')
  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/v1/find-tenant-by-slug')),
    tenantCodeField.fill('JFK001'),
  ])

  // Fill email and submit
  const emailField = form.getTextFieldByLabel('Email')
  await emailField.fill('developer@wisemen.digital')
  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/oauth/v2/token')),
    page.keyboard.press('Enter'),
  ])

  // Wait for user data
  await page.waitForResponse(
    (res) => res.url().includes('/api/v1/users/me'),
    { timeout: 30000 },
  )

  // Save state for reuse
  await page.context().storageState({ path: authFile })
})
```

### How Auth State Is Reused

The Playwright config connects the setup to the chromium project:

```typescript
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  {
    name: 'chromium',
    dependencies: ['setup'],                         // Waits for setup to finish
    use: { storageState: 'tests/.auth/user.json' },  // Loads saved auth state
  },
]
```

Every e2e test starts with the user already authenticated. You never need to log in manually in your tests.

## The Permission System

Permissions flow through three layers:

### 1. Test Declaration

```typescript
test.use({
  userPermissions: ['airline.read', 'airline.create'],
})
```

### 2. Permission Context (Node.js side)

The base fixture stores permissions in a global `PermissionContext` class:

```typescript
// tests/utils/permissionContext.test.util.ts
class PermissionContext {
  private permissions: PermissionType[] = []
  setPermissions(permissions: PermissionType[]): void { ... }
  getPermissions(): PermissionType[] { ... }
  clearPermissions(): void { ... }
}
export const permissionContext = new PermissionContext()
```

This is read by the MSW auth handler to build the `/api/v1/users/me` response.

### 3. Auth Mock Handler (MSW)

```typescript
// src/mocks/handlers/auth.mock.ts
export function getCurrentUser(): ViewMeResponse {
  const permissions = permissionContext.getPermissions() as Permission[]
  const userDetail = new UserDetailDtoBuilder()
    .withPermissions(permissions)
    .build()
  return { ...userDetail, organisation: TEST_AUTH_USER_ORGANISATION, permissions }
}

// This handler is always active:
http.get('*/api/v1/users/me', () => {
  return HttpResponse.json(getCurrentUser())
})
```

### 4. Browser Context Injection

Permissions are also injected into the browser for client-side permission checks:

```typescript
await page.addInitScript((permissions) => {
  (window as any).__TEST_PERMISSIONS__ = permissions
}, userPermissions)
```

### Permission Flow Diagram

```
test.use({ userPermissions: ['x.read'] })
        |
        v
  base.fixture.ts
  sets permissionContext.setPermissions(userPermissions)
  injects into browser via addInitScript
        |
        v
  When page loads, app calls GET /api/v1/users/me
        |
        v
  auth.mock.ts handler reads permissionContext.getPermissions()
  returns user object with those permissions
        |
        v
  App renders UI based on user's permissions
        |
        v
  Test can assert permission-gated elements
```

## Default Permissions

If you don't call `test.use({ userPermissions: [...] })`, the default is an **empty array** `[]`. The user will have no permissions at all. This is intentional and useful for testing that unauthorized users can't access features.

## Next Steps

- [API Mocking](/e2e-testing/api-mocking) - How MSW handlers work with the fixture
- [Writing Tests](/e2e-testing/writing-tests) - Using permissions in real tests
- [Common Pitfalls](/e2e-testing/common-pitfalls) - Permission-related gotchas
