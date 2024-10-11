# Testing Strategy

## 1. What Types of Tests Should We Write?

To fully cover our application and ensure code quality, we need to implement various types of tests:

### *Unit Tests:*
- **Purpose:** Test individual functions or components in isolation without dependencies on external systems such as APIs or databases.
- **Usage:** For small units like functions, classes, or components.
- **Examples:**
    - Utility functions that perform complex calculations.
    - Testing all composables.
    - Verifying that a form validates as expected when the user inputs data.

```typescript
// Example of a Unit Test for a Login Function
test('users can successfully log in', async ({ page }) => {
  // Arrange: Navigate to the login page
  await page.goto('https://example.com/login');
  
  // Act: Fill in the username and password, then submit the form
  await page.getByTestId(TEST_ID.AUTH.LOGIN_BUTTON).fill('johndoe');
  await page.getByTestId(TEST_ID.AUTH.PASSWORD_INPUT).fill('password123');
  await page.getByTestId(TEST_ID.AUTH.SUBMIT_BUTTON).click();
  
  // Assert: Verify that the user is redirected to the dashboard
  await expect(page).toHaveURL('https://example.com/dashboard');
});
```

### *Integration Tests:*
- **Purpose:** Test the interaction between multiple components or systems, such as APIs, services, and front-end components.
- **Usage:** For components that depend on external services or interact with other components.
- **Examples:**
    - A form that sends data to a back-end API and correctly processes the response.

```typescript
// Example of an Integration Test for Form Submission
test('form submits data to API and processes response correctly', async ({ page }) => {
  // Arrange: Mock the API response
  await InterceptorUtil.post(page, '/api/submit-form', { success: true });
  
  // Act: Fill out and submit the form
  await page.getByTestId(TEST_ID.FORM.NAME_INPUT).fill('Jane Doe');
  await page.getByTestId(TEST_ID.FORM.EMAIL_INPUT).fill('jane.doe@example.com');
  await page.getByTestId(TEST_ID.FORM.SUBMIT_BUTTON).click();
  
  // Assert: Check that the success message is displayed
  await expect(page.getByTestId(TEST_ID.FORM.SUCCESS_MESSAGE)).toBeVisible();
});
```

### *End-to-End (E2E) Tests:*
- **Purpose:** Test complete user flows to verify that the application functions correctly from an end-user's perspective.
- **Usage:** For testing critical user flows such as logging in, checking out a product, or submitting a form.
- **Examples:**
    - A complete checkout flow in a webshop starting from adding a product to the cart and ending with a successful payment.

```typescript
// Example of an E2E Test for a Complete Checkout Flow
test('complete checkout flow from adding to cart to payment', async ({ page }) => {
  // Arrange: Set up necessary data and navigate to the product page
  await DataSeederUtil.setup(page, { products: [PRODUCT_ITEM] });
  await page.goto('https://example.com/products');
  
  // Act: Add a product to the cart and proceed to checkout
  await page.getByTestId(TEST_ID.PRODUCT.ADD_TO_CART_BUTTON).click();
  await page.getByTestId(TEST_ID.CART.CHECKOUT_BUTTON).click();
  
  // Fill in payment details and submit
  await page.getByTestId(TEST_ID.CHECKOUT.PAYMENT_INPUT).fill('4111111111111111');
  await page.getByTestId(TEST_ID.CHECKOUT.SUBMIT_PAYMENT_BUTTON).click();
  
  // Assert: Verify that the payment was successful
  await expect(page.getByTestId(TEST_ID.CHECKOUT.SUCCESS_MESSAGE)).toBeVisible();
});
```

## 2. What Technologies/Packages Are We Using?

For our testing stack, we choose proven tools that integrate well with our existing project and CI/CD pipeline. Here are the main tools:

- **Unit Testing:**
    - **Framework:** Vitest
    - **Why:** Vitest is fast, offers extensive mocking capabilities, and supports various test environments.

- **Integration & E2E Testing:**
    - **Framework:** Playwright
    - **Why:** Playwright provides comprehensive capabilities for writing browser-based tests. It also supports API interception, allowing easy integration of mock services.

## 3. Where Should Test Files Be Placed?

To maintain a clear separation between test types, we place test files in structured directories. Utilities are kept in a separate folder as outlined in the structure below. Here are the conventions:

### Directory Structure:

```
Tests/
├── Customer/
│   ├── customerCreate.spec.ts
│   ├── customerDelete.spec.ts
│   ├── customerUpdate.spec.ts
│   ├── customerOverview.spec.ts
│   └── customerDetail.spec.ts
├── News/
│   ├── newsCreate.spec.ts
│   └── ...
└── utils/
    └── data.util.ts
```

## 4. How Should We Name the Test Files?

It's important to follow a consistent naming convention to make it clear what the tests aim to do. The convention for file names is as follows:

- **Unit Tests:** `componentName.test.ts`
- **Integration Tests:** `componentName.integration.test.ts`
- **E2E Tests:** `flowName.e2e.test.ts`

This ensures that the test type and content are clear.

## 5. How Should Tests Be Split/Structured?

Each test should be simple and focused. Here's how we should structure our tests:

### AAA Principle (Arrange, Act, Assert):

1. **Arrange:** Set up the test environment by configuring mock data or components.
2. **Act:** Perform the action you want to test, such as clicking a button or submitting a form.
3. **Assert:** Check the result and verify that it meets expectations.

### Example of a Unit Test Structure (AAA Principle):

```typescript
test('users can successfully log in', async ({ page }) => {
  // Arrange: Navigate to the login page
  await page.goto('https://example.com/login');
  
  // Act: Enter username and password, then click the submit button
  await page.getByTestId(TEST_ID.AUTH.USERNAME_INPUT).fill('johndoe');
  await page.getByTestId(TEST_ID.AUTH.PASSWORD_INPUT).fill('password123');
  await page.getByTestId(TEST_ID.AUTH.SUBMIT_BUTTON).click();
  
  // Assert: Verify that the URL is the dashboard
  await expect(page).toHaveURL('https://example.com/dashboard');
});
```

## 6. What Are the Best Practices for Naming Tests/Descriptions?

Naming tests is essential to ensure that everyone understands what the test does without having to look into the code. Here are some best practices for naming tests:

### *Descriptive Names:*
- Test names should clearly describe what is being tested.
- **Example:** `test('should display a button when the user is logged in')` is better than `test('render button')`.

### *Action-Oriented:*
- Use action-oriented words like "should", "can", "displays", "verifies" to indicate what the test checks.
- **Example:** `it('should display an error message for an invalid password')`.

### *Consistency:*
- Keep names consistent by using a standard format, such as:
    - `test('should display the correct error message when input field is missing')`
    - `test('verifies that a user can log out')`.

### *Test Grouping:*
- Use `describe` to group tests that cover the same component or functionality. This makes it easier to organize and understand tests.

### Example:

```typescript
describe('LoginForm Component', () => {
  test('should display an error message for an invalid password', () => {
    // test logic
  });

  test('should redirect the user to the dashboard upon successful login', () => {
    // test logic
  });
});
```

## 7. How Should We Structure Our Test IDs?

Using `data-test-id` attributes in HTML is the best way to create stable selectors for tests. This prevents changes in the UI, such as classes or IDs, from breaking our tests.

### Best Practices for Test IDs:

1. **Always Use `data-test-id`:**
    - Avoid using selectors like `nth-child` or CSS classes as they can change due to visual or structural UI changes.

2. **Descriptive Naming:**
    - Ensure that test IDs describe the function of the element.
    - **Example:** Use `data-test-id="login-submit-button"` instead of `data-test-id="submit"`.

These `data-test-id`s are created and stored in `shared.selectors.ts`, where you can define the test IDs.

### Example:

```typescript
// shared.selectors.ts
export const TEST_ID = {
  AUTH: {
    LOGIN_BUTTON: 'auth_login_button',
    PASSWORD_INPUT: 'auth_password_input',
    SUBMIT_BUTTON: 'auth_submit_button',
  },
  NAV_BAR: {
    GREETING_MESSAGE: 'nav_bar_greeting_message',
  },
  SETTINGS: {
    CREATE_BUTTON: 'settings_create_button',
    NAME_INPUT: 'settings_name_input',
    SAVE_BUTTON: 'settings_save_button',
  },
  SHARED: {
    ADDRESS: {
      STREET_INPUT: 'shared_address_street_input',
      CITY_INPUT: 'shared_address_city_input',
      POSTAL_CODE_INPUT: 'shared_address_postal_code_input',
      COUNTRY_SELECT: 'shared_address_country_select',
    },
  },
  CUSTOMER: {
    OVERVIEW: {
      PAGE: 'customer_overview_page',
      EDIT_BUTTON: 'customer_overview_edit_button',
    },
    CREATE: {
      BUTTON: 'customer_create_button',
      FORM: 'customer_create_form',
      FIRST_NAME_INPUT: 'customer_create_first_name_input',
      LAST_NAME_INPUT: 'customer_create_last_name_input',
      SUBMIT_BUTTON: 'customer_create_submit_button',
      SUCCESS_MESSAGE: 'customer_create_success_message',
    },
  },
};
```

### Usage Example:

```html
<!-- HTML Element with Test ID -->
<button data-test-id="auth_login_button">Login</button>
```

```typescript
// Example of Using Test IDs in a Component
const userDetailViewHeaderItems = computed<UserDetailViewHeaderItems[]>(() => ([
  {
    testId: TEST_ID.CUSTOMER.OVERVIEW.PAGE,
    description: t('shared.role'),
    icon: 'inbox',
    value: t(UserRoleEnum.getI18nKey(UserRole.CUSTOMER)),
  },
]));
```

### Additional Best Practice:

- **Consistency:** Keep test IDs consistent throughout the entire application. This makes it easier for team members to write and understand tests.

## 8. How Should We Split and Structure Tests?

Tests should be logically divided to make them easy to maintain and understand. Here are some guidelines:

### 1. *Unit Tests per Component:*
- Each component should have a corresponding test file.
- **Example:** `Button.test.ts` for the `Button` component.

### 2. *Feature-Specific Integration & E2E Tests:*
- Tests for specific functionalities like logging in or checking out should be placed in their own folder or file.
- **Example:** `loginFlow.e2e.test.ts`.

### 3. *Structure by Domain:*
- Group tests by domain or functionality, such as `customer`, `employee`, `dashboard`. This ensures that the test scale remains organized as the project grows.

## 9. Mocking API Calls in Tests

In our testing strategy, we frequently use mocked API calls to ensure that our tests are not dependent on real backend services. This allows us to run tests faster, more reliably, and without external influences. There are two main approaches to mocking API calls within our tests: shared API calls reused across multiple tests, and specific API calls unique to a single test. Below is an explanation of how we apply both approaches within our project.

### Shared API Calls

Shared API calls are reusable logic for mocking common API calls. These API calls are located centrally within the `tests/utils/data.util.ts` folder. The idea is to easily reuse API responses shared by many tests.

#### Example of a Shared API Call:

```typescript
// tests/utils/data.util.ts

import type { Page } from '@playwright/test';

import { ChatUnreadCountDtoBuilder } from '@/models/chat/unread-count/chatUnreadCountDto.builder.ts';
import type { ChatUnreadCountDto } from '@/models/chat/unread-count/chatUnreadCountDto.model.ts';
import { TaskCountDtoBuilder } from '@/models/task/count/taskCountDto.builder.ts';
import type { TasksCountDto } from '@/models/task/count/tasksCountDto.model.ts';
import { UserDtoBuilder } from '@/models/user/detail/userDto.builder.ts';
import type { UserDto } from '@/models/user/detail/userDto.model.ts';
import { InterceptorUtil } from '@@/utils/interceptor.util.ts';

interface BaseData {
  chatUnreadCount?: ChatUnreadCountDto;
  taskCount?: TasksCountDto;
  user?: UserDto;
}

export class DataSeederUtil {
  /**
   * Sets up mock data for the page by intercepting API calls.
   * @param page - The Playwright page object.
   * @param data - Optional data to override default mocks.
   */
  static async setup(page: Page, data?: BaseData): Promise<void> {
    const USER = data?.user ?? new UserDtoBuilder().build();
    const UNREAD_COUNT = data?.chatUnreadCount ?? new ChatUnreadCountDtoBuilder().build();
    const TASK_COUNTS = data?.taskCount ?? new TaskCountDtoBuilder().build();

    // Mocking the GET /users/:uuid API call
    await InterceptorUtil.get(page, `users/${USER.uuid}`, USER);
    
    // Mocking the GET /chat-threads/unread-count API call
    await InterceptorUtil.get(page, `chat-threads/unread-count`, UNREAD_COUNT);
    
    // Mocking the GET /tasks/count API call
    await InterceptorUtil.get(page, 'tasks/count', TASK_COUNTS);
  }
}
```

In the above example, `DataSeederUtil` provides an easy way to mock standard data such as departments, FAQs, and KPIs via the `setup()` method. This ensures that we can quickly start tests without manually setting up these mock API calls for each test.

### How to Use Shared API Calls:

You can easily use these shared API calls in your tests via the `DataSeederUtil.setup` method.

#### Example of Using a Shared API Call in a Test:

```typescript
// tests/customer/customerCreate.spec.ts

import { test } from '@playwright/test';
import { DataSeederUtil } from '../utils/data.util.ts';
import { DEPARTMENT } from '../fixtures/department.fixture.ts';

test.beforeEach(async ({ page }) => {
  // Setup shared mock data for departments
  await DataSeederUtil.setup(page, {
    departments: [DEPARTMENT],
  });
});

test('should create a new customer successfully', async ({ page }) => {
  // Test logic for creating a customer
});
```

### Specific API Calls

While shared API calls are convenient, there are times when tests need to mock API calls that are unique to that test. In such cases, we can place the mock within the test itself, typically within the `beforeEach` function. This allows setting up exact data required for the test without relying on a real backend.

#### Example of Specific API Calls:

```typescript
// tests/customer/customerDetail.spec.ts

import { test } from '@playwright/test';
import { DataSeederUtil } from '../utils/data.util.ts';
import { CLAIM_TASK_INDEX, CLAIM_TASK } from '../fixtures/task.fixture.ts';
import { CONSULTANT_INDEX_1, CONSULTANT_INDEX_2 } from '../fixtures/consultant.fixture.ts';

test.beforeEach(async ({ page }) => {
  // Setup shared mock data
  await DataSeederUtil.setup(page);
  
  // Mocking specific API calls for tasks and consultants
  await InterceptorUtil.getPaginated(page, 'tasks/claims', [CLAIM_TASK_INDEX]);
  await InterceptorUtil.get(page, `tasks/claims/${CLAIM_TASK_INDEX.uuid}`, CLAIM_TASK);
  await InterceptorUtil.getPaginated(page, 'consultants', [
    CONSULTANT_INDEX_1,
    CONSULTANT_INDEX_2,
  ]);
  await InterceptorUtil.post(page, `tasks/claims/${CLAIM_TASK_INDEX.uuid}`, CLAIM_TASK);
});

test('should display customer details correctly', async ({ page }) => {
  // Test logic for displaying customer details
});
```

### When to Use Shared vs. Specific API Calls?

- **Shared API Calls:** Useful when mocking frequently used API calls such as departments, KPIs, and FAQs. This helps minimize code duplication and centralizes common logic.
- **Specific API Calls:** Used when a test requires unique data that is not reusable by other tests. For example, a test that needs to verify a specific error or edge case.

### Best Practices for API Mocking

1. **Route Interception:**
    - Use Playwright’s route feature to mock API responses. This ensures that our tests are always consistent, regardless of the external API's status.

2. **Data Builders:**
    - Use builders like `DepartmentBuilder` and `CustomerBuilder` to create mock data. This makes it easy to generate specific objects with desired properties and promotes reusability.

3. **Parallelization and Isolation:**
    - By mocking API calls, we can run tests in parallel without relying on a shared backend. This speeds up tests and ensures reliability.

## 10. Builder Pattern Strategy

When implementing the Builder Pattern in our project, we need to consider several key factors. The goal of this pattern is to create objects flexibly and controllably, especially when objects are complex or have many different properties. Below are the conventions and approaches for building a Builder, including how to handle circular dependencies, best practices for data loading, and using other builders within a builder.

### Placement of Builders:

- **Location:** Builders are placed in the same directory as their corresponding model.
- **Naming Convention:** `{modelName}.builder.ts`.
- **Example:** If you have a model `customer.model.ts`, place the builder in `customer.builder.ts`.

### Avoiding Circular Dependencies:

Circular dependencies occur when two or more builders depend on each other, leading to runtime errors. To avoid this:

- **Use Lazy Loading Techniques:** Load dependencies only when absolutely necessary.
- **Modularization:** Split dependencies into separate modules whenever possible.

### Data Loading in Builders:

Builders often contain data used across multiple components or tests. Consider the following:

- **Reusability:** Define shared data or defaults in your builders to ensure consistent usage across tests.
- **Consistency:** Ensure that configurations like IDs and object structures are consistent in different tests and components.

### Using Another Builder Within a Builder:

For complex objects, it’s often necessary to call another builder within your builder. This enhances modularity and ensures objects are constructed logically.

- **Example:** Calling `new AnotherBuilder().build()` within a builder.

### A Simple Example of a Builder:

Below is an example of how to set up a simple builder and how to use another builder within the current builder.

```typescript
// models/customer/customer.builder.ts

import { UuidUtil } from '@/utils/uuid.util.ts';
import { AddressBuilder } from '@/models/address/address.builder.ts';
import type { CustomerDto } from '@/modules/customers/models/customerDto.type.ts';
import type { AddressDto } from '@/models/address/addressDto.type.ts';

/**
 * Builder class for creating CustomerDto objects.
 */
export class CustomerDtoBuilder {
  private value: CustomerDto = {
    uuid: UuidUtil.getRandom<string>(), // Generate a random UUID
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    address: new AddressBuilder().build(), // Use AddressBuilder to create the address
    isActive: true,
  };

  constructor() {}

  /**
   * Finalizes and returns the built CustomerDto object.
   */
  build(): CustomerDto {
    return this.value;
  }

  /**
   * Sets the first name of the customer.
   * @param firstName - The first name to set.
   */
  withFirstName(firstName: string): CustomerDtoBuilder {
    this.value.firstName = firstName;
    return this;
  }

  /**
   * Sets the last name of the customer.
   * @param lastName - The last name to set.
   */
  withLastName(lastName: string): CustomerDtoBuilder {
    this.value.lastName = lastName;
    return this;
  }

  /**
   * Sets the email of the customer.
   * @param email - The email to set.
   */
  withEmail(email: string): CustomerDtoBuilder {
    this.value.email = email;
    return this;
  }

  /**
   * Sets the address of the customer.
   * @param address - The address to set.
   */
  withAddress(address: AddressDto): CustomerDtoBuilder {
    this.value.address = address;
    return this;
  } // Define only if specifically needed; otherwise, build() is sufficient

  /**
   * Sets the active status of the customer.
   * @param isActive - The active status to set.
   */
  withIsActive(isActive: boolean): CustomerDtoBuilder {
    this.value.isActive = isActive;
    return this;
  }
}
```

### Important Considerations When Building Builders:

1. **Modularity:**
    - Use builders within builders to increase code modularity and prevent complex objects from becoming unnecessarily large.

2. **Chaining Methods:**
    - Builders should always support method chaining, such as `withFirstName()` and `withLastName()`, to keep tests and code readable and maintainable.

3. **Use `build()` at the End:**
    - Ensure that `build()` is always called to finalize the object. This maintains the clarity of the builder pattern's intention and ensures the object is only created when all necessary properties are set.

4. **Initialize a Default Object:**
    - In the constructor, set up a default object. This prevents the need to explicitly set everything in every test and allows for quick variations via `with*` methods.

### Summary of Conventions:

1. **Structure:**
    - Builders are placed in the same directory as the model, with consistent naming (`model.builder.ts`).

2. **Dependencies:**
    - Avoid circular dependencies by using lazy loading and modularization.

3. **Data in Builders:**
    - Focus on reusability and consistency when loading data within builders.

4. **Use of Other Builders:**
    - Call other builders via `new AnotherBuilder().build()` to create logically structured objects.

5. **Ensure Comprehensive Test Coverage:**
    - Strive for maximum test coverage in your application.

With these conventions and structures, we can ensure that our tests are reliable, easy to maintain, and scalable as the application grows.