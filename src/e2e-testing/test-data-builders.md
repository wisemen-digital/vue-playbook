# Test Data Builders

#### [E2E Testing](/e2e-testing/)

## What Are Builders?

Builders are classes that create test data objects using a fluent API. Instead of writing large object literals in every test, you use builders to create objects with sensible defaults and override only the fields you care about.

## The Builder Pattern

Every builder follows the same structure:

```typescript
export class AirlineIndexDtoBuilder {
  // Default values for all fields
  value: AirlineResponse = {
    uuid: UuidUtil.getRandom(),
    name: 'Example Airline',
    iataCode: 'EA',
    icaoCode: 'EXA',
    icon: null,
  }

  // Build: returns the final object
  build(): AirlineResponse {
    return this.value
  }

  // With methods: override specific fields (return `this` for chaining)
  withName(name: string): AirlineIndexDtoBuilder {
    this.value.name = name
    return this
  }

  withIataCode(iataCode: string): AirlineIndexDtoBuilder {
    this.value.iataCode = iataCode
    return this
  }

  withIcaoCode(icaoCode: string): AirlineIndexDtoBuilder {
    this.value.icaoCode = icaoCode
    return this
  }

  withUuid(uuid: AirlineUuid): AirlineIndexDtoBuilder {
    this.value.uuid = uuid
    return this
  }
}
```

## Using Builders

### Basic Usage

Create an object with all defaults:

```typescript
const airline = new AirlineIndexDtoBuilder().build()
// { uuid: '<random>', name: 'Example Airline', iataCode: 'EA', icaoCode: 'EXA', icon: null }
```

### Override Specific Fields

Chain `withX()` methods to customize:

```typescript
const airline = new AirlineIndexDtoBuilder()
  .withName('Test Airline')
  .withIataCode('TA')
  .withIcaoCode('TAL')
  .build()
// { uuid: '<random>', name: 'Test Airline', iataCode: 'TA', icaoCode: 'TAL', icon: null }
```

### Create Multiple Objects

```typescript
const airlines = [
  new AirlineIndexDtoBuilder().withName('Airline A').build(),
  new AirlineIndexDtoBuilder().withName('Airline B').build(),
  new AirlineIndexDtoBuilder().withName('Airline C').build(),
]

await worker.use(
  MockHandlerFactory.airline.getIndex(airlines),
)
```

## Where Builders Live

Builders are co-located with their model types in the source code:

```
src/modules/{module}/models/{entity}/
├── index/
│   ├── airlineIndexDto.builder.ts    # Builder for list/index responses
│   └── ...
├── detail/
│   ├── airlineDetailDto.builder.ts   # Builder for detail responses
│   └── ...
```

Import them using the `@/` alias:

```typescript
import { AirlineIndexDtoBuilder } from '@/modules/airline/models/airline/index/airlineIndexDto.builder'
import { AirlineDetailDtoBuilder } from '@/modules/airline/models/airline/detail/airlineDetailDto.builder'
```

## Index vs. Detail Builders

Most entities have two builders:

| Builder Type | Purpose | Typical Fields |
|-------------|---------|----------------|
| **IndexDtoBuilder** | List/table data (abbreviated) | uuid, name, key identifiers |
| **DetailDtoBuilder** | Full detail view | All fields including timestamps, nested objects |

Example for airlines:

```typescript
// Index builder (for table/list views)
const listItem = new AirlineIndexDtoBuilder()
  .withName('Test Airline')
  .build()
// { uuid, name, iataCode, icaoCode, icon }

// Detail builder (for detail/edit views)
const detail = new AirlineDetailDtoBuilder()
  .withName('Test Airline')
  .build()
// { uuid, name, iataCode, icaoCode, icon, createdAt, updatedAt }
```

## Writing a New Builder

When adding tests for a new module, create builders for each response type:

### 1. Check the API response type

Look at the generated client types in `@/client` to see what fields are expected.

### 2. Create the builder

```typescript
// src/modules/newFeature/models/newFeature/index/newFeatureIndexDto.builder.ts
import type { NewFeatureResponse } from '@/client'
import { UuidUtil } from '@/utils/uuid/uuid.util'

export class NewFeatureIndexDtoBuilder {
  value: NewFeatureResponse = {
    uuid: UuidUtil.getRandom(),
    name: 'Example Feature',
    status: 'active',
  }

  build(): NewFeatureResponse {
    return this.value
  }

  withName(name: string): NewFeatureIndexDtoBuilder {
    this.value.name = name
    return this
  }

  withStatus(status: string): NewFeatureIndexDtoBuilder {
    this.value.status = status
    return this
  }

  withUuid(uuid: string): NewFeatureIndexDtoBuilder {
    this.value.uuid = uuid
    return this
  }
}
```

### Conventions

- Builder class name: `{Entity}{Index|Detail}DtoBuilder`
- File name: `{entity}{Index|Detail}Dto.builder.ts`
- Always generate a random UUID as default (use `UuidUtil.getRandom()`)
- Provide sensible default values for all required fields
- Each `withX()` method returns `this` for chaining
- `build()` returns the final object

## Using Builders with Handlers

The typical flow is:

```typescript
test('displays feature details', async ({ page, worker }) => {
  // 1. Create test data
  const feature = new NewFeatureDetailDtoBuilder()
    .withName('My Feature')
    .withStatus('active')
    .build()

  // 2. Pass to mock handler
  await worker.use(
    MockHandlerFactory.newFeature.getDetail(feature),
  )

  // 3. Navigate and assert
  await page.goto('/features/some-uuid')
  await expect(page.getByText('My Feature')).toBeVisible()
  await expect(page.getByText('active')).toBeVisible()
})
```

## Next Steps

- [API Mocking](/e2e-testing/api-mocking) - Using builders with mock handlers
- [Writing Tests](/e2e-testing/writing-tests) - Full test examples with builders
