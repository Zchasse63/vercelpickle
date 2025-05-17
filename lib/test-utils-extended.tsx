import React from 'react';
import { render, screen, within, fireEvent } from '@/lib/test-utils';
import { VariantProps } from 'class-variance-authority';

/**
 * Enhanced render function that provides additional utilities for testing components
 * with data-testid attributes and common component patterns.
 */
export function renderWithTestId(component: React.ReactElement) {
  const result = render(component);

  // Enhanced queries
  const getByTestIdOrFail = (id: string) => {
    const element = screen.getByTestId(id);
    if (!element) throw new Error(`Element with data-testid="${id}" not found`);
    return element;
  };

  const getAllByTestIdOrFail = (id: string) => {
    const elements = screen.getAllByTestId(id);
    if (!elements.length) throw new Error(`No elements with data-testid="${id}" found`);
    return elements;
  };

  const queryAllByTestIdWithin = (container: HTMLElement, id: string) => {
    return within(container).queryAllByTestId(id);
  };

  return {
    ...result,
    getByTestIdOrFail,
    getAllByTestIdOrFail,
    queryAllByTestIdWithin,
  };
}

/**
 * Helper for testing components with specific variants
 */
export function testComponentVariants<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  variantProp: keyof T,
  variants: string[],
  expectedClassNames: Record<string, string[]>
) {
  // Use a single render with rerender to avoid multiple elements with same testId
  const firstVariant = variants[0];
  const props = { [variantProp]: firstVariant } as unknown as T;
  const { container, rerender } = render(
    <Component {...props} data-testid="test-component" />
  );

  // Test first variant
  let element = screen.getByTestId("test-component");
  expectedClassNames[firstVariant].forEach(className => {
    expect(element).toHaveClass(className);
  });

  // Test remaining variants
  for (let i = 1; i < variants.length; i++) {
    const variant = variants[i];
    const newProps = { [variantProp]: variant } as unknown as T;

    rerender(<Component {...newProps} data-testid="test-component" />);

    element = screen.getByTestId("test-component");
    expectedClassNames[variant].forEach(className => {
      expect(element).toHaveClass(className);
    });
  }
}

/**
 * Helper for testing components with specific sizes
 */
export function testComponentSizes<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  sizeProp: keyof T,
  sizes: string[],
  expectedClassNames: Record<string, string[]>
) {
  // Use a single render with rerender to avoid multiple elements with same testId
  const firstSize = sizes[0];
  const props = { [sizeProp]: firstSize } as unknown as T;
  const { container, rerender } = render(
    <Component {...props} data-testid="test-component" />
  );

  // Test first size
  let element = screen.getByTestId("test-component");
  expectedClassNames[firstSize].forEach(className => {
    expect(element).toHaveClass(className);
  });

  // Test remaining sizes
  for (let i = 1; i < sizes.length; i++) {
    const size = sizes[i];
    const newProps = { [sizeProp]: size } as unknown as T;

    rerender(<Component {...newProps} data-testid="test-component" />);

    element = screen.getByTestId("test-component");
    expectedClassNames[size].forEach(className => {
      expect(element).toHaveClass(className);
    });
  }
}

/**
 * Helper for testing component accessibility attributes
 */
export function testComponentA11y<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  props: T,
  expectedA11yProps: Record<string, string>
) {
  const { container } = render(<Component {...props} data-testid="test-component" />);
  const element = screen.getByTestId("test-component");

  Object.entries(expectedA11yProps).forEach(([prop, value]) => {
    expect(element).toHaveAttribute(prop, value);
  });
}

/**
 * Helper for testing component event handlers
 */
export function testComponentEvents<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  events: Array<{
    name: string;
    handlerProp: keyof T;
    action: (element: HTMLElement) => void;
  }>
) {
  // Test each event individually with unique test IDs
  events.forEach(({ name, handlerProp, action }) => {
    const handler = jest.fn();
    const props = { [handlerProp]: handler } as unknown as T;

    const { container } = render(
      <Component {...props} data-testid={`test-component-${name}`} />
    );

    const element = screen.getByTestId(`test-component-${name}`);

    // Perform the action
    action(element);

    // Check if the handler was called
    expect(handler).toHaveBeenCalledTimes(1);
  });
}

/**
 * Helper for testing form components
 */
export function testFormComponent<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  props: T,
  inputValue: string,
  expectedValue: string
) {
  const onChange = jest.fn();
  const { container } = render(
    <Component {...props} onChange={onChange} data-testid="test-input" />
  );

  const input = screen.getByTestId("test-input");
  fireEvent.change(input, { target: { value: inputValue } });

  expect(onChange).toHaveBeenCalled();
  expect(input).toHaveValue(expectedValue);
}

/**
 * Helper for testing component states (disabled, loading, error, etc.)
 */
export function testComponentStates<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  states: Array<{
    name: string;
    props: Partial<T>;
    expectedClassNames: string[];
    expectedAttributes?: Record<string, string>;
  }>
) {
  // Test each state individually with unique test IDs
  states.forEach(({ name, props, expectedClassNames, expectedAttributes }) => {
    const { container } = render(
      <Component {...props as T} data-testid={`test-component-${name}`} />
    );

    const element = screen.getByTestId(`test-component-${name}`);

    // Check for each expected class name
    expectedClassNames.forEach(className => {
      // Use a more flexible approach to check for class names
      const elementClasses = element.className.split(' ');
      const hasClass = elementClasses.some(cls => cls === className);
      expect(hasClass).toBe(true);
    });

    // Check for expected attributes
    if (expectedAttributes) {
      Object.entries(expectedAttributes).forEach(([attr, value]) => {
        expect(element).toHaveAttribute(attr, value);
      });
    }
  });
}

export * from '@/lib/test-utils';
