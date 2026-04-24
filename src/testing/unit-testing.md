#### [Testing](/testing.md)

# Unit testing

Frontend unit testing verifies small pieces of UI logic in isolation, like a Vue component, composable, store action, or utility function.
The goal is to catch regressions early while keeping tests fast and easy to maintain.

## What to test with unit tests

Unit tests are best for logic that should work regardless of browser navigation or backend state:

- Component behavior: conditional rendering, emits, computed state, disabled/loading state
- Composables: state transitions and returned API
- Utilities: formatting, mapping, validation, transformation
- Stores: actions, getters, and edge cases

## Unit vs Integration vs E2E

| Type | Scope | Speed | Best for |
|------|-------|-------|----------|
| Unit | Single unit (component/composable/util) | Fastest | Business logic and UI behavior in isolation |
| Integration | Multiple units together | Medium | Feature flows inside one module |
| E2E | Full app in browser | Slowest | Real user journeys and critical paths |

Use unit tests for broad coverage, then add integration and e2e tests for high-risk flows.

## What are good unit tests?

- **Fast** - Unit tests should be fast. They should run quickly. When tests run slow, you won't want to run them frequently. If you don't run them frequently, you won't find problems early enough to fix them easily.
- **Isolated** - Unit tests should be isolated from other tests. There should be no dependencies across tests. Each test should be able to be run independently, and in any order.
- **Repeatable** - Unit tests should be repeatable in any environment and at any time. If a unit test fails, it should be easy to reproduce the failure by rerunning the unit test.

## Recommended stack (Vue)

- `vitest`: test runner and assertions
- `@vue/test-utils`: Vue component mounting and interaction
- `jsdom`: browser-like environment for component tests

## Installation

### Vitest

Vitest is a simple and lightweight unit testing library for Vue 3.

#### Installation

```bash
pnpm add -D vitest @vue/test-utils jsdom
```

## Quick reference

- **Run all unit tests:** `pnpm vitest run`
- **Watch mode:** `pnpm vitest`
- **Run one file:** `pnpm vitest src/components/BaseButton.spec.ts`
- **Test file naming:** `*.spec.ts`

## Step-by-step: writing a frontend unit test

### Step 1: Create the test file

Place the test close to the source file when possible:

```text
src/composables/useUserStatusFilter.ts
src/composables/useUserStatusFilter.spec.ts
```

### Step 2: Follow Arrange, Act, Assert

- **Arrange:** set up props, mocks, and initial state
- **Act:** trigger user interaction or function call
- **Assert:** verify emitted events, rendered output, or returned values

### Step 3: Test behavior, not implementation details

Prefer this:

- "button is disabled while loading"
- "submit event is emitted once with the expected payload"

Avoid this:

- "internal variable X changed to true"

### Step 4: Cover happy path and edge cases

At minimum for each unit:

- Correct behavior with valid input
- Validation or error path
- Empty/default state
- Boundary value (if relevant)

## Example 1: utility function

```ts
import { describe, expect, test } from 'vitest'
import { clamp } from './number.util'

describe('clamp', () => {
  test('returns the value when inside boundaries', () => {
    expect(clamp(10, 0, 20)).toBe(10)
  })

  test('returns min when value is too small', () => {
    expect(clamp(-5, 0, 20)).toBe(0)
  })

  test('returns max when value is too large', () => {
    expect(clamp(99, 0, 20)).toBe(20)
  })
})
```

## Example 2: composable (active/inactive filtering)

```ts
import { ref } from 'vue'
import { describe, expect, test } from 'vitest'
import { useUserStatusFilter } from './useUserStatusFilter'

describe('useUserStatusFilter', () => {
  const users = [
    { id: '1', name: 'Ahmed', active: true },
    { id: '2', name: 'Bob', active: false },
    { id: '3', name: 'Carla', active: true },
  ]

  test('returns all users when filter is all', () => {
    const status = ref<'all' | 'active' | 'inactive'>('all')
    const { filteredUsers } = useUserStatusFilter(ref(users), status)

    expect(filteredUsers.value).toHaveLength(3)
  })

  test('returns only active users when filter is active', () => {
    const status = ref<'all' | 'active' | 'inactive'>('active')
    const { filteredUsers } = useUserStatusFilter(ref(users), status)

    expect(filteredUsers.value).toEqual([
      { id: '1', name: 'Ahmed', active: true },
      { id: '3', name: 'Carla', active: true },
    ])
  })

  test('returns only inactive users when filter is inactive', () => {
    const status = ref<'all' | 'active' | 'inactive'>('inactive')
    const { filteredUsers } = useUserStatusFilter(ref(users), status)

    expect(filteredUsers.value).toEqual([
      { id: '2', name: 'Bob', active: false },
    ])
  })
})
```

## Example 3: Vue component

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  test('renders label text', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Save' },
    })

    expect(wrapper.text()).toContain('Save')
  })

  test('emits click when enabled', async () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Save', disabled: false },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  test('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Save', disabled: true },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
```

## Mocking frontend dependencies

Use mocks to isolate the unit under test from APIs, router, or global services.

### Mocking an API module

```ts
import { describe, expect, test, vi } from 'vitest'
import { loadUser } from './loadUser'
import { userService } from '@/services/user.service'

vi.mock('@/services/user.service', () => ({
  userService: {
    getById: vi.fn(),
  },
}))

describe('loadUser', () => {
  test('returns mapped user data', async () => {
    vi.mocked(userService.getById).mockResolvedValue({ id: '1', name: 'Ada' })

    await expect(loadUser('1')).resolves.toEqual({ id: '1', fullName: 'Ada' })
  })
})
```

### Mocking router in a component test

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import BackButton from './BackButton.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

describe('BackButton', () => {
  test('navigates to dashboard on click', async () => {
    const wrapper = mount(BackButton)

    await wrapper.get('button').trigger('click')

    expect(push).toHaveBeenCalledWith({ name: 'dashboard' })
  })
})
```

## Testing async UI updates

For components that update after promises, timers, or Vue ticks:

- `await nextTick()` after reactive state updates
- `await flushPromises()` after async requests
- Avoid arbitrary timeouts (`setTimeout`) in tests

```ts
import { nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'

// ... trigger action
await nextTick()
await flushPromises()
```

## Common pitfalls

- Over-mocking until tests no longer represent real behavior
- Testing internal implementation details instead of user-observable behavior
- Creating giant "god tests" that verify too many scenarios at once
- Leaving shared mutable state between tests
- Using unstable selectors (prefer role, label, or test id conventions)

## Checklist for new unit tests

- [ ] File is named `*.spec.ts`
- [ ] Test follows Arrange, Act, Assert
- [ ] Covers happy path and at least one edge/error path
- [ ] Asserts behavior visible to users or consumers
- [ ] Mocks external dependencies only when needed
- [ ] No `test.only` or `describe.only`

## Next steps

- [Integration testing](/testing/integration-testing.md)
- [E2E testing](/e2e-testing/)
