# Pickle B2B Marketplace - Test Issues Tracker

**Last Updated:** `2025-05-11`

This document tracks issues with tests in the Pickle B2B Marketplace project, including skipped tests, failing tests, and tests that need to be implemented.

## Skipped Tests

### Button Component Tests

#### 1. `renders as a link when asChild is used with an anchor`

**Location**: `components/ui/__tests__/button.test.tsx`

**Issue**:
- Test fails with a `React.Children.only expected to receive a single React element child` error
- The error occurs because the `asChild` prop in the Button component uses Radix UI's Slot component, which expects a single child element
- Attempted fix with nested `<span>` inside the anchor tag didn't resolve the issue
- Attempted to mock the Radix UI Slot component, but still encountered issues

**Status**: ✅ Fixed
- Created a proper mock for the Radix UI Slot component in test-utils.tsx
- The mock handles the React.Children.only issue by properly cloning the first child element
- The test now passes and correctly verifies that the Button component works with asChild

**Solution Details**:
- Added a mock for @radix-ui/react-slot in test-utils.tsx
- The mock implements a simplified version of the Slot component that works in the test environment
- It properly handles event handlers and prop merging
- This approach allows us to test components that use Radix UI's Slot without modifying the actual components

### AdminTransactionHistory Component Tests

#### 1. `filters transactions based on status`

**Location**: `components/admin/__tests__/admin-transaction-history.test.tsx`

**Issue**:
- Test fails because it expects `TX-1234` not to be in the document after filtering, but it remains present
- Suggests that the filtering functionality isn't working as expected in the test environment
- Component likely relies on state updates that aren't being properly reflected in the test

**Fix Requirements**:
- Mock the state management more effectively
- Use `waitFor` or similar async utilities to wait for state updates
- Ensure the component's filtering logic works correctly in the test environment

#### 2. `filters transactions based on type`

**Location**: `components/admin/__tests__/admin-transaction-history.test.tsx`

**Issue**:
- Test fails because it can't find an element with the text "Payout"
- Suggests that the dropdown menu for transaction types isn't being properly rendered or populated
- The component might be using a UI library component for dropdowns that requires special handling in tests

**Fix Requirements**:
- Mock the dropdown component or its behavior
- Ensure the dropdown options are properly rendered in the test environment
- Use a different approach to simulate selecting an option from the dropdown

#### 3. `exports transactions as CSV when export button is clicked`

**Location**: `components/admin/__tests__/admin-transaction-history.test.tsx`

**Issue**:
- Test fails with a "Target container is not a DOM element" error
- Suggests an issue with how the component is being rendered in the test environment
- The test mocks DOM APIs like `document.createElement` and `document.body.appendChild`, which can be tricky to get right

**Fix Requirements**:
- Fix the rendering issue, possibly by providing a proper wrapper component
- Improve the mocking of DOM APIs
- Ensure the CSV export functionality is properly isolated for testing

#### 4. `paginates transactions correctly`

**Location**: `components/admin/__tests__/admin-transaction-history.test.tsx`

**Issue**:
- Similar to the CSV export test, fails with a "Target container is not a DOM element" error
- Pagination often involves complex state management and UI updates that can be challenging to test

**Fix Requirements**:
- Fix the rendering issue
- Properly mock the pagination state and behavior
- Use async testing utilities to wait for pagination updates

### ProductCard Component Tests

#### 1. `renders Compare button when onAddToComparison is provided`

**Location**: `components/marketplace/__tests__/marketplace-product-card.test.tsx`

**Issue**:
- The ProductCard component doesn't actually have a Compare button feature
- The test was written based on an assumption about the component's functionality

**Fix Requirements**:
- Either add the Compare button feature to the ProductCard component
- Or remove this test entirely since it's testing functionality that doesn't exist

#### 2. `does not render Compare button when onAddToComparison is not provided`

**Location**: `components/marketplace/__tests__/marketplace-product-card.test.tsx`

**Issue**:
- Same reason as above - the ProductCard component doesn't have a Compare button feature

**Fix Requirements**:
- Same as above - either add the feature or remove the test

## Common Issues and Solutions

### 1. Component Rendering Issues

**Problem**: Several tests have problems with how components are rendered in the test environment, particularly with complex UI libraries or custom rendering logic.

**Solutions**:
- Ensure all required context providers are included in the test setup
- Create a custom render function that includes all necessary providers
- Use `jest.mock()` to mock complex dependencies
- Consider using more isolated component tests that don't rely on complex rendering

### 2. State Management Challenges

**Problem**: Tests that rely on state changes (like filtering or pagination) are difficult to get working correctly in the test environment.

**Solutions**:
- Use `act()` to ensure state updates are processed
- Use `waitFor()` to wait for state changes to be reflected in the DOM
- Mock state management hooks to provide controlled test data
- Test state logic separately from UI rendering when possible

### 3. DOM API Mocking

**Problem**: Tests that need to mock browser APIs like document methods are challenging to implement correctly.

**Solutions**:
- Use `jest.spyOn()` to mock DOM methods
- Create helper functions for common DOM operations
- Consider refactoring components to accept dependencies as props for easier testing
- Use testing libraries that provide better DOM mocking capabilities

### 4. Assumptions About Component Functionality

**Problem**: Some tests were written based on assumptions about component features that don't actually exist.

**Solutions**:
- Review component implementation before writing tests
- Update tests to match actual component behavior
- Consider using test-driven development to ensure components meet requirements
- Document component APIs clearly to avoid misunderstandings

## Priority Test Fixes

1. **Button Component `asChild` Test**: High priority as it's a core UI component used throughout the application
2. **AdminTransactionHistory Filtering Tests**: Medium priority as they test important functionality for administrators
3. **AdminTransactionHistory Export and Pagination Tests**: Medium priority as they test advanced functionality
4. **ProductCard Compare Button Tests**: Low priority as they test non-existent functionality

## Test Coverage Goals

- **Unit Tests**: 80% coverage for all components and utilities
- **Integration Tests**: Key user flows should have integration test coverage
- **End-to-End Tests**: Critical business processes should have E2E test coverage

## Next Steps

1. Fix the high-priority Button component test
2. Address the AdminTransactionHistory tests
3. Decide on the ProductCard Compare button functionality
4. Expand test coverage to other components
5. Implement integration tests for key user flows
