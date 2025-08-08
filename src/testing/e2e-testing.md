#### [Testing](/testing.md)


# E2e Testing Guidelines and Rules

## Overview

This document outlines the testing setup, patterns, and best practices for writing end-to-end tests using Playwright with MSW (Mock Service Worker) for API mocking.

## Testing Philosophy

### AAA Pattern (Arrange-Act-Assert)
All tests must follow the AAA pattern:

1. **Arrange**: Set up test data, mocks, and initial state
2. **Act**: Perform the user actions being tested
3. **Assert**: Verify the expected outcomes

### Test Isolation
- Each test should be completely independent
- Tests should not share state between them
- All required mocks should be explicitly defined in each test

### User-Centric Testing
- Tests should follow realistic user journeys
- Start from natural entry points (overview pages, dashboards)
- Test complete workflows rather than isolated actions

## Project Structure

```
├── tests/
│   ├── base.fixture.ts          # Base test setup with fixtures
│   ├── auth.setup.ts            # Authentication setup for global state
│   └── features/
│       ├── contacts/
│       ├── users/
│       └── ...
├── src/
│   ├── mocks/
│   │   ├── handlers/            # MSW handlers organized by domain
│   │   │   ├── index.ts         # Central handler exports
│   │   │   ├── auth.mock.ts
│   │   │   ├── contact.mock.ts
│   │   │   └── ...
│   │   └── browser.mock.ts      # Browser MSW setup
│   ├── models/                  # DTO builders for test data
│   └── utils/
│       └── apiMocker.util.ts    # API mocking utilities
```

## Core Components

### 1. Base Fixture (`base.fixture.ts`)

```typescript
const test = base.extend<{
  http: typeof http
  testUtil: TestingUtil
  worker: MockServiceWorker
}>({
  // Contains browser setup, accessibility checks, console monitoring
  worker: createWorkerFixture([], { waitForPageLoad: true }),
})
```

### 2. API Mocker (`apiMocker.util.ts`)

```typescript
const apiMocker = createApiMocker(worker)

// Apply predefined handler groups
apiMocker.useHandlers(authHandlers, contactHandlers)

// Override specific endpoints
await apiMocker.get('*/api/v1/contacts', customData)
await apiMocker.post('*/api/v1/contacts', responseData)
```

### 3. DTO Builders

```typescript
const CONTACT = new ContactDetailDtoBuilder()
  .withFirstName('John')
  .withLastName('Doe')
  .withEmail('john@example.com')
  .build()
```

## Test Writing Rules

### 1. Test Structure

```typescript
test('should [action] when [condition]', async ({ testUtil, worker }) => {
  // Arrange - Set up test data and mocks
  const CONTACT = new ContactDetailDtoBuilder()
    .withName('Test Contact')
    .build()

  const apiMocker = createApiMocker(worker)
  apiMocker.useHandlers(essentialHandlers)
  await apiMocker.get('*/api/v1/contacts', [CONTACT])

  // Act - Perform user actions
  await testUtil.navigateTo('/contacts')
  await testUtil.clickByRoleAndName('link', 'Test Contact')

  // Assert - Verify outcomes
  await testUtil.expectUrlToBe(`/contacts/${CONTACT.uuid}`)
  await testUtil.expectTextToBeVisible(CONTACT.firstName)
})
```

### 2. Data Setup Rules

#### Use Builders for Test Data
- ✅ **DO**: Use DTO builders to create consistent test data
- ❌ **DON'T**: Create raw objects manually

```typescript
// ✅ Good
const contact = new ContactDetailDtoBuilder()
  .withFirstName('John')
  .build()

// ❌ Bad
const contact = {
  uuid: 'some-uuid',
  firstName: 'John',
  // Missing required fields, inconsistent structure
}
```

#### Consistent Data Across Related Objects
- Ensure overview and detail objects share the same UUID
- Use consistent data between index and detail DTOs

```typescript
const CONTACT_INDEX = new ContactIndexDtoBuilder()
  .withName('John Doe')
  .build()

const CONTACT_DETAIL = new ContactDetailDtoBuilder()
  .withUuid(CONTACT_INDEX.uuid) // Same UUID
  .withFirstName('John')
  .withLastName('Doe')
  .build()
```

### 3. Mock Setup Rules

#### Use Handler Groups
- ✅ **DO**: Use predefined handler groups for common scenarios
- ❌ **DON'T**: Define all mocks individually in each test

```typescript
// ✅ Good
apiMocker.useHandlers(authHandlers, contactHandlers)

// ❌ Bad
await apiMocker.get('*/api/v1/users/me', userData)
await apiMocker.get('*/api/v1/me/ui-preferences', prefsData)
await apiMocker.get('*/api/v1/me/notifications/unread-count', countData)
// ... many individual mocks
```

#### Override When Needed
- Use handler groups for defaults
- Override specific endpoints for test-specific data

```typescript
apiMocker.useHandlers(contactHandlers) // Default handlers
await apiMocker.get('*/api/v1/contacts', customContactList) // Test-specific override
```

#### Essential Handlers
Always include essential handlers for authenticated pages:
- `authHandlers` - Authentication and user data
- `notificationHandlers` - Notifications
- `preferencesHandlers` - User preferences

### 4. Navigation and User Actions

#### Use Semantic Actions
```typescript
// ✅ Good - Semantic and clear
await testUtil.clickByRoleAndName('link', 'Contact Name')
await testUtil.fillInputByRole('textbox', 'Email', 'test@example.com')

// ❌ Bad - Implementation details
await page.click('[data-testid="contact-link-123"]')
await page.fill('#email-input', 'test@example.com')
```

#### Start from Natural Entry Points
```typescript
// ✅ Good - Natural user flow
await testUtil.navigateTo('/contacts') // Start from overview
await testUtil.clickByRoleAndName('link', 'Create Contact')

// ❌ Bad - Direct navigation to deep pages
await testUtil.navigateTo('/contacts/create') // Skips natural flow
```

### 5. URL Patterns and Endpoints

#### Use Flexible URL Patterns
- Use `**/api/v1/endpoint` to catch different base URLs
- This handles both localhost and external auth servers

```typescript
// ✅ Good - Catches all domains
await apiMocker.post('**/oauth/v2/token', tokenData)

// ❌ Bad - Only catches specific domain
await apiMocker.post('*/oauth/v2/token', tokenData)
```

#### Match API Documentation
- Ensure mock endpoints exactly match the API documentation
- Check the Swagger docs for correct paths and schemas

### 6. Test Naming Conventions

#### Descriptive Test Names
```typescript
// ✅ Good - Clear intent and conditions
test('should navigate to contact detail and display information when clicking on overview entry', async () => {})

// ❌ Bad - Vague or implementation-focused
test('contact test', async () => {})
test('should call GET /api/v1/contacts', async () => {})
```

#### Group Related Tests
```typescript
test.describe('Contact Management', () => {
  test('should display contact list with filters', async () => {})
  test('should create new contact from overview page', async () => {})
  test('should navigate to detail and edit contact', async () => {})
})
```

## Common Patterns

### 1. Overview → Detail → Action Pattern

```typescript
test('should complete workflow from overview to action', async ({ testUtil, worker }) => {
  // Arrange
  const ITEM = new ItemBuilder().build()
  const apiMocker = createApiMocker(worker)
  apiMocker.useHandlers(essentialHandlers)
  await apiMocker.get('*/api/v1/items', [ITEM])
  await apiMocker.get(`*/api/v1/items/${ITEM.uuid}`, ITEM)

  // Act & Assert - Overview to detail
  await testUtil.navigateTo('/items')
  await testUtil.clickByRoleAndName('link', ITEM.name)
  await testUtil.expectUrlToBe(`/items/${ITEM.uuid}`)

  // Act & Assert - Detail verification
  await testUtil.expectTextToBeVisible(ITEM.name)
  await testUtil.expectTextToBeVisible(ITEM.description)

  // Act & Assert - Action (edit, delete, etc.)
  await testUtil.clickByRoleAndName('link', 'Edit')
  await testUtil.expectUrlToBe(`/items/${ITEM.uuid}/edit`)
})
```

### 2. Form Creation Pattern

```typescript
test('should create new item through complete form flow', async ({ testUtil, worker }) => {
  // Arrange
  const NEW_ITEM = new ItemBuilder()
    .withName('New Item')
    .withDescription('Test Description')
    .build()

  const apiMocker = createApiMocker(worker)
  apiMocker.useHandlers(essentialHandlers)
  await apiMocker.get('*/api/v1/items', []) // Empty list
  await apiMocker.post('*/api/v1/items', NEW_ITEM)

  // Act & Assert - Navigate to create
  await testUtil.navigateTo('/items')
  await testUtil.clickByRoleAndName('link', 'Create Item')
  await testUtil.expectUrlToBe('/items/create')

  // Act - Fill form
  await testUtil.fillInputByRole('textbox', 'Name', NEW_ITEM.name)
  await testUtil.fillInputByRole('textbox', 'Description', NEW_ITEM.description)

  // Act & Assert - Submit
  await testUtil.clickButtonByText('Create')
  await testUtil.expectUrlToBe('/items/create') // or wherever it redirects
})
```

## Troubleshooting

### Common Issues

#### 1. Handler Not Matching
- Check URL patterns use `**` for flexible matching
- Verify endpoint paths match API documentation exactly
- Use browser dev tools to see actual request URLs

#### 2. Schema Validation Errors
- Ensure DTO builders return correct schema
- Check API documentation for required fields
- Verify mock responses match expected types

#### 3. Authentication Issues
- Always include `authHandlers` for authenticated pages
- Use filtered auth handlers for setup tests to avoid conflicts
- Handle OAuth redirects with page routes, not MSW

#### 4. Timing Issues
- Use `waitForLoadState('networkidle')` for complex pages
- Wait for specific elements before interacting
- Allow sufficient timeouts for slow operations

### Debugging Tips

```typescript
// Add logging for development
page.on('console', msg => console.log('Browser:', msg.text()))
page.on('request', request => console.log('Request:', request.url()))
page.on('response', response => console.log('Response:', response.status(), response.url()))
```

## Feature Test Organization

### Test Structure Per Feature

Each feature must have exactly **5 test files** with **1 test each**:

```
tests/features/contacts/
├── overview.test.ts     # List/search/filter functionality
├── detail.test.ts       # View and navigate from overview → detail  
├── create.test.ts       # Navigate from overview → create → success
├── update.test.ts       # Navigate from overview → detail → edit → save
└── delete.test.ts       # Navigate from overview → detail → delete → confirm
```

### Mandatory Test Flows

#### 1. Overview Test (`overview.test.ts`)
**Purpose**: Test the main listing page functionality
```typescript
test('should display and interact with [feature] overview', async ({ testUtil, worker }) => {
  // Test: list display, search, filters, pagination, sorting
  // Entry: Navigate directly to /[feature]
  // Focus: Data display, filtering, search functionality
})
```

#### 2. Detail Test (`detail.test.ts`)
**Purpose**: Test navigation from overview to detail view
```typescript
test('should navigate to [feature] detail and display information', async ({ testUtil, worker }) => {
  // Test: overview → click item → view detail → verify data display
  // Entry: Start from /[feature] overview
  // Focus: Navigation + data display + related actions viewing
})
```

#### 3. Create Test (`create.test.ts`)
**Purpose**: Test the creation flow
```typescript
test('should create new [feature] through complete flow', async ({ testUtil, worker }) => {
  // Test: overview → create button → form fill → submit → success
  // Entry: Start from /[feature] overview
  // Focus: Form handling, validation, submission, success feedback
})
```

#### 4. Update Test (`update.test.ts`)
**Purpose**: Test the update/edit flow
```typescript
test('should update [feature] through complete flow', async ({ testUtil, worker }) => {
  // Test: overview → detail → edit → modify form → save → success
  // Entry: Start from /[feature] overview
  // Focus: Edit form, data population, updates, success feedback
})
```

#### 5. Delete Test (`delete.test.ts`)
**Purpose**: Test the deletion flow
```typescript
test('should delete [feature] through complete flow', async ({ testUtil, worker }) => {
  // Test: overview → detail → delete → confirm → success
  // Entry: Start from /[feature] overview
  // Focus: Delete confirmation, success feedback, list update
})
```

### Feature Test Rules

#### One Test Per File Rule
- ✅ **DO**: Each test file contains exactly ONE test
- ❌ **DON'T**: Multiple tests in one file or multiple files for one flow

#### Complete Flow Rule
- ✅ **DO**: Test the complete user journey for that flow
- ❌ **DON'T**: Test partial flows or isolated components

#### Natural Entry Point Rule
- ✅ **DO**: Always start from the feature overview page (except overview test)
- ❌ **DON'T**: Navigate directly to deep pages unless testing overview itself

#### Feature Coverage Rule
Every feature MUST have all 5 test files, even if some flows don't exist:
```typescript
// If feature doesn't support deletion
test('should show delete is not available for [feature]', async ({ testUtil, worker }) => {
  // Test that delete option is properly hidden/disabled
})
```

## Best Practices

### Do's ✅

1. **Use complete user journeys** - Test flows, not individual functions
2. **Start from natural entry points** - Begin where users would begin
3. **Use semantic selectors** - Roles and accessible names over test IDs
4. **Mock at the API boundary** - Use MSW for HTTP requests
5. **Use builders for data** - Consistent, complete test objects
6. **Follow AAA pattern** - Clear structure in every test
7. **Include essential handlers** - Auth, notifications, preferences
8. **Write descriptive test names** - Clear intent and conditions
9. **One test per file** - Each file tests exactly one flow
10. **Cover all 5 flows** - Overview, detail, create, update, delete

### Don'ts ❌

1. **Don't test implementation details** - Focus on user-visible behavior
2. **Don't create incomplete mocks** - Always use proper schemas
3. **Don't skip authentication** - Include auth handlers for protected pages
4. **Don't use brittle selectors** - Avoid CSS selectors and test IDs when possible
5. **Don't create shared test state** - Each test should be independent
6. **Don't mock internal functions** - Mock external dependencies only
7. **Don't write tests that duplicate others** - Each file has one unique purpose
8. **Don't ignore API documentation** - Match actual endpoint specifications
9. **Don't put multiple tests in one file** - One test per file, one file per flow
10. **Don't skip flows** - Every feature needs all 5 test files

## Example Test Templates

### 1. Overview Test Template (`overview.test.ts`)

```typescript
import { essentialHandlers } from '@/mocks/handlers'
import { EntityBuilder } from '@/models/entity/entityBuilder'
import { PaginationUtil } from '@/utils/pagination.util.ts'
import { test } from '@@/base.fixture'
import { createApiMocker } from '@@/utils/apiMocker.util.ts'

test('should display and filter entity overview', async ({ testUtil, worker }) => {
  // Arrange - Set up test data
  const ENTITIES = [
    new EntityBuilder().withName('Entity 1').build(),
    new EntityBuilder().withName('Entity 2').build(),
    new EntityBuilder().withName('Filtered Entity').build(),
  ]
  const entitiesResponse = PaginationUtil.getJson(ENTITIES)

  // Arrange - Set up mocks
  const apiMocker = createApiMocker(worker)
  apiMocker.useHandlers(essentialHandlers)
  await apiMocker.get('*/api/v1/entities', entitiesResponse)

  // Act & Assert - Display list
  await testUtil.navigateTo('/entities')
  await testUtil.expectTextToBeVisible('Entity 1')
  await testUtil.expectTextToBeVisible('Entity 2')

  // Act & Assert - Test search/filter (if applicable)
  await testUtil.fillInputByRole('searchbox', 'Search', 'Filtered')
  await testUtil.expectTextToBeVisible('Filtered Entity')
  await testUtil.expectTextNotToBeVisible('Entity 1')
})
```

### 2. Detail Test Template (`detail.test.ts`)

```typescript
import { essentialHandlers } from '@/mocks/handlers'
import { EntityBuilder, EntityIndexBuilder } from '@/models/entity/'
import { PaginationUtil } from '@/utils/pagination.util.ts'
import { test } from '@@/base.fixture'
import { createApiMocker } from '@@/utils/apiMocker.util.ts'

test('should navigate to entity detail and display information', async ({ testUtil, worker }) => {
  // Arrange - Set up test data
  const ENTITY_INDEX = new EntityIndexBuilder().withName('Test Entity').build()
  const ENTITY_DETAIL = new EntityBuilder()
    .withUuid(ENTITY_INDEX.uuid)
    .withName('Test Entity')
    .withDescription('Detailed description')
    .build()

  const entitiesResponse = PaginationUtil.getJson([ENTITY_INDEX])

  // Arrange - Set up mocks
  const apiMocker = createApiMocker(worker)
  apiMocker.useHandlers(essentialHandlers)
  await apiMocker.get('*/api/v1/entities', entitiesResponse)
  await apiMocker.get(`*/api/v1/entities/${ENTITY_DETAIL.uuid}`, ENTITY_DETAIL)

  // Act & Assert - Navigate from overview to detail
  await testUtil.navigateTo('/entities')
  await testUtil.clickByRoleAndName('link', 'Test Entity')
  await testUtil.expectUrlToBe(`/entities/${ENTITY_DETAIL.uuid}`)

  // Assert - Verify detail information
  await testUtil.expectTextToBeVisible(ENTITY_DETAIL.name)
  await testUtil.expectTextToBeVisible(ENTITY_DETAIL.description)
})
```

### 3. Create Test Template (`create.test.ts`)

```typescript
import { essentialHandlers } from '@/mocks/handlers'
import { EntityBuilder } from '@/models/entity/entityBuilder'
import { PaginationUtil } from '@/utils/pagination.util.ts'
import { test } from '@@/base.fixture'
import { createApiMocker } from '@@/utils/apiMocker.util.ts'

test('should create new entity through complete flow', async ({ testUtil, worker }) => {
  // Arrange - Set up test data
  const NEW_ENTITY = new EntityBuilder()
    .withName('New Entity')
    .withDescription('Test Description')
    .build()

  const emptyResponse = PaginationUtil.getJson([])

  // Arrange - Set up mocks
  const apiMocker = createApiMocker(worker)
  apiMocker.useHandlers(essentialHandlers)
  await apiMocker.get('*/api/v1/entities', emptyResponse)
  await apiMocker.post('*/api/v1/entities', NEW_ENTITY)

  // Act & Assert - Navigate to create from overview
  await testUtil.navigateTo('/entities')
  await testUtil.clickByRoleAndName('link', 'Create Entity')
  await testUtil.expectUrlToBe('/entities/create')

  // Act - Fill creation form
  await testUtil.fillInputByRole('textbox', 'Name', NEW_ENTITY.name)
  await testUtil.fillInputByRole('textbox', 'Description', NEW_ENTITY.description)

  // Act & Assert - Submit and verify success
  await testUtil.clickButtonByText('Create')
  await testUtil.expectUrlToBe('/entities') // or wherever it redirects
  // await testUtil.expectTextToBeVisible('Entity created successfully')
})
```

### 4. Update Test Template (`update.test.ts`)

```typescript
import { essentialHandlers } from '@/mocks/handlers'
import { EntityBuilder, EntityIndexBuilder } from '@/models/entity/'
import { PaginationUtil } from '@/utils/pagination.util.ts'
import { test } from '@@/base.fixture'
import { createApiMocker } from '@@/utils/apiMocker.util.ts'

test('should update entity through complete flow', async ({ testUtil, worker }) => {
  // Arrange - Set up test data
  const ENTITY_INDEX = new EntityIndexBuilder().withName('Original Entity').build()
  const ENTITY_DETAIL = new EntityBuilder()
    .withUuid(ENTITY_INDEX.uuid)
    .withName('Original Entity')
    .withDescription('Original description')
    .build()

  const UPDATED_ENTITY = new EntityBuilder()
    .withUuid(ENTITY_DETAIL.uuid)
    .withName('Updated Entity')
    .withDescription('Updated description')
    .build()

  const entitiesResponse = PaginationUtil.getJson([ENTITY_INDEX])

  // Arrange - Set up mocks
  const apiMocker = createApiMocker(worker)
  apiMocker.useHandlers(essentialHandlers)
  await apiMocker.get('*/api/v1/entities', entitiesResponse)
  await apiMocker.get(`*/api/v1/entities/${ENTITY_DETAIL.uuid}`, ENTITY_DETAIL)
  await apiMocker.put(`*/api/v1/entities/${ENTITY_DETAIL.uuid}`, UPDATED_ENTITY)

  // Act & Assert - Navigate from overview to detail to edit
  await testUtil.navigateTo('/entities')
  await testUtil.clickByRoleAndName('link', 'Original Entity')
  await testUtil.expectUrlToBe(`/entities/${ENTITY_DETAIL.uuid}`)
  
  await testUtil.clickByRoleAndName('link', 'Edit')
  await testUtil.expectUrlToBe(`/entities/${ENTITY_DETAIL.uuid}/edit`)

  // Act - Update form fields
  await testUtil.fillInputByRole('textbox', 'Name', UPDATED_ENTITY.name)
  await testUtil.fillInputByRole('textbox', 'Description', UPDATED_ENTITY.description)

  // Act & Assert - Save and verify success
  await testUtil.clickButtonByText('Save')
  await testUtil.expectUrlToBe(`/entities/${ENTITY_DETAIL.uuid}`) // back to detail
  // await testUtil.expectTextToBeVisible('Entity updated successfully')
})
```

### 5. Delete Test Template (`delete.test.ts`)

```typescript
import { essentialHandlers } from '@/mocks/handlers'
import { EntityBuilder, EntityIndexBuilder } from '@/models/entity/'
import { PaginationUtil } from '@/utils/pagination.util.ts'
import { test } from '@@/base.fixture'
import { createApiMocker } from '@@/utils/apiMocker.util.ts'

test('should delete entity through complete flow', async ({ testUtil, worker }) => {
  // Arrange - Set up test data
  const ENTITY_INDEX = new EntityIndexBuilder().withName('Entity to Delete').build()
  const ENTITY_DETAIL = new EntityBuilder()
    .withUuid(ENTITY_INDEX.uuid)
    .withName('Entity to Delete')
    .build()

  const entitiesResponse = PaginationUtil.getJson([ENTITY_INDEX])
  const emptyResponse = PaginationUtil.getJson([])

  // Arrange - Set up mocks
  const apiMocker = createApiMocker(worker)
  apiMocker.useHandlers(essentialHandlers)
  await apiMocker.get('*/api/v1/entities', entitiesResponse)
  await apiMocker.get(`*/api/v1/entities/${ENTITY_DETAIL.uuid}`, ENTITY_DETAIL)
  await apiMocker.delete(`*/api/v1/entities/${ENTITY_DETAIL.uuid}`, '', { status: 204 })
  // Mock updated list without deleted item
  await apiMocker.get('*/api/v1/entities', emptyResponse)

  // Act & Assert - Navigate from overview to detail
  await testUtil.navigateTo('/entities')
  await testUtil.clickByRoleAndName('link', 'Entity to Delete')
  await testUtil.expectUrlToBe(`/entities/${ENTITY_DETAIL.uuid}`)

  // Act & Assert - Delete and confirm
  await testUtil.clickButtonByText('Delete')
  await testUtil.clickButtonByText('Confirm') // or however your confirmation works
  
  // Assert - Verify deletion success
  await testUtil.expectUrlToBe('/entities') // redirected to overview
  // await testUtil.expectTextToBeVisible('Entity deleted successfully')
  await testUtil.expectTextNotToBeVisible('Entity to Delete')
})
```
