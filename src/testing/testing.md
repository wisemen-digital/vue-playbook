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

# Example: Unit Testing with Vitest

Below is a simple example of a **unit test** using [Vitest](https://vitest.dev/). Unlike an end-to-end test (where you automate browser actions and verify UI behavior), a **unit test** focuses on testing a small, isolated piece of functionality—often a single function or module.

Suppose we have a function `greet` that greets a user by name. If the name is empty, it throws an error:

```typescript
// greet.ts

export function greet(name: string): string {
    if (!name) {
        throw new Error('Name cannot be empty');
    }
    return `Hello, ${name}!`;
}
```

```typescript
// example of a unit test for the greet function
import { describe, it, expect } from 'vitest';
import { greet } from './greet';

describe('greet', () => {
    it('returns a greeting message for a valid name', () => {
        // Arrange & Act
        const result = greet('Alice');

        // Assert
        expect(result).toBe('Hello, Alice!');
    });

    it('throws an error for an empty name', () => {
        // Arrange & Act & Assert
        expect(() => greet('')).toThrow('Name cannot be empty');
    });
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
  // Arrange: navigate to the product page
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
tests/
├── customer/
│   ├── customerCreate.spec.ts
│   ├── customerDelete.spec.ts
│   ├── customerUpdate.spec.ts
│   ├── customerOverview.spec.ts
│   └── customerDetail.spec.ts
├── news/
│   ├── newsCreate.spec.ts
│   └── ...
└── utils/
    └── data.util.ts
```

## 4. How Should We Name the Test Files?

It's important to follow a consistent naming convention to make it clear what the tests aim to do. The convention for file names is as follows:

- **Unit Tests:** `componentName.unit.spec.ts`
- **Integration Tests:** `componentName.integration.spec.ts`
- **E2E Tests:** `flowName.spec.ts`

This ensures that the test type and content are clear.

## 5. How Should Tests Be Split/Structured?

Each test should be simple and focused. Here's how we should structure our tests:

### AAA Principle (Arrange, Act, Assert):

1. **Arrange:** Set up the test environment by configuring mock data, api calls or components.
2. **Act:** Perform the action you want to test, such as clicking a button or submitting a form.
3. **Assert:** Check the result and verify that it meets expectations.

### Example of a e2e Test Structure (AAA Principle):

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
    - **Example:** Use `data-test-id="TEST_ID.LOGIN.SUBMIT.BUTTON"` instead of `data-test-id="TEST_ID.SUBMIT"`.

These `data-test-id`s are created and stored in `testId.constant.ts`, where you can define the test IDs.

### Example:

```typescript
// testId.constant.ts
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
<button data-test-id="TEST_ID.AUTH.LOGIN_BUTTON">Login</button>
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
- **Example:** `Button.unit.spec.ts` for the `Button` component.

### 2. *Feature-Specific Integration & E2E Tests:*
- Tests for specific functionalities like logging in or checking out should be placed in their own folder or file.
- **Example:** `loginFlow.spec.ts`.

### 3. *Structure by Domain:*
- Group tests by domain or functionality, such as `customer`, `employee`, `dashboard`. This ensures that the test scale remains organized as the project grows.

## 9. Mocking API Calls in Tests

In our testing strategy, we frequently use mocked API calls to ensure that our tests are not dependent on real backend services. This allows us to run tests faster, more reliably, and without external influences. There are two main approaches to mocking API calls within our tests: shared API calls reused across multiple tests, and specific API calls unique to a single test. Below is an explanation of how we apply both approaches within our project.

for more information about mocking API calls in tests, please refer to the [Mock Service Worker](/testing/mock-service-worker.md) documentation.

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
    uuid: UuidUtil.getRandom<CustomerUuid>(), // Generate a random UUID
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    address: new AddressBuilder().build(), // Use AddressBuilder to create the address
    isActive: true,
  };

  constructor() {}

  /**
   * Finalizes and returns the built CustomerDto object. this is sufficient! in some cases it may be needed to add the with* methods
   */
  build(): CustomerDto {
    return this.value;
  } 
  
  /**
   * Sets the address of the customer.
   */
  withAddress(address: AddressDto): CustomerDtoBuilder {
    this.value.address = address;
    return this;
  } // Define only if specifically needed; otherwise, build() is sufficient
}
```

### Summary of Conventions:

1. **Structure:**
    - Builders are placed in the same directory as the model, with consistent naming (`model.builder.ts`).

2. **Dependencies:**
    - Avoid circular dependencies by using lazy loading and modularization.

3. **Data in Builders:**
    - Focus on reusability and consistency when loading data within builders.

4. **Use of Other Builders:**
    - Call other builders via `new AnotherBuilder().build()` to create logically structured objects.

With these conventions and structures, we can ensure that our tests are reliable, easy to maintain, and scalable as the application grows.