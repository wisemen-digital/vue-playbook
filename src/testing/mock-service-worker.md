#### [Testing](/testing.md)

# What is Mock Service Worker and why should you use it?

Mock Service Worker is a library that allows you to mock your API calls. 
This is useful when you want to test your application without having to rely on a real API. 
This can be useful when you are developing your application and you don't have access to the real API yet. 
It can also be useful when you want to test your application in different scenarios, like when the API returns an error or when the API is slow.

We will mainly use it together with our PlayWright tests to mock the API calls.

Defenitely check out the [official documentation](https://mswjs.io/docs/) for more information.

## Installation

You should install 2 packages:

### Mock Service Worker

```bash
pnpm install msw@latest
```

Also run this command to generate a mockServiceWorker.js file in your public folder. this will be used to intercept the API calls.

```bash
npx msw init public --save   
```

### Playwright MSW
This package is a Playwright integration for Mock Service Worker.
```bash
pnpm install playwright-msw@latest
```

But this should all be ready to go in our template!

## Usage
If there isn't already a `mock` folder in your `source` folder, create one. Here all your handlers will be located.
Handlers are used to describe how the mock service worker should respond to a request. Learn more about it [here](https://mswjs.io/docs/network-behavior/rest).

there is also a `browser.mock.ts` file. Here you will set up your worker to use it in the browser and connect your handlers.

```typescript
import { setupWorker } from 'msw/browser'

import { handlers } from '@/mocks/handlers'

export const worker = setupWorker(...handlers)
```

your directory should look like this:

```bash
source
├── mocks
│   ├── handlers
│   │   ├── user.mock.ts
│   │   │── index.ts
│   │   └── ...
│   └── browser.mock.ts
└── ...
```

your `index.ts` file should look like this:

```typescript
import { userHandlers } from '@/mocks/handlers/user.mock.ts'

export const handlers = [
  ...userHandlers,
]
```

### Handlers
Here is an example of a handler:

```typescript
const users: UserIndexDto[] = [...]

export const userHandlers = [
  http.get('*/api/v1/users*', ({ request }) => {
    const url = new URL(request.url)

    if (url.pathname === '/api/v1/users/me') {
      return undefined
    }

    return HttpResponse.json(getPaginatedJson(users))
  }),
]
  ```
### Start the worker
In your config folder add the following to your `mockServer.config.ts` file:

```typescript
import { CURRENT_ENVIRONMENT } from '@/constants/environment.constant.ts'
import { worker } from '@/mocks/browser.mock.ts'

export async function setupMockServer(): Promise<ServiceWorkerRegistration | undefined> {
  if (CURRENT_ENVIRONMENT !== 'mock') {
    return
  }

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return await worker.start({ onUnhandledRequest: 'bypass' })
}
```



Then in your `main.ts` file add the following:


```typescript
setupMockServer().then(() => {
  const app = createVueApp(App)
  ...
  app.mount('#app')
  ...

})
```

Everything is setup now! 

If you want to use MSW you will have to change your environment to `mock` in your `.env` file.


### Playwright

To make it work with Playwright you will have to add the following to your `tests/base.ficture.ts` file:

```typescript
import { expect, test as base } from '@playwright/test'
import { http } from 'msw'
import type { MockServiceWorker } from 'playwright-msw'
import { createWorkerFixture } from 'playwright-msw'
import { handlers } from '@/mocks/handlers'

const test = base.extend<{
  http: typeof http
  worker: MockServiceWorker
}>({
  ...
  http,
  worker: createWorkerFixture(handlers, {
    waitForPageLoad: true,
  }),
})

export { expect, test }
```

These are the same handlers as in your `browser.mock.ts` file.

All your calls defined in your handlers will now be mocked in your tests by default. If you want to override a call in a specific text you can extract the `http` and `worker` from the test object. and then use them to mock the API call.

Example:
```typescript
import { HttpResponse } from 'msw'

import { TEST_ID } from '@/constants/testId.constant.ts'
import { UserIndexDtoBuilder } from '@/models/user/index/userIndexDto.builder.ts'
import { expect, test } from '@@/base.fixture'
import { getPaginatedJson } from '@@/utils/interceptor.util.ts'

test('display users in the table', async ({ http, page, worker }) => {
  const USER_1 = new UserIndexDtoBuilder()
    .withFirstName('Charles')
    .withEmail('charles.doe@gmail.com')
    .withLastName('Doe')
    .build()

  const USER_2 = new UserIndexDtoBuilder()
    .withFirstName('Nancy')
    .withEmail('nancy.johnson@gmail.com')
    .withLastName('Johnson')
    .build()

  await worker.use(
    http.get('*/api/v1/users', () => {
      return HttpResponse.json(getPaginatedJson([
        USER_1,
        USER_2,
      ]))
    }),
  )

  await page.goto('/users')

  await expect(page.getByTestId(TEST_ID.USERS.OVERVIEW.TABLE.FULL_NAME).nth(0))
    .toContainText('charles.doe@gmail.com')
  await expect(page.getByTestId(TEST_ID.USERS.OVERVIEW.TABLE.FULL_NAME).nth(1))
    .toContainText('nancy.johnson@gmail.com')
})
```


